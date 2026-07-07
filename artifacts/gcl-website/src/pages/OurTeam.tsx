import React, { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { teamMembers, departments, TeamMember } from '../data/team';
import iMapPin  from '../assets/icons/map-pin.svg';
import iMessage from '../assets/icons/message.svg';
import iShare   from '../assets/icons/share.svg';

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}

function MemberCard({ member, delay }: { member: TeamMember; delay: number }) {
  return (
    <Reveal delay={delay}>
      <div className="bg-white rounded-[20px] border-[2.5px] border-[var(--ink)] shadow-[6px_6px_0px_var(--ink)] overflow-hidden hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0px_var(--ink)] transition-all flex flex-col">
        {/* Avatar header */}
        <div className="h-[120px] relative flex items-center justify-center" style={{ background: member.gradient }}>
          <div className="w-[72px] h-[72px] rounded-full bg-white/20 border-[2.5px] border-white/40 flex items-center justify-center">
            <span className="text-[26px] font-[800] text-white tracking-[-0.02em]">{member.initials}</span>
          </div>
          <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-[9px] font-[800] uppercase tracking-wider text-white border border-white/25"
            style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}>
            {member.department}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          <h3 className="font-[800] text-[18px] tracking-[-0.01em] mb-1">{member.name}</h3>
          <p className="text-[13px] font-[700] text-[var(--violet)] uppercase tracking-[0.04em] mb-3">{member.role}</p>
          <p className="text-[13.5px] text-[var(--ink-soft)] leading-[1.65] mb-5 flex-1">{member.bio}</p>

          {/* Location */}
          <div className="flex items-center gap-1.5 mb-4 text-[12px] text-[var(--ink-faint)] font-[600]">
            <img src={iMapPin} alt="location" className="w-[16px] h-[16px]" draggable={false} />
            <span>{member.location}</span>
          </div>

          {/* Contact links */}
          <div className="flex gap-2 flex-wrap pt-4 border-t border-[var(--line)]">
            {member.email && (
              <a href={`mailto:${member.email}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11.5px] font-[700] bg-[var(--paper-alt)] text-[var(--ink)] border border-[var(--line)] hover:border-[var(--ink)] transition-colors">
                <img src={iMessage} alt="email" className="w-[15px] h-[15px]" draggable={false} /> Email
              </a>
            )}
            {member.linkedin && member.linkedin !== '#' && (
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11.5px] font-[700] bg-[var(--paper-alt)] text-[var(--ink)] border border-[var(--line)] hover:border-[var(--ink)] transition-colors">
                <img src={iShare} alt="linkedin" className="w-[15px] h-[15px]" draggable={false} /> LinkedIn
              </a>
            )}
            {member.instagram && member.instagram !== '#' && (
              <a href={member.instagram} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11.5px] font-[700] bg-[var(--paper-alt)] text-[var(--ink)] border border-[var(--line)] hover:border-[var(--ink)] transition-colors">
                <img src={iShare} alt="instagram" className="w-[15px] h-[15px]" draggable={false} /> Instagram
              </a>
            )}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function OurTeam() {
  const [activeDept, setActiveDept] = useState('All');

  const filtered = activeDept === 'All'
    ? teamMembers
    : teamMembers.filter(m => m.department === activeDept);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-[100px] bg-[var(--brutal-bg)] text-[var(--brutal-text)] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: 'repeating-linear-gradient(90deg,white 0px,white 1px,transparent 1px,transparent 80px),repeating-linear-gradient(0deg,white 0px,white 1px,transparent 1px,transparent 80px)' }} />
        <div className="max-w-[1240px] mx-auto px-8 relative z-10">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-[12px] font-[800] tracking-[0.08em] uppercase text-[var(--neon-cyan)] mb-5">
              <span className="w-2 h-2 rounded-full bg-[var(--neon-cyan)]" />
              The People Behind GCL
            </span>
            <h1 className="font-[800] text-[clamp(40px,6vw,78px)] leading-[1.03] tracking-[-0.03em] mb-6 uppercase">
              Our Team.
            </h1>
            <p className="text-[17px] text-[var(--brutal-text-dim)] leading-[1.7] max-w-[580px]">
              A distributed crew of educators, economists, builders, and changemakers united by one mission — making financial literacy radically accessible to every young person on earth.
            </p>
          </Reveal>

          {/* Stats row */}
          <Reveal delay={0.1}>
            <div className="flex gap-10 mt-12 flex-wrap">
              {[
                ['8', 'Core Team Members'],
                ['14+', 'Countries Represented'],
                ['38', 'Chapters Supported'],
                ['8K+', 'Youth Reached Together'],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="font-[800] text-[36px] tracking-[-0.03em] text-[var(--neon-cyan)] leading-none">{n}</div>
                  <div className="text-[12px] text-[var(--brutal-text-dim)] font-[600] uppercase tracking-[0.08em] mt-1">{l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="py-[90px]">
        <div className="max-w-[1240px] mx-auto px-8">
          {/* Department filters */}
          <Reveal>
            <div className="flex gap-2 flex-wrap mb-[60px]">
              {departments.map(dept => (
                <button
                  key={dept}
                  onClick={() => setActiveDept(dept)}
                  className="px-4 py-2 rounded-full text-[12px] font-[700] uppercase tracking-[0.06em] border-[2px] transition-all"
                  style={{
                    background: activeDept === dept ? 'var(--ink)' : 'transparent',
                    color: activeDept === dept ? 'white' : 'var(--ink-soft)',
                    borderColor: activeDept === dept ? 'var(--ink)' : 'var(--line)',
                  }}
                >
                  {dept}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((member, i) => (
              <MemberCard key={member.id} member={member} delay={i * 0.07} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-[var(--ink-faint)] text-[15px]">
              No team members in this department yet.
            </div>
          )}
        </div>
      </section>

      {/* Join the team CTA */}
      <section className="py-[80px] bg-[var(--paper-alt)]">
        <div className="max-w-[1240px] mx-auto px-8">
          <Reveal>
            <div className="rounded-[24px] p-[60px_40px] text-center border-[2.5px] border-[var(--ink)] shadow-[8px_8px_0px_var(--ink)]"
              style={{ background: 'linear-gradient(135deg, #e9edff 0%, #f7e6fb 50%, #fce4f2 100%)' }}>
              <p className="text-[12px] font-[800] tracking-[0.14em] uppercase text-[var(--ink-faint)] mb-3">Join the mission</p>
              <h2 className="font-[800] text-[clamp(26px,4vw,44px)] leading-[1.1] tracking-[-0.03em] mb-4 uppercase">
                Want to be part of this?
              </h2>
              <p className="text-[var(--ink-soft)] text-[15px] max-w-[480px] mx-auto mb-8 leading-[1.7]">
                Applications for GCL Team Summer '26 are open. Join the league, teach financial literacy to youth across 14+ countries, and build something real.
              </p>
              <a href="/apply/summer-26"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-[var(--ink)] text-white font-[800] text-[13px] uppercase tracking-wider hover:bg-[var(--violet)] transition-colors">
                Apply for Summer '26 →
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
