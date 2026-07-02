import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/courses', label: 'Courses' },
  { href: '/events', label: 'Events' },
  { href: '/news', label: 'News' },
];

export function Nav() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAdmin } = useAdmin();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    handleScroll(); // reflect real scroll position on mount (back-nav, restored scroll)
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const isActive = (href: string) => href === '/' ? location === '/' : location.startsWith(href);

  // On home at top = dark hero video beneath nav → use light/white text
  const isHome = location === '/';
  const heroMode = isHome && !scrolled;

  return (
    <>
      <div className="sticky top-0 z-50 flex justify-center px-5 pt-4 pb-0 pointer-events-none">
        <nav
          className="pointer-events-auto w-full max-w-[1180px] flex items-center justify-between px-5 py-3 rounded-[16px] transition-all duration-500"
          style={{
            background: heroMode
              ? 'rgba(6,4,18,0.18)'
              : scrolled
                ? 'rgba(255,255,255,0.07)'
                : 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(36px) saturate(200%) brightness(1.1)',
            WebkitBackdropFilter: 'blur(36px) saturate(200%) brightness(1.1)',
            border: heroMode
              ? '1px solid rgba(255,255,255,0.14)'
              : '1px solid rgba(255,255,255,0.22)',
            boxShadow: heroMode
              ? '0 2px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)'
              : '0 4px 28px rgba(21,19,44,0.07), inset 0 1px 0 rgba(255,255,255,0.5)',
          }}
          data-testid="nav"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-[10px] font-[800] text-[18px] shrink-0" data-testid="nav-logo">
            <div
              className="w-[26px] h-[26px] rounded-full shrink-0 relative"
              style={{
                background: 'conic-gradient(from 200deg, #3358ff, #8b5cf6, #e93fc7, #33c7e8, #3358ff)',
                boxShadow: '0 3px 10px rgba(21,19,44,0.25)',
              }}
            >
              <div className="absolute inset-0 rounded-full" style={{
                background: 'linear-gradient(transparent 45%, rgba(255,255,255,0.55) 46%, rgba(255,255,255,0.55) 54%, transparent 55%), linear-gradient(90deg, transparent 45%, rgba(255,255,255,0.55) 46%, rgba(255,255,255,0.55) 54%, transparent 55%)',
              }} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-[800]" style={{ color: heroMode ? '#fff' : 'var(--ink)' }}>GCL</span>
              <span className="text-[8.5px] font-[600] tracking-[0.13em] uppercase"
                style={{ color: heroMode ? 'rgba(255,255,255,0.5)' : 'var(--ink-faint)' }}>
                Global Capital League
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-0.5">
            {navLinks.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="relative px-[14px] py-[9px] text-[14px] font-[600] rounded-[10px] transition-colors duration-200 block"
                  style={{
                    color: heroMode
                      ? isActive(link.href) ? '#fff' : 'rgba(255,255,255,0.65)'
                      : isActive(link.href) ? 'var(--ink)' : 'var(--ink-soft)',
                  }}
                  data-testid={`nav-${link.label.toLowerCase()}`}
                >
                  {isActive(link.href) && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-[10px]"
                      style={{ background: heroMode ? 'rgba(255,255,255,0.12)' : 'rgba(21,19,44,0.06)' }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-2">
            {isAdmin ? (
              <Link href="/admin"
                className="text-[13px] font-[700] px-4 py-2 rounded-[10px] transition-colors"
                style={{ color: heroMode ? 'rgba(255,255,255,0.8)' : 'var(--ink)' }}
                data-testid="nav-admin">
                ⚙ Admin
              </Link>
            ) : (
              <Link href="/signin"
                className="text-[13.5px] font-[600] px-4 py-2 rounded-[10px] transition-colors"
                style={{ color: heroMode ? 'rgba(255,255,255,0.6)' : 'var(--ink-soft)' }}
                data-testid="nav-signin">
                Sign In
              </Link>
            )}
            <Link
              href="/courses"
              className="text-[13.5px] font-[700] px-5 py-2.5 rounded-[10px] text-white transition-all hover:-translate-y-[1px]"
              style={{
                background: heroMode
                  ? 'rgba(255,255,255,0.15)'
                  : 'var(--ink)',
                border: heroMode ? '1px solid rgba(255,255,255,0.25)' : 'none',
                backdropFilter: heroMode ? 'blur(10px)' : 'none',
                boxShadow: heroMode ? 'none' : '3px 3px 0px rgba(21,19,44,0.25)',
              }}
              data-testid="nav-cta"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden p-2 rounded-[10px] transition-colors"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Menu"
            style={{ color: heroMode ? '#fff' : 'var(--ink)' }}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-5"
            style={{ background: 'rgba(6,4,20,0.92)', backdropFilter: 'blur(24px)' }}
          >
            {navLinks.map((link, i) => (
              <motion.div key={link.href} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.055 }}>
                <Link href={link.href} className="text-[34px] font-[800] tracking-tight text-white uppercase">
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}>
              <Link href="/signin" className="text-[18px] font-[600] text-white/50">Sign In</Link>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.34 }}>
              <Link href="/courses"
                className="mt-2 text-[15px] font-[800] px-8 py-4 rounded-[12px] text-white uppercase tracking-wide border border-white/20"
                style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)' }}>
                Get Started →
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
