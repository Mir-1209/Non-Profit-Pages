import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppAuth } from '../context/AuthContext';
import { useListTeamAssignments, getListTeamAssignmentsQueryKey } from '@workspace/api-client-react';
import { TeamAssignmentStatus } from '@workspace/api-client-react';

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  upcoming: { bg: '#eff6ff', color: '#2563eb', label: 'Upcoming' },
  in_progress: { bg: '#fff7ed', color: '#ea580c', label: 'In Progress' },
  completed: { bg: '#f0fdf4', color: '#16a34a', label: 'Completed' },
};

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

export function TeamPortal() {
  const { isAuthenticated, isLoading, isTeam, user, logout, login } = useAppAuth();
  const [filter, setFilter] = useState<'all' | TeamAssignmentStatus>('all');
  const { data, isLoading: assignmentsLoading } = useListTeamAssignments({ query: { enabled: isAuthenticated && isTeam, queryKey: getListTeamAssignmentsQueryKey() } });

  if (isLoading) {
    return <main className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-[var(--line)] border-t-[var(--violet)] rounded-full animate-spin" /></main>;
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-[380px]">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="font-[800] text-[24px] mb-2">Sign in to view the Team Portal</h2>
          <p className="text-[var(--ink-soft)] mb-6 text-[14px]">This portal is reserved for GCL volunteers and staff.</p>
          <button onClick={login} className="btn btn-dark">Sign In</button>
        </div>
      </main>
    );
  }

  if (!isTeam) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-[380px]">
          <div className="text-5xl mb-4">🚫</div>
          <h2 className="font-[800] text-[24px] mb-2">Team Access Only</h2>
          <p className="text-[var(--ink-soft)] mb-6 text-[14px]">The Team Portal is only available to GCL Team members and admins. If you believe this is a mistake, contact an administrator.</p>
        </div>
      </main>
    );
  }

  const assignments = data?.assignments ?? [];
  const filtered = filter === 'all' ? assignments : assignments.filter(a => a.status === filter);
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.email || 'Team Member';

  return (
    <main className="min-h-screen px-5 md:px-10 py-10 md:py-14" style={{ background: 'var(--paper-alt)' }}>
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-[700] tracking-[0.08em] uppercase mb-3" style={{ background: 'var(--pill-bg)', color: 'var(--pill-ink)' }}>
              GCL Team Portal
            </div>
            <h1 className="font-[800] text-[26px] tracking-[-0.02em]">Welcome, {displayName.split(' ')[0]} 👋</h1>
            <p className="text-[13.5px] text-[var(--ink-soft)] mt-1">View your assignments, key dates, and volunteer resources — read-only access.</p>
          </div>
          <button onClick={logout} className="px-4 py-2.5 rounded-[10px] font-[700] text-[13.5px] text-red-500 hover:bg-red-100/60 transition-colors self-start md:self-auto">Log Out</button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
          {/* Assignments */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-[18px] border-[2px] border-[var(--line)] shadow-[4px_4px_0px_var(--ink)] p-6">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <h2 className="font-[800] text-[19px]">My Assignments</h2>
              <div className="flex gap-1.5">
                {(['all', 'upcoming', 'in_progress', 'completed'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className="px-3 py-1.5 rounded-[8px] text-[12px] font-[700] transition-colors"
                    style={filter === f
                      ? { background: 'var(--ink)', color: 'white' }
                      : { background: 'var(--paper-alt)', color: 'var(--ink-soft)' }}
                  >
                    {f === 'all' ? 'All' : STATUS_STYLES[f].label}
                  </button>
                ))}
              </div>
            </div>

            {assignmentsLoading ? (
              <div className="py-10 flex justify-center"><div className="w-6 h-6 border-2 border-[var(--line)] border-t-[var(--violet)] rounded-full animate-spin" /></div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-[14px] text-[var(--ink-soft)]">No assignments {filter !== 'all' ? `in "${STATUS_STYLES[filter]?.label}"` : ''} right now.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filtered.map((a, i) => {
                  const s = STATUS_STYLES[a.status];
                  return (
                    <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                      className="p-4 rounded-[14px]" style={{ background: 'var(--paper-alt)' }}>
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <div className="font-[700] text-[14.5px]">{a.title}</div>
                        <span className="text-[10.5px] font-[800] px-2.5 py-1 rounded-full shrink-0" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                      </div>
                      <p className="text-[13px] text-[var(--ink-soft)] leading-relaxed mb-2">{a.description}</p>
                      <div className="text-[11.5px] text-[var(--ink-faint)] font-[600]">Due {new Date(a.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
              className="bg-white rounded-[18px] border-[2px] border-[var(--line)] p-6">
              <h2 className="font-[800] text-[16px] mb-4">📅 Important Dates</h2>
              <div className="flex flex-col gap-4">
                {IMPORTANT_DATES.map(d => (
                  <div key={d.title} className="flex gap-3">
                    <div className="w-11 h-11 rounded-[10px] flex flex-col items-center justify-center shrink-0" style={{ background: 'var(--pill-bg)' }}>
                      <div className="font-[800] text-[13px] leading-none" style={{ color: 'var(--pill-ink)' }}>{d.date.split(' ')[1].replace(',', '')}</div>
                      <div className="text-[8px] font-[700] uppercase" style={{ color: 'var(--pill-ink)', opacity: 0.75 }}>{d.date.split(' ')[0]}</div>
                    </div>
                    <div>
                      <div className="font-[700] text-[13px] leading-snug">{d.title}</div>
                      <div className="text-[11.5px] text-[var(--ink-faint)] leading-snug mt-0.5">{d.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
              className="bg-white rounded-[18px] border-[2px] border-[var(--line)] p-6">
              <h2 className="font-[800] text-[16px] mb-4">📎 Resources</h2>
              <div className="flex flex-col gap-2.5">
                {RESOURCES.map(r => (
                  <div key={r.title} className="flex items-center gap-3 p-3 rounded-[10px]" style={{ background: 'var(--paper-alt)' }}>
                    <span className="text-lg shrink-0">{r.icon}</span>
                    <div className="min-w-0">
                      <div className="font-[700] text-[13px] truncate">{r.title}</div>
                      <div className="text-[11px] text-[var(--ink-faint)]">{r.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="rounded-[14px] p-4 text-[12px] text-[var(--ink-faint)] leading-relaxed" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
              You have view-only access to this portal. Reach out to a GCL admin if you need to update assignment details.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
