import React, { useState, useRef } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';
import logoImg from '@assets/Untitled_design-9_1783003171841.png';

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

const STATUS_STYLES = {
  upcoming:    { bg: '#eff6ff', color: '#1e40af', label: 'Upcoming',    border: '#93c5fd' },
  in_progress: { bg: '#fefce8', color: '#713f12', label: 'In Progress', border: '#fcd34d' },
  completed:   { bg: '#f0fdf4', color: '#166534', label: 'Completed',   border: '#86efac' },
};

const APP_STATUS_STYLES: Record<string, { color: string; bg: string; border: string; label: string }> = {
  draft:      { color: '#5c5876', bg: '#f7f6fd', border: '#ecebf7', label: 'Draft' },
  accepted:   { color: '#166534', bg: '#dcfce7', border: '#86efac', label: 'Accepted' },
  waitlisted: { color: '#1e40af', bg: '#dbeafe', border: '#93c5fd', label: 'Waitlisted' },
  rejected:   { color: '#991b1b', bg: '#fee2e2', border: '#fca5a5', label: 'Rejected' },
  pending:    { color: '#92400e', bg: '#fffbeb', border: '#fcd34d', label: 'Under Review' },
};

const FILTERS = ['all', 'upcoming', 'in_progress', 'completed'] as const;
type Filter = typeof FILTERS[number];

function deriveStatus(dueDate: string, done: boolean): 'upcoming' | 'in_progress' | 'completed' {
  if (done) return 'completed';
  const due = new Date(dueDate + 'T00:00:00');
  const now = new Date();
  const diffDays = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays <= 7) return 'in_progress';
  return 'upcoming';
}

