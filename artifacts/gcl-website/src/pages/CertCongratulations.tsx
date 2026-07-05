import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useParams } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useCertificates } from '../context/CertificateContext';
import { useAppAuth } from '../context/AuthContext';
import logoImg from '@assets/Untitled_design-9_1783003171841.png';

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, '') ?? '';

// ── Confetti ──────────────────────────────────────────────────────────────────

const COLORS = ['#5eeaff','#fff','#f6f4ff','#a78bfa','#34d399','#fbbf24','#f472b6'];

function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<any[]>([]);
  const raf = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width = window.innerWidth;
    const H = canvas.height = window.innerHeight;

    for (let i = 0; i < 120; i++) {
      particles.current.push({
        x: Math.random() * W,
        y: Math.random() * H - H,
        r: Math.random() * 6 + 3,
        d: Math.random() * 80 + 20,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        tilt: Math.random() * 10 - 10,
        tiltAngleIncrement: Math.random() * 0.07 + 0.05,
        tiltAngle: 0,
        shape: Math.random() > 0.5 ? 'rect' : 'circle',
      });
    }

    let angle = 0;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      angle += 0.01;
      particles.current.forEach((p, i) => {
        ctx.beginPath();
        ctx.fillStyle = p.color;
        p.tiltAngle += p.tiltAngleIncrement;
        p.y += (Math.cos(angle + p.d) + 1 + p.r / 2) * 1.6;
        p.x += Math.sin(angle) * 1.2;
        p.tilt = Math.sin(p.tiltAngle) * 12;
        if (p.shape === 'rect') {
          ctx.save();
          ctx.translate(p.x + p.r / 2, p.y + p.r / 2);
          ctx.rotate((p.tilt * Math.PI) / 180);
          ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
          ctx.restore();
        } else {
          ctx.arc(p.x, p.y, p.r / 2, 0, 2 * Math.PI);
          ctx.fill();
        }
        if (p.y > H) { particles.current[i] = { ...p, y: -20, x: Math.random() * W }; }
      });
      raf.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />;
}

// ── Scatter heading ───────────────────────────────────────────────────────────

