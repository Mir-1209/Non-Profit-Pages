import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { useAppAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';

function ProgressRing({ progress }: { progress: number }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  const offset = c - (progress / 100) * c;
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" className="shrink-0">
      <circle cx="26" cy="26" r={r} fill="none" stroke="var(--paper-alt)" strokeWidth="5" />
      <circle
        cx="26" cy="26" r={r} fill="none" stroke="url(#grad)" strokeWidth="5"
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        transform="rotate(-90 26 26)"
      />
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--blue)" />
          <stop offset="100%" stopColor="var(--magenta)" />
        </linearGradient>
      </defs>
      <text x="26" y="30" textAnchor="middle" fontSize="12" fontWeight="800" fill="var(--ink)">{progress}%</text>
    </svg>
  );
}

export function MemberDashboard() {
  const { isAuthenticated, isLoading, user, profile, profileLoading, login, logout } = useAppAuth();
  const { courses: allCourses } = useAdmin();

  if (isLoading) {
    return <main className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-[var(--line)] border-t-[var(--violet)] rounded-full animate-spin" /></main>;
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-[380px]">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="font-[800] text-[24px] mb-2">Sign in to view your dashboard</h2>
          <p className="text-[var(--ink-soft)] mb-6 text-[14px]">Track your courses, certificates, and program updates in one place.</p>
          <button onClick={login} className="btn btn-dark">Sign In</button>
        </div>
      </main>
    );
  }

  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.email || 'Member';
  const enrolledCourses = profile?.courses ?? [];
  const certificates = profile?.certificates ?? [];
  const joinedAt = profile?.joinedAt ? new Date(profile.joinedAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : '—';

  const getCourse = (slug: string) => allCourses.find(c => c.slug === slug);

  const updates = [
    { icon: '🎓', title: 'New course launched: Money & Power Dynamics', date: 'Jun 28, 2026' },
    { icon: '🌍', title: 'GCL Summit registrations now open', date: 'Jun 20, 2026' },
    { icon: '📢', title: 'Chapter applications close July 15th', date: 'Jun 10, 2026' },
  ];

  return (
    <main className="min-h-screen px-5 md:px-10 py-10 md:py-14" style={{ background: 'var(--paper-alt)' }}>
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            {user?.profileImageUrl ? (
              <img src={user.profileImageUrl} alt={displayName} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow" />
            ) : (
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-[18px] font-[800] text-white" style={{ background: 'var(--grad-brand)' }}>
                {displayName.slice(0, 1).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="font-[800] text-[26px] tracking-[-0.02em]">Welcome back, {displayName.split(' ')[0]} 👋</h1>
              <p className="text-[13.5px] text-[var(--ink-soft)]">Member since {joinedAt}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/courses" className="px-4 py-2.5 rounded-[10px] font-[700] text-[13.5px] border-[1.5px] border-[var(--line)] hover:bg-white transition-colors">Browse Courses</Link>
            <button onClick={logout} className="px-4 py-2.5 rounded-[10px] font-[700] text-[13.5px] text-red-500 hover:bg-red-50 transition-colors">Log Out</button>
          </div>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Enrolled Courses', value: enrolledCourses.length, icon: '📚' },
            { label: 'Completed', value: enrolledCourses.filter(c => c.completed).length, icon: '✅' },
            { label: 'Certificates', value: certificates.length, icon: '🏆' },
            { label: 'Role', value: 'Member', icon: '⭐' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="bg-white rounded-[16px] border-[1.5px] border-[var(--line)] p-4">
              <div className="text-[20px] mb-1.5">{s.icon}</div>
              <div className="font-[800] text-[22px]">{s.value}</div>
              <div className="text-[12px] text-[var(--ink-soft)] font-[600]">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
          {/* Courses */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-[18px] border-[2px] border-[var(--line)] shadow-[4px_4px_0px_var(--ink)] p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-[800] text-[19px]">My Courses</h2>
              <Link href="/courses" className="text-[13px] font-[700]" style={{ color: 'var(--violet)' }}>View catalog →</Link>
            </div>
            {enrolledCourses.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-4xl mb-3">📖</div>
                <p className="text-[14px] text-[var(--ink-soft)] mb-4">You haven't enrolled in any courses yet.</p>
                <Link href="/courses" className="btn btn-dark">Explore Courses</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {enrolledCourses.map(ec => {
                  const c = getCourse(ec.courseSlug);
                  return (
                    <div key={ec.courseSlug} className="flex items-center gap-4 p-4 rounded-[14px]" style={{ background: 'var(--paper-alt)' }}>
                      <ProgressRing progress={ec.progress} />
                      <div className="flex-1 min-w-0">
                        <div className="font-[700] text-[14.5px] truncate">{c?.title ?? ec.courseSlug}</div>
                        <div className="text-[12px] text-[var(--ink-faint)]">{c?.level ?? ''} {c?.duration ? `· ${c.duration}` : ''}</div>
                      </div>
                      {ec.completed ? (
                        <span className="text-[11px] font-[800] text-green-600 bg-green-50 px-2.5 py-1 rounded-full shrink-0">✓ Complete</span>
                      ) : (
                        <Link href={`/courses/${ec.courseSlug}/learn`} className="text-[12px] font-[700] px-3 py-1.5 rounded-[8px] text-white shrink-0" style={{ background: 'var(--ink)' }}>Continue</Link>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Sidebar: certificates + updates */}
          <div className="flex flex-col gap-6">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
              className="bg-white rounded-[18px] border-[2px] border-[var(--line)] p-6">
              <h2 className="font-[800] text-[16px] mb-4">🏆 Certificates</h2>
              {certificates.length === 0 ? (
                <p className="text-[13px] text-[var(--ink-faint)]">Complete a course to earn your first certificate.</p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {certificates.map(cert => {
                    const c = getCourse(cert.courseSlug);
                    return (
                      <div key={cert.id} className="flex items-center gap-3 p-3 rounded-[10px]" style={{ background: 'var(--paper-alt)' }}>
                        <span className="text-lg">🎖️</span>
                        <div className="min-w-0">
                          <div className="font-[700] text-[13px] truncate">{c?.title ?? cert.courseSlug}</div>
                          <div className="text-[11px] text-[var(--ink-faint)]">Issued {new Date(cert.issuedAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
              className="bg-white rounded-[18px] border-[2px] border-[var(--line)] p-6">
              <h2 className="font-[800] text-[16px] mb-4">📢 Program Updates</h2>
              <div className="flex flex-col gap-3">
                {updates.map(u => (
                  <div key={u.title} className="flex gap-3">
                    <span className="text-[16px] shrink-0">{u.icon}</span>
                    <div>
                      <div className="font-[600] text-[13px] leading-snug">{u.title}</div>
                      <div className="text-[11px] text-[var(--ink-faint)]">{u.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
