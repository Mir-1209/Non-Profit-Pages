import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useAdmin } from '../context/AdminContext';

export function SignIn() {
  const [, setLocation] = useLocation();
  const { login } = useAdmin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const success = login(username, password);
      if (success) {
        setLocation('/admin');
      } else {
        setError('Invalid username or password.');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
      <div className="absolute w-[600px] h-[600px] rounded-full blur-[80px] opacity-40 pointer-events-none bg-[radial-gradient(circle,#cdd8ff,transparent_70%)] top-[-200px] left-[-200px]" />
      <div className="absolute w-[500px] h-[500px] rounded-full blur-[80px] opacity-40 pointer-events-none bg-[radial-gradient(circle,#f3cdf7,transparent_70%)] bottom-[-200px] right-[-200px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-[440px]"
      >
        <div className="bg-white rounded-[28px] border-[2.5px] border-[var(--ink)] shadow-[10px_10px_0px_var(--ink)] p-10">
          <Link href="/" className="flex items-center gap-[10px] mb-10 w-fit">
            <div className="w-[28px] h-[28px] rounded-full shrink-0" style={{ background: 'conic-gradient(from 200deg, var(--blue), var(--violet), var(--magenta), #33c7e8, var(--blue))' }} />
            <div className="flex flex-col leading-tight">
              <span className="font-[800] text-[16px]" style={{ background: 'var(--grad-brand)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>GCL</span>
              <span className="text-[8px] font-[600] tracking-[0.13em] text-[var(--ink-faint)] uppercase">Global Capital League</span>
            </div>
          </Link>

          <h1 className="font-[800] text-[28px] tracking-[-0.02em] mb-1">Welcome back</h1>
          <p className="text-[14px] text-[var(--ink-soft)] mb-8">Sign in to your GCL account</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[13px] font-[700] text-[var(--ink)] mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                className="w-full px-4 py-3 rounded-[12px] border-[2px] border-[var(--line)] text-[14.5px] font-[500] outline-none transition-all focus:border-[var(--violet)] bg-[var(--paper-alt)]"
              />
            </div>
            <div>
              <label className="block text-[13px] font-[700] text-[var(--ink)] mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 rounded-[12px] border-[2px] border-[var(--line)] text-[14.5px] font-[500] outline-none transition-all focus:border-[var(--violet)] bg-[var(--paper-alt)]"
              />
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-[13px] font-[600] text-red-500 bg-red-50 border border-red-200 rounded-[10px] px-4 py-2.5">
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-[12px] text-white font-[700] text-[15px] transition-all hover:-translate-y-[1px] disabled:opacity-60 disabled:translate-y-0 mt-1"
              style={{ background: 'var(--grad-brand)', boxShadow: '0 4px 18px rgba(139,92,246,0.3)' }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-[1px] bg-[var(--line)]" />
            <span className="text-[12px] font-[600] text-[var(--ink-faint)]">OR</span>
            <div className="flex-1 h-[1px] bg-[var(--line)]" />
          </div>

          <button
            className="w-full py-3.5 rounded-[12px] font-[600] text-[14.5px] border-[2px] border-[var(--line)] flex items-center justify-center gap-3 hover:border-[var(--violet)] hover:bg-[var(--paper-alt)] transition-all"
            onClick={() => setError('Google sign-in is coming soon.')}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-[13px] text-[var(--ink-soft)] mt-6">
            Don't have an account?{' '}
            <Link href="/courses" className="font-[700] text-[var(--violet)] hover:underline">Explore free courses</Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