function ScatterHeading({ text }: { text: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offsets, setOffsets] = useState<{ x: number; y: number; r: number }[]>(() =>
    text.split('').map(() => ({
      x: (Math.random() - 0.5) * 60,
      y: (Math.random() - 0.5) * 40,
      r: (Math.random() - 0.5) * 12,
    }))
  );

  const handleMouse = useCallback((e: MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    setOffsets(prev => prev.map((o, i) => {
      const letterX = (i / text.length) * rect.width;
      const letterY = rect.height / 2;
      const dx = mx - letterX;
      const dy = my - letterY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const force = Math.max(0, 1 - dist / 280);
      return {
        x: o.x - dx * force * 0.04,
        y: o.y - dy * force * 0.04,
        r: o.r,
      };
    }));
  }, [text]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [handleMouse]);

  return (
    <div ref={containerRef} className="flex flex-wrap justify-center gap-0" style={{ fontFamily: "'Playfair Display', serif" }}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          animate={{ x: offsets[i]?.x ?? 0, y: offsets[i]?.y ?? 0, rotate: offsets[i]?.r ?? 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          className="font-[900] text-[clamp(40px,7vw,88px)] leading-[0.9] tracking-[-0.02em] text-white select-none"
        >
          {ch === ' ' ? '\u00a0' : ch}
        </motion.span>
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function CertCongratulations() {
  const { token } = useParams<{ token: string }>();
  const { getCongratByToken, getCertById, recordCongratView } = useCertificates();
  const { user, isAuthenticated } = useAppAuth();
  const [showConfetti, setShowConfetti] = useState(false);
  const [rsvp, setRsvp] = useState<'accepted' | 'declined' | null>(null);

  const page = getCongratByToken(token ?? '');

  useEffect(() => {
    if (page && !page.revoked) {
      recordCongratView(token ?? '', user?.id);
      const t = setTimeout(() => setShowConfetti(true), 600);
      return () => clearTimeout(t);
    }
  }, [token]);

  // Access control
  if (!page) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-8" style={{ background: 'var(--brutal-bg)' }}>
        <img src={logoImg} alt="GCL" className="h-9 object-contain mb-8 brightness-0 invert opacity-60" />
        <div className="border-[2.5px] border-white/20 bg-white/5 p-10 max-w-[440px] w-full text-center">
          <div className="font-[800] text-[22px] uppercase tracking-[-0.02em] mb-3 text-white">Page Not Found</div>
          <p className="text-[14px] text-white/50 mb-6">This link is invalid, expired, or has been revoked.</p>
          <Link href={`${BASE}/`} className="inline-block px-6 py-3 border-[2px] border-white/30 text-white font-[800] text-[12px] uppercase tracking-wider hover:bg-white hover:text-[var(--brutal-bg)] transition-colors">Go Home</Link>
        </div>
      </main>
    );
  }

  if (page.revoked) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-8" style={{ background: 'var(--brutal-bg)' }}>
        <div className="border-[2.5px] border-red-400/40 bg-white/5 p-10 max-w-[440px] w-full text-center">
          <div className="font-[800] text-[22px] uppercase tracking-[-0.02em] mb-3 text-red-400">Link Revoked</div>
          <p className="text-[14px] text-white/50">This congratulations page has been revoked by the administrator.</p>
        </div>
      </main>
    );
  }

  if (page.expiresAt && new Date(page.expiresAt) < new Date()) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-8" style={{ background: 'var(--brutal-bg)' }}>
        <div className="border-[2.5px] border-amber-400/40 bg-white/5 p-10 max-w-[440px] w-full text-center">
          <div className="font-[800] text-[22px] uppercase tracking-[-0.02em] mb-3 text-amber-400">Link Expired</div>
          <p className="text-[14px] text-white/50">This link expired on {new Date(page.expiresAt).toLocaleDateString()}. Contact the organization for a new link.</p>
        </div>
      </main>
    );
  }

  if (page.accessMode === 'login' && (!isAuthenticated || user?.id !== page.memberId)) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-8" style={{ background: 'var(--brutal-bg)' }}>
        <img src={logoImg} alt="GCL" className="h-9 object-contain mb-8 brightness-0 invert opacity-60" />
        <div className="border-[2.5px] border-white/20 bg-white/5 p-10 max-w-[440px] w-full text-center">
          <div className="font-[800] text-[22px] uppercase tracking-[-0.02em] mb-3 text-white">Sign In Required</div>
          <p className="text-[14px] text-white/50 mb-6">This page is private and can only be viewed by the recipient.</p>
          <Link href={`${BASE}/signin`} className="inline-block px-6 py-3 border-[2px] border-[var(--neon-cyan)] text-[var(--neon-cyan)] font-[800] text-[12px] uppercase tracking-wider hover:bg-[var(--neon-cyan)] hover:text-[var(--brutal-bg)] transition-colors">Sign In</Link>
        </div>
      </main>
    );
  }

  const linkedCert = page.certificateId ? getCertById(page.certificateId) : undefined;

  return (
    <main className="min-h-screen relative overflow-hidden pb-24" style={{ background: 'var(--brutal-bg)' }}>
      {showConfetti && <Confetti />}

      <div className="relative z-20 max-w-[900px] mx-auto px-6">
        {/* Nav */}
        <div className="flex items-center justify-between py-6 border-b border-white/10">
          <Link href={`${BASE}/`}>
            <img src={logoImg} alt="GCL" className="h-7 object-contain brightness-0 invert opacity-70" />
          </Link>
          <div className="text-[10px] font-[800] uppercase tracking-[0.2em] text-[var(--neon-cyan)]">Global Capital League</div>
        </div>

        {/* Scatter heading */}
        <div className="pt-16 pb-8 text-center">
          <div className="text-[10px] font-[800] uppercase tracking-[0.28em] text-[var(--neon-cyan)] mb-8">
            A personal message from GCL
          </div>
          <ScatterHeading text="Congratulations." />
        </div>

        {/* Neon tape marquee */}
        <div className="overflow-hidden border-y-[2.5px] border-[var(--neon-cyan)] mb-14" style={{ background: 'var(--neon-cyan)' }}>
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            className="flex whitespace-nowrap py-2"
          >
            {Array(6).fill(null).map((_, i) => (
              <span key={i} className="mx-8 font-[900] text-[13px] uppercase tracking-[0.3em] text-[var(--brutal-bg)]">
                Welcome to {page.programName} &nbsp;·&nbsp; Global Capital League &nbsp;·&nbsp;
              </span>
            ))}
          </motion.div>
        </div>

        {/* Letter body */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="border-[2.5px] border-white/20 bg-white/5 backdrop-blur-sm p-10 mb-8"
        >
          <div className="text-[11px] font-[800] uppercase tracking-[0.2em] text-[var(--neon-cyan)] mb-5">
            Dear {page.recipientName},
          </div>
          <p className="text-[15px] text-white/80 font-[400] leading-[1.85] mb-6">
            {page.message}
          </p>
          <div className="text-[12px] text-white/40 font-[600] border-t border-white/10 pt-5">
            — The Global Capital League Team
          </div>
        </motion.div>

        {/* RSVP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="border-[2.5px] border-[var(--neon-cyan)] bg-white/5 p-8 mb-8"
        >
          <div className="text-[11px] font-[800] uppercase tracking-[0.2em] text-[var(--neon-cyan)] mb-4">
            Confirm Your Spot
          </div>
          <AnimatePresence mode="wait">
            {rsvp === null ? (
              <motion.div key="btns" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-3 flex-wrap">
                <button
                  onClick={() => setRsvp('accepted')}
                  className="px-8 py-4 border-[2.5px] border-[var(--neon-cyan)] bg-[var(--neon-cyan)] text-[var(--brutal-bg)] font-[800] text-[13px] uppercase tracking-wider hover:bg-transparent hover:text-[var(--neon-cyan)] transition-colors">
                  ✓ I Accept
                </button>
                <button
                  onClick={() => setRsvp('declined')}
                  className="px-8 py-4 border-[2.5px] border-white/30 text-white/50 font-[800] text-[13px] uppercase tracking-wider hover:border-white/60 hover:text-white transition-colors">
                  Decline
                </button>
              </motion.div>
            ) : rsvp === 'accepted' ? (
              <motion.div key="accepted" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
                <p className="font-[800] text-[var(--neon-cyan)] text-[17px] uppercase tracking-[-0.01em]">✓ Welcome aboard!</p>
                <p className="text-white/50 text-[13px] mt-1">We'll be in touch with next steps. See you soon.</p>
              </motion.div>
            ) : (
              <motion.div key="declined" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="font-[700] text-white/60 text-[15px]">Understood. We'll miss you. You can always reach out if circumstances change.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Certificate link */}
        {linkedCert && linkedCert.visibility === 'link' && !linkedCert.revoked && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="border-[2px] border-white/20 p-6 flex items-center justify-between gap-4 flex-wrap"
          >
            <div>
              <div className="text-[10px] font-[800] uppercase tracking-[0.18em] text-white/40 mb-1">Your Certificate</div>
              <div className="font-[700] text-[14px] text-white">{linkedCert.programName}</div>
              <div className="text-[11.5px] text-white/40 font-mono mt-0.5">{linkedCert.id}</div>
            </div>
            <Link
              href={`${BASE}/certificate/${linkedCert.token}`}
              className="px-6 py-3 border-[2px] border-white/30 text-white font-[800] text-[11px] uppercase tracking-wider hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)] transition-colors shrink-0"
            >
              View Certificate →
            </Link>
          </motion.div>
        )}
      </div>
    </main>
  );
}
