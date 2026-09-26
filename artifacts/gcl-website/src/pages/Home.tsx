import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { BiasLab } from '../components/BiasLab';
import { DepartureBoard } from '../components/DepartureBoard';
import { GrowthChart } from '../components/GrowthChart';
import { HorizontalPrograms } from '../components/HorizontalPrograms';
import { InvolveRows } from '../components/InvolveRows';
import { KineticText, Ticker } from '../components/KineticText';
import { Arrow, Counter, EASE, Eyebrow, MaskLines, Pill, Rise, ScrollInk } from '../components/primitives';
import { TeamIndex } from '../components/TeamIndex';
import { Voices } from '../components/Voices';
import { donateHref, site, stats } from '../config/site';
import { chapters } from '../data/chapters';
import { teamMembers } from '../data/team';
import { usePageMeta } from '../hooks/usePageMeta';
import { useIntroDone } from '../lib/intro';

import reelGroup from '../assets/media/reel-group.mp4';
import reelGroupPoster from '../assets/media/reel-group-poster.webp';
import reelClassroom from '../assets/media/reel-classroom.mp4';
import reelClassroomPoster from '../assets/media/reel-classroom-poster.webp';
import reelKid from '../assets/media/reel-kid.mp4';
import reelKidPoster from '../assets/media/reel-kid-poster.webp';
import imgClassroomBack from '../assets/media/classroom-back.webp';
import imgPanorama from '../assets/media/school-panorama-1.webp';
import imgSelfie from '../assets/media/selfie.webp';
import imgKids3 from '../assets/media/school-kids-3.webp';
import imgSpeaker from '../assets/media/speaker.webp';

/* ─── Autoplaying, muted, inline video (never steals focus or audio) ─── */
export function Reel({ src, poster, className = '', label }: { src: string; poster: string; className?: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    if (reduce) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => undefined);
      else v.pause();
    });
    io.observe(v);
    return () => io.disconnect();
  }, [reduce]);
  return <video ref={ref} className={className} src={src} poster={poster} muted loop playsInline preload="metadata" aria-label={label} />;
}

