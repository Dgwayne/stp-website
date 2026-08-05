import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Grading runs here, never in the browser. The service role key
// is the only thing that can read the `questions.answer` column.
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

const same = (a = [], b = []) =>
  a.length === b.length && [...a].sort().every((v, i) => v === [...b].sort()[i]);

export async function POST(request) {
  const admin = adminClient();

  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  }

  const { data: { user }, error: authError } = await admin.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  }

  const { moduleSlug, responses } = await request.json();
  if (!moduleSlug || typeof responses !== 'object') {
    return NextResponse.json({ error: 'Missing module or responses' }, { status: 400 });
  }

  const [{ data: module }, { data: questions }, { data: assignment }] = await Promise.all([
    admin.from('modules').select('pass_pct').eq('slug', moduleSlug).single(),
    admin.from('questions').select('id, answer, explanation').eq('module_slug', moduleSlug),
    admin.from('assignments').select('id').eq('user_id', user.id).eq('module_slug', moduleSlug).maybeSingle(),
  ]);

  if (!module || !questions?.length) {
    return NextResponse.json({ error: 'Module not found' }, { status: 404 });
  }

  const review = {};
  let correctCount = 0;

  for (const q of questions) {
    const picked = responses[q.id] ?? [];
    const correct = same(picked, q.answer);
    if (correct) correctCount += 1;
    review[q.id] = { correct, answer: q.answer, explanation: q.explanation };
  }

  const total = questions.length;
  const scorePct = Number(((correctCount / total) * 100).toFixed(2));
  const passed = scorePct >= module.pass_pct;

  const { error: insertError } = await admin.from('attempts').insert({
    user_id: user.id,
    module_slug: moduleSlug,
    assignment_id: assignment?.id ?? null,
    submitted_at: new Date().toISOString(),
    score_pct: scorePct,
    correct_count: correctCount,
    total_count: total,
    passed,
    responses,
  });

  if (insertError) {
    return NextResponse.json({ error: 'Could not record attempt' }, { status: 500 });
  }

  return NextResponse.json({
    score_pct: scorePct,
    correct_count: correctCount,
    total_count: total,
    passed,
    review,
  });
}
