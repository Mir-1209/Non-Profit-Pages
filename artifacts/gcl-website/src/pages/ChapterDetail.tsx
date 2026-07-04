import React, { useState } from 'react';
import { Link, useParams } from 'wouter';
import { motion } from 'framer-motion';
import { chapters, STATUS_COLOR, STATUS_LABEL } from '../data/chapters';
import { events } from '../data/events';
import { courses } from '../data/courses';

const COURSE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  t1: { bg: 'rgba(139,92,246,0.12)', text: '#a78bfa', border: 'rgba(139,92,246,0.25)' },
  t2: { bg: 'rgba(59,130,246,0.12)', text: '#60a5fa', border: 'rgba(59,130,246,0.25)' },
  t3: { bg: 'rgba(16,185,129,0.12)', text: '#34d399', border: 'rgba(16,185,129,0.25)' },
};

const FORMAT_ICON: Record<string, string> = {
  Online: '💻',
  'In-Person': '📍',
  Hybrid: '🔀',
};

export function ChapterDetail() {
  const { id } = useParams<{ id: string }>();
  const chapter = chapters.find(c => c.id === id);

  const [form, setForm] = useState({ name: '', email: '', motivation: '' });
  const [submitted, setSubmitted] = useState(false);

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#020010', color: '#fff' }}>
        <div className="text-center">
          <div className="text-5xl mb-4">🌍</div>
          <h1 className="text-2xl font-black mb-2">Chapter not found</h1>
          <Link href="/chapters" className="text-blue-400 hover:underline text-sm">← Back to all chapters</Link>
        </div>
      </div>
    );
  }

  const color = STATUS_COLOR[chapter.status];
  const chapterEvents = events.filter(e => e.chapterId === chapter.id);
  const chapterCourses = courses.filter(c => c.chapterId === chapter.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ background: '#020010', color: '#fff', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden' }}>

        {/* Background gradient orbs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', top: -200, left: -200, background: `radial-gradient(circle, ${color}28, transparent 70%)`, filter: 'blur(80px)' }} />
          <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', bottom: -100, right: -100, background: 'radial-gradient(circle, #3b82f628, transparent 70%)', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', top: '30%', right: '10%', background: 'radial-gradient(circle, #7c3aed18, transparent 70%)', filter: 'blur(70px)' }} />
        </div>

        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.035,
          backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        {/* Back nav */}
        <div style={{ position: 'absolute', top: 28, left: 32, zIndex: 10 }}>
          <Link href="/chapters" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 12, fontWeight: 700, letterSpacing: '0.08em',
            color: 'rgba(255,255,255,0.55)',
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 20, padding: '8px 16px',
            textDecoration: 'none', transition: 'color 0.2s',
          }}>
            ← All Chapters
          </Link>
        </div>

        {/* Hero content */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'relative', zIndex: 2, padding: '0 48px 64px', maxWidth: 1100 }}
        >
          {/* Status + founded badge row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: `${color}20`, border: `1px solid ${color}55`,
              borderRadius: 20, padding: '6px 14px',
              fontSize: 11, fontWeight: 800, color, letterSpacing: '0.08em',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />
              {STATUS_LABEL[chapter.status]}
            </span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>Est. {chapter.founded}</span>
            {chapter.university && (
              <span style={{
                fontSize: 11, color: 'rgba(255,255,255,0.45)',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 20, padding: '5px 12px', fontWeight: 600,
              }}>
                🎓 {chapter.university}
              </span>
            )}
          </div>

          {/* Chapter name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 12 }}>
            <span style={{ fontSize: 'clamp(40px,6vw,72px)' }}>{chapter.flagEmoji}</span>
            <h1 style={{
              fontSize: 'clamp(36px, 6vw, 72px)',
              fontWeight: 900, margin: 0,
              letterSpacing: '-0.03em', lineHeight: 1.0,
              background: `linear-gradient(120deg, #fff 60%, ${color})`,
              WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
            }}>
              {chapter.name}
            </h1>
          </div>

          {/* Location */}
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', margin: '0 0 24px', fontWeight: 500 }}>
            📍 {chapter.city}, {chapter.country}
          </p>

          {/* Focus line */}
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', margin: '0 0 28px', maxWidth: 600, lineHeight: 1.6 }}>
            {chapter.focus}
          </p>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 40 }}>
            {chapter.tags.map(tag => (
              <span key={tag} style={{
                fontSize: 11, fontWeight: 700, padding: '5px 12px',
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 20, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.04em',
              }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Stats bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, borderRadius: 16, overflow: 'hidden', maxWidth: 560, marginBottom: 36 }}>
            {[
              { value: chapter.members, label: 'Members', icon: '👥' },
              { value: chapter.eventsHosted, label: 'Events Hosted', icon: '📅' },
              { value: chapter.studentsEducated.toLocaleString(), label: 'Students', icon: '🎓' },
              { value: chapterEvents.length || '—', label: 'Upcoming', icon: '🔥' },
            ].map(s => (
              <div key={s.label} style={{
                flex: 1, minWidth: 110,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                padding: '18px 16px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 13, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>{s.value}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="#join" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px', borderRadius: 12, border: 'none',
              background: color, color: '#000', fontWeight: 800, fontSize: 14,
              cursor: 'pointer', textDecoration: 'none',
              boxShadow: `0 4px 24px ${color}44`,
              transition: 'opacity 0.2s, transform 0.2s',
            }}>
              Join {chapter.name} →
            </a>
            <a href={`mailto:${chapter.contact}`} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px', borderRadius: 12,
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.8)', fontWeight: 700, fontSize: 14,
              cursor: 'pointer', textDecoration: 'none',
            }}>
              ✉ Contact Chapter
            </a>
          </div>
        </motion.div>

        {/* Bottom fade */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, pointerEvents: 'none',
          background: 'linear-gradient(to top, #020010, transparent)',
        }} />
      </section>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px 96px' }}>

        {/* ── ABOUT ── */}
        <Section color={color} title="About this Chapter" icon="🌍">
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.72)', lineHeight: 1.8, margin: 0, maxWidth: 720 }}>
            {chapter.about}
          </p>
          <div style={{ display: 'flex', gap: 24, marginTop: 28, flexWrap: 'wrap' }}>
            {[
              { label: 'Founded', value: String(chapter.founded) },
              { label: 'Location', value: `${chapter.city}, ${chapter.country}` },
              { label: 'Contact', value: chapter.contact },
              { label: 'Lead', value: chapter.lead },
            ].map(r => (
              <div key={r.label} style={{ minWidth: 160 }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>{r.label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{r.value}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── EVENTS ── */}
        <Section color={color} title={`Chapter Events (${chapterEvents.length})`} icon="📅">
          {chapterEvents.length === 0 ? (
            <EmptyState label="No upcoming events for this chapter yet." color={color} />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
              {chapterEvents.map(ev => (
                <Link key={ev.id} href={`/events/${ev.id}`} style={{ textDecoration: 'none' }}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 16, padding: '20px',
                      cursor: 'pointer', height: '100%',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = color + '44'; e.currentTarget.style.boxShadow = `0 8px 32px ${color}18`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    {/* Date badge */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 48, height: 48, borderRadius: 10, flexShrink: 0,
                          background: `${color}18`, border: `1px solid ${color}33`,
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <div style={{ fontSize: 16, fontWeight: 900, color, lineHeight: 1 }}>{ev.date.day}</div>
                          <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em' }}>{ev.date.month}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>{ev.time} · {ev.timezone}</div>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{FORMAT_ICON[ev.format]} {ev.format} · {ev.type}</div>
                        </div>
                      </div>
                      {ev.featured && (
                        <span style={{ fontSize: 9, fontWeight: 800, color: '#fbbf24', background: '#fbbf2415', border: '1px solid #fbbf2430', borderRadius: 6, padding: '3px 8px', letterSpacing: '0.08em' }}>FEATURED</span>
                      )}
                    </div>

                    <h3 style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: '0 0 6px', lineHeight: 1.3 }}>{ev.title}</h3>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: '0 0 14px', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {ev.description}
                    </p>

                    {/* Registration bar */}
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 5, fontWeight: 600 }}>
                        <span>{ev.registered.toLocaleString()} registered</span>
                        <span>{ev.capacity.toLocaleString()} capacity</span>
                      </div>
                      <div style={{ height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${Math.min(100, (ev.registered / ev.capacity) * 100)}%`, background: color, borderRadius: 99 }} />
                      </div>
                    </div>

                    <div style={{ fontSize: 11, color, fontWeight: 700 }}>View event →</div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
          <div style={{ marginTop: 20 }}>
            <Link href="/events" style={{
              fontSize: 13, color: color, fontWeight: 700, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              Browse all GCL events →
            </Link>
          </div>
        </Section>

        {/* ── COURSES ── */}
        <Section color={color} title={`Chapter Courses (${chapterCourses.length})`} icon="📚">
          {chapterCourses.length === 0 ? (
            <EmptyState label="No courses produced by this chapter yet." color={color} />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {chapterCourses.map(course => {
                const cc = COURSE_COLORS[course.color];
                return (
                  <Link key={course.slug} href={`/courses/${course.slug}`} style={{ textDecoration: 'none' }}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      style={{
                        background: cc.bg, border: `1px solid ${cc.border}`,
                        borderRadius: 16, padding: '22px',
                        cursor: 'pointer', height: '100%',
                        transition: 'box-shadow 0.2s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 8px 32px ${cc.text}18`; }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: cc.text, background: `${cc.text}20`, border: `1px solid ${cc.text}33`, borderRadius: 20, padding: '4px 10px', letterSpacing: '0.08em' }}>
                          {course.tag}
                        </span>
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{course.duration}</span>
                      </div>
                      <h3 style={{ fontSize: 17, fontWeight: 800, color: '#fff', margin: '0 0 8px', lineHeight: 1.25 }}>{course.title}</h3>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{course.level}</span>
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>·</span>
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{course.modules.length} modules</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                        {course.instructors.map(ins => (
                          <span key={ins.name} style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                            👤 {ins.name}
                          </span>
                        ))}
                      </div>
                      <div style={{ fontSize: 11, color: cc.text, fontWeight: 700 }}>Start course →</div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          )}
          <div style={{ marginTop: 20 }}>
            <Link href="/courses" style={{
              fontSize: 13, color: color, fontWeight: 700, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              Browse all GCL courses →
            </Link>
          </div>
        </Section>

        {/* ── TEAM ── */}
        <Section color={color} title="Chapter Team" icon="👥">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
            {[
              { name: chapter.founder, role: 'Chapter Founder', isOpen: false },
              { name: chapter.lead, role: 'Chapter Lead', isOpen: false },
              { name: 'Open Position', role: 'Events Coordinator', isOpen: true },
              { name: 'Open Position', role: 'Marketing Lead', isOpen: true },
              { name: 'Open Position', role: 'Finance Officer', isOpen: true },
            ].map((m, i) => (
              <div key={i} style={{
                background: m.isOpen ? 'rgba(255,255,255,0.02)' : `${color}0a`,
                border: `1px solid ${m.isOpen ? 'rgba(255,255,255,0.07)' : color + '25'}`,
                borderRadius: 14, padding: '20px 16px', textAlign: 'center',
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%', margin: '0 auto 12px',
                  background: m.isOpen ? 'rgba(255,255,255,0.05)' : `${color}25`,
                  border: `2px solid ${m.isOpen ? 'rgba(255,255,255,0.1)' : color + '50'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: m.isOpen ? 18 : 18, color: m.isOpen ? 'rgba(255,255,255,0.25)' : color,
                  fontWeight: 800, letterSpacing: '-0.02em',
                }}>
                  {m.isOpen ? '+' : m.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: m.isOpen ? 'rgba(255,255,255,0.3)' : '#fff', marginBottom: 4 }}>
                  {m.isOpen ? 'Open Position' : m.name}
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: '0.06em' }}>
                  {m.role}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── JOIN ── */}
        <Section color={color} title={`Join ${chapter.name}`} icon="🚀" id="join">
          <div style={{ maxWidth: 640 }}>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', margin: '0 0 28px', lineHeight: 1.7 }}>
              Register your interest and the chapter lead <strong style={{ color: 'rgba(255,255,255,0.75)' }}>{chapter.lead}</strong> will be in touch within 3 business days.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  padding: 32, textAlign: 'center',
                  background: `${color}10`, border: `1px solid ${color}30`, borderRadius: 16,
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Application Received!</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
                  {chapter.lead} from {chapter.name} will be in touch soon.
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <FormField label="Full Name">
                    <input
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Your full name"
                      required
                    />
                  </FormField>
                  <FormField label="Email Address">
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="you@email.com"
                      required
                    />
                  </FormField>
                </div>
                <FormField label="Why do you want to join?">
                  <textarea
                    value={form.motivation}
                    onChange={e => setForm(f => ({ ...f, motivation: e.target.value }))}
                    placeholder="Tell us about yourself and your interest in financial literacy…"
                    rows={4}
                  />
                </FormField>
                <button
                  type="submit"
                  style={{
                    padding: '14px 28px', borderRadius: 12, border: 'none',
                    background: color, color: '#000', fontWeight: 800, fontSize: 15,
                    cursor: 'pointer', boxShadow: `0 4px 24px ${color}44`,
                    transition: 'opacity 0.2s',
                    alignSelf: 'flex-start',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  Apply to Join {chapter.name} →
                </button>
              </form>
            )}
          </div>
        </Section>

      </div>
    </div>
  );
}

function Section({ children, color, title, icon, id }: { children: React.ReactNode; color: string; title: string; icon: string; id?: string }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 56, marginTop: 56 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
        <span style={{
          width: 36, height: 36, borderRadius: 10,
          background: `${color}18`, border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, flexShrink: 0,
        }}>
          {icon}
        </span>
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#fff' }}>
          {title}
        </h2>
      </div>
      {children}
    </motion.section>
  );
}

function EmptyState({ label, color }: { label: string; color: string }) {
  return (
    <div style={{
      padding: '40px 24px', textAlign: 'center',
      background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)',
      borderRadius: 14,
    }}>
      <div style={{ fontSize: 28, marginBottom: 10, opacity: 0.4 }}>📭</div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>{label}</div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{
        display: 'block', fontSize: 11, fontWeight: 700,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.38)', marginBottom: 7,
      }}>
        {label}
      </label>
      <div style={{
        ['--field-bg' as string]: 'rgba(255,255,255,0.05)',
      }}>
        <style>{`
          .gcl-field input, .gcl-field textarea {
            width: 100%; box-sizing: border-box;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.12);
            border-radius: 10px; padding: 11px 14px;
            color: #fff; font-size: 14px; outline: none;
            font-family: inherit; resize: vertical;
            transition: border-color 0.2s;
          }
          .gcl-field input:focus, .gcl-field textarea:focus {
            border-color: rgba(255,255,255,0.3);
          }
        `}</style>
        <div className="gcl-field">{children}</div>
      </div>
    </div>
  );
}
