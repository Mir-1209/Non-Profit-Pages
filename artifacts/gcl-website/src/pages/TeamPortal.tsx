import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { useAppAuth } from '../context/AuthContext';
import logoImg from '@assets/Untitled_design-9_1783003171841.png';

type TeamAssignmentStatus = 'upcoming' | 'in_progress' | 'completed';

interface TeamAssignment {
  id: string;
  title: string;
  description: string;
  status: TeamAssignmentStatus;
  dueDate: string;
}

const MOCK_ASSIGNMENTS: TeamAssignment[] = [
  { id: 'a1', title: 'Onboard New Chapter — Nairobi', description: 'Guide the Nairobi chapter through the standard onboarding checklist and submit completion report.', status: 'in_progress', dueDate: '2026-07-20T00:00:00Z' },
  { id: 'a2', title: 'Review Q2 Chapter Health Reports', description: 'Assess and score the health reports submitted by your assigned regional chapters.', status: 'upcoming', dueDate: '2026-07-28T00:00:00Z' },
  { id: 'a3', title: 'Volunteer Kickoff Call Facilitation', description: 'Co-facilitate the summer cohort onboarding call alongside the program director.', status: 'upcoming', dueDate: '2026-07-12T00:00:00Z' },
  { id: 'a4', title: 'GCL Summit Logistics Support', description: 'Coordinate registration, room assignments, and volunteer schedules for the August summit.', status: 'upcoming', dueDate: '2026-08-10T00:00:00Z' },
  { id: 'a5', title: 'Spring Chapter Recruitment Drive', description: 'Reached out to 14 universities and submitted outreach reports for all contacts.', status: 'completed', dueDate: '2026-06-01T00:00:00Z' },
  { id: 'a6', title: 'Member Feedback Survey Analysis', description: 'Compiled and summarized member survey responses from Q1 into the standard template.', status: 'completed', dueDate: '2026-05-15T00:00:00Z' },
];

const IMPORTANT_DATES = [
  { date: 'Jul 12, 2026', title: 'Volunteer Onboarding Call', desc: 'Mandatory kickoff session for the summer cohort.' },
  { date: 'Jul 28, 2026', title: 'Regional Chapter Reviews', desc: 'Submit chapter health reports for your assigned region.' },
  { date: 'Aug 15, 2026', title: 'GCL Global Summit', desc: 'All-hands event — team support roles will be assigned.' },
];

const RESOURCES = [
  { icon: '📘', title: 'Volunteer Handbook', desc: 'Guidelines, expectations, and code of conduct.' },
  { icon: '🎙️', title: 'Chapter Outreach Scripts', desc: 'Templates for recruiting new members.' },
  { icon: '📊', title: 'Reporting Templates', desc: 'Standard formats for assignment write-ups.' },
];

const STATUS_STYLES: Record<TeamAssignmentStatus, { bg: string; color: string; label: string; border: string }> = {
  upcoming:    { bg: 'rgba(51,88,255,0.12)',  color: '#818cf8', label: 'Upcoming',    border: 'rgba(99,102,241,0.25)' },
  in_progress: { bg: 'rgba(251,191,36,0.12)', color: '#fbbf24', label: 'In Progress', border: 'rgba(251,191,36,0.25)' },
  completed:   { bg: 'rgba(74,222,128,0.12)', color: '#4ade80', label: 'Completed',   border: 'rgba(74,222,128,0.25)' },
};

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
    name: 'GCL Chapter Lead Training',
    type: 'Leadership Program',
    appliedDate: 'Apr 5, 2026',
    status: 'review' as const,
    statusLabel: 'Under Review',
  },
];

const APP_STATUS_STYLES = {
  accepted: { color: '#4ade80', bg: 'rgba(74,222,128,0.12)', border: 'rgba(74,222,128,0.25)' },
  review:   { color: 'var(--neon-cyan)', bg: 'rgba(94,234,255,0.1)', border: 'rgba(94,234,255,0.2)' },
  rejected: { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)' },
};

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
              Out of 1,300+ applicants, you're one of 30 selected for the team. Welcome to the League.
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

