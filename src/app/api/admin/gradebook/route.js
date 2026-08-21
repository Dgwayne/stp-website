import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Read-only grades view for training coordinators: per-person per-module
// results with attempt counts, plus a most-missed-questions rollup computed
// from the stored responses of every graded attempt.
//
// Needs the service role for the same reason the roster does: emails live
// in auth.users, and questions.answer is service-role-only by design. The
// answer key never leaves this route; only aggregate miss counts do.
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

  return { db };
}

const same = (a = [], b = []) =>
  a.length === b.length && [...a].sort().every((v, i) => v === [...b].sort()[i]);

export async function GET(request) {
  const { db, failed } = await requireAdmin(request);
  if (failed) return failed;

  const [{ data: modules }, { data: profiles }, { data: assignments }, { data: attempts }, { data: questions }] =
    await Promise.all([
      db.from('modules').select('slug, title, pass_pct, sort_order').order('sort_order'),
      db.from('profiles').select('id, full_name, username, role'),
      db.from('assignments').select('user_id, module_slug, due_on, assigned_by'),
      db
        .from('attempts')
        .select('user_id, module_slug, score_pct, passed, submitted_at, responses')
        .not('submitted_at', 'is', null)
        .order('submitted_at', { ascending: true }),
      db.from('questions').select('id, module_slug, prompt, answer, sort_order'),
    ]);

  // Emails only for people who actually hold an assignment; no need to
  // page through every app customer the way the roster does.
  const inTraining = new Set((assignments ?? []).map((a) => a.user_id));

  const emailById = new Map();
  for (let page = 1; ; page += 1) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    for (const u of data.users) if (inTraining.has(u.id)) emailById.set(u.id, u.email ?? '');
    if (data.users.length < 1000) break;
  }

  const byId = new Map((profiles ?? []).map((p) => [p.id, p]));

  // ---- per-person per-module cells ----
  const cellsBy = new Map(); // user_id -> { slug -> cell }
  function cell(userId, slug) {
    if (!cellsBy.has(userId)) cellsBy.set(userId, {});
    const slot = cellsBy.get(userId);
    if (!slot[slug]) slot[slug] = { best: null, passed: false, attempts: 0, last_at: null, due_on: null };
    return slot[slug];
  }

  for (const a of assignments ?? []) {
    cell(a.user_id, a.module_slug).due_on = a.due_on;
  }
  for (const t of attempts ?? []) {
    const c = cell(t.user_id, t.module_slug);
    c.attempts += 1;
    c.last_at = t.submitted_at;
    const pct = Number(t.score_pct);
    if (c.best === null || pct > c.best) c.best = pct;
    if (t.passed) c.passed = true;
  }

  const people = [...inTraining].map((id) => {
    const p = byId.get(id);
    const mine = (assignments ?? []).filter((a) => a.user_id === id);
    return {
      id,
      name: p?.full_name ?? p?.username ?? '',
      email: emailById.get(id) ?? '',
      role: p?.role ?? 'trainee',
      cells: cellsBy.get(id) ?? {},
      assigned: mine.map((a) => a.module_slug),
      // Team members were assigned by an admin (or the create-trainee
      // script, which leaves assigned_by null). Self-enrolled public
      // trainees carry only their own id.
      team: mine.some((a) => a.assigned_by === null || a.assigned_by !== id),
      last_at: Object.values(cellsBy.get(id) ?? {}).reduce(
        (m, c) => (c.last_at && (!m || c.last_at > m) ? c.last_at : m),
        null,
      ),
    };
  });

  people.sort((a, b) => (a.name || a.email).localeCompare(b.name || b.email));

  // ---- most-missed questions ----
  // Every attempt stores the raw responses keyed by question id, so miss
  // rates come from history, not just from attempts made after this
  // endpoint existed. Questions added to the bank after an attempt simply
  // do not appear in that attempt's responses and are skipped.
  const stats = new Map(); // question id -> { answered, missed }
  const answerById = new Map((questions ?? []).map((q) => [q.id, q.answer]));

  for (const t of attempts ?? []) {
    const responses = t.responses ?? {};
    for (const [qid, picked] of Object.entries(responses)) {
      const answer = answerById.get(qid);
      if (!answer) continue; // question retired or renamed since
      if (!stats.has(qid)) stats.set(qid, { answered: 0, missed: 0 });
      const s = stats.get(qid);
      s.answered += 1;
      if (!same(picked, answer)) s.missed += 1;
    }
  }

  const promptById = new Map((questions ?? []).map((q) => [q.id, q]));
  const missed = [...stats.entries()]
    .filter(([, s]) => s.missed > 0)
    .map(([qid, s]) => ({
      id: qid,
      module_slug: promptById.get(qid)?.module_slug ?? '',
      prompt: promptById.get(qid)?.prompt ?? '',
      answered: s.answered,
      missed: s.missed,
    }))
    .sort((a, b) => b.missed - a.missed || b.missed / b.answered - a.missed / a.answered);

  return NextResponse.json({
    modules: modules ?? [],
    people,
    missed,
    attempts_total: (attempts ?? []).length,
  });
}
