import React from 'react';
import { Link } from 'wouter';

export function Footer() {
  return (
    <footer
      className="mt-16 overflow-hidden text-white"
      style={{ background: 'var(--footer-bg)', paddingTop: '80px', borderRadius: '48px 48px 0 0' }}
    >
      <div className="max-w-[1240px] mx-auto px-8">

        {/* Main columns */}
        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr_1fr_1fr] gap-10 pb-14 border-b border-white/10">

          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-[10px] font-[800] text-[18px] mb-4">
              <div
                className="w-[26px] h-[26px] rounded-full shrink-0 relative"
                style={{
                  background: 'conic-gradient(from 200deg, var(--blue), var(--violet), var(--magenta), #33c7e8, var(--blue))',
                  boxShadow: '0 3px 10px rgba(139,92,246,0.35)',
                }}
              >
                <div className="absolute inset-0 rounded-full" style={{
                  background: 'linear-gradient(transparent 45%, rgba(255,255,255,0.55) 46%, rgba(255,255,255,0.55) 54%, transparent 55%), linear-gradient(90deg, transparent 45%, rgba(255,255,255,0.55) 46%, rgba(255,255,255,0.55) 54%, transparent 55%)',
                }} />
              </div>
              <div className="flex flex-col leading-tight">
                <span style={{ background: 'var(--grad-brand)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>GCL</span>
                <span className="text-[8.5px] font-[600] tracking-[0.13em] text-white/50 uppercase">Global Capital League</span>
              </div>
            </Link>
            <p className="text-[14px] leading-[1.75] text-white/60 max-w-[270px] mt-3">
              A youth-led organization dedicated to reducing poverty through financial education and behavioral economics — built for communities the world forgot.
            </p>
            <div className="flex gap-3 mt-6">
              {['IG', 'LI', 'TT', 'YT'].map(s => (
                <a
                  key={s}
                  href="#"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-[800] text-white/70 hover:text-white transition-colors"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h6 className="text-[11px] tracking-[0.09em] uppercase text-white/40 mb-5 font-[700]">Product</h6>
            <Link href="/courses" className="block text-[14px] text-white/70 mb-3 hover:text-white transition-colors font-[500]">Courses</Link>
            <Link href="/programs" className="block text-[14px] text-white/70 mb-3 hover:text-white transition-colors font-[500]">Programs</Link>
            <Link href="/events" className="block text-[14px] text-white/70 mb-3 hover:text-white transition-colors font-[500]">Events</Link>
          </div>

          <div>
            <h6 className="text-[11px] tracking-[0.09em] uppercase text-white/40 mb-5 font-[700]">Company</h6>
            <Link href="/about" className="block text-[14px] text-white/70 mb-3 hover:text-white transition-colors font-[500]">About Us</Link>
            <Link href="/stories" className="block text-[14px] text-white/70 mb-3 hover:text-white transition-colors font-[500]">Stories</Link>
            <Link href="/blog" className="block text-[14px] text-white/70 mb-3 hover:text-white transition-colors font-[500]">Blog</Link>
            <a href="mailto:hello@globalcapitalleague.org" className="block text-[14px] text-white/70 mb-3 hover:text-white transition-colors font-[500]">Contact</a>
          </div>

          <div>
            <h6 className="text-[11px] tracking-[0.09em] uppercase text-white/40 mb-5 font-[700]">Social</h6>
            <a href="#" className="block text-[14px] text-white/70 mb-3 hover:text-white transition-colors font-[500]">Instagram</a>
            <a href="#" className="block text-[14px] text-white/70 mb-3 hover:text-white transition-colors font-[500]">LinkedIn</a>
            <a href="#" className="block text-[14px] text-white/70 mb-3 hover:text-white transition-colors font-[500]">TikTok</a>
            <a href="#" className="block text-[14px] text-white/70 mb-3 hover:text-white transition-colors font-[500]">YouTube</a>
          </div>

          <div>
            <h6 className="text-[11px] tracking-[0.09em] uppercase text-white/40 mb-5 font-[700]">Legal</h6>
            <Link href="/privacy" className="block text-[14px] text-white/70 mb-3 hover:text-white transition-colors font-[500]">Privacy Policy</Link>
            <Link href="/terms" className="block text-[14px] text-white/70 mb-3 hover:text-white transition-colors font-[500]">Terms of Use</Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex justify-between items-center py-6 text-[12.5px] text-white/45 flex-wrap gap-3">
          <span>© {new Date().getFullYear()} Global Capital League. All rights reserved.</span>
          <span className="italic">Made by youth, for the world.</span>
        </div>
      </div>

      {/* Ghost word — stacked GLOBAL / CAPITAL / LEAGUE */}
      <div
        className="text-center leading-[0.88] tracking-[-0.02em] select-none pb-0 pt-2 px-4"
        style={{
          fontWeight: 800,
          textTransform: 'uppercase',
          fontSize: 'min(17vw, 190px)',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(255,255,255,0.11)',
        }}
      >
        <div>GLOBAL</div>
        <div>CAPITAL</div>
        <div>LEAGUE</div>
      </div>
    </footer>
  );
}
