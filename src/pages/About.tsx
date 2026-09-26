import { GrowthChart } from '../components/GrowthChart';
import { Accent, PageHero } from '../components/PageHero';
import { Eyebrow, MaskLines, Pill, RevealImage, Rise, ScrollInk } from '../components/primitives';
import { donateHref, site, stats } from '../config/site';
import { usePageMeta } from '../hooks/usePageMeta';

import imgRoom from '../assets/media/room-wide.webp';
import imgSession from '../assets/media/session-wide.webp';
import imgPanorama from '../assets/media/school-panorama-2.webp';

const PRINCIPLES = [
  { t: 'Behavior over arithmetic', d: 'Knowing how interest works has never stopped anyone from overspending. We teach why we decide the way we do — present bias, loss aversion, scarcity — and design habits around it.' },
  { t: 'Dignity, not charity', d: 'Nobody is "bad with money". People make rational choices inside irrational systems. Our classrooms are shame-free by design.' },
  { t: 'Peer to peer', d: 'Young people teach young people. Every educator was a student first, and every student is a future educator.' },
  { t: 'Local by default', d: 'Curriculum is adapted to each city — its language, its currency, its realities. A chapter in Dushanbe is not a franchise of one in London.' },
  { t: 'Free, for real', d: `The cost to students is $0 — no fees, no data harvesting, no upsell. Our work is funded by donors and partners who believe the same.` },
  { t: 'Radical transparency', d: 'We publish what we do and how we measure it. Chapters report every verified event, attendee count and outcome.' },
];

export default function About() {
  usePageMeta('About', `Why ${site.name} exists, what we believe, and how a single workshop in Tashkent became Asia's largest youth-led financial literacy network.`);

  return (
    <>
      <PageHero
        label="About GCL"
        lines={['We teach', <>the <Accent>system</Accent></>, 'behind the', 'numbers.']}
        intro={
          <>
            {site.name} is a youth-led non-profit teaching behavioral economics and the psychology of money to young people who have never had access to it. Founded in {site.hq.city} in {site.founded}, formerly known as {site.formerly}.
          </>
        }
        aside={
          <div className="mono grid grid-cols-2 gap-x-10 gap-y-4 text-mute">
            <div><div className="display text-[56px] text-ink">{stats.countries.value}+</div>Countries</div>
            <div><div className="display text-[56px] text-ink">{stats.chapters.value}</div>Chapters</div>
            <div><div className="display text-[56px] text-ink">{(stats.youth.value / 1000).toFixed(0)}K+</div>Youth taught</div>
            <div><div className="display text-[56px] text-signal">$0</div>To students</div>
          </div>
        }
      />

      <section className="gutter pb-24">
        <RevealImage src={imgRoom} alt="A GCL workshop in a modern classroom, students seated at long tables" className="aspect-[16/10] w-full rounded-[24px] md:aspect-[21/9]" />
      </section>

      <section className="gutter grid gap-12 py-[clamp(80px,10vw,160px)] lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Eyebrow index="01.1" className="mb-6">The problem</Eyebrow>
          <MaskLines as="h2" className="display text-[clamp(56px,7vw,120px)]" lines={['Math was', <>never the <Accent>problem.</Accent></>]} />
        </div>
        <div className="space-y-6 text-[clamp(18px,1.4vw,21px)] leading-[1.55]">
          <p>
            Most financial literacy programs fail because they teach arithmetic — interest rates, spreadsheets, rules of thumb — to people whose real challenge is behavior. Knowing the rules does not change what you do at the checkout, on payday, or when someone offers easy credit.
          </p>
          <p className="text-mute">
            Scarcity makes it worse. Research on the "bandwidth tax" shows that financial stress consumes the very mental capacity needed to plan ahead. Communities that most need good decisions are pushed hardest toward bad ones.
          </p>
          <p className="text-mute">
            So we flipped the syllabus. GCL focuses on decisions under scarcity, emotional spending, and the psychological traps that keep families in debt — and gives young people practical tools that work with their brains, not against them.
          </p>
        </div>
      </section>

      <section className="on-dark glow-dark py-[clamp(96px,12vw,180px)] text-paper">
        <div className="gutter">
          <Eyebrow index="01.2" className="mb-10 text-paper/70">What we believe</Eyebrow>
          <ScrollInk
            className="max-w-[1400px] text-[clamp(30px,4.2vw,70px)] font-[560] leading-[1.06] tracking-[-0.025em]"
            text="Financial literacy is a human right. Not a perk for the lucky few, not a course you pay for, not advice from someone selling you something. It is the right to understand the system you live inside — and the power to change it."
            accent={['right', 'change']}
          />
          <div className="mt-20 grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <Rise key={p.t} delay={(i % 3) * 0.08} className="border-t border-paper/15 pt-5">
                <div className="mono mb-4 text-signal">P.0{i + 1}</div>
                <h3 className="display text-[44px]">{p.t}</h3>
                <p className="mt-3 text-[16px] leading-relaxed text-paper/65">{p.d}</p>
              </Rise>
            ))}
          </div>
        </div>
      </section>

      <GrowthChart />

      <section className="gutter grid gap-6 pb-[clamp(80px,10vw,160px)] md:grid-cols-2">
        <RevealImage src={imgSession} alt="A GCL educator presenting at the front of a full room" className="aspect-[4/5] rounded-[24px]" />
        <div className="flex flex-col justify-between gap-10">
          <RevealImage src={imgPanorama} alt="A school classroom filled with students during a GCL session" className="aspect-[16/9] rounded-[24px]" />
          <div>
            <Eyebrow index="01.3" className="mb-6">Why the new name</Eyebrow>
            <h2 className="display text-[clamp(52px,6vw,100px)]">
              Vanguard <Accent>→</Accent> Global.
            </h2>
            <p className="mt-6 max-w-[520px] text-[18px] leading-relaxed text-mute">
              We started as {site.formerly}. As chapters opened across Central Asia, the Caucasus, Africa, Europe, South Asia and Latin America, the name stopped describing who we are. Global Capital League is the same mission — with a name the size of its reach.
            </p>
          </div>
        </div>
      </section>

      <section className="gutter rule border-t py-[clamp(80px,10vw,140px)]">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <Eyebrow index="01.4" className="mb-6">Governance & accountability</Eyebrow>
            <h2 className="display text-[clamp(52px,6vw,100px)]">
              Every dollar, <Accent>accounted.</Accent>
            </h2>
          </div>
          <div className="space-y-5 text-[17px] leading-relaxed text-mute">
            <p>GCL is a non-profit, volunteer-powered organization. Leadership is accountable to our members and partners; chapters report verified events and attendance so impact figures can be traced back to real rooms.</p>
            <p>Donors and partners can request our latest financial summary and impact report at any time.</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Pill href={donateHref} variant="signal">Support the mission</Pill>
              <Pill href="/team" variant="ghost">Meet the team</Pill>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
