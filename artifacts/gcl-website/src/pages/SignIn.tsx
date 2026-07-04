import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useAppAuth } from '../context/AuthContext';

const STATS = [
  { value: '120+', label: 'University Chapters' },
  { value: '15K+', label: 'Student Members' },
  { value: '40+',  label: 'Countries Represented' },
];

const BENEFITS = [
  { icon: '🎓', text: 'Access exclusive finance courses' },
  { icon: '🌐', text: 'Connect with a global network' },
  { icon: '📈', text: 'Real-world investment challenges' },
  { icon: '🏆', text: 'Compete in league rankings' },
];

const ROLE_REDIRECT: Record<string, string> = {
  admin:    '/admin',
  gcl_team: '/portal',
  member:   '/dashboard',
};

const ACCOUNT_ROLES: Record<string, string> = {
  Mirzo12: 'admin',
  Mirzo11: 'gcl_team',
  Mirzo10: 'member',
};

export function SignIn() {
  const { isAuthenticated, role, signInWithCredentials } = useAppAuth();
  const [, navigate] = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password) {
      setError('Please enter your username and password.');
      return;
    }
    setLoading(true);
    const result = signInWithCredentials(username.trim(), password);
    setLoading(false);
    if (!result.success) {
      setError(result.error ?? 'Sign-in failed.');
      return;
    }
    const accountRole = ACCOUNT_ROLES[username.trim()] ?? 'member';
    navigate(ROLE_REDIRECT[accountRole] ?? '/dashboard');
  };

  const inputCls = [
    'w-full px-4 py-3.5 rounded-[12px] border-[2px] text-[14.5px] font-[500] outline-none transition-all',
    'bg-[var(--paper-alt)] border-[var(--line)] focus:border-[var(--violet)]',
  ].join(' ');

  return (
    <main className="min-h-screen flex items-stretch relative overflow-hidden" style={{ background: 'var(--paper)' }}>

      {/* ── Left panel ── */}
      <div
        className="hidden lg:flex lg:w-[52%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #1a1060 40%, #24243e 100%)' }}
      >
        {/* Animated orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[500px] h-[500px] rounded-full opacity-20 top-[-120px] left-[-100px]"
            style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)', filter: 'blur(60px)' }} />
          <div className="absolute w-[400px] h-[400px] rounded-full opacity-15 bottom-[-80px] right-[-80px]"
            style={{ background: 'radial-gradient(circle, #06b6d4, transparent 70%)', filter: 'blur(60px)' }} />
          <div className="absolute w-[300px] h-[300px] rounded-full opacity-10 top-[40%] right-[10%]"
            style={{ background: 'radial-gradient(circle, #ec4899, transparent 70%)', filter: 'blur(50px)' }} />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }} />

        {/* Logo */}
        <Link href="/" className="relative flex items-center gap-3 w-fit z-10">
          <div className="w-9 h-9 rounded-full shrink-0"
            style={{ background: 'conic-gradient(from 200deg, #60a5fa, #a78bfa, #f472b6, #22d3ee, #60a5fa)' }} />
          <div className="flex flex-col leading-tight">
            <span className="font-[800] text-[18px] text-white tracking-tight">GCL</span>
            <span className="text-[9px] font-[600] tracking-[0.18em] text-white/50 uppercase">Global Capital League</span>
          </div>
        </Link>

        {/* Hero copy */}
        <div className="relative z-10 flex flex-col gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-[700] tracking-[0.1em] uppercase mb-5"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Student Applications Open
            </div>
            <h2 className="text-[40px] font-[800] leading-[1.1] tracking-[-0.03em] text-white mb-4">
              The world's<br />
              <span style={{ background: 'linear-gradient(90deg, #818cf8, #c084fc, #f472b6)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                leading student
              </span><br />
              finance league.
            </h2>
            <p className="text-[15px] text-white/60 leading-relaxed max-w-[360px]">
              Join thousands of students competing, learning, and building the future of global capital markets.
            </p>
          </div>

          <ul className="flex flex-col gap-3">
            {BENEFITS.map(b => (
              <li key={b.text} className="flex items-center gap-3 text-[14px] text-white/70">
                <span className="text-[16px]">{b.icon}</span>
                {b.text}
              </li>
            ))}
          </ul>

          <div className="flex gap-6 pt-2 border-t border-white/10">
            {STATS.map(s => (
              <div key={s.label}>
                <div className="text-[22px] font-[800] text-white">{s.value}</div>
                <div className="text-[11px] text-white/45 font-[500] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating card */}
        <div className="relative z-10 rounded-[16px] p-4 flex items-center gap-4"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
          <div className="flex -space-x-2">
            {['#7c3aed','#2563eb','#059669'].map((c, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white/10 flex items-center justify-center text-white text-[11px] font-bold"
                style={{ background: c }}>
                {['A','B','C'][i]}
              </div>
            ))}
          </div>
          <div>
            <div className="text-[13px] font-[700] text-white">Joined by 280 students this week</div>
            <div className="text-[11px] text-white/45">From Harvard, LSE, NUS & more</div>
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-16 relative">
        {/* Background orbs */}
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-20 pointer-events-none top-[-100px] right-[-100px]"
          style={{ background: 'radial-gradient(circle, #a78bfa, transparent)' }} />
        <div className="absolute w-[300px] h-[300px] rounded-full blur-[80px] opacity-15 pointer-events-none bottom-[-80px] left-[-60px]"
          style={{ background: 'radial-gradient(circle, #38bdf8, transparent)' }} />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-[420px]"
        >
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2.5 mb-8 w-fit mx-auto justify-center">
            <div className="w-7 h-7 rounded-full shrink-0"
              style={{ background: 'conic-gradient(from 200deg, var(--blue), var(--violet), var(--magenta), #33c7e8, var(--blue))' }} />
            <span className="font-[800] text-[16px]"
              style={{ background: 'var(--grad-brand)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
              GCL
            </span>
          </Link>

          {isAuthenticated ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-[28px] mb-6 mx-auto"
                style={{ background: 'linear-gradient(135deg, #7c3aed22, #2563eb22)', border: '2px solid var(--violet)' }}>
                ✅
              </div>
              <h1 className="font-[800] text-[28px] tracking-[-0.025em] mb-2">You're already signed in</h1>
              <p className="text-[14px] text-[var(--ink-soft)] mb-8">Head back to your dashboard to keep exploring GCL.</p>
              <Link href={ROLE_REDIRECT[role] ?? '/dashboard'}
                className="inline-block w-full py-3.5 rounded-[12px] text-white font-[700] text-[15px] text-center transition-all hover:-translate-y-[1px]"
                style={{ background: 'var(--grad-brand)', boxShadow: '0 4px 20px rgba(139,92,246,0.35)' }}>
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-[28px] mb-6 mx-auto"
                  style={{ background: 'linear-gradient(135deg, #7c3aed22, #2563eb22)', border: '2px solid var(--violet)' }}>
                  👋
                </div>
                <h1 className="font-[800] text-[28px] tracking-[-0.025em] mb-2">Welcome to GCL</h1>
                <p className="text-[14px] text-[var(--ink-soft)] max-w-[340px] mx-auto">
                  Sign in to access your courses, portal, and program updates.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-[13px] font-[700] text-[var(--ink)] mb-1.5">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    autoComplete="username"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-[700] text-[var(--ink)] mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className={inputCls + ' pr-12'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(v => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-faint)] hover:text-[var(--ink)] transition-colors text-[13px] font-[600]"
                    >
                      {showPass ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    className="px-4 py-3 rounded-[10px] text-[13.5px] font-[600] text-red-600"
                    style={{ background: '#fef2f2', border: '1.5px solid #fecaca' }}
                  >
                    {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-[12px] text-white font-[700] text-[15px] transition-all hover:-translate-y-[1px] active:translate-y-0 disabled:opacity-60 mt-1"
                  style={{ background: 'var(--grad-brand)', boxShadow: '0 4px 20px rgba(139,92,246,0.35)' }}
                >
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>

              <p className="text-[12px] text-[var(--ink-faint)] mt-6 text-center leading-relaxed">
                Don't have an account? Contact your GCL chapter coordinator to get access.
              </p>
            </>
          )}
        </motion.div>
      </div>
    </main>
  );
}
