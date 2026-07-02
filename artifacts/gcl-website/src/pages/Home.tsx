import React, { useEffect } from 'react';
import { Link } from 'wouter';
import { motion, useInView } from 'framer-motion';
import { useAdmin } from '../context/AdminContext';
import { StoriesCarousel } from '../components/StoriesCarousel';
import { stories } from '../data/stories';

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
  return <span ref={ref} className={value === end ? 'counter landed' : 'counter'}>{value}{suffix}</span>;
}

export function Home() {
  const { events, courses, news } = useAdmin();
  const publishedNews = news.filter(n => n.published).slice(0, 3);
  const upcomingEvents = events.slice(0, 3);
  const featuredCourses = courses.slice(0, 3);

  const catColor: Record<string, string> = { Research: '#3358ff', Update: '#8b5cf6', Story: '#e93fc7', Announcement: '#28c840' };
  const catBg: Record<string, string> = { Research: 'rgba(51,88,255,0.1)', Update: 'rgba(139,92,246,0.1)', Story: 'rgba(233,63,199,0.1)', Announcement: 'rgba(40,200,64,0.1)' };

  return (
    <main className="pb-24">
      {/* ─── HERO ─── */}
      <section className="relative pt-[100px] pb-[80px]" id="top"
        style={{ background: 'linear-gradient(160deg, #e8edff 0%, #f5effe 40%, #fff0fb 70%, #ffffff 100%)' }}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(90deg,var(--ink) 0px,var(--ink) 1px,transparent 1px,transparent 72px), repeating-linear-gradient(0deg,var(--ink) 0px,var(--ink) 1px,transparent 1px,transparent 72px)' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[90px] opacity-50 pointer-events-none bg-[radial-gradient(circle,#c5d2ff,transparent_70%)] top-[-100px] left-[-100px]" />
        <div className="absolute w-[460px] h-[460px] rounded-full blur-[90px] opacity-50 pointer-events-none bg-[radial-gradient(circle,#f0ccf7,transparent_70%)] top-[-80px] right-[-100px]" />
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[70px] opacity-35 pointer-events-none bg-[radial-gradient(circle,#c3eeff,transparent_70%)] top-[320px] left-1/2 -translate-x-1/2" />

        <div className="max-w-[1240px] mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-[44px] items-center">
            <div>
              <motion.span
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 text-[12.5px] font-[800] tracking-[0.08em] uppercase text-[var(--pill-ink)] bg-[var(--pill-bg)] px-4 py-2 rounded-full mb-6"
              >
                <span className="w-[7px] h-[7px] rounded-full animate-pulse" style={{ background: 'var(--grad-brand)' }} />
                Youth-Led · Financial Education
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="font-[800] text-[clamp(46px,6.6vw,96px)] leading-[0.96] tracking-[-0.03em]"
              >
                <span className="block">MONEY, MADE</span>
                <span className="block bg-[var(--grad-brand)] text-transparent bg-clip-text">RATIONAL.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="mt-[26px] max-w-[520px] text-[17.5px] leading-[1.65] text-[var(--ink-soft)]"
              >
                A top-tier financial education used to be reserved for the lucky few. <strong>Not anymore.</strong> Global Capital League brings behavioral economics and financial literacy to communities the world forgot.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-[14px] mt-[36px]"
              >
                <Link href="/courses" className="btn btn-dark btn-lg flex items-center gap-2" data-testid="hero-join">
                  Join a Course <span>→</span>
                </Link>
                <Link href="/events" className="btn btn-outline btn-lg">See Events</Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="flex items-center gap-5 mt-8 flex-wrap"
              >
                {['14+ Countries', '8K+ Youth', '120+ Workshops', '100% Free'].map(badge => (
                  <div key={badge} className="flex items-center gap-1.5 text-[13px] font-[700] text-[var(--ink-soft)]">
                    <span className="w-[6px] h-[6px] rounded-full bg-[var(--violet)]" />
                    {badge}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Hero visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              className="relative"
            >
              {/* Floating badges */}
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -left-8 top-8 bg-white rounded-[14px] border-[2px] border-[var(--ink)] shadow-[5px_5px_0px_var(--ink)] px-4 py-3 flex items-center gap-2">
                <span className="text-xl">🧠</span>
                <div>
                  <div className="text-[11px] font-[800]">Behavioral Economics</div>
                  <div className="text-[10px] text-[var(--ink-faint)]">Module unlocked</div>
                </div>
              </motion.div>

              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -right-6 bottom-12 bg-white rounded-[14px] border-[2px] border-[var(--ink)] shadow-[5px_5px_0px_var(--ink)] px-4 py-3">
                <div className="text-[10px] font-[700] text-[var(--ink-faint)] uppercase mb-0.5">Community</div>
                <div className="text-[13px] font-[800]">8,000+ members</div>
              </motion.div>
            </motion.div>
          </div>

          {/* Impact Stats */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="mt-[80px] max-w-[980px] mx-auto bg-white rounded-[20px] shadow-[10px_10px_0px_var(--ink)] border-[2.5px] border-[var(--ink)] p-[10px]"
          >
            <div className="flex items-center justify-between px-[22px] py-[16px] text-[13px] text-[var(--ink-faint)] font-[600]">
              <span>Global Impact</span>
              <span className="inline-flex items-center gap-[7px]">
                <span className="w-[7px] h-[7px] rounded-full bg-[#28c840] shadow-[0_0_0_3px_rgba(40,200,64,0.18)] animate-pulse" />
                Updated live
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-[10px] px-[10px] pb-[10px]">
              {[
                { icon: '🌍', end: 14, suffix: '+', label: 'Countries', color: 'from-[var(--blue)] to-[#6a86ff]' },
                { icon: '📚', end: 120, suffix: '+', label: 'Workshops', color: 'from-[var(--violet)] to-[#b28bfa]' },
                { icon: '👥', end: 8, suffix: 'K+', label: 'Youth Reached', color: 'from-[var(--magenta)] to-[#f27fdb]' },
                { icon: '🎓', end: 92, suffix: '%', label: 'Completion Rate', color: 'from-[#28c840] to-[#6ad8f2]' },
              ].map(s => (
                <div key={s.label} className="bg-[var(--paper-alt)] rounded-[var(--radius-lg)] p-[26px_24px]">
                  <div className={`w-[38px] h-[38px] rounded-[12px] mb-[16px] flex items-center justify-center text-[15px] text-white bg-gradient-to-br ${s.color}`}>{s.icon}</div>
                  <div className="text-[clamp(28px,4vw,38px)] font-[800] tracking-[-0.02em]"><Counter end={s.end} suffix={s.suffix} /></div>
                  <div className="mt-[6px] text-[13.5px] text-[var(--ink-soft)] font-[500]">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── MARQUEE ─── */}
      <div className="py-[20px] overflow-hidden bg-[var(--brutal-bg)] border-y-[2.5px] border-[var(--ink)]">
        <div className="flex w-max animate-[marquee_26s_linear_infinite]">
          {[1, 2].map((i) => (
            <span key={i} className="flex items-center gap-[26px] px-[14px] whitespace-nowrap">
              {['Behavioral Economics', 'Financial Dignity', 'Youth-Led', 'Global Reach', 'Rational Decisions', 'Free Education', 'Systems Thinking'].map(w => (
                <React.Fragment key={w}>
                  <span className="text-[22px] font-[800] text-[var(--neon-cyan)]">★</span>
                  <span className="text-[22px] font-[800] uppercase tracking-[-0.01em] text-[var(--brutal-text)]">{w}</span>
                </React.Fragment>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ─── MISSION ─── */}
      <section className="py-[110px]">
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
            <p className="text-[16px] leading-[1.75] text-[var(--ink-soft)] mb-8">
              By empowering youth to understand the cognitive side of money, we build systemic resilience that traditional budgeting advice can't provide.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/courses" className="btn btn-dark">Explore Our Courses</Link>
              <Link href="/events" className="btn btn-outline">Upcoming Events</Link>
            </div>
          </Reveal>
          <div className="relative h-[420px] flex items-center justify-center">
            <div className="w-[260px] h-[260px] rounded-full shadow-[0_30px_70px_-14px_rgba(139,92,246,0.45)] relative animate-[float_7s_ease-in-out_infinite]"
              style={{ background: 'conic-gradient(from 140deg,var(--blue),var(--violet),var(--magenta),#6ad8f2,var(--blue))' }}>
              <div className="absolute inset-[16px] rounded-full bg-[radial-gradient(circle_at_32%_26%,rgba(255,255,255,0.5),transparent_55%)]" />
              <div className="absolute px-4 py-2 rounded-full text-[13px] font-[700] bg-white shadow-[var(--shadow-md)] border border-[var(--line)] top-[6%] left-[-6%]">Behavioral Insights</div>
              <div className="absolute px-4 py-2 rounded-full text-[13px] font-[700] bg-white shadow-[var(--shadow-md)] border border-[var(--line)] bottom-[8%] right-[-6%]">Youth Agency</div>
              <div className="absolute px-4 py-2 rounded-full text-[13px] font-[700] bg-white shadow-[var(--shadow-md)] border border-[var(--line)] top-[50%] left-[-12%]">Systems Thinking</div>
              <div className="absolute w-[110px] h-[110px] bottom-[-4%] right-[4%] rounded-[16px] border-[2.5px] border-[var(--ink)] shadow-[6px_6px_0px_var(--ink)] bg-[var(--paper-alt)] flex items-center justify-center text-3xl">🧠</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PROGRAMS (dark) ─── */}
      <section className="py-[110px] bg-[var(--brutal-bg)] text-[var(--brutal-text)]">
        <div className="max-w-[1240px] mx-auto px-8">
          <div className="max-w-[640px] mb-[60px]">
            <span className="inline-flex items-center gap-2 text-[12px] font-[800] tracking-[0.08em] uppercase text-[var(--neon-cyan)] mb-4 flex">What We Do</span>
            <h2 className="font-[800] text-[clamp(30px,4.8vw,54px)] leading-[1.04] tracking-[-0.03em] mb-4">Our Core Programs</h2>
            <p className="text-[16px] text-[var(--brutal-text-dim)] leading-[1.7] max-w-[520px]">
              We deliver impact through multiple channels, ensuring our behavioral frameworks reach those who need them most.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[22px]">
            {[
              { title: "Live Workshops", icon: "🎓", num: "01", desc: "Intensive live sessions on the psychology of spending and financial behavior.", color: "var(--neon-cyan)" },
              { title: "Digital Courses", icon: "💻", num: "02", desc: "Self-paced modules built on modern learning science and real case studies.", color: "var(--magenta)" },
              { title: "Partnerships", icon: "🤝", num: "03", desc: "Collaborations with local schools, NGOs, and community organizations.", color: "var(--blue)" },
              { title: "Train the Trainer", icon: "🚀", num: "04", desc: "Empowering youth to teach financial literacy in their own communities.", color: "var(--violet)" },
            ].map((prog, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-[var(--brutal-bg-2)] pb-[26px] min-h-[300px] flex flex-col justify-between overflow-hidden brutal-card on-dark rounded-[14px]">
                  <div className="h-[100px] border-b-[2.5px] border-[rgba(246,244,255,0.7)] flex items-center justify-center text-3xl" style={{ background: `linear-gradient(135deg, ${prog.color}22, transparent)` }}>
                    {prog.icon}
                  </div>
                  <div className="p-[22px_22px_0]">
                    <div className="w-[44px] h-[44px] rounded-[12px] flex items-center justify-center font-[800] text-[12.5px] bg-[var(--neon-cyan)] text-[var(--brutal-bg)]">{prog.num}</div>
                    <h4 className="font-[800] text-[18px] mt-[18px] mb-[8px] tracking-[-0.01em] uppercase text-[var(--brutal-text)]">{prog.title}</h4>
                    <p className="text-[13.5px] text-[var(--brutal-text-dim)] leading-[1.6]">{prog.desc}</p>
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
                Open-access modules built on behavioral economics. Culturally adapted. Relentlessly practical.
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
      <section className="py-[110px]" id="events">
        <div className="max-w-[1240px] mx-auto px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-[60px]">
            <div className="max-w-[560px]">
              <span className="inline-flex items-center gap-2 text-[12px] font-[800] tracking-[0.08em] uppercase text-[var(--pill-ink)] bg-[var(--pill-bg)] px-3 py-1.5 rounded-full mb-4">Events</span>
              <h2 className="font-[800] text-[clamp(30px,4.8vw,54px)] leading-[1.04] tracking-[-0.03em] mb-4">Upcoming Events</h2>
              <p className="text-[16px] text-[var(--ink-soft)] leading-[1.7]">
                Join a session in your city — or online. All events are free and open to everyone.
              </p>
            </div>
            <Link href="/events" className="btn btn-outline shrink-0">All Events →</Link>
          </div>

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
            <p className="text-[16px] text-[var(--brutal-text-dim)] max-w-[400px] mx-auto">Numbers that show what behavioral finance education can really do.</p>
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
              { quote: "GCL changed how I see every financial decision I make. This isn't budgeting — it's a mindset shift.", name: "Amara D.", loc: "Ghana" },
              { quote: "I grew up thinking rich people were just luckier. GCL showed me the systems they use — and how to build them.", name: "Luca R.", loc: "Italy" },
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

      {/* ─── NEWS PREVIEW ─── */}
      <section className="py-[110px] bg-[var(--paper-alt)]" id="news">
        <div className="max-w-[1240px] mx-auto px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-[60px]">
            <div className="max-w-[560px]">
              <span className="inline-flex items-center gap-2 text-[12px] font-[800] tracking-[0.08em] uppercase text-[var(--pill-ink)] bg-[var(--pill-bg)] px-3 py-1.5 rounded-full mb-4">Latest News</span>
              <h2 className="font-[800] text-[clamp(30px,4.8vw,54px)] leading-[1.04] tracking-[-0.03em] mb-4">Updates from GCL</h2>
              <p className="text-[16px] text-[var(--ink-soft)] leading-[1.7]">Research, stories, and impact updates from around the global network.</p>
            </div>
            <Link href="/news" className="btn btn-outline shrink-0">All News →</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {publishedNews.map((post, i) => (
              <Reveal key={post.id} delay={i * 0.08}>
                <Link href="/news" className="block bg-white rounded-[20px] border-[2.5px] border-[var(--ink)] shadow-[6px_6px_0px_var(--ink)] overflow-hidden hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0px_var(--ink)] transition-all">
                  <div className="h-[6px]" style={{ background: catColor[post.category] ?? '#888' }} />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] font-[800] uppercase tracking-wider px-2.5 py-1 rounded-md" style={{ background: catBg[post.category] ?? 'var(--paper-alt)', color: catColor[post.category] ?? 'var(--ink-soft)' }}>{post.category}</span>
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
          <p className="text-[16px] text-[var(--ink-soft)] max-w-[520px]">Real impact across the globe from our community of learners.</p>
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
              { step: '01', icon: '🔍', title: 'Pick a Course', desc: 'Browse our open-access curriculum. No prerequisites, no fees, no gatekeepers.' },
              { step: '02', icon: '🧠', title: 'Learn the System', desc: 'Work through behavioral economics modules at your own pace, anywhere in the world.' },
              { step: '03', icon: '🚀', title: 'Join the League', desc: 'Attend events, connect with peers globally, and even teach in your own community.' },
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
      <section className="py-[40px]">
        <div className="max-w-[1240px] mx-auto px-8">
          <div className="rounded-[28px] p-[80px_40px] text-center relative overflow-hidden border-[2.5px] border-[var(--ink)] shadow-[10px_10px_0px_var(--ink)]"
            style={{ background: 'linear-gradient(135deg, #e9edff 0%, #f7e6fb 50%, #fce4f2 100%)' }}>
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(45deg,var(--ink) 0px,var(--ink) 1px,transparent 1px,transparent 28px)' }} />
            <div className="relative">
              <h2 className="font-[800] text-[clamp(30px,5.2vw,56px)] leading-[1.05] tracking-[-0.03em] max-w-[720px] mx-auto mb-[18px] uppercase">
                Ready to change the narrative?
              </h2>
              <p className="text-[var(--ink-soft)] text-[16px] max-w-[500px] mx-auto mb-[32px]">
                Join the league. Take a course, attend an event, or partner with us to bring GCL to your community.
              </p>
              <div className="flex justify-center gap-[14px] flex-wrap">
                <Link href="/courses" className="btn btn-dark btn-lg">Start Learning Free</Link>
                <Link href="/events" className="btn btn-outline btn-lg">Find an Event</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
