import React from 'react';
import { motion, useInView } from 'framer-motion';
import { team } from '../data/team';
import { PhotoSlider } from '../components/PhotoSlider';
import { Link } from 'wouter';

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65, delay }} className={className}>
      {children}
    </motion.div>
  );
}

const aboutSlides = [
  { id: 'a1', gradient: 'linear-gradient(135deg,var(--blue),var(--magenta))', icon: '🔥', title: 'Youth-Led, Expert-Backed', description: 'We believe the people most affected by broken financial systems should be the ones redesigning education around them.' },
  { id: 'a2', gradient: 'linear-gradient(135deg,#33c7e8,var(--violet))', icon: '🌍', title: 'Global Context', description: 'Operating across 14 countries, we adapt behavioral economics principles to local economic realities and cultural relationships with money.' },
  { id: 'a3', gradient: 'linear-gradient(135deg,var(--violet),var(--magenta))', icon: '⚖️', title: 'Financial Dignity', description: 'We reject shame-based financial advice. Our entire approach moves from judgment to structural understanding and real agency.' },
];

const milestones = [
  { year: '2021', title: 'GCL Founded', desc: 'Three youth economists start delivering workshops in community centers across three cities.' },
  { year: '2022', title: 'First Partnerships', desc: 'Signed agreements with 6 NGOs across East Africa and South Asia to co-deliver our curriculum.' },
  { year: '2023', title: 'Digital Platform Launch', desc: 'Online courses reach 3,000+ students in 8 countries within the first three months.' },
  { year: '2024', title: 'First Global Summit', desc: '400 youth financial educators convene in Nairobi for our inaugural Youth Finance Summit.' },
  { year: '2025', title: '14 Countries & Growing', desc: 'GCL network now active across 14 countries with 40+ partner organizations and 8K+ youth reached.' },
];

const values = [
  { label: 'Dignity First', desc: 'We reject shame-based financial advice in all its forms. Learning happens without judgment.', color: 'var(--blue)', icon: '✦' },
  { label: 'Evidence-Based', desc: 'Everything we teach is grounded in peer-reviewed behavioral science — not conventional wisdom.', color: 'var(--violet)', icon: '◈' },
  { label: 'Radical Access', desc: 'Free, open-source, and culturally adapted. Financial education belongs to everyone.', color: 'var(--magenta)', icon: '◎' },
  { label: 'Youth Power', desc: 'Led by the generation inheriting this economy. Designed for the communities most locked out.', color: '#33c7e8', icon: '⬡' },
];

