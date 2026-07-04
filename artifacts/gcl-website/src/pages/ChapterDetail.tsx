import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { chapters, STATUS_COLOR, STATUS_LABEL } from '../data/chapters';
import { events } from '../data/events';
import { courses } from '../data/courses';

const COURSE_PALETTE: Record<string, { from: string; to: string; text: string }> = {
  t1: { from: '#7c3aed', to: '#4f46e5', text: '#c4b5fd' },
  t2: { from: '#0ea5e9', to: '#2563eb', text: '#7dd3fc' },
  t3: { from: '#059669', to: '#0d9488', text: '#6ee7b7' },
};

function useCounter(target: number, duration = 1400) {
  const [count, setCount] = useState(0);
  const ref = useRef<boolean>(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const steps = 40;
    const step = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += step;
      if (current >= target) { setCount(target); clearInterval(interval); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(interval);
  }, [target, duration]);
  return count;
}

function StatCounter({ value, label, accent }: { value: number; label: string; accent: string }) {
  const count = useCounter(value);
  return (
    <div style={{ textAlign: 'center', padding: '0 8px' }}>
      <div style={{
        fontSize: 'clamp(28px,4vw,48px)', fontWeight: 900, letterSpacing: '-0.04em',
        background: `linear-gradient(135deg, #fff, ${accent})`,
        WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
        lineHeight: 1,
      }}>
        {count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count}
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginTop: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {label}
      </div>
    </div>
  );
}

