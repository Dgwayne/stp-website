import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Roster management for training coordinators.
//
// Everything here needs the service role: auth.users is not reachable
// through PostgREST, so emails can only be read admin-side. That makes
// the authorisation check the important part of this file. The caller's
// own token is verified, then their profiles.role is checked. Holding a
// session is not enough; you have to be an admin.
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

async function requireAdmin(request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return { failed: NextResponse.json({ error: 'Not signed in' }, { status: 401 }) };

  const db = adminClient();
  const { data: { user }, error } = await db.auth.getUser(token);
  if (error || !user) {
    return { failed: NextResponse.json({ error: 'Not signed in' }, { status: 401 }) };
  }

  const { data: profile } = await db.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') {
    return { failed: NextResponse.json({ error: 'Not an admin' }, { status: 403 }) };
  }

  return { db, user };
}

async function listAllUsers(db) {
  const users = [];
  for (let page = 1; ; page += 1) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw new Error(error.message);
    users.push(...data.users);
    if (data.users.length < 1000) break;
  }
  return users;
}

export async function GET(request) {
  const { db, failed } = await requireAdmin(request);
  if (failed) return failed;

  let users;
  try {
    users = await listAllUsers(db);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }

  const [{ data: modules }, { data: profiles }, { data: assignments }, { data: attempts }] =
    await Promise.all([
      db.from('modules').select('slug, title, pass_pct, sort_order').order('sort_order'),
      db.from('profiles').select('id, full_name, username, role'),
      db.from('assignments').select('user_id, module_slug, due_on'),
      db.from('attempts').select('user_id, module_slug, score_pct, passed').not('submitted_at', 'is', null),
    ]);

  const byId = new Map((profiles ?? []).map((p) => [p.id, p]));

  const assignedBy = new Map();
  for (const a of assignments ?? []) {
    if (!assignedBy.has(a.user_id)) assignedBy.set(a.user_id, []);
    assignedBy.get(a.user_id).push(a.module_slug);
  }

  // Best score per person per module, which is what counts as passing.
  const bestBy = new Map();
  for (const t of attempts ?? []) {
    if (!bestBy.has(t.user_id)) bestBy.set(t.user_id, {});
    const slot = bestBy.get(t.user_id);
    const prev = slot[t.module_slug];
    if (!prev || Number(t.score_pct) > Number(prev.score_pct)) {
      slot[t.module_slug] = { score_pct: Number(t.score_pct), passed: t.passed };
    }
  }

  const people = users.map((u) => {
    const p = byId.get(u.id);
    return {
      id: u.id,
      email: u.email ?? '',
      name: p?.full_name ?? p?.username ?? '',
      role: p?.role ?? 'trainee',
      created_at: u.created_at ?? null,
      assigned: assignedBy.get(u.id) ?? [],
      best: bestBy.get(u.id) ?? {},
    };
  });

  // People already in training first, then most recent sign-ups.
  people.sort((a, b) => {
    if (!!b.assigned.length !== !!a.assigned.length) return b.assigned.length - a.assigned.length;
    return (b.created_at ?? '') < (a.created_at ?? '') ? -1 : 1;
  });

  return NextResponse.json({ modules: modules ?? [], people });
}

// Replaces someone's assignments with exactly the set given.
export async function POST(request) {
  const { db, user, failed } = await requireAdmin(request);
  if (failed) return failed;

  const { userId, moduleSlugs } = await request.json();
  if (!userId || !Array.isArray(moduleSlugs)) {
    return NextResponse.json({ error: 'Missing userId or moduleSlugs' }, { status: 400 });
  }

  const { data: valid } = await db.from('modules').select('slug');
  const known = new Set((valid ?? []).map((m) => m.slug));
  const wanted = moduleSlugs.filter((s) => known.has(s));

  // Remove what is no longer wanted. Attempt history is not touched:
  // attempts.assignment_id is ON DELETE SET NULL, so scores survive an
  // unassign and come back if the module is assigned again.
  const remove = db.from('assignments').delete().eq('user_id', userId);
  const { error: delError } = wanted.length
    ? await remove.not('module_slug', 'in', `(${wanted.join(',')})`)
    : await remove;

  if (delError) return NextResponse.json({ error: delError.message }, { status: 500 });

  if (wanted.length) {
    const rows = wanted.map((slug) => ({
      user_id: userId,
      module_slug: slug,
      assigned_by: user.id,
    }));
    const { error: upError } = await db
      .from('assignments')
      .upsert(rows, { onConflict: 'user_id,module_slug', ignoreDuplicates: true });
    if (upError) return NextResponse.json({ error: upError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, assigned: wanted.length });
}
