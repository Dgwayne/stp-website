'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabaseClient';
import guide from '@/content/study-guide.json';
import '../../../training.css';

// Reference material for a module. The content is derived from the same
// vetted question bank the test draws on, so it can never teach something
// the test contradicts. It deliberately carries no answer key: the facts
// are public NWS criteria, not which option is correct for a given item.
export default function StudyPage() {
  const { slug } = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [module, setModule] = useState(null);
  const [checked, setChecked] = useState(false);

  const content = guide.modules[slug];

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/login'); return; }

      const { data } = await supabase.from('modules').select('title, pass_pct').eq('slug', slug).single();
      if (cancelled) return;
      setModule(data ?? null);
      setChecked(true);
    })();

    return () => { cancelled = true; };
  }, [slug, router, supabase]);

  if (!checked) {
    return (
      <main className="stp"><div className="stp__shell"><p className="stp__lede">Loading material.</p></div></main>
    );
  }

  if (!content) {
    return (
      <main className="stp">
        <div className="stp__shell">
          <h1 className="stp__title">No material for this module</h1>
          <p className="stp__lede">Nothing has been written up for this one yet.</p>
          <Link className="stp__btn" href="/training">Back to training</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="stp">
      <div className="stp__shell">
        <p className="stp__eyebrow">{module?.title ?? 'Study material'}</p>
        <h1 className="stp__title">Review material</h1>
        <p className="stp__lede">{content.intro}</p>

        {content.sections.map((s, i) => (
          <section className="stp__card" key={i}>
            <h2 className="stp__h2">{s.heading}</h2>
            {s.body && <p className="stp__body">{s.body}</p>}

            {s.table && (
              <div className="stp__tableWrap">
                <table className="stp__table">
                  <thead>
                    <tr>{s.table.columns.map((c, ci) => <th key={ci}>{c}</th>)}</tr>
                  </thead>
                  <tbody>
                    {s.table.rows.map((r, ri) => (
                      <tr key={ri}>{r.map((cell, cix) => <td key={cix}>{cell}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {s.points && (
              <ul className="stp__list">
                {s.points.map((p, pi) => <li key={pi}>{p}</li>)}
              </ul>
            )}

            {s.note && <p className="stp__callout">{s.note}</p>}
          </section>
        ))}

        {content.local && (
          <section className="stp__card stp__card--warn">
            <h2 className="stp__h2">Set by your local office</h2>
            <p className="stp__body">{content.local}</p>
          </section>
        )}

        {content.changes && (
          <section className="stp__card">
            <h2 className="stp__h2">Changes to know</h2>
            {content.changes.map((c, ci) => (
              <div className="stp__change" key={ci}>
                <p className="stp__body">{c.what}</p>
                <p className="stp__hint">{c.when}</p>
              </div>
            ))}
          </section>
        )}

        <div className="stp__actions">
          <Link className="stp__btn" href={`/training/${slug}`}>Start the test</Link>
          <Link className="stp__btn stp__btn--ghost" href="/training">Back to training</Link>
        </div>

        <p className="stp__note">
          {module?.pass_pct ? `Passing is ${module.pass_pct}%. ` : ''}
          Material derived from the question bank, version {guide.derived_from_bank_version}. Review by {guide.review_by}.
        </p>
      </div>
    </main>
  );
}
