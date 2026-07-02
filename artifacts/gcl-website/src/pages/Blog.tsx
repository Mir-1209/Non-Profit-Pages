import React, { useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay }} className={className}>
      {children}
    </motion.div>
  );
}

const CATEGORIES = ['All', 'Behavioral Economics', 'Financial Literacy', 'Global Impact', 'Research', 'Youth Voices'] as const;

const catColors: Record<string, { bg: string; text: string }> = {
  'Behavioral Economics': { bg: 'rgba(51,88,255,0.1)', text: 'var(--blue)' },
  'Financial Literacy': { bg: 'rgba(139,92,246,0.1)', text: 'var(--violet)' },
  'Global Impact': { bg: 'rgba(233,63,199,0.1)', text: 'var(--magenta)' },
  Research: { bg: 'rgba(94,234,255,0.1)', text: '#1ab8d4' },
  'Youth Voices': { bg: 'rgba(40,200,64,0.1)', text: '#1a8c2c' },
};

const posts = [
  { id: 1, title: "Why Willpower Isn't Enough for Savings", excerpt: "Exploring the cognitive load of poverty and why systemic automation is more effective than willpower-based budgeting approaches.", category: "Behavioral Economics", date: "Oct 12, 2023", author: "Omar F.", readTime: '6 min', featured: true },
  { id: 2, title: "The Danger of Financial Gamification", excerpt: "How modern trading apps use casino mechanics to encourage risky behavior in young investors who don't yet understand compounding loss.", category: "Research", date: "Nov 05, 2023", author: "Aisha M.", readTime: '8 min', featured: false },
  { id: 3, title: "Bringing Dignity to Financial Education", excerpt: "Why we must stop using shame as a teaching tool when discussing debt and spending habits with low-income communities.", category: "Financial Literacy", date: "Jan 18, 2024", author: "Leo K.", readTime: '5 min', featured: false },
  { id: 4, title: "Scaling Impact in Southeast Asia", excerpt: "Lessons from deploying our Train-the-Trainer model across rural communities in Bangladesh, Indonesia, and the Philippines.", category: "Global Impact", date: "Feb 22, 2024", author: "Sofia R.", readTime: '10 min', featured: false },
  { id: 5, title: "Unpacking Money Scripts", excerpt: "The invisible generational narratives that silently dictate our entire relationship with wealth — and how to rewrite them.", category: "Behavioral Economics", date: "Mar 10, 2024", author: "Dr. Maya Lin", readTime: '7 min', featured: false },
  { id: 6, title: "Youth Voices on Systemic Barriers", excerpt: "A compilation of first-person essays from our recent student cohort on navigating modern economic hurdles as young adults.", category: "Youth Voices", date: "Apr 04, 2024", author: "Maya P.", readTime: '12 min', featured: false },
  { id: 7, title: "The Scarcity Mindset: A Design Problem", excerpt: "When people lack resources, their decision-making bandwidth narrows. Here's how we design programs around this reality.", category: "Research", date: "May 20, 2024", author: "Omar F.", readTime: '9 min', featured: false },
  { id: 8, title: "Financial Education in Conflict Zones", excerpt: "How GCL partners are adapting curriculum delivery in areas with displaced populations and disrupted economic systems.", category: "Global Impact", date: "Jun 15, 2024", author: "Fatima H.", readTime: '11 min', featured: false },
];

const featured = posts[0];
const rest = posts.slice(1);

