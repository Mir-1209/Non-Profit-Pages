import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, LayoutDashboard, Settings, LogOut, ShieldCheck, Users } from 'lucide-react';
import { useAppAuth } from '../context/AuthContext';
import logoImg from '@assets/Untitled_design-9_1783003171841.png';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/chapters', label: 'Chapters' },
  { href: '/courses', label: 'Courses' },
  { href: '/events', label: 'Events' },
  { href: '/news', label: 'News' },
];

function initials(name: string | null | undefined) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return parts.slice(0, 2).map(p => p[0]?.toUpperCase()).join('') || '?';
}

function ProfileMenu({ darkNav }: { darkNav: boolean }) {
  const { user, role, isTeam, isAdmin, logout } = useAppAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.email || 'Member';
  const dashboardHref = isAdmin ? '/admin' : isTeam ? '/portal' : '/dashboard';
  const roleLabel = isAdmin ? 'Admin' : role === 'gcl_team' ? 'GCL Team' : 'Member';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full transition-colors"
        style={{
          background: darkNav ? 'rgba(255,255,255,0.08)' : 'rgba(21,19,44,0.05)',
          border: darkNav ? '1px solid rgba(255,255,255,0.15)' : '1px solid var(--line)',
        }}
        data-testid="nav-profile-trigger"
      >
        {user?.profileImageUrl ? (
          <img src={user.profileImageUrl} alt={displayName} className="w-7 h-7 rounded-full object-cover" />
        ) : (
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-[800] text-white shrink-0"
            style={{ background: 'var(--grad-brand)' }}
          >
            {initials(displayName)}
          </div>
        )}
        <ChevronDown size={14} style={{ color: darkNav ? 'rgba(255,255,255,0.7)' : 'var(--ink-soft)' }} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-[calc(100%+10px)] w-[240px] rounded-[16px] overflow-hidden z-50"
            style={{ background: 'var(--paper)', border: '1.5px solid var(--line)', boxShadow: '0 12px 32px rgba(21,19,44,0.18)' }}
          >
            <div className="px-4 py-3.5 border-b border-[var(--line)] flex items-center gap-3">
              {user?.profileImageUrl ? (
                <img src={user.profileImageUrl} alt={displayName} className="w-9 h-9 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-[800] text-white shrink-0" style={{ background: 'var(--grad-brand)' }}>
                  {initials(displayName)}
                </div>
              )}
              <div className="min-w-0">
                <div className="font-[700] text-[13.5px] truncate" style={{ color: 'var(--ink)' }}>{displayName}</div>
                <div className="text-[11px] font-[700] uppercase tracking-wide" style={{ color: 'var(--violet)' }}>{roleLabel}</div>
              </div>
            </div>
            <div className="py-1.5">
              <Link href={dashboardHref} onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-[13.5px] font-[600] hover:bg-[var(--paper-alt)] transition-colors" style={{ color: 'var(--ink)' }}>
                {isAdmin ? <ShieldCheck size={16} /> : isTeam ? <Users size={16} /> : <LayoutDashboard size={16} />}
                {isAdmin ? 'Admin Panel' : isTeam ? 'Team Portal' : 'Dashboard'}
              </Link>
              <Link href={isAdmin ? '/admin' : '/dashboard'} onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-[13.5px] font-[600] hover:bg-[var(--paper-alt)] transition-colors" style={{ color: 'var(--ink)' }}>
                <Settings size={16} />
                Settings
              </Link>
            </div>
            <div className="py-1.5 border-t border-[var(--line)]">
              <button onClick={() => { setOpen(false); logout(); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13.5px] font-[700] text-red-500 hover:bg-red-50 transition-colors">
                <LogOut size={16} />
                Log Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Nav() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, isTeam, isAdmin, login, logout } = useAppAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    handleScroll(); // reflect real scroll position on mount (back-nav, restored scroll)
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const isActive = (href: string) => href === '/' ? location === '/' : location.startsWith(href);

  // Always use light text — site is predominantly dark-themed; scrolled nav gets solid dark glass
  const isHome = location === '/';
  const heroMode = isHome && !scrolled;
  const darkNav = heroMode || scrolled; // both states use white text

  return (
    <>
      <div className="sticky top-0 z-50 flex justify-center px-5 pt-4 pb-0 pointer-events-none">
        <nav
          className="pointer-events-auto w-full max-w-[1180px] flex items-center justify-between px-5 py-3 rounded-[16px] transition-all duration-500 border-t-[2px] border-r-[2px] border-b-[2px] border-l-[2px] rounded-tl-[30px] rounded-tr-[30px] rounded-br-[30px] rounded-bl-[30px] border-t-[#ffffff00] border-r-[#ffffff00] border-b-[#ffffff00] border-l-[#ffffff00]"
          style={{
            background: darkNav
              ? 'rgba(8, 5, 22, 0.72)'
              : 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(36px) saturate(200%) brightness(1.1)',
            WebkitBackdropFilter: 'blur(36px) saturate(200%) brightness(1.1)',
            border: darkNav
              ? '1px solid rgba(255,255,255,0.12)'
              : '1px solid rgba(255,255,255,0.22)',
            boxShadow: darkNav
              ? '0 2px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.07)'
              : '0 4px 28px rgba(21,19,44,0.07), inset 0 1px 0 rgba(255,255,255,0.5)',
          }}
          data-testid="nav"
        >
          {/* Logo */}
          <Link href="/" className="shrink-0" data-testid="nav-logo">
            <img
              src={logoImg}
              alt="Global Capital League"
              className="h-[44px] w-auto object-contain"
            />
          </Link>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-0.5">
            {navLinks.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="relative px-[14px] py-[9px] text-[14px] font-[600] rounded-[10px] transition-colors duration-200 block"
                  style={{
                    color: darkNav
                      ? isActive(link.href) ? '#fff' : 'rgba(255,255,255,0.65)'
                      : isActive(link.href) ? 'var(--ink)' : 'var(--ink-soft)',
                  }}
                  data-testid={`nav-${link.label.toLowerCase()}`}
                >
                  {isActive(link.href) && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-[10px]"
                      style={{ background: darkNav ? 'rgba(255,255,255,0.12)' : 'rgba(21,19,44,0.06)' }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-2.5">
            {!isAuthenticated && (
              <button
                onClick={login}
                className="text-[13.5px] font-[600] px-4 py-2 rounded-[10px] transition-colors"
                style={{ color: darkNav ? 'rgba(255,255,255,0.6)' : 'var(--ink-soft)' }}
                data-testid="nav-signin">
                Sign In
              </button>
            )}
            {isAuthenticated ? (
              <>
                <ProfileMenu darkNav={darkNav} />
                <Link
                  href={isAdmin ? '/admin' : isTeam ? '/portal' : '/dashboard'}
                  className="text-[13.5px] font-[700] px-5 py-2.5 rounded-[10px] text-white transition-all hover:-translate-y-[1px]"
                  style={{
                    background: darkNav ? 'rgba(255,255,255,0.15)' : 'var(--ink)',
                    border: darkNav ? '1px solid rgba(255,255,255,0.25)' : 'none',
                    backdropFilter: darkNav ? 'blur(10px)' : 'none',
                    boxShadow: darkNav ? 'none' : '3px 3px 0px rgba(21,19,44,0.25)',
                  }}
                  data-testid="nav-dashboard"
                >
                  {isAdmin ? 'Admin Panel' : isTeam ? 'Team Portal' : 'Dashboard'}
                </Link>
              </>
            ) : (
              <Link
                href="/courses"
                className="text-[13.5px] font-[700] px-5 py-2.5 rounded-[10px] text-white transition-all hover:-translate-y-[1px]"
                style={{
                  background: darkNav ? 'rgba(255,255,255,0.15)' : 'var(--ink)',
                  border: darkNav ? '1px solid rgba(255,255,255,0.25)' : 'none',
                  backdropFilter: darkNav ? 'blur(10px)' : 'none',
                  boxShadow: darkNav ? 'none' : '3px 3px 0px rgba(21,19,44,0.25)',
                }}
                data-testid="nav-cta"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden p-2 rounded-[10px] transition-colors"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Menu"
            style={{ color: darkNav ? '#fff' : 'var(--ink)' }}
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
            {isAuthenticated ? (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}>
                  <Link href={isAdmin ? '/admin' : isTeam ? '/portal' : '/dashboard'} className="text-[18px] font-[600] text-white/50">Settings</Link>
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.31 }}>
                  <button onClick={logout} className="text-[18px] font-[600] text-white/50">Log Out</button>
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.34 }}>
                  <Link href={isAdmin ? '/admin' : isTeam ? '/portal' : '/dashboard'}
                    className="mt-2 text-[15px] font-[800] px-8 py-4 rounded-[12px] text-white uppercase tracking-wide border border-white/20"
                    style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)' }}>
                    {isAdmin ? 'Admin Panel' : isTeam ? 'Team Portal' : 'Dashboard'} →
                  </Link>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}>
                  <button onClick={login} className="text-[18px] font-[600] text-white/50">Sign In</button>
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.34 }}>
                  <Link href="/courses"
                    className="mt-2 text-[15px] font-[800] px-8 py-4 rounded-[12px] text-white uppercase tracking-wide border border-white/20"
                    style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)' }}>
                    Get Started →
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
