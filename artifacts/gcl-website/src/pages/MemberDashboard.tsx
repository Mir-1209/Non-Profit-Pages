import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';
import { useCertificates } from '../context/CertificateContext';
import logoImg from '@assets/Untitled_design-9_1783003171841.png';

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, '') ?? '';

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full h-[5px] bg-[var(--line)] mt-2">
      <div className="h-full bg-[var(--ink)]" style={{ width: `${progress}%` }} />
    </div>
  );
}

const STATUS_STYLES: Record<string, { color: string; bg: string; border: string; label: string }> = {
  accepted:   { color: '#166534', bg: '#dcfce7', border: '#86efac', label: 'Accepted' },
  waitlisted: { color: '#1e40af', bg: '#dbeafe', border: '#93c5fd', label: 'Waitlisted' },
  rejected:   { color: '#991b1b', bg: '#fee2e2', border: '#fca5a5', label: 'Rejected' },
  pending:    { color: '#92400e', bg: '#fffbeb', border: '#fcd34d', label: 'Under Review' },
  draft:      { color: '#5c5876', bg: '#f7f6fd', border: '#ecebf7', label: 'Draft' },
};

const UPDATES = [
  { title: 'New course launched: Money & Power Dynamics', date: 'Jun 28, 2026' },
  { title: 'GCL Summit registrations now open', date: 'Jun 20, 2026' },
  { title: 'Chapter applications close July 15', date: 'Jun 10, 2026' },
];

