import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../context/AdminContext';

type Tab = 'signin' | 'signup';

const STATS = [
  { value: '120+', label: 'University Chapters' },
  { value: '15K+', label: 'Student Members' },
  { value: '40+', label: 'Countries Represented' },
];

const BENEFITS = [
  { icon: '🎓', text: 'Access exclusive finance courses' },
  { icon: '🌐', text: 'Connect with a global network' },
  { icon: '📈', text: 'Real-world investment challenges' },
  { icon: '🏆', text: 'Compete in league rankings' },
];

export function SignIn() {
  const [, setLocation] = useLocation();
  const { login } = useAdmin();
  const [tab, setTab] = useState<Tab>('signin');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [suPassword, setSuPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [university, setUniversity] = useState('');
  const [suError, setSuError] = useState('');
  const [suLoading, setSuLoading] = useState(false);
  const [suSuccess, setSuSuccess] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const success = login(username, password);
      if (success) {
        setLocation('/admin');
      } else {
        setError('Invalid username or password. Please try again.');
      }
      setLoading(false);
    }, 700);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setSuError('');
    if (suPassword !== confirmPassword) {
      setSuError('Passwords do not match.');
      return;
    }
    if (suPassword.length < 8) {
      setSuError('Password must be at least 8 characters.');
      return;
    }
    setSuLoading(true);
    setTimeout(() => {
      setSuLoading(false);
      setSuSuccess(true);
    }, 900);
  };

  return (
    <main className="min-h-screen flex items-stretch relative overflow-hidden" style={{ background: 'var(--paper)' }}>
      {/* ── Left panel ── */}
      <div
        className="hidden lg:flex lg:w-[52%] flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f0c29 0%, #1a1060 40%, #24243e 100%)',
        }}
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

          {/* Benefits */}
          <ul className="flex flex-col gap-3">
            {BENEFITS.map(b => (
              <li key={b.text} className="flex items-center gap-3 text-[14px] text-white/70">
                <span className="text-[16px]">{b.icon}</span>
                {b.text}
              </li>
            ))}
          </ul>

          {/* Stats row */}
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
        {/* Mobile background orbs */}
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
          <Link href="/" className="lg:hidden flex items-center gap-2.5 mb-8 w-fit">
            <div className="w-7 h-7 rounded-full shrink-0"
              style={{ background: 'conic-gradient(from 200deg, var(--blue), var(--violet), var(--magenta), #33c7e8, var(--blue))' }} />
            <span className="font-[800] text-[16px]"
              style={{ background: 'var(--grad-brand)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
              GCL
            </span>
          </Link>

          {/* Tab switcher */}
          <div className="relative flex rounded-[14px] p-1 mb-8"
            style={{ background: 'var(--paper-alt)', border: '1.5px solid var(--line)' }}>
            <motion.div
              className="absolute top-1 bottom-1 rounded-[10px]"
              style={{ background: 'var(--ink)', left: tab === 'signin' ? '4px' : 'calc(50% + 2px)', right: tab === 'signin' ? 'calc(50% + 2px)' : '4px' }}
              layout
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            />
            {(['signin', 'signup'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); setSuError(''); setSuSuccess(false); }}
                className="relative z-10 flex-1 py-2.5 text-[13.5px] font-[700] rounded-[10px] transition-colors duration-200"
                style={{ color: tab === t ? 'var(--paper)' : 'var(--ink-soft)' }}
              >
                {t === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === 'signin' ? (
              <motion.div
                key="signin"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.25 }}
              >
                <div className="mb-7">
                  <h1 className="font-[800] text-[28px] tracking-[-0.025em] mb-1">Welcome back 👋</h1>
                  <p className="text-[14px] text-[var(--ink-soft)]">Sign in to your GCL account to continue.</p>
                </div>

                <form onSubmit={handleSignIn} className="flex flex-col gap-4">
                  <Field label="Username">
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="your_username"
                      required
                      autoComplete="username"
                    />
                  </Field>

                  <Field label="Password">
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                    />
                    <div className="flex justify-end mt-1.5">
                      <button type="button" className="text-[12px] font-[600] hover:underline" style={{ color: 'var(--violet)' }}>
                        Forgot password?
                      </button>
                    </div>
                  </Field>

                  <AnimatePresence>
                    {error && <ErrorMsg msg={error} />}
                  </AnimatePresence>

                  <PrimaryButton loading={loading} label="Sign In" loadingLabel="Signing in…" />
                </form>

                <Divider />
                <GoogleButton onClick={() => setError('Google sign-in is coming soon.')} />

                <p className="text-center text-[13px] text-[var(--ink-soft)] mt-6">
                  New to GCL?{' '}
                  <button onClick={() => setTab('signup')} className="font-[700] hover:underline" style={{ color: 'var(--violet)' }}>
                    Create a free account
                  </button>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
              >
                {suSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8 flex flex-col items-center gap-4"
                  >
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-[32px] mb-2"
                      style={{ background: 'linear-gradient(135deg, #7c3aed22, #2563eb22)', border: '2px solid var(--violet)' }}>
                      🎉
                    </div>
                    <h2 className="font-[800] text-[22px] tracking-tight">Application Submitted!</h2>
                    <p className="text-[14px] text-[var(--ink-soft)] max-w-[300px]">
                      Thank you for joining GCL. Check your email for next steps to complete your membership.
                    </p>
                    <button
                      onClick={() => { setSuSuccess(false); setTab('signin'); }}
                      className="mt-2 px-6 py-2.5 rounded-[12px] text-[14px] font-[700] text-white transition-all hover:-translate-y-[1px]"
                      style={{ background: 'var(--grad-brand)', boxShadow: '0 4px 18px rgba(139,92,246,0.25)' }}
                    >
                      Go to Sign In
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <div className="mb-7">
                      <h1 className="font-[800] text-[28px] tracking-[-0.025em] mb-1">Join GCL 🚀</h1>
                      <p className="text-[14px] text-[var(--ink-soft)]">Create your free student account today.</p>
                    </div>

                    <form onSubmit={handleSignUp} className="flex flex-col gap-3.5">
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="First Name">
                          <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                            placeholder="Jane" required autoComplete="given-name" />
                        </Field>
                        <Field label="Last Name">
                          <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                            placeholder="Smith" required autoComplete="family-name" />
                        </Field>
                      </div>

                      <Field label="University Email">
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                          placeholder="you@university.edu" required autoComplete="email" />
                      </Field>

                      <Field label="University / Institution">
                        <input type="text" value={university} onChange={e => setUniversity(e.target.value)}
                          placeholder="Harvard, LSE, NUS…" required />
                      </Field>

                      <Field label="Password">
                        <input type="password" value={suPassword} onChange={e => setSuPassword(e.target.value)}
                          placeholder="Min. 8 characters" required autoComplete="new-password" />
                      </Field>

                      <Field label="Confirm Password">
                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter password" required autoComplete="new-password" />
                      </Field>

                      <AnimatePresence>
                        {suError && <ErrorMsg msg={suError} />}
                      </AnimatePresence>

                      <p className="text-[11.5px] text-[var(--ink-faint)] leading-relaxed">
                        By signing up you agree to our{' '}
                        <Link href="/terms" className="font-[600] hover:underline" style={{ color: 'var(--violet)' }}>Terms</Link>
                        {' '}and{' '}
                        <Link href="/privacy" className="font-[600] hover:underline" style={{ color: 'var(--violet)' }}>Privacy Policy</Link>.
                      </p>

                      <PrimaryButton loading={suLoading} label="Create Account" loadingLabel="Creating account…" />
                    </form>

                    <Divider />
                    <GoogleButton onClick={() => setSuError('Google sign-up is coming soon.')} label="Sign up with Google" />

                    <p className="text-center text-[13px] text-[var(--ink-soft)] mt-6">
                      Already have an account?{' '}
                      <button onClick={() => setTab('signin')} className="font-[700] hover:underline" style={{ color: 'var(--violet)' }}>
                        Sign in
                      </button>
                    </p>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12.5px] font-[700] tracking-[0.01em]" style={{ color: 'var(--ink)' }}>
        {label}
      </label>
      <div className="[&_input]:w-full [&_input]:px-3.5 [&_input]:py-[11px] [&_input]:rounded-[11px] [&_input]:border-[1.5px] [&_input]:border-[var(--line)] [&_input]:text-[14px] [&_input]:font-[500] [&_input]:outline-none [&_input]:transition-all [&_input:focus]:border-[var(--violet)] [&_input:focus]:shadow-[0_0_0_3px_rgba(139,92,246,0.12)] [&_input]:bg-[var(--paper-alt)]">
        {children}
      </div>
    </div>
  );
}