function SecretStatusWidget({ programName, updateDate }: { programName: string; updateDate: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4">
      <button onClick={() => setOpen(o => !o)} className="flex items-center gap-2 text-left w-full group">
        <span className="w-[6px] h-[6px] rounded-full shrink-0 mt-[1px]" style={{ background: 'var(--ink)', opacity: open ? 1 : 0.35 }} />
        <span className="text-[11px] font-[600] tracking-[0.04em] transition-opacity" style={{ color: 'var(--ink-faint)', opacity: open ? 1 : 0.6 }}>
          {open ? 'Status Update' : '1 update'}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
            <div className="mt-3 border-[2px] border-[var(--ink)] shadow-[4px_4px_0px_var(--ink)] bg-white p-5">
              <div className="text-[10px] font-[800] uppercase tracking-[0.16em] text-[var(--ink-faint)] mb-2">Status Update</div>
              <p className="text-[13.5px] font-[500] text-[var(--ink-soft)] leading-relaxed mb-4">
                There has been a status update to{' '}
                <span className="font-[700] text-[var(--ink)]">{programName}</span>{' '}
                on {updateDate}.
              </p>
              <Link href="/congratulations" className="inline-flex items-center gap-1 text-[12.5px] font-[800] uppercase tracking-wider text-[var(--ink)] border-b-2 border-[var(--ink)] hover:opacity-60 transition-opacity">
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
  const { getMyAssignments, getMyPrograms, submissions, upsertSubmission } = useAdmin();
  const [filter, setFilter] = useState<Filter>('all');
  const [expandedAssignment, setExpandedAssignment] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

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
          <button onClick={login} className="w-full py-3 font-[800] text-[13px] uppercase tracking-wider text-white border-[2px] border-[var(--ink)] bg-[var(--ink)] hover:bg-transparent hover:text-[var(--ink)] transition-colors">Sign In</button>
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
          <p className="text-[14px] text-[var(--ink-soft)]">The Team Portal is reserved for GCL team members and administrators.</p>
        </div>
      </main>
    );
  }

  const memberId = user!.id;
  const displayName = user?.firstName || user?.email || 'Team Member';

  const myAssignments = getMyAssignments(memberId);
  const myPrograms = getMyPrograms(memberId);

  const assignmentsWithStatus = myAssignments.map(a => {
    const sub = submissions.find(s => s.assignmentId === a.id && s.memberId === memberId);
    const status = deriveStatus(a.dueDate, sub?.done ?? false);
    return { ...a, status, submission: sub ?? null };
  });

  const filtered = filter === 'all' ? assignmentsWithStatus : assignmentsWithStatus.filter(a => a.status === filter);

  const counts = {
    upcoming:    assignmentsWithStatus.filter(a => a.status === 'upcoming').length,
    in_progress: assignmentsWithStatus.filter(a => a.status === 'in_progress').length,
    completed:   assignmentsWithStatus.filter(a => a.status === 'completed').length,
  };

  const markDone = (assignmentId: string) => {
    const existing = submissions.find(s => s.assignmentId === assignmentId && s.memberId === memberId);
    upsertSubmission({
      assignmentId,
      memberId,
      memberName: displayName,
      done: !(existing?.done),
      fileName: existing?.fileName,
      fileSize: existing?.fileSize,
      note: existing?.note,
      submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    });
  };

  const handleFileUpload = (assignmentId: string, file: File) => {
    const existing = submissions.find(s => s.assignmentId === assignmentId && s.memberId === memberId);
    const sizeLabel = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;
    upsertSubmission({
      assignmentId,
      memberId,
      memberName: displayName,
      done: existing?.done ?? false,
      fileName: file.name,
      fileSize: sizeLabel,
      note: existing?.note,
      submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    });
  };

  return (
    <main className="min-h-screen pb-24">

      {/* ── Dark Hero Header ── */}
      <section className="pt-[80px] pb-0" style={{ background: 'var(--brutal-bg)' }}>
        <div className="max-w-[1160px] mx-auto px-8">

          {/* Top bar */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <Link href="/"><img src={logoImg} alt="GCL" className="h-8 object-contain" /></Link>
            <button onClick={logout} className="text-[12px] font-[700] uppercase tracking-wider text-white/50 hover:text-white transition-colors">Sign Out</button>
          </div>

          {/* Heading */}
          <div className="py-8 border-b border-white/10">
            <div className="text-[11px] font-[800] uppercase tracking-[0.16em] text-[var(--neon-cyan)] mb-3">GCL Team Portal</div>
            <h1 className="font-[800] text-[clamp(40px,6vw,72px)] leading-[0.9] tracking-[-0.04em] text-white uppercase">{displayName}.</h1>
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
                <div className="flex gap-1.5 flex-wrap">
                  {FILTERS.map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                      className="px-3 py-1.5 text-[11px] font-[800] uppercase tracking-wider transition-all border-[2px]"
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
                    const sub = a.submission;
                    const isExpanded = expandedAssignment === a.id;

                    return (
                      <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                        className="border-[2.5px] border-[var(--ink)] shadow-[5px_5px_0px_var(--ink)] bg-white hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0px_var(--ink)] transition-all">

                        {/* Main row */}
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto]">
                          <div className="p-5 cursor-pointer" onClick={() => setExpandedAssignment(isExpanded ? null : a.id)}>
                            <div className="flex items-start gap-2 mb-1.5 flex-wrap">
                              <span className="font-[800] text-[15px] tracking-[-0.01em]">{a.title}</span>
                              {a.category && (
                                <span className="text-[10px] font-[700] uppercase tracking-wider px-2 py-0.5 border-[1.5px] border-[var(--line)] text-[var(--ink-faint)] bg-[var(--paper-alt)]">{a.category}</span>
                              )}
                            </div>
                            <p className="text-[12.5px] text-[var(--ink-soft)] leading-[1.6] mb-3">{a.description}</p>
                            <div className="flex items-center gap-4 text-[11px] text-[var(--ink-faint)] font-[600] uppercase tracking-wider flex-wrap">
                              <span>Due {new Date(a.dueDate + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                              {sub?.fileName && <span className="text-[var(--ink-soft)]">📎 {sub.fileName}</span>}
                            </div>
                          </div>
                          <div className="flex flex-col items-center justify-center px-5 py-5 border-t-[2.5px] md:border-t-0 md:border-l-[2.5px] border-[var(--ink)] min-w-[130px] gap-3"
                            style={{ background: 'var(--paper-alt)' }}>
                            <span className="text-[10.5px] font-[800] uppercase tracking-wider px-3 py-1.5 border-[1.5px]"
                              style={{ color: s.color, background: s.bg, borderColor: s.border }}>
                              {s.label}
                            </span>
                            <span className="text-[10px] font-[700] text-[var(--ink-faint)] cursor-pointer hover:text-[var(--ink)] transition-colors"
                              onClick={() => setExpandedAssignment(isExpanded ? null : a.id)}>
                              {isExpanded ? '▲ Hide' : '▼ Actions'}
                            </span>
                          </div>
                        </div>

                        {/* Expandable actions */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden border-t-[2px] border-[var(--line)]"
                            >
                              <div className="p-5 flex items-center gap-4 flex-wrap">
                                {/* Mark Done */}
                                <button
                                  onClick={() => markDone(a.id)}
                                  className={`flex items-center gap-2 px-4 py-2.5 border-[2px] font-[800] text-[11px] uppercase tracking-wider transition-all ${
                                    sub?.done
                                      ? 'border-green-400 bg-green-50 text-green-700 hover:bg-green-100'
                                      : 'border-[var(--ink)] bg-[var(--ink)] text-white hover:bg-transparent hover:text-[var(--ink)]'
                                  }`}>
                                  {sub?.done ? '✓ Marked Done' : '◻ Mark as Done'}
                                </button>

                                {/* Upload File */}
                                <div>
                                  <input
                                    type="file"
                                    ref={el => { fileInputRefs.current[a.id] = el; }}
                                    className="hidden"
                                    onChange={e => {
                                      const file = e.target.files?.[0];
                                      if (file) handleFileUpload(a.id, file);
                                      e.target.value = '';
                                    }}
                                  />
                                  <button
                                    onClick={() => fileInputRefs.current[a.id]?.click()}
                                    className="flex items-center gap-2 px-4 py-2.5 border-[2px] border-[var(--line)] font-[800] text-[11px] uppercase tracking-wider text-[var(--ink-soft)] hover:border-[var(--ink)] hover:text-[var(--ink)] transition-all">
                                    📎 {sub?.fileName ? 'Replace File' : 'Upload File'}
                                  </button>
                                </div>

                                {/* Submitted info */}
                                {sub && (
                                  <div className="text-[11.5px] text-[var(--ink-soft)]">
                                    {sub.fileName && <span>File: <span className="font-[700]">{sub.fileName}</span> ({sub.fileSize}) · </span>}
                                    {sub.submittedAt && <span>Updated {sub.submittedAt}</span>}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Sidebar ── */}
            <div className="space-y-8">
              {/* Key Dates */}
              <div>
                <div className="pb-4 border-b-[2.5px] border-[var(--ink)] mb-5">
                  <h2 className="font-[800] text-[16px] uppercase tracking-[-0.01em]">Key Dates</h2>
                </div>
                <div className="divide-y divide-[var(--line)]">
                  {IMPORTANT_DATES.map(d => (
                    <div key={d.title} className="py-4 grid grid-cols-[64px_1fr] gap-4">
                      <div className="border-[2px] border-[var(--ink)] flex items-center justify-center h-[48px] shrink-0" style={{ background: 'var(--brutal-bg)' }}>
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

            {myPrograms.length === 0 ? (
              <div className="border-[2.5px] border-[var(--line)] py-12 text-center">
                <p className="text-[14px] text-[var(--ink-soft)] font-[600] uppercase tracking-wider">No program applications on record.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myPrograms.map(({ program: p, applicant: ap }, i) => {
                  const st = APP_STATUS_STYLES[ap.decision];
                  const hasUpdate = ap.decision !== 'pending';

                  return (
                    <motion.div key={p.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                      <div className="border-[2.5px] border-[var(--ink)] shadow-[5px_5px_0px_var(--ink)] bg-white hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0px_var(--ink)] transition-all">
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-0">
                          <div className="p-6">
                            <div className="font-[800] text-[16px] tracking-[-0.01em] mb-1">{p.name}</div>
                            <div className="text-[12px] text-[var(--ink-soft)] uppercase tracking-wider font-[600]">{p.type} · Applied {ap.appliedDate}</div>
                            {hasUpdate && (
                              <SecretStatusWidget programName={p.name} updateDate={ap.decisionDate ?? ''} />
                            )}
                          </div>
                          <div className="flex items-center justify-center px-7 py-6 border-t-[2.5px] md:border-t-0 md:border-l-[2.5px] border-[var(--ink)] min-w-[140px]"
                            style={{ background: 'var(--paper-alt)' }}>
                            <span className="text-[11px] font-[800] uppercase tracking-wider px-3 py-1.5 border-[1.5px]"
                              style={{ color: st.color, background: st.bg, borderColor: st.border }}>
                              {st.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </section>
    </main>
  );
}
