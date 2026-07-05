import React, { useState, useMemo } from 'react';
import { Link, useParams } from 'wouter';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useAppAuth } from '../context/AuthContext';
import { useAdmin, Program, ProgramApplicant } from '../context/AdminContext';
import { FormField, SUMMER26_PROGRAM_COPY } from '../data/applicationForm';
import { ApplicationField } from '../components/ApplicationFormFields';

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, '') ?? '';

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay }} className={className}>
      {children}
    </motion.div>
  );
}

const STATUS_STYLES: Record<string, { label: string; color: string; bg: string; border: string }> = {
  draft:      { label: 'Draft',        color: '#5c5876', bg: '#f7f6fd', border: '#ecebf7' },
  pending:    { label: 'Under Review', color: '#92400e', bg: '#fffbeb', border: '#fcd34d' },
  accepted:   { label: 'Accepted',     color: '#166534', bg: '#dcfce7', border: '#86efac' },
  waitlisted: { label: 'Waitlisted',   color: '#1e40af', bg: '#dbeafe', border: '#93c5fd' },
  rejected:   { label: 'Rejected',     color: '#991b1b', bg: '#fee2e2', border: '#fca5a5' },
};

function isGuardianField(id: string) {
  return id === 'guardianConsent' || id === 'guardianName' || id === 'guardianEmail';
}

function validate(schema: { id: string; title: string; fields: FormField[] }[], responses: Record<string, any>): Record<string, string> {
  const errors: Record<string, string> = {};
  const age = Number(responses['age']);
  const isMinor = !Number.isNaN(age) && age > 0 && age < 18;

  for (const section of schema) {
    for (const field of section.fields) {
      if (isGuardianField(field.id) && !isMinor) continue;
      const required = field.required || (isMinor && (field.id === 'guardianConsent' || field.id === 'guardianName' || field.id === 'guardianEmail'));
      if (!required) continue;
      const val = responses[field.id];
      if (field.type === 'checkbox') {
        if (!val) errors[field.id] = 'This must be checked to continue.';
      } else if (field.type === 'multiselect') {
        if (!Array.isArray(val) || val.length === 0) errors[field.id] = 'Select at least one option.';
      } else {
        if (val === undefined || val === null || String(val).trim() === '') errors[field.id] = 'This field is required.';
      }
    }
  }
  return errors;
}

