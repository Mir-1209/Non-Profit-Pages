import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Accent, PageHero } from '../components/PageHero';
import { Eyebrow, MaskLines, Pill, RevealImage, Rise } from '../components/primitives';
import { applyHref, donateHref, stats, summerPhase, summerProgram } from '../config/site';
import { courses } from '../data/courses';
import { programs } from '../data/programs';
import { usePageMeta } from '../hooks/usePageMeta';

const STEPS = [
  { t: 'Decide', d: 'Every session opens with a real choice — spend or save, borrow or wait. No right answers yet.' },
  { t: 'Unpack', d: 'We name the bias behind the choice and the research that explains it. Shame-free, always.' },
  { t: 'Design', d: 'Students build a tiny system — an automatic rule, a friction, a nudge — that works with their brain.' },
  { t: 'Teach', d: 'The best way to learn it is to teach it. Graduates co-teach the next session in their community.' },
];

function Curriculum() {
  const [open, setOpen] = useState<string | null>(courses[0]?.slug ?? null);
  return (
    <ul className="rule border-t">
      {courses.map((c, i) => {
        const isOpen = open === c.slug;
        return (
          <li key={c.slug} className="rule border-b">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : c.slug)}
              aria-expanded={isOpen}
              className="group grid w-full grid-cols-[36px_1fr_auto] items-center gap-4 py-6 text-left md:grid-cols-[60px_1fr_170px_210px_48px]"
            >
              <span className="mono text-mute">C.{String(i + 1).padStart(2, '0')}</span>
              <span className="display text-[clamp(34px,4.2vw,68px)] transition-colors group-hover:text-signal">{c.title}</span>
              <span className="mono hidden text-mute md:block">{c.tag}</span>
              <span className="mono hidden text-mute md:block">{c.level} · {c.modules.length} modules</span>
              <span className={`grid h-10 w-10 place-items-center justify-self-end rounded-full border border-ink/25 text-[18px] transition-transform duration-500 ${isOpen ? 'rotate-45 bg-ink text-paper' : ''}`}>+</span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                  <ol className="grid gap-x-10 gap-y-5 pb-10 md:grid-cols-2 md:pl-[76px]">
                    {c.modules.map((m, k) => (
                      <li key={m.title} className="grid grid-cols-[40px_1fr] gap-2">
                        <span className="mono pt-1 text-signal">{String(k + 1).padStart(2, '0')}</span>
                        <div>
                          <div className="text-[17px] font-[620]">{m.title.replace(/^Module \d+:\s*/, '')}</div>
                          <p className="mt-1 text-[15px] leading-relaxed text-mute">{m.description}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}

export default function Programs() {
  usePageMeta('Programs', 'Live workshops, an open behavioral-finance curriculum, school partnerships and a train-the-trainer pathway — all free for students.');
  const phase = summerPhase();

  return (
    <>
      <PageHero
        index="02"
        label="Programs"
        lines={['Less', <>lecture. <Accent>More</Accent></>, 'leverage.']}
        intro={<>Four programs, one method: start with the decision, name the bias, design a better system — then teach it to someone else. Everything is free for students, everywhere.</>}
        aside={<Pill href="#summer" variant="ink">{phase === 'complete' ? 'Next cohort' : "Summer '26"}</Pill>}
      />

      {/* Programs, alternating */}
      <section className="gutter space-y-[clamp(80px,10vw,160px)] pb-[clamp(80px,10vw,160px)]">
        {programs.map((p, i) => (
          <article key={p.id} id={p.id} className={`grid items-center gap-10 md:grid-cols-2 ${i % 2 ? 'md:[&>*:first-child]:order-2' : ''}`}>
            <RevealImage src={p.image} alt={p.imageAlt} className="aspect-[4/5] rounded-[8px] md:aspect-[5/6]" />
            <div>
              <div className="flex items-baseline gap-5">
                <span className="display text-[clamp(90px,10vw,170px)] leading-[0.75] text-signal">{p.num}</span>
                <span className="mono text-mute">{p.where}</span>
              </div>
              <MaskLines as="h2" className="display mt-6 text-[clamp(56px,6.4vw,112px)]" lines={[p.title]} />
              <p className="mt-6 max-w-[540px] text-[clamp(18px,1.4vw,21px)] leading-[1.5]">{p.summary}</p>
              <p className="mt-4 max-w-[540px] text-[16px] leading-relaxed text-mute">{p.detail}</p>
              <ul className="mono mt-8 flex flex-wrap gap-2">
                {p.facts.map((f) => (
                  <li key={f} className="rounded-full border border-ink/20 px-3 py-1.5">{f}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>

      {/* Method */}
      <section className="on-dark bg-ink py-[clamp(96px,12vw,180px)] text-paper">
        <div className="gutter">
          <Eyebrow index="02.1" className="mb-6 text-paper/70">The GCL method</Eyebrow>
          <MaskLines as="h2" className="display text-[clamp(64px,9vw,160px)]" lines={['Four moves,', <>every <Accent>session.</Accent></>]} />
          <ol className="mt-16 grid gap-px overflow-hidden rounded-[8px] bg-paper/15 md:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.t} className="group relative bg-ink p-8 transition-colors duration-500 hover:bg-signal hover:text-ink">
                <div className="mono text-signal group-hover:text-ink">Step 0{i + 1}</div>
                <div className="display mt-16 text-[64px]">{s.t}</div>
                <p className="mt-4 text-[16px] leading-relaxed text-paper/65 group-hover:text-ink/80">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Curriculum */}
      <section className="gutter py-[clamp(96px,12vw,180px)]" id="curriculum">
        <div className="mb-14 grid gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <Eyebrow index="02.2" className="mb-6">Open curriculum</Eyebrow>
            <MaskLines as="h2" className="display text-[clamp(64px,9vw,160px)]" lines={['The', <><Accent>syllabus.</Accent></>]} />
          </div>
          <p className="max-w-[460px] text-[17px] leading-relaxed text-mute lg:justify-self-end">
            {courses.length} courses built on behavioral economics and learning science, taught live by chapters around the world. Educators and partner schools can request the full teaching kit.
          </p>
        </div>
        <Curriculum />
      </section>

      {/* Summer program */}
      <section id="summer" className="gutter bg-signal py-[clamp(96px,12vw,180px)]">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="mono mb-6 flex items-center gap-3">
              <span>§ 02.3</span>
              <span className="h-px w-8 bg-current opacity-40" />
              <span>{summerProgram.name} · {summerProgram.dates}</span>
            </div>
            <h2 className="display text-[clamp(72px,11vw,200px)]">
              {phase === 'complete' ? (
                <>Summer ’26 <span className="serif normal-case italic tracking-[-0.03em]">is a wrap.</span></>
              ) : (
                <>Teach. <span className="serif normal-case italic tracking-[-0.03em]">Inspire.</span> Leave a mark.</>
              )}
            </h2>
            <p className="mt-8 max-w-[620px] text-[clamp(18px,1.5vw,22px)] leading-[1.5]">
              {phase === 'complete'
                ? `Thank you to every educator who spent a month teaching financial literacy to communities that never had access to it. The next cohort is being planned now — register your interest and be first to hear when applications open.`
                : `A role that goes beyond a typical internship. For one month you'll run workshops, build curriculum, and join a network of changemakers spanning ${stats.countries.value}+ countries — teaching the psychology of money to youth who have never had access to it.`}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Pill href={applyHref} variant="ink">{phase === 'complete' ? 'Register interest' : 'Apply now'}</Pill>
              <Pill href={donateHref} variant="ghost">Sponsor an educator</Pill>
            </div>
          </div>
          <div className="grid content-start gap-px overflow-hidden rounded-[8px] bg-ink/20">
            {[
              ['What you do', 'Run workshops, build curriculum and mentor young people in your community or with a partner chapter.'],
              ['Who it is for', 'High-school, undergraduate and graduate students who love teaching — no finance degree required.'],
              ['Commitment', 'One month, 10–20+ hours a week, remote or local. Travel support is discussed case by case.'],
              ['What you get', 'Training, a certificate of service, a global network — and the rare feeling of changing how someone sees money.'],
            ].map(([k, v]) => (
              <Rise key={k} className="bg-signal p-6" y={12}>
                <div className="mono mb-2">{k}</div>
                <p className="text-[17px] leading-relaxed">{v}</p>
              </Rise>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
