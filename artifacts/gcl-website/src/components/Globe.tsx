import createGlobe from 'cobe';
import { useEffect, useRef } from 'react';
import { chapters } from '../data/chapters';

const HQ: [number, number] = [41.2995, 69.2401];

/**
 * A dotted WebGL globe (cobe, ~5 kB) with every chapter pinned and an arc
 * from headquarters in Tashkent to each city. Drag to spin.
 */
export function Globe({ className = '' }: { className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = canvas.current;
    const box = wrap.current;
    if (!el || !box) return;

    let width = box.offsetWidth;
    let phi = 3.5; // start facing Central Asia
    let velocity = 0;
    let dragging: number | null = null;
    let visible = true;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let globe: ReturnType<typeof createGlobe>;
    try {
      globe = createGlobe(el, {
        devicePixelRatio: Math.min(window.devicePixelRatio, 2),
        width: width * 2,
        height: width * 2,
        phi,
        theta: 0.28,
        dark: 1,
        diffuse: 1.1,
        mapSamples: 18000,
        mapBrightness: 6,
        mapBaseBrightness: 0.02,
        baseColor: [0.3, 0.29, 0.27],
        markerColor: [1, 0.235, 0],
        glowColor: [0.2, 0.19, 0.17],
        markers: chapters.map((c) => ({ location: [c.lat, c.lng] as [number, number], size: c.id === 'tashkent' ? 0.09 : 0.05 })),
        arcs: chapters.filter((c) => c.id !== 'tashkent').map((c) => ({ from: HQ, to: [c.lat, c.lng] as [number, number] })),
        arcColor: [1, 0.42, 0.24],
        arcWidth: 0.6,
        arcHeight: 0.25,
        opacity: 0.95,
      });
    } catch {
      // WebGL unavailable — the section still reads fine without the globe.
      box.style.display = 'none';
      return;
    }

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(box);

    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      if (dragging === null) {
        velocity *= 0.95;
        phi += velocity + (reduce ? 0 : 0.0022);
      }
      globe.update({ phi, width: width * 2, height: width * 2 });
    };
    raf = requestAnimationFrame(loop);

    const onResize = () => (width = box.offsetWidth);
    window.addEventListener('resize', onResize);

    let lastX = 0;
    const down = (e: PointerEvent) => {
      dragging = e.clientX;
      lastX = e.clientX;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = 'grabbing';
    };
    const move = (e: PointerEvent) => {
      if (dragging === null) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      phi += dx / 200;
      velocity = dx / 400;
    };
    const up = () => {
      dragging = null;
      el.style.cursor = 'grab';
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);

    requestAnimationFrame(() => (el.style.opacity = '1'));

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', onResize);
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      globe.destroy();
    };
  }, []);

  return (
    <div ref={wrap} className={`relative aspect-square w-full ${className}`} data-cursor="Drag">
      <canvas
        ref={canvas}
        className="h-full w-full cursor-grab touch-pan-y opacity-0 transition-opacity duration-[1.5s]"
        aria-label={`Globe showing ${chapters.length} GCL chapter cities connected to headquarters in Tashkent`}
        role="img"
      />
    </div>
  );
}
