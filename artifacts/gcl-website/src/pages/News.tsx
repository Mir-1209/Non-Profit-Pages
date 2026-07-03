import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { newsPosts } from '../data/news';

const CATS = ['All', 'Research', 'Update', 'Story', 'Announcement'] as const;

const catAccent: Record<string, string> = {
  Research: '#1a1a3a',
  Update: '#1a2818',
  Story: '#2a1a10',
  Announcement: '#1a2a1a',
};

const catLabel: Record<string, string> = {
  Research: 'RESEARCH',
  Update: 'UPDATE',
  Story: 'STORY',
  Announcement: 'ANNOUNCEMENT',
};

function PhotoPlaceholder({ bg, label, className = '' }: { bg: string; label: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden flex items-end ${className}`} style={{ background: bg }}>
      <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.03) 0px,rgba(255,255,255,0.03) 1px,transparent 1px,transparent 24px)' }} />
      <div className="relative z-10 p-4">
        <div className="text-[10px] font-[800] uppercase tracking-[0.12em] text-white/40 border border-white/20 px-2 py-1 rounded inline-block">{label}</div>
      </div>
    </div>
  );
}

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [vis, setVis] = React.useState(false);
  React.useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.06 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={vis ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay }} className={className}>
      {children}
    </motion.div>
  );
}

export function News() {
  const published = newsPosts.filter(p => p.published);
  const [cat, setCat] = useState<string>('All');
  const filtered = cat === 'All' ? published : published.filter(p => p.category === cat);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <main className="bg-[var(--paper-alt)] pb-32">
      {/* ─── HERO ─── */}
      <section className="pt-[90px] pb-0 overflow-hidden" style={{ background: 'var(--brutal-bg)' }}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(90deg,white 0px,white 1px,transparent 1px,transparent 80px),repeating-linear-gradient(0deg,white 0px,white 1px,transparent 1px,transparent 80px)' }} />
        <div className="max-w-[1240px] mx-auto px-8 pb-0 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
            <div className="border-b-[2.5px] border-white/10 pb-6 mb-0">
              <div className="text-[11px] font-[800] uppercase tracking-[0.18em] text-[var(--neon-cyan)] mb-4">Global Capital League</div>
              <h1 className="font-[800] text-[clamp(56px,9vw,110px)] leading-[0.88] tracking-[-0.04em] text-white uppercase">
                The<br />GCL<br />Post.
              </h1>
            </div>
            <div className="flex items-center justify-between py-3 text-[12px] font-[600] text-white/40 uppercase tracking-[0.1em]">
              <span>Est. 2019 · Global Capital League</span>
              <span>Research · Stories · Impact · News</span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#28c840]" />
                Publishing since 2019
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-[1240px] mx-auto px-8">
        {/* ─── FILTER BAR ─── */}
        <div className="flex gap-2 flex-wrap py-6 border-b-[2.5px] border-[var(--ink)] mb-10">
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className="px-5 py-2 rounded-none text-[12.5px] font-[800] uppercase tracking-wider transition-all border-[2px]"
              style={cat === c
                ? { background: 'var(--ink)', color: '#fff', border: '2px solid var(--ink)', boxShadow: '3px 3px 0px rgba(21,19,44,0.3)' }
                : { background: 'transparent', color: 'var(--ink-soft)', border: '2px solid var(--line)' }}>
              {c}
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24 text-[var(--ink-soft)] font-[700] text-[18px] uppercase tracking-wider border-[2.5px] border-[var(--line)] rounded-[0px]">
            No posts in this category.
          </div>
        )}

        {/* ─── FEATURED STORY ─── */}
        {featured && (
          <Reveal className="mb-10">
            <Link href={`/news/${featured.id}`}
              className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] border-[2.5px] border-[var(--ink)] shadow-[8px_8px_0px_var(--ink)] overflow-hidden group hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_var(--ink)] transition-all block">
              <PhotoPlaceholder bg={featured.imageBg} label={featured.imageLabel} className="h-[280px] lg:h-auto min-h-[280px]" />
              <div className="bg-white p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-[10px] font-[800] uppercase tracking-[0.15em] px-3 py-1.5 border-[2px] border-[var(--ink)]">{catLabel[featured.category]}</span>
                    <span className="text-[12px] text-[var(--ink-faint)] font-[600]">{featured.date}</span>
                    <span className="text-[11px] text-[var(--ink-faint)] font-[500]">{featured.readTime}</span>
                  </div>
                  <div className="text-[11px] font-[800] uppercase tracking-[0.15em] text-[var(--ink-faint)] mb-3">Featured Story</div>
                  <h2 className="font-[800] text-[clamp(22px,3vw,32px)] leading-[1.1] tracking-[-0.02em] mb-4 group-hover:underline underline-offset-4">{featured.title}</h2>
                  <p className="text-[15px] text-[var(--ink-soft)] leading-[1.7]">{featured.excerpt}</p>
                </div>
                <div className="flex items-center gap-4 mt-6 pt-6 border-t-[2px] border-[var(--line)]">
                  <div className="w-9 h-9 rounded-full bg-[var(--ink)] flex items-center justify-center text-white text-[13px] font-[800]">
                    {featured.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-[800] text-[13px]">{featured.author}</div>
                    <div className="text-[12px] text-[var(--ink-faint)]">{featured.authorTitle}</div>
                  </div>
                  <span className="ml-auto font-[800] text-[13px] text-[var(--ink)] group-hover:tracking-wider transition-all">READ →</span>
                </div>
              </div>
            </Link>
          </Reveal>
        )}

        {/* ─── GRID ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-[2.5px] border-[var(--ink)] shadow-[6px_6px_0px_var(--ink)] mb-16">
          {rest.map((post, i) => (
            <Reveal key={post.id} delay={i * 0.05}
              className={`border-[var(--ink)] ${i % 3 !== 2 ? 'lg:border-r-[2.5px]' : ''} ${i < rest.length - (rest.length % 3 || 3) ? 'border-b-[2.5px]' : ''} md:${i % 2 === 0 ? 'border-r-[2.5px]' : ''}`}>
              <Link href={`/news/${post.id}`} className="flex flex-col group h-full block">
                <PhotoPlaceholder bg={post.imageBg} label={post.imageLabel} className="h-[180px] border-b-[2.5px] border-[var(--ink)]" />
                <div className="bg-white p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="text-[10px] font-[800] uppercase tracking-[0.12em] px-2 py-1 border border-[var(--ink)]">{catLabel[post.category]}</span>
                    <span className="text-[11px] text-[var(--ink-faint)]">{post.date}</span>
                  </div>
                  <h3 className="font-[800] text-[17px] leading-[1.2] mb-3 tracking-[-0.01em] group-hover:underline underline-offset-2">{post.title}</h3>
                  <p className="text-[13px] text-[var(--ink-soft)] leading-[1.65] flex-1 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--line)]">
                    <span className="text-[12px] text-[var(--ink-faint)]">{post.author}</span>
                    <span className="text-[12px] font-[800] text-[var(--ink)] group-hover:tracking-wider transition-all">{post.readTime} →</span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* ─── NEWSLETTER STRIP ─── */}
        <Reveal>
          <div className="border-[2.5px] border-[var(--ink)] shadow-[8px_8px_0px_var(--ink)] p-10 flex flex-col md:flex-row items-center justify-between gap-8" style={{ background: 'var(--brutal-bg)' }}>
            <div>
              <div className="text-[11px] font-[800] uppercase tracking-[0.15em] text-[var(--neon-cyan)] mb-2">The GCL Post</div>
              <div className="font-[800] text-[22px] text-white uppercase tracking-tight mb-1">Get research in your inbox.</div>
              <div className="text-[14px] text-[var(--brutal-text-dim)]">New articles, research summaries, and impact updates every two weeks.</div>
            </div>
            <div className="flex gap-2 shrink-0">
              <input type="email" placeholder="your@email.com"
                className="px-4 py-3 border-[2px] border-white/20 bg-white/10 text-white placeholder-white/40 text-[14px] font-[600] outline-none focus:border-[var(--neon-cyan)] transition-colors rounded-none" />
              <button className="px-6 py-3 font-[800] text-[13px] uppercase tracking-wider text-[var(--ink)] bg-[var(--neon-cyan)] border-[2px] border-[var(--neon-cyan)] hover:bg-transparent hover:text-[var(--neon-cyan)] transition-colors whitespace-nowrap rounded-none">
                Subscribe
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
