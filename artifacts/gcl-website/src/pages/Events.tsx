import React, { useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { events } from '../data/events';

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay }} className={className}>
      {children}
    </motion.div>
  );
}

const FILTERS = ['All', 'Online', 'In-Person', 'Free'] as const;

const spotsLeft = (ev: (typeof events)[number]) => ev.capacity - ev.registered;
const spotsColor = (n: number) => n <= 10 ? '#e53e3e' : n <= 30 ? '#d69e2e' : '#28c840';

export function Events() {
  const [filter, setFilter] = useState<string>('All');
  const filtered = events.filter(e => {
    if (filter === 'All') return true;
    if (filter === 'Free') return e.type === 'Free';
    return e.format === filter;
  });

  const featuredEvents = events.filter(e => e.featured);

  return (
    <main className="pb-32">
      {/* ─── HERO ─── */}
      <section className="pt-[90px] pb-0 overflow-hidden" style={{ background: 'var(--brutal-bg)' }}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(90deg,white 0px,white 1px,transparent 1px,transparent 80px),repeating-linear-gradient(0deg,white 0px,white 1px,transparent 1px,transparent 80px)' }} />
        <div className="max-w-[1240px] mx-auto px-8 relative z-10 pb-0">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
            <div className="border-b-[2.5px] border-white/10 pb-6">
              <div className="text-[11px] font-[800] uppercase tracking-[0.18em] text-[var(--neon-cyan)] mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#28c840]" />
                Live, Online & In-Person
              </div>
              <h1 className="font-[800] text-[clamp(52px,8vw,100px)] leading-[0.88] tracking-[-0.04em] text-white uppercase">
                Events &<br />Workshops.
              </h1>
              <p className="text-[16px] text-[var(--brutal-text-dim)] mt-5 max-w-[500px]">
                Join a session near you — or online, wherever "near you" doesn't exist yet. All events are free and open to everyone.
              </p>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-3 divide-x divide-white/10 py-4">
              {[
                { n: events.length, label: 'Upcoming Events' },
                { n: events.filter(e => e.type === 'Free').length, label: 'Free Events' },
                { n: events.reduce((a, e) => a + e.registered, 0).toLocaleString(), label: 'Already Registered' },
              ].map(s => (
                <div key={s.label} className="px-6 first:pl-0">
                  <div className="font-[800] text-[clamp(24px,3vw,36px)] text-white tracking-[-0.02em]">{s.n}</div>
                  <div className="text-[12px] font-[600] uppercase tracking-wider text-[var(--brutal-text-dim)]">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FEATURED EVENTS ─── */}
      {featuredEvents.length > 0 && (
        <section className="py-12 border-b-[2.5px] border-[var(--ink)]" style={{ background: 'var(--paper-alt)' }}>
          <div className="max-w-[1240px] mx-auto px-8">
            <div className="text-[11px] font-[800] uppercase tracking-[0.15em] text-[var(--ink-faint)] mb-6">Featured Events</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredEvents.map((ev, i) => (
                <Reveal key={ev.id} delay={i * 0.08}>
                  <Link href={`/events/${ev.id}`} className="block border-[2.5px] border-[var(--ink)] shadow-[8px_8px_0px_var(--ink)] bg-[var(--brutal-bg)] text-white overflow-hidden hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_var(--ink)] transition-all group">
                    <div className="p-7">
                      <div className="flex items-start justify-between mb-5">
                        <div className="flex items-center gap-3">
                          <div className="border-[2px] border-white/20 px-4 py-3 text-center">
                            <div className="font-[800] text-[32px] leading-none text-[var(--neon-cyan)]">{ev.date.day}</div>
                            <div className="text-[11px] font-[700] uppercase tracking-wider text-white/60 mt-0.5">{ev.date.month}</div>
                          </div>
                          <div>
                            <div className="font-[700] text-[13px] text-white/60">{ev.date.year}</div>
                            <div className="font-[600] text-[13px] text-[var(--neon-cyan)]">{ev.time} {ev.timezone}</div>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap justify-end">
                          <span className="text-[10px] font-[800] uppercase tracking-wider px-2.5 py-1 border border-[var(--neon-cyan)]/30 text-[var(--neon-cyan)]">{ev.format}</span>
                          <span className="text-[10px] font-[800] uppercase tracking-wider px-2.5 py-1 border border-green-500/30 text-green-400">{ev.type}</span>
                        </div>
                      </div>
                      <div className="text-[11px] font-[700] uppercase tracking-wider text-white/40 mb-2">Featured</div>
                      <h3 className="font-[800] text-[22px] leading-tight tracking-[-0.01em] mb-2 group-hover:text-[var(--neon-cyan)] transition-colors">{ev.title}</h3>
                      <p className="text-[13.5px] text-[var(--brutal-text-dim)] leading-[1.6] mb-5">{ev.description}</p>
                      <div className="flex items-center justify-between pt-5 border-t border-white/10">
                        <div>
                          <div className="text-[12px] text-white/50 mb-0.5">Speaker</div>
                          <div className="font-[700] text-[14px]">{ev.speaker}</div>
                          <div className="text-[11px] text-white/50">{ev.speakerTitle}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-[800] text-[22px]" style={{ color: spotsColor(spotsLeft(ev)) }}>{spotsLeft(ev)}</div>
                          <div className="text-[11px] text-white/50 uppercase tracking-wider">Spots left</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── ALL EVENTS ─── */}
      <section className="py-12">
        <div className="max-w-[1240px] mx-auto px-8">
          {/* Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8 pb-6 border-b-[2.5px] border-[var(--ink)]">
            <h2 className="font-[800] text-[clamp(22px,3vw,32px)] tracking-[-0.02em] uppercase">All Events</h2>
            <div className="flex gap-2">
              {FILTERS.map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className="px-4 py-2 text-[12.5px] font-[800] uppercase tracking-wider transition-all border-[2px] rounded-none"
                  style={filter === f
                    ? { background: 'var(--ink)', color: '#fff', border: '2px solid var(--ink)', boxShadow: '3px 3px 0px rgba(21,19,44,0.3)' }
                    : { background: 'transparent', color: 'var(--ink-soft)', border: '2px solid var(--line)' }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={filter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
              className="space-y-4">
              {filtered.map((ev, i) => (
                <motion.div key={ev.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <Link href={`/events/${ev.id}`}
                    className="block border-[2.5px] border-[var(--ink)] shadow-[6px_6px_0px_var(--ink)] bg-white hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0px_var(--ink)] transition-all group">
                    <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-0 items-stretch">
                      {/* Date block */}
                      <div className="flex flex-col items-center justify-center px-7 py-6 border-b-[2.5px] md:border-b-0 md:border-r-[2.5px] border-[var(--ink)] min-w-[100px]" style={{ background: 'var(--brutal-bg)' }}>
                        <div className="font-[800] text-[38px] text-[var(--neon-cyan)] leading-none">{ev.date.day}</div>
                        <div className="text-[12px] font-[800] uppercase tracking-wider text-white/60 mt-1">{ev.date.month}</div>
                        <div className="text-[11px] font-[600] text-white/40 mt-0.5">{ev.date.year}</div>
                      </div>

                      {/* Info */}
                      <div className="p-6">
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="text-[10px] font-[800] uppercase tracking-wider px-2.5 py-1 border-[1.5px] border-[var(--ink)]">{ev.format}</span>
                          <span className="text-[10px] font-[800] uppercase tracking-wider px-2.5 py-1 border-[1.5px]"
                            style={{ borderColor: ev.type === 'Free' ? '#28c840' : ev.type === 'Invite-Only' ? '#d69e2e' : 'var(--ink)', color: ev.type === 'Free' ? '#28c840' : ev.type === 'Invite-Only' ? '#d69e2e' : 'var(--ink)' }}>
                            {ev.type}
                          </span>
                          {ev.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-[10px] font-[600] uppercase tracking-wider px-2.5 py-1 border border-[var(--line)] text-[var(--ink-faint)]">{tag}</span>
                          ))}
                        </div>
                        <h3 className="font-[800] text-[20px] leading-tight tracking-[-0.01em] mb-1 group-hover:underline underline-offset-2">{ev.title}</h3>
                        <div className="text-[13px] text-[var(--ink-soft)] mb-3">{ev.subtitle}</div>
                        <p className="text-[13px] text-[var(--ink-soft)] leading-[1.6] line-clamp-2">{ev.description}</p>
                        <div className="flex flex-wrap gap-5 mt-4 text-[12.5px] text-[var(--ink-soft)] font-[600]">
                          <span className="flex items-center gap-1.5">🕐 {ev.time} {ev.timezone}</span>
                          <span className="flex items-center gap-1.5">📍 {ev.location}</span>
                          <span className="flex items-center gap-1.5">🎤 {ev.speaker}</span>
                        </div>
                      </div>

                      {/* Right panel */}
                      <div className="flex flex-col items-center justify-center p-6 border-t-[2.5px] md:border-t-0 md:border-l-[2.5px] border-[var(--ink)] min-w-[130px] gap-3" style={{ background: 'var(--paper-alt)' }}>
                        <div className="text-center">
                          <div className="font-[800] text-[26px] leading-none" style={{ color: spotsColor(spotsLeft(ev)) }}>
                            {ev.type === 'Invite-Only' ? '—' : spotsLeft(ev)}
                          </div>
                          <div className="text-[10px] font-[700] uppercase tracking-wider text-[var(--ink-faint)] mt-1">
                            {ev.type === 'Invite-Only' ? 'Invite Only' : 'Spots Left'}
                          </div>
                        </div>
                        <div className="w-full h-1.5 bg-[var(--line)] rounded-none overflow-hidden">
                          <div className="h-full" style={{ width: `${(ev.registered / ev.capacity) * 100}%`, background: spotsColor(spotsLeft(ev)) }} />
                        </div>
                        <div className="text-[11px] text-[var(--ink-faint)] font-[500]">{ev.registered}/{ev.capacity} registered</div>
                        <span className="font-[800] text-[12px] uppercase tracking-wider text-[var(--ink)] group-hover:text-[var(--ink)] mt-1">View Details →</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-20 border-[2.5px] border-[var(--line)] text-[var(--ink-soft)] font-[700] text-[16px] uppercase tracking-wider">
              No events match this filter.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
