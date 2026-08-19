// Lists accounts that have no training assigned yet.
//
// Anyone can create an account, and an account on its own grants nothing.
// This is how you find the people waiting on you to assign them something.
//
// Run:  node --env-file=.env.local scripts/pending-trainees.mjs
//
// Read-only. To actually grant access:
//   node --env-file=.env.local scripts/create-trainee.mjs <email> --assign-all
//
// Note that auth.users is shared with the mobile app, so this will also
// list app users who have never touched training. Recent sign-ups appear
// first, which is usually who you are looking for.
//
// Requires in .env.local:
//   NEXT_PUBLIC_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY

import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const limit = Number(process.argv.find((a) => a.startsWith('--limit='))?.split('=')[1] ?? 25);
const db = createClient(url, key, { auth: { persistSession: false } });

const users = [];
for (let page = 1; ; page += 1) {
  const { data, error } = await db.auth.admin.listUsers({ page, perPage: 1000 });
  if (error) { console.error(error.message); process.exit(1); }
  users.push(...data.users);
  if (data.users.length < 1000) break;
}

const [{ data: assignments }, { data: profiles }] = await Promise.all([
  db.from('assignments').select('user_id'),
  db.from('profiles').select('id, full_name, username, role'),
]);

const assigned = new Set((assignments ?? []).map((a) => a.user_id));
const byId = new Map((profiles ?? []).map((p) => [p.id, p]));

const waiting = users
  .filter((u) => !assigned.has(u.id))
  .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

// There is NO reliable way to tell a teammate from a paying app customer.
// auth.users is shared with the mobile app, and an earlier version of this
// script guessed using full_name, which was wrong: Google and Apple sign-in
// supply full_name too, so app customers looked like training sign-ups. The
// provider does not separate them either, since anyone can use email/password
// in the app. Assume you have to recognise your own people by name.
const line = (u) => {
  const p = byId.get(u.id);
  const name = p?.full_name ?? p?.username ?? '(no name)';
  const when = u.created_at?.slice(0, 10) ?? '';
  const via = u.app_metadata?.provider ?? '?';
  const flag = u.email_confirmed_at ? '' : '  [email not confirmed]';
  return `  ${when}  ${(u.email ?? '(no email)').padEnd(36)} ${name.padEnd(20)} ${via}${flag}`;
};

console.log(`${assigned.size} account(s) have training assigned.`);
console.log(`${waiting.length} account(s) do not. Most of these are app customers.\n`);

console.log('NO TRAINING ASSIGNED, NEWEST FIRST');
waiting.slice(0, limit).forEach((u) => console.log(line(u)));
if (waiting.length > limit) {
  console.log(`  ... and ${waiting.length - limit} more. Pass --limit=${waiting.length} to see all.`);
}

console.log('\nAssign someone with:');
console.log('  node --env-file=.env.local scripts/create-trainee.mjs <email> --assign-all');
console.log('or pick them out by name on /admin/training, which is usually easier.');
