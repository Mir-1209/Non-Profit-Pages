import React from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'wouter';
import { PhotoSlider } from '../components/PhotoSlider';

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65, delay, ease: [0.21, 0.47, 0.32, 0.98] }} className={className}>
      {children}
    </motion.div>
  );
}

const programs = [
  {
    id: 'workshops',
    label: 'WS',
    title: 'Workshops & Courses',
    color: 'var(--blue)',
    darkColor: 'var(--neon-cyan)',
    tagline: 'Where behavior meets the classroom.',
    description: 'Our flagship learning experiences range from 2-hour intensive workshops to 6-week cohort-based digital courses. We replace boring lectures with dynamic exercises that reveal how our brains actually process money — in real time.',
    outcomes: [
      '80% higher completion rate vs. standard financial ed',
      'Available in-person and via guided digital platforms',
      'Culturally sensitive examples and case studies',
      'Live facilitation by trained youth educators',
      'Certificate of completion recognized by partner institutions',
    ],
    stat: { num: '120+', label: 'Workshops Delivered' },
    slides: [
      { id: 'w1', gradient: 'linear-gradient(135deg,#3358ff,#8b5cf6)', icon: '🎓', title: 'Interactive Workshops', description: 'High-energy, live sessions dismantling cognitive biases around money one decision at a time.' },
      { id: 'w2', gradient: 'linear-gradient(135deg,#8b5cf6,#e93fc7)', icon: '💻', title: 'Digital Cohorts', description: 'Guided online courses with weekly group calls, peer accountability, and expert facilitation.' },
      { id: 'w3', gradient: 'linear-gradient(135deg,#e93fc7,#5eeaff)', icon: '📜', title: 'Certified Programs', description: 'Completion certificates recognized by our institutional partners across 14 countries.' },
    ],
  },
  {
    id: 'partnerships',
    label: 'PT',
    title: 'Institutional Partnerships',
    color: 'var(--violet)',
    darkColor: '#b28bfa',
    tagline: 'We bring the curriculum. You bring community trust.',
    description: 'We scale our impact by integrating into the organizations communities already rely on — public schools, NGOs, universities, and youth centers. We license our curriculum, train local facilitators, and provide ongoing support.',
    outcomes: [
      'Turnkey curriculum deployment in 6–8 weeks',
      'Comprehensive local facilitator training program',
      'Impact measurement dashboard and reporting',
      'Co-branded materials for your organization',
      'Ongoing content updates as economic conditions change',
    ],
    stat: { num: '40+', label: 'Partner Organizations' },
    slides: [
      { id: 'p1', gradient: 'linear-gradient(135deg,#8b5cf6,#3358ff)', icon: '🏫', title: 'School Integrations', description: 'Embedding GCL curriculum into existing school systems in underserved districts worldwide.' },
      { id: 'p2', gradient: 'linear-gradient(135deg,#e93fc7,#8b5cf6)', icon: '🤝', title: 'NGO Collaborations', description: 'Partnering with nonprofits to reach communities beyond formal education pathways.' },
      { id: 'p3', gradient: 'linear-gradient(135deg,#33c7e8,#3358ff)', icon: '🌐', title: 'University Networks', description: 'Working with higher education institutions to train future educators and economists.' },
    ],
  },
  {
    id: 'tailored',
    label: 'TL',
    title: 'Tailored Content',
    color: 'var(--magenta)',
    darkColor: '#f27fdb',
    tagline: 'One size fits none. We design for the room in front of us.',
    description: 'Every community has a different economic context, cultural relationship with money, and set of challenges. Our tailored content program designs curriculum from scratch — or adapts existing materials — for the specific audience in front of us.',
    outcomes: [
      'Deep-dive community listening sessions before design',
      'Local language adaptation and cultural review',
      'Custom case studies using real local scenarios',
      'Iterative testing with community members',
      'Delivered as standalone modules or full programs',
    ],
    stat: { num: '14+', label: 'Countries Reached' },
    slides: [
      { id: 't1', gradient: 'linear-gradient(135deg,#e93fc7,#8b5cf6)', icon: '🎨', title: 'Community-Designed', description: 'Programs built from listening first — not from assumptions about what communities need.' },
      { id: 't2', gradient: 'linear-gradient(135deg,#3358ff,#33c7e8)', icon: '🗣️', title: 'Local Language', description: 'Materials adapted to the language, dialect, and economic vocabulary of each specific region.' },
      { id: 't3', gradient: 'linear-gradient(135deg,#5eeaff,#8b5cf6)', icon: '📊', title: 'Real Scenarios', description: 'Case studies built around actual local markets, currencies, and cost-of-living conditions.' },
    ],
  },
  {
    id: 'network',
    label: 'GN',
    title: 'Global Network',
    color: '#33c7e8',
    darkColor: '#5eeaff',
    tagline: 'Local knowledge, planetary scale.',
    description: 'A growing network of local partners, youth leaders, and international organizations who share our mission and amplify our reach. What starts in one neighborhood can become a framework used continents away.',
    outcomes: [
      'Cross-border knowledge exchange between communities',
      'Joint funding applications with trusted partners',
      'Shared resource library and curriculum commons',
      'Annual Global Youth Finance Summit',
      'Mentorship pathways between established and emerging programs',
    ],
    stat: { num: '8K+', label: 'Youth Reached' },
    slides: [
      { id: 'g1', gradient: 'linear-gradient(135deg,#33c7e8,#3358ff)', icon: '🌍', title: 'East Africa Hub', description: 'Our most active network node — connecting programs across Kenya, Uganda, and Rwanda.' },
      { id: 'g2', gradient: 'linear-gradient(135deg,#8b5cf6,#e93fc7)', icon: '🌏', title: 'South Asia Pilots', description: 'New programs launching in India and Bangladesh, designed with local civil society organizations.' },
      { id: 'g3', gradient: 'linear-gradient(135deg,#e93fc7,#33c7e8)', icon: '🌎', title: 'Latin America Expansion', description: 'Early-stage partnerships in Colombia, Brazil, and Mexico building toward 2026 launches.' },
    ],
  },
];

