import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { stories } from '../data/stories';
import { EASE } from './primitives';

/** Big serif testimonials that advance on their own while in view. */
export function Voices() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-20% 0px' });
  const reduce = useReducedMotion();
  const s = stories[i];

  useEffect(() => {
    if (!inView || paused || reduce) return;
    const t = window.setTimeout(() => setI((n) => (n + 1) % stories.length), 8000);
    return () => window.clearTimeout(t);
  }, [i, inView, paused, reduce]);

  const go = (d: number) => setI((n) => (n + d + stories.length) % stories.length);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="flex items-center justify-between">
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-signal/15 px-3.5 py-1.5 text-[13px] font-[620] tracking-[-0.005em]">
          <span className="h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_10px_rgba(58,169,255,0.9)]" />
          <span>Voices from the league</span>
        </div>
        <div className="mono tabular">
          {String(i + 1).padStart(2, '0')} <span className="opacity-40">/ {String(stories.length).padStart(2, '0')}</span>
        </div>
      </div>

      <figure className="mt-10 min-h-[440px] md:min-h-[380px]" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div key={s.id} initial="hidden" animate="show" exit="exit">
            <blockquote className="serif text-[clamp(32px,4.6vw,76px)] leading-[1.02] tracking-[-0.02em]">
              <span className="text-signal">“</span>
              {s.quote.split(' ').map((w, k) => (
                <span key={k} className="inline-block overflow-hidden align-top">
                  <motion.span
                    className="inline-block"
                    variants={{
                      hidden: { y: '110%' },
                      show: { y: '0%', transition: { duration: 0.8, ease: EASE, delay: k * 0.012 } },
                      exit: { y: '-110%', transition: { duration: 0.4, ease: EASE, delay: k * 0.004 } },
                    }}
                  >
                    {w}&nbsp;
                  </motion.span>
                </span>
              ))}
              <span className="text-signal">”</span>
            </blockquote>
            <motion.figcaption
              className="mt-10 flex flex-wrap items-baseline gap-x-6 gap-y-1"
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: 0.5 } }, exit: { opacity: 0 } }}
            >
              <span className="display text-[32px]">{s.name}</span>
              <span className="mono text-mute">
                {s.role} — {s.location}
              </span>
            </motion.figcaption>
          </motion.div>
        </AnimatePresence>
      </figure>

      <div className="mt-8 flex items-center gap-3">
        <button type="button" onClick={() => go(-1)} aria-label="Previous story" className="grid h-14 w-14 place-items-center rounded-full border border-ink/20 text-[20px] transition-colors hover:bg-ink hover:text-paper">
          ←
        </button>
        <button type="button" onClick={() => go(1)} aria-label="Next story" className="grid h-14 w-14 place-items-center rounded-full border border-ink/20 text-[20px] transition-colors hover:bg-ink hover:text-paper">
          →
        </button>
        <div className="ml-4 flex flex-1 gap-1.5">
          {stories.map((st, k) => (
            <button key={st.id} type="button" onClick={() => setI(k)} aria-label={`Story ${k + 1}`} className="relative h-[3px] flex-1 overflow-hidden bg-ink/15">
              {k === i && (
                <motion.span
                  className="absolute inset-0 origin-left bg-signal"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: paused || reduce ? 1 : 1 }}
                  transition={{ duration: paused || reduce ? 0.3 : 8, ease: 'linear' }}
                />
              )}
              {k < i && <span className="absolute inset-0 bg-ink/60" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
