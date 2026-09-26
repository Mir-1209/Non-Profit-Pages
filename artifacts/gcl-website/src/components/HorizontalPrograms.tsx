import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useLayoutEffect, useRef, useState } from 'react';
import { programs } from '../data/programs';
import { Arrow } from './primitives';
import { Link } from 'wouter';

/** A pinned section that scrolls sideways through the four programs. */
export function HorizontalPrograms() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [desktop, setDesktop] = useState(true);
  const reduce = useReducedMotion();

  useLayoutEffect(() => {
    const measure = () => {
      const isDesktop = window.matchMedia('(min-width: 900px)').matches;
      setDesktop(isDesktop);
      if (track.current) setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const pinned = desktop && !reduce;
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 32, restDelta: 0.0005 });
  const x = useTransform(smooth, [0, 1], [0, -distance]);

  return (
    <section
      ref={section}
      className="on-dark relative bg-ink text-paper"
      style={{ height: pinned ? `calc(100vh + ${distance}px)` : 'auto' }}
      aria-label="Programs"
    >
      <div className={pinned ? 'sticky top-0 flex h-screen items-center overflow-hidden' : 'py-24'}>
        <motion.div ref={track} className={pinned ? 'flex h-[78vh] items-stretch gap-6 pl-[var(--gutter)] pr-[var(--gutter)]' : 'gutter flex flex-col gap-6'} style={pinned ? { x } : undefined}>
          {/* Intro panel */}
          <div className={`flex shrink-0 flex-col justify-between ${pinned ? 'w-[38vw] pr-10' : ''}`}>
            <div className="mono flex items-center gap-3 text-paper/70">
              <span className="text-signal">§ 04</span>
              <span className="h-px w-8 bg-current opacity-40" />
              <span>What we do</span>
            </div>
            <h2 className="display my-8 text-[clamp(72px,9vw,168px)]">
              Four
              <br />
              <span className="serif text-signal normal-case italic tracking-[-0.03em]">levers</span>
              <br />
              we pull.
            </h2>
            <p className="max-w-[420px] text-[17px] leading-relaxed text-paper/65">
              No lectures on compound interest from someone who has never been broke. Our programs are built by young people, taught by young people, and designed around how people actually decide.
            </p>
            {pinned && <div className="mono mt-8 flex items-center gap-3 text-paper/50">Scroll <Arrow dir="e" className="h-3 w-3" /></div>}
          </div>

          {programs.map((p) => (
            <article
              key={p.id}
              className={`group relative shrink-0 overflow-hidden rounded-[10px] bg-ink-2 ${pinned ? 'w-[min(62vw,860px)]' : 'min-h-[520px] w-full'}`}
            >
              <img src={p.image} alt={p.imageAlt} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-60 grayscale transition-all duration-[1.2s] ease-out-expo group-hover:scale-[1.04] group-hover:opacity-80 group-hover:grayscale-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
              <div className="relative flex h-full flex-col justify-between p-6 sm:p-10">
                <div className="flex items-start justify-between">
                  <span className="display text-[clamp(90px,11vw,180px)] text-paper/90 leading-[0.75]">{p.num}</span>
                  <span className="mono rounded-full border border-paper/25 px-3 py-1.5 backdrop-blur-sm">{p.where}</span>
                </div>
                <div className="max-w-[560px]">
                  <h3 className="display text-[clamp(44px,5vw,84px)]">{p.title}</h3>
                  <p className="mt-4 text-[16px] leading-relaxed text-paper/75">{p.summary}</p>
                  <ul className="mono mt-6 flex flex-wrap gap-2">
                    {p.facts.map((f) => (
                      <li key={f} className="rounded-full bg-paper/10 px-3 py-1.5 backdrop-blur-sm">{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}

          {/* Outro panel */}
          <div className={`flex shrink-0 flex-col items-start justify-center ${pinned ? 'w-[34vw] pl-6' : 'py-10'}`}>
            <p className="serif text-[clamp(34px,3.4vw,56px)] leading-[1.02] italic">All of it free. For every student. Always.</p>
            <Link href="/programs" className="group mt-8 inline-flex items-center gap-4 text-[14px] font-[650] uppercase tracking-[0.08em]">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-signal text-ink transition-transform duration-500 group-hover:rotate-45">
                <Arrow className="h-5 w-5" />
              </span>
              <span className="link-sweep">Explore the programs</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