export function Blog() {
  const [cat, setCat] = useState<string>('All');

  const filtered = rest.filter(p => cat === 'All' || p.category === cat);

  return (
    <main className="pb-32">
      {/* Hero */}
      <section className="relative pt-[90px] pb-[80px] overflow-hidden" style={{ background: 'var(--paper-alt)' }}>
        <div className="max-w-[1240px] mx-auto px-8">
          <Reveal className="max-w-[700px]">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-[2px] w-12" style={{ background: 'var(--grad-brand)' }} />
              <span className="text-[13px] font-[800] tracking-[0.1em] uppercase text-[var(--ink-soft)]">Field Notes & Research</span>
            </div>
            <h1 className="font-[800] text-[clamp(48px,7vw,84px)] leading-[0.95] tracking-[-0.03em] text-[var(--ink)] uppercase mb-6">
              <span style={{ background: 'var(--grad-brand)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Insights</span><br />& Updates.
            </h1>
            <p className="text-[17px] text-[var(--ink-soft)] leading-[1.7] max-w-[500px]">
              Research, essays, and field notes from the Global Capital League team and our global network of educators and economists.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Featured post */}
      <section className="py-16">
        <div className="max-w-[1240px] mx-auto px-8">
          <Reveal className="mb-8">
            <span className="text-[12px] font-[800] tracking-[0.1em] uppercase text-[var(--ink-soft)]">Featured Article</span>
          </Reveal>
          <Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-[20px] overflow-hidden cursor-pointer group transition-all hover:-translate-x-[3px] hover:-translate-y-[3px]" style={{ border: '2.5px solid var(--ink)', boxShadow: '8px 8px 0px var(--ink)' }} data-testid="featured-post">
              {/* Visual panel */}
              <div className="h-[280px] lg:h-auto relative flex items-end p-8" style={{ background: 'linear-gradient(135deg, var(--blue), var(--violet), var(--magenta))' }}>
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 1px, transparent 1px, transparent 20px)' }} />
                <div className="relative">
                  <span className="text-[11px] font-[800] uppercase px-3 py-1.5 rounded-full text-white" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(6px)' }}>
                    {featured.category}
                  </span>
                </div>
              </div>
              {/* Content panel */}
              <div className="p-10 bg-white flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4 text-[12px] text-[var(--ink-faint)] font-[600]">
                    <span>{featured.date}</span>
                    <span>·</span>
                    <span>{featured.readTime} read</span>
                  </div>
                  <h2 className="font-[800] text-[clamp(22px,2.8vw,32px)] leading-[1.15] tracking-[-0.02em] mb-4">{featured.title}</h2>
                  <p className="text-[15px] text-[var(--ink-soft)] leading-[1.7]">{featured.excerpt}</p>
                </div>
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--line)]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-[800] text-white text-[14px]" style={{ background: 'var(--grad-brand)' }}>{featured.author.charAt(0)}</div>
                    <span className="font-[700] text-[14px]">{featured.author}</span>
                  </div>
                  <span className="text-[14px] font-[700] text-[var(--violet)]">Read →</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Category filter + grid */}
      <section className="py-8 pb-20">
        <div className="max-w-[1240px] mx-auto px-8">
          <Reveal className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <h3 className="font-[800] text-[clamp(22px,2.5vw,30px)] tracking-[-0.02em]">All Articles</h3>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCat(c)} data-testid={`cat-${c.toLowerCase().replace(/ /g, '-')}`}
                  className="px-4 py-2 rounded-full text-[12.5px] font-[700] transition-all"
                  style={cat === c ? { background: 'var(--ink)', color: '#fff' } : { background: 'var(--paper-alt)', color: 'var(--ink-soft)', border: '1.5px solid var(--line)' }}
                >{c}</button>
              ))}
            </div>
          </Reveal>

          <AnimatePresence mode="wait">
            <motion.div key={cat} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filtered.map((post, i) => {
                const cc = catColors[post.category] ?? { bg: 'var(--paper-alt)', text: 'var(--ink-soft)' };
                return (
                  <motion.div key={post.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                    className="bg-white rounded-[16px] flex flex-col cursor-pointer transition-all hover:-translate-x-[3px] hover:-translate-y-[3px]"
                    style={{ border: '2.5px solid var(--ink)', boxShadow: '6px 6px 0px var(--ink)' }}
                    data-testid={`post-${post.id}`}
                  >
                    {/* Color bar top */}
                    <div className="h-2 rounded-t-[13px]" style={{ background: `linear-gradient(90deg,${cc.text},var(--violet))` }} />
                    <div className="p-7 flex flex-col flex-1">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[11px] font-[800] uppercase tracking-wider px-3 py-1.5 rounded-full" style={{ background: cc.bg, color: cc.text }}>{post.category}</span>
                        <span className="text-[12px] text-[var(--ink-faint)] font-[600]">{post.readTime} read</span>
                      </div>
                      <h3 className="font-[800] text-[19px] leading-[1.28] mb-3 tracking-[-0.01em]">{post.title}</h3>
                      <p className="text-[13.5px] text-[var(--ink-soft)] leading-[1.6] mb-6 flex-1">{post.excerpt}</p>
                      <div className="flex items-center justify-between pt-5 border-t border-[var(--line)]">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center font-[800] text-white text-[11px]" style={{ background: cc.text }}>{post.author.charAt(0)}</div>
                          <span className="font-[700] text-[13px]">{post.author}</span>
                        </div>
                        <span className="text-[12px] text-[var(--ink-faint)] font-[600]">{post.date}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
