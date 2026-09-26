import { useState } from 'react';
import { Accent, PageHero } from '../components/PageHero';
import { Eyebrow, MaskLines, Pill, RevealImage } from '../components/primitives';
import { TeamIndex } from '../components/TeamIndex';
import { applyHref, stats } from '../config/site';
import { departments, teamMembers } from '../data/team';
import { usePageMeta } from '../hooks/usePageMeta';

import imgSelfie from '../assets/media/selfie.webp';
import imgTrio from '../assets/media/trio.webp';

export default function Team() {
  usePageMeta('Team', 'The educators, organizers and builders behind Global Capital League.');
  const [dept, setDept] = useState('All');
  const list = dept === 'All' ? teamMembers : teamMembers.filter((m) => m.department === dept);
  const countries = new Set(teamMembers.map((m) => m.location.split(',').pop()?.trim())).size;

  return (
    <>
      <PageHero
        index="05"
        label="Team"
        lines={['A crew,', <>not a <Accent>company.</Accent></>]}
        intro={<>Educators, economists, designers and organizers — spread across {countries} countries and united by one idea: financial literacy should be radically accessible to every young person on earth.</>}
        aside={
          <div className="mono grid grid-cols-2 gap-x-10 gap-y-4 text-mute">
            <div><div className="display text-[56px] text-ink">{teamMembers.length}</div>Core team</div>
            <div><div className="display text-[56px] text-ink">{stats.chapters.value}</div>Chapter leads</div>
          </div>
        }
      />

      <section className="gutter pb-[clamp(80px,10vw,140px)]">
        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter by department">
          {departments.map((d) => (
            <button key={d} type="button" aria-pressed={dept === d} onClick={() => setDept(d)} className={`mono rounded-full border px-4 py-2 transition-colors ${dept === d ? 'border-ink bg-ink text-paper' : 'border-ink/20 hover:border-ink'}`}>
              {d}
            </button>
          ))}
        </div>
        <TeamIndex key={dept} members={list} />
      </section>

      <section className="gutter grid gap-6 pb-[clamp(80px,10vw,140px)] md:grid-cols-[1fr_1.4fr]">
        <RevealImage src={imgTrio} alt="Three GCL volunteers" className="aspect-[4/5] rounded-[24px]" />
        <div className="flex flex-col justify-between gap-10">
          <RevealImage src={imgSelfie} alt="GCL volunteers taking a group selfie after an event" className="aspect-[4/3] rounded-[24px]" />
          <div>
            <Eyebrow index="05.1" className="mb-6">Join the crew</Eyebrow>
            <MaskLines as="h2" className="display text-[clamp(56px,7vw,120px)]" lines={['Your name', <>could be <Accent>here.</Accent></>]} />
            <p className="mt-6 max-w-[520px] text-[17px] leading-relaxed text-mute">
              Most of our team started as students in a GCL workshop. Teach with a chapter, join a summer cohort, or bring a skill we need — design, video, translation, code.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Pill href={applyHref} variant="signal">Apply to teach</Pill>
              <Pill href="/chapters#start" variant="ghost">Start a chapter</Pill>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
