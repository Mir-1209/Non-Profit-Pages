import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/programs', label: 'Programs' },
  { href: '/courses', label: 'Courses' },
  { href: '/events', label: 'Events' },
  { href: '/about', label: 'About' },
  { href: '/stories', label: 'Stories' },
  { href: '/blog', label: 'Blog' },
];

export function Nav() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      <div className="sticky top-0 z-50 flex justify-center px-6 pt-[18px] pb-0 pointer-events-none">
        <nav
          className="pointer-events-auto w-full max-w-[1180px] flex items-center justify-between px-5 py-3 rounded-[100px] transition-all duration-300"
          style={{
            background: scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.82)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            border: '1px solid rgba(21,19,44,0.06)',
            boxShadow: scrolled ? 'var(--shadow-md)' : 'var(--shadow-sm)',
          }}
          data-testid="nav"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-[10px] font-[800] text-[18px] shrink-0 group" data-testid="nav-logo">
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
              <span className="text-[8.5px] font-[600] tracking-[0.13em] text-[var(--ink-faint)] uppercase">Global Capital League</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-1" role="navigation">
            {navLinks.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="relative px-[14px] py-[9px] text-[14.5px] font-[500] rounded-full transition-colors duration-200 block"
                  style={{ color: location === link.href ? 'var(--ink)' : 'var(--ink-soft)' }}
                  data-testid={`nav-${link.label.toLowerCase()}`}
                >
                  {location === link.href && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-[var(--paper-alt)]"
                      transition={{ type: 'spring', bounce: 0.25, duration: 0.4 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/about" className="text-[14px] font-[600] px-4 py-2 rounded-full text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors" data-testid="nav-signin">
              Sign In
            </Link>
            <Link
              href="/courses"
              className="text-[14px] font-[600] px-5 py-[10px] rounded-full text-white transition-all hover:-translate-y-[1px]"
              style={{ background: 'var(--grad-brand)', boxShadow: '0 4px 14px rgba(139,92,246,0.28)' }}
              data-testid="nav-cta"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden p-2 rounded-full text-[var(--ink)]"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Menu"
            data-testid="nav-burger"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </div>

      {/* Mobile Panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-center gap-6"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.055 }}
              >
                <Link href={link.href} className="text-[32px] font-[800] tracking-tight text-[var(--ink)]">
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.38 }}>
              <Link
                href="/courses"
                className="mt-4 text-[16px] font-[700] px-8 py-4 rounded-full text-white"
                style={{ background: 'var(--grad-brand)' }}
              >
                Get Started →
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
