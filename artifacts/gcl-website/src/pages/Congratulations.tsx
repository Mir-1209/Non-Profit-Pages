import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import logoImg from '@assets/Untitled_design-9_1783003171841.png';

/* ── Tiny confetti ── */
function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const COLORS = ['#3358ff', '#8b5cf6', '#e93fc7', '#5eeaff', '#15132c', '#d4a0ff'];
    const pieces = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: -8 - Math.random() * 200,
      w: 2 + Math.random() * 3,
      h: 1 + Math.random() * 2.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.1,
      vx: (Math.random() - 0.5) * 1.4,
      vy: 0.9 + Math.random() * 1.8,
      opacity: 0.3 + Math.random() * 0.45,
    }));

    let frame = 0;
    let raf: number;
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.angle += p.spin; p.vy += 0.02;
        if (p.y > canvas.height + 8) { p.y = -8; p.x = Math.random() * canvas.width; p.vy = 0.9 + Math.random() * 1.5; }
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      frame++;
      if (frame < 500) raf = requestAnimationFrame(draw);
      else {
        pieces.forEach(p => { p.opacity = Math.max(0, p.opacity - 0.004); });
        if (pieces.some(p => p.opacity > 0)) raf = requestAnimationFrame(draw);
      }
    }
    raf = requestAnimationFrame(draw);
    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />;
}

/* ── Scatter heading ── */
const HEADING = 'You have been accepted.';
const CHARS = HEADING.split('');

function ScatterHeading() {
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const spans = spanRefs.current.filter(Boolean) as HTMLSpanElement[];
    spans.forEach(s => { s.style.display = 'inline-block'; s.style.transform = ''; });

    // Store original center positions (measured once, no transforms active)
    const originals: { x: number; y: number }[] = [];
    const state = spans.map(() => ({ ox: 0, oy: 0, vx: 0, vy: 0 }));
    const mouse = { x: -9999, y: -9999 };

    const measure = () => {
      spans.forEach((span, i) => {
        span.style.transform = '';
      });
      requestAnimationFrame(() => {
        spans.forEach((span, i) => {
          const rect = span.getBoundingClientRect();
          originals[i] = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        });
      });
    };

    const onMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);

    const RADIUS = 88;      // small proximity zone
    const FORCE  = 22;      // scatter speed
    const SPRING = 0.055;   // return strength
    const DAMP   = 0.80;    // velocity damping

    let raf: number;
    function tick() {
      state.forEach((s, i) => {
        if (!originals[i]) return;
        const orig = originals[i];
        // world pos = original + current offset
        const wx = orig.x + s.ox;
        const wy = orig.y + s.oy;
        const dx = wx - mouse.x;
        const dy = wy - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < RADIUS && dist > 1) {
          // Push directly away, with a little angle twist per character
          const angle = Math.atan2(dy, dx) + (i % 3 - 1) * 0.3;
          const f = ((RADIUS - dist) / RADIUS) * FORCE;
          s.vx += Math.cos(angle) * f;
          s.vy += Math.sin(angle) * f;
        }

        // Spring back to origin
        s.vx += -s.ox * SPRING;
        s.vy += -s.oy * SPRING;

        // Damping
        s.vx *= DAMP;
        s.vy *= DAMP;

        s.ox += s.vx;
        s.oy += s.vy;

        spans[i].style.transform = `translate(${s.ox.toFixed(2)}px, ${s.oy.toFixed(2)}px)`;
      });
      raf = requestAnimationFrame(tick);
    }

    // Delay measure until layout is stable
    const timer = setTimeout(() => {
      measure();
      setTimeout(() => { raf = requestAnimationFrame(tick); }, 60);
    }, 120);

    window.addEventListener('resize', measure);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', measure);
    };
  }, []);

  return (
    <div ref={containerRef} className="select-none leading-[1.1]"
      style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700 }}>
      {CHARS.map((ch, i) => (
        <span
          key={i}
          ref={el => { spanRefs.current[i] = el; }}
          className="inline-block will-change-transform"
          style={{ whiteSpace: ch === ' ' ? 'pre' : undefined }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </div>
  );
}

/* ── Page ── */
export function Congratulations() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.35;
    audio.loop = true;
    const play = () => audio.play().catch(() => {});
    play();
    const onGesture = () => { play(); document.removeEventListener('click', onGesture); };
    document.addEventListener('click', onGesture);
    return () => document.removeEventListener('click', onGesture);
  }, []);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-8 relative overflow-hidden bg-white">
      <audio ref={audioRef} src="/ribs-lorde.mp3" preload="auto" />
      <ConfettiCanvas />

      {/* Mute */}
      <button
        onClick={toggleMute}
        className="fixed top-6 right-6 z-50 text-[11px] font-[600] uppercase tracking-[0.12em] hover:opacity-40 transition-opacity"
        style={{ color: 'rgba(21,19,44,0.35)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {muted ? 'Unmute' : 'Mute'}
      </button>

      {/* Card */}
      <div className="relative z-20 max-w-[640px] w-full">

        {/* Logo */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9 }} className="mb-12">
          <Link href="/">
            <img src={logoImg} alt="GCL" className="h-7 object-contain" style={{ filter: 'invert(1)' }} />
          </Link>
        </motion.div>

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.7 }}
          className="text-[10.5px] font-[700] uppercase tracking-[0.2em] mb-6"
          style={{ color: 'rgba(21,19,44,0.35)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          GCL Summer 2026 — Official Notice
        </motion.div>

        {/* Scatter heading */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}
          className="text-[clamp(34px,5.5vw,54px)] tracking-[-0.03em] text-[var(--ink)] mb-8 cursor-default"
        >
          <ScatterHeading />
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.48, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="origin-left h-px mb-8"
          style={{ background: 'rgba(21,19,44,0.12)' }}
        />

        {/* Body */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.56, duration: 0.65 }}
          className="space-y-5 mb-10"
          style={{
            color: 'rgba(21,19,44,0.55)',
            fontSize: '14.5px',
            lineHeight: '1.85',
            fontWeight: 500,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          <p>
            Out of over 1,300 applications received from around the world, you have been selected as one of 30 members of the Global Capital League Summer 2026 Team. Your application stood out as exceptional.
          </p>
          <p>
            You are now part of a cohort of students and young professionals who will facilitate workshops, develop financial literacy curriculum, and engage communities across 14 countries. This is a substantive, competitive volunteer program — and you have earned your place in it.
          </p>
          <p>
            Onboarding materials and your program schedule will be sent to your registered email shortly. Please review all correspondence carefully and complete any required forms within the specified deadlines.
          </p>
          <p style={{ color: 'rgba(21,19,44,0.3)' }}>
            Welcome to the Global Capital League.<br />
            — The GCL Program Team
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.5 }}
          className="flex flex-wrap gap-3"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          <Link
            href="/portal"
            className="inline-flex items-center gap-2 px-6 py-3 text-[12.5px] font-[800] uppercase tracking-wider text-white transition-opacity hover:opacity-80"
            style={{ background: 'var(--ink)' }}
          >
            Go to Team Portal
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 text-[12.5px] font-[800] uppercase tracking-wider transition-opacity hover:opacity-40"
            style={{ color: 'rgba(21,19,44,0.45)', border: '1px solid rgba(21,19,44,0.15)' }}
          >
            Return Home
          </Link>
        </motion.div>

      </div>
    </main>
  );
}
