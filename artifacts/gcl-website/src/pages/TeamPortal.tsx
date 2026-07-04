import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
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
  { date: 'Jul 12', title: 'Volunteer Onboarding Call', desc: 'Mandatory kickoff session for the summer cohort.' },
  { date: 'Jul 28', title: 'Regional Chapter Reviews', desc: 'Submit chapter health reports for your assigned region.' },
  { date: 'Aug 15', title: 'GCL Global Summit', desc: 'All-hands event — team support roles will be assigned.' },
];

const RESOURCES = [
  { title: 'Volunteer Handbook', desc: 'Guidelines, expectations, and code of conduct.' },
  { title: 'Chapter Outreach Scripts', desc: 'Templates for recruiting new members.' },
  { title: 'Reporting Templates', desc: 'Standard formats for assignment write-ups.' },
];

const STATUS_STYLES: Record<TeamAssignmentStatus, { bg: string; color: string; label: string; border: string }> = {
  upcoming:    { bg: '#eff6ff', color: '#1e40af', label: 'Upcoming',    border: '#93c5fd' },
  in_progress: { bg: '#fefce8', color: '#713f12', label: 'In Progress', border: '#fcd34d' },
  completed:   { bg: '#f0fdf4', color: '#166534', label: 'Completed',   border: '#86efac' },
};

const APPLIED_PROGRAMS = [
  {
    id: 'p1',
    name: "GCL Summer '26 Team",
    type: 'Volunteer · Competitive',
    appliedDate: 'Jan 15, 2026',
    status: 'accepted' as const,
    statusLabel: 'Accepted',
    hasUpdate: true,
    updateDate: 'July 4, 2026',
  },
  {
    id: 'p2',
    name: 'GCL Chapter Lead Training',
    type: 'Leadership Program',
    appliedDate: 'Apr 5, 2026',
    status: 'review' as const,
    statusLabel: 'Under Review',
    hasUpdate: false,
    updateDate: '',
  },
];

const APP_STATUS_STYLES = {
  accepted: { color: '#166534', bg: '#dcfce7', border: '#86efac' },
  review:   { color: '#1e40af', bg: '#dbeafe', border: '#93c5fd' },
  rejected: { color: '#991b1b', bg: '#fee2e2', border: '#fca5a5' },
};

const FILTERS = ['all', 'upcoming', 'in_progress', 'completed'] as const;
type Filter = typeof FILTERS[number];

