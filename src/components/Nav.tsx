import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { donateHref, mailto, nav, site } from '../config/site';
import { useLenis } from '../lib/smooth';
import logoImg from '../assets/media/gcl-logo.webp';
import { EASE, EASE_IN_OUT } from './primitives';

import imgAbout from '../assets/media/speaker.webp';
import imgPrograms from '../assets/media/school-kids-1.webp';
import imgChapters from '../assets/media/selfie.webp';
import imgEvents from '../assets/media/session-wide.webp';
import imgTeam from '../assets/media/trio.webp';
import imgInvolved from '../assets/media/school-kids-3.webp';
import imgIndex from '../assets/media/reel-group-poster.webp';

const previews: Record<string, string> = {
  '/': imgIndex,
  '/about': imgAbout,
  '/programs': imgPrograms,
  '/chapters': imgChapters,
  '/events': imgEvents,
  '/team': imgTeam,
  '/get-involved': imgInvolved,
};

export function useClock(timeZone: string) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(now);
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [location] = useLocation();
  const lenis = useLenis();
  const time = useClock(site.hq.timeZone);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > 160 && y > prev);
  });

  useEffect(() => setOpen(false), [location]);

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, lenis]);

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-signal focus:px-4 focus:py-2 focus:text-ink">
        Skip to content
      </a>

      {/* Floating glass bar with the GCL logo, main links and actions */}
      <motion.header
        className="fixed inset-x-0 top-0 z-[70] px-3 pt-3 sm:px-[var(--gutter)] sm:pt-4"
        animate={{ y: hidden && !open ? -110 : 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <div className="mx-auto flex h-[64px] max-w-[1480px] items-center justify-between gap-4 rounded-full border border-white/10 bg-ink/85 pl-5 pr-2 shadow-[0_18px_50px_-20px_rgba(10,22,51,0.6)] backdrop-blur-xl">
          <Link href="/" aria-label={`${site.name} — home`} className="flex shrink-0 items-center">
            <img src={logoImg} alt={site.name} width={640} height={247} className="h-[38px] w-auto sm:h-[42px]" />
          </Link>
          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {nav.slice(1).map((item) => {
              const active = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`rounded-full px-4 py-2 text-[14px] font-[560] transition-colors ${active ? 'bg-white/12 text-white' : 'text-white/70 hover:bg-white/8 hover:text-white'}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <span className="mono hidden text-white/50 xl:inline">
              {site.hq.city} <span className="tabular text-white/80">{time.slice(0, 5)}</span>
            </span>
            <a
              href={donateHref}
              className="rounded-full bg-signal px-5 py-2.5 text-[13px] font-[700] text-ink shadow-[0_0_24px_rgba(58,169,255,0.45)] transition-transform duration-300 hover:scale-[1.04]"
            >
              Donate
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 lg:hidden"
            >
              <span className="relative block h-3 w-4">
                <motion.span className="absolute left-0 top-0 h-[2px] w-4 rounded bg-current" animate={{ rotate: open ? 45 : 0, y: open ? 5 : 0 }} />
                <motion.span className="absolute left-0 top-[5px] h-[2px] w-4 rounded bg-current" animate={{ opacity: open ? 0 : 1 }} />
                <motion.span className="absolute left-0 top-[10px] h-[2px] w-4 rounded bg-current" animate={{ rotate: open ? -45 : 0, y: open ? -5 : 0 }} />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>{open && <MenuOverlay current={location} />}</AnimatePresence>
    </>
  );
}

function MenuOverlay({ current }: { current: string }) {
  const [hover, setHover] = useState<string>(current in previews ? current : '/');
  const socials = Object.entries(site.social).filter(([, url]) => url);

  return (
    <motion.div
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="on-dark glow-dark fixed inset-0 z-[65] flex flex-col text-paper"
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      animate={{ clipPath: 'inset(0 0 0% 0)' }}
      exit={{ clipPath: 'inset(100% 0 0 0)' }}
      transition={{ duration: 0.85, ease: EASE_IN_OUT }}
      data-lenis-prevent
    >
      <div className="gutter grid flex-1 grid-cols-1 gap-8 overflow-y-auto pb-8 pt-[110px] lg:grid-cols-[1.4fr_1fr]">
        <nav aria-label="Primary">
          <ul>
            {nav.map((item, i) => {
              const active = current === item.href;
              return (
                <li key={item.href} className="rule border-b first:border-t">
                  <Link
                    href={item.href}
                    onMouseEnter={() => setHover(item.href)}
                    onFocus={() => setHover(item.href)}
                    className="group flex items-baseline gap-4 py-1.5 sm:gap-6"
                    aria-current={active ? 'page' : undefined}
                  >
                    <span className="mono w-8 shrink-0 text-signal">{item.note}</span>
                    <span className="block overflow-hidden">
                      <motion.span
                        className={`display block text-[clamp(44px,8.6vh,112px)] transition-[font-stretch,color] duration-500 group-hover:[font-stretch:100%] ${active ? 'text-signal' : ''}`}
                        initial={{ y: '100%' }}
                        animate={{ y: '0%' }}
                        transition={{ duration: 0.9, ease: EASE, delay: 0.25 + i * 0.05 }}
                      >
                        {item.label}
                      </motion.span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden flex-col justify-between lg:flex">
          <div className="relative aspect-[4/5] w-full max-w-[420px] self-end overflow-hidden rounded-[18px] bg-ink-2">
            <AnimatePresence mode="popLayout">
              <motion.img
                key={hover}
                src={previews[hover]}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ clipPath: 'inset(100% 0 0 0)', scale: 1.2 }}
                animate={{ clipPath: 'inset(0% 0 0 0)', scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: EASE }}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>

      <motion.div
        className="gutter rule grid grid-cols-2 gap-6 border-t py-6 md:grid-cols-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div>
          <div className="mono mb-2 text-mute-dark">Write to us</div>
          <a className="link-sweep text-[15px]" href={mailto(site.email.general)}>
            {site.email.general}
          </a>
        </div>
        <div>
          <div className="mono mb-2 text-mute-dark">Headquarters</div>
          <div className="text-[15px]">
            {site.hq.city}, {site.hq.country}
          </div>
        </div>
        <div>
          <div className="mono mb-2 text-mute-dark">Support the work</div>
          <a className="link-sweep text-[15px] text-signal" href={donateHref}>
            Donate →
          </a>
        </div>
        <div>
          <div className="mono mb-2 text-mute-dark">Follow</div>
          {socials.length ? (
            <div className="flex flex-wrap gap-x-4 text-[15px] capitalize">
              {socials.map(([name, url]) => (
                <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="link-sweep">
                  {name}
                </a>
              ))}
            </div>
          ) : (
            <div className="text-[15px] text-mute-dark">Formerly {site.formerly}</div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
