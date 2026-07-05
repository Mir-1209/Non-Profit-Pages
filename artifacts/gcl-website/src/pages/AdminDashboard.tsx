import React, { useState, useRef } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin, GCL_TEAM_MEMBERS, Assignment, AssignmentSubmission, Program, ProgramApplicant } from '../context/AdminContext';
import { useAppAuth } from '../context/AuthContext';
import { useCertificates, generateToken, generateCertId, Certificate, CongratPage } from '../context/CertificateContext';
import { Event } from '../data/events';
import { Course } from '../data/courses';
import { NewsPost } from '../data/news';
import logoImg from '@assets/Untitled_design-9_1783003171841.png';

type Section = 'overview' | 'assignments' | 'programs' | 'events' | 'courses' | 'news' | 'members' | 'certificates' | 'congrats';

const NAV: { id: Section; label: string; icon: string }[] = [
  { id: 'overview',      label: 'Overview',       icon: '◈' },
  { id: 'assignments',   label: 'Assignments',    icon: '◧' },
  { id: 'programs',      label: 'Programs',       icon: '◉' },
  { id: 'certificates',  label: 'Certificates',   icon: '◆' },
  { id: 'congrats',      label: 'Congrats Pages', icon: '★' },
  { id: 'events',        label: 'Events',         icon: '◻' },
  { id: 'courses',       label: 'Courses',        icon: '◫' },
  { id: 'news',          label: 'News',           icon: '◨' },
  { id: 'members',       label: 'Members',        icon: '◎' },
];

const SITE_LINKS: { label: string; href: string }[] = [
  { label: 'Home', href: '/' },
  { label: 'Events', href: '/events' },
  { label: 'Courses', href: '/courses' },
  { label: 'Chapters', href: '/chapters' },
  { label: 'News', href: '/news' },
];

// ── Shared primitives ────────────────────────────────────────────────────────

function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-black/60 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className={`bg-white border-[2.5px] border-[var(--ink)] shadow-[10px_10px_0px_var(--ink)] w-full ${wide ? 'max-w-[720px]' : 'max-w-[560px]'} mb-8`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-7 py-5 border-b-[2px] border-[var(--ink)] bg-[var(--ink)]">
          <h3 className="font-[800] text-[15px] tracking-[0.06em] uppercase text-white">{title}</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center text-white/60 hover:text-white font-[700] text-[18px] transition-colors">×</button>
        </div>
        <div className="p-7">{children}</div>
      </motion.div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-[11px] font-[800] uppercase tracking-[0.1em] text-[var(--ink)] mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-4 py-3 border-[2px] border-[var(--line)] text-[14px] font-[500] outline-none transition-all focus:border-[var(--ink)] bg-white";
const selectCls = `${inputCls} cursor-pointer`;
const btnPrimary = "px-5 py-3 border-[2px] border-[var(--ink)] bg-[var(--ink)] text-white font-[800] text-[11px] uppercase tracking-wider hover:bg-transparent hover:text-[var(--ink)] transition-colors";
const btnSecondary = "px-5 py-3 border-[2px] border-[var(--line)] text-[var(--ink)] font-[800] text-[11px] uppercase tracking-wider hover:border-[var(--ink)] transition-colors";
const btnDanger = "px-3 py-1.5 border-[2px] border-red-200 text-red-500 font-[800] text-[10px] uppercase tracking-wider hover:bg-red-50 transition-colors";
const btnEdit = "px-3 py-1.5 border-[2px] border-[var(--line)] text-[var(--ink-soft)] font-[800] text-[10px] uppercase tracking-wider hover:border-[var(--ink)] hover:text-[var(--ink)] transition-colors";

function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between pb-5 border-b-[3px] border-[var(--ink)] mb-6">
      <h2 className="font-[800] text-[22px] uppercase tracking-[-0.01em]">{title}</h2>
      {action}
    </div>
  );
}

// ── Overview ─────────────────────────────────────────────────────────────────