export function ChapterDetail() {
  const { id } = useParams<{ id: string }>();
  const chapter = chapters.find(c => c.id === id);
  const [form, setForm] = useState({ name: '', email: '', motivation: '' });
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'events' | 'courses'>('events');

  if (!chapter) {
    return (
      <div style={{ minHeight: '100vh', background: '#020010', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🌍</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 12px' }}>Chapter not found</h1>
          <Link href="/chapters" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>← Back to all chapters</Link>
        </div>
      </div>
    );
  }

  const color = STATUS_COLOR[chapter.status];
  const chapterEvents = events.filter(e => e.chapterId === chapter.id);
  const chapterCourses = courses.filter(c => c.chapterId === chapter.id);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); };

  const teamMembers = [
    { name: chapter.founder, role: 'Chapter Founder', isOpen: false },
    { name: chapter.lead !== chapter.founder ? chapter.lead : 'Open Position', role: 'Chapter Lead', isOpen: chapter.lead === chapter.founder },
    { name: 'Open Position', role: 'Events Coordinator', isOpen: true },
    { name: 'Open Position', role: 'Community Manager', isOpen: true },
  ];

  return (
    <div style={{ background: '#060412', color: '#fff', minHeight: '100vh' }}>

      {/* ══════════════════════════════════════════
          HERO — CINEMATIC SPLIT
      ══════════════════════════════════════════ */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Deep background layer */}
        <div style={{ position: 'absolute', inset: 0 }}>
          {/* Radial color flood from status color */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `radial-gradient(ellipse 80% 60% at 15% 50%, ${color}1a 0%, transparent 70%)`,
          }} />
          {/* Accent orb top-right */}
          <div style={{
            position: 'absolute', width: 600, height: 600,
            top: -180, right: -100, borderRadius: '50%',
            background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
            filter: 'blur(40px)',
          }} />
          {/* Blue orb bottom */}
          <div style={{
            position: 'absolute', width: 500, height: 500,
            bottom: -150, left: '30%', borderRadius: '50%',
            background: 'radial-gradient(circle, #3b82f610 0%, transparent 70%)',
            filter: 'blur(60px)',
          }} />
          {/* Subtle grid */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.028,
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }} />
          {/* Diagonal accent line */}
          <div style={{
            position: 'absolute', top: 0, right: '35%', width: 1, height: '100%',
            background: `linear-gradient(to bottom, ${color}00, ${color}30, ${color}00)`,
          }} />
        </div>

        {/* ── Back nav ── */}
        <div style={{ position: 'relative', zIndex: 10, padding: '28px 48px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/chapters" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none',
            fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.45)',
            padding: '9px 18px', borderRadius: 99,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(12px)',
            transition: 'color 0.2s, border-color 0.2s',
          }}>
            ← All Chapters
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 99,
              background: `${color}18`, border: `1px solid ${color}40`,
              fontSize: 11, fontWeight: 800, color, letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block', boxShadow: `0 0 8px ${color}` }} />
              {STATUS_LABEL[chapter.status]}
            </span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 600, padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 99, border: '1px solid rgba(255,255,255,0.08)' }}>
              Est. {chapter.founded}
            </span>
          </div>
        </div>

        {/* ── Hero body ── */}
        <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', alignItems: 'center', padding: '0 48px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 64, alignItems: 'center', width: '100%', maxWidth: 1200 }}>

            {/* LEFT — text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* University pill */}
              {chapter.university && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28, padding: '7px 16px', borderRadius: 99, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                  🎓 {chapter.university}
                </div>
              )}

              {/* Title */}
              <h1 style={{ margin: '0 0 16px', lineHeight: 0.92, letterSpacing: '-0.04em', fontWeight: 900 }}>
                <span style={{ display: 'block', fontSize: 'clamp(52px, 7vw, 96px)', color: 'rgba(255,255,255,0.15)', fontWeight: 900 }}>
                  {chapter.flagEmoji}
                </span>
                <span style={{
                  display: 'block', fontSize: 'clamp(44px, 7vw, 88px)',
                  background: `linear-gradient(135deg, #fff 40%, ${color} 100%)`,
                  WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
                }}>
                  {chapter.name}
                </span>
              </h1>

              {/* Location */}
              <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.45)', margin: '0 0 20px', fontWeight: 500, letterSpacing: '-0.01em' }}>
                {chapter.city}, {chapter.country}
              </p>

              {/* Focus */}
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.7)', margin: '0 0 32px', maxWidth: 540, lineHeight: 1.65, fontWeight: 400 }}>
                {chapter.focus}
              </p>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 40 }}>
                {chapter.tags.map(tag => (
                  <span key={tag} style={{
                    fontSize: 11, fontWeight: 700, padding: '6px 14px',
                    background: `${color}15`, border: `1px solid ${color}35`,
                    borderRadius: 99, color: color, letterSpacing: '0.04em',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a href="#join" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '15px 32px', borderRadius: 14, textDecoration: 'none',
                  background: color, color: '#000', fontWeight: 800, fontSize: 14,
                  letterSpacing: '-0.01em',
                  boxShadow: `0 0 0 1px ${color}, 0 8px 32px ${color}50`,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}>
                  Join {chapter.name} →
                </a>
                <a href={`mailto:${chapter.contact}`} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '15px 28px', borderRadius: 14, textDecoration: 'none',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)',
                  color: 'rgba(255,255,255,0.8)', fontWeight: 700, fontSize: 14,
                  backdropFilter: 'blur(8px)',
                }}>
                  ✉ Contact
                </a>
              </div>
            </motion.div>

            {/* RIGHT — decorative stat orb */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-end' }}
            >
              {/* Big flag orb */}
              <div style={{
                width: 220, height: 220, borderRadius: '50%', flexShrink: 0,
                background: `radial-gradient(circle at 35% 35%, ${color}30, ${color}08 60%, transparent)`,
                border: `1px solid ${color}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 100,
                boxShadow: `0 0 80px ${color}20, inset 0 0 40px ${color}10`,
                position: 'relative',
              }}>
                {chapter.flagEmoji}
                {/* Orbit ring */}
                <div style={{
                  position: 'absolute', inset: -16,
                  borderRadius: '50%', border: `1px solid ${color}20`,
                }} />
                <div style={{
                  position: 'absolute', inset: -32,
                  borderRadius: '50%', border: `1px dashed ${color}10`,
                }} />
              </div>

              {/* Quick info card */}
              <div style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 16, padding: '16px 20px',
                backdropFilter: 'blur(16px)', width: 220,
              }}>
                {[
                  { label: 'Founder', value: chapter.founder.split(' ')[0] },
                  { label: 'Contact', value: chapter.contact.split('@')[0] + '@…' },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>{r.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{r.value}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 7 }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>Founded</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{chapter.founded}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Stats ticker bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{
            position: 'relative', zIndex: 2,
            margin: '0 48px 48px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 20, padding: '28px 48px',
            backdropFilter: 'blur(24px)',
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 0,
          }}
        >
          {[
            { value: chapter.members, label: 'Active Members' },
            { value: chapter.eventsHosted, label: 'Events Hosted' },
            { value: chapter.studentsEducated, label: 'Students Reached' },
            { value: chapterEvents.length + chapterCourses.length, label: 'Programs Running' },
          ].map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <div style={{ position: 'absolute' }} />}
              <div style={{
                borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              }}>
                <StatCounter value={s.value} label={s.label} accent={color} />
              </div>
            </React.Fragment>
          ))}
        </motion.div>

        {/* Bottom gradient fade */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(to top, #060412, transparent)', pointerEvents: 'none' }} />
      </section>


      {/* ══════════════════════════════════════════
          ABOUT — EDITORIAL 2-COL
      ══════════════════════════════════════════ */}
      <ContentSection>
        <SectionHeader eyebrow="The Story" title="About this Chapter" color={color} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.68)', lineHeight: 1.85, margin: 0, fontWeight: 400 }}>
            {chapter.about}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
            {[
              { icon: '📍', label: 'Location', value: `${chapter.city}, ${chapter.country}` },
              { icon: '🎓', label: 'University', value: chapter.university || 'Independent' },
              { icon: '👤', label: 'Chapter Lead', value: chapter.lead },
              { icon: '✉', label: 'Contact', value: chapter.contact },
              { icon: '📅', label: 'Founded', value: String(chapter.founded) },
            ].map((r, i, arr) => (
              <div key={r.label} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px',
                borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}>
                <span style={{ fontSize: 16, width: 28, textAlign: 'center', flexShrink: 0 }}>{r.icon}</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 600, width: 90, flexShrink: 0 }}>{r.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </ContentSection>


      {/* ══════════════════════════════════════════
          EVENTS & COURSES — TABBED
      ══════════════════════════════════════════ */}
      <ContentSection accent={color}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <SectionHeader eyebrow="Chapter Programs" title="Events & Courses" color={color} noMargin />
          {/* Tab switcher */}
          <div style={{ display: 'flex', gap: 0, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 4 }}>
            {([
              { key: 'events', label: `Events (${chapterEvents.length})` },
              { key: 'courses', label: `Courses (${chapterCourses.length})` },
            ] as { key: 'events' | 'courses'; label: string }[]).map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                style={{
                  padding: '8px 20px', borderRadius: 9, border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: 700, transition: 'all 0.2s',
                  background: activeTab === t.key ? color : 'transparent',
                  color: activeTab === t.key ? '#000' : 'rgba(255,255,255,0.5)',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'events' ? (
            <motion.div key="events" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              {chapterEvents.length === 0 ? (
                <EmptyCard label="No events from this chapter yet." icon="📭" />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {chapterEvents.map((ev, i) => (
                    <Link key={ev.id} href={`/events/${ev.id}`} style={{ textDecoration: 'none' }}>
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        whileHover={{ x: 6 }}
                        style={{
                          display: 'grid', gridTemplateColumns: '80px 1fr auto',
                          gap: 24, alignItems: 'center',
                          padding: '20px 24px',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.07)',
                          borderRadius: 16, cursor: 'pointer',
                          transition: 'border-color 0.2s, background 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = color + '40'; e.currentTarget.style.background = `${color}08`; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                      >
                        {/* Date block */}
                        <div style={{
                          textAlign: 'center', padding: '12px 8px', borderRadius: 12,
                          background: `${color}18`, border: `1px solid ${color}35`,
                          flexShrink: 0,
                        }}>
                          <div style={{ fontSize: 28, fontWeight: 900, color, lineHeight: 1, letterSpacing: '-0.04em' }}>{ev.date.day}</div>
                          <div style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em', marginTop: 4 }}>{ev.date.month}</div>
                          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{ev.date.year}</div>
                        </div>
                        {/* Info */}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5, flexWrap: 'wrap' }}>
                            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>{ev.title}</h3>
                            {ev.featured && <span style={{ fontSize: 9, fontWeight: 800, color: '#fbbf24', background: '#fbbf2418', border: '1px solid #fbbf2430', borderRadius: 6, padding: '3px 8px', letterSpacing: '0.08em' }}>★ FEATURED</span>}
                          </div>
                          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '0 0 10px', lineHeight: 1.5 }}>{ev.description.slice(0, 100)}…</p>
                          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{ev.format === 'Online' ? '💻' : ev.format === 'In-Person' ? '📍' : '🔀'} {ev.format}</span>
                            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>⏰ {ev.time}</span>
                            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>🎫 {ev.type}</span>
                          </div>
                        </div>
                        {/* Right side */}
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ marginBottom: 12 }}>
                            <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}>{ev.registered.toLocaleString()}</div>
                            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>registered</div>
                          </div>
                          <div style={{ width: 80, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${Math.min(100, ev.registered / ev.capacity * 100)}%`, background: color, borderRadius: 99 }} />
                          </div>
                          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>{ev.capacity.toLocaleString()} cap.</div>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              )}
              <div style={{ marginTop: 20 }}>
                <Link href="/events" style={{ fontSize: 13, color: color, fontWeight: 700, textDecoration: 'none' }}>Browse all GCL events →</Link>
              </div>
            </motion.div>
          ) : (
            <motion.div key="courses" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              {chapterCourses.length === 0 ? (
                <EmptyCard label="No courses produced by this chapter yet." icon="📚" />
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
                  {chapterCourses.map((course, i) => {
                    const pal = COURSE_PALETTE[course.color];
                    return (
                      <Link key={course.slug} href={`/courses/${course.slug}`} style={{ textDecoration: 'none' }}>
                        <motion.div
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08 }}
                          whileHover={{ y: -6 }}
                          style={{
                            borderRadius: 18, overflow: 'hidden', cursor: 'pointer',
                            background: `linear-gradient(135deg, ${pal.from}18, ${pal.to}10)`,
                            border: `1px solid ${pal.from}30`,
                            transition: 'box-shadow 0.3s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 16px 48px ${pal.from}25`; }}
                          onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
                        >
                          {/* Course color strip */}
                          <div style={{ height: 4, background: `linear-gradient(90deg, ${pal.from}, ${pal.to})` }} />
                          <div style={{ padding: '22px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                              <div style={{
                                fontSize: 10, fontWeight: 800, padding: '5px 12px',
                                background: `${pal.from}25`, border: `1px solid ${pal.from}40`,
                                borderRadius: 99, color: pal.text, letterSpacing: '0.08em',
                              }}>
                                {course.tag}
                              </div>
                              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>{course.duration}</span>
                            </div>
                            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 8px', lineHeight: 1.2, letterSpacing: '-0.02em' }}>{course.title}</h3>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 16, fontWeight: 600 }}>
                              {course.level} · {course.modules.length} modules
                            </div>
                            {/* Module preview */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
                              {course.modules.slice(0, 3).map((mod, mi) => (
                                <div key={mi} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                                  <span style={{ width: 16, height: 16, borderRadius: '50%', background: `${pal.from}25`, border: `1px solid ${pal.from}40`, fontSize: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: pal.text, fontWeight: 800, flexShrink: 0 }}>{mi + 1}</span>
                                  {mod.title.replace(/^Module \d+: /, '')}
                                </div>
                              ))}
                              {course.modules.length > 3 && (
                                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', paddingLeft: 24 }}>+{course.modules.length - 3} more modules</div>
                              )}
                            </div>
                            {/* Instructors */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 14, borderTop: `1px solid ${pal.from}20` }}>
                              <div style={{ display: 'flex', marginRight: 4 }}>
                                {course.instructors.slice(0, 2).map((ins, ii) => (
                                  <div key={ins.name} style={{
                                    width: 26, height: 26, borderRadius: '50%', marginLeft: ii > 0 ? -8 : 0,
                                    background: `linear-gradient(135deg, ${pal.from}, ${pal.to})`,
                                    border: '2px solid rgba(6,4,18,0.8)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 9, fontWeight: 800, color: '#fff',
                                  }}>
                                    {ins.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                                  </div>
                                ))}
                              </div>
                              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>
                                {course.instructors.map(i => i.name.split(' ')[0]).join(' & ')}
                              </span>
                              <span style={{ marginLeft: 'auto', fontSize: 12, color: pal.text, fontWeight: 700 }}>Start →</span>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              )}
              <div style={{ marginTop: 20 }}>
                <Link href="/courses" style={{ fontSize: 13, color: color, fontWeight: 700, textDecoration: 'none' }}>Browse all GCL courses →</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </ContentSection>


      {/* ══════════════════════════════════════════
          TEAM
      ══════════════════════════════════════════ */}
      <ContentSection>
        <SectionHeader eyebrow="The People" title="Chapter Team" color={color} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {teamMembers.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              style={{
                borderRadius: 20, padding: '28px 20px', textAlign: 'center',
                background: m.isOpen
                  ? 'rgba(255,255,255,0.02)'
                  : `linear-gradient(135deg, ${color}12, ${color}05)`,
                border: `1px solid ${m.isOpen ? 'rgba(255,255,255,0.06)' : color + '25'}`,
                position: 'relative', overflow: 'hidden',
              }}
            >
              {!m.isOpen && (
                <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: `${color}15`, filter: 'blur(20px)' }} />
              )}
              {/* Avatar */}
              <div style={{
                width: 64, height: 64, borderRadius: '50%', margin: '0 auto 16px',
                background: m.isOpen
                  ? 'rgba(255,255,255,0.04)'
                  : `linear-gradient(135deg, ${color}40, ${color}15)`,
                border: `2px solid ${m.isOpen ? 'rgba(255,255,255,0.08)' : color + '50'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: m.isOpen ? 22 : 20, color: m.isOpen ? 'rgba(255,255,255,0.2)' : color,
                fontWeight: 900, letterSpacing: '-0.02em',
                boxShadow: m.isOpen ? 'none' : `0 0 20px ${color}25`,
              }}>
                {m.isOpen ? '+' : m.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
              </div>
              <div style={{
                fontSize: 14, fontWeight: 800,
                color: m.isOpen ? 'rgba(255,255,255,0.25)' : '#fff',
                marginBottom: 5,
              }}>
                {m.isOpen ? 'Open Position' : m.name}
              </div>
              <div style={{ fontSize: 11, color: m.isOpen ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.45)', fontWeight: 600, letterSpacing: '0.04em' }}>
                {m.role}
              </div>
              {m.isOpen && (
                <div style={{ marginTop: 14 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 99, padding: '4px 10px' }}>
                    Apply →
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </ContentSection>


      {/* ══════════════════════════════════════════
          JOIN — FULL-WIDTH CTA SECTION
      ══════════════════════════════════════════ */}
      <section id="join" style={{ margin: '0 32px 80px', borderRadius: 24, overflow: 'hidden', position: 'relative' }}>
        {/* Colored background */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(135deg, ${color}18 0%, rgba(255,255,255,0.02) 100%)`,
          border: `1px solid ${color}25`,
          borderRadius: 24,
        }} />
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: `radial-gradient(circle, ${color}20, transparent)`, filter: 'blur(40px)' }} />

        <div style={{ position: 'relative', padding: '56px 56px', maxWidth: 1200 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
            {/* Left */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color, marginBottom: 12 }}>Join the Chapter</div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, margin: '0 0 16px', letterSpacing: '-0.03em', lineHeight: 1.08 }}>
                Become part of<br />{chapter.name}
              </h2>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, margin: '0 0 28px' }}>
                Register your interest — <strong style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>{chapter.lead}</strong> will reach out within 3 business days to discuss next steps.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Access to all chapter events & workshops', 'Connect with a global GCL network', 'Mentorship from experienced educators'].map(b => (
                  <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
                    <span style={{ width: 20, height: 20, borderRadius: '50%', background: `${color}25`, border: `1px solid ${color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color, flexShrink: 0 }}>✓</span>
                    {b}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — form */}
            <div>
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: 'center', padding: '48px 32px', background: `${color}12`, border: `1px solid ${color}30`, borderRadius: 18 }}
                >
                  <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 10, letterSpacing: '-0.02em' }}>You're in!</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                    {chapter.lead} from {chapter.name} will reach out soon.
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <DarkField label="Full Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="Jane Smith" required />
                    <DarkField label="Email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} placeholder="you@university.edu" type="email" required />
                  </div>
                  <DarkField label="Why do you want to join?" value={form.motivation} onChange={v => setForm(f => ({ ...f, motivation: v }))} placeholder="Tell us about your interest in finance and what you'd bring to the chapter…" textarea />
                  <button type="submit" style={{
                    padding: '14px', borderRadius: 12, border: 'none',
                    background: color, color: '#000', fontWeight: 800, fontSize: 15,
                    cursor: 'pointer', letterSpacing: '-0.01em',
                    boxShadow: `0 4px 24px ${color}40`, transition: 'opacity 0.2s',
                  }}>
                    Apply to Join {chapter.name} →
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────── */

function ContentSection({ children, accent }: { children: React.ReactNode; accent?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 48px', borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeader({ eyebrow, title, color, noMargin }: { eyebrow: string; title: string; color: string; noMargin?: boolean }) {
  return (
    <div style={{ marginBottom: noMargin ? 0 : 32 }}>
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color, marginBottom: 8 }}>{eyebrow}</div>
      <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 900, margin: 0, letterSpacing: '-0.03em', color: '#fff' }}>{title}</h2>
    </div>
  );
}

function EmptyCard({ label, icon }: { label: string; icon: string }) {
  return (
    <div style={{ padding: '48px 24px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: 16 }}>
      <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.35 }}>{icon}</div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>{label}</div>
    </div>
  );
}

function DarkField({ label, value, onChange, placeholder, type, required, textarea }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string; required?: boolean; textarea?: boolean;
}) {
  const shared: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 14,
    outline: 'none', fontFamily: 'inherit', resize: 'vertical' as const,
    transition: 'border-color 0.2s',
  };
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 7 }}>{label}</label>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={4} style={shared} />
        : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} type={type || 'text'} required={required} style={shared} />}
    </div>
  );
}
