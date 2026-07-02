import React, { useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { events } from '../data/events';

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65, delay }} className={className}>
      {children}
    </motion.div>
  );
}

const FILTERS = ['All', 'Online', 'In-Person', 'Free'] as const;

const formatColors: Record<string, string> = {
  Online: '#33c7e8',
  'In-Person': 'var(--violet)',
  Hybrid: 'var(--magenta)',
};

export function Events() {
  const [filter, setFilter] = useState<string>('All');

  const filtered = events.filter(e => {
    if (filter === 'All') return true;
    if (filter === 'Free') return e.type === 'Free';
    return e.format === filter;
  });

  return (
    <main className="pb-32">
      {/* Hero banner */}
      <section className="relative pt-[90px] pb-[80px] overflow-hidden" style={{ background: 'var(--brutal-bg)' }}>
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'radial-gradient(ellipse 90% 70% at 60% 10%, var(--magenta), transparent)' }} />

        {/* Decorative grid lines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(90deg,white 0px,white 1px,transparent 1px,transparent 80px), repeating-linear-gradient(0deg,white 0px,white 1px,transparent 1px,transparent 80px)' }} />

        <div className="max-w-[1240px] mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="flex items-center gap-3 mb-8">
                <div className="h-[2px] w-12" style={{ background: 'var(--grad-brand)' }} />
                <span className="text-[13px] font-[800] tracking-[0.1em] uppercase text-[var(--neon-cyan)]">Live & Online</span>
              </div>
              <h1 className="font-[800] text-[clamp(48px,7vw,88px)] leading-[0.95] tracking-[-0.03em] text-white uppercase mb-8">
                Events,<br />
                <span style={{ background: 'var(--grad-brand)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Workshops</span><br />
                & Summits.
              </h1>
              <p className="text-[17px] text-[var(--brutal-text-dim)] leading-[1.7] max-w-[460px]">
                Join a session in your city — or online, wherever "near you" doesn't exist yet. All events are free and open to everyone.
              </p>
            </motion.div>

            {/* Featured next event */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
              <div className="rounded-[20px] p-8 relative overflow-hidden" style={{ border: '2.5px solid rgba(246,244,255,0.7)', boxShadow: '8px 8px 0px rgba(94,234,255,0.4)', background: 'var(--brutal-bg-2)' }}>
                <div className="text-[11px] font-[800] tracking-[0.1em] uppercase text-[var(--neon-cyan)] mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#28c840] shadow-[0_0_0_4px_rgba(40,200,64,0.2)]" />
                  Next Event
                </div>
                <div className="font-[800] text-[42px] tracking-[-0.03em] text-white leading-none mb-1">14</div>
                <div className="font-[700] text-[14px] tracking-[0.08em] uppercase text-[var(--brutal-text-dim)] mb-5">August 2026</div>
                <div className="font-[800] text-[22px] text-white mb-2">Youth Money Summit</div>
                <div className="text-[14px] text-[var(--brutal-text-dim)] mb-6">Nairobi, Kenya · Community Hall</div>
                <div className="flex gap-2">
                  <span className="text-[11px] font-[800] uppercase px-3 py-1.5 rounded-full" style={{ background: 'rgba(94,234,255,0.12)', color: 'var(--neon-cyan)', border: '1px solid rgba(94,234,255,0.25)' }}>In-Person</span>
                  <span className="text-[11px] font-[800] uppercase px-3 py-1.5 rounded-full" style={{ background: 'rgba(40,200,64,0.12)', color: '#28c840', border: '1px solid rgba(40,200,64,0.25)' }}>Free</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Event type cards */}
      <section className="py-16 bg-[var(--paper-alt)]">
        <div className="max-w-[1240px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Live Summits', desc: 'Major multi-day gatherings connecting youth leaders with behavioral economists and policymakers.', icon: '🎤', color: 'linear-gradient(135deg,var(--magenta),var(--violet))' },
              { title: 'Digital Workshops', desc: 'Focused 90-minute to 3-hour online sessions tackling a single financial topic with live Q&A.', icon: '💻', color: 'linear-gradient(135deg,var(--blue),var(--violet))' },
              { title: 'Community Meetups', desc: 'Informal, local in-person gatherings for peer connection, system-building, and shared resources.', icon: '🤝', color: 'linear-gradient(135deg,var(--violet),var(--magenta))' },
            ].map((t, i) => (
              <Reveal key={t.title} delay={i * 0.08}>
                <div className="rounded-[18px] p-7 text-white relative overflow-hidden" style={{ background: t.color, border: '2.5px solid var(--ink)', boxShadow: '6px 6px 0px var(--ink)' }}>
                  <div className="text-3xl mb-4">{t.icon}</div>
                  <div className="font-[800] text-[20px] mb-3">{t.title}</div>
                  <p className="text-[14px] text-white/80 leading-[1.6]">{t.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Filter + Event list */}
      <section className="py-16">
        <div className="max-w-[1240px] mx-auto px-8">
          <Reveal className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <h2 className="font-[800] text-[clamp(24px,3vw,36px)] tracking-[-0.02em]">Upcoming Events</h2>
            <div className="flex gap-2 flex-wrap">
              {FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  data-testid={`filter-${f.toLowerCase()}`}
                  className="px-5 py-2.5 rounded-full text-[13.5px] font-[700] transition-all"
                  style={filter === f
                    ? { background: 'var(--ink)', color: '#fff', boxShadow: '3px 3px 0px rgba(21,19,44,0.3)' }
                    : { background: 'var(--paper-alt)', color: 'var(--ink-soft)', border: '1.5px solid var(--line)' }}
                >
                  {f}
                </button>
              ))}
            </div>
          </Reveal>

          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {filtered.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-5 p-6 rounded-[16px] bg-white transition-all cursor-pointer hover:-translate-x-[3px] hover:-translate-y-[3px]"
                  style={{ border: '2.5px solid var(--ink)', boxShadow: '6px 6px 0px var(--ink)' }}
                  data-testid={`event-${event.id}`}
                >
                  {/* Date block */}
                  <div className="shrink-0 w-[64px] h-[64px] rounded-[14px] flex flex-col items-center justify-center border border-[var(--line)]" style={{ background: 'var(--pill-bg)' }}>
                    <div className="text-[22px] font-[800] text-[var(--pill-ink)] leading-none">{event.date.day}</div>
                    <div className="text-[10px] font-[700] tracking-[0.08em] uppercase text-[var(--pill-ink)] opacity-70 mt-1">{event.date.month}</div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-[10px] font-[800] uppercase tracking-wider px-2.5 py-1 rounded-md" style={{ background: `${formatColors[event.format] ?? 'var(--paper-alt)'}18`, color: formatColors[event.format] ?? 'var(--ink-soft)', border: `1px solid ${formatColors[event.format] ?? 'var(--line)'}40` }}>{event.format}</span>
                      <span className="text-[10px] font-[800] uppercase tracking-wider px-2.5 py-1 rounded-md" style={{ background: event.type === 'Free' ? 'rgba(40,200,64,0.1)' : 'var(--paper-alt)', color: event.type === 'Free' ? '#28c840' : 'var(--ink-soft)', border: event.type === 'Free' ? '1px solid rgba(40,200,64,0.3)' : '1px solid var(--line)' }}>{event.type}</span>
                    </div>
                    <h4 className="font-[800] text-[17px] leading-[1.25] mb-1">{event.title}</h4>
                    <div className="text-[13px] text-[var(--ink-soft)] font-[500]">{event.speaker}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-24 text-[var(--ink-soft)] font-[600] text-[18px]">No events match this filter.</div>
          )}

          {/* Subscribe CTA */}
          <Reveal className="mt-16">
            <div className="rounded-[24px] p-10 flex flex-col md:flex-row items-center justify-between gap-8" style={{ background: 'var(--brutal-bg)', border: '2.5px solid rgba(246,244,255,0.2)', boxShadow: '8px 8px 0px rgba(94,234,255,0.2)' }}>
              <div>
                <div className="font-[800] text-[24px] text-white mb-2">Never miss an event.</div>
                <div className="text-[15px] text-[var(--brutal-text-dim)]">Get notified when new events are added to the calendar.</div>
              </div>
              <button className="shrink-0 text-[14.5px] font-[700] px-8 py-4 rounded-full text-white whitespace-nowrap" style={{ background: 'var(--grad-brand)', boxShadow: '0 6px 18px rgba(139,92,246,0.3)' }} data-testid="events-subscribe">
                Subscribe for Updates →
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