function OverviewSection() {
  const { events, courses, news, users, assignments, programs } = useAdmin();
  const totalApplicants = programs.reduce((s, p) => s + p.applicants.length, 0);
  const pendingDecisions = programs.reduce((s, p) => s + p.applicants.filter(a => a.decision === 'pending').length, 0);

  const stats = [
    { label: 'Members', value: users.length, accent: '#3358ff' },
    { label: 'Events', value: events.length, accent: '#e93fc7' },
    { label: 'Courses', value: courses.length, accent: '#8b5cf6' },
    { label: 'News Posts', value: news.filter(n => n.published).length, accent: '#16a34a' },
    { label: 'Assignments', value: assignments.length, accent: '#d97706' },
    { label: 'Programs', value: programs.length, accent: '#0891b2' },
    { label: 'Applicants', value: totalApplicants, accent: '#dc2626' },
    { label: 'Pending Decisions', value: pendingDecisions, accent: pendingDecisions > 0 ? '#dc2626' : '#16a34a' },
  ];

  return (
    <div>
      <SectionHeader title="Overview" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="border-[2.5px] border-[var(--ink)] shadow-[5px_5px_0px_var(--ink)] bg-white p-5">
            <div className="font-[800] text-[36px] tracking-[-0.03em] leading-none" style={{ color: s.accent }}>{s.value}</div>
            <div className="text-[11px] font-[700] uppercase tracking-wider text-[var(--ink-soft)] mt-2">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border-[2.5px] border-[var(--ink)] shadow-[5px_5px_0px_var(--ink)] bg-white p-6">
          <h3 className="font-[800] text-[13px] uppercase tracking-wider mb-4 border-b-[2px] border-[var(--ink)] pb-3">Recent Programs — Pending Decisions</h3>
          {pendingDecisions === 0 ? (
            <p className="text-[13px] text-[var(--ink-soft)]">All applicants have received decisions.</p>
          ) : (
            <div className="space-y-3">
              {programs.flatMap(p => p.applicants.filter(a => a.decision === 'pending').map(a => (
                <div key={a.id} className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-[700] text-[13px]">{a.name}</div>
                    <div className="text-[11px] text-[var(--ink-faint)]">{p.name}</div>
                  </div>
                  <span className="text-[10px] font-[800] uppercase tracking-wider px-2 py-1 border-[1.5px] border-amber-300 text-amber-700 bg-amber-50">Pending</span>
                </div>
              )))}
            </div>
          )}
        </div>

        <div className="border-[2.5px] border-[var(--ink)] shadow-[5px_5px_0px_var(--ink)] bg-white p-6">
          <h3 className="font-[800] text-[13px] uppercase tracking-wider mb-4 border-b-[2px] border-[var(--ink)] pb-3">Quick Links — Live Site</h3>
          <div className="grid grid-cols-2 gap-2">
            {[...SITE_LINKS, { label: 'Team Portal', href: '/portal' }, { label: 'Member Dashboard', href: '/dashboard' }].map(l => (
              <Link key={l.href} href={l.href}
                className="flex items-center gap-2 px-3 py-2.5 border-[2px] border-[var(--line)] font-[700] text-[12px] hover:border-[var(--ink)] hover:bg-[var(--paper-alt)] transition-all">
                ↗ {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Assignments ───────────────────────────────────────────────────────────────

function getMemberName(id: string) {
  return GCL_TEAM_MEMBERS.find(m => m.id === id)?.name ?? id;
}

function AssignmentsSection() {
  const { assignments, addAssignment, updateAssignment, deleteAssignment, submissions } = useAdmin();
  const [modal, setModal] = useState<null | 'add' | Assignment>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Assignment & { assignedAll: boolean; assignedIds: string[] }>>({});

  const openAdd = () => {
    setForm({ id: `a${Date.now()}`, title: '', description: '', dueDate: '', category: 'General', assignedTo: 'all', assignedAll: true, assignedIds: [], createdAt: new Date().toISOString().split('T')[0] });
    setModal('add');
  };
  const openEdit = (a: Assignment) => {
    setForm({ ...a, assignedAll: a.assignedTo === 'all', assignedIds: Array.isArray(a.assignedTo) ? a.assignedTo : [] });
    setModal(a);
  };
  const close = () => setModal(null);

  const save = () => {
    if (!form.title || !form.dueDate) return;
    const a: Assignment = {
      id: form.id!,
      title: form.title!,
      description: form.description ?? '',
      dueDate: form.dueDate!,
      category: form.category ?? 'General',
      assignedTo: form.assignedAll ? 'all' : (form.assignedIds ?? []),
      createdAt: form.createdAt ?? new Date().toISOString().split('T')[0],
    };
    if (modal === 'add') addAssignment(a); else updateAssignment(a);
    close();
  };

  const toggleMember = (id: string) => {
    setForm(p => {
      const ids = p.assignedIds ?? [];
      return { ...p, assignedIds: ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id] };
    });
  };

  const getSubmissionsFor = (assignmentId: string) => submissions.filter(s => s.assignmentId === assignmentId);

  const getAssignedMembers = (a: Assignment): { id: string; name: string }[] => {
    if (a.assignedTo === 'all') return GCL_TEAM_MEMBERS;
    return a.assignedTo.map(id => ({ id, name: getMemberName(id) }));
  };

  return (
    <div>
      <SectionHeader title="Assignments" action={
        <button onClick={openAdd} className={btnPrimary}>+ New Assignment</button>
      } />

      {assignments.length === 0 ? (
        <div className="border-[2.5px] border-[var(--line)] py-16 text-center">
          <p className="text-[14px] font-[700] uppercase tracking-wider text-[var(--ink-soft)]">No assignments yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map((a, i) => {
            const subs = getSubmissionsFor(a.id);
            const members = getAssignedMembers(a);
            const doneCount = subs.filter(s => s.done).length;
            const isOpen = expanded === a.id;

            return (
              <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="border-[2.5px] border-[var(--ink)] shadow-[5px_5px_0px_var(--ink)] bg-white">
                {/* Header row */}
                <div className="flex items-start gap-4 p-5 cursor-pointer" onClick={() => setExpanded(isOpen ? null : a.id)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <span className="font-[800] text-[14px] tracking-[-0.01em]">{a.title}</span>
                      <span className="text-[10px] font-[800] uppercase tracking-wider px-2 py-0.5 bg-[var(--paper-alt)] border-[1.5px] border-[var(--line)] text-[var(--ink-soft)]">{a.category}</span>
                      {a.assignedTo === 'all' && (
                        <span className="text-[10px] font-[800] uppercase tracking-wider px-2 py-0.5 border-[1.5px] border-blue-200 text-blue-600 bg-blue-50">All Team</span>
                      )}
                    </div>
                    <p className="text-[12.5px] text-[var(--ink-soft)] leading-[1.5] mb-2">{a.description}</p>
                    <div className="flex items-center gap-4 text-[11px] text-[var(--ink-faint)] font-[600] uppercase tracking-wider">
                      <span>Due {new Date(a.dueDate + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span>·</span>
                      <span style={{ color: doneCount === members.length && members.length > 0 ? '#16a34a' : 'var(--ink-faint)' }}>
                        {doneCount}/{members.length} Done
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={e => { e.stopPropagation(); openEdit(a); }} className={btnEdit}>Edit</button>
                    <button onClick={e => { e.stopPropagation(); deleteAssignment(a.id); }} className={btnDanger}>Delete</button>
                    <span className="text-[var(--ink-soft)] font-[700] ml-1">{isOpen ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Submission tracker */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t-[2px] border-[var(--line)]"
                    >
                      <div className="p-5">
                        <div className="text-[10px] font-[800] uppercase tracking-[0.12em] text-[var(--ink-faint)] mb-3">Submission Tracker</div>
                        <div className="space-y-2">
                          {members.map(m => {
                            const sub = subs.find(s => s.memberId === m.id);
                            return (
                              <div key={m.id} className="flex items-center gap-3 px-4 py-3 border-[1.5px] border-[var(--line)] bg-[var(--paper-alt)]">
                                <div className="w-2 h-2 border-[1.5px] border-[var(--ink)] shrink-0"
                                  style={{ background: sub?.done ? 'var(--ink)' : 'transparent' }} />
                                <div className="flex-1 min-w-0">
                                  <span className="font-[700] text-[13px]">{m.name}</span>
                                  {sub?.fileName && (
                                    <span className="ml-2 text-[11px] text-[var(--ink-soft)]">📎 {sub.fileName} ({sub.fileSize})</span>
                                  )}
                                  {sub?.submittedAt && (
                                    <span className="ml-2 text-[11px] text-[var(--ink-faint)]">· {sub.submittedAt}</span>
                                  )}
                                </div>
                                <span className={`text-[10px] font-[800] uppercase tracking-wider px-2 py-1 border-[1.5px] ${sub?.done ? 'border-green-300 text-green-700 bg-green-50' : 'border-[var(--line)] text-[var(--ink-faint)] bg-white'}`}>
                                  {sub?.done ? '✓ Done' : 'Pending'}
                                </span>
                              </div>
                            );
                          })}
                          {members.length === 0 && (
                            <p className="text-[12px] text-[var(--ink-soft)]">No members assigned.</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <Modal title={modal === 'add' ? 'New Assignment' : 'Edit Assignment'} onClose={close} wide>
            <Field label="Title">
              <input className={inputCls} value={form.title ?? ''} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Onboard New Chapter — Nairobi" />
            </Field>
            <Field label="Description">
              <textarea className={`${inputCls} resize-y`} rows={3} value={form.description ?? ''} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe the assignment in detail." />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Category">
                <input className={inputCls} value={form.category ?? ''} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} placeholder="e.g. Chapter Operations" />
              </Field>
              <Field label="Due Date">
                <input type="date" className={inputCls} value={form.dueDate ?? ''} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} />
              </Field>
            </div>
            <Field label="Assign To">
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <div className="w-4 h-4 border-[2px] border-[var(--ink)] flex items-center justify-center shrink-0"
                    onClick={() => setForm(p => ({ ...p, assignedAll: !p.assignedAll }))}>
                    {form.assignedAll && <div className="w-2 h-2 bg-[var(--ink)]" />}
                  </div>
                  <span className="text-[13px] font-[700]">All Team Members</span>
                </label>
                {!form.assignedAll && (
                  <div className="ml-6 mt-2 space-y-1.5 border-l-[2px] border-[var(--line)] pl-4">
                    {GCL_TEAM_MEMBERS.map(m => (
                      <label key={m.id} className="flex items-center gap-2.5 cursor-pointer select-none">
                        <div className="w-4 h-4 border-[2px] border-[var(--ink)] flex items-center justify-center shrink-0" onClick={() => toggleMember(m.id)}>
                          {(form.assignedIds ?? []).includes(m.id) && <div className="w-2 h-2 bg-[var(--ink)]" />}
                        </div>
                        <span className="text-[13px] font-[600]">{m.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </Field>
            <div className="flex gap-3 mt-2">
              <button onClick={close} className={btnSecondary}>Cancel</button>
              <button onClick={save} className={btnPrimary}>Save Assignment</button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Programs ──────────────────────────────────────────────────────────────────

const DECISION_STYLES: Record<string, { label: string; color: string; bg: string; border: string }> = {
  draft:      { label: 'Draft',      color: '#5c5876', bg: '#f7f6fd', border: '#ecebf7' },
  pending:    { label: 'Pending',    color: '#92400e', bg: '#fffbeb', border: '#fcd34d' },
  accepted:   { label: 'Accepted',   color: '#166534', bg: '#dcfce7', border: '#86efac' },
  waitlisted: { label: 'Waitlisted', color: '#1e40af', bg: '#dbeafe', border: '#93c5fd' },
  rejected:   { label: 'Rejected',   color: '#991b1b', bg: '#fee2e2', border: '#fca5a5' },
};

function ApplicantResponses({ applicant, program }: { applicant: ProgramApplicant; program: Program }) {
  const [open, setOpen] = useState(false);
  const responses = applicant.responses;
  const schema = program.formSchema;
  if (!responses || !schema) return null;

  return (
    <div className="mt-3">
      <button onClick={() => setOpen(o => !o)} className="text-[10px] font-[800] uppercase tracking-wider px-2.5 py-1 border-[1.5px] border-[var(--ink)] hover:bg-[var(--ink)] hover:text-white transition-colors">
        {open ? 'Hide Responses ▲' : 'View Full Application ▼'}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="mt-3 border-[1.5px] border-[var(--line)] bg-white p-4 space-y-4">
              {schema.map(section => (
                <div key={section.id}>
                  <div className="text-[10px] font-[800] uppercase tracking-wider text-[var(--ink-faint)] mb-2 pb-1.5 border-b border-[var(--line)]">{section.title}</div>
                  <div className="space-y-2">
                    {section.fields.map(f => {
                      const v = responses[f.id];
                      const display = f.type === 'checkbox' ? (v ? 'Yes' : 'No')
                        : f.type === 'multiselect' ? (Array.isArray(v) && v.length ? v.join(', ') : '—')
                        : f.type === 'file' ? (v?.name ?? '—')
                        : (v !== undefined && v !== null && v !== '' ? String(v) : '—');
                      return (
                        <div key={f.id} className="text-[12px]">
                          <div className="font-[700] text-[var(--ink-soft)] uppercase tracking-wide text-[10.5px] mb-0.5">{f.label}</div>
                          <div className="text-[var(--ink)] whitespace-pre-wrap">{display}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProgramsSection() {
  const { programs, addProgram, updateProgram, deleteProgram, updateApplicantDecision, addApplicant, deleteApplicant } = useAdmin();
  const [modal, setModal] = useState<null | 'add' | Program>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [addApplicantModal, setAddApplicantModal] = useState<string | null>(null);
  const [applicantForm, setApplicantForm] = useState<Partial<ProgramApplicant>>({});
  const [form, setForm] = useState<Partial<Program>>({});

  const openAdd = () => {
    setForm({ id: `prog${Date.now()}`, name: '', type: '', description: '', deadline: '', active: true, applicants: [] });
    setModal('add');
  };
  const openEdit = (p: Program) => { setForm({ ...p }); setModal(p); };
  const close = () => setModal(null);

  const save = () => {
    if (!form.name) return;
    const p: Program = {
      id: form.id!,
      name: form.name!,
      type: form.type ?? '',
      description: form.description ?? '',
      deadline: form.deadline,
      active: form.active ?? true,
      formUrl: form.formUrl,
      applicants: form.applicants ?? [],
    };
    if (modal === 'add') addProgram(p); else updateProgram(p);
    close();
  };

  const saveApplicant = (programId: string) => {
    if (!applicantForm.name || !applicantForm.email) return;
    const a: ProgramApplicant = {
      id: `ap${Date.now()}`,
      memberId: applicantForm.memberId ?? applicantForm.email ?? `m${Date.now()}`,
      name: applicantForm.name!,
      email: applicantForm.email!,
      appliedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      decision: 'pending',
    };
    addApplicant(programId, a);
    setAddApplicantModal(null);
    setApplicantForm({});
  };

  return (
    <div>
      <SectionHeader title="Programs" action={
        <button onClick={openAdd} className={btnPrimary}>+ New Program</button>
      } />

      {programs.length === 0 ? (
        <div className="border-[2.5px] border-[var(--line)] py-16 text-center">
          <p className="text-[14px] font-[700] uppercase tracking-wider text-[var(--ink-soft)]">No programs yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {programs.map((p, i) => {
            const isOpen = expanded === p.id;
            const pending = p.applicants.filter(a => a.decision === 'pending').length;

            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="border-[2.5px] border-[var(--ink)] shadow-[5px_5px_0px_var(--ink)] bg-white">
                {/* Program header */}
                <div className="flex items-start gap-4 p-5 cursor-pointer" onClick={() => setExpanded(isOpen ? null : p.id)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <span className="font-[800] text-[15px]">{p.name}</span>
                      <span className={`text-[10px] font-[800] uppercase tracking-wider px-2 py-0.5 border-[1.5px] ${p.active ? 'border-green-300 text-green-700 bg-green-50' : 'border-[var(--line)] text-[var(--ink-faint)] bg-[var(--paper-alt)]'}`}>
                        {p.active ? 'Active' : 'Closed'}
                      </span>
                      {pending > 0 && (
                        <span className="text-[10px] font-[800] uppercase tracking-wider px-2 py-0.5 border-[1.5px] border-amber-300 text-amber-700 bg-amber-50">{pending} Pending</span>
                      )}
                    </div>
                    <div className="text-[12px] text-[var(--ink-soft)] uppercase tracking-wider font-[600] mb-1">{p.type}</div>
                    <p className="text-[12.5px] text-[var(--ink-soft)]">{p.description}</p>
                    {p.deadline && <div className="text-[11px] text-[var(--ink-faint)] font-[600] uppercase tracking-wider mt-2">Deadline: {p.deadline}</div>}
                    {p.formUrl && <div className="text-[11px] text-[var(--ink-faint)] mt-1">Form: <span className="text-blue-600">{p.formUrl}</span></div>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={e => { e.stopPropagation(); openEdit(p); }} className={btnEdit}>Edit</button>
                    <button onClick={e => { e.stopPropagation(); deleteProgram(p.id); }} className={btnDanger}>Delete</button>
                    <span className="text-[var(--ink-soft)] font-[700] ml-1">{isOpen ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Applicants */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t-[2px] border-[var(--line)]"
                    >
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-[10px] font-[800] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
                            Applicants ({p.applicants.length})
                          </div>
                          <button
                            onClick={() => { setAddApplicantModal(p.id); setApplicantForm({}); }}
                            className="text-[10px] font-[800] uppercase tracking-wider px-3 py-1.5 border-[2px] border-[var(--ink)] hover:bg-[var(--ink)] hover:text-white transition-colors">
                            + Add Applicant
                          </button>
                        </div>

                        {p.applicants.length === 0 ? (
                          <p className="text-[12px] text-[var(--ink-soft)]">No applicants yet.</p>
                        ) : (
                          <div className="space-y-2">
                            {p.applicants.map(a => {
                              const ds = DECISION_STYLES[a.decision];
                              return (
                                <div key={a.id} className="border-[1.5px] border-[var(--line)] bg-[var(--paper-alt)] p-4">
                                  <div className="flex items-start gap-3 flex-wrap">
                                    <div className="flex-1 min-w-0">
                                      <div className="font-[700] text-[13px]">{a.name}</div>
                                      <div className="text-[11.5px] text-[var(--ink-soft)]">{a.email} · Applied {a.appliedDate}</div>
                                      {a.decisionDate && <div className="text-[11px] text-[var(--ink-faint)] mt-0.5">Decision: {a.decisionDate}</div>}
                                    </div>
                                    <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                                      {/* Current status pill */}
                                      <span className="text-[10px] font-[800] uppercase tracking-wider px-2 py-1 border-[1.5px]"
                                        style={{ color: ds.color, background: ds.bg, borderColor: ds.border }}>
                                        {ds.label}
                                      </span>
                                      {/* Decision buttons */}
                                      {a.decision !== 'draft' && (['accepted', 'waitlisted', 'rejected', 'pending'] as const).filter(d => d !== a.decision).map(d => (
                                        <button key={d}
                                          onClick={() => updateApplicantDecision(p.id, a.id, d)}
                                          className="text-[9px] font-[800] uppercase tracking-wider px-2 py-1 border-[1.5px] border-[var(--line)] text-[var(--ink-soft)] hover:border-[var(--ink)] hover:text-[var(--ink)] transition-colors">
                                          → {DECISION_STYLES[d].label}
                                        </button>
                                      ))}
                                      <button onClick={() => deleteApplicant(p.id, a.id)} className={btnDanger}>Remove</button>
                                    </div>
                                  </div>
                                  <ApplicantResponses applicant={a} program={p} />
                                </div>
                              );
                            })}
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

      {/* Add Applicant Modal */}
      <AnimatePresence>
        {addApplicantModal && (
          <Modal title="Add Applicant" onClose={() => setAddApplicantModal(null)}>
            <Field label="Full Name">
              <input className={inputCls} value={applicantForm.name ?? ''} onChange={e => setApplicantForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Amara Diallo" />
            </Field>
            <Field label="Email">
              <input className={inputCls} value={applicantForm.email ?? ''} onChange={e => setApplicantForm(p => ({ ...p, email: e.target.value }))} placeholder="amara@example.com" />
            </Field>
            <Field label="Member ID (optional — for portal link)">
              <select className={selectCls} value={applicantForm.memberId ?? ''} onChange={e => setApplicantForm(p => ({ ...p, memberId: e.target.value }))}>
                <option value="">— No linked account —</option>
                <option value="Mirzo10">Mirzo10 (Member)</option>
                <option value="Mirzo11">Mirzo11 (GCL Team)</option>
              </select>
            </Field>
            <div className="flex gap-3 mt-2">
              <button onClick={() => setAddApplicantModal(null)} className={btnSecondary}>Cancel</button>
              <button onClick={() => saveApplicant(addApplicantModal!)} className={btnPrimary}>Add Applicant</button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Edit Program Modal */}
      <AnimatePresence>
        {modal && (
          <Modal title={modal === 'add' ? 'New Program' : 'Edit Program'} onClose={close}>
            <Field label="Program Name">
              <input className={inputCls} value={form.name ?? ''} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. GCL Summer '26 Team" />
            </Field>
            <Field label="Type / Category">
              <input className={inputCls} value={form.type ?? ''} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} placeholder="e.g. Volunteer · Competitive" />
            </Field>
            <Field label="Description">
              <textarea className={`${inputCls} resize-y`} rows={3} value={form.description ?? ''} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe this program." />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Deadline">
                <input className={inputCls} value={form.deadline ?? ''} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} placeholder="e.g. 2026-07-31" />
              </Field>
              <Field label="Status">
                <select className={selectCls} value={form.active ? 'active' : 'closed'} onChange={e => setForm(p => ({ ...p, active: e.target.value === 'active' }))}>
                  <option value="active">Active (open)</option>
                  <option value="closed">Closed</option>
                </select>
              </Field>
            </div>
            <Field label="Application Form URL (optional)">
              <input className={inputCls} value={form.formUrl ?? ''} onChange={e => setForm(p => ({ ...p, formUrl: e.target.value }))} placeholder="https://forms.gle/..." />
            </Field>
            <div className="flex gap-3 mt-2">
              <button onClick={close} className={btnSecondary}>Cancel</button>
              <button onClick={save} className={btnPrimary}>Save Program</button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Events ────────────────────────────────────────────────────────────────────

function EventsSection() {
  const { events, addEvent, updateEvent, deleteEvent } = useAdmin();
  const [modal, setModal] = useState<null | 'add' | Event>(null);
  const [form, setForm] = useState<Partial<Event>>({});

  const openAdd = () => { setForm({ id: `e${Date.now()}`, date: { day: '', month: '', year: '', full: '' }, title: '', speaker: '', format: 'Online', type: 'Free' }); setModal('add'); };
  const openEdit = (e: Event) => { setForm({ ...e }); setModal(e); };
  const close = () => setModal(null);
  const save = () => {
    if (!form.title || !form.speaker) return;
    if (modal === 'add') addEvent(form as Event); else updateEvent(form as Event);
    close();
  };

  return (
    <div>
      <SectionHeader title="Events" action={<button onClick={openAdd} className={btnPrimary}>+ New Event</button>} />
      <div className="space-y-3">
        {events.map((ev, i) => (
          <motion.div key={ev.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="border-[2.5px] border-[var(--ink)] shadow-[4px_4px_0px_var(--ink)] bg-white p-4 flex items-center gap-4">
            <div className="shrink-0 w-[52px] h-[52px] border-[2px] border-[var(--ink)] bg-[var(--brutal-bg)] flex flex-col items-center justify-center">
              <div className="font-[800] text-[18px] text-white leading-none">{ev.date.day}</div>
              <div className="text-[8px] font-[800] tracking-wider uppercase text-white/60">{ev.date.month}</div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-[700] text-[14px] truncate">{ev.title}</div>
              <div className="text-[12px] text-[var(--ink-soft)]">{ev.speaker} · {ev.format} · {ev.type}</div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEdit(ev)} className={btnEdit}>Edit</button>
              <button onClick={() => deleteEvent(ev.id)} className={btnDanger}>Delete</button>
            </div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {modal && (
          <Modal title={modal === 'add' ? 'New Event' : 'Edit Event'} onClose={close}>
            <Field label="Event Title"><input className={inputCls} value={form.title ?? ''} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Youth Money Summit" /></Field>
            <Field label="Speaker / Host"><input className={inputCls} value={form.speaker ?? ''} onChange={e => setForm(p => ({ ...p, speaker: e.target.value }))} placeholder="Dr. Elena Rostova" /></Field>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Day"><input className={inputCls} value={form.date?.day ?? ''} onChange={e => setForm(p => ({ ...p, date: { ...p.date!, day: e.target.value } }))} placeholder="14" /></Field>
              <Field label="Month"><input className={inputCls} value={form.date?.month ?? ''} onChange={e => setForm(p => ({ ...p, date: { ...p.date!, month: e.target.value.toUpperCase() } }))} placeholder="AUG" maxLength={3} /></Field>
              <Field label="Year"><input className={inputCls} value={form.date?.year ?? ''} onChange={e => setForm(p => ({ ...p, date: { ...p.date!, year: e.target.value } }))} placeholder="2026" /></Field>
            </div>
            <Field label="Full Date"><input className={inputCls} value={form.date?.full ?? ''} onChange={e => setForm(p => ({ ...p, date: { ...p.date!, full: e.target.value } }))} placeholder="August 14, 2026" /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Format">
                <select className={selectCls} value={form.format ?? 'Online'} onChange={e => setForm(p => ({ ...p, format: e.target.value as any }))}>
                  <option>Online</option><option>In-Person</option>
                </select>
              </Field>
              <Field label="Type">
                <select className={selectCls} value={form.type ?? 'Free'} onChange={e => setForm(p => ({ ...p, type: e.target.value as any }))}>
                  <option>Free</option><option>Ticketed</option><option>Invite-Only</option>
                </select>
              </Field>
            </div>
            <Field label="Registration Link"><input className={inputCls} value={form.registrationLink ?? ''} onChange={e => setForm(p => ({ ...p, registrationLink: e.target.value }))} placeholder="https://..." /></Field>
            <div className="flex gap-3 mt-2">
              <button onClick={close} className={btnSecondary}>Cancel</button>
              <button onClick={save} className={btnPrimary}>Save Event</button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Courses ───────────────────────────────────────────────────────────────────

function CoursesSection() {
  const { courses, addCourse, updateCourse, deleteCourse } = useAdmin();
  const [modal, setModal] = useState<null | 'add' | Course>(null);
  const [form, setForm] = useState<Partial<Course & { moduleText: string }>>({});

  const openAdd = () => { setForm({ slug: '', title: '', tag: '', level: 'Beginner', duration: '', color: 't1', modules: [], instructors: [], moduleText: '' }); setModal('add'); };
  const openEdit = (c: Course) => { setForm({ ...c, moduleText: c.modules.map(m => `${m.title}: ${m.description}`).join('\n') }); setModal(c); };
  const close = () => setModal(null);
  const save = () => {
    if (!form.title || !form.slug) return;
    const modules = (form.moduleText ?? '').split('\n').filter(Boolean).map((line, i) => {
      const [t, ...rest] = line.split(':');
      return { title: t?.trim() || `Module ${i + 1}`, description: rest.join(':').trim() };
    });
    const course: Course = {
      slug: form.slug!.toLowerCase().replace(/\s+/g, '-'),
      title: form.title!,
      tag: form.tag ?? '',
      level: form.level ?? 'Beginner',
      duration: form.duration ?? '',
      color: (form.color ?? 't1') as 't1' | 't2' | 't3',
      modules: modules.length ? modules : [{ title: 'Module 1', description: 'Coming soon.' }],
      instructors: form.instructors ?? [],
    };
    if (modal === 'add') addCourse(course); else updateCourse(course);
    close();
  };

  return (
    <div>
      <SectionHeader title="Courses" action={<button onClick={openAdd} className={btnPrimary}>+ New Course</button>} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {courses.map((c, i) => (
          <motion.div key={c.slug} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="border-[2.5px] border-[var(--ink)] shadow-[4px_4px_0px_var(--ink)] bg-white p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <div className="font-[800] text-[14px] leading-tight">{c.title}</div>
                <div className="text-[12px] text-[var(--ink-soft)] mt-0.5">{c.level} · {c.duration} · {c.tag}</div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(c)} className={btnEdit}>Edit</button>
                <button onClick={() => deleteCourse(c.slug)} className={btnDanger}>Delete</button>
              </div>
            </div>
            <div className="text-[11.5px] text-[var(--ink-faint)]">{c.modules.length} modules</div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {modal && (
          <Modal title={modal === 'add' ? 'New Course' : 'Edit Course'} onClose={close} wide>
            <Field label="Course Title"><input className={inputCls} value={form.title ?? ''} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Psychology of Money" /></Field>
            <Field label="Slug (URL)"><input className={inputCls} value={form.slug ?? ''} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} placeholder="psychology-of-money" /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Tag"><input className={inputCls} value={form.tag ?? ''} onChange={e => setForm(p => ({ ...p, tag: e.target.value }))} placeholder="Foundations" /></Field>
              <Field label="Level">
                <select className={selectCls} value={form.level ?? 'Beginner'} onChange={e => setForm(p => ({ ...p, level: e.target.value }))}>
                  <option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>All Levels</option>
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Duration"><input className={inputCls} value={form.duration ?? ''} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} placeholder="6 Modules" /></Field>
              <Field label="Color Theme">
                <select className={selectCls} value={form.color ?? 't1'} onChange={e => setForm(p => ({ ...p, color: e.target.value as any }))}>
                  <option value="t1">Blue/Violet</option><option value="t2">Magenta/Pink</option><option value="t3">Cyan/Blue</option>
                </select>
              </Field>
            </div>
            <Field label="Modules (one per line: Title: Description)">
              <textarea className={`${inputCls} resize-y`} rows={5} value={form.moduleText ?? ''} onChange={e => setForm(p => ({ ...p, moduleText: e.target.value }))} placeholder={'Module 1: Intro to behavioral finance\nModule 2: Cognitive biases'} />
            </Field>
            <div className="flex gap-3 mt-2">
              <button onClick={close} className={btnSecondary}>Cancel</button>
              <button onClick={save} className={btnPrimary}>Save Course</button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── News ──────────────────────────────────────────────────────────────────────

function NewsSection() {
  const { news, addNews, updateNews, deleteNews } = useAdmin();
  const [modal, setModal] = useState<null | 'add' | NewsPost>(null);
  const [form, setForm] = useState<Partial<NewsPost>>({});

  const openAdd = () => { setForm({ id: `n${Date.now()}`, title: '', excerpt: '', content: '', author: '', date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), category: 'Announcement', published: true }); setModal('add'); };
  const openEdit = (p: NewsPost) => { setForm({ ...p }); setModal(p); };
  const close = () => setModal(null);
  const save = () => {
    if (!form.title || !form.content) return;
    if (modal === 'add') addNews(form as NewsPost); else updateNews(form as NewsPost);
    close();
  };

  const catColor: Record<string, string> = { Research: '#3358ff', Update: '#8b5cf6', Story: '#e93fc7', Announcement: '#16a34a' };

  return (
    <div>
      <SectionHeader title="News Posts" action={<button onClick={openAdd} className={btnPrimary}>+ New Post</button>} />
      <div className="space-y-3">
        {news.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="border-[2.5px] border-[var(--ink)] shadow-[4px_4px_0px_var(--ink)] bg-white p-4 flex items-start gap-4">
            <div className="w-[4px] self-stretch shrink-0" style={{ background: catColor[p.category] ?? '#888' }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[10px] font-[800] uppercase tracking-wider" style={{ color: catColor[p.category] }}>{p.category}</span>
                <span className="text-[11px] text-[var(--ink-faint)]">· {p.date}</span>
                <span className={`text-[10px] font-[800] px-2 py-0.5 border-[1.5px] ${p.published ? 'border-green-300 text-green-700 bg-green-50' : 'border-red-200 text-red-500 bg-red-50'}`}>{p.published ? 'Live' : 'Draft'}</span>
              </div>
              <div className="font-[700] text-[14px] truncate">{p.title}</div>
              <div className="text-[12px] text-[var(--ink-soft)] truncate">{p.excerpt}</div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEdit(p)} className={btnEdit}>Edit</button>
              <button onClick={() => deleteNews(p.id)} className={btnDanger}>Delete</button>
            </div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {modal && (
          <Modal title={modal === 'add' ? 'New Post' : 'Edit Post'} onClose={close} wide>
            <Field label="Title"><input className={inputCls} value={form.title ?? ''} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Article headline" /></Field>
            <Field label="Excerpt"><textarea className={`${inputCls} resize-y`} rows={2} value={form.excerpt ?? ''} onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))} placeholder="Brief summary shown in feed." /></Field>
            <Field label="Content"><textarea className={`${inputCls} resize-y`} rows={5} value={form.content ?? ''} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} placeholder="Full article body." /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Author"><input className={inputCls} value={form.author ?? ''} onChange={e => setForm(p => ({ ...p, author: e.target.value }))} placeholder="Dr. Elena Rostova" /></Field>
              <Field label="Category">
                <select className={selectCls} value={form.category ?? 'Announcement'} onChange={e => setForm(p => ({ ...p, category: e.target.value as any }))}>
                  <option>Research</option><option>Update</option><option>Story</option><option>Announcement</option>
                </select>
              </Field>
            </div>
            <Field label="Date"><input className={inputCls} value={form.date ?? ''} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} placeholder="July 5, 2026" /></Field>
            <Field label="Visibility">
              <select className={selectCls} value={form.published ? 'published' : 'draft'} onChange={e => setForm(p => ({ ...p, published: e.target.value === 'published' }))}>
                <option value="published">Published</option><option value="draft">Draft</option>
              </select>
            </Field>
            <div className="flex gap-3 mt-2">
              <button onClick={close} className={btnSecondary}>Cancel</button>
              <button onClick={save} className={btnPrimary}>Publish</button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Members ───────────────────────────────────────────────────────────────────

function MembersSection() {
  const { users, courses, events } = useAdmin();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div>
      <SectionHeader title="Members" />
      <div className="border-[2.5px] border-[var(--ink)] shadow-[5px_5px_0px_var(--ink)] bg-white overflow-hidden mb-4">
        <div className="grid grid-cols-[2fr_2fr_1fr_60px_60px] px-5 py-3 bg-[var(--brutal-bg)] text-[10px] font-[800] uppercase tracking-[0.1em] text-white/60">
          <div>Name</div><div>Email</div><div>Joined</div><div>Courses</div><div>Events</div>
        </div>
        {users.map((u, i) => (
          <motion.div key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
            className={`grid grid-cols-[2fr_2fr_1fr_60px_60px] px-5 py-3.5 border-t-[1.5px] border-[var(--line)] cursor-pointer transition-colors ${selected === u.id ? 'bg-[var(--paper-alt)]' : 'hover:bg-[var(--paper-alt)]'}`}
            onClick={() => setSelected(selected === u.id ? null : u.id)}>
            <div className="font-[700] text-[13px]">{u.name}</div>
            <div className="text-[12.5px] text-[var(--ink-soft)] truncate">{u.email}</div>
            <div className="text-[12.5px] text-[var(--ink-soft)]">{u.joinedDate}</div>
            <div className="text-[13px] font-[800]" style={{ color: '#8b5cf6' }}>{u.completedCourses.length}</div>
            <div className="text-[13px] font-[800]" style={{ color: '#e93fc7' }}>{u.registeredEvents.length}</div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {selected && (() => {
          const u = users.find(x => x.id === selected)!;
          return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="border-[2.5px] border-[var(--ink)] shadow-[5px_5px_0px_var(--ink)] bg-white p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="font-[800] text-[20px]">{u.name}</div>
                  <div className="text-[13px] text-[var(--ink-soft)]">{u.email} · Joined {u.joinedDate}</div>
                </div>
                <button onClick={() => setSelected(null)} className="font-[700] text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors">✕ Close</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-[10px] font-[800] uppercase tracking-[0.1em] text-[var(--ink-faint)] mb-3">Completed Courses ({u.completedCourses.length})</div>
                  {u.completedCourses.length === 0 ? <p className="text-[12.5px] text-[var(--ink-soft)]">None yet.</p> :
                    u.completedCourses.map(slug => (
                      <div key={slug} className="flex items-center gap-3 mb-2 px-3 py-2.5 border-[1.5px] border-[var(--line)] text-[12.5px] font-[600]">
                        ✓ {slug}
                      </div>
                    ))}
                </div>
                <div>
                  <div className="text-[10px] font-[800] uppercase tracking-[0.1em] text-[var(--ink-faint)] mb-3">Registered Events ({u.registeredEvents.length})</div>
                  {u.registeredEvents.length === 0 ? <p className="text-[12.5px] text-[var(--ink-soft)]">None yet.</p> :
                    u.registeredEvents.map(id => (
                      <div key={id} className="flex items-center gap-3 mb-2 px-3 py-2.5 border-[1.5px] border-[var(--line)] text-[12.5px] font-[600]">
                        ◻ Event {id}
                      </div>
                    ))}
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

// ── Certificates ──────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.BASE_URL?.replace(/\/$/, '') ?? '';

const GCL_MEMBERS_ALL = ['Mirzo10', 'Mirzo11', ...GCL_TEAM_MEMBERS.map(m => m.id)];

const BLANK_CERT = (): Omit<Certificate, 'id' | 'token' | 'createdAt' | 'createdBy' | 'viewCount' | 'viewLog'> => ({
  memberId: '',
  recipientName: '',
  programName: '',
  issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  visibility: 'link',
  revoked: false,
});

function CertificatesSection() {
  const { user } = useAppAuth();
  const { certificates, addCertificate, updateCertificate, deleteCertificate, revokeCertificate, regenerateCertToken } = useCertificates();
  const [modal, setModal] = useState<'create' | 'edit' | 'logs' | null>(null);
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [form, setForm] = useState(BLANK_CERT());
  const [copied, setCopied] = useState<string | null>(null);

  const openCreate = () => { setForm(BLANK_CERT()); setEditing(null); setModal('create'); };
  const openEdit = (c: Certificate) => { setForm({ memberId: c.memberId, recipientName: c.recipientName, programName: c.programName, issueDate: c.issueDate, visibility: c.visibility, revoked: c.revoked }); setEditing(c); setModal('edit'); };
  const openLogs = (c: Certificate) => { setEditing(c); setModal('logs'); };

  const save = () => {
    if (!form.recipientName || !form.programName || !form.memberId) return;
    if (editing) {
      updateCertificate({ ...editing, ...form });
    } else {
      addCertificate({
        id: generateCertId(),
        token: generateToken(),
        ...form,
        viewCount: 0,
        viewLog: [],
        createdAt: new Date().toISOString().slice(0, 10),
        createdBy: user?.id ?? 'admin',
      });
    }
    setModal(null);
  };

  const copyLink = async (token: string) => {
    await navigator.clipboard.writeText(`${window.location.origin}${BASE_URL}/certificate/${token}`);
    setCopied(token);
    setTimeout(() => setCopied(null), 2000);
  };

  const doRegenToken = (id: string) => { if (confirm('Regenerate share link? The old link will stop working.')) regenerateCertToken(id); };

  return (
    <div>
      <SectionHeader title="Certificates" action={<button onClick={openCreate} className={btnPrimary}>+ New Certificate</button>} />

      {certificates.length === 0 ? (
        <p className="text-[13px] text-[var(--ink-soft)] py-8 text-center">No certificates yet. Create one to get started.</p>
      ) : (
        <div className="space-y-3">
          {certificates.map(c => (
            <div key={c.id} className={`border-[2px] border-[var(--ink)] shadow-[4px_4px_0px_var(--ink)] bg-white ${c.revoked ? 'opacity-50' : ''}`}>
              <div className="grid grid-cols-[1fr_auto] gap-0">
                <div className="p-5">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <span className="font-[800] font-mono text-[13px] tracking-wider">{c.id}</span>
                    {c.revoked
                      ? <span className="text-[10px] font-[800] uppercase tracking-wider px-2 py-0.5 border border-red-300 text-red-600 bg-red-50">Revoked</span>
                      : c.visibility === 'link'
                      ? <span className="text-[10px] font-[800] uppercase tracking-wider px-2 py-0.5 border border-blue-200 text-blue-600 bg-blue-50">🔗 Shareable</span>
                      : <span className="text-[10px] font-[800] uppercase tracking-wider px-2 py-0.5 border border-[var(--line)] text-[var(--ink-soft)]">🔒 Private</span>
                    }
                  </div>
                  <div className="font-[700] text-[15px] mb-0.5">{c.recipientName}</div>
                  <div className="text-[12px] text-[var(--ink-soft)]">{c.programName} · Issued {c.issueDate}</div>
                  <div className="text-[11.5px] text-[var(--ink-faint)] mt-1">Member: {c.memberId} · Viewed {c.viewCount}×</div>
                </div>
                <div className="flex flex-col gap-1.5 justify-center p-4 border-l-[2px] border-[var(--ink)] bg-[var(--paper-alt)] min-w-[160px]">
                  <button onClick={() => openEdit(c)} className={btnEdit}>Edit</button>
                  <button onClick={() => copyLink(c.token)} className={`${btnEdit} ${copied === c.token ? 'border-green-300 text-green-600' : ''}`}>
                    {copied === c.token ? '✓ Copied' : 'Copy Link'}
                  </button>
                  <button onClick={() => openLogs(c)} className={btnEdit}>View Logs</button>
                  {!c.revoked && <button onClick={() => doRegenToken(c.id)} className={btnEdit}>Regen Link</button>}
                  {!c.revoked
                    ? <button onClick={() => { if (confirm('Revoke this certificate?')) revokeCertificate(c.id); }} className={btnDanger}>Revoke</button>
                    : <button onClick={() => { if (confirm('Delete this certificate permanently?')) deleteCertificate(c.id); }} className={btnDanger}>Delete</button>
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {(modal === 'create' || modal === 'edit') && (
          <Modal title={modal === 'create' ? 'New Certificate' : 'Edit Certificate'} onClose={() => setModal(null)}>
            <Field label="Member ID (account username)">
              <input className={inputCls} value={form.memberId} onChange={e => setForm(f => ({ ...f, memberId: e.target.value }))} placeholder="e.g. Mirzo10" />
            </Field>
            <Field label="Recipient Name">
              <input className={inputCls} value={form.recipientName} onChange={e => setForm(f => ({ ...f, recipientName: e.target.value }))} placeholder="Full name on certificate" />
            </Field>
            <Field label="Program Name">
              <input className={inputCls} value={form.programName} onChange={e => setForm(f => ({ ...f, programName: e.target.value }))} placeholder="e.g. GCL Summer '26 Team" />
            </Field>
            <Field label="Issue Date">
              <input className={inputCls} value={form.issueDate} onChange={e => setForm(f => ({ ...f, issueDate: e.target.value }))} placeholder="e.g. July 4, 2026" />
            </Field>
            <Field label="Visibility">
              <select className={selectCls} value={form.visibility} onChange={e => setForm(f => ({ ...f, visibility: e.target.value as any }))}>
                <option value="link">Shareable via link (anyone with URL can view)</option>
                <option value="private">Private (only recipient can view when signed in)</option>
              </select>
            </Field>
            <div className="flex gap-3 mt-6">
              <button onClick={save} className={btnPrimary}>{modal === 'create' ? 'Create Certificate' : 'Save Changes'}</button>
              <button onClick={() => setModal(null)} className={btnSecondary}>Cancel</button>
            </div>
          </Modal>
        )}
        {modal === 'logs' && editing && (
          <Modal title={`Access Logs — ${editing.id}`} onClose={() => setModal(null)}>
            <div className="mb-3 text-[12px] text-[var(--ink-soft)]">Total views: <strong>{editing.viewCount}</strong></div>
            {editing.viewLog.length === 0 ? (
              <p className="text-[13px] text-[var(--ink-faint)] text-center py-6">No views recorded yet.</p>
            ) : (
              <div className="space-y-2 max-h-[340px] overflow-y-auto">
                {editing.viewLog.map((entry, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3 border-[2px] border-[var(--line)] bg-[var(--paper-alt)]">
                    <span className="text-[12px] font-[600] text-[var(--ink)]">{entry.timestamp}</span>
                    {entry.viewer && <span className="text-[11px] font-[700] text-[var(--ink-faint)]">{entry.viewer}</span>}
                  </div>
                ))}
              </div>
            )}
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Congrats Pages ────────────────────────────────────────────────────────────

const BLANK_CONGRAT = (): Omit<CongratPage, 'id' | 'token' | 'createdAt' | 'createdBy' | 'viewCount' | 'viewLog'> => ({
  memberId: '',
  recipientName: '',
  programName: '',
  message: '',
  accessMode: 'link',
  revoked: false,
  expiresAt: '',
  certificateId: '',
});

function CongratPagesSection() {
  const { user } = useAppAuth();
  const { congratPages, addCongratPage, updateCongratPage, deleteCongratPage, revokeCongratPage, regenerateCongratToken } = useCertificates();
  const [modal, setModal] = useState<'create' | 'edit' | 'logs' | null>(null);
  const [editing, setEditing] = useState<CongratPage | null>(null);
  const [form, setForm] = useState(BLANK_CONGRAT());
  const [copied, setCopied] = useState<string | null>(null);

  const openCreate = () => { setForm(BLANK_CONGRAT()); setEditing(null); setModal('create'); };
  const openEdit = (p: CongratPage) => {
    setForm({ memberId: p.memberId, recipientName: p.recipientName, programName: p.programName, message: p.message, accessMode: p.accessMode, revoked: p.revoked, expiresAt: p.expiresAt ?? '', certificateId: p.certificateId ?? '' });
    setEditing(p); setModal('edit');
  };

  const save = () => {
    if (!form.recipientName || !form.programName || !form.memberId || !form.message) return;
    const payload = { ...form, expiresAt: form.expiresAt || undefined, certificateId: form.certificateId || undefined };
    if (editing) {
      updateCongratPage({ ...editing, ...payload });
    } else {
      addCongratPage({
        id: `cg_${generateToken(8)}`,
        token: generateToken(),
        ...payload,
        viewCount: 0,
        viewLog: [],
        createdAt: new Date().toISOString().slice(0, 10),
        createdBy: user?.id ?? 'admin',
      });
    }
    setModal(null);
  };

  const copyLink = async (token: string) => {
    await navigator.clipboard.writeText(`${window.location.origin}${BASE_URL}/congratulations/${token}`);
    setCopied(token);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      <SectionHeader title="Congratulations Pages" action={<button onClick={openCreate} className={btnPrimary}>+ New Page</button>} />

      {congratPages.length === 0 ? (
        <p className="text-[13px] text-[var(--ink-soft)] py-8 text-center">No congratulations pages yet.</p>
      ) : (
        <div className="space-y-3">
          {congratPages.map(p => (
            <div key={p.id} className={`border-[2px] border-[var(--ink)] shadow-[4px_4px_0px_var(--ink)] bg-white ${p.revoked ? 'opacity-50' : ''}`}>
              <div className="grid grid-cols-[1fr_auto] gap-0">
                <div className="p-5">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <span className="font-[800] text-[13px]">{p.recipientName}</span>
                    {p.revoked
                      ? <span className="text-[10px] font-[800] uppercase tracking-wider px-2 py-0.5 border border-red-300 text-red-600 bg-red-50">Revoked</span>
                      : p.accessMode === 'link'
                      ? <span className="text-[10px] font-[800] uppercase tracking-wider px-2 py-0.5 border border-blue-200 text-blue-600 bg-blue-50">🔗 Link Access</span>
                      : <span className="text-[10px] font-[800] uppercase tracking-wider px-2 py-0.5 border border-purple-200 text-purple-600 bg-purple-50">🔐 Login Required</span>
                    }
                    {p.expiresAt && <span className="text-[10px] font-[600] text-[var(--ink-faint)]">Expires {new Date(p.expiresAt).toLocaleDateString()}</span>}
                  </div>
                  <div className="text-[12px] text-[var(--ink-soft)]">{p.programName} · Member: {p.memberId}</div>
                  <div className="text-[12px] text-[var(--ink-faint)] mt-1 line-clamp-1">{p.message}</div>
                  <div className="text-[11px] text-[var(--ink-faint)] mt-1">Viewed {p.viewCount}×</div>
                </div>
                <div className="flex flex-col gap-1.5 justify-center p-4 border-l-[2px] border-[var(--ink)] bg-[var(--paper-alt)] min-w-[160px]">
                  <button onClick={() => openEdit(p)} className={btnEdit}>Edit</button>
                  <button onClick={() => copyLink(p.token)} className={`${btnEdit} ${copied === p.token ? 'border-green-300 text-green-600' : ''}`}>
                    {copied === p.token ? '✓ Copied' : 'Copy Link'}
                  </button>
                  <a href={`${BASE_URL}/congratulations/${p.token}`} target="_blank" rel="noreferrer" className={`${btnEdit} text-center`}>Preview ↗</a>
                  {!p.revoked && <button onClick={() => { if (confirm('Regenerate link? Old link will break.')) regenerateCongratToken(p.id); }} className={btnEdit}>Regen Link</button>}
                  {!p.revoked
                    ? <button onClick={() => { if (confirm('Revoke this page?')) revokeCongratPage(p.id); }} className={btnDanger}>Revoke</button>
                    : <button onClick={() => { if (confirm('Delete this page?')) deleteCongratPage(p.id); }} className={btnDanger}>Delete</button>
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {(modal === 'create' || modal === 'edit') && (
          <Modal title={modal === 'create' ? 'New Congratulations Page' : 'Edit Page'} onClose={() => setModal(null)} wide>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Member ID">
                <input className={inputCls} value={form.memberId} onChange={e => setForm(f => ({ ...f, memberId: e.target.value }))} placeholder="e.g. Mirzo10" />
              </Field>
              <Field label="Recipient Name">
                <input className={inputCls} value={form.recipientName} onChange={e => setForm(f => ({ ...f, recipientName: e.target.value }))} placeholder="Full name" />
              </Field>
            </div>
            <Field label="Program Name">
              <input className={inputCls} value={form.programName} onChange={e => setForm(f => ({ ...f, programName: e.target.value }))} placeholder="Program name" />
            </Field>
            <Field label="Personalized Message">
              <textarea className={`${inputCls} min-h-[120px] resize-y`} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Write a personal congratulations message..." />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Access Mode">
                <select className={selectCls} value={form.accessMode} onChange={e => setForm(f => ({ ...f, accessMode: e.target.value as any }))}>
                  <option value="link">Anyone with secure link</option>
                  <option value="login">Recipient must be signed in</option>
                </select>
              </Field>
              <Field label="Expiry Date (optional)">
                <input type="date" className={inputCls} value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} />
              </Field>
            </div>
            <Field label="Linked Certificate ID (optional)">
              <input className={inputCls} value={form.certificateId} onChange={e => setForm(f => ({ ...f, certificateId: e.target.value }))} placeholder="e.g. GCL-2026-4821" />
            </Field>
            <div className="flex gap-3 mt-6">
              <button onClick={save} className={btnPrimary}>{modal === 'create' ? 'Create Page' : 'Save Changes'}</button>
              <button onClick={() => setModal(null)} className={btnSecondary}>Cancel</button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

export function AdminDashboard() {
  const { isAuthenticated, isAdmin, user, logout, login } = useAppAuth();
  const { assignments, programs, users, events } = useAdmin();
  const [section, setSection] = useState<Section>('overview');

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-8 bg-white">
        <img src={logoImg} alt="GCL" className="h-9 object-contain mb-10" />
        <div className="border-[2.5px] border-[var(--ink)] shadow-[8px_8px_0px_var(--ink)] bg-white p-10 max-w-[400px] w-full text-center">
          <div className="font-[800] text-[22px] tracking-[-0.02em] uppercase mb-3">Admin Access</div>
          <p className="text-[14px] text-[var(--ink-soft)] mb-7">Sign in with your admin account to continue.</p>
          <button onClick={login} className="w-full py-3 font-[800] text-[13px] uppercase tracking-wider text-white bg-[var(--ink)] border-[2px] border-[var(--ink)] hover:bg-transparent hover:text-[var(--ink)] transition-colors">Sign In</button>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-8 bg-white">
        <img src={logoImg} alt="GCL" className="h-9 object-contain mb-10" />
        <div className="border-[2.5px] border-[var(--ink)] shadow-[8px_8px_0px_var(--ink)] bg-white p-10 max-w-[400px] w-full text-center">
          <div className="font-[800] text-[22px] tracking-[-0.02em] uppercase mb-3">Access Denied</div>
          <p className="text-[14px] text-[var(--ink-soft)]">This area requires admin privileges.</p>
        </div>
      </main>
    );
  }

  const displayName = user?.firstName || user?.email || 'Admin';
  const pendingCount = programs.reduce((s, p) => s + p.applicants.filter(a => a.decision === 'pending').length, 0);

  return (
    <main className="min-h-screen bg-[var(--paper-alt)]">

      {/* ── Dark Hero Header ── */}
      <section style={{ background: 'var(--brutal-bg)' }}>
        <div className="max-w-[1280px] mx-auto px-6">

          {/* Top bar */}
          <div className="flex items-center gap-6 py-4 border-b border-white/10 flex-wrap">
            <Link href="/">
              <img src={logoImg} alt="GCL" className="h-7 object-contain shrink-0" />
            </Link>
            <div className="w-[1px] h-5 bg-white/20 shrink-0" />
            <div className="flex items-center gap-1 flex-wrap flex-1">
              {SITE_LINKS.map(l => (
                <Link key={l.href} href={l.href}
                  className="text-[11px] font-[700] uppercase tracking-wider text-white/50 hover:text-white transition-colors px-2 py-1">
                  {l.label}
                </Link>
              ))}
              <Link href="/portal" className="text-[11px] font-[700] uppercase tracking-wider text-white/50 hover:text-white transition-colors px-2 py-1">Portal</Link>
            </div>
            <button onClick={logout} className="text-[11px] font-[700] uppercase tracking-wider text-white/40 hover:text-white transition-colors shrink-0">
              Sign Out
            </button>
          </div>

          {/* Hero */}
          <div className="py-8 border-b border-white/10">
            <div className="text-[10px] font-[800] uppercase tracking-[0.18em] text-[var(--neon-cyan)] mb-3">GCL Admin Dashboard</div>
            <h1 className="font-[800] text-[clamp(36px,5vw,64px)] leading-[0.9] tracking-[-0.04em] text-white uppercase">
              {displayName}.
            </h1>
            <p className="text-[13px] text-white/40 font-[500] mt-3">Full control over all site content, assignments, and programs.</p>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-4 divide-x divide-white/10 py-5">
            {[
              { n: events.length, label: 'Events' },
              { n: assignments.length, label: 'Assignments' },
              { n: programs.length, label: 'Programs' },
              { n: pendingCount, label: 'Pending Decisions' },
            ].map(s => (
              <div key={s.label} className="px-6 first:pl-0">
                <div className="font-[800] text-[clamp(24px,3vw,40px)] text-white tracking-[-0.02em] leading-none"
                  style={{ color: s.label === 'Pending Decisions' && s.n > 0 ? '#fbbf24' : undefined }}>
                  {s.n}
                </div>
                <div className="text-[10px] font-[600] uppercase tracking-wider text-white/40 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <div className="max-w-[1280px] mx-auto px-6 py-8">
        <div className="flex gap-6 items-start">

          {/* Sidebar */}
          <div className="w-[200px] shrink-0 sticky top-6">
            <nav className="space-y-1">
              {NAV.map(item => (
                <button key={item.id} onClick={() => setSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 border-[2px] font-[800] text-[11px] uppercase tracking-wider text-left transition-all ${
                    section === item.id
                      ? 'border-[var(--ink)] bg-[var(--ink)] text-white shadow-[4px_4px_0px_var(--ink-soft)]'
                      : 'border-[var(--line)] bg-white text-[var(--ink-soft)] hover:border-[var(--ink)] hover:text-[var(--ink)]'
                  }`}>
                  <span className="text-[14px] opacity-60">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.id === 'programs' && pendingCount > 0 && (
                    <span className="ml-auto w-4 h-4 rounded-full bg-amber-400 text-[9px] font-[800] text-white flex items-center justify-center shrink-0">{pendingCount}</span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 bg-white border-[2.5px] border-[var(--ink)] shadow-[6px_6px_0px_var(--ink)] p-8">
            <AnimatePresence mode="wait">
              <motion.div key={section} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                {section === 'overview'      && <OverviewSection />}
                {section === 'assignments'   && <AssignmentsSection />}
                {section === 'programs'      && <ProgramsSection />}
                {section === 'certificates'  && <CertificatesSection />}
                {section === 'congrats'      && <CongratPagesSection />}
                {section === 'events'        && <EventsSection />}
                {section === 'courses'       && <CoursesSection />}
                {section === 'news'          && <NewsSection />}
                {section === 'members'       && <MembersSection />}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </main>
  );
}
