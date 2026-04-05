import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { Database, UserPlus, Sparkles } from 'lucide-react';
import { getErrorMessage } from '../../utils/getErrorMessage';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(name, email, password);
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
                <div className="text-lg font-semibold tracking-tight text-[color:var(--text)]">Create your workspace</div>
                <div className="text-sm text-[color:var(--muted)]">One account for upload, clean, insights, export.</div>
              </div>
            </div>

            <div className="mt-10 space-y-4">
              <div className="flex items-start gap-3">
                <UserPlus className="h-5 w-5 text-[color:var(--primary-2)] mt-0.5" />
                <div>
                  <div className="text-[color:var(--text)] font-semibold">Quick setup</div>
                  <div className="text-sm text-[color:var(--muted)]">Register with your name, email, and password.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-[color:var(--primary-2)] mt-0.5" />
                <div>
                  <div className="text-[color:var(--text)] font-semibold">Better data, faster</div>
                  <div className="text-sm text-[color:var(--muted)]">Track cleaning actions and download clean outputs.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dc-card p-6 sm:p-8 lg:p-10">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-[color:var(--text)]">Create an account</h2>
            <p className="mt-2 text-sm text-[color:var(--muted)]">You’ll be signed in immediately after registering.</p>
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
              <label className="text-sm font-semibold text-[color:var(--text)]" htmlFor="name">
                Full name
              </label>
              <input
                id="name"
                type="text"
                required
                className="dc-input"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>

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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              <div className="text-xs text-[color:var(--muted-2)]">
                If registration fails, the message will tell you exactly why (for example: email already registered).
              </div>
            </div>

            <button type="submit" className="w-full dc-btn-primary disabled:opacity-50" disabled={submitting}>
              {submitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <div className="mt-6 text-sm text-[color:var(--muted)]">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[color:var(--primary-2)] hover:text-white transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
