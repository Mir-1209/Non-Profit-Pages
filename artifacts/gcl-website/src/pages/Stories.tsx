import React from 'react';
import { motion, useInView } from 'framer-motion';
import { stories } from '../data/stories';
import { StoriesCarousel } from '../components/StoriesCarousel';

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65, delay }} className={className}>
      {children}
    </motion.div>
  );
}

const regions = [
  { name: 'East Africa', flag: '🇰🇪', count: '3,200+', status: 'Active' },
  { name: 'South Asia', flag: '🇮🇳', count: '2,100+', status: 'Active' },
  { name: 'Latin America', flag: '🇨🇴', count: '1,400+', status: 'Piloting' },
  { name: 'Southeast Europe', flag: '🇷🇸', count: '800+', status: 'Piloting' },
  { name: 'North America', flag: '🇺🇸', count: '600+', status: 'Active' },
  { name: 'East Asia', flag: '🇸🇬', count: '400+', status: 'Early' },
];

export function Stories() {
  return (
    <main className="pb-32" style={{ background: 'var(--paper-alt)' }}>
      {/* Hero */}
      <section className="relative pt-[90px] pb-[80px] overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 40% 20%, var(--blue), transparent)' }} />
        <div className="max-w-[1240px] mx-auto px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-[760px]">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-[2px] w-12 bg-[var(--ink)]" />
              <span className="text-[13px] font-[800] tracking-[0.1em] uppercase text-[var(--violet)]">Real People, Real Decisions</span>
            </div>
            <h1 className="font-[800] text-[clamp(48px,7vw,88px)] leading-[0.95] tracking-[-0.03em] text-[var(--ink)] uppercase mb-8">
              Decisions<br />
              People Made<br />
              <span className="text-[var(--violet)]">Differently.</span>
            </h1>
            <p className="text-[17px] text-[var(--ink-soft)] leading-[1.7] max-w-[520px]">
              Real accounts from students, educators, and community leaders in the GCL network — from Nairobi to Mumbai, Bogotá to Belgrade.
            </p>
          </motion.div>

          {/* Global reach mini stats */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6 }} className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-14">
            {regions.map((r, i) => (
              <motion.div key={r.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.06 }} className="flex items-center justify-between px-5 py-4 rounded-[12px] bg-white border-[2px] border-[var(--ink)]">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{r.flag}</span>
                  <div>
                    <div className="font-[700] text-[14px] text-[var(--ink)]">{r.name}</div>
                    <div className="text-[12px] text-[var(--ink-soft)]">{r.count} reached</div>
                  </div>
                </div>
                <span className="text-[10px] font-[800] uppercase tracking-wider px-2 py-1 rounded-full" style={{ background: r.status === 'Active' ? 'rgba(40,200,64,0.12)' : 'rgba(99,102,241,0.1)', color: r.status === 'Active' ? '#15803d' : 'var(--violet)' }}>{r.status}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured carousel */}
      <section className="py-20 bg-[var(--paper-alt)]">
        <div className="max-w-[1240px] mx-auto px-8">
          <Reveal className="mb-12">
            <h2 className="font-[800] text-[clamp(28px,3.5vw,42px)] tracking-[-0.025em]">Featured Stories</h2>
            <p className="text-[16px] text-[var(--ink-soft)] mt-3 max-w-[480px]">Swipe through stories from across the network. Each one is a decision that changed a trajectory.</p>
          </Reveal>
          <div className="-mx-8 md:mx-0">
            <StoriesCarousel stories={stories} />
          </div>
        </div>
      </section>

      {/* Impact pull quote */}
      <section className="py-16 bg-white border-y-[2.5px] border-[var(--ink)]">
        <div className="max-w-[1240px] mx-auto px-8">
          <Reveal className="text-center max-w-[800px] mx-auto">
            <div className="text-[72px] leading-none text-[var(--violet)] font-[800] mb-4">"</div>
            <p className="font-[800] text-[clamp(22px,3vw,34px)] text-[var(--ink)] leading-[1.35] tracking-[-0.02em] mb-8">
              It's the first financial program that treated our community like it had potential, not just problems.
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-[800] text-white bg-[var(--ink)]">P</div>
              <div className="text-left">
                <div className="font-[700] text-[var(--ink)] text-[15px]">Priya S.</div>
                <div className="text-[13px] text-[var(--ink-soft)]">Community Organizer · Mumbai, India</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* All testimonials grid */}
      <section className="py-20">
        <div className="max-w-[1240px] mx-auto px-8">
          <Reveal className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="font-[800] text-[clamp(26px,3vw,38px)] tracking-[-0.025em]">All Testimonials</h2>
              <p className="text-[15px] text-[var(--ink-soft)] mt-2">{stories.length} voices from the GCL network</p>
            </div>
          </Reveal>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {stories.map((story, i) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: Math.min(i * 0.07, 0.4) }}
                className="break-inside-avoid bg-white p-8 rounded-[16px] cursor-default transition-all hover:-translate-x-[2px] hover:-translate-y-[2px]"
                style={{ border: '2.5px solid var(--ink)', boxShadow: '6px 6px 0px var(--ink)', borderTopWidth: '5px', borderTopColor: story.color }}
              >
                <p className="text-[15.5px] leading-[1.75] text-[var(--ink)] mb-6 font-[500]">
                  "{story.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-[800] text-[15px] shrink-0" style={{ background: `linear-gradient(135deg,${story.color},var(--ink))` }}>
                    {story.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-[700] text-[14px]">{story.name}</div>
                    <div className="text-[12px] text-[var(--ink-faint)] font-[500]">{story.role} · {story.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <Reveal className="max-w-[1240px] mx-auto px-8 pb-8">
        <div className="rounded-[28px] p-[60px] text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#e9edff,#f7e6fb)', border: '2.5px solid var(--ink)', boxShadow: '10px 10px 0px var(--ink)' }}>
          <h2 className="font-[800] text-[clamp(26px,4vw,46px)] leading-[1.05] tracking-[-0.03em] mb-4 uppercase max-w-[560px] mx-auto">Your story could be next.</h2>
          <p className="text-[16px] text-[var(--ink-soft)] max-w-[420px] mx-auto mb-8">Join a GCL program and become part of a growing movement rewriting financial realities worldwide.</p>
          <button className="text-[15px] font-[700] px-8 py-4 rounded-full text-white" style={{ background: 'var(--ink)' }} data-testid="stories-cta">
            Join a Program →
          </button>
        </div>
      </Reveal>
    </main>
  );
}
