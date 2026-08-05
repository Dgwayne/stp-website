'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabaseClient';
import '../training.css';

// Where the emailed reset link lands. Supabase puts a one-time code in
// the URL; exchanging it gives a short-lived session that is only good
// for setting a new password.
export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!cancelled && session) setReady(true);
    });

    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;
      if (session) { setReady(true); return; }

      // PKCE links arrive as ?code=...; the browser client will usually
      // have exchanged it already, so this is the fallback.
      const code = new URLSearchParams(window.location.search).get('code');
      if (!code) {
        setError('Open this page from the reset link in your email.');
        return;
      }

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (cancelled) return;

      if (exchangeError) {
        setError('That reset link has expired or already been used. Request a new one.');
        return;
      }
      setReady(true);
    })();

    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, [supabase]);

  async function submit(e) {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Those two passwords do not match.');
      return;
    }

    setBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setBusy(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setDone(true);
    setTimeout(() => { router.push('/training'); router.refresh(); }, 1200);
  }

  return (
    <main className="stp">
      <div className="stp__shell">
        <p className="stp__eyebrow">Spotter Tools Pro</p>
        <h1 className="stp__title">Set a new password</h1>

        {done ? (
          <p className="stp__lede">Password updated. Taking you to your training.</p>
        ) : !ready ? (
          <>
            <p className="stp__lede">{error || 'Checking your reset link.'}</p>
            {error && (
              <div className="stp__actions">
                <Link className="stp__btn" href="/login">Back to sign in</Link>
              </div>
            )}
          </>
        ) : (
          <div className="stp__card">
            <form onSubmit={submit}>
              <label className="stp__field">
                <span className="stp__label">New password</span>
                <input
                  className="stp__input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </label>

              <label className="stp__field">
                <span className="stp__label">Confirm password</span>
                <input
                  className="stp__input"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </label>

              <div className="stp__actions">
                <button className="stp__btn" type="submit" disabled={busy}>
                  {busy ? 'Saving' : 'Save password'}
                </button>
              </div>

              {error && <p className="stp__error">{error}</p>}
            </form>
          </div>
        )}

        <p className="stp__note">Reset links are good for one hour and can be used once.</p>
      </div>
    </main>
  );
}
