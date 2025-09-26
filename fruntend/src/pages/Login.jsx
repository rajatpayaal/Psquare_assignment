import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store/authContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      const userRole = result.data.user?.role;
      nav(userRole === 'admin' ? '/admin' : '/');
    } else {
      setError(result.error || 'Login failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4 py-10 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl blur opacity-30" />
        <div className="relative mx-auto max-w-md bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/60">
          <div className="text-center">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl shadow-md">✈️</div>
            <h1 className="text-2xl font-bold mt-5 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Welcome Back</h1>
            <p className="text-sm text-gray-500 mt-1">Sign in to continue your journey.</p>
          </div>
          <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
            <div>
              <label className="text-xs uppercase tracking-wide font-semibold text-gray-600">Email</label>
              <div className="mt-1 relative">
                <input
                  className="peer mt-0 w-full border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-lg px-3 py-2.5 text-sm transition-colors placeholder:text-gray-400"
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-300 peer-focus:text-blue-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m0 0l4 4m-4-4l4-4m-7 0a9 9 0 1118 0 9 9 0 01-18 0z" /></svg>
                </span>
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide font-semibold text-gray-600">Password</label>
              <div className="mt-1 relative">
                <input
                  type="password"
                  className="peer w-full border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-lg px-3 py-2.5 text-sm transition-colors placeholder:text-gray-400"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  minLength={6}
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-300 peer-focus:text-blue-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.657 0-2.485.293-3.121a3 3 0 011.586-1.586C14.515 6 15.343 6 17 6h1a3 3 0 013 3v6a3 3 0 01-3 3h-1c-1.657 0-2.485 0-3.121-.293a3 3 0 01-1.586-1.586C12 15.485 12 14.657 12 13m0-2H9m3 0h3m-3 0v-2m0 2v2" /></svg>
                </span>
              </div>
            </div>
            {error && (
              <div className="text-xs font-medium rounded-md px-3 py-2 bg-red-50 text-red-600 border border-red-200">
                {error}
              </div>
            )}
            <button
              className="w-full relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg py-2.5 text-sm font-semibold shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all hover:shadow-md hover:from-blue-500 hover:to-indigo-500"
              type="submit"
              disabled={loading}
            >
              {loading && (
                <span className="absolute left-3 inline-flex w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              )}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-xs mt-6 text-gray-500">
            Don't have an account?{' '}
            <Link className="font-medium text-blue-600 hover:text-indigo-600 transition-colors" to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}


