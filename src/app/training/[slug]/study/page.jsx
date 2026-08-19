'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabaseClient';
import guide from '@/content/study-guide.json';
import { ICONS, moduleMeta } from '@/components/trainingMeta';
import { StudySection, Essentials, LocalPanel, QuickChecks } from '@/components/StudyBlocks';
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
  const meta = moduleMeta(slug);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/training'); return; }

      const { data } = await supabase.from('modules').select('title, pass_pct').eq('slug', slug).single();
      if (cancelled) return;
      setModule(data ?? null);
      setChecked(true);
    })();

    return () => { cancelled = true; };
  }, [slug, router, supabase]);

  if (!checked) {
    return (
      <main className="stp"><div className="stp__shell"><p className="stp__lede">Loading.</p></div></main>
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
      <div className="stp__shell study" style={{ '--accent': meta.accent }}>
        <header className="study__hero">
          <div className="study__heroTop">
            <div className="study__heroIcon">{ICONS[meta.icon]}</div>
            <div>
              <div className="study__heroKicker">Training</div>
              <h1 className="stp__title" style={{ margin: 0 }}>{module?.title ?? 'Study material'}</h1>
            </div>
          </div>
          <p className="stp__lede" style={{ margin: 0 }}>{content.tagline ?? content.intro}</p>
          <div className="study__heroMeta">
            {content.minutes && <span>{content.minutes} min read</span>}
            <span>{content.sections.length} topics</span>
            {module?.pass_pct && <span>Pass at {module.pass_pct}%</span>}
          </div>
        </header>

        {content.tagline && <p className="stp__lede">{content.intro}</p>}

        {content.essentials && <Essentials items={content.essentials} />}

        {content.sections.map((s, i) => <StudySection section={s} key={i} />)}

        {content.local && <LocalPanel text={content.local} />}

        {content.changes && (
          <section className="study__section">
            <h2 className="study__h2">Changes to know</h2>
            {content.changes.map((c, ci) => (
              <div className="study__change" key={ci}>
                <p className="study__changeWhat">{c.what}</p>
                <p className="study__changeWhen">{c.when}</p>
              </div>
            ))}
          </section>
        )}

        {content.quickChecks && <QuickChecks checks={content.quickChecks} />}

        <div className="study__cta">
          <Link className="stp__btn" href={`/training/${slug}`}>Take the test</Link>
          <Link className="stp__btn stp__btn--ghost" href="/training">Back to training</Link>
        </div>

        <p className="stp__note">
          {module?.pass_pct
            ? `You need ${module.pass_pct}% to pass, and you can retake it as many times as you like.`
            : 'You can retake the test as many times as you like.'}
        </p>
      </div>
    </main>
  );
}