function Hero() {
  const ready = useIntroDone();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);
  const show = ready || reduce;

  const rise = (d: number) => ({
    initial: reduce ? false : ({ y: '105%' } as const),
    animate: show ? { y: '0%' } : undefined,
    transition: { duration: 1.2, ease: EASE, delay: d },
  });

  return (
    <section ref={ref} className="relative flex min-h-[100svh] flex-col overflow-hidden bg-paper pt-[96px]">
      <motion.div style={reduce ? undefined : { y, opacity: fade }} className="gutter flex flex-1 flex-col">
        <div className="mono flex flex-wrap items-center justify-between gap-2 py-4">
          <span className="flex items-center gap-3">
            <span className="text-signal">§ 00</span>
            <span className="h-px w-8 bg-current opacity-40" />
            <span>{site.name}</span>
          </span>
          <span className="hidden sm:inline">Asia&apos;s largest youth-led financial literacy non-profit</span>
        </div>

        <h1 className="display mt-2 flex flex-1 flex-col justify-center text-[19.5vw] sm:text-[clamp(52px,17.2vw,340px)]" aria-label="Money is a behavior.">
          <span className="flex items-center justify-start gap-[0.16em] overflow-hidden pb-[0.02em] sm:justify-between sm:gap-[0.08em]">
            <motion.span className="block" {...rise(0.05)}>
              <KineticText text="MONEY" />
            </motion.span>
            <motion.span
              className="relative hidden h-[0.66em] flex-1 overflow-hidden rounded-full bg-ink sm:block"
              initial={reduce ? false : { clipPath: 'inset(0 50% 0 50% round 999px)' }}
              animate={show ? { clipPath: 'inset(0 0% 0 0% round 999px)' } : undefined}
              transition={{ duration: 1.4, ease: EASE, delay: 0.35 }}
              data-cursor="Play"
            >
              <Reel src={reelGroup} poster={reelGroupPoster} label="GCL students celebrating after a workshop" className="absolute inset-0 h-full w-full object-cover" />
            </motion.span>
            <motion.span className="block" {...rise(0.12)}>
              <KineticText text="IS" />
            </motion.span>
          </span>
          <span className="flex items-baseline justify-start gap-[0.1em] overflow-hidden pb-[0.04em] sm:justify-between sm:gap-0">
            <motion.span className="serif block pr-[0.1em] text-[0.62em] normal-case italic leading-none text-signal" {...rise(0.2)}>
              a
            </motion.span>
            <motion.span className="block" {...rise(0.26)}>
              <KineticText text="BEHAVIOR." />
            </motion.span>
          </span>
        </h1>

        <motion.div
          className="relative mt-6 h-[120px] overflow-hidden rounded-full bg-ink sm:hidden"
          initial={reduce ? false : { clipPath: 'inset(0 50% 0 50% round 999px)' }}
          animate={show ? { clipPath: 'inset(0 0% 0 0% round 999px)' } : undefined}
          transition={{ duration: 1.4, ease: EASE, delay: 0.35 }}
        >
          <Reel src={reelGroup} poster={reelGroupPoster} label="GCL students celebrating after a workshop" className="absolute inset-0 h-full w-full object-cover" />
        </motion.div>

        <div className="grid grid-cols-1 gap-8 pb-10 pt-8 md:grid-cols-[1fr_1.3fr_1fr] md:items-end">
          <motion.div className="mono hidden space-y-1.5 text-mute md:block" initial={reduce ? false : { opacity: 0 }} animate={show ? { opacity: 1 } : undefined} transition={{ delay: 0.9 }}>
            <div>World&apos;s first behavioral financial literacy non-profit</div>
            <div>Formerly {site.formerly}</div>
            <div className="text-ink">Est. {site.founded} — {site.hq.city}</div>
          </motion.div>
          <motion.p
            className="max-w-[520px] text-[clamp(17px,1.5vw,21px)] leading-[1.45]"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={show ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1, ease: EASE, delay: 0.75 }}
          >
            Top-tier financial education used to be reserved for the lucky few. <span className="serif text-[1.2em] italic">Not anymore.</span> We teach the psychology of money to the young people the financial system forgot — free, youth-led, in {stats.countries.value}+ countries.
          </motion.p>
          <motion.div
            className="flex flex-wrap gap-3 md:justify-end"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={show ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1, ease: EASE, delay: 0.85 }}
          >
            <Pill href={donateHref} variant="signal">Donate</Pill>
            <Pill href="/get-involved" variant="ghost">Get involved</Pill>
          </motion.div>
        </div>
      </motion.div>

      <Ticker
        className="relative z-10"
        items={[
          { sym: 'GCL:YOUTH', val: `${stats.youth.value.toLocaleString('en-US')}+`, up: true, note: 'taught' },
          { sym: 'GCL:CHPT', val: stats.chapters.value, up: true, note: 'chapters' },
          { sym: 'GCL:CTRY', val: `${stats.countries.value}+`, up: true, note: 'countries' },
          { sym: 'GCL:WKSP', val: `${stats.workshops.value}+`, up: true, note: 'workshops' },
          { sym: 'GCL:CMPL', val: `${stats.completion.value}%`, up: true, note: 'completion' },
          { sym: 'COST/STUDENT', val: '$0.00', up: false, note: 'always' },
          { sym: 'SUMMER26', val: 'JUL 20 – AUG 20', note: 'cohort' },
          { sym: 'HQ', val: site.hq.city.toUpperCase(), note: site.hq.utc },
        ]}
      />
    </section>
  );
}

function Manifesto() {
  return (
    <section className="gutter bg-paper py-[clamp(96px,16vw,220px)]">
      <Eyebrow index="01" className="mb-10">
        Manifesto
      </Eyebrow>
      <ScrollInk
        className="max-w-[1500px] text-[clamp(30px,4.4vw,74px)] font-[560] leading-[1.06] tracking-[-0.025em]"
        text="Financial literacy programs fail because they teach math, not behavior. We teach decisions under scarcity, the pull of the present, and the psychological traps that keep whole communities in debt — to the young people the system forgot."
        accent={['behavior', 'forgot']}
      />
      <div className="mt-16 grid gap-10 md:grid-cols-3">
        {[
          ['Behavior first', 'Budgets fail when brains are ignored. We start with biases, habits and emotions — then the numbers make sense.'],
          ['Youth-led, peer-taught', 'Our educators are the same age as the people in the room. That is why they listen, and why it sticks.'],
          ['Free, forever', 'No fees, no gatekeepers, no upsell. Financial dignity is not a premium feature.'],
        ].map(([t, d], i) => (
          <Rise key={t} delay={i * 0.08} className="rule border-t pt-5">
            <div className="mono mb-3 text-signal">0{i + 1}</div>
            <h3 className="display text-[44px]">{t}</h3>
            <p className="mt-3 max-w-[380px] text-[16px] leading-relaxed text-mute">{d}</p>
          </Rise>
        ))}
      </div>
    </section>
  );
}

