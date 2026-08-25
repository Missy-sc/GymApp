import { useState, type FormEvent } from 'react';
import { Check, Eye, EyeOff, Loader2 } from 'lucide-react';
import { authErrorMessage, authService } from '../services/auth';

type Mode = 'login' | 'register';
type Busy = 'login' | 'register' | 'google' | 'reset' | null;
type Notice = { kind: 'error' | 'success'; text: string } | null;

function Field({
  id,
  label,
  type,
  value,
  autoComplete,
  onChange,
}: {
  id: string;
  label: string;
  type: 'text' | 'email' | 'password';
  value: string;
  autoComplete: string;
  onChange: (value: string) => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const password = type === 'password';

  return (
    <div className={`input${value ? ' filled' : ''}${password ? ' has-reveal' : ''}`}>
      <input
        id={id}
        name={id}
        type={password && revealed ? 'text' : type}
        value={value}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
      />
      <label htmlFor={id}>{label}</label>
      {password && (
        <button
          type="button"
          className="reveal"
          aria-controls={id}
          aria-pressed={revealed}
          aria-label={revealed ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          onClick={() => setRevealed((current) => !current)}
        >
          {revealed ? <EyeOff /> : <Eye />}
        </button>
      )}
      <span className="spin" />
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.6 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.2C12.4 13.7 17.7 9.5 24 9.5Z" />
      <path fill="#4285F4" d="M46.9 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.9c-.6 3-2.3 5.6-4.9 7.3l7.6 5.9c4.5-4.1 7.3-10.2 7.3-17.5Z" />
      <path fill="#FBBC05" d="M10.5 28.6a14.5 14.5 0 0 1 0-9.2l-7.9-6.2a24 24 0 0 0 0 21.6l7.9-6.2Z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.6-4.2-13.5-9.9l-7.9 6.2C6.5 42.6 14.6 48 24 48Z" />
    </svg>
  );
}

export function AuthScreen() {
  const [mode, setMode] = useState<Mode>('login');
  const [busy, setBusy] = useState<Busy>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRepeat, setRegRepeat] = useState('');

  const run = async (task: Busy, action: () => Promise<void>) => {
    setBusy(task);
    setNotice(null);
    try {
      await action();
    } catch (error) {
      setNotice({ kind: 'error', text: authErrorMessage(error) });
    } finally {
      setBusy(null);
    }
  };

  const submitLogin = (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    if (!email.trim() || !password) {
      setNotice({ kind: 'error', text: 'Enter your email and password.' });
      return;
    }
    void run('login', () => authService.signInWithEmail(email, password).then(() => undefined));
  };

  const submitRegister = (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    if (!regEmail.trim() || !regPassword) {
      setNotice({ kind: 'error', text: 'Enter an email and a password.' });
      return;
    }
    if (regPassword.length < 6) {
      setNotice({ kind: 'error', text: 'Use a password with at least 6 characters.' });
      return;
    }
    if (regPassword !== regRepeat) {
      setNotice({ kind: 'error', text: 'The two passwords do not match.' });
      return;
    }
    void run('register', () =>
      authService.registerWithEmail(regName, regEmail, regPassword).then(() => undefined),
    );
  };

  const continueWithGoogle = () => {
    if (busy) return;
    void run('google', () => authService.signInWithGoogle().then(() => undefined));
  };

  const resetPassword = () => {
    if (busy) return;
    if (!email.trim()) {
      setNotice({ kind: 'error', text: 'Enter your email address first.' });
      return;
    }
    void run('reset', async () => {
      await authService.sendPasswordReset(email);
      setNotice({ kind: 'success', text: `Password reset email sent to ${email.trim()}.` });
    });
  };

  const toggleMode = () => {
    setNotice(null);
    setMode((current) => (current === 'login' ? 'register' : 'login'));
  };

  const register = mode === 'register';

  return (
    <div className="auth-screen">
      <div className="materialContainer">
        <form className={`box${register ? ' back' : ''}`} onSubmit={submitLogin} noValidate inert={register}>
          <div className="title">LOGIN</div>

          <Field id="email" label="Email" type="email" value={email} autoComplete="email" onChange={setEmail} />
          <Field
            id="pass"
            label="Password"
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={setPassword}
          />

          <div className="button login">
            <button type="submit" className={busy === 'login' ? 'active' : ''} disabled={busy !== null}>
              <span>GO</span>
              <i className="fa">{busy === 'login' ? <Loader2 className="spinner" /> : <Check />}</i>
            </button>
          </div>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <button type="button" className="google-button" onClick={continueWithGoogle} disabled={busy !== null}>
            {busy === 'google' ? <Loader2 className="spinner" /> : <GoogleMark />}
            <span>Continue with Google</span>
          </button>

          <button type="button" className="pass-forgot" onClick={resetPassword} disabled={busy !== null}>
            {busy === 'reset' ? 'Sending email…' : 'Forgot your password?'}
          </button>
        </form>

        <div className={`overbox${register ? ' active' : ''}`}>
          <span className="overbox-fill" aria-hidden="true" />
          <button
            type="button"
            className="material-button alt-2"
            aria-expanded={register}
            aria-label={register ? 'Back to sign in' : 'Create an account'}
            onClick={toggleMode}
          >
            <span className="shape" />
          </button>

          <form className="overbox-form" onSubmit={submitRegister} noValidate>
            <div className="title">REGISTER</div>

            <Field id="regname" label="Name" type="text" value={regName} autoComplete="name" onChange={setRegName} />
            <Field id="regemail" label="Email" type="email" value={regEmail} autoComplete="email" onChange={setRegEmail} />
            <Field
              id="regpass"
              label="Password"
              type="password"
              value={regPassword}
              autoComplete="new-password"
              onChange={setRegPassword}
            />
            <Field
              id="reregpass"
              label="Repeat password"
              type="password"
              value={regRepeat}
              autoComplete="new-password"
              onChange={setRegRepeat}
            />

            <div className="button">
              <button type="submit" disabled={busy !== null}>
                <span>{busy === 'register' ? 'CREATING…' : 'NEXT'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {notice && (
        <p className={`auth-notice ${notice.kind}`} role={notice.kind === 'error' ? 'alert' : 'status'}>
          {notice.text}
        </p>
      )}
    </div>
  );
}
