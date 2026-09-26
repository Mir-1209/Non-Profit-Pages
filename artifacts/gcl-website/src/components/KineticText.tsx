import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Condensed display type whose letters widen and thicken near the pointer
 * (variable font axes: wdth 62→125, wght 700→900). On touch screens a slow
 * wave rolls through the letters instead. Static when reduced motion is on.
 */
export function KineticText({ text, className = '', radius = 260, maxStretch = 112 }: { text: string; className?: string; radius?: number; maxStretch?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const letters = Array.from(root.querySelectorAll<HTMLSpanElement>('[data-l]'));
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    let px = -9999;
    let py = -9999;
    let raf = 0;
    const current = letters.map(() => 0);
    let visible = true;

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(root);

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
    };
    if (fine) window.addEventListener('pointermove', onMove, { passive: true });

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      // Read every rect first, then write — avoids forcing a layout per letter.
      const rects = fine ? letters.map((l) => l.getBoundingClientRect()) : null;
      for (let i = 0; i < letters.length; i++) {
        let target: number;
        if (rects) {
          const r = rects[i];
          const d = Math.hypot(px - (r.left + r.width / 2), py - (r.top + r.height / 2));
          target = Math.max(0, 1 - d / radius);
          target = target * target * (3 - 2 * target);
        } else {
          // Gentler on touch screens, where there is less horizontal room.
          target = 0.55 * Math.max(0, Math.sin(t / 900 - i * 0.55)) ** 3;
        }
        current[i] += (target - current[i]) * 0.12;
      }
      for (let i = 0; i < letters.length; i++) {
        const v = current[i];
        letters[i].style.fontStretch = `${62 + v * (maxStretch - 62)}%`;
        letters[i].style.fontWeight = `${800 + v * 100}`;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
  }, [radius, maxStretch]);

  return (
    <span ref={ref} className={`whitespace-nowrap ${className}`}>
      <span className="sr-only">{text}</span>
      {Array.from(text).map((ch, i) => (
        <span key={i} data-l aria-hidden="true" className="inline-block" style={{ fontStretch: '62%' }}>
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  );
}

export function Ticker({ items, className = '' }: { items: { sym: string; val: ReactNode; note?: string; up?: boolean }[]; className?: string }) {
  const row = (
    <div className="flex shrink-0 items-center">
      {items.map((it, i) => (
        <span key={i} className="mono flex items-center gap-2 whitespace-nowrap px-5">
          <span className="text-paper/55">{it.sym}</span>
          <span className="tabular text-paper">{it.val}</span>
          {it.up !== undefined && <span className={it.up ? 'text-signal' : 'text-paper/50'}>{it.up ? '▲' : '━'}</span>}
          {it.note && <span className="text-paper/40">{it.note}</span>}
          <span className="pl-3 text-paper/20">/</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className={`flex overflow-hidden bg-ink py-2.5 ${className}`} aria-hidden="true">
      <div className="flex shrink-0 animate-marquee" style={{ ['--marquee-speed' as string]: '55s' }}>
        {row}
        {row}
      </div>
    </div>
  );
}
