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
  const [isAdmin, setIsAdmin] = useState(false);
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
          supabase.from('profiles').select('full_name, username, role').eq('id', user.id).single(),
          supabase.from('assignments').select('id, module_slug, due_on'),
          supabase.from('modules').select('slug, title, blurb, pass_pct, sort_order'),
          supabase
            .from('attempts')
            .select('module_slug, score_pct, passed, submitted_at')
            .not('submitted_at', 'is', null),
        ]);

      if (cancelled) return;

      setName(profile?.full_name ?? profile?.username ?? '');
      setIsAdmin(profile?.role === 'admin');

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
  const pct = total ? Math.round((done / total) * 100) : 0;
  const next = rows?.find((r) => !r.best?.passed) ?? null;

  return (
    <main className="stp">
      <div className="stp__shell">
        <p className="stp__eyebrow">Spotter Tools Pro</p>
        <h1 className="stp__title">{name ? `Training for ${name}` : 'Training'}</h1>

        {total > 0 && (
          <div className="stp__progress">
            <div className="stp__progressHead">
              <span>{done} of {total} modules passed</span>
              <span className="stp__progressPct">{pct}%</span>
            </div>
            <div className="stp__progressBar">
              <div className="stp__progressFill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        {rows === null && <p className="stp__lede">Loading your assignments.</p>}

        {rows?.length === 0 && (
          <div className="stp__card">
            <p className="stp__cardTitle">Nothing assigned yet</p>
            <p className="stp__cardMeta">
              Your training coordinator assigns modules. Check back after the next team meeting.
            </p>
          </div>
        )}

        {next && (
          <p className="stp__lede">
            Work through them in order. Start with <strong>{next.module.title}</strong>, and read the
            training before taking the test.
          </p>
        )}

        {rows?.map((r, i) => {
          const overdue = r.due_on && !r.best?.passed && new Date(r.due_on) < new Date();
          const blurb = (r.module.blurb ?? '').replace(/\.\s*$/, '');

          return (
            <div key={r.id} className={`stp__card${r.best?.passed ? ' stp__card--done' : ''}`}>
              <div className="stp__cardHead">
                <span className="stp__num">{String(i + 1).padStart(2, '0')}</span>
                <p className="stp__cardTitle">{r.module.title}</p>
              </div>

              <p className="stp__cardMeta">{blurb}.</p>

              <p className="stp__cardFacts">
                {r.best?.passed
                  ? `Passed with ${Math.round(r.best.score_pct)}%`
                  : r.best
                    ? `Best so far ${Math.round(r.best.score_pct)}%, needs ${r.module.pass_pct}%`
                    : `Pass at ${r.module.pass_pct}%`}
                {r.due_on && (overdue
                  ? `. Overdue, was due ${new Date(r.due_on).toLocaleDateString()}`
                  : `. Due ${new Date(r.due_on).toLocaleDateString()}`)}
              </p>

              <div className="stp__cardActions">
                <Link className="stp__cardBtn" href={`/training/${r.module_slug}/study`}>
                  Training
                </Link>
                <Link className="stp__cardBtn stp__cardBtn--test" href={`/training/${r.module_slug}`}>
                  {r.best ? 'Retake test' : 'Test'}
                </Link>
              </div>
            </div>
          );
        })}

        <div className="stp__actions">
          {isAdmin && (
            <Link className="stp__btn" href="/admin/training">Manage roster</Link>
          )}
          <button className="stp__btn stp__btn--ghost" onClick={signOut}>Sign out</button>
        </div>

        <p className="stp__note">
          These modules cover national NWS criteria. Thresholds that your local forecast office sets
          for itself are flagged where they come up. Always defer to your local office.
        </p>
      </div>
    </main>
  );
}