export function About() {
  return (
    <main className="pb-32" style={{ background: 'var(--paper-alt)' }}>
      {/* Hero */}
      <section className="relative pt-[90px] pb-[80px] overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 30% 20%, var(--violet), transparent)' }} />
        <div className="max-w-[1240px] mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="flex items-center gap-3 mb-8">
                <div className="h-[2px] w-12 bg-[var(--ink)]" />
                <span className="text-[13px] font-[800] tracking-[0.1em] uppercase text-[var(--violet)]">Who We Are</span>
              </div>
              <h1 className="font-[800] text-[clamp(48px,7vw,88px)] leading-[0.95] tracking-[-0.03em] text-[var(--ink)] uppercase mb-8">
                About<br />
                <span className="text-[var(--violet)]">Global</span><br />
                Capital League.
              </h1>
              <p className="text-[17px] text-[var(--ink-soft)] leading-[1.7] max-w-[480px]">
                A youth-led nonprofit using behavioral economics to make financial literacy accessible to every community — not just the privileged few.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
              <PhotoSlider slides={aboutSlides} layout="overlay" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24">
        <div className="max-w-[1240px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <h2 className="font-[800] text-[clamp(28px,3.8vw,46px)] leading-[1.1] tracking-[-0.025em] mb-6">The problem isn't math.<br />It's behavior under pressure.</h2>
              <p className="text-[16px] leading-[1.75] text-[var(--ink-soft)] mb-5">Traditional financial literacy programs assume that if you show people a spreadsheet, they will change their spending habits. But humans aren't spreadsheets. We are deeply emotional creatures operating within highly engineered economic systems designed to exploit cognitive shortcuts.</p>
              <p className="text-[16px] leading-[1.75] text-[var(--ink-soft)] mb-5">GCL was founded by a coalition of youth advocates and behavioral economists to bridge this gap. We translate complex economic theory into actionable, accessible tools — built for the communities usually left out of the conversation.</p>
              <p className="text-[16px] leading-[1.75] text-[var(--ink-soft)]">
                <strong className="text-[var(--ink)]">Built and run by young people, for the communities most locked out of financial access.</strong>
              </p>
            </Reveal>

            {/* Animated orb stage */}
            <Reveal delay={0.15}>
              <div className="relative h-[380px] flex items-center justify-center">
                <motion.div
                  animate={{ y: [0, -18, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-[230px] h-[230px] rounded-full relative"
                  style={{ background: 'conic-gradient(from 140deg, var(--blue), var(--violet), var(--magenta), #6ad8f2, var(--blue))', boxShadow: '0 30px 70px -14px rgba(139,92,246,0.45)' }}
                >
                  <div className="absolute inset-4 rounded-full" style={{ background: 'radial-gradient(circle at 32% 26%, rgba(255,255,255,0.5), transparent 55%)' }} />
                </motion.div>
                {[
                  { label: 'Decision 🎯', style: 'top-[8%] left-[-2%]' },
                  { label: 'Behavior 🧠', style: 'bottom-[10%] right-[-2%]' },
                  { label: 'Dignity ✨', style: 'top-[52%] left-[-10%]' },
                ].map(chip => (
                  <div key={chip.label} className={`absolute px-4 py-2 rounded-full text-[13px] font-[600] bg-white shadow-[var(--shadow-md)] border border-[var(--line)] ${chip.style}`}>{chip.label}</div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-[1240px] mx-auto px-8">
          <Reveal className="mb-14 text-center max-w-[560px] mx-auto">
            <h2 className="font-[800] text-[clamp(28px,3.5vw,44px)] leading-[1.1] tracking-[-0.025em] text-[var(--ink)] uppercase mb-4">What We Stand For</h2>
            <p className="text-[16px] text-[var(--ink-soft)]">Four principles that shape every decision we make — from curriculum design to partnership selection.</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <Reveal key={v.label} delay={i * 0.08}>
                <div className="p-7 rounded-[16px] h-full transition-all hover:-translate-x-[3px] hover:-translate-y-[3px]" style={{ background: 'var(--paper-alt)', border: '2.5px solid var(--ink)', boxShadow: '6px 6px 0px var(--ink)' }}>
                  <div className="text-[28px] font-[800] mb-4" style={{ color: v.color }}>{v.icon}</div>
                  <div className="font-[800] text-[17px] text-[var(--ink)] uppercase tracking-wider mb-3">{v.label}</div>
                  <p className="text-[13.5px] text-[var(--ink-soft)] leading-[1.6]">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-[var(--paper-alt)]">
        <div className="max-w-[1240px] mx-auto px-8">
          <Reveal className="mb-14">
            <h2 className="font-[800] text-[clamp(28px,3.5vw,44px)] leading-[1.1] tracking-[-0.025em] uppercase">Our Journey</h2>
            <p className="text-[16px] text-[var(--ink-soft)] mt-3 max-w-[440px]">From a small idea in a community center to a global movement in five years.</p>
          </Reveal>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-[2px] md:left-1/2 md:-ml-px" style={{ background: 'linear-gradient(to bottom, var(--blue), var(--violet), var(--magenta))' }} />
            <div className="space-y-10">
              {milestones.map((m, i) => (
                <Reveal key={m.year} delay={i * 0.1} className={`relative flex gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}>
                  {/* Content */}
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'} pl-12 md:pl-0`}>
                    <div className="rounded-[16px] p-6 bg-white inline-block max-w-[420px] text-left" style={{ border: '2.5px solid var(--ink)', boxShadow: '5px 5px 0px var(--ink)' }}>
                      <div className="font-[800] text-[28px] tracking-[-0.02em] mb-1" style={{ background: 'var(--grad-brand)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{m.year}</div>
                      <div className="font-[800] text-[18px] mb-2">{m.title}</div>
                      <p className="text-[14px] text-[var(--ink-soft)] leading-[1.6]">{m.desc}</p>
                    </div>
                  </div>
                  {/* Dot */}
                  <div className="absolute left-[11px] md:left-1/2 md:-ml-[9px] top-6 w-[18px] h-[18px] rounded-full border-[3px] border-white z-10" style={{ background: 'var(--grad-brand)', boxShadow: '0 0 0 4px rgba(139,92,246,0.2)' }} />
                  <div className="flex-1 hidden md:block" />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24">
        <div className="max-w-[1240px] mx-auto px-8">
          <Reveal className="mb-14">
            <h2 className="font-[800] text-[clamp(28px,3.5vw,44px)] leading-[1.1] tracking-[-0.025em] uppercase">The Team</h2>
            <p className="text-[16px] text-[var(--ink-soft)] mt-3">Youth economists, educators, and organizers from 9 countries — united by the same mission.</p>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {team.map((member, i) => (
              <motion.div key={member.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="text-center group">
                <div className="w-full aspect-square rounded-[20px] mb-4 mx-auto flex items-center justify-center text-[32px] font-[800] text-white transition-all group-hover:-translate-y-[4px] group-hover:shadow-[6px_6px_0px_var(--ink)]" style={{ background: `linear-gradient(135deg,${member.color},var(--ink))`, border: '2.5px solid var(--ink)', boxShadow: '4px 4px 0px var(--ink)' }}>
                  {member.name.charAt(0)}
                </div>
                <div className="font-[800] text-[14px] tracking-[-0.01em]">{member.name}</div>
                <div className="text-[12px] text-[var(--ink-faint)] font-[500] mt-0.5">{member.role}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <Reveal className="max-w-[1240px] mx-auto px-8">
        <div className="rounded-[28px] p-[60px] text-center" style={{ background: 'linear-gradient(135deg,#e9edff,#f7e6fb)', border: '2.5px solid var(--ink)', boxShadow: '10px 10px 0px var(--ink)' }}>
          <h2 className="font-[800] text-[clamp(26px,4vw,46px)] leading-[1.05] tracking-[-0.03em] mb-4 uppercase">Join the movement.</h2>
          <p className="text-[16px] text-[var(--ink-soft)] max-w-[400px] mx-auto mb-8">Whether as a student, partner, or donor — there's a place for you in GCL.</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/courses" className="text-[15px] font-[700] px-8 py-4 rounded-full text-white" style={{ background: 'var(--ink)' }} data-testid="about-cta-courses">Explore Courses →</Link>
            <a href="mailto:hello@globalcapitalleague.org" className="text-[15px] font-[700] px-8 py-4 rounded-full" style={{ border: '2px solid var(--ink)' }} data-testid="about-cta-contact">Contact the Team</a>
          </div>
        </div>
      </Reveal>
    </main>
  );
}
