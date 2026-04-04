import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { Database, ShieldCheck, Sparkles } from 'lucide-react';
import { getErrorMessage } from '../../utils/getErrorMessage';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dc-auth-shell">
      <div className="dc-auth-grid">
        <div className="dc-card dc-auth-panel hidden p-10 lg:flex">
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div
                className="h-11 w-11 rounded-2xl grid place-items-center"
                style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-2))' }}
              >
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-lg font-semibold tracking-tight text-[color:var(--text)]">DataClean AI</div>
                <div className="text-sm text-[color:var(--muted)]">Clean, explore, and export datasets fast.</div>
              </div>
            </div>

            <div className="mt-10 space-y-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-[color:var(--primary-2)] mt-0.5" />
                <div>
                  <div className="text-[color:var(--text)] font-semibold">Secure sign-in</div>
                  <div className="text-sm text-[color:var(--muted)]">Your token is stored locally and attached automatically.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-[color:var(--primary-2)] mt-0.5" />
                <div>
                  <div className="text-[color:var(--text)] font-semibold">AI-assisted cleaning</div>
                  <div className="text-sm text-[color:var(--muted)]">Get insights and quick fixes with minimal friction.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dc-card p-6 sm:p-8 lg:p-10">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-[color:var(--text)]">Welcome back</h2>
            <p className="mt-2 text-sm text-[color:var(--muted)]">Sign in to continue to your dashboard.</p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div
                role="alert"
                aria-live="polite"
                className="text-sm p-3 rounded-xl"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: 'var(--danger)',
                }}
              >
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[color:var(--text)]" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="dc-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[color:var(--text)]" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="dc-input"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="w-full dc-btn-primary disabled:opacity-50" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 text-sm text-[color:var(--muted)]">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-[color:var(--primary-2)] hover:text-white transition-colors">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
