import React, { useState } from 'react';
import { Link, useParams } from 'wouter';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { chapters, STATUS_COLOR, STATUS_LABEL } from '../data/chapters';
import { events } from '../data/events';
import { courses } from '../data/courses';

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref as any, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }} className={className}>
      {children}
    </motion.div>
  );
}

const spotsLeft = (ev: typeof events[number]) => ev.capacity - ev.registered;
const spotsColor = (n: number) => n <= 10 ? '#e53e3e' : n <= 30 ? '#d69e2e' : '#28c840';

const COURSE_META: Record<string, { emoji: string; bg: string; accent: string; pattern: string }> = {
  't1': { emoji: '🧠', bg: 'linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#4338ca 100%)', accent: '#6875f5', pattern: 'repeating-linear-gradient(45deg,rgba(255,255,255,0.06) 0px,rgba(255,255,255,0.06) 1px,transparent 1px,transparent 24px)' },
  't2': { emoji: '💸', bg: 'linear-gradient(135deg,#0f2440 0%,#1e3a6e 50%,#1e4488 100%)', accent: '#3b82f6', pattern: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.06) 0px,rgba(255,255,255,0.06) 1px,transparent 1px,transparent 28px)' },
  't3': { emoji: '🚀', bg: 'linear-gradient(135deg,#0c1445 0%,#0e4f6d 50%,#0284c7 100%)', accent: '#06b6d4', pattern: 'repeating-linear-gradient(90deg,rgba(255,255,255,0.05) 0px,rgba(255,255,255,0.05) 1px,transparent 1px,transparent 32px)' },
};