function ReadOnlyApplication({ program, applicant }: { program: Program; applicant: ProgramApplicant }) {
  const st = STATUS_STYLES[applicant.decision];
  const schema = program.formSchema ?? [];
  const responses = applicant.responses ?? {};
  const age = Number(responses['age']);
  const isMinor = !Number.isNaN(age) && age > 0 && age < 18;

  const renderVal = (field: FormField) => {
    const v = responses[field.id];
    if (field.type === 'checkbox') return v ? 'Yes' : 'No';
    if (field.type === 'multiselect') return Array.isArray(v) && v.length ? v.join(', ') : '—';
    if (field.type === 'file') return v?.name ? v.name : '—';
    if (v === undefined || v === null || v === '') return '—';
    return String(v);
  };

  return (
    <main className="pb-32 bg-white">
      <section className="pt-[110px] pb-10 print:pt-6" style={{ background: 'var(--brutal-bg)' }}>
        <div className="max-w-[880px] mx-auto px-8 text-white print:text-[var(--ink)]">
          <div className="flex items-center justify-between flex-wrap gap-4 print:hidden">
            <Link href={`${BASE}/dashboard`} className="text-[12px] font-[700] uppercase tracking-wider text-white/50 hover:text-white transition-colors">← Back to Dashboard</Link>
            <div className="flex gap-2">
              <button onClick={() => window.print()} className="px-4 py-2 border-[2px] border-white/30 text-white font-[800] text-[11px] uppercase tracking-wider hover:bg-white hover:text-[var(--ink)] transition-colors">Print / Download PDF</button>
            </div>
          </div>
          <h1 className="font-[800] text-[clamp(28px,5vw,44px)] leading-[1.05] tracking-[-0.02em] mt-8 mb-3 print:text-[var(--ink)]">{program.name}</h1>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[11px] font-[800] uppercase tracking-wider px-3 py-1.5 border-[1.5px]" style={{ color: st.color, background: st.bg, borderColor: st.border }}>{st.label}</span>
            {applicant.submittedAt && <span className="text-[13px] text-white/50 print:text-[var(--ink-soft)]">Submitted {new Date(applicant.submittedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>}
          </div>
        </div>
      </section>

      <section className="py-12 print:py-6">
        <div className="max-w-[880px] mx-auto px-8 space-y-10">
          {schema.map(section => (
            <div key={section.id}>
              <h2 className="font-[800] text-[18px] uppercase tracking-[-0.01em] pb-3 border-b-[2.5px] border-[var(--ink)] mb-5">{section.title}</h2>
              <div className="space-y-4">
                {section.fields.filter(f => !isGuardianField(f.id) || isMinor).map(f => (
                  <div key={f.id}>
                    <div className="text-[12px] font-[700] uppercase tracking-wide text-[var(--ink-faint)] mb-1">{f.label}</div>
                    <div className="text-[14.5px] font-[500] text-[var(--ink)] whitespace-pre-wrap leading-relaxed">{renderVal(f)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function ApplicationSuccess({ programName }: { programName: string }) {
  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-white px-8">
      <Reveal className="text-center max-w-[520px]">
        <div className="text-[52px] mb-4">✓</div>
        <h1 className="font-[800] text-[clamp(26px,4vw,36px)] tracking-[-0.02em] mb-4">Application Submitted!</h1>
        <p className="text-[15px] text-[var(--ink-soft)] mb-8 leading-relaxed">
          Thanks for applying to {programName}. We've received your application and it's now under review. You'll see updates on your dashboard.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href={`${BASE}/dashboard`} className="px-6 py-3 border-[2px] border-[var(--ink)] bg-[var(--ink)] text-white font-[800] text-[12px] uppercase tracking-wider hover:bg-transparent hover:text-[var(--ink)] transition-colors">Go to Dashboard</Link>
          <Link href={`${BASE}/`} className="px-6 py-3 border-[2px] border-[var(--line)] text-[var(--ink)] font-[800] text-[12px] uppercase tracking-wider hover:border-[var(--ink)] transition-colors">Back Home</Link>
        </div>
      </Reveal>
    </main>
  );
}

export function ApplyProgram() {
  const params = useParams<{ programId: string }>();
  const { isAuthenticated, isLoading, user, login } = useAppAuth();
  const { programs, getApplication, saveApplication } = useAdmin();

  const program = useMemo(
    () => programs.find(p => p.id === params.programId || p.slug === params.programId),
    [programs, params.programId]
  );

  const memberId = user?.id ?? '';
  const existing = program && memberId ? getApplication(program.id, memberId) : undefined;

  const [responses, setResponses] = useState<Record<string, any>>(() => existing?.responses ?? {});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showReview, setShowReview] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [formError, setFormError] = useState('');

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-6 h-6 border-2 border-[var(--line)] border-t-[var(--ink)] rounded-full animate-spin" />
      </main>
    );
  }

  if (!program) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center bg-white px-8 text-center">
        <div>
          <div className="font-[800] text-[22px] uppercase mb-3">Program Not Found</div>
          <Link href={`${BASE}/`} className="text-[13px] font-[800] uppercase tracking-wider underline">Back Home</Link>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center px-8 bg-white text-center">
        <div className="border-[2.5px] border-[var(--ink)] shadow-[8px_8px_0px_var(--ink)] bg-white p-10 max-w-[440px] w-full">
          <div className="text-[11px] font-[800] uppercase tracking-[0.16em] text-[var(--violet)] mb-3">{program.name}</div>
          <div className="font-[800] text-[22px] tracking-[-0.02em] uppercase mb-3">Sign In to Apply</div>
          <p className="text-[14px] text-[var(--ink-soft)] mb-7">Create an account or sign in to start your application. You can save your progress and come back anytime.</p>
          <button onClick={login} className="w-full py-3 font-[800] text-[13px] uppercase tracking-wider text-white border-[2px] border-[var(--ink)] bg-[var(--ink)] hover:bg-transparent hover:text-[var(--ink)] transition-colors">Sign In</button>
        </div>
      </main>
    );
  }

  if (justSubmitted) {
    return <ApplicationSuccess programName={program.name} />;
  }

  if (existing && existing.decision !== 'draft') {
    return <ReadOnlyApplication program={program} applicant={existing} />;
  }

  const schema = program.formSchema ?? [];
  const age = Number(responses['age']);
  const isMinor = !Number.isNaN(age) && age > 0 && age < 18;

  const setField = (id: string, value: any) => {
    setResponses(prev => ({ ...prev, [id]: value }));
    setErrors(prev => { const n = { ...prev }; delete n[id]; return n; });
  };

  const displayName = responses['fullName'] || `${user?.firstName ?? ''}`.trim() || 'Applicant';
  const displayEmail = responses['email'] || user?.email || '';

  const handleSaveDraft = () => {
    const res = saveApplication(program.id, memberId, { name: displayName, email: displayEmail, responses }, false);
    if (res.success) {
      setSaveMsg('Draft saved.');
      setTimeout(() => setSaveMsg(''), 2500);
    } else {
      setFormError(res.error ?? 'Could not save.');
    }
  };

  const handleReviewClick = () => {
    const errs = validate(schema, responses);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setFormError('Please fill in all required fields before submitting.');
      const firstKey = Object.keys(errs)[0];
      document.getElementById(`field-${firstKey}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setFormError('');
    setShowReview(true);
  };

  const handleConfirmSubmit = () => {
    const res = saveApplication(program.id, memberId, { name: displayName, email: displayEmail, responses }, true);
    if (res.success) {
      setJustSubmitted(true);
    } else {
      setFormError(res.error ?? 'Could not submit.');
      setShowReview(false);
    }
  };

  return (
    <main className="pb-32">
      {/* HERO */}
      <section className="pt-[100px] pb-14 overflow-hidden relative" style={{ background: 'var(--brutal-bg)' }}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(90deg,white 0px,white 1px,transparent 1px,transparent 80px),repeating-linear-gradient(0deg,white 0px,white 1px,transparent 1px,transparent 80px)' }} />
        <div className="max-w-[820px] mx-auto px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
            <div className="text-[11px] font-[800] uppercase tracking-[0.18em] text-[var(--neon-cyan)] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#28c840]" />
              Applications Open
            </div>
            <h1 className="font-[800] text-[clamp(34px,5.5vw,58px)] leading-[0.95] tracking-[-0.03em] text-white uppercase mb-4">
              {SUMMER26_PROGRAM_COPY.title}
            </h1>
            <p className="text-[15px] text-[var(--neon-cyan)] font-[700] uppercase tracking-wider mb-6">{SUMMER26_PROGRAM_COPY.dates}</p>
            <div className="space-y-4">
              {SUMMER26_PROGRAM_COPY.intro.map((p, i) => (
                <p key={i} className="text-[14.5px] text-white/70 leading-[1.75]">{p}</p>
              ))}
            </div>
            {existing?.decision === 'draft' && (
              <div className="mt-6 inline-flex items-center gap-2 text-[12px] font-[700] uppercase tracking-wider px-3 py-2 border-[1.5px] border-white/20 text-white/70">
                📝 You have a saved draft — continue below.
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* FORM */}
      <section className="py-14 bg-white">
        <div className="max-w-[820px] mx-auto px-8">
          {schema.map((section, si) => (
            <Reveal key={section.id} delay={si * 0.03} className="mb-12">
              <div className="border-[2.5px] border-[var(--ink)] shadow-[6px_6px_0px_var(--ink)] bg-white p-7 md:p-9">
                <div className="flex items-center gap-3 mb-7 pb-5 border-b-[2px] border-[var(--line)]">
                  <span className="w-8 h-8 flex items-center justify-center border-[2px] border-[var(--ink)] font-[800] text-[13px] shrink-0">{si + 1}</span>
                  <h2 className="font-[800] text-[19px] uppercase tracking-[-0.01em]">{section.title}</h2>
                </div>
                {section.fields.filter(f => !isGuardianField(f.id) || isMinor).map(field => (
                  <div id={`field-${field.id}`} key={field.id}>
                    <ApplicationField
                      field={field}
                      value={responses[field.id]}
                      onChange={val => setField(field.id, val)}
                      error={errors[field.id]}
                    />
                  </div>
                ))}
              </div>
            </Reveal>
          ))}

          {formError && (
            <div className="mb-6 px-5 py-4 border-[2px] border-red-300 bg-red-50 text-[13px] font-[700] text-red-700">{formError}</div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sticky bottom-6 z-20">
            <button onClick={handleSaveDraft} className="flex-1 py-4 border-[2px] border-[var(--line)] bg-white text-[var(--ink)] font-[800] text-[12.5px] uppercase tracking-wider hover:border-[var(--ink)] transition-colors shadow-[4px_4px_0px_rgba(21,19,44,0.15)]">
              Save as Draft
            </button>
            <button onClick={handleReviewClick} className="flex-1 py-4 border-[2px] border-[var(--ink)] bg-[var(--ink)] text-white font-[800] text-[12.5px] uppercase tracking-wider hover:bg-transparent hover:text-[var(--ink)] transition-colors shadow-[4px_4px_0px_rgba(21,19,44,0.3)]">
              Review & Submit →
            </button>
          </div>
          <AnimatePresence>
            {saveMsg && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center text-[12.5px] font-[700] text-green-700 mt-3">
                ✓ {saveMsg}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* REVIEW MODAL */}
      <AnimatePresence>
        {showReview && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 bg-black/60 backdrop-blur-sm overflow-y-auto" onClick={() => setShowReview(false)}>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
              className="bg-white border-[2.5px] border-[var(--ink)] shadow-[10px_10px_0px_var(--ink)] w-full max-w-[720px] mb-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-7 py-5 border-b-[2px] border-[var(--ink)] bg-[var(--ink)]">
                <h3 className="font-[800] text-[15px] tracking-[0.06em] uppercase text-white">Review Your Application</h3>
                <button onClick={() => setShowReview(false)} className="w-7 h-7 flex items-center justify-center text-white/60 hover:text-white font-[700] text-[18px] transition-colors">×</button>
              </div>
              <div className="p-7 max-h-[60vh] overflow-y-auto">
                {schema.map(section => (
                  <div key={section.id} className="mb-6">
                    <div className="text-[11px] font-[800] uppercase tracking-wider text-[var(--ink-faint)] mb-3 pb-2 border-b border-[var(--line)]">{section.title}</div>
                    <div className="space-y-2.5">
                      {section.fields.filter(f => !isGuardianField(f.id) || isMinor).map(f => {
                        const v = responses[f.id];
                        const display = f.type === 'checkbox' ? (v ? 'Yes' : 'No')
                          : f.type === 'multiselect' ? (Array.isArray(v) && v.length ? v.join(', ') : '—')
                          : f.type === 'file' ? (v?.name ?? '—')
                          : (v ? String(v) : '—');
                        return (
                          <div key={f.id} className="flex flex-col sm:flex-row sm:justify-between gap-1 text-[13px]">
                            <span className="text-[var(--ink-soft)] font-[600] sm:max-w-[55%]">{f.label}</span>
                            <span className="font-[600] text-[var(--ink)] sm:text-right sm:max-w-[45%] truncate">{display}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <div className="text-[11.5px] text-[var(--ink-faint)] mt-4">
                  By submitting, your application will be locked and sent to GCL for review. Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
              <div className="flex gap-3 px-7 py-5 border-t-[2px] border-[var(--line)]">
                <button onClick={() => setShowReview(false)} className="flex-1 py-3 border-[2px] border-[var(--line)] text-[var(--ink)] font-[800] text-[11px] uppercase tracking-wider hover:border-[var(--ink)] transition-colors">Edit Answers</button>
                <button onClick={handleConfirmSubmit} className="flex-1 py-3 border-[2px] border-[var(--ink)] bg-[var(--ink)] text-white font-[800] text-[11px] uppercase tracking-wider hover:bg-transparent hover:text-[var(--ink)] transition-colors">Confirm & Submit</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
