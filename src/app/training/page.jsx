'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabaseClient';
import '../training.css';

export default function TrainingHome() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState('');
  const [rows, setRows] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/login');
        return;
      }

      const [{ data: profile }, { data: assignments }, { data: modules }, { data: attempts }] =
        await Promise.all([
          // username comes from the mobile app's signup; full_name is only
          // set for people added straight to training. Either will do.
          supabase.from('profiles').select('full_name, username').eq('id', user.id).single(),
          supabase.from('assignments').select('id, module_slug, due_on'),
          supabase.from('modules').select('slug, title, blurb, pass_pct, sort_order'),
          supabase
            .from('attempts')
            .select('module_slug, score_pct, passed, submitted_at')
            .not('submitted_at', 'is', null),
        ]);

      if (cancelled) return;

      setName(profile?.full_name ?? profile?.username ?? '');

      const byModule = new Map((modules ?? []).map((m) => [m.slug, m]));
      const best = new Map();
      for (const a of attempts ?? []) {
        const prev = best.get(a.module_slug);
        if (!prev || Number(a.score_pct) > Number(prev.score_pct)) best.set(a.module_slug, a);
      }

      const list = (assignments ?? [])
        .map((a) => ({
          ...a,
          module: byModule.get(a.module_slug),
          best: best.get(a.module_slug) ?? null,
        }))
        .filter((a) => a.module)
        .sort((a, b) => a.module.sort_order - b.module.sort_order);

      setRows(list);
    })();

    return () => { cancelled = true; };
  }, [router, supabase]);

  async function signOut() {
    await supabase.auth.signOut();
    router.replace('/login');
  }

  const done = rows?.filter((r) => r.best?.passed).length ?? 0;
  const total = rows?.length ?? 0;

  return (
    <main className="stp">
      <div className="stp__shell">
        <p className="stp__eyebrow">Spotter Tools Pro</p>
        <h1 className="stp__title">{name ? `Training — ${name}` : 'Training'}</h1>

        <code className="stp__vtec">
          /TRAINING.{String(done).padStart(4, '0')}.OF.{String(total).padStart(4, '0')}.MODULES.PASSED/
        </code>

        {rows === null && <p className="stp__lede">Loading your assignments.</p>}

        {rows?.length === 0 && (
          <div className="stp__card">
            <p className="stp__cardTitle">Nothing assigned yet</p>
            <p className="stp__cardMeta">
              Your training coordinator assigns modules. Check back after the next team meeting.
            </p>
          </div>
        )}

        {rows?.map((r) => {
          const overdue =
            r.due_on && !r.best?.passed && new Date(r.due_on) < new Date();

          return (
            <div key={r.id} className="stp__card">
              {r.best?.passed ? (
                <span className="stp__chip stp__chip--pass">Passed {Math.round(r.best.score_pct)}%</span>
              ) : r.best ? (
                <span className="stp__chip stp__chip--fail">Retake, best {Math.round(r.best.score_pct)}%</span>
              ) : overdue ? (
                <span className="stp__chip stp__chip--overdue">Overdue</span>
              ) : (
                <span className="stp__chip stp__chip--pending">Not started</span>
              )}

              <p className="stp__cardTitle">{r.module.title}</p>
              <p className="stp__cardMeta">
                {r.module.blurb}
                {r.due_on && `, due ${new Date(r.due_on).toLocaleDateString()}`}
                {`, pass at ${r.module.pass_pct}%`}
              </p>

              <div className="stp__cardActions">
                <Link className="stp__cardLink" href={`/training/${r.module_slug}/study`}>
                  Review material
                </Link>
                <Link className="stp__cardLink stp__cardLink--quiet" href={`/training/${r.module_slug}`}>
                  {r.best ? 'Retake test' : 'Take test'}
                </Link>
              </div>
            </div>
          );
        })}

        <div className="stp__actions">
          <button className="stp__btn stp__btn--ghost" onClick={signOut}>Sign out</button>
        </div>

        <p className="stp__note">
          Criteria in these modules reflect national NWS standards. Locally variable thresholds are
          flagged where they appear. Always defer to your local forecast office.
        </p>
      </div>
    </main>
  );
}
