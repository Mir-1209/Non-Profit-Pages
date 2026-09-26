import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { useState } from 'react';
import type { TeamMember } from '../data/team';
import { mailto } from '../config/site';

/** Typographic roster. Hovering a name floats a monogram card at the cursor. */
export function TeamIndex({ members, showBio = false }: { members: TeamMember[]; showBio?: boolean }) {
  const [hover, setHover] = useState<TeamMember | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28 });
  const sy = useSpring(y, { stiffness: 260, damping: 28 });

  return (
    <div
      className="relative"
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return;
        x.set(e.clientX);
        y.set(e.clientY);
      }}
      onPointerLeave={() => setHover(null)}
    >
      <ul className="rule border-t">
        {members.map((m, i) => {
          const expanded = open === m.id;
          return (
            <li key={m.id} className="rule border-b">
              <button
                type="button"
                onMouseEnter={() => setHover(m)}
                onClick={() => setOpen(expanded ? null : m.id)}
                aria-expanded={expanded}
                className="group grid w-full grid-cols-[40px_1fr_auto] items-baseline gap-4 py-5 text-left md:grid-cols-[60px_1.3fr_1fr_0.8fr] md:py-6"
              >
                <span className="mono text-mute">{String(i + 1).padStart(2, '0')}</span>
                <span className="display text-[clamp(40px,5.4vw,88px)] transition-[color,font-stretch] duration-500 group-hover:text-signal md:group-hover:[font-stretch:90%]">
                  {m.name}
                </span>
                <span className="hidden text-[16px] md:block">{m.role}</span>
                <span className="mono text-right text-mute">
                  <span className="hidden md:inline">{m.location}</span>
                  <span className="md:hidden">{expanded ? '−' : '+'}</span>
                </span>
              </button>
              <AnimatePresence initial={false}>
                {(expanded || showBio) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-4 pb-8 md:grid-cols-[60px_1.3fr_1fr_0.8fr]">
                      <span />
                      <p className="max-w-[560px] text-[16px] leading-relaxed text-mute">{m.bio}</p>
                      <div className="text-[15px]">
                        <div className="md:hidden">{m.role}</div>
                        <div className="mono mt-1 text-mute md:hidden">{m.location}</div>
                      </div>
                      <div className="flex gap-4 md:justify-end">
                        {m.email && (
                          <a className="link-sweep mono" href={mailto(m.email)}>
                            Email ↗
                          </a>
                        )}
                        {m.linkedin && m.linkedin !== '#' && (
                          <a className="link-sweep mono" href={m.linkedin} target="_blank" rel="noopener noreferrer">
                            LinkedIn ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>

      {/* Floating card (desktop pointer only) */}
      <AnimatePresence>
        {hover && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed left-0 top-0 z-40 hidden [@media(hover:hover)]:block"
            style={{ x: sx, y: sy }}
            initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: -3 }}
            exit={{ opacity: 0, scale: 0.6, rotate: 6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            <div className="ml-8 -mt-40 w-[240px] overflow-hidden rounded-[24px] bg-ink text-paper shadow-2xl">
              <div className="relative grid h-[220px] place-items-center overflow-hidden" style={{ background: 'linear-gradient(140deg,#3aa9ff 0%,#8ad3ff 100%)' }}>
                <span className="display text-[150px] leading-none text-ink">{hover.initials}</span>
              </div>
              <div className="p-4">
                <div className="mono text-signal">{hover.department}</div>
                <div className="mt-1 text-[15px] font-[650]">{hover.role}</div>
                <div className="mono mt-2 text-paper/50">{hover.location}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
