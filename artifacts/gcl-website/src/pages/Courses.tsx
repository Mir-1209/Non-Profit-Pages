import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { courses, Course } from '../data/courses';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [vis, setVis] = React.useState(false);
  React.useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.06 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={vis ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }} className={className}>
      {children}
    </motion.div>
  );
}

// ─── Course photo placeholder ──────────────────────────────────────────────────
const COURSE_META: Record<string, { emoji: string; pattern: string; accent: string; bg: string; label: string }> = {
  't1': { emoji: '🧠', pattern: 'repeating-linear-gradient(45deg,rgba(255,255,255,0.06) 0px,rgba(255,255,255,0.06) 1px,transparent 1px,transparent 24px)', accent: '#6875f5', bg: 'linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#4338ca 100%)', label: 'Behavioral Economics' },
  't2': { emoji: '💸', pattern: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.06) 0px,rgba(255,255,255,0.06) 1px,transparent 1px,transparent 28px)', accent: '#ec4899', bg: 'linear-gradient(135deg,#4a044e 0%,#7e22ce 50%,#db2777 100%)', label: 'Applied Finance' },
  't3': { emoji: '🚀', pattern: 'repeating-linear-gradient(90deg,rgba(255,255,255,0.05) 0px,rgba(255,255,255,0.05) 1px,transparent 1px,transparent 32px)', accent: '#06b6d4', bg: 'linear-gradient(135deg,#0c1445 0%,#0e4f6d 50%,#0284c7 100%)', label: 'Systems Thinking' },
};

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  'Foundations':     { bg: 'rgba(104,117,245,0.15)', color: '#6875f5' },
  'Behavioral Econ': { bg: 'rgba(236,72,153,0.15)',  color: '#ec4899' },
  'Applied Finance': { bg: 'rgba(6,182,212,0.15)',   color: '#06b6d4' },
  'Advanced Theory': { bg: 'rgba(245,158,11,0.15)',  color: '#f59e0b' },
  'Investments':     { bg: 'rgba(40,200,64,0.15)',   color: '#28c840' },
  'Mindset':         { bg: 'rgba(139,92,246,0.15)',  color: '#8b5cf6' },
};

const LEVEL_COLORS: Record<string, { bg: string; color: string }> = {
  'Beginner':     { bg: 'rgba(40,200,64,0.12)',   color: '#28c840' },
  'Intermediate': { bg: 'rgba(245,158,11,0.12)',  color: '#f59e0b' },
  'Advanced':     { bg: 'rgba(239,68,68,0.12)',   color: '#ef4444' },
  'All Levels':   { bg: 'rgba(94,234,255,0.12)',  color: '#5eeaff' },
};

const FILTERS = ['All', 'Beginner', 'Intermediate', 'Advanced', 'All Levels'] as const;

