import { InvolveRows } from '../components/InvolveRows';
import { Accent, PageHero } from '../components/PageHero';
import { Eyebrow, MaskLines, Pill, Rise } from '../components/primitives';
import { donateHref, mailto, site } from '../config/site';
import { usePageMeta } from '../hooks/usePageMeta';

const GIFTS = [
  { amount: '$25', what: 'Prints workbooks for a full classroom.' },
  { amount: '$100', what: 'Funds a complete workshop in a new school — venue, materials, snacks.' },
  { amount: '$500', what: 'Trains a cohort of young educators to teach in their own communities.' },
  { amount: '$2,500', what: 'Launches a new chapter: mentoring, first events and a year of materials.' },
];

const PARTNERS = [
  ['Schools & universities', 'Host GCL sessions for your students, or start a campus chapter with our support.'],
  ['NGOs & foundations', 'Co-deliver programs with communities you already serve. We bring curriculum and trained educators.'],
  ['Companies', 'Sponsor a city, match employee giving, or lend volunteers with finance, design or tech skills.'],
  ['Governments & institutions', 'Partner on national financial-literacy strategies with a proven youth-led delivery model.'],
];

export default function GetInvolved() {
  usePageMeta('Get involved', `Donate, teach, partner or found a chapter — four ways to help ${site.name} make financial literacy free for every young person.`);

  return (
    <>
      <PageHero
        label="Get involved"
        lines={['Compound', <>the <Accent>good.</Accent></>]}
        intro={<>Money grows when it is invested early and left to compound. So does knowledge. Here is how you can put yours to work.</>}
        aside={<Pill href={donateHref} variant="signal">Donate now</Pill>}
      />

      <section className="gutter pb-[clamp(80px,10vw,140px)]">
        <InvolveRows />
      </section>

      <section id="donate" className="on-dark glow-dark py-[clamp(96px,12vw,180px)] text-paper">
        <div className="gutter">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div>
              <Eyebrow index="06.1" className="mb-6 text-paper/70">Donate</Eyebrow>
              <MaskLines as="h2" className="display text-[clamp(64px,9vw,160px)]" lines={['What your', <>gift <Accent>does.</Accent></>]} />
            </div>
            <p className="max-w-[460px] text-[17px] leading-relaxed text-paper/65 lg:justify-self-end">
              Students never pay. Donors and partners cover materials, venues, training and travel — so a single gift keeps teaching long after the session ends.
            </p>
          </div>
          <div className="mt-16 grid gap-px overflow-hidden rounded-[28px] bg-paper/15 sm:grid-cols-2 lg:grid-cols-4">
            {GIFTS.map((g, i) => (
              <Rise key={g.amount} delay={i * 0.06} className="h-full">
                <a href={donateHref} className="group flex h-full flex-col justify-between gap-16 bg-ink p-8 transition-colors duration-500 hover:bg-signal hover:text-ink">
                  <span className="mono text-paper/50 group-hover:text-ink/70">Give</span>
                  <span>
                    <span className="display block text-[clamp(72px,7vw,120px)] leading-[0.8]">{g.amount}</span>
                    <span className="mt-4 block text-[16px] leading-relaxed text-paper/70 group-hover:text-ink">{g.what}</span>
                  </span>
                </a>
              </Rise>
            ))}
          </div>
          <p className="mono mt-6 text-paper/45">
            Illustrative costs. Prefer a bank transfer, a recurring gift or giving through your employer? Write to{' '}
            <a className="link-sweep text-paper" href={mailto(site.email.giving, 'Giving to GCL')}>{site.email.giving}</a>.
          </p>
        </div>
      </section>

      <section id="partner" className="gutter py-[clamp(96px,12vw,180px)]">
        <div className="mb-14 grid gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <Eyebrow index="06.2" className="mb-6">Partner</Eyebrow>
            <MaskLines as="h2" className="display text-[clamp(64px,9vw,160px)]" lines={['Build it', <><Accent>with</Accent> us.</>]} />
          </div>
          <div className="lg:justify-self-end">
            <Pill href={mailto(site.email.partnerships, 'Partnership enquiry')} variant="ink">{site.email.partnerships}</Pill>
          </div>
        </div>
        <div className="grid gap-x-10 gap-y-12 md:grid-cols-2">
          {PARTNERS.map(([t, d], i) => (
            <Rise key={t} delay={(i % 2) * 0.06} className="rule border-t pt-6">
              <div className="mono mb-4 text-signal">0{i + 1}</div>
              <h3 className="display text-[clamp(40px,4vw,64px)]">{t}</h3>
              <p className="mt-3 max-w-[480px] text-[16px] leading-relaxed text-mute">{d}</p>
            </Rise>
          ))}
        </div>
      </section>

      <section id="volunteer" className="gutter bg-signal py-[clamp(96px,12vw,180px)]">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <h2 className="display text-[clamp(64px,10vw,180px)]">
            Teach <span className="serif normal-case italic tracking-[-0.03em]">what you</span> wish you’d learned.
          </h2>
          <div>
            <p className="max-w-[460px] text-[18px] leading-relaxed">
              No finance degree required. If you can hold a room and care about young people, we will train you for the rest.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Pill href="/programs#summer" variant="ink">Educator program</Pill>
              <Pill href="/chapters#start" variant="ghost">Start a chapter</Pill>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
