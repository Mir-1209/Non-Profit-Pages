import React, { useEffect } from 'react';
import { Link } from 'wouter';
import { motion, useAnimation, useInView } from 'framer-motion';
import { courses } from '../data/courses';
import { events } from '../data/events';
import { stories } from '../data/stories';
import { StoriesCarousel } from '../components/StoriesCarousel';

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
    const duration = 2000;
    const stepTime = Math.abs(Math.floor(duration / end));
    const timer = setInterval(() => {
      start += 1;
      setValue(start);
      if (start === end) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [isInView, end]);

  return <span className={value === end ? 'counter landed' : 'counter'}>{value}{suffix}</span>;
}

export function Home() {
  return (
    <main className="pb-24">
      {/* HERO */}
      <section className="relative pt-[100px] pb-[60px] overflow-hidden" id="top">
        <div className="absolute rounded-full filter blur-[60px] opacity-55 pointer-events-none w-[520px] h-[520px] bg-[radial-gradient(circle,#cdd8ff,transparent_70%)] top-[-180px] left-[-160px]" />
        <div className="absolute rounded-full filter blur-[60px] opacity-55 pointer-events-none w-[480px] h-[480px] bg-[radial-gradient(circle,#f3cdf7,transparent_70%)] top-[-120px] right-[-160px]" />
        <div className="absolute rounded-full filter blur-[60px] opacity-40 pointer-events-none w-[420px] h-[420px] bg-[radial-gradient(circle,#cdeffb,transparent_70%)] top-[280px] left-1/2 -translate-x-1/2" />
        
        <div className="max-w-[1240px] mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-[44px] items-center text-left">
            <div>
              <span className="inline-flex items-center gap-2 text-[12.5px] font-[800] tracking-[0.08em] uppercase text-[var(--pill-ink)] bg-[var(--pill-bg)] px-4 py-2 rounded-full mb-6">
                <span className="w-[7px] h-[7px] rounded-full bg-[var(--grad-brand)]" />
                Youth-Led · Financial Education
              </span>
              <h1 className="font-[800] text-[clamp(46px,6.6vw,96px)] leading-[0.98] tracking-[-0.03em]">
                <span className="block">MONEY, MADE</span>
                <span className="block bg-[var(--grad-brand)] text-transparent bg-clip-text -webkit-background-clip:text">RATIONAL.</span>
              </h1>
              <p className="mt-[26px] max-w-[520px] text-[17.5px] leading-[1.65] text-[var(--ink-soft)]">
                A top-tier financial education used to be reserved for the lucky few with access to it. <strong>Not anymore.</strong> Global Capital League brings behavioral economics and financial literacy to communities the world forgot.
              </p>
              <div className="flex flex-wrap gap-[14px] mt-[36px]">
                <Link href="/programs" className="btn btn-dark btn-lg flex items-center gap-2" data-testid="hero-join">
                  Join a Program <span>→</span>
                </Link>
                <Link href="/courses" className="btn btn-outline btn-lg" data-testid="hero-courses">
                  Explore Courses
                </Link>
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="photo-ph aspect-[4/5] rounded-[var(--radius-xl)] shadow-[var(--hard-shadow)] border-[2.5px] border-[var(--ink)]"
            >
              <span className="text-[36px] opacity-55">🌍</span>
              <span className="text-[12px] font-[700] tracking-[0.04em] uppercase opacity-60 px-[14px] mt-2">Live GCL Workshop</span>
            </motion.div>
          </div>

          {/* Impact Card */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-[80px] max-w-[980px] mx-auto bg-white rounded-[20px] shadow-[10px_10px_0px_var(--ink)] border-[2.5px] border-[var(--ink)] p-[10px] relative z-10"
          >
            <div className="flex items-center justify-between px-[22px] py-[16px] text-[13px] text-[var(--ink-faint)] font-[600]">
              <span>Our Impact</span>
              <span className="inline-flex items-center gap-[7px]">
                <span className="w-[7px] h-[7px] rounded-full bg-[#28c840] shadow-[0_0_0_3px_rgba(40,200,64,0.18)]" />
                Updated live
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[10px] px-[10px] pb-[10px]">
              <div className="bg-[var(--paper-alt)] rounded-[var(--radius-lg)] p-[26px_24px]">
                <div className="w-[38px] h-[38px] rounded-[12px] mb-[16px] flex items-center justify-center text-[15px] text-white bg-gradient-to-br from-[var(--blue)] to-[#6a86ff]">🌍</div>
                <div className="text-[clamp(28px,4vw,38px)] font-[800] tracking-[-0.02em]"><Counter end={14} suffix="+" /></div>
                <div className="mt-[6px] text-[13.5px] text-[var(--ink-soft)] font-[500]">Countries in our network</div>
              </div>
              <div className="bg-[var(--paper-alt)] rounded-[var(--radius-lg)] p-[26px_24px]">
                <div className="w-[38px] h-[38px] rounded-[12px] mb-[16px] flex items-center justify-center text-[15px] text-white bg-gradient-to-br from-[var(--violet)] to-[#b28bfa]">📚</div>
                <div className="text-[clamp(28px,4vw,38px)] font-[800] tracking-[-0.02em]"><Counter end={120} suffix="+" /></div>
                <div className="mt-[6px] text-[13.5px] text-[var(--ink-soft)] font-[500]">Workshops delivered</div>
              </div>
              <div className="bg-[var(--paper-alt)] rounded-[var(--radius-lg)] p-[26px_24px]">
                <div className="w-[38px] h-[38px] rounded-[12px] mb-[16px] flex items-center justify-center text-[15px] text-white bg-gradient-to-br from-[var(--magenta)] to-[#f27fdb]">👥</div>
                <div className="text-[clamp(28px,4vw,38px)] font-[800] tracking-[-0.02em]"><Counter end={8} suffix="K+" /></div>
                <div className="mt-[6px] text-[13.5px] text-[var(--ink-soft)] font-[500]">Youth reached so far</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="mt-[50px] py-[20px] overflow-hidden bg-[var(--brutal-bg)] border-y-[2.5px] border-[var(--ink)]">
        <div className="flex w-max animate-[marquee_26s_linear_infinite]">
          {[1, 2].map((i) => (
            <span key={i} className="flex items-center gap-[26px] px-[14px] whitespace-nowrap">
              <span className="text-[22px] font-[800] text-[var(--neon-cyan)]">★</span><span className="text-[22px] font-[800] uppercase tracking-[-0.01em] text-[var(--brutal-text)]">Behavioral Economics</span>
              <span className="text-[22px] font-[800] text-[var(--neon-cyan)]">★</span><span className="text-[22px] font-[800] uppercase tracking-[-0.01em] text-[var(--brutal-text)]">Financial Dignity</span>
              <span className="text-[22px] font-[800] text-[var(--neon-cyan)]">★</span><span className="text-[22px] font-[800] uppercase tracking-[-0.01em] text-[var(--brutal-text)]">Youth-Led</span>
              <span className="text-[22px] font-[800] text-[var(--neon-cyan)]">★</span><span className="text-[22px] font-[800] uppercase tracking-[-0.01em] text-[var(--brutal-text)]">Global Reach</span>
              <span className="text-[22px] font-[800] text-[var(--neon-cyan)]">★</span><span className="text-[22px] font-[800] uppercase tracking-[-0.01em] text-[var(--brutal-text)]">Rational Decisions</span>
            </span>
          ))}
        </div>
      </div>

      {/* MISSION */}
      <section className="py-[110px]">
        <div className="max-w-[1240px] mx-auto px-8 grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-[64px] items-center">
          <Reveal>
            <h2 className="font-[800] text-[clamp(30px,4.8vw,54px)] leading-[1.04] tracking-[-0.03em] mb-[22px]">
              We teach the system behind the numbers.
            </h2>
            <p className="text-[16px] leading-[1.75] text-[var(--ink-soft)] mb-4">
              Financial literacy programs usually fail because they teach math, not behavior. We focus on <strong>decisions under scarcity</strong>, emotional spending, and the psychological traps that keep communities in debt.
            </p>
            <p className="text-[16px] leading-[1.75] text-[var(--ink-soft)]">
              By empowering youth to understand the cognitive side of money, we build systemic resilience that traditional budgeting advice can't provide.
            </p>
          </Reveal>
          <div className="relative h-[400px] flex items-center justify-center">
            <div className="w-[250px] h-[250px] rounded-full bg-[conic-gradient(from_140deg,var(--blue),var(--violet),var(--magenta),#6ad8f2,var(--blue))] shadow-[0_30px_70px_-14px_rgba(139,92,246,0.45)] relative animate-[float_7s_ease-in-out_infinite]">
              <div className="absolute inset-[16px] rounded-full bg-[radial-gradient(circle_at_32%_26%,rgba(255,255,255,0.5),transparent_55%)]" />
              <div className="absolute px-4 py-2 rounded-full text-[13px] font-[600] bg-white shadow-[var(--shadow-md)] border border-[var(--line)] top-[8%] left-[0%]">Behavioral Insights</div>
              <div className="absolute px-4 py-2 rounded-full text-[13px] font-[600] bg-white shadow-[var(--shadow-md)] border border-[var(--line)] bottom-[10%] right-[-2%]">Youth Agency</div>
              <div className="absolute px-4 py-2 rounded-full text-[13px] font-[600] bg-white shadow-[var(--shadow-md)] border border-[var(--line)] top-[52%] left-[-8%]">Systems Thinking</div>
              <div className="absolute w-[120px] h-[120px] bottom-[0%] right-[6%] rounded-[16px] border-[2.5px] border-[var(--ink)] shadow-[6px_6px_0px_var(--ink)] bg-[var(--paper-alt)] flex items-center justify-center text-3xl">
                🧠
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS (Brutalist dark) */}
      <section className="py-[110px] bg-[var(--brutal-bg)] text-[var(--brutal-text)]">
        <div className="max-w-[1240px] mx-auto px-8">
          <div className="max-w-[640px] mb-[60px]">
            <h2 className="font-[800] text-[clamp(30px,4.8vw,54px)] leading-[1.04] tracking-[-0.03em] mb-4">Our Core Programs</h2>
            <p className="text-[16px] text-[var(--brutal-text-dim)] leading-[1.7] max-w-[520px]">
              We deliver impact through multiple channels, ensuring our behavioral frameworks reach those who need them most.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[22px]">
            {[
              { title: "Workshops", icon: "01", desc: "Intensive live sessions on psychology of spending.", color: "var(--neon-cyan)" },
              { title: "Digital Courses", icon: "02", desc: "Self-paced modules built on modern learning science.", color: "var(--magenta)" },
              { title: "Partnerships", icon: "03", desc: "Collaborations with local schools and NGOs.", color: "var(--blue)" },
              { title: "Train the Trainer", icon: "04", desc: "Empowering youth to teach in their own communities.", color: "var(--violet)" }
            ].map((prog, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <Link href="/programs" className="block bg-[var(--brutal-bg-2)] pb-[26px] min-h-[320px] flex flex-col justify-between overflow-hidden brutal-card on-dark">
                  <div className="h-[110px] border-b-[2.5px] border-[rgba(246,244,255,0.7)] flex items-center justify-center text-3xl opacity-50" style={{ background: `linear-gradient(135deg, ${prog.color}22, transparent)` }}>
                    {prog.icon === "01" ? "🎓" : prog.icon === "02" ? "💻" : prog.icon === "03" ? "🤝" : "🚀"}
                  </div>
                  <div className="p-[22px_22px_0]">
                    <div className="w-[44px] h-[44px] rounded-[12px] flex items-center justify-center font-[800] text-[12.5px] bg-[var(--neon-cyan)] text-[var(--brutal-bg)]">
                      {prog.icon}
                    </div>
                    <h4 className="font-[800] text-[18px] mt-[18px] mb-[8px] tracking-[-0.01em] uppercase text-[var(--brutal-text)]">{prog.title}</h4>
                    <p className="text-[13.5px] text-[var(--brutal-text-dim)] leading-[1.6]">{prog.desc}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section className="py-[110px] bg-[var(--paper-alt)]">
        <div className="max-w-[1240px] mx-auto px-8">
          <div className="max-w-[640px] mb-[60px]">
            <h2 className="font-[800] text-[clamp(30px,4.8vw,54px)] leading-[1.04] tracking-[-0.03em] mb-4">Featured Curriculum</h2>
            <p className="text-[16px] text-[var(--ink-soft)] leading-[1.7] max-w-[520px]">
              Dive into our modules. Open source, culturally adapted, and relentlessly practical.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[22px]">
            {courses.slice(0, 3).map((course, i) => (
              <Reveal key={course.slug} delay={i * 0.1}>
                <Link href={`/courses/${course.slug}`} className="block rounded-[16px] overflow-hidden bg-white border-[2.5px] border-[var(--ink)] shadow-[7px_7px_0px_var(--ink)] transition-all hover:shadow-[10px_10px_0px_var(--ink)] hover:-translate-y-1 hover:-translate-x-1">
                  <div className={`h-[160px] relative flex items-end p-4 border-b-[2.5px] border-[var(--ink)] ${course.color === 't1' ? 'bg-gradient-to-br from-[#dbe4ff] to-[#c9b8ff]' : course.color === 't2' ? 'bg-gradient-to-br from-[#f1c9f7] to-[#ffd3ea]' : 'bg-gradient-to-br from-[#c7f0ff] to-[#c3e3ff]'}`}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] text-4xl opacity-40">🎬</div>
                    <span className="relative z-10 text-[12px] font-[800] uppercase px-3 py-1.5 rounded-full bg-white/85 text-[var(--ink)] backdrop-blur-md">
                      {course.tag}
                    </span>
                  </div>
                  <div className="p-[20px_22px_24px]">
                    <h4 className="font-[800] text-[17px] mb-2 tracking-[-0.01em]">{course.title}</h4>
                    <p className="text-[13.5px] text-[var(--ink-soft)] leading-[1.6] mb-4 line-clamp-2">
                      {course.modules[0].description}
                    </p>
                    <div className="flex justify-between text-[12.5px] text-[var(--ink-faint)] font-[600]">
                      <span className="text-[var(--violet)]">{course.level}</span>
                      <span>{course.duration}</span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          
          <div className="mt-12 flex justify-center">
            <Link href="/courses" className="btn btn-outline">View All Courses</Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-[110px] bg-[var(--brutal-bg)] text-[var(--brutal-text)]">
        <div className="max-w-[1240px] mx-auto px-8">
          <div className="max-w-[640px] mx-auto text-center mb-[40px]">
            <h2 className="font-[800] text-[clamp(30px,4.8vw,54px)] leading-[1.04] tracking-[-0.03em] mb-4">The Proof</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[2.5px] mt-[52px] bg-[var(--brutal-line)] border-[2.5px] border-[var(--brutal-line)] rounded-[16px] overflow-hidden">
            <div className="p-[34px_26px] bg-[var(--brutal-bg-2)]">
              <div className="font-[800] text-[clamp(38px,5vw,58px)] tracking-[-0.03em] bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--violet)] to-[var(--magenta)] text-transparent bg-clip-text">
                <Counter end={92} suffix="%" />
              </div>
              <div className="mt-[10px] text-[13px] text-[var(--brutal-text-dim)] font-[600] uppercase tracking-[0.02em]">Completion Rate</div>
            </div>
            <div className="p-[34px_26px] bg-[var(--brutal-bg-2)]">
              <div className="font-[800] text-[clamp(38px,5vw,58px)] tracking-[-0.03em] bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--violet)] to-[var(--magenta)] text-transparent bg-clip-text">
                <Counter end={14} />
              </div>
              <div className="mt-[10px] text-[13px] text-[var(--brutal-text-dim)] font-[600] uppercase tracking-[0.02em]">Countries Reached</div>
            </div>
            <div className="p-[34px_26px] bg-[var(--brutal-bg-2)]">
              <div className="font-[800] text-[clamp(38px,5vw,58px)] tracking-[-0.03em] bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--violet)] to-[var(--magenta)] text-transparent bg-clip-text">
                <Counter end={4} suffix="x" />
              </div>
              <div className="mt-[10px] text-[13px] text-[var(--brutal-text-dim)] font-[600] uppercase tracking-[0.02em]">Savings Increase</div>
            </div>
            <div className="p-[34px_26px] bg-[var(--brutal-bg-2)]">
              <div className="font-[800] text-[clamp(38px,5vw,58px)] tracking-[-0.03em] bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--violet)] to-[var(--magenta)] text-transparent bg-clip-text">
                <Counter end={8} suffix="K+" />
              </div>
              <div className="mt-[10px] text-[13px] text-[var(--brutal-text-dim)] font-[600] uppercase tracking-[0.02em]">Youth Trained</div>
            </div>
          </div>
        </div>
      </section>

      {/* STORIES CAROUSEL */}
      <section className="py-[110px] overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-8 mb-10">
          <h2 className="font-[800] text-[clamp(30px,4.8vw,54px)] leading-[1.04] tracking-[-0.03em] mb-4">Voices of GCL</h2>
          <p className="text-[16px] text-[var(--ink-soft)] max-w-[520px]">Real impact across the globe.</p>
        </div>
        <StoriesCarousel stories={stories} />
      </section>

      {/* CTA PANEL */}
      <section className="py-[40px]">
        <div className="max-w-[1240px] mx-auto px-8">
          <div className="rounded-[28px] p-[80px_40px] text-center relative overflow-hidden bg-gradient-to-br from-[#e9edff] to-[#f7e6fb] border-[2.5px] border-[var(--ink)] shadow-[10px_10px_0px_var(--ink)]">
            <h2 className="relative font-[800] text-[clamp(30px,5.2vw,56px)] leading-[1.05] tracking-[-0.03em] max-w-[720px] mx-auto mb-[18px] uppercase">
              Ready to change the narrative?
            </h2>
            <p className="relative text-[var(--ink-soft)] text-[16px] max-w-[500px] mx-auto mb-[32px]">
              Join the league. Take a course, attend an event, or partner with us to bring GCL to your community.
            </p>
            <div className="relative flex justify-center gap-[14px] flex-wrap">
              <Link href="/courses" className="btn btn-dark btn-lg">Start Learning Free</Link>
              <Link href="/programs" className="btn btn-outline btn-lg">Partner With Us</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