function SecretStatusWidget({ programName, updateDate }: { programName: string; updateDate: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-2">
      <button onClick={() => setOpen(o => !o)} className="flex items-center gap-2 text-left w-full group">
        <span className="w-[6px] h-[6px] rounded-full shrink-0 mt-[1px]" style={{ background: 'var(--ink)', opacity: open ? 1 : 0.35 }} />
        <span className="text-[11px] font-[600] tracking-[0.04em] transition-opacity" style={{ color: 'var(--ink-faint)', opacity: open ? 1 : 0.6 }}>
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
              <div className="text-[10px] font-[800] uppercase tracking-[0.16em] text-[var(--ink-faint)] mb-2">Status Update</div>
              <p className="text-[13.5px] font-[500] text-[var(--ink-soft)] leading-relaxed mb-4">
                There has been a status update to{' '}
                <span className="font-[700] text-[var(--ink)]">{programName}</span>{' '}
                on {updateDate}.
              </p>
              <Link href={`${BASE}/congratulations`} className="inline-flex items-center gap-1 text-[12.5px] font-[800] uppercase tracking-wider text-[var(--ink)] border-b-2 border-[var(--ink)] hover:opacity-60 transition-opacity">
                View Update
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CertificateCard({ cert, onCopy, copied }: {
  cert: ReturnType<ReturnType<typeof useCertificates>['getMyCertificates']>[number];
  onCopy: () => void;
  copied: boolean;
}) {
  const certUrl = `${window.location.origin}${BASE}/certificate/${cert.token}`;

  return (
    <div className={`border-[2px] border-[var(--ink)] shadow-[4px_4px_0px_var(--ink)] bg-white ${cert.revoked ? 'opacity-50' : ''}`}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-[800] font-mono text-[12px] tracking-wider text-[var(--ink-soft)]">{cert.id}</span>
              {cert.revoked ? (
                <span className="text-[9px] font-[800] uppercase tracking-wider px-1.5 py-0.5 border border-red-200 text-red-500 bg-red-50">Revoked</span>
              ) : cert.visibility === 'link' ? (
                <span className="text-[9px] font-[800] uppercase tracking-wider px-1.5 py-0.5 border border-blue-200 text-blue-600 bg-blue-50">🔗 Shareable</span>
              ) : (
                <span className="text-[9px] font-[800] uppercase tracking-wider px-1.5 py-0.5 border border-[var(--line)] text-[var(--ink-soft)]">🔒 Private</span>
              )}
            </div>
            <div className="font-[700] text-[14px]">{cert.programName}</div>
            <div className="text-[11.5px] text-[var(--ink-faint)] mt-0.5">Issued {cert.issueDate}</div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[10px] font-[700] uppercase tracking-wider text-[var(--ink-faint)]">{cert.viewCount} view{cert.viewCount !== 1 ? 's' : ''}</div>
          </div>
        </div>

        {!cert.revoked && (
          <div className="flex gap-2 flex-wrap mt-4 pt-4 border-t border-[var(--line)]">
            <Link
              href={`${BASE}/certificate/${cert.token}`}
              className="px-4 py-2 border-[2px] border-[var(--ink)] bg-[var(--ink)] text-white font-[800] text-[10px] uppercase tracking-wider hover:bg-transparent hover:text-[var(--ink)] transition-colors"
            >
              View →
            </Link>
            {cert.visibility === 'link' && (
              <button
                onClick={onCopy}
                className={`px-4 py-2 border-[2px] font-[800] text-[10px] uppercase tracking-wider transition-all ${
                  copied ? 'border-green-300 text-green-600 bg-green-50' : 'border-[var(--line)] text-[var(--ink-soft)] hover:border-[var(--ink)] hover:text-[var(--ink)]'
                }`}
              >
                {copied ? '✓ Copied!' : '🔗 Copy Link'}
              </button>
            )}
            <button
              onClick={() => window.print()}
              className="px-4 py-2 border-[2px] border-[var(--line)] text-[var(--ink-soft)] font-[800] text-[10px] uppercase tracking-wider hover:border-[var(--ink)] hover:text-[var(--ink)] transition-all"
            >
              Print / PDF
            </button>
          </div>
        )}
        {cert.visibility === 'private' && !cert.revoked && (
          <div className="mt-3 px-3 py-2 bg-amber-50 border border-amber-200 text-[11px] font-[600] text-amber-700">
            🔒 Private — only you can view. Contact admin to make it shareable.
          </div>
        )}
      </div>
    </div>
  );
}

export function MemberDashboard() {
  const { isAuthenticated, isLoading, user, profile, login, logout } = useAppAuth();
  const { courses: allCourses, getMyPrograms } = useAdmin();
  const { getMyCertificates, getMyCongratPages, updateCertificate } = useCertificates();
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

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
          <p className="text-[14px] text-[var(--ink-soft)] mb-7">Track your courses, certificates, and program updates in one place.</p>
          <button onClick={login} className="w-full py-3 font-[800] text-[13px] uppercase tracking-wider text-white border-[2px] border-[var(--ink)] bg-[var(--ink)] hover:bg-transparent hover:text-[var(--ink)] transition-colors">Sign In</button>
        </div>
      </main>
    );
  }

  const memberId = user!.id;
  const displayName = user?.firstName || user?.email || 'Member';
  const enrolledCourses = profile?.courses ?? [];
  const joinedAt = profile?.joinedAt ? new Date(profile.joinedAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : '—';
  const getCourse = (slug: string) => allCourses.find(c => c.slug === slug);

  const myPrograms = getMyPrograms(memberId);
  const myCertificates = getMyCertificates(memberId);
  const myCongratPages = getMyCongratPages(memberId).filter(p => !p.revoked && (!p.expiresAt || new Date(p.expiresAt) >= new Date()));

  const copyLink = async (token: string) => {
    await navigator.clipboard.writeText(`${window.location.origin}${BASE}/certificate/${token}`);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2200);
  };

  return (
    <main className="min-h-screen pb-24">

      {/* ── Dark Hero Header ── */}
      <section className="pt-[80px] pb-0" style={{ background: 'var(--brutal-bg)' }}>
        <div className="max-w-[1160px] mx-auto px-8">

          {/* Top bar */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <Link href={`${BASE}/`}><img src={logoImg} alt="GCL" className="h-8 object-contain" /></Link>
            <button onClick={logout} className="text-[12px] font-[700] uppercase tracking-wider text-white/50 hover:text-white transition-colors">Sign Out</button>
          </div>

          {/* Heading */}
          <div className="py-8 border-b border-white/10">
            <div className="text-[11px] font-[800] uppercase tracking-[0.16em] text-[var(--neon-cyan)] mb-3">Member Dashboard</div>
            <h1 className="font-[800] text-[clamp(40px,6vw,72px)] leading-[0.9] tracking-[-0.04em] text-white uppercase">{displayName}.</h1>
            <p className="text-[14px] text-white/40 font-[500] mt-3">Member since {joinedAt}</p>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-4 divide-x divide-white/10 py-5">
            {[
              { n: enrolledCourses.length, label: 'Courses Enrolled' },
              { n: enrolledCourses.filter(c => c.completed).length, label: 'Completed' },
              { n: myCertificates.filter(c => !c.revoked).length, label: 'Certificates' },
              { n: myCongratPages.length, label: 'Offers' },
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

            {/* ── My Courses ── */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b-[2.5px] border-[var(--ink)] mb-6">
                <h2 className="font-[800] text-[20px] uppercase tracking-[-0.02em]">My Courses</h2>
                <Link href={`${BASE}/courses`} className="text-[12px] font-[800] uppercase tracking-wider text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors">Browse Catalog →</Link>
              </div>

              {enrolledCourses.length === 0 ? (
                <div className="border-[2.5px] border-[var(--line)] py-12 text-center">
                  <div className="font-[700] text-[15px] text-[var(--ink-soft)] mb-4">No courses enrolled yet.</div>
                  <Link href={`${BASE}/courses`} className="inline-block px-5 py-2.5 border-[2px] border-[var(--ink)] bg-[var(--ink)] text-white text-[12px] font-[800] uppercase tracking-wider hover:bg-transparent hover:text-[var(--ink)] transition-colors">
                    Explore Courses
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {enrolledCourses.map((ec, i) => {
                    const c = getCourse(ec.courseSlug);
                    return (
                      <motion.div key={ec.courseSlug} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className="border-[2.5px] border-[var(--ink)] shadow-[5px_5px_0px_var(--ink)] bg-white hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0px_var(--ink)] transition-all">
                        <div className="grid grid-cols-[1fr_auto] gap-0">
                          <div className="p-5">
                            <div className="font-[800] text-[15px] tracking-[-0.01em] mb-1">{c?.title ?? ec.courseSlug}</div>
                            <div className="text-[12px] text-[var(--ink-soft)] uppercase tracking-wider">{c?.level ?? ''}{c?.duration ? ` · ${c.duration}` : ''}</div>
                            <ProgressBar progress={ec.progress} />
                            <div className="text-[11px] text-[var(--ink-faint)] font-[600] mt-1.5">{ec.progress}% complete</div>
                          </div>
                          <div className="flex items-center p-5 border-l-[2.5px] border-[var(--ink)]" style={{ background: 'var(--paper-alt)' }}>
                            {ec.completed ? (
                              <span className="text-[11px] font-[800] uppercase tracking-wider text-[#166534]">Done</span>
                            ) : (
                              <Link href={`${BASE}/courses/${ec.courseSlug}/learn`} className="text-[11px] font-[800] uppercase tracking-wider text-[var(--ink)] hover:underline underline-offset-2">
                                Continue →
                              </Link>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Sidebar ── */}
            <div className="space-y-7">

              {/* My Certificates */}
              <div>
                <div className="flex items-center justify-between pb-4 border-b-[2.5px] border-[var(--ink)] mb-5">
                  <h2 className="font-[800] text-[16px] uppercase tracking-[-0.01em]">My Certificates</h2>
                  <Link href={`${BASE}/verify`} className="text-[11px] font-[700] uppercase tracking-wider text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors">Verify ↗</Link>
                </div>

                {myCertificates.length === 0 ? (
                  <p className="text-[13px] text-[var(--ink-soft)]">No certificates issued yet. Complete a program to earn one.</p>
                ) : (
                  <div className="space-y-3">
                    {myCertificates.map(cert => (
                      <CertificateCard
                        key={cert.id}
                        cert={cert}
                        onCopy={() => copyLink(cert.token)}
                        copied={copiedToken === cert.token}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Congratulations Pages */}
              {myCongratPages.length > 0 && (
                <div>
                  <div className="pb-4 border-b-[2.5px] border-[var(--ink)] mb-5">
                    <h2 className="font-[800] text-[16px] uppercase tracking-[-0.01em]">Acceptance Letters</h2>
                  </div>
                  <div className="space-y-2.5">
                    {myCongratPages.map(p => (
                      <Link key={p.id} href={`${BASE}/congratulations/${p.token}`}
                        className="block border-[2px] border-[var(--ink)] shadow-[3px_3px_0px_var(--ink)] bg-white p-4 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_var(--ink)] transition-all">
                        <div className="font-[700] text-[13.5px]">{p.programName}</div>
                        <div className="text-[11.5px] text-[var(--ink-faint)] mt-0.5">Personal letter from GCL → View</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Program Updates */}
              <div>
                <div className="pb-4 border-b-[2.5px] border-[var(--ink)] mb-5">
                  <h2 className="font-[800] text-[16px] uppercase tracking-[-0.01em]">Program Updates</h2>
                </div>
                <div className="divide-y divide-[var(--line)]">
                  {UPDATES.map(u => (
                    <div key={u.title} className="py-3.5">
                      <div className="font-[600] text-[13px] leading-snug text-[var(--ink)]">{u.title}</div>
                      <div className="text-[11.5px] text-[var(--ink-faint)] mt-1">{u.date}</div>
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
                <p className="text-[14px] text-[var(--ink-soft)] font-[700] uppercase tracking-wider">No program applications on record.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myPrograms.map(({ program: p, applicant: ap }, i) => {
                  const st = STATUS_STYLES[ap.decision];
                  const hasUpdate = ap.decision !== 'pending' && ap.decision !== 'draft';
                  const linkTarget = `${BASE}/apply/${p.slug ?? p.id}`;

                  return (
                    <motion.div key={p.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                      <div className="border-[2.5px] border-[var(--ink)] shadow-[5px_5px_0px_var(--ink)] bg-white hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0px_var(--ink)] transition-all">
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-0">
                          <div className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="flex-1">
                                <div className="font-[800] text-[16px] tracking-[-0.01em] mb-1">{p.name}</div>
                                <div className="text-[12px] text-[var(--ink-soft)] uppercase tracking-wider font-[600]">
                                  {p.type} · {ap.decision === 'draft' ? 'Started' : 'Applied'} {ap.appliedDate}
                                </div>
                              </div>
                            </div>
                            {hasUpdate && (
                              <div className="mt-4">
                                <SecretStatusWidget programName={p.name} updateDate={ap.decisionDate ?? ''} />
                              </div>
                            )}
                            <div className="mt-4">
                              {ap.decision === 'draft' ? (
                                <Link href={linkTarget} className="inline-flex items-center gap-1.5 text-[12px] font-[800] uppercase tracking-wider text-[var(--ink)] underline underline-offset-2 hover:opacity-70 transition-opacity">
                                  Continue Draft →
                                </Link>
                              ) : (
                                <Link href={linkTarget} className="inline-flex items-center gap-1.5 text-[12px] font-[800] uppercase tracking-wider text-[var(--ink-soft)] underline underline-offset-2 hover:text-[var(--ink)] transition-colors">
                                  View Application →
                                </Link>
                              )}
                            </div>
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
