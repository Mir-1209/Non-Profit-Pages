import { useRef, useId } from 'react';
import { motion, useInView } from 'framer-motion';

type ColorKey = 'dark' | 'alt' | 'white';

const C: Record<ColorKey, string> = {
  dark:  '#0b0817',
  alt:   '#f7f6fd',
  white: '#ffffff',
};

const W      = 1440;
const H      = 60;
const TEETH  = 18;

function buildPoints(flip: boolean): [number, number][] {
  const step = W / TEETH;
  const half = step / 2;
  const y0   = flip ? H : 0;
  const y1   = flip ? 0 : H;
  const pts: [number, number][] = [[0, y0]];
  for (let i = 0; i < TEETH; i++) {
    pts.push([i * step + half, y1]);
    pts.push([(i + 1) * step, y0]);
  }
  return pts;
}

function buildPolygon(flip: boolean): string {
  const pts   = buildPoints(flip);
  const close = flip
    ? [[W, 0] as [number, number], [0, 0] as [number, number]]
    : [[W, H] as [number, number], [0, H] as [number, number]];
  return [...pts, ...close].map(([x, y]) => `${x},${y}`).join(' ');
}

function buildPath(flip: boolean): string {
  return buildPoints(flip)
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`)
    .join(' ');
}

interface Props {
  from:  ColorKey;
  to:    ColorKey;
  flip?: boolean;
}

export function SectionDivider({ from, to, flip = false }: Props) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });
  const uid    = useId().replace(/:/g, '');

  return (
    <div
      ref={ref}
      style={{ background: C[to], lineHeight: 0, overflow: 'hidden', display: 'block', marginTop: -1 }}
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        style={{ display: 'block', width: '100%', height: H }}
      >
        <defs>
          <linearGradient id={`zg-${uid}`} x1="0" y1="0" x2={String(W)} y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#8b5cf6" />
            <stop offset="40%"  stopColor="#5eeaff" />
            <stop offset="80%"  stopColor="#e93fc7" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>

          <filter id={`glow-${uid}`} x="-10%" y="-80%" width="120%" height="260%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <polygon fill={C[from]} points={buildPolygon(flip)} />

        <motion.path
          d={buildPath(flip)}
          fill="none"
          stroke={`url(#zg-${uid})`}
          strokeWidth="2.5"
          filter={`url(#glow-${uid})`}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        />
      </svg>
    </div>
  );
}