function SecretStatusWidget({ programName, updateDate }: { programName: string; updateDate: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 text-left w-full group"
      >
        <span
          className="w-[6px] h-[6px] rounded-full shrink-0 mt-[1px]"
          style={{ background: 'var(--ink)', opacity: open ? 1 : 0.35 }}
        />
        <span className="text-[11px] font-[600] tracking-[0.04em] transition-opacity"
          style={{ color: 'var(--ink-faint)', opacity: open ? 1 : 0.6 }}>
          {open ? 'Status Update' : '1 update'}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-3 border-[2px] border-[var(--ink)] shadow-[4px_4px_0px_var(--ink)] bg-white p-5">
              <div className="text-[10px] font-[800] uppercase tracking-[0.16em] text-[var(--ink-faint)] mb-2">
                Status Update
              </div>
              <p className="text-[13.5px] font-[500] text-[var(--ink-soft)] leading-relaxed mb-4">
                There has been a status update to{' '}
                <span className="font-[700] text-[var(--ink)]">{programName}</span>{' '}
                on {updateDate}.
              </p>
              <Link
                href="/congratulations"
                className="inline-flex items-center gap-1 text-[12.5px] font-[800] uppercase tracking-wider text-[var(--ink)] border-b-2 border-[var(--ink)] hover:opacity-60 transition-opacity"
              >
                View Update
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function TeamPortal() {
  const { isAuthenticated, isLoading, isTeam, user, logout, login } = useAppAuth();
  const [filter, setFilter] = useState<Filter>('all');

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-6 h-6 border-2 border-[var(--line)] border-t-[var(--ink)] rounded-full animate-spin" />
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-8 bg-white">
        <img src={logoImg} alt="GCL" className="h-9 object-contain mb-10" />
        <div className="border-[2.5px] border-[var(--ink)] shadow-[8px_8px_0px_var(--ink)] bg-white p-10 max-w-[400px] w-full text-center">
          <div className="font-[800] text-[22px] tracking-[-0.02em] uppercase mb-3">Sign In Required</div>
          <p className="text-[14px] text-[var(--ink-soft)] mb-7">This portal is reserved for GCL volunteers and staff.</p>
          <button onClick={login}
            className="w-full py-3 font-[800] text-[13px] uppercase tracking-wider text-white border-[2px] border-[var(--ink)] bg-[var(--ink)] hover:bg-transparent hover:text-[var(--ink)] transition-colors">
            Sign In
          </button>
        </div>
      </main>
    );
  }

  if (!isTeam) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-8 bg-white">
        <img src={logoImg} alt="GCL" className="h-9 object-contain mb-10" />
        <div className="border-[2.5px] border-[var(--ink)] shadow-[8px_8px_0px_var(--ink)] bg-white p-10 max-w-[400px] w-full text-center">
          <div className="font-[800] text-[22px] tracking-[-0.02em] uppercase mb-3">Access Restricted</div>
          <p className="text-[14px] text-[var(--ink-soft)]">The Team Portal is reserved for GCL team members and administrators. Contact an admin if you believe this is an error.</p>
        </div>
      </main>
    );
  }

  const displayName = user?.firstName || user?.email || 'Team Member';
  const filtered = filter === 'all' ? MOCK_ASSIGNMENTS : MOCK_ASSIGNMENTS.filter(a => a.status === filter);

  const counts = {
    upcoming:    MOCK_ASSIGNMENTS.filter(a => a.status === 'upcoming').length,
    in_progress: MOCK_ASSIGNMENTS.filter(a => a.status === 'in_progress').length,
    completed:   MOCK_ASSIGNMENTS.filter(a => a.status === 'completed').length,
  };

  return (
    <main className="min-h-screen pb-24">

      {/* ── Dark Hero Header ── */}
      <section className="pt-[80px] pb-0" style={{ background: 'var(--brutal-bg)' }}>
        <div className="max-w-[1160px] mx-auto px-8">

          {/* Top bar */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <Link href="/">
              <img src={logoImg} alt="GCL" className="h-8 object-contain" />
            </Link>
            <button onClick={logout}
              className="text-[12px] font-[700] uppercase tracking-wider text-white/50 hover:text-white transition-colors">
              Sign Out
            </button>
          </div>

          {/* Heading */}
          <div className="py-8 border-b border-white/10">
            <div className="text-[11px] font-[800] uppercase tracking-[0.16em] text-[var(--neon-cyan)] mb-3">
              GCL Team Portal
            </div>
            <h1 className="font-[800] text-[clamp(40px,6vw,72px)] leading-[0.9] tracking-[-0.04em] text-white uppercase">
              {displayName}.
            </h1>
            <p className="text-[14px] text-white/40 font-[500] mt-3">View assignments, key dates, and volunteer resources.</p>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-3 divide-x divide-white/10 py-5">
            {[
              { n: counts.upcoming,    label: 'Upcoming' },
              { n: counts.in_progress, label: 'In Progress' },
              { n: counts.completed,   label: 'Completed' },
            ].map(s => (
              <div key={s.label} className="px-6 first:pl-0">
                <div className="font-[800] text-[clamp(28px,3.5vw,44px)] text-white tracking-[-0.02em] leading-none">{s.n}</div>
                <div className="text-[11px] font-[600] uppercase tracking-wider text-white/40 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="bg-white py-12">
        <div className="max-w-[1160px] mx-auto px-8">

          <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8 mb-8">

            {/* ── Assignments ── */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b-[2.5px] border-[var(--ink)] mb-6 flex-wrap gap-3">
                <h2 className="font-[800] text-[20px] uppercase tracking-[-0.02em]">Assignments</h2>
                <div className="flex gap-1.5">
                  {FILTERS.map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                      className="px-3 py-1.5 text-[11px] font-[800] uppercase tracking-wider transition-all border-[2px] rounded-none"
                      style={filter === f
                        ? { background: 'var(--ink)', color: '#fff', borderColor: 'var(--ink)' }
                        : { background: 'transparent', color: 'var(--ink-soft)', borderColor: 'var(--line)' }}>
                      {f === 'all' ? 'All' : STATUS_STYLES[f].label}
                    </button>
                  ))}
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="border-[2.5px] border-[var(--line)] py-12 text-center">
                  <p className="text-[14px] text-[var(--ink-soft)] font-[600] uppercase tracking-wider">No assignments in this category.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filtered.map((a, i) => {
                    const s = STATUS_STYLES[a.status];
                    return (
                      <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                        className="border-[2.5px] border-[var(--ink)] shadow-[5px_5px_0px_var(--ink)] bg-white hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0px_var(--ink)] transition-all">
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-0">
                          <div className="p-5">
                            <div className="font-[800] text-[15px] tracking-[-0.01em] mb-1.5">{a.title}</div>
                            <p className="text-[12.5px] text-[var(--ink-soft)] leading-[1.6] mb-3">{a.description}</p>
                            <div className="text-[11px] text-[var(--ink-faint)] font-[600] uppercase tracking-wider">
                              Due {new Date(a.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                          </div>
                          <div className="flex items-center justify-center px-6 py-5 border-t-[2.5px] md:border-t-0 md:border-l-[2.5px] border-[var(--ink)] min-w-[130px]"
                            style={{ background: 'var(--paper-alt)' }}>
                            <span className="text-[10.5px] font-[800] uppercase tracking-wider px-3 py-1.5 border-[1.5px]"
                              style={{ color: s.color, background: s.bg, borderColor: s.border }}>
                              {s.label}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Sidebar ── */}
            <div className="space-y-8">
              {/* Important Dates */}
              <div>
                <div className="pb-4 border-b-[2.5px] border-[var(--ink)] mb-5">
                  <h2 className="font-[800] text-[16px] uppercase tracking-[-0.01em]">Key Dates</h2>
                </div>
                <div className="divide-y divide-[var(--line)]">
                  {IMPORTANT_DATES.map(d => (
                    <div key={d.title} className="py-4 grid grid-cols-[64px_1fr] gap-4">
                      <div className="border-[2px] border-[var(--ink)] flex items-center justify-center h-[48px] shrink-0"
                        style={{ background: 'var(--brutal-bg)' }}>
                        <span className="font-[800] text-[11px] text-white uppercase tracking-wider text-center leading-tight px-1">{d.date}</span>
                      </div>
                      <div>
                        <div className="font-[700] text-[13.5px] leading-snug">{d.title}</div>
                        <div className="text-[12px] text-[var(--ink-soft)] mt-0.5 leading-snug">{d.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div>
                <div className="pb-4 border-b-[2.5px] border-[var(--ink)] mb-5">
                  <h2 className="font-[800] text-[16px] uppercase tracking-[-0.01em]">Resources</h2>
                </div>
                <div className="space-y-2">
                  {RESOURCES.map(r => (
                    <div key={r.title} className="border-[2px] border-[var(--line)] p-4 hover:border-[var(--ink)] transition-colors">
                      <div className="font-[700] text-[13.5px]">{r.title}</div>
                      <div className="text-[11.5px] text-[var(--ink-soft)] mt-0.5">{r.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Applied Programs ── */}
          <div>
            <div className="pb-4 border-b-[2.5px] border-[var(--ink)] mb-6">
              <h2 className="font-[800] text-[20px] uppercase tracking-[-0.02em]">Applied Programs</h2>
              <p className="text-[13px] text-[var(--ink-soft)] mt-1 font-[500]">Programs you've applied for — status and updates.</p>
            </div>

            <div className="space-y-3">
              {APPLIED_PROGRAMS.map((p, i) => {
                const st = APP_STATUS_STYLES[p.status];
                return (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                    <div className="border-[2.5px] border-[var(--ink)] shadow-[5px_5px_0px_var(--ink)] bg-white hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0px_var(--ink)] transition-all">
                      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-0">
                        <div className="p-6">
                          <div className="font-[800] text-[16px] tracking-[-0.01em] mb-1">{p.name}</div>
                          <div className="text-[12px] text-[var(--ink-soft)] uppercase tracking-wider font-[600]">{p.type} · Applied {p.appliedDate}</div>
                          {p.hasUpdate && (
                            <SecretStatusWidget programName={p.name} updateDate={p.updateDate} />
                          )}
                        </div>
                        <div className="flex items-center justify-center px-7 py-6 border-t-[2.5px] md:border-t-0 md:border-l-[2.5px] border-[var(--ink)] min-w-[140px]"
                          style={{ background: 'var(--paper-alt)' }}>
                          <span className="text-[11px] font-[800] uppercase tracking-wider px-3 py-1.5 border-[1.5px]"
                            style={{ color: st.color, background: st.bg, borderColor: st.border }}>
                            {p.statusLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
