'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabaseClient';
import TrainingSignIn from '@/components/TrainingSignIn';
import { ICONS, moduleMeta } from '@/components/trainingMeta';
import '../training.css';

const RING_R = 26;
const RING_C = 2 * Math.PI * RING_R;

export default function TrainingHome() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [rows, setRows] = useState(null);
  // null while we are still checking, then true or false.
  const [authed, setAuthed] = useState(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Show the sign-in form here rather than redirecting, so the
        // address people are given stays /training throughout.
        if (!cancelled) setAuthed(false);
        return;
      }
      if (!cancelled) setAuthed(true);

      const [{ data: profile }, { data: assignments }, { data: modules }, { data: attempts }] =
        await Promise.all([
          // username comes from the mobile app's signup; full_name is only
          // set for people added straight to training. Either will do.
          supabase.from('profiles').select('full_name, username, role').eq('id', user.id).single(),
          // Filter by user_id explicitly. RLS is not enough here: admins
          // have policies letting them read everyone's assignments and
          // attempts, so an unfiltered query put the whole team's rows on
          // one person's dashboard and credited them with other people's
          // passes.
          supabase.from('assignments').select('id, module_slug, due_on').eq('user_id', user.id),
          supabase.from('modules').select('slug, title, blurb, pass_pct, sort_order'),
          supabase
            .from('attempts')
            .select('module_slug, score_pct, passed, submitted_at')
            .eq('user_id', user.id)
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
  }, [router, supabase, reload]);

  async function signOut() {
    await supabase.auth.signOut();
    setRows(null);
    setAuthed(false);
  }

  const done = rows?.filter((r) => r.best?.passed).length ?? 0;
  const total = rows?.length ?? 0;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const next = rows?.find((r) => !r.best?.passed) ?? null;

  if (authed === null) {
    return <main className="stp"><div className="stp__shell"><p className="stp__lede">Loading.</p></div></main>;
  }

  if (authed === false) {
    return (
      <main className="stp">
        <div className="stp__shell">
          <TrainingSignIn onSignedIn={() => { setAuthed(null); setReload((r) => r + 1); }} />
        </div>
      </main>
    );
  }

  return (
    <main className="stp">
      <div className="stp__shell">
        <div className="stp__topbar">
          <p className="stp__eyebrow">Spotter Tools Pro</p>
          <div className="stp__topActions">
            {isAdmin && (
              <Link className="stp__linkBtn" href="/admin/training">Manage roster</Link>
            )}
            <button className="stp__linkBtn" type="button" onClick={signOut}>Sign out</button>
          </div>
        </div>

        <h1 className="stp__title">{name ? `Training for ${name}` : 'Training'}</h1>

        {total > 0 && (
          <div className="stp__progress">
            <svg className="stp__ring" width="64" height="64" viewBox="0 0 64 64" role="img"
              aria-label={`${done} of ${total} modules passed`}>
              <circle className="stp__ringTrack" cx="32" cy="32" r={RING_R} fill="none" strokeWidth="6" />
              <circle
                className="stp__ringFill"
                cx="32" cy="32" r={RING_R} fill="none" strokeWidth="6" strokeLinecap="round"
                strokeDasharray={RING_C}
                strokeDashoffset={RING_C * (1 - pct / 100)}
                transform="rotate(-90 32 32)"
              />
              <text className="stp__ringText" x="32" y="36" textAnchor="middle">{pct}%</text>
            </svg>
            <div className="stp__progressBody">
              <p className="stp__progressHead">{done} of {total} modules passed</p>
              <p className="stp__progressSub">
                {next
                  ? <>Work through them in order. Next up: <strong>{next.module.title}</strong>. Read the training before taking the test.</>
                  : 'All assigned modules passed. Retake any test whenever you want a refresher.'}
              </p>
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

        {rows?.map((r) => {
          const overdue = r.due_on && !r.best?.passed && new Date(r.due_on) < new Date();
          const blurb = (r.module.blurb ?? '').replace(/\.\s*$/, '');
          const meta = moduleMeta(r.module_slug);
          const passed = r.best?.passed;
          const isNext = next && next.id === r.id;

          const state = passed
            ? { cls: 'stp__modState--pass', label: `Passed ${Math.round(r.best.score_pct)}%` }
            : overdue
              ? { cls: 'stp__modState--due', label: 'Overdue' }
              : r.best
                ? { cls: 'stp__modState--try', label: `Best ${Math.round(r.best.score_pct)}%` }
                : { cls: 'stp__modState--new', label: 'Not started' };

          return (
            <div
              key={r.id}
              className={`stp__mod${passed ? ' stp__mod--done' : ''}${isNext ? ' stp__mod--next' : ''}`}
              style={{ '--accent': meta.accent }}
            >
              <div className="stp__modHead">
                <div className="stp__modIcon">{ICONS[meta.icon]}</div>
                <div>
                  <p className="stp__modTitle">{r.module.title}</p>
                  <p className="stp__modBlurb">{blurb}.</p>
                </div>
                <span className={`stp__modState ${state.cls}`}>{state.label}</span>
              </div>

              <div className="stp__modFoot">
                <span className="stp__modFacts">
                  {passed
                    ? 'Done. Retake any time.'
                    : r.best
                      ? `Needs ${r.module.pass_pct}% to pass`
                      : `Pass at ${r.module.pass_pct}%`}
                  {r.due_on && !passed && (overdue
                    ? `. Was due ${new Date(r.due_on).toLocaleDateString()}`
                    : `. Due ${new Date(r.due_on).toLocaleDateString()}`)}
                </span>
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

        <p className="stp__note">
          These modules cover national NWS criteria. Thresholds that your local forecast office sets
          for itself are flagged where they come up. Always defer to your local office.
        </p>
      </div>
    </main>
  );
}
