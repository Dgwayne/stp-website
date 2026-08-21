import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Self-enrollment for the public training funnel: any signed-in account
// can assign itself every module that is not team_only. Self-enrolled
// rows carry assigned_by = the user's own id, which is what separates
// "public trainee" from "storm team member" on the roster and gradebook
// (team rows carry an admin's id, or null from the create-trainee
// script). Idempotent: re-enrolling never duplicates or resets anything,
// and never touches assignments an admin already made.
//
// Built per request rather than at module scope: Next evaluates route
// modules while collecting page data at build time, where the service
// role key is absent, and createClient throws on an empty url.
function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } },
  );
}

export async function POST(request) {
  const db = adminClient();

  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  }

  const { data: { user }, error: authError } = await db.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  }

  const { data: modules, error: modError } = await db
    .from('modules')
    .select('slug')
    .eq('team_only', false);

  if (modError || !modules?.length) {
    return NextResponse.json({ error: 'No open modules' }, { status: 500 });
  }

  const rows = modules.map((m) => ({
    user_id: user.id,
    module_slug: m.slug,
    assigned_by: user.id,
  }));

  const { error: upError } = await db
    .from('assignments')
    .upsert(rows, { onConflict: 'user_id,module_slug', ignoreDuplicates: true });

  if (upError) {
    return NextResponse.json({ error: 'Could not enroll' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, enrolled: rows.length });
}