export function ChapterDetail() {
  const { id } = useParams<{ id: string }>();
  const chapter = chapters.find(c => c.id === id);
  const [form, setForm] = useState({ name: '', email: '', motivation: '' });
  const [submitted, setSubmitted] = useState(false);

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--brutal-bg)', color: '#fff' }}>
        <div className="text-center">
          <div className="text-[64px] mb-4">🌍</div>
          <h1 className="font-[800] text-[28px] mb-3 uppercase tracking-[-0.02em]">Chapter not found</h1>
          <Link href="/chapters" className="text-[var(--neon-cyan)] text-[13px] font-[700]">← Back to all chapters</Link>
        </div>
      </div>
    );
  }

  const color = STATUS_COLOR[chapter.status];
  const chapterEvents = events.filter(e => e.chapterId === chapter.id);
  const chapterCourses = courses.filter(c => c.chapterId === chapter.id);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); };

  return (
    <main className="pb-0">

      {/* ══════════════════════════════
          HERO — Brutalist Dark
      ══════════════════════════════ */}
      <section className="relative pt-[90px] overflow-hidden" style={{ background: 'var(--brutal-bg)' }}>
        {/* Grid texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: 'repeating-linear-gradient(90deg,white 0px,white 1px,transparent 1px,transparent 80px),repeating-linear-gradient(0deg,white 0px,white 1px,transparent 1px,transparent 80px)' }} />
        {/* Status-color glow */}
        <div className="absolute top-0 left-0 w-[700px] h-[700px] pointer-events-none"
          style={{ background: `radial-gradient(circle, ${color}18, transparent 65%)`, filter: 'blur(80px)' }} />

        <div className="max-w-[1240px] mx-auto px-8 relative z-10">
          {/* Back */}
          <div className="mb-8 pt-4">
            <Link href="/chapters"
              className="inline-flex items-center gap-2 text-[11px] font-[800] uppercase tracking-[0.12em] text-white/45 hover:text-[var(--neon-cyan)] transition-colors">
              ← All Chapters
            </Link>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span className="inline-flex items-center gap-2 text-[10px] font-[800] uppercase tracking-[0.12em] px-3 py-1.5"
              style={{ background: color + '20', border: `1.5px solid ${color}55`, color }}>
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
              {STATUS_LABEL[chapter.status]}
            </span>
            <span className="text-[11px] font-[700] text-white/35 border border-white/10 px-3 py-1.5">
              Est. {chapter.founded}
            </span>
            {chapter.university && (
              <span className="text-[11px] font-[600] text-white/40 border border-white/10 px-3 py-1.5">
                🎓 {chapter.university}
              </span>
            )}
          </div>

          {/* Headline */}
          <div className="border-b-[2.5px] border-white/10 pb-8">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
              <div className="flex items-start gap-5 mb-5 flex-wrap">
                <span className="text-[clamp(48px,6vw,80px)] leading-none mt-2 shrink-0">{chapter.flagEmoji}</span>
                <h1 className="font-[800] text-[clamp(40px,7vw,88px)] leading-[0.88] tracking-[-0.04em] text-white uppercase">
                  {chapter.name}
                </h1>
              </div>

              <p className="text-[16px] text-[var(--brutal-text-dim)] max-w-[580px] leading-[1.7] mb-6">
                {chapter.focus}
              </p>

              {/* Tags — brutalist pill style */}
              <div className="flex flex-wrap gap-2 mb-8">
                {chapter.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-[800] uppercase tracking-wider px-3 py-1.5 border-[1.5px]"
                    style={{ borderColor: color + '60', color }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex gap-3 flex-wrap">
                <a href="#join"
                  className="inline-flex items-center gap-2 px-7 py-[14px] font-[800] text-[14px] uppercase tracking-wider transition-all hover:-translate-y-[2px]"
                  style={{ background: color, color: '#000', boxShadow: `0 4px 28px ${color}45` }}>
                  Join {chapter.city} Chapter →
                </a>
                <a href={`mailto:${chapter.contact}`}
                  className="inline-flex items-center gap-2 px-7 py-[14px] font-[800] text-[14px] uppercase tracking-wider text-white border-[2px] border-white/20 hover:border-white/50 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)' }}>
                  ✉ Contact
                </a>
              </div>
            </motion.div>
          </div>

          {/* Stats bar — matching Home/Events pattern */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10"
          >
            {[
              { icon: '👥', value: chapter.members, label: 'Active Members' },
              { icon: '📅', value: chapter.eventsHosted, label: 'Events Hosted' },
              { icon: '🎓', value: chapter.studentsEducated >= 1000 ? `${(chapter.studentsEducated / 1000).toFixed(1)}k` : chapter.studentsEducated, label: 'Students Reached' },
              { icon: '🔥', value: chapterEvents.length + chapterCourses.length, label: 'Live Programs' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-3 py-6 px-5 first:pl-0">
                <span className="text-xl shrink-0">{s.icon}</span>
                <div>
                  <div className="font-[800] text-[clamp(22px,2.5vw,34px)] text-white leading-none tracking-[-0.04em]">{s.value}</div>
                  <div className="text-[11px] font-[600] uppercase tracking-wider text-[var(--brutal-text-dim)] mt-1">{s.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* ══════════════════════════════
          ABOUT — White section
      ══════════════════════════════ */}
      <section className="py-[80px] bg-white border-b-[2.5px] border-[var(--ink)]">
        <div className="max-w-[1240px] mx-auto px-8">
          <Reveal>
            <div className="text-[11px] font-[800] uppercase tracking-[0.16em] text-[var(--violet)] mb-4">About</div>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-12 items-start">
              <div>
                <h2 className="font-[800] text-[clamp(26px,4vw,42px)] tracking-[-0.03em] leading-[1.08] mb-5 uppercase">
                  {chapter.city}'s hub for<br />financial literacy.
                </h2>
                <p className="text-[16px] text-[var(--ink-soft)] leading-[1.8]">{chapter.about}</p>
              </div>

              {/* Info card — brutalist */}
              <div className="rounded-none border-[2.5px] border-[var(--ink)] shadow-[6px_6px_0px_var(--ink)] overflow-hidden">
                {[
                  { label: 'City', value: `${chapter.city}, ${chapter.country}` },
                  { label: 'University', value: chapter.university || 'Independent' },
                  { label: 'Chapter Lead', value: chapter.lead },
                  { label: 'Founder', value: chapter.founder },
                  { label: 'Founded', value: String(chapter.founded) },
                ].map((r, i, arr) => (
                  <div key={r.label} className={`flex items-center justify-between px-5 py-3.5 ${i < arr.length - 1 ? 'border-b-[2px] border-[var(--line)]' : ''}`}
                    style={{ background: i % 2 === 0 ? 'white' : 'var(--paper-alt)' }}>
                    <span className="text-[11px] font-[700] uppercase tracking-[0.08em] text-[var(--ink-faint)]">{r.label}</span>
                    <span className="text-[13px] font-[800] text-[var(--ink)] max-w-[160px] text-right truncate">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>


      {/* ══════════════════════════════
          EVENTS — Dark section
      ══════════════════════════════ */}
      <section className="py-[80px]" style={{ background: 'var(--brutal-bg)' }}>
        <div className="max-w-[1240px] mx-auto px-8">
          <Reveal>
            <div className="flex items-end justify-between mb-8 pb-5 border-b-[2.5px] border-white/10">
              <div>
                <div className="text-[11px] font-[800] uppercase tracking-[0.16em] text-[var(--neon-cyan)] mb-2">Chapter Events</div>
                <h2 className="font-[800] text-[clamp(22px,3.5vw,38px)] text-white tracking-[-0.03em] uppercase">
                  Events ({chapterEvents.length})
                </h2>
              </div>
              <Link href="/events" className="text-[12px] font-[800] uppercase tracking-wider text-white/35 hover:text-[var(--neon-cyan)] transition-colors">
                All Events →
              </Link>
            </div>
          </Reveal>

          {chapterEvents.length === 0 ? (
            <div className="py-16 border-[2.5px] border-white/10 text-center text-white/35 font-[700] uppercase tracking-wider text-[13px]">
              No upcoming events for this chapter yet.
            </div>
          ) : (
            <div className="space-y-4">
              {chapterEvents.map((ev, i) => (
                <Reveal key={ev.id} delay={i * 0.07}>
                  <Link href={`/events/${ev.id}`}
                    className="block border-[2.5px] shadow-[6px_6px_0px_rgba(0,0,0,0.6)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0px_rgba(0,0,0,0.6)] transition-all group"
                    style={{ borderColor: 'var(--brutal-line)', background: 'var(--brutal-bg-2)' }}>
                    <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-stretch">
                      {/* Date block */}
                      <div className="flex flex-col items-center justify-center px-7 py-6 border-b-[2.5px] md:border-b-0 md:border-r-[2.5px] border-[var(--brutal-line)] min-w-[100px] text-white"
                        style={{ background: `linear-gradient(135deg, ${color}22, rgba(11,8,23,0.9))` }}>
                        <div className="font-[800] text-[38px] leading-none" style={{ color }}>{ev.date.day}</div>
                        <div className="text-[12px] font-[800] uppercase tracking-wider text-white/55 mt-1">{ev.date.month}</div>
                        <div className="text-[11px] font-[600] text-white/35 mt-0.5">{ev.date.year}</div>
                      </div>
                      {/* Info */}
                      <div className="p-6">
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="text-[10px] font-[800] uppercase tracking-wider px-2.5 py-1 border-[1.5px] border-white/15 text-white/55">{ev.format}</span>
                          <span className="text-[10px] font-[800] uppercase tracking-wider px-2.5 py-1 border-[1.5px] border-green-500/30 text-green-400">{ev.type}</span>
                          {ev.featured && <span className="text-[10px] font-[800] uppercase tracking-wider px-2.5 py-1 border-[1.5px] border-yellow-500/35 text-yellow-400">★ Featured</span>}
                        </div>
                        <h3 className="font-[800] text-[20px] leading-tight tracking-[-0.01em] mb-1.5 text-white group-hover:text-[var(--neon-cyan)] transition-colors">{ev.title}</h3>
                        <p className="text-[13px] text-[var(--brutal-text-dim)] leading-[1.6] line-clamp-2 mb-3">{ev.description}</p>
                        <div className="flex flex-wrap gap-5 text-[12px] text-white/45 font-[600]">
                          <span>🕐 {ev.time} {ev.timezone}</span>
                          <span>🎤 {ev.speaker}</span>
                          <span>📍 {ev.location}</span>
                        </div>
                      </div>
                      {/* Spots */}
                      <div className="flex flex-col items-center justify-center p-6 border-t-[2.5px] md:border-t-0 md:border-l-[2.5px] border-[var(--brutal-line)] min-w-[130px] gap-2"
                        style={{ background: 'rgba(0,0,0,0.25)' }}>
                        <div className="font-[800] text-[28px] leading-none text-white" style={{ color: spotsColor(spotsLeft(ev)) }}>
                          {spotsLeft(ev)}
                        </div>
                        <div className="text-[10px] font-[700] uppercase tracking-wider text-white/40">Spots Left</div>
                        <div className="w-full h-1.5 bg-white/10 overflow-hidden mt-1">
                          <div className="h-full transition-all" style={{ width: `${Math.min(100, ev.registered / ev.capacity * 100)}%`, background: color }} />
                        </div>
                        <div className="text-[11px] text-white/35 font-[500]">{ev.registered}/{ev.capacity}</div>
                        <span className="font-[800] text-[11px] uppercase tracking-wider text-white/40 group-hover:text-[var(--neon-cyan)] transition-colors mt-1">View →</span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>


      {/* ══════════════════════════════
          COURSES — Light section
      ══════════════════════════════ */}
      <section className="py-[80px] border-y-[2.5px] border-[var(--ink)]" style={{ background: 'var(--paper-alt)' }}>
        <div className="max-w-[1240px] mx-auto px-8">
          <Reveal>
            <div className="flex items-end justify-between mb-8 pb-5 border-b-[2.5px] border-[var(--ink)]">
              <div>
                <div className="text-[11px] font-[800] uppercase tracking-[0.16em] text-[var(--violet)] mb-2">Chapter Courses</div>
                <h2 className="font-[800] text-[clamp(22px,3.5vw,38px)] tracking-[-0.03em] uppercase">
                  Courses ({chapterCourses.length})
                </h2>
              </div>
              <Link href="/courses" className="text-[12px] font-[800] uppercase tracking-wider text-[var(--ink-faint)] hover:text-[var(--ink)] transition-colors">
                All Courses →
              </Link>
            </div>
          </Reveal>

          {chapterCourses.length === 0 ? (
            <div className="py-16 border-[2.5px] border-[var(--line)] text-center text-[var(--ink-faint)] font-[700] uppercase tracking-wider text-[13px]">
              No courses from this chapter yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chapterCourses.map((course, i) => {
                const meta = COURSE_META[course.color] ?? COURSE_META['t1'];
                return (
                  <Reveal key={course.slug} delay={i * 0.08}>
                    <Link href={`/courses/${course.slug}`} className="group block h-full">
                      <div className="h-full flex flex-col bg-white rounded-[20px] border-[2.5px] border-[var(--ink)] shadow-[6px_6px_0px_var(--ink)] transition-all duration-200 hover:shadow-[10px_10px_0px_var(--ink)] hover:-translate-y-1 hover:-translate-x-1 overflow-hidden">
                        {/* Photo header */}
                        <div className="relative shrink-0 overflow-hidden border-b-[2.5px] border-[var(--ink)]" style={{ height: 160, background: meta.bg }}>
                          <div className="absolute inset-0" style={{ backgroundImage: meta.pattern }} />
                          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 60% 70% at 70% 30%, ${meta.accent}44, transparent)` }} />
                          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[72px] opacity-15 select-none">{meta.emoji}</div>
                          <div className="absolute top-4 left-4">
                            <span className="text-[10px] font-[800] uppercase tracking-wider px-2.5 py-1.5 rounded-full text-white border border-white/20"
                              style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)' }}>
                              {course.tag}
                            </span>
                          </div>
                          <div className="absolute bottom-3 right-4 text-[11px] font-[700] text-white/55">{course.duration}</div>
                        </div>
                        {/* Body */}
                        <div className="flex flex-col flex-1 p-5">
                          <div className="text-[11px] font-[700] text-[var(--ink-faint)] mb-2">{course.level} · {course.modules.length} modules</div>
                          <h3 className="font-[800] text-[18px] leading-[1.2] tracking-[-0.02em] mb-3 group-hover:text-[var(--violet)] transition-colors">{course.title}</h3>
                          <div className="flex gap-2 flex-wrap mb-4">
                            {course.modules.slice(0, 2).map((mod, mi) => (
                              <span key={mi} className="text-[10px] font-[600] px-2 py-1 bg-[var(--paper-alt)] text-[var(--ink-soft)] border border-[var(--line)] truncate max-w-[160px]">
                                {mod.title.replace(/^Module \d+: /, '')}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-3 mt-auto pt-4 border-t-[2px] border-[var(--line)]">
                            <div className="flex -space-x-2">
                              {course.instructors.slice(0, 2).map((inst, ii) => (
                                <div key={ii} className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-[800]"
                                  style={{ background: 'linear-gradient(135deg, var(--blue), var(--violet))' }}>
                                  {inst.name.charAt(0)}
                                </div>
                              ))}
                            </div>
                            <span className="text-[12px] text-[var(--ink-soft)] truncate">{course.instructors.map(i => i.name.split(' ')[0]).join(' & ')}</span>
                            <span className="ml-auto font-[800] text-[12px] text-[var(--violet)]">Enroll →</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>


      {/* ══════════════════════════════
          TEAM — White section
      ══════════════════════════════ */}
      <section className="py-[80px] bg-white border-b-[2.5px] border-[var(--ink)]">
        <div className="max-w-[1240px] mx-auto px-8">
          <Reveal>
            <div className="text-[11px] font-[800] uppercase tracking-[0.16em] text-[var(--blue)] mb-3">The People</div>
            <h2 className="font-[800] text-[clamp(22px,3.5vw,38px)] tracking-[-0.03em] uppercase mb-8">Chapter Team</h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { name: chapter.founder, role: 'Chapter Founder', isOpen: false },
              { name: chapter.lead, role: 'Chapter Lead', isOpen: false },
              { name: 'Open Position', role: 'Events Coordinator', isOpen: true },
              { name: 'Open Position', role: 'Community Manager', isOpen: true },
            ].map((m, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className={`border-[2.5px] border-[var(--ink)] shadow-[6px_6px_0px_var(--ink)] p-6 text-center ${m.isOpen ? 'bg-[var(--paper-alt)]' : 'bg-white'}`}>
                  <div className={`w-[60px] h-[60px] rounded-full mx-auto mb-4 border-[2.5px] border-[var(--ink)] flex items-center justify-center font-[800] text-[18px]`}
                    style={{ background: m.isOpen ? 'var(--line)' : 'var(--ink)', color: m.isOpen ? 'var(--ink-faint)' : '#fff' }}>
                    {m.isOpen ? '+' : m.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                  </div>
                  <div className={`font-[800] text-[15px] mb-1.5 ${m.isOpen ? 'text-[var(--ink-faint)]' : 'text-[var(--ink)]'}`}>
                    {m.isOpen ? 'Open Position' : m.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] font-[700] uppercase tracking-[0.08em] text-[var(--ink-faint)] mb-3">{m.role}</div>
                  {m.isOpen && (
                    <div className="text-[10px] font-[800] uppercase tracking-wider text-[var(--blue)] border-[1.5px] border-[var(--blue)]/40 px-3 py-1 inline-block">
                      Apply →
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════
          JOIN — Dark CTA section
      ══════════════════════════════ */}
      <section id="join" className="py-[80px]" style={{ background: 'var(--brutal-bg)' }}>
        <div className="max-w-[1240px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

            {/* Left */}
            <Reveal>
              <div className="text-[11px] font-[800] uppercase tracking-[0.16em] text-[var(--neon-cyan)] mb-4">Join the Chapter</div>
              <h2 className="font-[800] text-[clamp(28px,4.5vw,54px)] leading-[0.9] tracking-[-0.04em] text-white uppercase mb-5">
                Become part<br />of {chapter.name}.
              </h2>
              <p className="text-[15px] text-[var(--brutal-text-dim)] leading-[1.75] mb-7 max-w-[420px]">
                Register your interest —{' '}
                <strong className="text-white font-[700]">{chapter.lead}</strong>{' '}
                will reach out within 3 business days.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  'Free access to all chapter events & workshops',
                  "Connect with GCL's global student network",
                  'Mentorship from experienced educators',
                ].map(b => (
                  <div key={b} className="flex items-center gap-3 text-[14px] text-white/60 font-[500]">
                    <span className="w-5 h-5 border-[1.5px] flex items-center justify-center text-[10px] font-[800] shrink-0"
                      style={{ borderColor: color, color }}>✓</span>
                    {b}
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Right — form */}
            <Reveal delay={0.12}>
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="border-[2.5px] p-10 text-center" style={{ borderColor: color }}>
                    <div className="text-[56px] mb-5">🎉</div>
                    <div className="font-[800] text-[22px] text-white uppercase tracking-[-0.02em] mb-3">Application Received!</div>
                    <div className="text-[14px] text-white/45">{chapter.lead} from {chapter.name} will be in touch soon.</div>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-[800] uppercase tracking-[0.1em] text-white/40 mb-2">Full Name</label>
                        <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                          placeholder="Jane Smith" required
                          className="w-full border-[2px] border-white/15 text-white placeholder:text-white/20 px-4 py-3 text-[14px] font-[500] outline-none focus:border-white/40 transition-colors"
                          style={{ background: 'rgba(255,255,255,0.06)' }} />
                      </div>
                      <div>
                        <label className="block text-[11px] font-[800] uppercase tracking-[0.1em] text-white/40 mb-2">Email</label>
                        <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                          placeholder="you@uni.edu" required
                          className="w-full border-[2px] border-white/15 text-white placeholder:text-white/20 px-4 py-3 text-[14px] font-[500] outline-none focus:border-white/40 transition-colors"
                          style={{ background: 'rgba(255,255,255,0.06)' }} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-[800] uppercase tracking-[0.1em] text-white/40 mb-2">Why do you want to join?</label>
                      <textarea value={form.motivation} onChange={e => setForm(f => ({ ...f, motivation: e.target.value }))} rows={4}
                        placeholder="Tell us about your interest in financial literacy..."
                        className="w-full border-[2px] border-white/15 text-white placeholder:text-white/20 px-4 py-3 text-[14px] font-[500] outline-none focus:border-white/40 transition-colors resize-none"
                        style={{ background: 'rgba(255,255,255,0.06)' }} />
                    </div>
                    <button type="submit"
                      className="w-full py-4 font-[800] text-[14px] uppercase tracking-wider transition-all hover:-translate-y-[2px]"
                      style={{ background: color, color: '#000', boxShadow: `0 4px 24px ${color}40` }}>
                      Apply to Join {chapter.name} →
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </Reveal>
          </div>
        </div>
      </section>

    </main>
  );
}
