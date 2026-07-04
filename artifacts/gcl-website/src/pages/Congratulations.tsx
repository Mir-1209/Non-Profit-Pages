import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '@assets/Untitled_design-9_1783003171841.png';

/* ── Confetti ── */
function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const COLORS = ['#3358ff', '#8b5cf6', '#e93fc7', '#15132c', '#5eeaff', '#fbbf24'];
    const pieces = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width, y: -8 - Math.random() * 200,
      w: 2.5 + Math.random() * 3.5, h: 1.5 + Math.random() * 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      angle: Math.random() * Math.PI * 2, spin: (Math.random() - 0.5) * 0.1,
      vx: (Math.random() - 0.5) * 1.4, vy: 1 + Math.random() * 2,
      opacity: 0.35 + Math.random() * 0.5,
    }));
    let frame = 0; let raf: number;
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.angle += p.spin; p.vy += 0.02;
        if (p.y > canvas.height + 8) { p.y = -8; p.x = Math.random() * canvas.width; p.vy = 1 + Math.random() * 1.5; }
        ctx.save(); ctx.globalAlpha = p.opacity; ctx.translate(p.x, p.y); ctx.rotate(p.angle);
        ctx.fillStyle = p.color; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
      });
      frame++;
      if (frame < 520) raf = requestAnimationFrame(draw);
      else { pieces.forEach(p => { p.opacity = Math.max(0, p.opacity - 0.004); }); if (pieces.some(p => p.opacity > 0)) raf = requestAnimationFrame(draw); }
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
  useEffect(() => {
    const spans = spanRefs.current.filter(Boolean) as HTMLSpanElement[];
    spans.forEach(s => { s.style.display = 'inline-block'; s.style.transform = ''; });
    const originals: { x: number; y: number }[] = [];
    const state = spans.map(() => ({ ox: 0, oy: 0, vx: 0, vy: 0 }));
    const mouse = { x: -9999, y: -9999 };
    const measure = () => {
      spans.forEach(s => { s.style.transform = ''; });
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
    const RADIUS = 85; const FORCE = 22; const SPRING = 0.055; const DAMP = 0.80;
    let raf: number;
    function tick() {
      state.forEach((s, i) => {
        if (!originals[i]) return;
        const orig = originals[i];
        const wx = orig.x + s.ox; const wy = orig.y + s.oy;
        const dx = wx - mouse.x; const dy = wy - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < RADIUS && dist > 1) {
          const angle = Math.atan2(dy, dx) + (i % 3 - 1) * 0.3;
          const f = ((RADIUS - dist) / RADIUS) * FORCE;
          s.vx += Math.cos(angle) * f; s.vy += Math.sin(angle) * f;
        }
        s.vx += -s.ox * SPRING; s.vy += -s.oy * SPRING;
        s.vx *= DAMP; s.vy *= DAMP;
        s.ox += s.vx; s.oy += s.vy;
        spans[i].style.transform = `translate(${s.ox.toFixed(2)}px,${s.oy.toFixed(2)}px)`;
      });
      raf = requestAnimationFrame(tick);
    }
    const timer = setTimeout(() => { measure(); setTimeout(() => { raf = requestAnimationFrame(tick); }, 80); }, 120);
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(raf); clearTimeout(timer);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', measure);
    };
  }, []);
  return (
    <div className="select-none leading-[1.0] cursor-default"
      style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}>
      {CHARS.map((ch, i) => (
        <span key={i} ref={el => { spanRefs.current[i] = el; }}
          className="inline-block will-change-transform">
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </div>
  );
}

/* ── Marquee tape ── */
const TAPE_TEXT = 'CONGRATULATIONS ★ YOU ARE IN ★ WELCOME TO GCL ★ ';
function MarqueeTape() {
  const repeated = TAPE_TEXT.repeat(10);
  return (
    <>
      <style>{`
        @keyframes gcl-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .gcl-marquee-track {
          animation: gcl-marquee 18s linear infinite;
          display: flex;
          white-space: nowrap;
          width: max-content;
        }
      `}</style>
      <div className="overflow-hidden border-y-[2.5px] border-[var(--ink)] relative z-20"
        style={{ background: 'var(--neon-cyan)' }}>
        <div className="gcl-marquee-track py-3">
          {[...Array(2)].map((_, di) => (
            <span key={di} className="font-[800] uppercase tracking-[0.18em] text-[var(--ink)] text-[13px]">
              {repeated}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

/* ── Accept / Decline box ── */
type RsvpState = 'pending' | 'accepted' | 'declined';

function RsvpBox() {
  const [state, setState] = useState<RsvpState>('pending');

  return (
    <div className="border-[2.5px] border-[var(--ink)] shadow-[6px_6px_0px_var(--ink)] bg-white">
      {/* Header */}
      <div className="px-6 py-5 border-b-[2.5px] border-[var(--ink)]" style={{ background: 'var(--brutal-bg)' }}>
        <div className="text-[10px] font-[800] uppercase tracking-[0.16em] text-white/40 mb-1">Response Required</div>
        <div className="font-[800] text-[17px] text-white leading-snug">Will you accept your spot?</div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {state === 'pending' && (
            <motion.div key="pending"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}>
              <p className="text-[13.5px] font-[500] text-[var(--ink)] leading-relaxed mb-6">
                Your place on the GCL Summer '26 Team is reserved for you. Please confirm your response — spots are limited and will be reassigned if no reply is received.
              </p>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => setState('accepted')}
                  className="flex-1 py-3 text-[13px] font-[800] uppercase tracking-wider text-white border-[2px] border-[var(--ink)] bg-[var(--ink)] shadow-[4px_4px_0px_var(--ink)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_var(--ink)] transition-all"
                >
                  Accept My Spot
                </button>
                <button
                  onClick={() => setState('declined')}
                  className="flex-1 py-3 text-[13px] font-[800] uppercase tracking-wider text-[var(--ink-soft)] border-[2px] border-[var(--line)] bg-white hover:border-[var(--ink)] hover:text-[var(--ink)] transition-all"
                >
                  Decline
                </button>
              </div>
            </motion.div>
          )}

          {state === 'accepted' && (
            <motion.div key="accepted"
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 border-[2.5px] border-[#166534] bg-[#dcfce7] flex items-center justify-center shrink-0 text-[#166534] font-[800] text-[18px]">✓</div>
                <div>
                  <div className="font-[800] text-[15px] text-[var(--ink)] mb-1">Spot Confirmed</div>
                  <p className="text-[13px] font-[500] text-[var(--ink-soft)] leading-relaxed">
                    You have accepted your place on the GCL Summer '26 Team. Watch your inbox — onboarding details are on their way.
                  </p>
                  <Link href="/portal"
                    className="inline-block mt-4 text-[12px] font-[800] uppercase tracking-wider text-[var(--ink)] border-b-2 border-[var(--ink)] hover:opacity-50 transition-opacity">
                    Go to Team Portal →
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {state === 'declined' && (
            <motion.div key="declined"
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 border-[2.5px] border-[var(--ink-faint)] bg-[var(--paper-alt)] flex items-center justify-center shrink-0 text-[var(--ink-faint)] font-[800] text-[18px]">—</div>
                <div>
                  <div className="font-[800] text-[15px] text-[var(--ink)] mb-1">Response Recorded</div>
                  <p className="text-[13px] font-[500] text-[var(--ink-soft)] leading-relaxed">
                    We're sorry you won't be joining us this cycle. Your spot will be offered to the next candidate. We hope to see you in a future cohort.
                  </p>
                  <button onClick={() => setState('pending')}
                    className="inline-block mt-4 text-[12px] font-[600] text-[var(--ink-faint)] hover:text-[var(--ink)] transition-colors underline underline-offset-2">
                    Changed your mind?
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
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
    audio.volume = 0.35; audio.loop = true;
    const play = () => audio.play().catch(() => {});
    play();
    const onGesture = () => { play(); document.removeEventListener('click', onGesture); };
    document.addEventListener('click', onGesture);
    return () => document.removeEventListener('click', onGesture);
  }, []);

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !audioRef.current.muted;
    setMuted(audioRef.current.muted);
  };

  return (
    <main className="min-h-screen pb-24" style={{ background: 'var(--paper)' }}>
      <audio ref={audioRef} src="/ribs-lorde.mp3" preload="auto" />
      <ConfettiCanvas />

      {/* ── Dark hero strip ── */}
      <section className="pt-[80px] pb-0" style={{ background: 'var(--brutal-bg)' }}>
        <div className="max-w-[1160px] mx-auto px-8">

          {/* Top bar */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <Link href="/"><img src={logoImg} alt="GCL" className="h-8 object-contain" /></Link>
            <button onClick={toggleMute}
              className="text-[12px] font-[700] uppercase tracking-wider text-white/40 hover:text-white/70 transition-colors">
              {muted ? 'Unmute' : 'Mute'}
            </button>
          </div>

          {/* Eyebrow + heading */}
          <div className="py-10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15, duration: 0.7 }}
              className="text-[11px] font-[800] uppercase tracking-[0.18em] text-[var(--neon-cyan)] mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--neon-cyan)]" />
              GCL Summer 2026 — Official Notice
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.7 }}
              className="text-[clamp(42px,7vw,88px)] text-white">
              <ScatterHeading />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Marquee tape ── */}
      <MarqueeTape />

      {/* ── White content ── */}
      <section className="bg-white py-12">
        <div className="max-w-[1160px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-8">

            {/* Letter */}
            <div>
              <div className="space-y-5 mb-8"
                style={{ fontSize: '15px', lineHeight: '1.82', fontWeight: 500, color: 'var(--ink)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <p>
                  Out of over 1,300 applications received from around the world, you have been selected as one of 30 members of the Global Capital League Summer 2026 Team. Your application stood out as exceptional.
                </p>
                <p>
                  You are now part of a cohort of students and young professionals who will facilitate workshops, develop financial literacy curriculum, and engage communities across 14 countries. This is a substantive, competitive volunteer program — and you have earned your place in it.
                </p>
                <p>
                  Onboarding materials and your program schedule will be sent to your registered email shortly. Please review all correspondence carefully and complete any required forms within the specified deadlines.
                </p>
                <p style={{ color: 'var(--ink-soft)' }}>
                  Welcome to the Global Capital League.<br />— The GCL Program Team
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/portal"
                  className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-[800] uppercase tracking-wider text-white border-[2px] border-[var(--ink)] bg-[var(--ink)] shadow-[4px_4px_0px_var(--ink)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_var(--ink)] transition-all">
                  Go to Team Portal →
                </Link>
                <Link href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-[800] uppercase tracking-wider text-[var(--ink)] border-[2px] border-[var(--ink)] bg-white shadow-[4px_4px_0px_var(--ink)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_var(--ink)] transition-all">
                  Return Home
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Accept / Decline */}
              <RsvpBox />

              {/* Program card */}
              <div className="border-[2.5px] border-[var(--ink)] shadow-[6px_6px_0px_var(--ink)] bg-white">
                <div className="p-5 border-b-[2.5px] border-[var(--ink)]" style={{ background: 'var(--brutal-bg)' }}>
                  <div className="text-[10px] font-[800] uppercase tracking-[0.15em] text-white/40 mb-1">Program</div>
                  <div className="font-[800] text-[17px] text-white leading-tight">GCL Summer '26 Team</div>
                </div>
                <div className="divide-y divide-[var(--line)]">
                  {[
                    { label: 'Type', value: 'Volunteer · Competitive' },
                    { label: 'Cohort Size', value: '30 members' },
                    { label: 'Duration', value: 'Summer 2026' },
                    { label: 'Regions', value: '14+ Countries' },
                    { label: 'Status', value: 'Accepted', green: true },
                  ].map(row => (
                    <div key={row.label} className="px-5 py-3.5 flex items-center justify-between gap-4">
                      <span className="text-[12px] font-[600] uppercase tracking-wider text-[var(--ink-faint)]">{row.label}</span>
                      <span className="text-[13px] font-[700] text-right"
                        style={{ color: row.green ? '#166534' : 'var(--ink)' }}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
