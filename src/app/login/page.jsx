'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';
import '../training.css';

// Sign-in only. There is deliberately no self-registration: accounts are
// created by a team lead (scripts/create-trainee.mjs), so the question
// bank is never reachable by someone who simply found this page.
//
// Password reset is the one self-serve path, and it only ever emails an
// address that already has an account.
export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState('signin'); // 'signin' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');

    if (mode === 'forgot') {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      setBusy(false);

      if (resetError) {
        setError(resetError.message);
        return;
      }

      // Deliberately not "we sent it" — that would confirm whether an
      // address has an account here.
      setSent(true);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    setBusy(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    router.push('/training');
    router.refresh();
  }

  function switchTo(next) {
    setMode(next);
    setError('');
    setSent(false);
    setPassword('');
  }

  return (
    <main className="stp">
      <div className="stp__shell">
        <p className="stp__eyebrow">Spotter Tools Pro</p>
        <h1 className="stp__title">Storm Team Training</h1>
        <p className="stp__lede">
          {mode === 'signin'
            ? 'NWS warning products and issuance criteria. Sign in to see what you have been assigned.'
            : 'Enter the email your account uses and we will send a link to set a new password.'}
        </p>

        <div className="stp__card">
          {sent ? (
            <>
              <p className="stp__lede">
                If an account exists for {email}, a reset link is on its way. The link is good
                for one hour.
              </p>
              <div className="stp__actions">
                <button className="stp__btn" type="button" onClick={() => switchTo('signin')}>
                  Back to sign in
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={submit}>
              <label className="stp__field">
                <span className="stp__label">Email</span>
                <input
                  className="stp__input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </label>

              {mode === 'signin' && (
                <label className="stp__field">
                  <span className="stp__label">Password</span>
                  <input
                    className="stp__input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </label>
              )}

              <div className="stp__actions">
                <button className="stp__btn" type="submit" disabled={busy}>
                  {busy ? 'Working' : mode === 'signin' ? 'Sign in' : 'Send reset link'}
                </button>
                <button
                  className="stp__btn stp__btn--ghost"
                  type="button"
                  onClick={() => switchTo(mode === 'signin' ? 'forgot' : 'signin')}
                >
                  {mode === 'signin' ? 'Forgot password' : 'Back to sign in'}
                </button>
              </div>

              {error && <p className="stp__error">{error}</p>}
            </form>
          )}
        </div>

        <p className="stp__note">
          Accounts are issued by your team lead. If you do not have one, ask them to set you up.
        </p>
      </div>
    </main>
  );
}
