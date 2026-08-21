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
  const [oauthBusy, setOauthBusy] = useState(null); // 'google' | 'apple' | null

  // The mobile app signs most people up through Google or Apple, and those
  // accounts have no password to type here. Same Supabase project, same
  // account: the provider button signs them into the site directly.
  async function oauth(provider) {
    setOauthBusy(provider);
    setError('');
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/training` },
    });
    // On success the browser navigates away; we only get here on failure.
    if (oauthError) {
      setOauthBusy(null);
      setError(oauthError.message);
    }
  }

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
    signin: 'Free spotter training on the NWS warning system. Sign in with Google, Apple, or the same account you use in the Spotter Tools Pro app, then start training in one tap.',
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
          <>
            {mode !== 'forgot' && (
              <>
                <div className="stp__oauth">
                  <button
                    className="stp__oauthBtn stp__oauthBtn--google"
                    type="button"
                    disabled={oauthBusy !== null}
                    onClick={() => oauth('google')}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.86c2.26-2.09 3.58-5.16 3.58-8.81Z" />
                      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.86-3c-1.07.72-2.44 1.15-4.08 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24Z" />
                      <path fill="#FBBC05" d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.63H1.29a12 12 0 0 0 0 10.74l3.98-3.09Z" />
                      <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.59 1.79l3.42-3.42A11.98 11.98 0 0 0 12 0 12 12 0 0 0 1.29 6.63l3.98 3.09C6.22 6.88 8.87 4.77 12 4.77Z" />
                    </svg>
                    {oauthBusy === 'google' ? 'Opening Google' : 'Continue with Google'}
                  </button>
                  <button
                    className="stp__oauthBtn stp__oauthBtn--apple"
                    type="button"
                    disabled={oauthBusy !== null}
                    onClick={() => oauth('apple')}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M16.98 12.65c.03 3.13 2.75 4.17 2.78 4.18-.02.07-.43 1.48-1.43 2.94-.86 1.26-1.76 2.51-3.17 2.54-1.39.03-1.83-.82-3.42-.82-1.58 0-2.08.79-3.39.85-1.36.05-2.4-1.36-3.27-2.62C3.31 17.16 1.96 12.46 3.79 9.3a5.07 5.07 0 0 1 4.28-2.6c1.34-.03 2.6.9 3.42.9.82 0 2.35-1.11 3.96-.95.68.03 2.57.27 3.79 2.05-.1.06-2.26 1.32-2.26 3.95ZM14.4 4.94c.72-.87 1.2-2.08 1.07-3.29-1.04.04-2.29.69-3.03 1.56-.67.77-1.25 2-1.1 3.19 1.16.09 2.34-.59 3.06-1.46Z" />
                    </svg>
                    {oauthBusy === 'apple' ? 'Opening Apple' : 'Continue with Apple'}
                  </button>
                </div>
                <div className="stp__divider">or use email</div>
              </>
            )}

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
          </>
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
