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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-14 border-b border-white/10">

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
