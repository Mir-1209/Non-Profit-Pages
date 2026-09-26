import { motion } from 'framer-motion';

/**
 * The GCL mark: an open ring (the "G", and the globe) with a growth arrow
 * breaking out through the gap — capital that compounds and escapes the loop.
 */
export function LogoMark({ size = 32, animate = false, className = '' }: { size?: number; animate?: boolean; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <motion.path
        d="M43 12.95 A22 22 0 1 0 53.67 28.18"
        stroke="currentColor"
        strokeWidth="6.5"
        strokeLinecap="butt"
        initial={animate ? { pathLength: 0 } : false}
        animate={animate ? { pathLength: 1 } : undefined}
        transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.path
        d="M27 37 L52 12 M38.5 12 H52 V25.5"
        stroke="currentColor"
        strokeWidth="6.5"
        strokeLinecap="square"
        initial={animate ? { pathLength: 0 } : false}
        animate={animate ? { pathLength: 1 } : undefined}
        transition={{ duration: 0.7, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={30} />
      <span className="flex flex-col leading-none">
        <span className="display text-[26px] tracking-[0.01em]">GCL</span>
        <span className="mono !text-[8.5px] !tracking-[0.14em] mt-[3px] hidden sm:block opacity-80">
          Global Capital League
        </span>
      </span>
    </span>
  );
}
