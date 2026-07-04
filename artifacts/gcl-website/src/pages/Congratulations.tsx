import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import logoImg from '@assets/Untitled_design-9_1783003171841.png';

function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const COLORS = ['#5eeaff', '#8b5cf6', '#e93fc7', '#3358ff', '#f6f4ff', '#fbbf24'];

    const pieces: {
      x: number; y: number; w: number; h: number;
      color: string; angle: number; spin: number;
      vx: number; vy: number; opacity: number;
    }[] = [];

    for (let i = 0; i < 120; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: -10 - Math.random() * 300,
        w: 2.5 + Math.random() * 4,
        h: 1.5 + Math.random() * 3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.12,
        vx: (Math.random() - 0.5) * 1.8,
        vy: 1.2 + Math.random() * 2.5,
        opacity: 0.55 + Math.random() * 0.35,
      });
    }

    let frame = 0;
    let raf: number;

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.spin;
        p.vy += 0.03;
        if (p.y > canvas.height + 10) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
          p.vy = 1.2 + Math.random() * 2;
        }
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      frame++;
      if (frame < 480) {
        raf = requestAnimationFrame(draw);
      } else {
        pieces.forEach(p => { p.opacity = Math.max(0, p.opacity - 0.003); });
        if (pieces.some(p => p.opacity > 0)) raf = requestAnimationFrame(draw);
      }
    }

    raf = requestAnimationFrame(draw);

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />
  );
}

export function Congratulations() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.4;
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
    <main
      className="min-h-screen flex flex-col items-center justify-center px-8 relative overflow-hidden"
      style={{ background: 'var(--brutal-bg)' }}
    >
      <audio ref={audioRef} src="/ribs-lorde.mp3" preload="auto" />
      <ConfettiCanvas />

      {/* Mute button */}
      <button
        onClick={toggleMute}
        className="fixed top-6 right-6 z-50 text-[11px] font-[700] uppercase tracking-[0.1em] transition-opacity hover:opacity-60"
        style={{ color: 'rgba(255,255,255,0.4)' }}
      >
        {muted ? 'Unmute' : 'Mute'}
      </button>

      {/* Content */}
      <div className="relative z-20 max-w-[620px] w-full">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <Link href="/">
            <img src={logoImg} alt="GCL" className="h-8 object-contain" />
          </Link>
        </motion.div>

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-[11px] font-[800] uppercase tracking-[0.18em] mb-5"
          style={{ color: 'rgba(255,255,255,0.3)' }}
        >
          GCL Summer 2026 — Official Notice
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.65 }}
          className="font-[800] text-[clamp(32px,5.5vw,52px)] leading-[1.0] tracking-[-0.04em] text-white mb-8"
        >
          You have been accepted.
        </motion.h1>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.48, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="origin-left h-[1px] mb-8"
          style={{ background: 'rgba(255,255,255,0.12)' }}
        />

        {/* Body */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.65 }}
          className="space-y-5 mb-10"
          style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14.5px', lineHeight: '1.8', fontWeight: 500 }}
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
          <p style={{ color: 'rgba(255,255,255,0.35)' }}>
            Welcome to the Global Capital League.<br />
            — The GCL Program Team
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex flex-wrap gap-3"
        >
          <Link
            href="/portal"
            className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-[800] uppercase tracking-wider text-[var(--ink)] transition-all hover:opacity-80"
            style={{ background: 'white' }}
          >
            Go to Team Portal
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-[800] uppercase tracking-wider transition-all hover:opacity-60"
            style={{
              color: 'rgba(255,255,255,0.5)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            Return Home
          </Link>
        </motion.div>

      </div>
    </main>
  );
}
