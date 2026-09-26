import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { EASE } from './primitives';

/** Shared opener for inner pages: a stacked giant title and a short standfirst. */
export function PageHero({
  label,
  lines,
  intro,
  aside,
  dark = false,
}: {
  label: string;
  lines: ReactNode[];
  intro: ReactNode;
  aside?: ReactNode;
  dark?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <section className={`gutter relative overflow-hidden pb-16 pt-[128px] md:pb-24 md:pt-[150px] ${dark ? 'on-dark glow-dark text-paper' : 'glow-bg'}`}>
      <div className="mb-8 inline-flex w-fit items-center gap-2 rounded-full bg-signal/15 px-3.5 py-1.5 text-[13px] font-[620] tracking-[-0.005em]">
        <span className="h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_10px_rgba(58,169,255,0.9)]" />
        <span>{label}</span>
      </div>
      <h1 className="display text-[clamp(60px,11vw,210px)]">
        {lines.map((line, i) => (
          <span key={i} className="block overflow-hidden pb-[0.03em]">
            <motion.span
              className="block"
              initial={reduce ? false : { y: '105%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.45 + i * 0.08 }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </h1>
      <div className="mt-12 grid gap-10 md:grid-cols-[1fr_1fr] md:items-end">
        <motion.div
          className={`max-w-[620px] text-[clamp(18px,1.6vw,23px)] leading-[1.45] ${dark ? 'text-paper/80' : ''}`}
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.8 }}
        >
          {intro}
        </motion.div>
        {aside && (
          <motion.div initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="md:justify-self-end">
            {aside}
          </motion.div>
        )}
      </div>
    </section>
  );
}

export function Accent({ children }: { children: ReactNode }) {
  return <span className="serif normal-case italic tracking-[-0.03em] text-signal">{children}</span>;
}
