import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { useAppAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';
import logoImg from '@assets/Untitled_design-9_1783003171841.png';

function ProgressRing({ progress }: { progress: number }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  const offset = c - (progress / 100) * c;
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" className="shrink-0">
      <circle cx="26" cy="26" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
      <circle cx="26" cy="26" r={r} fill="none" stroke="url(#grad-ring)" strokeWidth="5"
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        transform="rotate(-90 26 26)" />
      <defs>
        <linearGradient id="grad-ring" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--neon-cyan)" />
          <stop offset="100%" stopColor="var(--magenta)" />
        </linearGradient>
      </defs>
      <text x="26" y="30" textAnchor="middle" fontSize="11" fontWeight="800" fill="white">{progress}%</text>
    </svg>
  );
}

const APPLIED_PROGRAMS = [
  {
    id: 'p1',
    name: 'GCL Summer \'26 Team',
    type: 'Volunteer · Competitive',
    appliedDate: 'Jan 15, 2026',
    status: 'accepted' as const,
    statusLabel: 'Accepted ✓',
  },
  {
    id: 'p2',
    name: 'GCL Financial Literacy Educator',
    type: 'Training Program',
    appliedDate: 'Mar 2, 2026',
    status: 'review' as const,
    statusLabel: 'Under Review',
  },
];

const STATUS_STYLES = {
  accepted: { color: '#4ade80', bg: 'rgba(74,222,128,0.12)', border: 'rgba(74,222,128,0.25)' },
  review:   { color: 'var(--neon-cyan)', bg: 'rgba(94,234,255,0.1)', border: 'rgba(94,234,255,0.2)' },
  rejected: { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)' },
};

const UPDATES = [
  { icon: '🎓', title: 'New course launched: Money & Power Dynamics', date: 'Jun 28, 2026' },
  { icon: '🌍', title: 'GCL Summit registrations now open', date: 'Jun 20, 2026' },
  { icon: '📢', title: 'Chapter applications close July 15th', date: 'Jun 10, 2026' },
];

function StatusUpdateCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-[20px] overflow-hidden mb-6"
      style={{
        background: '#0d0b1a',
        border: '1.5px solid rgba(94,234,255,0.2)',
        boxShadow: '0 0 40px rgba(94,234,255,0.06)',
      }}
    >
      <div className="px-7 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex-1">
            <div className="text-[11px] font-[800] tracking-[0.14em] uppercase mb-3" style={{ color: 'var(--neon-cyan)' }}>
              THE GCL POST
            </div>
            <h3 className="font-[800] text-[20px] md:text-[22px] leading-[1.15] text-white mb-2">
              YOU'VE BEEN ACCEPTED TO<br className="hidden md:block" /> GCL SUMMER '26. 🎉
            </h3>
            <p className="text-[13.5px] leading-relaxed" style={{ color: 'var(--brutal-text-dim)' }}>
              Out of 1,300+ applicants, you're one of 30 selected. Your onboarding details are on the way.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              href="/congratulations"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-[13px] font-[800] text-[var(--ink)] transition-all hover:-translate-y-[1px] hover:shadow-[0_0_20px_rgba(94,234,255,0.5)]"
              style={{ background: 'var(--neon-cyan)', boxShadow: '0 0 16px rgba(94,234,255,0.3)' }}
            >
              VIEW UPDATE →
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function MemberDashboard() {
  const { isAuthenticated, isLoading, user, profile, login, logout } = useAppAuth();
  const { courses: allCourses } = useAdmin();

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--brutal-bg)' }}>
        <div className="w-8 h-8 border-2 border-[var(--brutal-line)] border-t-[var(--neon-cyan)] rounded-full animate-spin" />
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--brutal-bg)' }}>
        <div className="text-center max-w-[380px]">
          <img src={logoImg} alt="GCL" className="h-10 object-contain mx-auto mb-6" />
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="font-[800] text-[24px] mb-2 text-white">Sign in to view your dashboard</h2>
          <p className="mb-6 text-[14px]" style={{ color: 'var(--brutal-text-dim)' }}>Track your courses, certificates, and program updates in one place.</p>
          <button onClick={login}
            className="px-6 py-3 rounded-full font-[800] text-[14px] text-[var(--ink)] transition-all hover:-translate-y-[1px]"
            style={{ background: 'var(--neon-cyan)', boxShadow: '0 0 20px rgba(94,234,255,0.3)' }}>
            Sign In
          </button>
        </div>
      </main>
    );
  }

  const displayName = user?.firstName || user?.email || 'Member';
  const enrolledCourses = profile?.courses ?? [];
  const certificates = profile?.certificates ?? [];
  const joinedAt = profile?.joinedAt ? new Date(profile.joinedAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : '—';
  const getCourse = (slug: string) => allCourses.find(c => c.slug === slug);

  return (
    <main className="min-h-screen pb-16" style={{ background: 'var(--brutal-bg)' }}>
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-[0.06] top-[-200px] right-[-100px]"
          style={{ background: 'radial-gradient(circle, var(--violet), transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute w-[400px] h-[400px] rounded-full opacity-[0.05] bottom-[-100px] left-[-80px]"
          style={{ background: 'radial-gradient(circle, var(--neon-cyan), transparent 70%)', filter: 'blur(70px)' }} />
      </div>

      <div className="relative z-10 max-w-[1100px] mx-auto px-5 md:px-10 pt-10 md:pt-14">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10"
        >
          <div className="flex items-center gap-5">
            <Link href="/">
              <img src={logoImg} alt="GCL" className="h-9 object-contain" />
            </Link>
            <div className="w-px h-8 opacity-20" style={{ background: 'var(--brutal-text)' }} />
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-[16px] font-[800] text-[var(--ink)] shrink-0"
                style={{ background: 'var(--neon-cyan)' }}>
                {displayName.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <h1 className="font-[800] text-[20px] tracking-[-0.02em] text-white">
                  Welcome back, {displayName} 👋
                </h1>
                <p className="text-[12.5px]" style={{ color: 'var(--brutal-text-dim)' }}>Member since {joinedAt}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/courses"
              className="px-4 py-2 rounded-full font-[700] text-[13px] transition-all hover:-translate-y-[1px]"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'var(--brutal-text)' }}>
              Browse Courses
            </Link>
            <button onClick={logout}
              className="px-4 py-2 rounded-full font-[700] text-[13px] text-red-400 transition-colors"
              style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)' }}>
              Sign Out
            </button>
          </div>
        </motion.div>

        {/* ── Status Update Card ── */}
        <StatusUpdateCard />

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Enrolled Courses', value: enrolledCourses.length, icon: '📚', accent: 'var(--blue)' },
            { label: 'Completed', value: enrolledCourses.filter(c => c.completed).length, icon: '✅', accent: '#4ade80' },
            { label: 'Certificates', value: certificates.length, icon: '🏆', accent: 'var(--magenta)' },
            { label: 'Role', value: 'Member', icon: '⭐', accent: 'var(--neon-cyan)' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="rounded-[16px] p-4"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.08)' }}>
              <div className="text-[20px] mb-2">{s.icon}</div>
              <div className="font-[800] text-[24px] text-white">{s.value}</div>
              <div className="text-[12px] font-[600]" style={{ color: 'var(--brutal-text-dim)' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 mb-8">
          {/* ── My Courses ── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-[20px] p-6"
            style={{ background: 'rgba(255,255,255,0.04)', border: '2px solid rgba(255,255,255,0.08)', boxShadow: '6px 6px 0px rgba(255,255,255,0.05)' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-[800] text-[18px] text-white">My Courses</h2>
              <Link href="/courses" className="text-[13px] font-[700]" style={{ color: 'var(--neon-cyan)' }}>
                View catalog →
              </Link>
            </div>
            {enrolledCourses.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-4xl mb-3">📖</div>
                <p className="text-[14px] mb-4" style={{ color: 'var(--brutal-text-dim)' }}>You haven't enrolled in any courses yet.</p>
                <Link href="/courses"
                  className="px-5 py-2.5 rounded-full font-[700] text-[13px] text-[var(--ink)]"
                  style={{ background: 'var(--neon-cyan)' }}>
                  Explore Courses
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {enrolledCourses.map(ec => {
                  const c = getCourse(ec.courseSlug);
                  return (
                    <div key={ec.courseSlug}
                      className="flex items-center gap-4 p-4 rounded-[14px]"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <ProgressRing progress={ec.progress} />
                      <div className="flex-1 min-w-0">
                        <div className="font-[700] text-[14px] text-white truncate">{c?.title ?? ec.courseSlug}</div>
                        <div className="text-[12px]" style={{ color: 'var(--brutal-text-dim)' }}>{c?.level ?? ''} {c?.duration ? `· ${c.duration}` : ''}</div>
                      </div>
                      {ec.completed ? (
                        <span className="text-[11px] font-[800] px-2.5 py-1 rounded-full shrink-0" style={{ color: '#4ade80', background: 'rgba(74,222,128,0.12)' }}>✓ Complete</span>
                      ) : (
                        <Link href={`/courses/${ec.courseSlug}/learn`}
                          className="text-[12px] font-[700] px-3 py-1.5 rounded-[8px] text-[var(--ink)] shrink-0"
                          style={{ background: 'var(--neon-cyan)' }}>
                          Continue
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* ── Sidebar ── */}
          <div className="flex flex-col gap-5">
            {/* Certificates */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
              className="rounded-[20px] p-5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.08)' }}>
              <h2 className="font-[800] text-[15px] text-white mb-4">🏆 Certificates</h2>
              {certificates.length === 0 ? (
                <p className="text-[13px]" style={{ color: 'var(--brutal-text-dim)' }}>Complete a course to earn your first certificate.</p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {certificates.map(cert => {
                    const c = getCourse(cert.courseSlug);
                    return (
                      <div key={cert.id} className="flex items-center gap-3 p-3 rounded-[10px]"
                        style={{ background: 'rgba(255,255,255,0.04)' }}>
                        <span className="text-lg">🎖️</span>
                        <div className="min-w-0">
                          <div className="font-[700] text-[13px] text-white truncate">{c?.title ?? cert.courseSlug}</div>
                          <div className="text-[11px]" style={{ color: 'var(--brutal-text-dim)' }}>Issued {new Date(cert.issuedAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* Program Updates */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
              className="rounded-[20px] p-5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.08)' }}>
              <h2 className="font-[800] text-[15px] text-white mb-4">📢 Program Updates</h2>
              <div className="flex flex-col gap-3">
                {UPDATES.map(u => (
                  <div key={u.title} className="flex gap-3">
                    <span className="text-[16px] shrink-0">{u.icon}</span>
                    <div>
                      <div className="font-[600] text-[13px] leading-snug text-white">{u.title}</div>
                      <div className="text-[11px] mt-0.5" style={{ color: 'var(--brutal-text-dim)' }}>{u.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Applied Programs ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
          className="rounded-[20px] p-6"
          style={{ background: 'rgba(255,255,255,0.04)', border: '2px solid rgba(255,255,255,0.08)', boxShadow: '6px 6px 0px rgba(255,255,255,0.05)' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-[800] text-[18px] text-white">Applied Programs</h2>
              <p className="text-[13px] mt-0.5" style={{ color: 'var(--brutal-text-dim)' }}>Programs you've applied for — status and updates.</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {APPLIED_PROGRAMS.map((p, i) => {
              const st = STATUS_STYLES[p.status];
              return (
                <motion.div key={p.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.06 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-[14px]"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-[18px] shrink-0"
                      style={{ background: 'rgba(94,234,255,0.1)', border: '1px solid rgba(94,234,255,0.2)' }}>
                      🌍
                    </div>
                    <div>
                      <div className="font-[700] text-[14.5px] text-white">{p.name}</div>
                      <div className="text-[12px]" style={{ color: 'var(--brutal-text-dim)' }}>{p.type} · Applied {p.appliedDate}</div>
                    </div>
                  </div>
                  <span className="text-[11.5px] font-[800] px-3 py-1.5 rounded-full self-start sm:self-auto"
                    style={{ color: st.color, background: st.bg, border: `1px solid ${st.border}` }}>
                    {p.statusLabel}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

      </div>
    </main>
  );
}