const chaptersByYear = [2021, 2022, 2023, 2024].map((y) => chapters.filter((c) => c.founded <= y).length);

const LEDGER: { k: { value: number; suffix: string; label: string }; note: string; spark?: number[] }[] = [
  { k: stats.youth, note: `Across ${stats.countries.value}+ countries` },
  { k: stats.chapters, note: 'Locally led, globally connected', spark: [...chaptersByYear, stats.chapters.value] },
  { k: stats.workshops, note: 'In classrooms, youth centers and online' },
  { k: stats.completion, note: 'Of students finish what they start' },
];

function Spark({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${30 - ((v - min) / (max - min || 1)) * 26 - 2}`).join(' ');
  return (
    <svg viewBox="0 0 100 30" className="h-8 w-28" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function Ledger() {
  return (
    <section className="gutter bg-paper pb-[clamp(80px,12vw,160px)]">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Eyebrow index="02" className="mb-6">
            The ledger
          </Eyebrow>
          <MaskLines as="h2" className="display text-[clamp(64px,9vw,160px)]" lines={['Impact,', <span key="b">on the <span className="serif normal-case italic tracking-[-0.03em] text-signal">record.</span></span>]} />
        </div>
        <p className="mono max-w-[280px] text-mute">Figures reported by GCL chapters. Updated {new Date().getFullYear()}.</p>
      </div>
      <div className="mt-14">
        {LEDGER.map(({ k, note, spark }, i) => (
          <Rise key={k.label} delay={i * 0.05}>
            <div className="group rule grid grid-cols-[1fr_auto] items-end gap-x-6 gap-y-2 border-t py-6 transition-colors duration-500 hover:bg-ink hover:text-paper md:grid-cols-[60px_1.1fr_1fr_auto] md:px-4">
              <span className="mono hidden text-mute group-hover:text-paper/50 md:block">0{i + 1}</span>
              <div>
                <div className="text-[20px] font-[600]">{k.label}</div>
                <div className="mono mt-1 text-mute group-hover:text-paper/50">{note}</div>
              </div>
              <div className="hidden text-signal md:block">
                {spark ? <Spark data={spark} /> : <span className="mono">▲ Growing</span>}
              </div>
              <div className="display col-span-2 text-right text-[clamp(80px,12vw,200px)] leading-[0.8] md:col-span-1">
                <Counter value={k.value} suffix={k.suffix} />
              </div>
            </div>
          </Rise>
        ))}
        <div className="rule grid grid-cols-[1fr_auto] items-end gap-6 border-y bg-signal px-4 py-6 md:grid-cols-[60px_1.1fr_1fr_auto]">
          <span className="mono hidden md:block">05</span>
          <div>
            <div className="text-[20px] font-[600]">{stats.cost.label}</div>
            <div className="mono mt-1">Always. Everywhere.</div>
          </div>
          <span className="hidden md:block" />
          <div className="display text-right text-[clamp(80px,12vw,200px)] leading-[0.8]">$0.00</div>
        </div>
      </div>
    </section>
  );
}

function FieldNotes() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const a = useTransform(scrollYProgress, [0, 1], ['6%', '-10%']);
  const b = useTransform(scrollYProgress, [0, 1], ['-4%', '4%']);
  const c = useTransform(scrollYProgress, [0, 1], ['12%', '-16%']);
  const cols: { y: typeof a; items: { kind: 'img' | 'vid'; src: string; poster?: string; alt: string; cap: string; ratio: string }[] }[] = [
    { y: a, items: [
      { kind: 'img', src: imgSpeaker, alt: 'A GCL educator teaching five types of income', cap: 'Workshop · Tashkent · Jul 2025', ratio: 'aspect-[3/4]' },
      { kind: 'img', src: imgPanorama, alt: 'A full classroom during a school partnership session', cap: 'School partnership · Nov 2025', ratio: 'aspect-[4/3]' },
    ] },
    { y: b, items: [
      { kind: 'vid', src: reelClassroom, poster: reelClassroomPoster, alt: 'Students listening during a GCL session', cap: 'Live session · Jul 2025', ratio: 'aspect-[9/14]' },
      { kind: 'img', src: imgSelfie, alt: 'GCL volunteers taking a group selfie', cap: 'The crew · Jan 2026', ratio: 'aspect-[4/3]' },
    ] },
    { y: c, items: [
      { kind: 'img', src: imgKids3, alt: 'Secondary school students working through GCL materials', cap: 'Classroom · May 2026', ratio: 'aspect-[4/3]' },
      { kind: 'vid', src: reelKid, poster: reelKidPoster, alt: 'A young student following an online session with headphones', cap: 'Every learner counts · 2025', ratio: 'aspect-[9/14]' },
      { kind: 'img', src: imgClassroomBack, alt: 'A GCL workshop seen from the back of the room', cap: 'Tashkent · Jul 2025', ratio: 'aspect-[3/4]' },
    ] },
  ];
  return (
    <section ref={ref} className="on-dark overflow-hidden bg-ink py-[clamp(96px,12vw,180px)] text-paper">
      <div className="gutter mb-16 flex flex-wrap items-end justify-between gap-8">
        <div>
          <Eyebrow index="07" className="mb-6 text-paper/70">
            Field notes
          </Eyebrow>
          <MaskLines as="h2" className="display text-[clamp(64px,9vw,160px)]" lines={['Not stock', <span key="p"><span className="serif normal-case italic tracking-[-0.03em] text-signal">photos.</span> Our rooms.</span>]} />
        </div>
        <p className="max-w-[360px] text-[17px] leading-relaxed text-paper/65">Every image on this site is a real GCL session — real students, real volunteers, real classrooms.</p>
      </div>
      <div className="gutter grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
        {cols.map((col, ci) => (
          <motion.div key={ci} style={reduce ? undefined : { y: col.y }} className={`flex flex-col gap-4 md:gap-6 ${ci === 2 ? 'hidden md:flex' : ''}`}>
            {col.items.map((it) => (
              <figure key={it.cap}>
                <div className={`relative overflow-hidden rounded-[6px] bg-ink-2 ${it.ratio}`}>
                  {it.kind === 'img' ? (
                    <img src={it.src} alt={it.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover grayscale-[0.35] transition duration-700 hover:scale-[1.03] hover:grayscale-0" />
                  ) : (
                    <Reel src={it.src} poster={it.poster!} label={it.alt} className="absolute inset-0 h-full w-full object-cover" />
                  )}
                </div>
                <figcaption className="mono mt-2 text-paper/50">{it.cap}</figcaption>
              </figure>
            ))}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function Home() {
  usePageMeta('');
  const flagship = chapters.filter((c) => c.status !== 'dormant').slice(0, 8);

  return (
    <>
      <Hero />
      <Manifesto />
      <Ledger />
      <GrowthChart />
      <HorizontalPrograms />

      <section className="gutter bg-paper py-[clamp(96px,12vw,180px)]">
        <BiasLab />
      </section>

      <section className="gutter bg-paper-2 py-[clamp(96px,12vw,180px)]">
        <div className="mb-14 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <Eyebrow index="06" className="mb-6">
              The network
            </Eyebrow>
            <MaskLines as="h2" className="display text-[clamp(64px,9vw,160px)]" lines={[`${stats.chapters.value} chapters.`, <span key="o">One <span className="serif normal-case italic tracking-[-0.03em] text-signal">league.</span></span>]} />
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-[440px] text-[17px] leading-relaxed text-mute">
              From Tashkent to Bogotá, every chapter is founded and run by young people in their own city — locally led, globally connected.
            </p>
            <Link href="/chapters" className="group mt-6 inline-flex items-center gap-3 text-[14px] font-[650] uppercase tracking-[0.08em]">
              <span className="link-sweep">See every chapter on the globe</span>
              <Arrow className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
            </Link>
          </div>
        </div>
        <DepartureBoard rows={flagship} />
      </section>

      <FieldNotes />

      <section className="gutter bg-paper py-[clamp(96px,12vw,180px)]">
        <Voices />
      </section>

      <section className="gutter bg-paper pb-[clamp(96px,12vw,180px)]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow index="09" className="mb-6">
              The people
            </Eyebrow>
            <MaskLines as="h2" className="display text-[clamp(64px,9vw,160px)]" lines={['Run by', <span key="y"><span className="serif normal-case italic tracking-[-0.03em] text-signal">young</span> people.</span>]} />
          </div>
          <Pill href="/team" variant="ghost">Meet the full team</Pill>
        </div>
        <TeamIndex members={teamMembers.slice(0, 5)} />
      </section>

      <section className="gutter bg-paper pb-[clamp(96px,12vw,180px)]" id="involved">
        <Eyebrow index="10" className="mb-8">
          Get involved — four ways in
        </Eyebrow>
        <InvolveRows />
      </section>
    </>
  );
}

export default Home;
