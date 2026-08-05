// Grants someone access to training. There is no self-registration, so
// this is how people get in.
//
// Run:
//   node --env-file=.env.local scripts/create-trainee.mjs jane@example.com "Jane Doe" --assign-all
//
// IMPORTANT: auth.users is shared with the Spotter Tools Pro mobile app.
// If the address already has an app account, this reuses it and only adds
// the training bits — role and assignments. Their existing password is
// left alone, because changing it would lock them out of the app. Pass
// --reset-password only if you actually intend that.
//
// Options:
//   --assign-all          assign every module (default: assign nothing)
//   --due=YYYY-MM-DD      due date for those assignments
//   --admin               mark as admin, so they can see roster_progress
//   --password=SECRET     use this password instead of a generated one
//   --reset-password      allow overwriting an EXISTING user's password
//
// New accounts are created already confirmed, so they need no confirmation
// email and work whether or not SMTP is set up on the project.
//
// Requires in .env.local:
//   NEXT_PUBLIC_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY     <- server-only, never expose to the browser

import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'node:crypto';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const args = process.argv.slice(2);
const flags = new Map(
  args.filter((a) => a.startsWith('--')).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  }),
);
const [email, fullName] = args.filter((a) => !a.startsWith('--'));

if (!email) {
  console.error('Usage: create-trainee.mjs <email> "<full name>" [--assign-all] [--due=YYYY-MM-DD] [--admin]');
  process.exit(1);
}

const due = flags.get('due');
if (due && !/^\d{4}-\d{2}-\d{2}$/.test(due)) {
  console.error(`--due must be YYYY-MM-DD, got "${due}".`);
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });

// There is no getUserByEmail in the admin API, so page through.
async function findByEmail(target) {
  const wanted = target.toLowerCase();
  const perPage = 1000;
  for (let page = 1; ; page += 1) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage });
    if (error) {
      console.error(`Could not look up ${target}: ${error.message}`);
      process.exit(1);
    }
    const hit = data.users.find((u) => u.email?.toLowerCase() === wanted);
    if (hit) return hit;
    if (data.users.length < perPage) return null;
  }
}

const existing = await findByEmail(email);
let userId;
let password = null;

if (existing) {
  userId = existing.id;

  if (flags.has('reset-password')) {
    password = flags.get('password') ?? randomBytes(12).toString('base64url');
    const { error } = await db.auth.admin.updateUserById(userId, { password });
    if (error) {
      console.error(`Could not reset the password for ${email}: ${error.message}`);
      process.exit(1);
    }
  }
} else {
  password = flags.get('password') ?? randomBytes(12).toString('base64url');
  const { data: created, error: createError } = await db.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: fullName ? { full_name: fullName } : undefined,
  });

  if (createError) {
    console.error(`Could not create ${email}: ${createError.message}`);
    process.exit(1);
  }
  userId = created.user.id;
}

// upsert rather than update: covers accounts that predate the profile trigger.
const profilePatch = { id: userId, role: flags.has('admin') ? 'admin' : 'trainee' };
if (fullName) profilePatch.full_name = fullName;

const { error: profileError } = await db.from('profiles').upsert(profilePatch, { onConflict: 'id' });
if (profileError) {
  console.error(`Could not update the profile for ${email}: ${profileError.message}`);
  process.exit(1);
}

let assigned = 0;
if (flags.has('assign-all')) {
  const { data: modules, error: modError } = await db.from('modules').select('slug');
  if (modError) {
    console.error(`Could not read modules: ${modError.message}`);
    process.exit(1);
  }
  if (!modules?.length) {
    console.error('No modules exist yet. Run seed-questions.mjs first.');
    process.exit(1);
  }

  const rows = modules.map((m) => ({
    user_id: userId,
    module_slug: m.slug,
    due_on: due ?? null,
  }));

  const { error: assignError } = await db
    .from('assignments')
    .upsert(rows, { onConflict: 'user_id,module_slug' });

  if (assignError) {
    console.error(`Could not assign modules to ${email}: ${assignError.message}`);
    process.exit(1);
  }
  assigned = rows.length;
}

console.log(`${existing ? 'Updated' : 'Created'} ${email}${fullName ? ` (${fullName})` : ''}`);
console.log(`  role       ${profilePatch.role}`);
console.log(`  assigned   ${assigned} module(s)${due ? `, due ${due}` : ''}`);

if (password) {
  console.log(`  password   ${password}`);
  console.log('\nHand that password over directly. It is not stored anywhere and is not recoverable.');
} else if (existing) {
  console.log('  password   unchanged — they sign in with their existing Spotter Tools Pro login');
}
