'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabaseClient';
import '../../training.css';

const KEYS = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function ModulePage() {
  const { slug } = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [module, setModule] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/training'); return; }

      const [{ data: mod }, { data: qs }] = await Promise.all([
        supabase.from('modules').select('*').eq('slug', slug).single(),
        supabase
          .from('questions_public')
          .select('id, type, prompt, options, sort_order')
          .eq('module_slug', slug)
          .order('sort_order'),
      ]);

      if (cancelled) return;
      setModule(mod ?? null);
      setQuestions(qs ?? []);
    })();

    return () => { cancelled = true; };
  }, [slug, router, supabase]);

  const current = questions?.[index];
  const answered = current ? (responses[current.id] ?? []) : [];
  const allAnswered = useMemo(
    () => questions?.length > 0 && questions.every((q) => (responses[q.id] ?? []).length > 0),
    [questions, responses],
  );

  function toggle(optIndex) {
    if (!current) return;
    setResponses((prev) => {
      const picked = prev[current.id] ?? [];
      if (current.type === 'multi') {
        return {
          ...prev,
          [current.id]: picked.includes(optIndex)
            ? picked.filter((i) => i !== optIndex)
            : [...picked, optIndex].sort((a, b) => a - b),
        };
      }
      return { ...prev, [current.id]: [optIndex] };
    });
  }

  async function submit() {
    setBusy(true);
    setError('');

    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch('/api/attempts/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ moduleSlug: slug, responses }),
    });

    setBusy(false);

    if (!res.ok) {
      setError('Could not record your attempt. Check your connection and try again.');
      return;
    }

    setResult(await res.json());
    window.scrollTo({ top: 0 });
  }

  // ---------- results ----------
  if (result) {
    const passed = result.passed;
    return (
      <main className="stp">
        <div className="stp__shell">
          <p className="stp__eyebrow">{module?.title}</p>
          <p className={`stp__score ${passed ? 'stp__score--pass' : 'stp__score--fail'}`}>
            {Math.round(result.score_pct)}%
          </p>
          <h1 className="stp__title">{passed ? 'Passed' : 'Not passed'}</h1>
          <p className="stp__lede">
            {result.correct_count} of {result.total_count} correct. Passing is {module?.pass_pct}%.
            {passed
              ? ' Your score is recorded.'
              : ' Review the misses below, then retake when you are ready.'}
          </p>

          {questions.map((q, i) => {
            const detail = result.review[q.id];
            const picked = responses[q.id] ?? [];
            return (
              <div className="stp__card" key={q.id}>
                <span className={`stp__chip ${detail.correct ? 'stp__chip--pass' : 'stp__chip--fail'}`}>
                  {String(i + 1).padStart(2, '0')} — {detail.correct ? 'Correct' : 'Missed'}
                </span>
                <p className="stp__prompt">{q.prompt}</p>

                {q.options.map((opt, oi) => {
                  const isKey = detail.answer.includes(oi);
                  const wasPicked = picked.includes(oi);
                  const cls = isKey
                    ? 'stp__opt stp__opt--correct'
                    : wasPicked
                      ? 'stp__opt stp__opt--incorrect'
                      : 'stp__opt';
                  return (
                    <button className={cls} key={oi} disabled>
                      <span className="stp__optKey">{KEYS[oi]}</span>
                      <span>{opt}</span>
                    </button>
                  );
                })}

                <p className="stp__feedback">
                  <strong>Why: </strong>{detail.explanation}
                </p>
              </div>
            );
          })}

          <div className="stp__actions">
            <Link className="stp__btn" href="/training">Back to training</Link>
            {!passed && (
              <>
                <Link className="stp__btn stp__btn--ghost" href={`/training/${slug}/study`}>
                  Review material
                </Link>
                <button
                  className="stp__btn stp__btn--ghost"
                  onClick={() => { setResult(null); setResponses({}); setIndex(0); }}
                >
                  Retake
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    );
  }

  // ---------- quiz ----------
  if (!questions) {
    return (
      <main className="stp"><div className="stp__shell"><p className="stp__lede">Loading module.</p></div></main>
    );
  }

  if (questions.length === 0) {
    return (
      <main className="stp">
        <div className="stp__shell">
          <h1 className="stp__title">Module not available</h1>
          <p className="stp__lede">No questions are loaded for this module yet.</p>
          <Link className="stp__btn" href="/training">Back to training</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="stp">
      <div className="stp__shell">
        <p className="stp__eyebrow">{module?.title}</p>

        <div className="stp__quizTrack">
          <span className="stp__quizCount">{index + 1} / {questions.length}</span>
          <div className="stp__quizBar">
            <div
              className="stp__quizFill"
              style={{ width: `${((index + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <p className="stp__prompt">{current.prompt}</p>
        {current.type === 'multi' && <p className="stp__hint">Select all that apply.</p>}

        {current.options.map((opt, oi) => (
          <button
            key={oi}
            className="stp__opt"
            aria-pressed={answered.includes(oi)}
            onClick={() => toggle(oi)}
          >
            <span className="stp__optKey">{KEYS[oi]}</span>
            <span>{opt}</span>
          </button>
        ))}

        <div className="stp__actions">
          <button
            className="stp__btn stp__btn--ghost"
            onClick={() => setIndex((i) => i - 1)}
            disabled={index === 0}
          >
            Previous
          </button>

          {index < questions.length - 1 ? (
            <button
              className="stp__btn"
              onClick={() => setIndex((i) => i + 1)}
              disabled={answered.length === 0}
            >
              Next
            </button>
          ) : (
            <button className="stp__btn" onClick={submit} disabled={!allAnswered || busy}>
              {busy ? 'Scoring' : 'Submit test'}
            </button>
          )}
        </div>

        {index === questions.length - 1 && !allAnswered && (
          <p className="stp__hint">Answer every question before submitting.</p>
        )}
        {error && <p className="stp__error">{error}</p>}

        <p className="stp__note">
          Answers are scored on the server. You will see explanations after you submit.
        </p>
      </div>
    </main>
  );
}
