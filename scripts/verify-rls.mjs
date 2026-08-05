// Verifies the answer-key invariant with the ANON key:
//   - `questions` must return no rows (RLS on, zero policies)
//   - `questions_public` must return rows to a signed-in user
//
// Run:  node --env-file=.env.local scripts/verify-rls.mjs
//
// Requires:
//   NEXT_PUBLIC_SUPABASE_URL
//   NEXT_PUBLIC_SUPABASE_ANON_KEY
// Optional, to cover the signed-in half:
//   TEST_EMAIL / TEST_PASSWORD    an existing trainee login
//
// Two things are correct-but-surprising here, so they are not failures:
//   - questions_public is granted to `authenticated` only, so an
//     unauthenticated anon caller is denied there rather than getting rows.
//   - the view is scoped to the caller's assignments, so a signed-in user
//     with nothing assigned sees zero rows.

import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anon) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  process.exit(1);
}

if (/SERVICE_ROLE/i.test(anon) || anon === process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Refusing to run: the anon slot is holding the service role key.');
  process.exit(1);
}

const db = createClient(url, anon, { auth: { persistSession: false } });
let failed = false;

function report(label, ok, detail) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failed = true;
}

// ---------- unauthenticated ----------
{
  const { data, error } = await db.from('questions').select('id, answer');
  const leaked = data?.length ?? 0;
  report(
    'anon cannot read `questions`',
    leaked === 0,
    error ? `blocked: ${error.message}` : `${leaked} row(s) returned`,
  );
}

// ---------- signed in ----------
const email = process.env.TEST_EMAIL;
const password = process.env.TEST_PASSWORD;

if (!email || !password) {
  console.log('SKIP  signed-in checks — set TEST_EMAIL and TEST_PASSWORD to include them');
} else {
  const { error: authError } = await db.auth.signInWithPassword({ email, password });

  if (authError) {
    report('sign in as trainee', false, authError.message);
  } else {
    const { data: mine } = await db.from('assignments').select('module_slug');
    const assigned = new Set((mine ?? []).map((m) => m.module_slug));

    const { data: pub, error: pubError } = await db
      .from('questions_public')
      .select('id, module_slug, prompt, options');

    const got = pub?.length ?? 0;

    if (assigned.size === 0) {
      report(
        '`questions_public` withholds the bank from an unassigned user',
        !pubError && got === 0,
        `nothing assigned, ${got} row(s) returned`,
      );
    } else {
      report(
        'authenticated CAN read assigned `questions_public`',
        !pubError && got > 0,
        pubError ? pubError.message : `${got} row(s) across ${assigned.size} module(s)`,
      );
      report(
        '`questions_public` shows only assigned modules',
        !pub?.some((r) => !assigned.has(r.module_slug)),
      );
    }

    const exposed = pub?.some((r) => 'answer' in r || 'explanation' in r);
    report('`questions_public` omits answer and explanation', !exposed);

    const { data: raw, error: rawError } = await db.from('questions').select('id, answer');
    const leaked = raw?.length ?? 0;
    report(
      'authenticated still cannot read `questions`',
      leaked === 0,
      rawError ? `blocked: ${rawError.message}` : `${leaked} row(s) returned`,
    );

    await db.auth.signOut();
  }
}

console.log(failed ? '\nAnswer keys are reachable. Do not deploy.' : '\nAnswer keys are sealed.');
process.exit(failed ? 1 : 0);
