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
    const handleScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const isActive = (href: string) => href === '/' ? location === '/' : location.startsWith(href);

  return (
    <>
      <div className="sticky top-0 z-50 flex justify-center px-5 pt-4 pb-0 pointer-events-none">
        <nav
          className="pointer-events-auto w-full max-w-[1180px] flex items-center justify-between px-5 py-3 rounded-[16px] transition-all duration-300"
          style={{
            background: scrolled
              ? 'rgba(255,255,255,0.82)'
              : 'rgba(255,255,255,0.62)',
            backdropFilter: 'blur(28px) saturate(180%)',
            WebkitBackdropFilter: 'blur(28px) saturate(180%)',
            border: scrolled
              ? '1.5px solid rgba(21,19,44,0.12)'
              : '1.5px solid rgba(255,255,255,0.5)',
            boxShadow: scrolled
              ? '0 8px 32px rgba(21,19,44,0.10), inset 0 1px 0 rgba(255,255,255,0.8)'
              : '0 2px 16px rgba(21,19,44,0.06), inset 0 1px 0 rgba(255,255,255,0.6)',
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
              <span className="text-[var(--ink)] font-[800]">GCL</span>
              <span className="text-[8.5px] font-[600] tracking-[0.13em] text-[var(--ink-faint)] uppercase">Global Capital League</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-0.5">
            {navLinks.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="relative px-[14px] py-[9px] text-[14px] font-[600] rounded-[10px] transition-colors duration-200 block"
                  style={{ color: isActive(link.href) ? 'var(--ink)' : 'var(--ink-soft)' }}
                  data-testid={`nav-${link.label.toLowerCase()}`}
                >
                  {isActive(link.href) && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-[10px]"
                      style={{ background: 'rgba(21,19,44,0.06)' }}
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
                className="text-[13px] font-[700] px-4 py-2 rounded-[10px] text-[var(--ink)] hover:bg-black/5 transition-colors"
                data-testid="nav-admin">
                ⚙ Admin
              </Link>
            ) : (
              <Link href="/signin"
                className="text-[13.5px] font-[600] px-4 py-2 rounded-[10px] text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-black/5 transition-colors"
                data-testid="nav-signin">
                Sign In
              </Link>
            )}
            <Link
              href="/courses"
              className="text-[13.5px] font-[700] px-5 py-2.5 rounded-[10px] text-white transition-all hover:-translate-y-[1px] hover:shadow-[0_4px_14px_rgba(21,19,44,0.3)]"
              style={{ background: 'var(--ink)', boxShadow: '3px 3px 0px rgba(21,19,44,0.25)' }}
              data-testid="nav-cta"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden p-2 rounded-[10px] text-[var(--ink)] hover:bg-black/5 transition-colors"
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-5"
            style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(20px)' }}
          >
            {navLinks.map((link, i) => (
              <motion.div key={link.href} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.055 }}>
                <Link href={link.href} className="text-[34px] font-[800] tracking-tight text-[var(--ink)] uppercase">
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}>
              <Link href="/signin" className="text-[18px] font-[600] text-[var(--ink-soft)]">Sign In</Link>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.34 }}>
              <Link href="/courses"
                className="mt-2 text-[15px] font-[800] px-8 py-4 rounded-[12px] text-white uppercase tracking-wide"
                style={{ background: 'var(--ink)', boxShadow: '4px 4px 0px rgba(21,19,44,0.25)' }}>
                Get Started →
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
