'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabaseClient';
import '../app/training.css';

// The sign in / create account / reset form, kept out of any one page so
// /training can render it in place rather than bouncing to /login. That
// keeps one URL for the whole portal.
//
// Anyone may create an account. That is safe because an account on its own
// grants nothing: questions_public is scoped to the caller's assignments,
// so someone who signs up without being assigned a module sees no questions
// at all. The gate is the assignment, not the account.
//
// auth.users is shared with the Spotter Tools Pro mobile app, so an app
// login already works here and does not need a second account.
export default function TrainingSignIn({ onSignedIn }) {
  const supabase = createClient();

  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'forgot'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(null); // 'reset' | 'confirm'
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
      if (resetError) { setError(resetError.message); return; }
      // Deliberately not "we sent it" — that would confirm whether an
      // address has an account here.
      setSent('reset');
      return;
    }

    if (mode === 'signup') {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      setBusy(false);
      if (signUpError) { setError(signUpError.message); return; }

      // With email confirmation on, signUp returns no session.
      if (data.session) { onSignedIn?.(); return; }
      setSent('confirm');
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (authError) { setError(authError.message); return; }

    onSignedIn?.();
  }

  function switchTo(next) {
    setMode(next);
    setError('');
    setSent(null);
    setPassword('');
  }

  const lede = {
    signin: 'NWS warning products and issuance criteria. Sign in to see what you have been assigned.',
    signup: 'Already use the Spotter Tools Pro app? Sign in with that account instead, you do not need a second one.',
    forgot: 'Enter the email your account uses and we will send a link to set a new password.',
  }[mode];

  return (
    <>
      <p className="stp__eyebrow">Spotter Tools Pro</p>
      <h1 className="stp__title">Storm Team Training</h1>
      <p className="stp__lede">{lede}</p>

      <div className="stp__card">
        {sent === 'reset' ? (
          <>
            <p className="stp__body">
              If an account exists for {email}, a reset link is on its way. The link is good for
              one hour.
            </p>
            <div className="stp__actions">
              <button className="stp__btn" type="button" onClick={() => switchTo('signin')}>
                Back to sign in
              </button>
            </div>
          </>
        ) : sent === 'confirm' ? (
          <>
            <p className="stp__body">
              Account created. Check {email} for a confirmation link, then come back and sign in.
            </p>
            <div className="stp__actions">
              <button className="stp__btn" type="button" onClick={() => switchTo('signin')}>
                Back to sign in
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={submit}>
            {mode === 'signup' && (
              <label className="stp__field">
                <span className="stp__label">Your name</span>
                <input
                  className="stp__input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </label>
            )}

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

            {mode !== 'forgot' && (
              <label className="stp__field">
                <span className="stp__label">Password</span>
                <input
                  className="stp__input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  minLength={8}
                  required
                />
                {mode === 'signup' && <span className="stp__hint">At least 8 characters.</span>}
              </label>
            )}

            <div className="stp__actions">
              <button className="stp__btn" type="submit" disabled={busy}>
                {busy
                  ? 'Working'
                  : mode === 'signin'
                    ? 'Sign in'
                    : mode === 'signup'
                      ? 'Create account'
                      : 'Send reset link'}
              </button>
            </div>

            {error && <p className="stp__error">{error}</p>}
          </form>
        )}
      </div>

      {!sent && (
        <div className="stp__cardActions">
          {mode !== 'signin' && (
            <button className="stp__cardBtn stp__cardBtn--test" type="button" onClick={() => switchTo('signin')}>
              Sign in
            </button>
          )}
          {mode !== 'signup' && (
            <button className="stp__cardBtn stp__cardBtn--test" type="button" onClick={() => switchTo('signup')}>
              Create account
            </button>
          )}
          {mode !== 'forgot' && (
            <button className="stp__cardBtn stp__cardBtn--test" type="button" onClick={() => switchTo('forgot')}>
              Forgot password
            </button>
          )}
        </div>
      )}

      <p className="stp__note">
        Creating an account does not assign you any training. Your team lead assigns modules, so
        if you sign up and see nothing yet, that is why.
      </p>
    </>
  );
}
