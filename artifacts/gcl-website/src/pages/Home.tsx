import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../context/AdminContext';
import { StoriesCarousel } from '../components/StoriesCarousel';
import { GlobeSection } from '../components/GlobeSection';
import { stories } from '../data/stories';

// ─── Real impact assets ───────────────────────────────────────────────────
import heroVideo from '@assets/2026-01-12_21.17.53_1783000059336.mp4';
import imgClassroomWide from '@assets/20250717_111123_1782999964183.jpg';
import imgInstructor from '@assets/20250717_105006_1782999950691.jpg';
import imgStudents3 from '@assets/20250717_110926_1782999964182.jpg';
import imgClassroomBack from '@assets/20250717_110921_1782999950691.jpg';
import imgSchool1 from '@assets/20251118_091859_1783000021515.jpg';
import imgKids1 from '@assets/photo_2026-05-14_09.47.09_1782999997790.jpeg';
import imgGroupSelfie from '@assets/photo_2026-01-12_21.22.30_1783000075275.jpeg';
import imgStudents4 from '@assets/20250717_110927_1782999964182.jpg';
import imgAudience from '@assets/20251118_091918_1783000021516.jpg';


// ─── Reveal on scroll ─────────────────────────────────────────────────────
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Counting number ──────────────────────────────────────────────────────
function Counter({ end, suffix = "" }: { end: number, suffix?: string }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  const [value, setValue] = React.useState(0);
  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const stepTime = Math.abs(Math.floor(2000 / end));
    const timer = setInterval(() => {
      start += 1;
      setValue(start);
      if (start === end) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [isInView, end]);
  return <span ref={ref}>{value}{suffix}</span>;
}

// ─── Cycling word in hero headline ────────────────────────────────────────
const CYCLE_WORDS = ['RATIONAL.', 'SIMPLE.', 'ACCESSIBLE.'];

export function Home() {
  const { events, courses, news } = useAdmin();
  const publishedNews = news.filter(n => n.published).slice(0, 3);
  const upcomingEvents = events.slice(0, 3);
  const featuredCourses = courses.slice(0, 3);

  const [wordIdx, setWordIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setWordIdx(i => (i + 1) % CYCLE_WORDS.length), 2800);
    return () => clearInterval(t);
  }, []);

  // React doesn't reliably set the `muted` attribute on <video> — force it via DOM ref
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.volume = 0;
    }
  }, []);

  const catColor: Record<string, string> = { Research: '#3358ff', Update: '#8b5cf6', Story: '#e93fc7', Announcement: '#28c840' };
  const catBg: Record<string, string> = { Research: 'rgba(51,88,255,0.1)', Update: 'rgba(139,92,246,0.1)', Story: 'rgba(233,63,199,0.1)', Announcement: 'rgba(40,200,64,0.1)' };

  const progPhotos = [imgClassroomWide, imgInstructor, imgSchool1, imgStudents3];

  return (
    <main className="pb-24">

      {/* ─── HERO — Video Background + Glassmorphism ─────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-end overflow-hidden" id="top">
        {/* Video background */}
        <video
          ref={videoRef}
          autoPlay loop playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
          src={heroVideo}
        />
        {/* Layered overlay */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(105deg, rgba(6,6,20,0.90) 0%, rgba(10,8,30,0.74) 45%, rgba(15,10,40,0.35) 100%)' }} />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, transparent 22%, transparent 60%, rgba(0,0,0,0.65) 100%)' }} />
        {/* Subtle grain */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg,#fff 0px,#fff 1px,transparent 1px,transparent 4px),repeating-linear-gradient(90deg,#fff 0px,#fff 1px,transparent 1px,transparent 4px)' }} />

        {/* Main content */}
        <div className="relative z-10 max-w-[1240px] mx-auto px-8 pt-[120px] pb-[48px] w-full flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-end">

            {/* ── Left: headline + copy ── */}
            <div className="max-w-[660px]">
              {/* Headline with cycling last word */}
              <motion.h1
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="font-[800] text-[clamp(48px,7.2vw,96px)] leading-[0.94] tracking-[-0.035em] text-white"
              >
                <span className="block">MONEY,</span>
                <span className="block">MADE</span>
                {/* Fixed height container for cycling word — span keeps valid h1 phrasing content */}
                <span style={{ display: 'block', minHeight: 'calc(clamp(48px,7.2vw,96px) * 1.05)', position: 'relative', overflow: 'hidden' }}>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={CYCLE_WORDS[wordIdx]}
                      initial={{ opacity: 0, y: 32, filter: 'blur(6px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -28, filter: 'blur(6px)' }}
                      transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
                      style={{ display: 'block', position: 'absolute', top: 0, left: 0, WebkitTextStroke: '2.5px rgba(255,255,255,0.95)', color: 'transparent' }}
                    >
                      {CYCLE_WORDS[wordIdx]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
                className="mt-[32px] max-w-[520px] text-[17px] leading-[1.65] text-white/70"
              >
                Top-tier financial education used to be reserved for the lucky few.{' '}
                <strong className="text-white/95 font-[700]">Not anymore.</strong>{' '}
                GCL brings behavioral economics and money psychology to communities the world forgot.{' '}
                <span className="text-white/50 text-[14px]">No cap.</span>
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}
                className="flex flex-wrap gap-[14px] mt-[36px]"
              >
                <Link href="/courses"
                  className="inline-flex items-center gap-2 px-7 py-[14px] rounded-full text-[15px] font-[800] text-[var(--ink)] bg-white hover:bg-white/90 transition-all hover:-translate-y-[2px] shadow-[0_0_30px_rgba(255,255,255,0.25)]"
                  data-testid="hero-join">
                  Start Moneymaxxing →
                </Link>
                <Link href="/events"
                  className="inline-flex items-center gap-2 px-7 py-[14px] rounded-full text-[15px] font-[800] text-white border border-white/30 transition-all hover:-translate-y-[2px]"
                  style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
                  See Events
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.52 }}
                className="flex items-center gap-6 mt-9 flex-wrap"
              >
                {['14+ Countries', '8K+ Youth', '120+ Workshops', '100% Free'].map(badge => (
                  <div key={badge} className="flex items-center gap-2 text-[13px] font-[700] text-white/55">
                    <span className="w-[5px] h-[5px] rounded-full bg-white/40" />
                    {badge}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ── Right: golden award badges ── */}
            {/* Credentials — right side, desktop only */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 1 }}
              className="hidden lg:flex flex-col gap-7 self-center pb-4 max-w-[280px]"
            >
              {[
                { label: "Central Asia's largest", detail: "youth-led financial literacy initiative" },
                { label: "World's first", detail: "behavioral financial literacy non-profit" },
                { label: "Formerly", detail: "Vanguard Capital League" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.12, duration: 0.7 }}
                >
                  <div className="text-[18px] font-[700] text-white leading-snug">{item.label}</div>
                  <div className="text-[14px] font-[400] text-white/50 mt-0.5 leading-snug">{item.detail}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ── Stats bar — frosted glass at hero bottom ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.7 }}
          className="relative z-10 border-t border-white/10"
          style={{ background: 'rgba(5,5,18,0.55)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
        >
          <div className="max-w-[1240px] mx-auto px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
              {[
                { icon: '🌍', end: 14, suffix: '+', label: 'Countries' },
                { icon: '📚', end: 120, suffix: '+', label: 'Workshops' },
                { icon: '👥', end: 8, suffix: 'K+', label: 'Youth Reached' },
                { icon: '🎓', end: 92, suffix: '%', label: 'Completion Rate' },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3 py-5 px-6 first:pl-0">
                  <span className="text-xl shrink-0">{s.icon}</span>
                  <div>
                    <div className="text-[22px] font-[800] text-white leading-none">
                      <Counter end={s.end} suffix={s.suffix} />
                    </div>
                    <div className="text-[11.5px] text-white/45 font-[600] mt-0.5">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── MARQUEE ─── */}
      <div className="py-[20px] overflow-hidden bg-[var(--brutal-bg)] border-y-[2.5px] border-[var(--ink)]">
        <div className="flex w-max animate-[marquee_28s_linear_infinite]">
          {[1, 2].map((i) => (
            <span key={i} className="flex items-center gap-[26px] px-[14px] whitespace-nowrap">
              {[
                'Behavioral Economics',
                'Moneymaxxing',
                'Financial Dignity',
                'Youth-Led',
                'No Cap 💸',
                'Global Reach',
                'Slay Your Finances',
                'Rational Decisions',
                'Financial Glow-Up',
                'Free Education',
                'Main Character Energy',
                'Systems Thinking',
              ].map(w => (
                <React.Fragment key={w}>
                  <span className="text-[22px] font-[800] text-[var(--neon-cyan)]">★</span>
                  <span className="text-[22px] font-[800] uppercase tracking-[-0.01em] text-[var(--brutal-text)]">{w}</span>
                </React.Fragment>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ─── MISSION ──────────────────────────────────────────────────── */}
      <section className="py-[110px] bg-white">
        <div className="max-w-[1240px] mx-auto px-8 grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-[64px] items-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-[12px] font-[800] tracking-[0.08em] uppercase text-[var(--pill-ink)] bg-[var(--pill-bg)] px-3 py-1.5 rounded-full mb-5">
              Our Mission
            </span>
            <h2 className="font-[800] text-[clamp(30px,4.8vw,54px)] leading-[1.04] tracking-[-0.03em] mb-[22px]">
              We teach the system<br />behind the numbers.
            </h2>
            <p className="text-[16px] leading-[1.75] text-[var(--ink-soft)] mb-4">
              Financial literacy programs usually fail because they teach math, not behavior. We focus on <strong>decisions under scarcity</strong>, emotional spending, and the psychological traps that keep communities in debt.
            </p>
            <p className="text-[16px] leading-[1.75] text-[var(--ink-soft)] mb-2">
              By empowering youth to understand the cognitive side of money, we build systemic resilience that traditional budgeting advice can't provide.
            </p>
            <p className="text-[14px] text-[var(--ink-faint)] mb-8 italic">
              Formerly Vanguard Capital League — rebranded as Global Capital League to match our reach. ✦
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/courses" className="btn btn-dark">Explore Our Courses</Link>
              <Link href="/events" className="btn btn-outline">Upcoming Events</Link>
            </div>
          </Reveal>

          {/* Real photo — classroom in action */}
          <Reveal delay={0.15} className="relative">
            <div className="relative rounded-[20px] overflow-hidden border-[2.5px] border-[var(--ink)] shadow-[10px_10px_0px_var(--ink)]" style={{ height: 420 }}>
              <img
                src={imgClassroomBack}
                alt="GCL workshop session in progress"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-5"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)' }}>
                <div className="text-[10px] font-[800] uppercase tracking-[0.12em] text-white/50 mb-0.5">Live Session</div>
                <div className="text-[14px] font-[700] text-white">Financial literacy in action — Tashkent</div>
              </div>
            </div>
            {/* Floating stat badge */}
            <div className="absolute -right-5 -top-5 bg-white rounded-[14px] border-[2px] border-[var(--ink)] shadow-[5px_5px_0px_var(--ink)] px-4 py-3">
              <div className="text-[10px] font-[700] text-[var(--ink-faint)] uppercase mb-0.5">Sessions held</div>
              <div className="text-[22px] font-[800] text-[var(--ink)] leading-none">120+</div>
            </div>
          </Reveal>
        </div>
      </section>

      <GlobeSection />

      {/* ─── PROGRAMS (dark) with real photos ───────────────────────── */}
      <section className="py-[110px] bg-[var(--brutal-bg)] text-[var(--brutal-text)]">
        <div className="max-w-[1240px] mx-auto px-8">
          <div className="max-w-[640px] mb-[60px]">
            <span className="inline-flex items-center gap-2 text-[12px] font-[800] tracking-[0.08em] uppercase text-[var(--neon-cyan)] mb-4 flex">What We Do</span>
            <h2 className="font-[800] text-[clamp(30px,4.8vw,54px)] leading-[1.04] tracking-[-0.03em] mb-4">Our Core Programs</h2>
            <p className="text-[16px] text-[var(--brutal-text-dim)] leading-[1.7] max-w-[520px]">
              Slaying financial ignorance through multiple channels. We bring behavioral frameworks to those who need them most. No gatekeepers, no fees, no excuses.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[22px]">
            {[
              { title: "Live Workshops", num: "01", desc: "Intensive live sessions on the psychology of spending and financial behavior. Pure main character energy.", color: "var(--neon-cyan)", label: "Youth Workshop · Tashkent" },
              { title: "Digital Courses", num: "02", desc: "Self-paced modules built on modern learning science and real case studies. Learn from anywhere, slay everywhere.", color: "var(--magenta)", label: "Digital Reach · Global" },
              { title: "Partnerships", num: "03", desc: "Collaborations with local schools, NGOs, and community organizations. Real collab energy.", color: "var(--blue)", label: "School Partnership · Tajikistan" },
              { title: "Train the Trainer", num: "04", desc: "Empowering youth to teach financial literacy in their own communities. Pass the bag of knowledge.", color: "var(--violet)", label: "Community · After Session" },
            ].map((prog, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-[var(--brutal-bg-2)] min-h-[340px] flex flex-col justify-between overflow-hidden brutal-card on-dark rounded-[14px]">
                  {/* Photo header */}
                  <div className="h-[130px] relative overflow-hidden border-b-[2.5px] border-[rgba(246,244,255,0.7)]">
                    <img
                      src={progPhotos[i]}
                      alt={prog.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 100%)' }} />
                    {/* Location tag */}
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-[800] uppercase tracking-wide text-white border border-white/20"
                      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)' }}>
                      {prog.label}
                    </div>
                  </div>
                  <div className="p-[22px] flex-1 flex flex-col">
                    <div className="w-[44px] h-[44px] rounded-[12px] flex items-center justify-center font-[800] text-[12.5px] bg-[var(--neon-cyan)] text-[var(--brutal-bg)] mb-[14px]">{prog.num}</div>
                    <h4 className="font-[800] text-[18px] mb-[8px] tracking-[-0.01em] uppercase text-[var(--brutal-text)]">{prog.title}</h4>
                    <p className="text-[13px] text-[var(--brutal-text-dim)] leading-[1.6] flex-1">{prog.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED COURSES ─── */}
      <section className="py-[110px] bg-[var(--paper-alt)]" id="courses">
        <div className="max-w-[1240px] mx-auto px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-[60px]">
            <div className="max-w-[560px]">
              <span className="inline-flex items-center gap-2 text-[12px] font-[800] tracking-[0.08em] uppercase text-[var(--pill-ink)] bg-[var(--pill-bg)] px-3 py-1.5 rounded-full mb-4">Curriculum</span>
              <h2 className="font-[800] text-[clamp(30px,4.8vw,54px)] leading-[1.04] tracking-[-0.03em] mb-4">Featured Courses</h2>
              <p className="text-[16px] text-[var(--ink-soft)] leading-[1.7]">
                Open-access modules built on behavioral economics. Culturally adapted. Relentlessly practical. Your financial glow-up starts here.
              </p>
            </div>
            <Link href="/courses" className="btn btn-outline shrink-0">View All Courses →</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[22px]">
            {featuredCourses.map((course, i) => (
              <Reveal key={course.slug} delay={i * 0.1}>
                <Link href={`/courses/${course.slug}`} className="block rounded-[16px] overflow-hidden bg-white border-[2.5px] border-[var(--ink)] shadow-[7px_7px_0px_var(--ink)] transition-all hover:shadow-[10px_10px_0px_var(--ink)] hover:-translate-y-1 hover:-translate-x-1 flex flex-col">
                  <div className={`h-[160px] relative flex items-end p-4 border-b-[2.5px] border-[var(--ink)] ${course.color === 't1' ? 'bg-gradient-to-br from-[#dbe4ff] to-[#c9b8ff]' : course.color === 't2' ? 'bg-gradient-to-br from-[#f1c9f7] to-[#ffd3ea]' : 'bg-gradient-to-br from-[#c7f0ff] to-[#c3e3ff]'}`}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] text-4xl opacity-40">
                      {course.tag === 'Mindset' ? '🧠' : course.tag === 'Investments' ? '📈' : '📚'}
                    </div>
                    <span className="relative text-[11px] font-[800] uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/70 text-[var(--ink)]">{course.tag}</span>
                  </div>
                  <div className="p-[20px_22px_24px] flex flex-col flex-1">
                    <h4 className="font-[800] text-[17px] mb-2 tracking-[-0.01em]">{course.title}</h4>
                    <p className="text-[13.5px] text-[var(--ink-soft)] leading-[1.6] mb-4 flex-1 line-clamp-2">{course.modules[0].description}</p>
                    <div className="flex justify-between text-[12.5px] text-[var(--ink-faint)] font-[600] pt-3 border-t border-[var(--line)]">
                      <span className="text-[var(--violet)]">{course.level}</span>
                      <span>{course.duration}</span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EVENTS PREVIEW ─── */}
      <section className="py-[110px] bg-[var(--paper-alt)]" id="events">
        <div className="max-w-[1240px] mx-auto px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-[60px]">
            <div className="max-w-[560px]">
              <span className="inline-flex items-center gap-2 text-[12px] font-[800] tracking-[0.08em] uppercase text-[var(--pill-ink)] bg-[var(--pill-bg)] px-3 py-1.5 rounded-full mb-4">Events</span>
              <h2 className="font-[800] text-[clamp(30px,4.8vw,54px)] leading-[1.04] tracking-[-0.03em] mb-4">Upcoming Events</h2>
              <p className="text-[16px] text-[var(--ink-soft)] leading-[1.7]">
                Join a session in your city — or online. All events are free and open to everyone. Slay in person or from your couch.
              </p>
            </div>
            <Link href="/events" className="btn btn-outline shrink-0">All Events →</Link>
          </div>

          {/* Photo strip at top of events */}
          <Reveal className="mb-8">
            <div className="grid grid-cols-3 gap-3 rounded-[20px] overflow-hidden border-[2.5px] border-[var(--ink)] shadow-[8px_8px_0px_var(--ink)]" style={{ height: 200 }}>
              {[imgAudience, imgKids1, imgGroupSelfie].map((img, i) => (
                <div key={i} className="relative overflow-hidden" style={{ borderRight: i < 2 ? '2px solid var(--ink)' : undefined }}>
                  <img src={img} alt="" className="w-full h-full object-cover object-center" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.45) 100%)' }} />
                </div>
              ))}
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {upcomingEvents.map((ev, i) => (
              <Reveal key={ev.id} delay={i * 0.08}>
                <div className="bg-white rounded-[16px] border-[2.5px] border-[var(--ink)] shadow-[6px_6px_0px_var(--ink)] p-6 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0px_var(--ink)] transition-all cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-[58px] h-[58px] rounded-[14px] bg-[var(--pill-bg)] flex flex-col items-center justify-center">
                      <div className="font-[800] text-[20px] text-[var(--pill-ink)] leading-none">{ev.date.day}</div>
                      <div className="text-[9px] font-[700] tracking-[0.08em] uppercase text-[var(--pill-ink)] opacity-70 mt-0.5">{ev.date.month}</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex gap-1.5 mb-2 flex-wrap">
                        <span className="text-[10px] font-[800] uppercase tracking-wide px-2 py-1 rounded-md" style={{ background: ev.format === 'Online' ? 'rgba(51,199,232,0.12)' : 'rgba(139,92,246,0.1)', color: ev.format === 'Online' ? '#33c7e8' : 'var(--violet)' }}>{ev.format}</span>
                        <span className="text-[10px] font-[800] uppercase tracking-wide px-2 py-1 rounded-md" style={{ background: ev.type === 'Free' ? 'rgba(40,200,64,0.1)' : 'var(--paper-alt)', color: ev.type === 'Free' ? '#28c840' : 'var(--ink-soft)' }}>{ev.type}</span>
                      </div>
                      <h4 className="font-[800] text-[16px] leading-[1.25] mb-1">{ev.title}</h4>
                      <div className="text-[12.5px] text-[var(--ink-soft)]">{ev.speaker}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS (dark) ─── */}
      <section className="py-[110px] bg-[var(--brutal-bg)] text-[var(--brutal-text)]">
        <div className="max-w-[1240px] mx-auto px-8">
          <div className="max-w-[640px] mx-auto text-center mb-[52px]">
            <h2 className="font-[800] text-[clamp(30px,4.8vw,54px)] leading-[1.04] tracking-[-0.03em] mb-4">The Proof</h2>
            <p className="text-[16px] text-[var(--brutal-text-dim)] max-w-[400px] mx-auto">Numbers that show what behavioral finance education can really do. These numbers? They're giving.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[2.5px] bg-[var(--brutal-line)] border-[2.5px] border-[var(--brutal-line)] rounded-[16px] overflow-hidden">
            {[
              { end: 92, suffix: '%', label: 'Completion Rate' },
              { end: 14, suffix: '', label: 'Countries Reached' },
              { end: 4, suffix: 'x', label: 'Savings Increase' },
              { end: 8, suffix: 'K+', label: 'Youth Trained' },
            ].map(s => (
              <div key={s.label} className="p-[34px_26px] bg-[var(--brutal-bg-2)]">
                <div className="font-[800] text-[clamp(38px,5vw,58px)] tracking-[-0.03em] bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--violet)] to-[var(--magenta)] text-transparent bg-clip-text">
                  <Counter end={s.end} suffix={s.suffix} />
                </div>
                <div className="mt-[10px] text-[13px] text-[var(--brutal-text-dim)] font-[600] uppercase tracking-[0.02em]">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Testimonial strip */}
          <div className="mt-[60px] grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { quote: "GCL changed how I see every financial decision I make. This isn't budgeting — it's a mindset shift. Total glow-up.", name: "Amara D.", loc: "Ghana" },
              { quote: "I grew up thinking rich people were just luckier. GCL showed me the systems they use — and how to build them. Slayed.", name: "Luca R.", loc: "Italy" },
              { quote: "After the scarcity module, I finally understood why I kept making 'bad' financial decisions. It wasn't weakness.", name: "Priya N.", loc: "India" },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-[var(--brutal-bg-2)] rounded-[16px] border border-[rgba(246,244,255,0.12)] p-6">
                  <div className="text-[var(--neon-cyan)] text-3xl font-[800] leading-none mb-3">"</div>
                  <p className="text-[14px] text-[var(--brutal-text-dim)] leading-[1.7] mb-5">{t.quote}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--violet)] to-[var(--magenta)]" />
                    <div>
                      <div className="font-[700] text-[13.5px] text-white">{t.name}</div>
                      <div className="text-[11.5px] text-[var(--brutal-text-dim)]">{t.loc}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FROM THE FIELD — photo gallery ──────────────────────────── */}
      <section className="py-[110px] bg-white">
        <div className="max-w-[1240px] mx-auto px-8">
          <Reveal className="mb-[52px]">
            <span className="inline-flex items-center gap-2 text-[12px] font-[800] tracking-[0.08em] uppercase text-[var(--pill-ink)] bg-[var(--pill-bg)] px-3 py-1.5 rounded-full mb-5">
              From the Field
            </span>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
              <h2 className="font-[800] text-[clamp(30px,4.8vw,54px)] leading-[1.04] tracking-[-0.03em] max-w-[540px]">
                Impact.<br />In person.
              </h2>
              <p className="text-[16px] text-[var(--ink-soft)] leading-[1.7] max-w-[380px] mb-1">
                Real classrooms. Real students. Every session is a community that didn't exist before. Very much slay behavior.
              </p>
            </div>
          </Reveal>

          {/* Row 1 — big left + stacked right */}
          <Reveal className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4 mb-4">
            <div className="relative rounded-[18px] overflow-hidden border-[2.5px] border-[var(--ink)] shadow-[8px_8px_0px_var(--ink)]" style={{ height: 460 }}>
              <img src={imgClassroomWide} alt="GCL workshop — full room in session" className="w-full h-full object-cover object-center" />
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-[800] uppercase tracking-wide text-white border border-white/25"
                style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
                <span className="w-[6px] h-[6px] rounded-full bg-[#28c840] animate-pulse" />
                Youth Workshop · Tashkent
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)' }}>
                <div className="text-[11px] font-[700] uppercase tracking-wider text-white/50 mb-1">Financial Literacy Program</div>
                <div className="text-[17px] font-[800] text-white leading-[1.25]">20+ students, one room,<br />zero gatekeeping.</div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="relative rounded-[18px] overflow-hidden border-[2.5px] border-[var(--ink)] shadow-[6px_6px_0px_var(--ink)] flex-1">
                <img src={imgInstructor} alt="GCL instructor presenting income types" className="w-full h-full object-cover object-top" style={{ minHeight: 215 }} />
                <div className="absolute bottom-0 left-0 right-0 p-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)' }}>
                  <div className="text-[10px] font-[700] uppercase tracking-wider text-white/50 mb-0.5">Educator</div>
                  <div className="text-[13px] font-[800] text-white">Live session — 5 types of income</div>
                </div>
              </div>
              <div className="relative rounded-[18px] overflow-hidden border-[2.5px] border-[var(--ink)] shadow-[6px_6px_0px_var(--ink)] flex-1">
                <img src={imgStudents3} alt="GCL students after a session" className="w-full h-full object-cover object-top" style={{ minHeight: 215 }} />
                <div className="absolute bottom-0 left-0 right-0 p-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)' }}>
                  <div className="text-[10px] font-[700] uppercase tracking-wider text-white/50 mb-0.5">Our Community</div>
                  <div className="text-[13px] font-[800] text-white">Students after the session</div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Row 2 — three geographies */}
          <Reveal delay={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { src: imgSchool1, tag: 'School Partnership', loc: 'Tajikistan · Nov 2025', cap: 'Taking GCL into classrooms' },
              { src: imgKids1, tag: 'K-12 Reach', loc: 'Tajikistan · May 2026', cap: 'Financial literacy starts young' },
              { src: imgGroupSelfie, tag: 'Community', loc: 'After the Session · Jan 2026', cap: 'This is what change looks like' },
            ].map((item, i) => (
              <div key={i} className="relative rounded-[18px] overflow-hidden border-[2.5px] border-[var(--ink)] shadow-[6px_6px_0px_var(--ink)]" style={{ height: 300 }}>
                <img src={item.src} alt={item.cap} className="w-full h-full object-cover object-top" />
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-[800] uppercase tracking-wide text-white border border-white/25"
                  style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
                  {item.tag}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, transparent 100%)' }}>
                  <div className="text-[10px] font-[700] uppercase tracking-wider text-white/50 mb-0.5">{item.loc}</div>
                  <div className="text-[13px] font-[800] text-white">{item.cap}</div>
                </div>
              </div>
            ))}
          </Reveal>

          {/* Extra row — more photos */}
          <Reveal delay={0.15} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="relative rounded-[18px] overflow-hidden border-[2.5px] border-[var(--ink)] shadow-[6px_6px_0px_var(--ink)]" style={{ height: 260 }}>
              <img src={imgStudents4} alt="GCL students energized" className="w-full h-full object-cover object-center" />
              <div className="absolute bottom-0 left-0 right-0 p-5"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)' }}>
                <div className="text-[10px] font-[700] uppercase tracking-wider text-white/50 mb-0.5">Youth · Tashkent</div>
                <div className="text-[13px] font-[800] text-white">The next generation is already slaying 💸</div>
              </div>
            </div>
            <div className="relative rounded-[18px] overflow-hidden border-[2.5px] border-[var(--ink)] shadow-[6px_6px_0px_var(--ink)]" style={{ height: 260 }}>
              <img src={imgAudience} alt="GCL large audience session" className="w-full h-full object-cover object-center" />
              <div className="absolute bottom-0 left-0 right-0 p-5"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)' }}>
                <div className="text-[10px] font-[700] uppercase tracking-wider text-white/50 mb-0.5">Nov 2025 · Tajikistan</div>
                <div className="text-[13px] font-[800] text-white">Packed house. Zero fees. All facts.</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── NEWS PREVIEW ─── */}
      <section className="py-[110px] bg-[var(--paper-alt)]" id="news">
        <div className="max-w-[1240px] mx-auto px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-[60px]">
            <div className="max-w-[560px]">
              <span className="inline-flex items-center gap-2 text-[12px] font-[800] tracking-[0.08em] uppercase text-[var(--pill-ink)] bg-[var(--pill-bg)] px-3 py-1.5 rounded-full mb-4">Latest News</span>
              <h2 className="font-[800] text-[clamp(30px,4.8vw,54px)] leading-[1.04] tracking-[-0.03em] mb-4">Updates from GCL</h2>
              <p className="text-[16px] text-[var(--ink-soft)] leading-[1.7]">Research, stories, and impact updates from around the global network. Stay in your bag, stay informed.</p>
            </div>
            <Link href="/news" className="btn btn-outline shrink-0">All News →</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {publishedNews.map((post, i) => (
              <Reveal key={post.id} delay={i * 0.08}>
                <Link href="/news" className="block bg-white rounded-[20px] border-[2.5px] border-[var(--ink)] shadow-[6px_6px_0px_var(--ink)] overflow-hidden hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0px_var(--ink)] transition-all">
                  {/* Photo thumbnail */}
                  <div className="h-[140px] relative overflow-hidden border-b-[2.5px] border-[var(--ink)]">
                    <img
                      src={[imgClassroomBack, imgStudents3, imgSchool1][i % 3]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.4) 100%)' }} />
                    <div className="absolute bottom-2 left-3">
                      <span className="text-[10px] font-[800] uppercase tracking-wider px-2.5 py-1 rounded-md" style={{ background: catBg[post.category] ?? 'rgba(0,0,0,0.5)', color: catColor[post.category] ?? '#fff', backdropFilter: 'blur(8px)' }}>{post.category}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[12px] text-[var(--ink-faint)]">{post.date}</span>
                    </div>
                    <h3 className="font-[800] text-[16px] leading-[1.3] mb-3">{post.title}</h3>
                    <p className="text-[13px] text-[var(--ink-soft)] leading-[1.65] line-clamp-2">{post.excerpt}</p>
                    <div className="mt-4 text-[12.5px] font-[700] text-[var(--violet)]">Read more →</div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VOICES / STORIES ─── */}
      <section className="py-[110px] overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-8 mb-10">
          <span className="inline-flex items-center gap-2 text-[12px] font-[800] tracking-[0.08em] uppercase text-[var(--pill-ink)] bg-[var(--pill-bg)] px-3 py-1.5 rounded-full mb-4">Community</span>
          <h2 className="font-[800] text-[clamp(30px,4.8vw,54px)] leading-[1.04] tracking-[-0.03em] mb-4">Voices of GCL</h2>
          <p className="text-[16px] text-[var(--ink-soft)] max-w-[520px]">Real impact across the globe. These people ate and left no crumbs. 🏆</p>
        </div>
        <StoriesCarousel stories={stories} />
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-[110px] bg-[var(--paper-alt)]">
        <div className="max-w-[1240px] mx-auto px-8">
          <div className="text-center max-w-[640px] mx-auto mb-[70px]">
            <span className="inline-flex items-center gap-2 text-[12px] font-[800] tracking-[0.08em] uppercase text-[var(--pill-ink)] bg-[var(--pill-bg)] px-3 py-1.5 rounded-full mb-4">How It Works</span>
            <h2 className="font-[800] text-[clamp(30px,4.8vw,54px)] leading-[1.04] tracking-[-0.03em]">Start in 3 simple steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-[52px] left-[calc(33%+20px)] right-[calc(33%+20px)] h-[2px] border-t-[2.5px] border-dashed border-[var(--line)]" />
            {[
              { step: '01', icon: '🔍', title: 'Pick a Course', desc: 'Browse our open-access curriculum. No prerequisites, no fees, no gatekeepers. Just vibes and knowledge.' },
              { step: '02', icon: '🧠', title: 'Learn the System', desc: 'Work through behavioral economics modules at your own pace, anywhere in the world. Moneymaxxing mode: on.' },
              { step: '03', icon: '🚀', title: 'Join the League', desc: 'Attend events, connect with peers globally, and even teach in your own community. Full slay arc.' },
            ].map((s, i) => (
              <Reveal key={s.step} delay={i * 0.12}>
                <div className="text-center relative">
                  <div className="w-[100px] h-[100px] mx-auto mb-6 rounded-[24px] bg-white border-[2.5px] border-[var(--ink)] shadow-[6px_6px_0px_var(--ink)] flex items-center justify-center text-4xl">
                    {s.icon}
                  </div>
                  <div className="text-[11px] font-[800] uppercase tracking-[0.12em] text-[var(--ink-faint)] mb-2">{s.step}</div>
                  <h4 className="font-[800] text-[20px] mb-3">{s.title}</h4>
                  <p className="text-[14.5px] text-[var(--ink-soft)] leading-[1.65] max-w-[280px] mx-auto">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA PANEL ─── */}
      <section className="py-[40px] bg-[var(--paper-alt)]">
        <div className="max-w-[1240px] mx-auto px-8">
          <div className="rounded-[28px] p-[80px_40px] text-center relative overflow-hidden border-[2.5px] border-[var(--ink)] shadow-[10px_10px_0px_var(--ink)]"
            style={{ background: 'linear-gradient(135deg, #e9edff 0%, #f7e6fb 50%, #fce4f2 100%)' }}>
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(45deg,var(--ink) 0px,var(--ink) 1px,transparent 1px,transparent 28px)' }} />
            <div className="relative">
              <p className="text-[12px] font-[800] tracking-[0.14em] uppercase text-[var(--ink-faint)] mb-3">Your financial glow-up starts here 💸</p>
              <h2 className="font-[800] text-[clamp(30px,5.2vw,56px)] leading-[1.05] tracking-[-0.03em] max-w-[720px] mx-auto mb-[18px] uppercase">
                Ready to change the narrative?
              </h2>
              <p className="text-[var(--ink-soft)] text-[16px] max-w-[500px] mx-auto mb-[32px]">
                Join the league. Take a course, attend an event, or partner with us to bring GCL to your community. No cap — it's free.
              </p>
              <div className="flex justify-center gap-[14px] flex-wrap">
                <Link href="/courses" className="btn btn-dark btn-lg">Start Moneymaxxing Free</Link>
                <Link href="/events" className="btn btn-outline btn-lg">Find an Event</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
