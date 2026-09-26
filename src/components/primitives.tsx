import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { Children, useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'wouter';

export const EASE = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.76, 0, 0.24, 1] as const;

/* ─── Lines that slide up from behind a mask ─────────────────────── */
export function MaskLines({
  lines,
  className = '',
  lineClassName = '',
  delay = 0,
  stagger = 0.08,
  once = true,
  as: Tag = 'div',
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'p';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: '0px 0px -8% 0px' });
  const reduce = useReducedMotion();
  const MotionTag = motion[Tag] as typeof motion.div;
  return (
    <MotionTag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.04em] -mb-[0.04em]">
          <motion.span
            className={`block ${lineClassName}`}
            initial={reduce ? false : { y: '105%' }}
            animate={inView || reduce ? { y: '0%' } : { y: '105%' }}
            transition={{ duration: 1.05, ease: EASE, delay: delay + i * stagger }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

/* ─── Simple fade/rise on enter ───────────────────────────────────── */
export function Rise({ children, delay = 0, className = '', y = 32 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduce = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      animate={inView || reduce ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Paragraph whose words ink in as you scroll ─────────────────── */
export function ScrollInk({ text, className = '', accent = [] as string[] }: { text: string; className?: string; accent?: string[] }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const words = text.split(' ');
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <InkWord key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} accent={accent.includes(w.replace(/[.,—]/g, ''))}>
          {w}
        </InkWord>
      ))}
    </p>
  );
}

function InkWord({ children, progress, range, accent }: { children: string; progress: MotionValue<number>; range: [number, number]; accent: boolean }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const reduce = useReducedMotion();
  return (
    <motion.span style={{ opacity: reduce ? 1 : opacity }} className={accent ? 'serif italic text-signal' : ''}>
      {children}{' '}
    </motion.span>
  );
}

/* ─── Number that counts up when visible ─────────────────────────── */
export function Counter({ value, suffix = '', prefix = '', className = '', duration = 2.2, format = true }: { value: number; suffix?: string; prefix?: string; className?: string; duration?: number; format?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, {
      duration,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, duration, reduce]);
  return (
    <span ref={ref} className={`tabular ${className}`}>
      {prefix}
      {format ? display.toLocaleString('en-US') : display}
      {suffix}
    </span>
  );
}

/* ─── Infinite marquee (CSS-driven, pauses for reduced motion) ──── */
export function Marquee({ children, speed = 40, reverse = false, className = '' }: { children: ReactNode; speed?: number; reverse?: boolean; className?: string }) {
  const items = Children.toArray(children);
  return (
    <div className={`flex overflow-hidden select-none ${className}`} aria-hidden="true">
      <div
        className="flex shrink-0 animate-marquee will-change-transform"
        style={{ ['--marquee-speed' as string]: `${speed}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        {items}
        {items}
      </div>
    </div>
  );
}

/* ─── Element that leans toward the cursor ───────────────────────── */
export function Magnetic({ children, strength = 0.35, className = '' }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });
  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse' || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Arrow glyph ────────────────────────────────────────────────── */
export function Arrow({ className = '', dir = 'ne' }: { className?: string; dir?: 'ne' | 'e' | 's' }) {
  const rot = dir === 'e' ? 45 : dir === 's' ? 135 : 0;
  return (
    <svg viewBox="0 0 24 24" className={className} style={{ transform: `rotate(${rot}deg)` }} fill="none" aria-hidden="true">
      <path d="M6 18 L18 6 M8 6 H18 V16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" />
    </svg>
  );
}

/* ─── Pill button: fills with signal orange from the cursor side ── */
type PillProps = {
  href: string;
  children: ReactNode;
  variant?: 'ink' | 'paper' | 'signal' | 'ghost' | 'ghost-dark';
  className?: string;
  external?: boolean;
};

export function Pill({ href, children, variant = 'ink', className = '', external }: PillProps) {
  const base =
    'group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-6 py-3.5 text-[15px] font-[650] tracking-[-0.005em] transition-colors duration-500';
  const styles: Record<string, string> = {
    ink: 'bg-ink text-paper hover:text-ink',
    paper: 'bg-paper text-ink',
    signal: 'bg-signal text-ink shadow-[0_10px_30px_-10px_rgba(58,169,255,0.8)] hover:text-paper',
    ghost: 'border border-ink/25 text-ink hover:text-ink',
    'ghost-dark': 'border border-paper/25 text-paper hover:text-ink',
  };
  const fill = variant === 'signal' ? 'bg-ink' : 'bg-signal';
  const inner = (
    <>
      <span className={`absolute inset-0 ${fill} translate-y-[101%] rounded-[inherit] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0`} />
      <span className="relative">{children}</span>
      <Arrow className="relative h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-45" />
    </>
  );
  const isExternal = external ?? /^(https?:|mailto:|#)/.test(href);
  const cls = `${base} ${styles[variant]} ${className}`;
  return isExternal ? (
    <a href={href} className={cls} {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

/* ─── Section eyebrow: a soft chip with a glowing dot ─────────────── */
export function Eyebrow({ index, children, className = '' }: { index?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`inline-flex w-fit items-center gap-2 rounded-full bg-signal/15 px-3.5 py-1.5 text-[13px] font-[620] tracking-[-0.005em] ${className}`} data-index={index}>
      <span className="h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_10px_rgba(58,169,255,0.9)]" />
      <span>{children}</span>
    </div>
  );
}

/* ─── Image that un-crops and de-saturates into color on enter ─── */
export function RevealImage({
  src,
  alt,
  className = '',
  imgClassName = '',
  parallax = true,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  parallax?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' });
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden bg-ink-2 ${className}`}
      initial={reduce ? false : { clipPath: 'inset(18% 12% 18% 12%)' }}
      animate={inView || reduce ? { clipPath: 'inset(0% 0% 0% 0%)' } : undefined}
      transition={{ duration: 1.4, ease: EASE }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        draggable={false}
        className={`absolute inset-0 h-[116%] w-full -top-[8%] object-cover ${imgClassName}`}
        style={parallax && !reduce ? { y } : undefined}
        initial={reduce ? false : { scale: 1.25, filter: 'grayscale(1)' }}
        animate={inView || reduce ? { scale: 1, filter: 'grayscale(0)' } : undefined}
        transition={{ duration: 1.8, ease: EASE }}
      />
    </motion.div>
  );
}
