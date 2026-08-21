'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabaseClient';
import TrainingSignIn from '@/components/TrainingSignIn';
import { ICONS, moduleMeta } from '@/components/trainingMeta';
import '../../../training.css';

// The coordinator's grades view: one row per person, one column per
// module, and a most-missed-questions rollup underneath. Assigning
// happens on the roster page; this page is for reading.
export default function GradebookPage() {
  const supabase = createClient();

  const [state, setState] = useState('loading'); // loading | ok | denied | signedout
  const [reload, setReload] = useState(0);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [view, setView] = useState('team'); // 'team' | 'public'

  const token = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  }, [supabase]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (!cancelled) setState('signedout');
        return;
      }

      const res = await fetch('/api/admin/gradebook', {
        headers: { Authorization: `Bearer ${await token()}` },
      });

      if (cancelled) return;

      if (res.status === 403) { setState('denied'); return; }
      if (!res.ok) { setError('Could not load the gradebook.'); setState('ok'); return; }

      setData(await res.json());
      setState('ok');
    })();

    return () => { cancelled = true; };
  }, [supabase, token, reload]);

  async function signOut() {
    await supabase.auth.signOut();
    setData(null);
    setState('signedout');
  }

  if (state === 'loading') {
    return <main className="stp"><div className="stp__shell"><p className="stp__lede">Loading the gradebook.</p></div></main>;
  }

  if (state === 'signedout') {
    return (
      <main className="stp">
        <div className="stp__shell">
          <TrainingSignIn onSignedIn={() => { setState('loading'); setReload((r) => r + 1); }} />
        </div>
      </main>
    );
  }

  if (state === 'denied') {
    return (
      <main className="stp">
        <div className="stp__shell">
          <h1 className="stp__title">Not an admin</h1>
          <p className="stp__lede">This page is for training coordinators. Your account is not one.</p>
          <Link className="stp__btn" href="/training">Back to training</Link>
        </div>
      </main>
    );
  }

  const modules = data?.modules ?? [];
  const allPeople = data?.people ?? [];
  const missed = data?.missed ?? [];

  const teamPeople = allPeople.filter((p) => p.team);
  const publicPeople = allPeople.filter((p) => !p.team);
  const people = view === 'team' ? teamPeople : publicPeople;

  const totalAssigned = people.reduce((n, p) => n + p.assigned.length, 0);
  const totalPassed = people.reduce(
    (n, p) => n + Object.values(p.cells).filter((c) => c.passed).length,
    0,
  );
  const moduleIndex = new Map(modules.map((m, i) => [m.slug, i + 1]));

  function fmtDate(iso) {
    return iso ? new Date(iso).toLocaleDateString() : null;
  }

  return (
    <main className="stp">
      <div className="stp__shell stp__shell--wide">
        <div className="stp__topbar">
          <p className="stp__eyebrow">Spotter Tools Pro</p>
          <div className="stp__topActions">
            <Link className="stp__linkBtn" href="/admin/training">Roster</Link>
            <Link className="stp__linkBtn" href="/training">My training</Link>
            <button className="stp__linkBtn" type="button" onClick={signOut}>Sign out</button>
          </div>
        </div>

        <h1 className="stp__title">Gradebook</h1>
        <p className="stp__lede">
          {people.length} {people.length === 1 ? 'person' : 'people'} shown, {totalPassed} of{' '}
          {totalAssigned} assigned modules passed, {data?.attempts_total ?? 0} test attempts recorded
          overall.
        </p>

        <div className="stp__cardActions" style={{ marginBottom: '1rem' }}>
          <button
            className={`stp__pick${view === 'team' ? ' stp__pick--on' : ''}`}
            type="button"
            onClick={() => setView('team')}
          >
            My team ({teamPeople.length})
          </button>
          <button
            className={`stp__pick${view === 'public' ? ' stp__pick--on' : ''}`}
            type="button"
            onClick={() => setView('public')}
          >
            Public trainees ({publicPeople.length})
          </button>
        </div>

        {error && <p className="stp__error">{error}</p>}

        {people.length === 0 && (
          <div className="stp__card">
            <p className="stp__cardMeta">
              {view === 'team'
                ? 'Nobody on the team is assigned any training yet. Assign modules on the roster page.'
                : 'No public trainees yet. Anyone who signs in and taps Start free training will appear here.'}
            </p>
          </div>
        )}

        {people.length > 0 && (
          <div className="stp__gbWrap">
            <table className="stp__gb">
              <thead>
                <tr>
                  <th className="stp__gbName">Person</th>
                  {modules.map((m, i) => {
                    const meta = moduleMeta(m.slug);
                    return (
                      <th key={m.slug} title={`${m.title} (pass at ${m.pass_pct}%)`}>
                        <span className="stp__gbModIcon" style={{ color: meta.accent }}>{ICONS[meta.icon]}</span>
                        <span className="stp__gbModNum">{String(i + 1).padStart(2, '0')}</span>
                      </th>
                    );
                  })}
                  <th className="stp__gbLast">Last activity</th>
                </tr>
              </thead>
              <tbody>
                {people.map((p) => (
                  <tr key={p.id}>
                    <td className="stp__gbName">
                      <span className="stp__gbPerson">{p.name || p.email || '(no name)'}</span>
                      {p.name && p.email && <span className="stp__gbEmail">{p.email}</span>}
                    </td>
                    {modules.map((m) => {
                      const c = p.cells[m.slug];
                      const assigned = p.assigned.includes(m.slug);
                      if (!assigned && !c?.attempts) {
                        return <td key={m.slug} className="stp__gbCell stp__gbCell--na">&mdash;</td>;
                      }
                      const overdue = c?.due_on && !c.passed && new Date(c.due_on) < new Date();
                      const cls = c?.passed
                        ? 'stp__gbCell--pass'
                        : c?.attempts
                          ? 'stp__gbCell--try'
                          : overdue
                            ? 'stp__gbCell--overdue'
                            : 'stp__gbCell--todo';
                      const tip = [
                        c?.attempts ? `${c.attempts} attempt${c.attempts === 1 ? '' : 's'}` : 'No attempts',
                        c?.last_at ? `last ${fmtDate(c.last_at)}` : null,
                        c?.due_on ? `due ${fmtDate(c.due_on)}` : null,
                      ].filter(Boolean).join(', ');
                      return (
                        <td key={m.slug} className={`stp__gbCell ${cls}`} title={tip}>
                          {c?.best !== null && c?.best !== undefined ? (
                            <>
                              <span className="stp__gbScore">{Math.round(c.best)}%</span>
                              {c.attempts > 1 && <span className="stp__gbTries">x{c.attempts}</span>}
                            </>
                          ) : (
                            <span className="stp__gbScore stp__gbScore--none">{overdue ? 'overdue' : 'not yet'}</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="stp__gbLast">{fmtDate(p.last_at) ?? <>&mdash;</>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {people.length > 0 && (
          <div className="stp__gbLegend">
            <span><i className="stp__gbDot stp__gbDot--pass" /> Passed (best score)</span>
            <span><i className="stp__gbDot stp__gbDot--try" /> Attempted, below pass mark</span>
            <span><i className="stp__gbDot stp__gbDot--overdue" /> Overdue, no attempt</span>
            <span><i className="stp__gbDot stp__gbDot--todo" /> Assigned, no attempt</span>
          </div>
        )}

        {missed.length > 0 && (
          <section className="study__section" style={{ marginTop: '2.2rem' }}>
            <h2 className="study__h2" style={{ '--accent': 'var(--signal)' }}>Most-missed questions</h2>
            <p className="stp__lede" style={{ marginBottom: '0.9rem' }}>
              Computed from every recorded attempt. Cover these at the next team meeting.
            </p>
            <div className="stp__gbMissed">
              {missed.slice(0, 15).map((q) => {
                const meta = moduleMeta(q.module_slug);
                return (
                  <div className="stp__gbMiss" key={q.id}>
                    <span className="stp__gbMissMod" style={{ color: meta.accent, borderColor: meta.accent }}>
                      {String(moduleIndex.get(q.module_slug) ?? '?').padStart(2, '0')}
                    </span>
                    <span className="stp__gbMissPrompt">{q.prompt}</span>
                    <span className="stp__gbMissCount">
                      missed {q.missed} of {q.answered}
                    </span>
                  </div>
                );
              })}
            </div>
            {missed.length > 15 && (
              <p className="stp__note" style={{ marginTop: '0.8rem', borderTop: 'none', paddingTop: 0 }}>
                Showing the top 15 of {missed.length} questions with at least one miss.
              </p>
            )}
          </section>
        )}

        {missed.length === 0 && people.length > 0 && (
          <p className="stp__note">No missed questions recorded yet. As the team takes tests, the questions they get wrong will collect here.</p>
        )}
      </div>
    </main>
  );
}
