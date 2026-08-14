import { useState, type FormEvent } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { SupabaseSetupMessage } from './SupabaseSetupMessage';

type AuthProps = {
  onSuccess?: () => void;
};

export function Auth({ onSuccess }: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  if (!isSupabaseConfigured) return <SupabaseSetupMessage />;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const result =
        mode === 'signup'
          ? await supabase.auth.signUp({
              email,
              password,
              options: { emailRedirectTo: window.location.origin },
            })
          : await supabase.auth.signInWithPassword({ email, password });

      if (result.error) {
        setMessage(result.error.message);
      } else if (result.data.session) {
        onSuccess?.();
      } else {
        setMessage('Account created! Check your email to confirm it, then sign in.');
      }
    } catch {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogleSignIn() {
    setBusy(true);
    setMessage('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: new URL('/game', window.location.origin).toString() },
      });
      if (error) setMessage(error.message);
    } catch {
      setMessage('Could not connect to Google. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="auth-panel">
      <p className="menu-modal__label">Save your adventure</p>
      <h2 id="menu-modal-title">{mode === 'signin' ? 'Welcome back' : 'Create an account'}</h2>
      <p className="auth-panel__intro">
        {mode === 'signin' ? 'Sign in to continue your journey.' : 'Register with your email and a password.'}
      </p>
      <button className="auth-panel__google" onClick={handleGoogleSignIn} disabled={busy}>
        <span aria-hidden="true">G</span>
        Continue with Google
      </button>
      <div className="auth-panel__divider"><span>or use email</span></div>
      <form onSubmit={handleSubmit} className="auth-panel__form">
        <label htmlFor="auth-email">Email</label>
        <input
          id="auth-email"
          type="email"
          placeholder="pip@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <label htmlFor="auth-password">Password</label>
        <input
          id="auth-password"
          type="password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          minLength={6}
          required
        />
        <button type="submit" disabled={busy}>
          {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Register & play'}
        </button>
      </form>
      {message && <p className="auth-panel__message" role="status">{message}</p>}
      <button
        className="auth-panel__switch"
        onClick={() => {
          setMode(mode === 'signin' ? 'signup' : 'signin');
          setMessage('');
        }}
      >
        {mode === 'signin' ? 'New player? Create an account' : 'Already registered? Sign in'}
      </button>
    </section>
  );
}
