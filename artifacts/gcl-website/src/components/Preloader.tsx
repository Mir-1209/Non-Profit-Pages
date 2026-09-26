import { animate, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import logoImg from '../assets/media/gcl-logo.webp';
import { EASE_IN_OUT } from './primitives';

const KEY = 'gcl:intro-seen';

function seen() {
  try {
    return sessionStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

/** A one-per-session intro: principal × (1 + r)^t, counting to 100. */
export function Preloader({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const [skip] = useState(() => reduce || seen());
  const [n, setN] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (skip) {
      onDone();
      return;
    }
    try {
      sessionStorage.setItem(KEY, '1');
    } catch {
      /* storage may be unavailable — the intro simply plays again */
    }
    // An exponential curve — slow start, fast finish — like compounding.
    const controls = animate(0, 1, {
      duration: 1.4,
      ease: (t) => (Math.pow(2.6, t * 4) - 1) / (Math.pow(2.6, 4) - 1),
      onUpdate: (v) => setN(Math.round(v * 100)),
      onComplete: () => {
        setLeaving(true);
        onDone();
      },
    });
    return () => controls.stop();
  }, [skip, onDone]);

  if (skip) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="glow-dark fixed inset-0 z-[100] flex flex-col justify-between p-[var(--gutter)] text-paper"
      initial={{ clipPath: 'inset(0 0 0 0)' }}
      animate={leaving ? { clipPath: 'inset(0 0 100% 0)' } : undefined}
      transition={{ duration: 1, ease: EASE_IN_OUT, delay: 0.15 }}
    >
      <div className="mono flex justify-between text-mute-dark">
        <span>Global Capital League</span>
        <span>A = P(1 + r)ⁿ</span>
      </div>
      <div className="flex items-end justify-between gap-6">
        <motion.img
          src={logoImg}
          alt=""
          className="h-auto w-[180px] sm:w-[260px]"
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.9 }}
        />
        <div className="display tabular text-[clamp(110px,24vw,360px)] leading-[0.8] text-signal-2 text-glow">
          {String(n).padStart(3, '0')}
        </div>
      </div>
      <div className="relative mt-6 h-px w-full bg-paper/15">
        <div className="absolute inset-y-0 left-0 bg-signal" style={{ width: `${n}%` }} />
      </div>
      <div className="mono mt-3 flex justify-between text-mute-dark">
        <span>Compounding knowledge</span>
        <span>Since 2021</span>
      </div>
    </motion.div>
  );
}