// ─── Card Component ────────────────────────────────────────────────────────────
function CourseCard({ course, index }: { course: Course; index: number }) {
  const meta = COURSE_META[course.color] ?? COURSE_META['t1'];
  const tagStyle = TAG_COLORS[course.tag] ?? { bg: 'rgba(139,92,246,0.15)', color: '#8b5cf6' };
  const lvlStyle = LEVEL_COLORS[course.level] ?? { bg: 'rgba(255,255,255,0.1)', color: '#fff' };
  const fakeRating = (4.6 + (index % 3) * 0.1).toFixed(1);
  const fakeReviews = 180 + index * 47;
  const fakeEnrolled = 1200 + index * 380;
  const isPsychology = course.slug === 'psychology-of-spending';

  return (
    <Reveal delay={index * 0.07}>
      <Link href={`/courses/${course.slug}`} className="group block h-full">
        <div className="h-full flex flex-col bg-white rounded-[20px] border-[2.5px] border-[var(--ink)] shadow-[6px_6px_0px_var(--ink)] transition-all duration-200 hover:shadow-[10px_10px_0px_var(--ink)] hover:-translate-y-1 hover:-translate-x-1 overflow-hidden">

          {/* ── Photo placeholder ── */}
          <div className="relative shrink-0 overflow-hidden border-b-[2.5px] border-[var(--ink)]" style={{ height: 200, background: meta.bg }}>
            <div className="absolute inset-0" style={{ backgroundImage: meta.pattern }} />
            {/* Decorative radial glow */}
            <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 60% 70% at 70% 30%, ${meta.accent}44, transparent)` }} />

            {/* Big emoji watermark */}
            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[80px] opacity-15 select-none">{meta.emoji}</div>

            {/* Placeholder "photo" label */}
            <div className="absolute bottom-4 left-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-[800] uppercase tracking-wider text-white border border-white/20"
                style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(10px)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                {meta.label}
              </div>
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
              <span className="text-[10px] font-[800] uppercase tracking-wider px-2.5 py-1 rounded-full"
                style={{ background: tagStyle.bg, color: tagStyle.color, border: `1px solid ${tagStyle.color}44`, backdropFilter: 'blur(8px)' }}>
                {course.tag}
              </span>
              {isPsychology && (
                <span className="text-[10px] font-[800] uppercase tracking-wider px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(40,200,64,0.2)', color: '#28c840', border: '1px solid rgba(40,200,64,0.3)', backdropFilter: 'blur(8px)' }}>
                  ✦ Live
                </span>
              )}
            </div>

            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center">
                <span className="text-white text-lg ml-0.5">▶</span>
              </div>
            </div>
          </div>

          {/* ── Content ── */}
          <div className="flex flex-col flex-1 p-6">

            {/* Level + Duration row */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-[10px] font-[800] uppercase tracking-wider px-2.5 py-1 rounded-full"
                style={{ background: lvlStyle.bg, color: lvlStyle.color }}>
                {course.level}
              </span>
              <span className="text-[11px] text-[var(--ink-faint)] font-[600]">· {course.duration}</span>
              <span className="text-[11px] text-[var(--ink-faint)] font-[600]">· {course.modules.length} modules</span>
            </div>

            {/* Title */}
            <h3 className="font-[800] text-[19px] leading-[1.2] tracking-[-0.02em] mb-2 group-hover:text-[var(--violet)] transition-colors">{course.title}</h3>

            {/* Description — first module */}
            <p className="text-[13.5px] text-[var(--ink-soft)] leading-[1.65] mb-4 flex-1 line-clamp-2">
              {course.modules[0].description}
            </p>

            {/* Rating row */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} viewBox="0 0 16 16" className="w-3.5 h-3.5" fill={s <= 4 ? '#f59e0b' : 'none'} stroke="#f59e0b" strokeWidth="1.5">
                    <path d="M8 1l1.85 3.75 4.14.6-3 2.92.71 4.12L8 10.27l-3.7 1.95.71-4.12-3-2.92 4.14-.6z" />
                  </svg>
                ))}
              </div>
              <span className="text-[12px] font-[800] text-[#f59e0b]">{fakeRating}</span>
              <span className="text-[11px] text-[var(--ink-faint)]">({fakeReviews} reviews)</span>
              <span className="text-[11px] text-[var(--ink-faint)] ml-auto">👥 {fakeEnrolled.toLocaleString()}</span>
            </div>

            {/* Module preview chips */}
            <div className="flex gap-2 flex-wrap mb-5">
              {course.modules.slice(0, 3).map((mod, i) => (
                <span key={i} className="text-[10px] font-[600] px-2 py-1 rounded-md bg-[var(--paper-alt)] text-[var(--ink-soft)] border border-[var(--line)] truncate max-w-[140px]">
                  {mod.title.replace(/^Module \d+: /, '')}
                </span>
              ))}
              {course.modules.length > 3 && (
                <span className="text-[10px] font-[600] px-2 py-1 rounded-md bg-[var(--paper-alt)] text-[var(--ink-faint)] border border-[var(--line)]">
                  +{course.modules.length - 3} more
                </span>
              )}
            </div>

            {/* Instructors */}
            <div className="flex items-center gap-3 mb-5 pt-4 border-t border-[var(--line)]">
              <div className="flex -space-x-2">
                {course.instructors.map((inst, i) => (
                  <div key={i}
                    className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-[800] shrink-0"
                    style={{ background: i % 2 === 0 ? 'linear-gradient(135deg,var(--blue),var(--violet))' : 'linear-gradient(135deg,var(--violet),var(--magenta))' }}>
                    {inst.name.charAt(0)}
                  </div>
                ))}
              </div>
              <div className="text-[12px] text-[var(--ink-soft)] truncate">
                {course.instructors.map(i => i.name.split(' ')[0]).join(' & ')}
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <div className="flex-1 py-3 rounded-[12px] text-center text-[13px] font-[800] text-white transition-all group-hover:-translate-y-[1px]"
                style={{ background: 'var(--grad-brand)', boxShadow: '0 4px 14px rgba(139,92,246,0.25)' }}>
                {isPsychology ? 'Start Learning →' : 'Enroll Free →'}
              </div>
              <div className="w-10 h-10 rounded-[12px] border-[2px] border-[var(--ink)] flex items-center justify-center text-[var(--ink)] font-[800] text-[13px] shrink-0 hover:bg-[var(--ink)] hover:text-white transition-colors">
                ♾
              </div>
            </div>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

// ─── Enroll Modal ──────────────────────────────────────────────────────────────
function EnrollModal({ course, onClose }: { course: Course; onClose: () => void }) {
  const [step, setStep] = useState<'form' | 'done'>('form');
  const [form, setForm] = useState({ name: '', email: '', goal: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'Valid email required';
    return e;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setStep('done');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(11,8,23,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.93, y: 20 }}
        transition={{ duration: 0.25 }}
        className="bg-white rounded-[24px] border-[2.5px] border-[var(--ink)] shadow-[12px_12px_0px_var(--ink)] w-full max-w-[480px] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {step === 'form' ? (
          <>
            {/* Header */}
            <div className="p-7 pb-5 border-b border-[var(--line)]">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <div className="text-[11px] font-[800] uppercase tracking-[0.12em] text-[var(--violet)] mb-1">Free Enrollment</div>
                  <h2 className="font-[800] text-[22px] leading-tight">{course.title}</h2>
                </div>
                <button onClick={onClose} className="w-9 h-9 rounded-full border border-[var(--line)] flex items-center justify-center text-[var(--ink-faint)] hover:bg-[var(--paper-alt)] transition-colors text-[18px] shrink-0 ml-4">×</button>
              </div>
              <div className="flex gap-3 mt-3 flex-wrap">
                <span className="text-[11px] font-[700] text-[var(--ink-faint)] flex items-center gap-1">📚 {course.modules.length} modules</span>
                <span className="text-[11px] font-[700] text-[var(--ink-faint)] flex items-center gap-1">⏱ {course.duration}</span>
                <span className="text-[11px] font-[700] text-[#28c840] flex items-center gap-1">💚 100% Free</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={submit} className="p-7 space-y-4">
              <div>
                <label className="block text-[12px] font-[800] uppercase tracking-[0.08em] text-[var(--ink)] mb-1.5">Your Name</label>
                <input
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Alex Johnson"
                  className="w-full px-4 py-3 rounded-[12px] border-[2px] text-[14px] font-[500] outline-none transition-colors"
                  style={{ border: errors.name ? '2px solid #ef4444' : '2px solid var(--line)', background: 'var(--paper-alt)' }}
                />
                {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-[12px] font-[800] uppercase tracking-[0.08em] text-[var(--ink)] mb-1.5">Email Address</label>
                <input
                  type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-[12px] border-[2px] text-[14px] font-[500] outline-none transition-colors"
                  style={{ border: errors.email ? '2px solid #ef4444' : '2px solid var(--line)', background: 'var(--paper-alt)' }}
                />
                {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-[12px] font-[800] uppercase tracking-[0.08em] text-[var(--ink)] mb-1.5">Your goal <span className="font-[400] normal-case tracking-normal text-[var(--ink-faint)]">(optional)</span></label>
                <select
                  value={form.goal} onChange={e => setForm(f => ({ ...f, goal: e.target.value }))}
                  className="w-full px-4 py-3 rounded-[12px] border-[2px] border-[var(--line)] text-[14px] font-[500] outline-none bg-[var(--paper-alt)] text-[var(--ink)]">
                  <option value="">Select a goal…</option>
                  <option>Understand my spending habits</option>
                  <option>Get better at saving money</option>
                  <option>Learn about investing</option>
                  <option>Teach others financial literacy</option>
                  <option>Personal growth</option>
                </select>
              </div>

              <button type="submit"
                className="w-full py-4 rounded-[14px] text-white font-[800] text-[15px] transition-all hover:-translate-y-[2px] mt-2"
                style={{ background: 'var(--grad-brand)', boxShadow: '0 6px 20px rgba(139,92,246,0.35)' }}>
                Enroll Now — It's Free →
              </button>

              <p className="text-center text-[11px] text-[var(--ink-faint)]">
                No credit card. No spam. Unsubscribe anytime.
              </p>
            </form>
          </>
        ) : (
          <div className="p-10 text-center">
            <div className="text-5xl mb-5">🎉</div>
            <h2 className="font-[800] text-[26px] mb-3 tracking-[-0.02em]">You're enrolled!</h2>
            <p className="text-[15px] text-[var(--ink-soft)] leading-[1.6] mb-2">
              Welcome to <strong>{course.title}</strong>. We've sent your access link to <strong>{form.email}</strong>.
            </p>
            <p className="text-[13px] text-[var(--ink-faint)] mb-8">Check your inbox (and spam, just in case).</p>
            <div className="flex flex-col gap-3">
              {course.slug === 'psychology-of-spending' ? (
                <Link href={`/courses/${course.slug}/learn`}
                  className="py-4 px-8 rounded-full text-white font-[800] text-[15px] inline-block"
                  style={{ background: 'var(--grad-brand)', boxShadow: '0 6px 20px rgba(139,92,246,0.35)' }}>
                  Start Learning Now →
                </Link>
              ) : (
                <button onClick={onClose}
                  className="py-4 px-8 rounded-full text-white font-[800] text-[15px]"
                  style={{ background: 'var(--grad-brand)', boxShadow: '0 6px 20px rgba(139,92,246,0.35)' }}>
                  Explore More Courses →
                </button>
              )}
              <button onClick={onClose} className="text-[13px] text-[var(--ink-faint)] font-[600] hover:text-[var(--ink)] transition-colors">
                Back to courses
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export function Courses() {
  const [filter, setFilter] = useState<string>('All');
  const [enrolling, setEnrolling] = useState<Course | null>(null);

  const filtered = filter === 'All' ? courses : courses.filter(c => c.level === filter);

  const totalEnrolled = courses.reduce((acc, _, i) => acc + 1200 + i * 380, 0);
  const totalModules  = courses.reduce((acc, c) => acc + c.modules.length, 0);

  return (
    <main className="min-h-screen">
      {/* ─── HERO ────────────────────────────────────────────────────────────── */}
      <section className="pt-[90px] pb-0 overflow-hidden" style={{ background: 'var(--brutal-bg)' }}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: 'repeating-linear-gradient(90deg,white 0px,white 1px,transparent 1px,transparent 80px),repeating-linear-gradient(0deg,white 0px,white 1px,transparent 1px,transparent 80px)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 80% at 80% 40%, rgba(139,92,246,0.18), transparent)' }} />

        <div className="max-w-[1240px] mx-auto px-8 relative z-10 pb-0">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
            <div className="border-b-[2.5px] border-white/10 pb-10">
              <div className="text-[11px] font-[800] uppercase tracking-[0.18em] text-[var(--neon-cyan)] mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--neon-cyan)] animate-pulse" />
                Open-Access · Free · No Gatekeepers
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-end">
                <div>
                  <h1 className="font-[800] text-[clamp(52px,8vw,100px)] leading-[0.88] tracking-[-0.04em] text-white uppercase">
                    Learn<br />Money.<br /><span style={{ WebkitTextStroke: '2px rgba(255,255,255,0.6)', color: 'transparent' }}>Master</span><br />
                    <span style={{ WebkitTextStroke: '2px rgba(255,255,255,0.6)', color: 'transparent' }}>Life.</span>
                  </h1>
                </div>
                <div className="max-w-[340px] pb-2">
                  <p className="text-[16px] text-[var(--brutal-text-dim)] leading-[1.7] mb-6">
                    Behavioral economics. Applied finance. Financial psychology. Courses built for the real world — no prerequisites, no fees, no excuses.
                  </p>
                  <Link href="#courses" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-[13px] font-[800] text-[var(--ink)] bg-[var(--neon-cyan)] hover:-translate-y-[2px] transition-all">
                    Browse Courses ↓
                  </Link>
                </div>
              </div>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10 py-5">
              {[
                { n: courses.length, label: 'Courses Available', suffix: '' },
                { n: totalModules, label: 'Total Modules', suffix: '+' },
                { n: Math.round(totalEnrolled / 1000), label: 'Students Enrolled', suffix: 'K+' },
                { n: 100, label: 'Completion — Free', suffix: '%' },
              ].map(s => (
                <div key={s.label} className="px-6 first:pl-0">
                  <div className="font-[800] text-[clamp(24px,3vw,36px)] text-white tracking-[-0.02em]">{s.n}{s.suffix}</div>
                  <div className="text-[11px] font-[600] uppercase tracking-wider text-[var(--brutal-text-dim)]">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FILTER + GRID ───────────────────────────────────────────────────── */}
      <section className="py-16 bg-[var(--paper-alt)]" id="courses">
        <div className="max-w-[1240px] mx-auto px-8">

          {/* Filter bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-8 border-b-[2.5px] border-[var(--ink)]">
            <h2 className="font-[800] text-[clamp(22px,3vw,32px)] tracking-[-0.02em] uppercase">All Courses</h2>
            <div className="flex gap-2 flex-wrap">
              {FILTERS.map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className="px-4 py-2 text-[12px] font-[800] uppercase tracking-wider transition-all border-[2px] rounded-none"
                  style={filter === f
                    ? { background: 'var(--ink)', color: '#fff', border: '2px solid var(--ink)', boxShadow: '3px 3px 0px rgba(21,19,44,0.3)' }
                    : { background: 'transparent', color: 'var(--ink-soft)', border: '2px solid var(--line)' }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div key={filter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filtered.map((course, i) => (
                <CourseCard key={course.slug} course={course} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-24 border-[2.5px] border-[var(--line)] text-[var(--ink-soft)] font-[700] text-[16px] uppercase tracking-wider">
              No courses at this level yet.
            </div>
          )}
        </div>
      </section>

      {/* ─── HOW ENROLLMENT WORKS ────────────────────────────────────────────── */}
      <section className="py-20 bg-white border-t-[2.5px] border-[var(--ink)]">
        <div className="max-w-[1240px] mx-auto px-8">
          <Reveal className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-[12px] font-[800] tracking-[0.08em] uppercase text-[var(--pill-ink)] bg-[var(--pill-bg)] px-3 py-1.5 rounded-full mb-4">
              Enrollment Process
            </span>
            <h2 className="font-[800] text-[clamp(28px,4vw,46px)] leading-[1.06] tracking-[-0.03em]">
              Zero barriers. Start in 60 seconds.
            </h2>
            <p className="text-[15px] text-[var(--ink-soft)] mt-3 max-w-[460px] mx-auto">No credit card. No waitlist. No form that asks your life story. Just pick a course and go.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Dashed connector */}
            <div className="hidden md:block absolute top-[44px] left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-[2px] border-t-[2.5px] border-dashed border-[var(--line)]" />

            {[
              { step: '01', icon: '📖', title: 'Pick a Course', desc: 'Browse our full curriculum and choose what resonates with your goals.' },
              { step: '02', icon: '✍️', title: 'Quick Enroll', desc: 'Enter your name and email — that\'s genuinely it. No paywall, no catch.' },
              { step: '03', icon: '🎬', title: 'Start Learning', desc: 'Access all videos, readings, and worksheets instantly from any device.' },
              { step: '04', icon: '🏆', title: 'Earn Certificate', desc: 'Score 8/10 or higher on module quizzes to unlock your completion certificate.' },
            ].map((s, i) => (
              <Reveal key={s.step} delay={i * 0.1}>
                <div className="text-center">
                  <div className="w-[88px] h-[88px] mx-auto mb-5 rounded-[20px] bg-white border-[2.5px] border-[var(--ink)] shadow-[5px_5px_0px_var(--ink)] flex items-center justify-center text-3xl relative z-10">
                    {s.icon}
                  </div>
                  <div className="text-[10px] font-[800] uppercase tracking-[0.14em] text-[var(--ink-faint)] mb-2">{s.step}</div>
                  <h4 className="font-[800] text-[17px] mb-2">{s.title}</h4>
                  <p className="text-[13.5px] text-[var(--ink-soft)] leading-[1.65] max-w-[220px] mx-auto">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY GCL ────────────────────────────────────────────────────────── */}
      <section className="py-20 border-t-[2.5px] border-[var(--ink)]" style={{ background: 'var(--brutal-bg)' }}>
        <div className="max-w-[1240px] mx-auto px-8">
          <Reveal className="mb-12 text-center">
            <h2 className="font-[800] text-[clamp(28px,4vw,46px)] leading-[1.06] tracking-[-0.03em] text-white">
              Why GCL is different
            </h2>
            <p className="text-[15px] text-[var(--brutal-text-dim)] mt-3 max-w-[460px] mx-auto">
              We don't teach spreadsheets. We teach the psychology behind every financial decision you make.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: '🧠', color: '#6875f5',
                title: 'Behavioral First',
                desc: 'Every course is grounded in behavioral economics — understanding WHY you make financial choices before HOW to change them.'
              },
              {
                icon: '🌍', color: '#28c840',
                title: 'Globally Adapted',
                desc: 'Our curriculum acknowledges that financial systems vary. Content is relevant whether you\'re in Tashkent, Lagos, or London.'
              },
              {
                icon: '💸', color: '#5eeaff',
                title: 'Radically Free',
                desc: 'No freemium. No locked modules. No "premium" tier. Every word, every video, every certificate — free, forever.'
              },
              {
                icon: '🎯', color: '#ec4899',
                title: 'Youth-Centered',
                desc: 'Designed for people 15–30 navigating their first real financial decisions. Language that slaps, concepts that stick.'
              },
              {
                icon: '🏆', color: '#f59e0b',
                title: 'Certificates That Count',
                desc: 'Our completion certificates are earned, not given. Score 8+ and show the world you actually did the work.'
              },
              {
                icon: '🔄', color: '#8b5cf6',
                title: 'Community-Taught',
                desc: 'The best learners become educators. Our Train-the-Trainer program turns GCL graduates into chapter leaders.'
              },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="p-6 rounded-[18px] border border-[rgba(246,244,255,0.1)]"
                  style={{ background: 'var(--brutal-bg-2)' }}>
                  <div className="w-10 h-10 rounded-[12px] flex items-center justify-center text-xl mb-4"
                    style={{ background: `${item.color}20`, border: `1px solid ${item.color}30` }}>
                    {item.icon}
                  </div>
                  <h4 className="font-[800] text-[16px] text-white mb-2">{item.title}</h4>
                  <p className="text-[13px] text-[var(--brutal-text-dim)] leading-[1.65]">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA ────────────────────────────────────────────────────── */}
      <section className="py-16 bg-[var(--paper-alt)] border-t-[2.5px] border-[var(--ink)]">
        <div className="max-w-[1240px] mx-auto px-8">
          <Reveal>
            <div className="rounded-[28px] p-[70px_40px] text-center relative overflow-hidden border-[2.5px] border-[var(--ink)] shadow-[10px_10px_0px_var(--ink)]"
              style={{ background: 'linear-gradient(135deg, #e9edff 0%, #f7e6fb 50%, #fce4f2 100%)' }}>
              <div className="absolute inset-0 pointer-events-none opacity-[0.05]"
                style={{ backgroundImage: 'repeating-linear-gradient(45deg,var(--ink) 0px,var(--ink) 1px,transparent 1px,transparent 28px)' }} />
              <div className="relative">
                <p className="text-[12px] font-[800] tracking-[0.14em] uppercase text-[var(--ink-faint)] mb-3">Your financial glow-up starts here 💸</p>
                <h2 className="font-[800] text-[clamp(28px,5vw,52px)] leading-[1.05] tracking-[-0.03em] max-w-[640px] mx-auto mb-4 uppercase">
                  Ready to change the narrative?
                </h2>
                <p className="text-[var(--ink-soft)] text-[15px] max-w-[440px] mx-auto mb-8">
                  {courses.length} courses. {totalModules}+ modules. Zero fees. Pick your first course and start building financial intelligence today.
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                  <Link href="/courses/psychology-of-spending"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-[800] text-[15px] transition-all hover:-translate-y-[2px]"
                    style={{ background: 'var(--grad-brand)', boxShadow: '0 8px 24px rgba(139,92,246,0.35)' }}>
                    Start with Psychology of Spending →
                  </Link>
                  <Link href="/events"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-[800] text-[15px] border-[2.5px] border-[var(--ink)] text-[var(--ink)] bg-white hover:-translate-y-[2px] transition-all shadow-[4px_4px_0px_var(--ink)]">
                    Find a Live Event
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── ENROLLMENT MODAL ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {enrolling && <EnrollModal course={enrolling} onClose={() => setEnrolling(null)} />}
      </AnimatePresence>
    </main>
  );
}