export function TeamPortal() {
  const { isAuthenticated, isLoading, isTeam, user, logout, login } = useAppAuth();
  const [filter, setFilter] = useState<'all' | TeamAssignmentStatus>('all');

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
          <h2 className="font-[800] text-[24px] mb-2 text-white">Sign in to view the Team Portal</h2>
          <p className="mb-6 text-[14px]" style={{ color: 'var(--brutal-text-dim)' }}>This portal is reserved for GCL volunteers and staff.</p>
          <button onClick={login}
            className="px-6 py-3 rounded-full font-[800] text-[14px] text-[var(--ink)] transition-all hover:-translate-y-[1px]"
            style={{ background: 'var(--neon-cyan)', boxShadow: '0 0 20px rgba(94,234,255,0.3)' }}>
            Sign In
          </button>
        </div>
      </main>
    );
  }

  if (!isTeam) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--brutal-bg)' }}>
        <div className="text-center max-w-[380px]">
          <img src={logoImg} alt="GCL" className="h-10 object-contain mx-auto mb-6" />
          <div className="text-5xl mb-4">🚫</div>
          <h2 className="font-[800] text-[24px] mb-2 text-white">Team Access Only</h2>
          <p className="text-[14px]" style={{ color: 'var(--brutal-text-dim)' }}>The Team Portal is only available to GCL Team members and admins. Contact an administrator if you believe this is a mistake.</p>
        </div>
      </main>
    );
  }

  const assignments = MOCK_ASSIGNMENTS;
  const filtered = filter === 'all' ? assignments : assignments.filter(a => a.status === filter);
  const displayName = user?.firstName || user?.email || 'Team Member';

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
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-[800] tracking-[0.1em] uppercase mb-1"
                style={{ background: 'rgba(94,234,255,0.1)', color: 'var(--neon-cyan)', border: '1px solid rgba(94,234,255,0.2)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-cyan)] animate-pulse" />
                GCL Team Portal
              </div>
              <h1 className="font-[800] text-[20px] tracking-[-0.02em] text-white">
                Welcome, {displayName} 👋
              </h1>
              <p className="text-[12.5px]" style={{ color: 'var(--brutal-text-dim)' }}>View your assignments, key dates, and volunteer resources.</p>
            </div>
          </div>
          <button onClick={logout}
            className="px-4 py-2 rounded-full font-[700] text-[13px] text-red-400 self-start md:self-auto transition-colors"
            style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)' }}>
            Sign Out
          </button>
        </motion.div>

        {/* ── Status Update Card ── */}
        <StatusUpdateCard />

        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 mb-8">
          {/* ── Assignments ── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
            className="rounded-[20px] p-6"
            style={{ background: 'rgba(255,255,255,0.04)', border: '2px solid rgba(255,255,255,0.08)', boxShadow: '6px 6px 0px rgba(255,255,255,0.05)' }}>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <h2 className="font-[800] text-[18px] text-white">My Assignments</h2>
              <div className="flex gap-1.5">
                {(['all', 'upcoming', 'in_progress', 'completed'] as const).map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className="px-3 py-1.5 rounded-[8px] text-[12px] font-[700] transition-all"
                    style={filter === f
                      ? { background: 'var(--neon-cyan)', color: 'var(--ink)' }
                      : { background: 'rgba(255,255,255,0.06)', color: 'var(--brutal-text-dim)' }}>
                    {f === 'all' ? 'All' : STATUS_STYLES[f].label}
                  </button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-[14px]" style={{ color: 'var(--brutal-text-dim)' }}>
                  No assignments {filter !== 'all' ? `with status "${STATUS_STYLES[filter]?.label}"` : ''} right now.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filtered.map((a, i) => {
                  const s = STATUS_STYLES[a.status];
                  return (
                    <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                      className="p-4 rounded-[14px]"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <div className="font-[700] text-[14px] text-white">{a.title}</div>
                        <span className="text-[10.5px] font-[800] px-2.5 py-1 rounded-full shrink-0"
                          style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                          {s.label}
                        </span>
                      </div>
                      <p className="text-[12.5px] leading-relaxed mb-2" style={{ color: 'var(--brutal-text-dim)' }}>{a.description}</p>
                      <div className="text-[11px] font-[600]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        Due {new Date(a.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* ── Sidebar ── */}
          <div className="flex flex-col gap-5">
            {/* Important Dates */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
              className="rounded-[20px] p-5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.08)' }}>
              <h2 className="font-[800] text-[15px] text-white mb-4">📅 Important Dates</h2>
              <div className="flex flex-col gap-4">
                {IMPORTANT_DATES.map(d => (
                  <div key={d.title} className="flex gap-3">
                    <div className="w-11 h-11 rounded-[10px] flex flex-col items-center justify-center shrink-0"
                      style={{ background: 'rgba(94,234,255,0.1)', border: '1px solid rgba(94,234,255,0.2)' }}>
                      <div className="font-[800] text-[13px] leading-none" style={{ color: 'var(--neon-cyan)' }}>
                        {d.date.split(' ')[1].replace(',', '')}
                      </div>
                      <div className="text-[8px] font-[700] uppercase" style={{ color: 'var(--neon-cyan)', opacity: 0.7 }}>
                        {d.date.split(' ')[0]}
                      </div>
                    </div>
                    <div>
                      <div className="font-[700] text-[13px] text-white leading-snug">{d.title}</div>
                      <div className="text-[11px] leading-snug mt-0.5" style={{ color: 'var(--brutal-text-dim)' }}>{d.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Resources */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
              className="rounded-[20px] p-5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.08)' }}>
              <h2 className="font-[800] text-[15px] text-white mb-4">📎 Resources</h2>
              <div className="flex flex-col gap-2.5">
                {RESOURCES.map(r => (
                  <div key={r.title} className="flex items-center gap-3 p-3 rounded-[10px]"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="text-lg shrink-0">{r.icon}</span>
                    <div className="min-w-0">
                      <div className="font-[700] text-[13px] text-white truncate">{r.title}</div>
                      <div className="text-[11px]" style={{ color: 'var(--brutal-text-dim)' }}>{r.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Info note */}
            <div className="rounded-[14px] p-4 text-[12px] leading-relaxed"
              style={{ background: 'rgba(94,234,255,0.06)', border: '1px solid rgba(94,234,255,0.15)', color: 'var(--brutal-text-dim)' }}>
              You have view-only access to this portal. Reach out to a GCL admin if you need to update assignment details.
            </div>
          </div>
        </div>

        {/* ── Applied Programs ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
          className="rounded-[20px] p-6"
          style={{ background: 'rgba(255,255,255,0.04)', border: '2px solid rgba(255,255,255,0.08)', boxShadow: '6px 6px 0px rgba(255,255,255,0.05)' }}>
          <div className="mb-5">
            <h2 className="font-[800] text-[18px] text-white">Applied Programs</h2>
            <p className="text-[13px] mt-0.5" style={{ color: 'var(--brutal-text-dim)' }}>Programs you've applied for — status and updates.</p>
          </div>
          <div className="flex flex-col gap-3">
            {APPLIED_PROGRAMS.map((p, i) => {
              const st = APP_STATUS_STYLES[p.status];
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