function ErrorMsg({ msg }: { msg: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="text-[13px] font-[600] rounded-[10px] px-4 py-2.5 flex items-center gap-2"
      style={{ color: '#ef4444', background: '#fef2f2', border: '1px solid #fecaca' }}
    >
      <span>⚠️</span> {msg}
    </motion.div>
  );
}

function PrimaryButton({ loading, label, loadingLabel }: { loading: boolean; label: string; loadingLabel: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-3.5 rounded-[12px] text-white font-[700] text-[15px] transition-all hover:-translate-y-[1px] active:translate-y-0 disabled:opacity-60 disabled:translate-y-0 relative overflow-hidden mt-1"
      style={{ background: 'var(--grad-brand)', boxShadow: '0 4px 20px rgba(139,92,246,0.35)' }}
    >
      <span className={`transition-opacity ${loading ? 'opacity-0' : 'opacity-100'}`}>{label}</span>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        </span>
      )}
    </button>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-[1px] bg-[var(--line)]" />
      <span className="text-[11px] font-[600] tracking-[0.08em] uppercase" style={{ color: 'var(--ink-faint)' }}>or</span>
      <div className="flex-1 h-[1px] bg-[var(--line)]" />
    </div>
  );
}

function GoogleButton({ onClick, label = 'Continue with Google' }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full py-3 rounded-[12px] font-[600] text-[14px] border-[1.5px] border-[var(--line)] flex items-center justify-center gap-2.5 hover:border-[var(--violet)] hover:bg-[var(--paper-alt)] transition-all active:scale-[0.99]"
    >
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      {label}
    </button>
  );
}
