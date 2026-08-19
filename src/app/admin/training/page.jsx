'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabaseClient';
import '../../training.css';

// Coordinator view: everyone who has an account, what they are assigned,
// and how they are doing. The list includes mobile app customers, because
// auth.users is shared with the app, so people already in training sort to
// the top and the rest sit behind a filter.
export default function AdminTrainingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [state, setState] = useState('loading'); // loading | ok | denied
  const [modules, setModules] = useState([]);
  const [people, setPeople] = useState([]);
  const [query, setQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [saving, setSaving] = useState(null);
  const [error, setError] = useState('');

  const token = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  }, [supabase]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/training'); return; }

      const res = await fetch('/api/admin/roster', {
        headers: { Authorization: `Bearer ${await token()}` },
      });

      if (cancelled) return;

      if (res.status === 403) { setState('denied'); return; }
      if (!res.ok) { setError('Could not load the roster.'); setState('ok'); return; }

      const data = await res.json();
      setModules(data.modules);
      setPeople(data.people);
      setState('ok');
    })();

    return () => { cancelled = true; };
  }, [router, supabase, token]);

  async function save(person, slugs) {
    setSaving(person.id);
    setError('');

    // Optimistic: the row updates immediately and rolls back on failure.
    const before = person.assigned;
    setPeople((prev) => prev.map((p) => (p.id === person.id ? { ...p, assigned: slugs } : p)));

    const res = await fetch('/api/admin/roster', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await token()}`,
      },
      body: JSON.stringify({ userId: person.id, moduleSlugs: slugs }),
    });

    setSaving(null);

    if (!res.ok) {
      setPeople((prev) => prev.map((p) => (p.id === person.id ? { ...p, assigned: before } : p)));
      setError(`Could not update ${person.email}. Nothing was changed.`);
    }
  }

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return people.filter((p) => {
      if (!showAll && !p.assigned.length && !q) return false;
      if (!q) return true;
      return p.email.toLowerCase().includes(q) || p.name.toLowerCase().includes(q);
    });
  }, [people, query, showAll]);

  const inTraining = people.filter((p) => p.assigned.length).length;

  if (state === 'loading') {
    return <main className="stp"><div className="stp__shell"><p className="stp__lede">Loading the roster.</p></div></main>;
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

  return (
    <main className="stp">
      <div className="stp__shell">
        <p className="stp__eyebrow">Spotter Tools Pro</p>
        <h1 className="stp__title">Training roster</h1>
        <p className="stp__lede">
          {inTraining} of {people.length} accounts are in training. The rest are app users who have
          not been assigned anything.
        </p>

        <input
          className="stp__input"
          placeholder="Search by name or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="stp__cardActions">
          <button
            className={`stp__pick${showAll ? ' stp__pick--on' : ''}`}
            onClick={() => setShowAll((v) => !v)}
            type="button"
          >
            {showAll ? 'Showing everyone' : 'Showing only people in training'}
          </button>
        </div>

        {error && <p className="stp__error">{error}</p>}

        {shown.length === 0 && (
          <div className="stp__card">
            <p className="stp__cardMeta">
              Nobody matches. {!showAll && 'Try showing everyone, or search by email.'}
            </p>
          </div>
        )}

        {shown.map((p) => {
          const passed = Object.values(p.best).filter((b) => b.passed).length;
          const open = expanded === p.id;

          return (
            <div key={p.id} className="stp__card">
              <div className="stp__cardHead">
                <p className="stp__cardTitle">{p.name || p.email || '(no name)'}</p>
                {p.role === 'admin' && <span className="stp__chip stp__chip--pass">Admin</span>}
              </div>

              <p className="stp__cardMeta">{p.email}</p>
              <p className="stp__cardFacts">
                {p.assigned.length
                  ? `${p.assigned.length} assigned, ${passed} passed`
                  : 'Nothing assigned'}
                {saving === p.id && ', saving'}
              </p>

              <div className="stp__cardActions">
                <button
                  className="stp__cardBtn stp__cardBtn--test"
                  type="button"
                  onClick={() => setExpanded(open ? null : p.id)}
                >
                  {open ? 'Done' : 'Choose modules'}
                </button>
                <button
                  className="stp__cardBtn stp__cardBtn--test"
                  type="button"
                  disabled={p.assigned.length === modules.length}
                  onClick={() => save(p, modules.map((m) => m.slug))}
                >
                  Assign all
                </button>
                {p.assigned.length > 0 && (
                  <button
                    className="stp__cardBtn stp__cardBtn--test"
                    type="button"
                    onClick={() => save(p, [])}
                  >
                    Remove all
                  </button>
                )}
              </div>

              {open && (
                <div className="stp__picks">
                  {modules.map((m, i) => {
                    const on = p.assigned.includes(m.slug);
                    const best = p.best[m.slug];
                    const score = best
                      ? best.passed
                        ? `, passed ${Math.round(best.score_pct)}%`
                        : `, best ${Math.round(best.score_pct)}%`
                      : '';
                    return (
                      <button
                        key={m.slug}
                        type="button"
                        className={`stp__pick${on ? ' stp__pick--on' : ''}`}
                        onClick={() =>
                          save(p, on ? p.assigned.filter((s) => s !== m.slug) : [...p.assigned, m.slug])
                        }
                      >
                        {String(i + 1).padStart(2, '0')} {m.title}{score}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        <div className="stp__actions">
          <Link className="stp__btn stp__btn--ghost" href="/training">Back to my training</Link>
        </div>

        <p className="stp__note">
          Unassigning does not delete anyone&apos;s scores. Attempt history is kept, so if you assign
          a module again their previous best comes back with it.
        </p>
      </div>
    </main>
  );
}
