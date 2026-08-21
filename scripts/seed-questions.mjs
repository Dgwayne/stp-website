// Loads nws-question-bank.json into Supabase.
// Run:  node --env-file=.env.local scripts/seed-questions.mjs
//
// The bank lives next to this script, not at the repo root.
//
// Requires in .env.local (or your shell):
//   NEXT_PUBLIC_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY     <- server-only, never expose to the browser
//
// Safe to re-run: upserts by primary key, so editing a question and
// re-seeding updates it in place without wiping attempt history.

import { createClient } from '@supabase/supabase-js';
import { readFile } from 'node:fs/promises';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });
const bank = JSON.parse(await readFile(new URL('./nws-question-bank.json', import.meta.url)));

const modules = bank.modules.map((m, i) => ({
  slug: m.slug,
  title: m.title,
  blurb: m.blurb,
  pass_pct: m.pass_pct,
  sort_order: i,
  bank_version: bank.bank_version,
  // Self-enrollment (POST /api/enroll) assigns every module except these.
  team_only: m.team_only ?? false,
}));

const questions = bank.modules.flatMap((m) =>
  m.questions.map((q, i) => ({
    id: q.id,
    module_slug: m.slug,
    type: q.type,
    prompt: q.prompt,
    options: q.options,
    answer: q.answer,
    explanation: q.explanation,
    sort_order: i,
  })),
);

const { error: modErr } = await db.from('modules').upsert(modules, { onConflict: 'slug' });
if (modErr) throw modErr;

const { error: qErr } = await db.from('questions').upsert(questions, { onConflict: 'id' });
if (qErr) throw qErr;

console.log(`Seeded ${modules.length} modules and ${questions.length} questions.`);
console.log(`Bank version ${bank.bank_version}. Review by ${bank.review_by}.`);
