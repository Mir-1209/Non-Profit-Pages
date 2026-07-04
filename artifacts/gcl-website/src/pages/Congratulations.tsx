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

    const COLORS = ['#5eeaff', '#8b5cf6', '#e93fc7', '#3358ff', '#ffffff', '#fbbf24', '#34d399'];
    const pieces: {
      x: number; y: number; w: number; h: number;
      color: string; angle: number; spin: number;
      vx: number; vy: number; opacity: number;
    }[] = [];

    for (let i = 0; i < 180; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 200,
        w: 6 + Math.random() * 10,
        h: 3 + Math.random() * 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.15,
        vx: (Math.random() - 0.5) * 2.5,
        vy: 2 + Math.random() * 4,
        opacity: 0.85 + Math.random() * 0.15,
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
        p.vy += 0.05;
        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
          p.vy = 2 + Math.random() * 3;
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
      if (frame < 600) raf = requestAnimationFrame(draw);
      else {
        pieces.forEach(p => { p.opacity = Math.max(0, p.opacity - 0.005); });
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
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
    />
  );
}

export function Congratulations() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.45;
    audio.loop = true;
    const play = () => {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    };
    play();
    const onUserGesture = () => { play(); document.removeEventListener('click', onUserGesture); };
    document.addEventListener('click', onUserGesture);
    return () => document.removeEventListener('click', onUserGesture);
  }, []);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{ background: 'var(--brutal-bg)' }}
    >
      <audio ref={audioRef} src="/ribs-lorde.mp3" preload="auto" />

      <ConfettiCanvas />

      {/* Background glow orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-10 top-[-150px] left-1/2 -translate-x-1/2"
          style={{ background: 'radial-gradient(circle, var(--violet), transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute w-[400px] h-[400px] rounded-full opacity-10 bottom-[-80px] left-[-80px]"
          style={{ background: 'radial-gradient(circle, var(--neon-cyan), transparent 70%)', filter: 'blur(70px)' }} />
        <div className="absolute w-[350px] h-[350px] rounded-full opacity-08 bottom-[0] right-[-60px]"
          style={{ background: 'radial-gradient(circle, var(--magenta), transparent 70%)', filter: 'blur(70px)' }} />
      </div>

      {/* Mute button */}
      <button
        onClick={toggleMute}
        className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-[700] transition-all"
        style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          color: 'var(--brutal-text)',
        }}
      >
        <span>{muted ? '🔇' : '🎵'}</span>
        {muted ? 'Unmute' : 'Mute'}
      </button>

      {/* Content */}
      <div className="relative z-20 max-w-[680px] w-full text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center mb-8"
        >
          <Link href="/">
            <img src={logoImg} alt="GCL" className="h-12 object-contain" />
          </Link>
        </motion.div>

        {/* Glowing badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-[800] tracking-[0.12em] uppercase mb-6"
          style={{
            background: 'rgba(94,234,255,0.12)',
            border: '1px solid rgba(94,234,255,0.35)',
            color: 'var(--neon-cyan)',
            boxShadow: '0 0 20px rgba(94,234,255,0.15)',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-cyan)] animate-pulse" />
          GCL Summer '26 · Official
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.65 }}
          className="font-[800] text-[clamp(28px,5vw,48px)] leading-[1.05] tracking-[-0.03em] text-white mb-6"
        >
          🎉 YOU'RE IN. WELCOME TO<br />
          <span style={{ background: 'linear-gradient(90deg, var(--neon-cyan), var(--violet), var(--magenta))', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            GCL SUMMER '26.
          </span>
          {' '}🎉
        </motion.h1>

        {/* Body text */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.65 }}
          className="text-[15px] leading-[1.75] font-[500] mb-10 text-left rounded-[20px] px-7 py-6"
          style={{
            color: 'var(--brutal-text-dim)',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <p className="mb-4" style={{ color: 'var(--brutal-text)' }}>
            Let's go!! 🌍✨ Out of 1,300+ applications from around the world, you made the cut for one of just 30 spots on the Global Capital League Summer '26 Team. That's not luck — that's you being an absolute standout. No cap.
          </p>
          <p className="mb-4">
            You're officially part of a global crew of changemakers about to run workshops, build curriculum, and bring real financial literacy to communities that never had access to it. This isn't your average "internship" — this is main character energy meets real-world impact. Get ready to learn behavioral economics that actually changes how people think, build and lead alongside youth from 14+ countries, leave a mark on communities across the globe, and come out the other side with skills (and a network) that hit different.
          </p>
          <p className="mb-4">
            You didn't just get selected. You earned your seat at the table. Onboarding details dropping soon — get hyped, because this summer is about to be a serious glow-up. 💸📚
          </p>
          <p className="font-[700]" style={{ color: 'var(--neon-cyan)' }}>
            Welcome to the League. 🏆<br />
            <span style={{ color: 'var(--brutal-text-dim)' }}>— The GCL Team</span>
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-3"
        >
          <Link
            href="/portal"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[14px] font-[800] text-[var(--ink)] transition-all hover:-translate-y-[2px]"
            style={{ background: 'var(--neon-cyan)', boxShadow: '0 0 24px rgba(94,234,255,0.35)' }}
          >
            Go to Team Portal →
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[14px] font-[800] text-white transition-all hover:-translate-y-[2px]"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
