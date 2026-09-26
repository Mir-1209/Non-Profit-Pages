import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { chapters } from '../data/chapters';
import { stats } from '../config/site';

type Point = { year: number; value: number; title: string; body: string };

const upTo = (y: number) => chapters.filter((c) => c.founded <= y).length;
const citiesIn = (y: number) => chapters.filter((c) => c.founded === y).map((c) => c.city);

const POINTS: Point[] = [
  { year: 2021, value: upTo(2021), title: 'One room in Tashkent', body: 'The first workshop runs at a youth center. One chapter, one whiteboard, one idea: teach behavior, not arithmetic.' },
  { year: 2022, value: upTo(2022), title: 'The idea travels', body: `${citiesIn(2022).join(', ')} open their doors.` },
  { year: 2023, value: upTo(2023), title: 'Three continents', body: `${citiesIn(2023).join(', ')} join the league.` },
  { year: 2024, value: upTo(2024), title: 'Latin America & beyond', body: `${citiesIn(2024).join(', ')} go live. Vanguard Capital League is outgrowing its name.` },
  { year: 2026, value: stats.chapters.value, title: 'Global Capital League', body: `${stats.chapters.value} chapters, ${stats.countries.value}+ countries and ${stats.youth.value.toLocaleString('en-US')}+ young people taught — Asia's largest youth-led financial literacy network.` },
];

// Chart geometry (SVG user units)
const W = 1000;
const H = 520;
const PAD = { l: 20, r: 40, t: 40, b: 40 };
const x = (year: number) => PAD.l + ((year - 2021) / (2026 - 2021)) * (W - PAD.l - PAD.r);
const y = (v: number) => H - PAD.b - (v / 40) * (H - PAD.t - PAD.b);

function curve(points: Point[]) {
  // Monotone-ish smooth path through the points (Catmull–Rom → Bézier)
  const p = points.map((pt) => [x(pt.year), y(pt.value)]);
  let d = `M ${p[0][0]} ${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, Math.min(p1[1], p1[1] + (p2[1] - p0[1]) / 6)];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, Math.max(p2[1], p2[1] - (p3[1] - p1[1]) / 6)];
    d += ` C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

const PATH = curve(POINTS);

/** "Up and to the right": our history, drawn as a stock chart while you scroll. */
export function GrowthChart() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const drawn = useTransform(progress, [0.05, 0.9], [0, 1]);
  const revealWidth = useTransform(drawn, (v) => (reduce ? W : PAD.l + v * (W - PAD.l - PAD.r)));
  const [active, setActive] = useState(0);

  useMotionValueEvent(drawn, 'change', (v) => {
    const idx = POINTS.reduce((acc, pt, i) => ((pt.year - 2021) / 5 <= v + 0.001 ? i : acc), 0);
    setActive(idx);
  });

  const pt = POINTS[reduce ? POINTS.length - 1 : active];

  return (
    <section ref={ref} className="relative bg-paper" style={{ height: reduce ? 'auto' : '340vh' }} aria-label="Our growth since 2021">
      <div className={`${reduce ? '' : 'sticky top-0'} flex min-h-[100svh] flex-col justify-center overflow-hidden py-24`}>
        <div className="gutter grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.6fr] lg:items-end">
          <div>
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full bg-signal/15 px-3.5 py-1.5 text-[13px] font-[620] tracking-[-0.005em]">
              <span className="h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_10px_rgba(58,169,255,0.9)]" />
              <span>GCL · Chapters · Since inception</span>
            </div>
            <div className="flex items-end gap-6">
              <div className="display tabular text-[clamp(96px,16vw,240px)] leading-[0.8]">{pt.year}</div>
              <div className="pb-2">
                <div className="display tabular text-[clamp(44px,5vw,72px)] leading-none text-signal">{pt.value}</div>
                <div className="mono mt-1 text-mute">Chapters</div>
              </div>
            </div>
            <div className="mt-6 min-h-[170px] max-w-[440px]">
              <motion.div key={pt.year} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="serif text-[34px] leading-[1.05] italic">{pt.title}</div>
                <p className="mt-3 text-[16px] leading-relaxed text-mute">{pt.body}</p>
              </motion.div>
            </div>
          </div>

          <div className="relative">
            <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full overflow-visible" role="img" aria-label={`Chapters grew from 1 in 2021 to ${stats.chapters.value} in 2026`}>
              {/* Grid */}
              {[0, 10, 20, 30, 40].map((v) => (
                <g key={v}>
                  <line x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} stroke="currentColor" strokeOpacity={v === 0 ? 0.5 : 0.1} strokeDasharray={v === 0 ? undefined : '2 6'} />
                  <text x={W - PAD.r + 10} y={y(v) + 4} className="mono" fontSize="11" fill="currentColor" opacity="0.5">
                    {v}
                  </text>
                </g>
              ))}
              {[2021, 2022, 2023, 2024, 2025, 2026].map((yr) => (
                <text key={yr} x={x(yr)} y={H - 10} textAnchor="middle" className="mono" fontSize="11" fill="currentColor" opacity="0.5">
                  {yr}
                </text>
              ))}
              {/* Area under the line */}
              <defs>
                <linearGradient id="gcl-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#3aa9ff" stopOpacity="0.22" />
                  <stop offset="1" stopColor="#3aa9ff" stopOpacity="0" />
                </linearGradient>
                <clipPath id="gcl-reveal">
                  <motion.rect x="0" y="0" height={H} width={revealWidth} />
                </clipPath>
              </defs>
              <path d={`${PATH} L ${x(2026)} ${y(0)} L ${x(2021)} ${y(0)} Z`} fill="url(#gcl-area)" clipPath="url(#gcl-reveal)" />
              <path d={PATH} fill="none" stroke="#0a1633" strokeWidth="3.5" clipPath="url(#gcl-reveal)" />
              {POINTS.map((p, i) => (
                <g key={p.year} opacity={reduce || i <= active ? 1 : 0.15} style={{ transition: 'opacity .4s' }}>
                  <circle cx={x(p.year)} cy={y(p.value)} r={i === active ? 10 : 6} fill={i === active ? '#3aa9ff' : '#0a1633'} style={{ transition: 'r .3s' }} />
                  {i === active && <circle cx={x(p.year)} cy={y(p.value)} r="22" fill="none" stroke="#3aa9ff" strokeOpacity="0.5" />}
                </g>
              ))}
            </svg>
          </div>
        </div>
        {!reduce && (
          <div className="gutter mt-10">
            <div className="relative h-px w-full bg-ink/15">
              <motion.div className="absolute inset-y-0 left-0 origin-left bg-signal" style={{ scaleX: drawn, width: '100%' }} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
