import React, { useEffect, useRef, useState, useCallback } from 'react';
import createGlobe from 'cobe';
import { motion, AnimatePresence } from 'framer-motion';
import { chapters, Chapter } from '../data/chapters';

// Convert lat/lng to cobe marker format
const MARKERS = chapters.map(ch => ({
  location: [ch.lat, ch.lng] as [number, number],
  size: 0.055,
}));

// Project a lat/lng to 2D canvas coords given current phi/theta and canvas size
function project(
  lat: number, lng: number,
  phi: number, theta: number,
  cx: number, cy: number, r: number,
): { x: number; y: number; visible: boolean } {
  const lngRad = (lng * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;

  // 3D point on unit sphere
  const x0 = Math.cos(latRad) * Math.sin(lngRad);
  const y0 = Math.sin(latRad);
  const z0 = Math.cos(latRad) * Math.cos(lngRad);

  // Apply globe rotation (phi around Y axis, theta around X axis)
  const cosPhi = Math.cos(-phi);
  const sinPhi = Math.sin(-phi);
  const x1 = x0 * cosPhi + z0 * sinPhi;
  const z1 = -x0 * sinPhi + z0 * cosPhi;
  const y1 = y0;

  const cosTheta = Math.cos(theta);
  const sinTheta = Math.sin(theta);
  const y2 = y1 * cosTheta - z1 * sinTheta;
  const z2 = y1 * sinTheta + z1 * cosTheta;

  const visible = z2 > 0;
  return { x: cx + x1 * r, y: cy - y2 * r, visible };
}

export function GlobeSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);
  const phiRef = useRef(0.9); // start centred on Central Asia
  const thetaRef = useRef(0.3);
  const [hovered, setHovered] = useState<Chapter | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(600);

  // Responsive size
  useEffect(() => {
    const update = () => {
      const w = containerRef.current?.offsetWidth ?? 600;
      setSize(Math.min(w, 680));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Init globe
  useEffect(() => {
    if (!canvasRef.current) return;
    globeRef.current?.destroy();

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: Math.min(window.devicePixelRatio, 2),
      width: size * 2,
      height: size * 2,
      phi: phiRef.current,
      theta: thetaRef.current,
      dark: 1,
      diffuse: 1.4,
      mapSamples: 20000,
      mapBrightness: 5.5,
      baseColor: [0.12, 0.09, 0.28] as [number, number, number],
      markerColor: [0.25, 0.85, 1.0] as [number, number, number],
      glowColor: [0.18, 0.12, 0.55] as [number, number, number],
      markers: MARKERS,
    });
    globeRef.current = globe;

    // Animate via rAF — cobe v2 uses globe.update() instead of onRender
    let rafId: number;
    const animate = () => {
      phiRef.current += 0.003;
      globe.update({ phi: phiRef.current, theta: thetaRef.current });
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      globe.destroy();
    };
  }, [size]);

  // Hover detection
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !containerRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.44;

    let closest: Chapter | null = null;
    let minDist = 24; // px threshold

    chapters.forEach(ch => {
      const { x, y, visible } = project(
        ch.lat, ch.lng,
        phiRef.current, thetaRef.current,
        cx, cy, r,
      );
      if (!visible) return;
      const d = Math.hypot(x - mx, y - my);
      if (d < minDist) { minDist = d; closest = ch; }
    });

    setHovered(closest);
    if (closest) {
      const containerRect = containerRef.current.getBoundingClientRect();
      setTooltipPos({
        x: e.clientX - containerRect.left,
        y: e.clientY - containerRect.top,
      });
    }
  }, [size]);

  const handleMouseLeave = useCallback(() => setHovered(null), []);

  return (
    <section className="py-[90px] bg-[var(--brutal-bg)] overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 text-[12px] font-[800] tracking-[0.08em] uppercase text-[var(--neon-cyan)] mb-4">
            Our Reach
          </span>
          <h2 className="font-[800] text-[clamp(28px,4.2vw,50px)] leading-[1.06] tracking-[-0.03em] text-[var(--brutal-text)]">
            {chapters.length} Chapters Worldwide
          </h2>
          <p className="mt-3 text-[15px] text-[var(--brutal-text-dim)] max-w-[480px] mx-auto leading-[1.7]">
            From Central Asia to West Africa to London — hover the pins to explore every GCL chapter.
          </p>
        </div>

        {/* Globe + sidebar */}
        <div className="flex flex-col lg:flex-row items-center gap-10 justify-center">
          {/* Globe */}
          <div ref={containerRef} className="relative flex-shrink-0" style={{ width: size, height: size }}>
            <canvas
              ref={canvasRef}
              width={size * 2}
              height={size * 2}
              style={{ width: size, height: size, cursor: hovered ? 'pointer' : 'default' }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            />

            {/* Tooltip */}
            <AnimatePresence>
              {hovered && (
                <motion.div
                  key={hovered.name}
                  initial={{ opacity: 0, scale: 0.92, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 6 }}
                  transition={{ duration: 0.18 }}
                  className="absolute pointer-events-none z-20"
                  style={{
                    left: tooltipPos.x + 16,
                    top: tooltipPos.y - 20,
                    transform: tooltipPos.x > size * 0.6 ? 'translateX(-110%)' : undefined,
                  }}
                >
                  <div
                    className="rounded-[14px] px-4 py-3.5 min-w-[190px]"
                    style={{
                      background: 'rgba(14, 10, 35, 0.96)',
                      border: '1px solid rgba(100, 200, 255, 0.25)',
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(100,200,255,0.08)',
                    }}
                  >
                    <div className="text-[13px] font-[800] text-white mb-2 leading-tight">{hovered.name}</div>
                    <div className="space-y-1">
                      {[
                        { label: 'Location', value: `${hovered.city}, ${hovered.country}` },
                        { label: 'Founded',  value: hovered.founded.toString() },
                        { label: 'Team',     value: `${hovered.members} members` },
                      ].map(row => (
                        <div key={row.label} className="flex items-baseline gap-2">
                          <span className="text-[10px] font-[700] tracking-[0.08em] uppercase text-[var(--neon-cyan)] w-[56px] shrink-0">{row.label}</span>
                          <span className="text-[12px] text-white/75">{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Chapter list sidebar */}
          <div className="hidden lg:flex flex-col gap-2 max-h-[520px] overflow-y-auto pr-2 w-[220px] scrollbar-thin">
            {chapters.map(ch => (
              <motion.div
                key={ch.name}
                whileHover={{ x: 4 }}
                className="flex flex-col gap-0.5 px-3 py-2.5 rounded-[10px] cursor-default transition-colors"
                style={{
                  background: hovered?.name === ch.name
                    ? 'rgba(100, 200, 255, 0.1)'
                    : 'rgba(255,255,255,0.03)',
                  border: hovered?.name === ch.name
                    ? '1px solid rgba(100,200,255,0.25)'
                    : '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <span className="text-[12px] font-[700] text-[var(--brutal-text)] leading-tight">{ch.name}</span>
                <span className="text-[11px] text-[var(--brutal-text-dim)]">{ch.city}, {ch.country} · {ch.founded}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