export function Programs() {
  return (
    <main className="pb-32" style={{ background: 'var(--paper-alt)' }}>
      {/* Hero */}
      <section className="relative pt-[90px] pb-[80px] overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, var(--violet), transparent)' }} />
        <div className="max-w-[1240px] mx-auto px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-[800px]">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-[2px] w-12 bg-[var(--ink)]" />
              <span className="text-[13px] font-[800] tracking-[0.1em] uppercase text-[var(--violet)]">How We Work</span>
            </div>
            <h1 className="font-[800] text-[clamp(48px,7vw,88px)] leading-[0.95] tracking-[-0.03em] text-[var(--ink)] uppercase mb-8">
              Four Ways<br />
              <span className="text-[var(--violet)]">We Move</span><br />
              The Needle.
            </h1>
            <p className="text-[18px] text-[var(--ink-soft)] leading-[1.7] max-w-[540px]">
              From live workshops to global institutional partnerships — every program meets people exactly where their financial decisions happen.
            </p>
          </motion.div>

          {/* Impact stats strip */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {[{ n: '14+', l: 'Countries' }, { n: '120+', l: 'Workshops' }, { n: '40+', l: 'Partners' }, { n: '8K+', l: 'Youth Reached' }].map(s => (
              <div key={s.l} className="px-6 py-5 bg-[var(--paper-alt)] border-[2.5px] border-[var(--ink)] shadow-[4px_4px_0px_var(--ink)]">
                <div className="font-[800] text-[clamp(28px,3.5vw,40px)] tracking-[-0.02em] text-[var(--ink)]">{s.n}</div>
                <div className="text-[12px] font-[700] text-[var(--ink-soft)] uppercase tracking-[0.06em] mt-1">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Program sections */}
      {programs.map((p, idx) => (
        <section key={p.id} className={`py-[100px] ${idx % 2 === 1 ? 'bg-[var(--paper-alt)]' : ''}`}>
          <div className="max-w-[1240px] mx-auto px-8">
            {/* Section label */}
            <Reveal className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 rounded-[14px] flex items-center justify-center font-[800] text-[13px]" style={{ background: `linear-gradient(135deg,${p.color},var(--ink))`, color: '#fff' }}>{p.label}</div>
              <div>
                <div className="font-[800] text-[22px] tracking-[-0.015em]">{p.title}</div>
                <div className="text-[14px] text-[var(--ink-soft)] font-[500] italic mt-0.5">{p.tagline}</div>
              </div>
            </Reveal>

            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-14 items-center ${idx % 2 === 1 ? 'lg:[direction:rtl]' : ''}`}>
              <Reveal className="lg:[direction:ltr]">
                <PhotoSlider slides={p.slides} layout="overlay" />
              </Reveal>

              <Reveal delay={0.12} className="lg:[direction:ltr]">
                <h2 className="font-[800] text-[clamp(28px,3.6vw,44px)] leading-[1.08] tracking-[-0.025em] mb-6">{p.title}</h2>
                <p className="text-[16px] leading-[1.75] text-[var(--ink-soft)] mb-8">{p.description}</p>

                <ul className="space-y-3 mb-10">
                  {p.outcomes.map(o => (
                    <li key={o} className="flex items-start gap-3 text-[15px] font-[500]">
                      <span className="mt-[3px] w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-[800] text-white shrink-0" style={{ background: `linear-gradient(135deg,${p.color},var(--violet))` }}>✓</span>
                      {o}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-6">
                  <div className="border-[2.5px] border-[var(--ink)] rounded-[14px] px-6 py-4 shadow-[5px_5px_0px_var(--ink)]">
                    <div className="font-[800] text-[28px] tracking-[-0.02em]" style={{ background: 'var(--grad-brand)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{p.stat.num}</div>
                    <div className="text-[12px] font-[700] uppercase tracking-[0.06em] text-[var(--ink-soft)] mt-1">{p.stat.label}</div>
                  </div>
                  <Link href="/events" className="text-[14.5px] font-[700] px-6 py-3 rounded-full text-white transition-all hover:-translate-y-[2px]" style={{ background: 'var(--ink)', boxShadow: '0 4px 14px rgba(21,19,44,0.15)' }} data-testid={`program-cta-${p.id}`}>
                    Get Involved →
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      ))}

      {/* Bottom CTA */}
      <Reveal className="max-w-[1240px] mx-auto px-8 py-8">
        <div className="rounded-[28px] p-[60px] text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#e9edff,#f7e6fb)', border: '2.5px solid var(--ink)', boxShadow: '10px 10px 0px var(--ink)' }}>
          <h2 className="font-[800] text-[clamp(28px,4.5vw,52px)] leading-[1.05] tracking-[-0.03em] mb-4 uppercase max-w-[620px] mx-auto">Ready to bring GCL to your community?</h2>
          <p className="text-[16px] text-[var(--ink-soft)] max-w-[460px] mx-auto mb-8">Whether you're a school, NGO, or community leader — we'll find the right format together.</p>
          <Link href="/about" className="inline-flex items-center gap-2 text-[15px] font-[700] px-8 py-4 rounded-full text-white" style={{ background: 'var(--ink)' }} data-testid="programs-bottom-cta">
            Contact Our Team →
          </Link>
        </div>
      </Reveal>
    </main>
  );
}
