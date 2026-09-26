import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'wouter';
import { donateHref, mailto, nav, site } from '../config/site';
import { useLenis, scrollToTarget } from '../lib/smooth';
import logoImg from '../assets/media/gcl-logo.webp';
import { Magnetic, Marquee } from './primitives';

export function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-35%', '0%']);
  const letter = useTransform(scrollYProgress, [0.3, 1], ['0.2em', '-0.02em']);
  const socials = Object.entries(site.social).filter(([, url]) => url);

  return (
    <footer ref={ref} className="on-dark glow-dark relative overflow-hidden text-paper">
      <motion.div style={{ y }}>
        {/* Call to action */}
        <div className="gutter rule border-b pb-16 pt-24 md:pt-32">
          <img src={logoImg} alt={site.name} width={640} height={247} loading="lazy" className="mb-12 h-auto w-[220px] md:w-[280px]" />
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end">
            <h2 className="display text-[clamp(64px,11vw,190px)]">
              Invest in
              <br />
              <span className="serif text-signal normal-case italic tracking-[-0.03em]">the next</span>
              <br />
              generation.
            </h2>
            <div className="flex flex-col items-start gap-6 md:items-end">
              <p className="max-w-[380px] text-[17px] leading-relaxed text-paper/70 md:text-right">
                Every workshop is free for students. Your support keeps it that way — and takes it to the next city.
              </p>
              <Magnetic>
                <a
                  href={donateHref}
                  className="grid h-[170px] w-[170px] place-items-center rounded-full bg-signal text-center text-ink shadow-[0_0_60px_rgba(58,169,255,0.55)] transition-transform duration-500 hover:scale-105 md:h-[200px] md:w-[200px]"
                >
                  <span className="display text-[34px] leading-[0.9]">
                    Donate
                    <br />
                    now ↗
                  </span>
                </a>
              </Magnetic>
            </div>
          </div>
        </div>

        {/* Link columns */}
        <div className="gutter grid grid-cols-2 gap-10 py-14 md:grid-cols-4">
          <div>
            <div className="mono mb-4 text-mute-dark">Sitemap</div>
            <ul className="space-y-1.5 text-[16px]">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="link-sweep">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mono mb-4 text-mute-dark">Contact</div>
            <ul className="space-y-1.5 text-[16px]">
              <li><a className="link-sweep" href={mailto(site.email.general)}>General</a></li>
              <li><a className="link-sweep" href={mailto(site.email.partnerships, 'Partnership enquiry')}>Partnerships</a></li>
              <li><a className="link-sweep" href={mailto(site.email.chapters, 'Start a chapter')}>Chapters</a></li>
              <li><a className="link-sweep" href={mailto(site.email.giving, 'Supporting GCL')}>Giving</a></li>
            </ul>
          </div>
          <div>
            <div className="mono mb-4 text-mute-dark">{socials.length ? 'Follow' : 'Headquarters'}</div>
            {socials.length ? (
              <ul className="space-y-1.5 text-[16px] capitalize">
                {socials.map(([name, url]) => (
                  <li key={name}>
                    <a className="link-sweep" href={url} target="_blank" rel="noopener noreferrer">{name}</a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[16px] leading-relaxed">
                {site.hq.city}
                <br />
                {site.hq.country}
                <br />
                <span className="text-mute-dark">Chapters in 14+ countries</span>
              </p>
            )}
          </div>
          <div>
            <div className="mono mb-4 text-mute-dark">Legal</div>
            <ul className="space-y-1.5 text-[16px]">
              <li><Link className="link-sweep" href="/privacy">Privacy</Link></li>
              <li><Link className="link-sweep" href="/terms">Terms</Link></li>
              <li>
                <button type="button" className="link-sweep" onClick={() => scrollToTarget(lenis, 0)}>
                  Back to top ↑
                </button>
              </li>
            </ul>
          </div>
        </div>

        <Marquee speed={60} className="rule border-y py-3 text-paper/50">
          {['Financial literacy is a human right', 'Free for every student', 'Youth-led since 2021', `Formerly ${site.formerly}`, 'Behavior > arithmetic'].map((t) => (
            <span key={t} className="mono flex items-center gap-6 pr-6">
              {t} <span className="text-signal">✦</span>
            </span>
          ))}
        </Marquee>

        {/* The wordmark */}
        <div className="gutter relative pt-6">
          <motion.div
            className="display-wide select-none whitespace-nowrap bg-gradient-to-b from-signal-2 to-signal bg-clip-text pb-[0.04em] text-center text-[31vw] leading-[0.8] text-transparent [filter:drop-shadow(0_0_40px_rgba(58,169,255,0.45))]"
            style={{ letterSpacing: letter }}
            aria-hidden="true"
          >
            GCL
          </motion.div>
          <div className="mono flex flex-wrap items-center justify-between gap-4 py-6 text-mute-dark">
            <span className="flex items-center gap-2">
              © {new Date().getFullYear()} {site.name}
            </span>
            <span>Non-profit · Made by young people, for young people</span>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
