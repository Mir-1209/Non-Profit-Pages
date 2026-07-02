import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAdmin } from '../context/AdminContext';

const CATS = ['All', 'Research', 'Update', 'Story', 'Announcement'] as const;
const catColors: Record<string, string> = {
  Research: 'var(--blue)',
  Update: 'var(--violet)',
  Story: 'var(--magenta)',
  Announcement: '#28c840',
};
const catBg: Record<string, string> = {
  Research: 'rgba(51,88,255,0.1)',
  Update: 'rgba(139,92,246,0.1)',
  Story: 'rgba(233,63,199,0.1)',
  Announcement: 'rgba(40,200,64,0.1)',
};

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = React.useRef(null);
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay }} className={className}>
      {children}
    </motion.div>
  );
}

export function News() {
  const { news } = useAdmin();
  const published = news.filter(p => p.published);
  const [cat, setCat] = useState<string>('All');
  const filtered = cat === 'All' ? published : published.filter(p => p.category === cat);
  const [expanded, setExpanded] = React.useState<string | null>(null);

  return (
    <main className="pb-32">
      <section className="relative pt-[90px] pb-[80px] overflow-hidden" style={{ background: 'var(--brutal-bg)' }}>
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 30% 20%, var(--blue), transparent)' }} />
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(90deg,white 0px,white 1px,transparent 1px,transparent 80px), repeating-linear-gradient(0deg,white 0px,white 1px,transparent 1px,transparent 80px)' }} />
        <div className="max-w-[1240px] mx-auto px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-[2px] w-12" style={{ background: 'var(--grad-brand)' }} />
              <span className="text-[13px] font-[800] tracking-[0.1em] uppercase text-[var(--neon-cyan)]">Latest Updates</span>
            </div>
            <h1 className="font-[800] text-[clamp(48px,7vw,88px)] leading-[0.95] tracking-[-0.03em] text-white uppercase mb-6">
              GCL<br />
              <span style={{ background: 'var(--grad-brand)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>News.</span>
            </h1>
            <p className="text-[17px] text-[var(--brutal-text-dim)] leading-[1.7] max-w-[500px]">
              Research, stories, announcements, and impact updates from the Global Capital League.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[1240px] mx-auto px-8">
          <div className="flex gap-2 flex-wrap mb-10">
            {CATS.map(c => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className="px-5 py-2.5 rounded-full text-[13.5px] font-[700] transition-all"
                style={cat === c
                  ? { background: 'var(--ink)', color: '#fff', boxShadow: '3px 3px 0px rgba(21,19,44,0.3)' }
                  : { background: 'var(--paper-alt)', color: 'var(--ink-soft)', border: '1.5px solid var(--line)' }}
              >
                {c}
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-24 text-[var(--ink-soft)] font-[600] text-[18px]">No posts in this category yet.</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <Reveal key={post.id} delay={i * 0.06}>
                <div
                  className="bg-white rounded-[20px] border-[2.5px] border-[var(--ink)] shadow-[7px_7px_0px_var(--ink)] overflow-hidden flex flex-col cursor-pointer hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0px_var(--ink)] transition-all"
                  onClick={() => setExpanded(expanded === post.id ? null : post.id)}
                >
                  <div className="h-[8px]" style={{ background: catColors[post.category] ?? '#888' }} />
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] font-[800] uppercase tracking-wider px-2.5 py-1 rounded-md" style={{ background: catBg[post.category] ?? 'var(--paper-alt)', color: catColors[post.category] ?? 'var(--ink-soft)' }}>{post.category}</span>
                      <span className="text-[12px] text-[var(--ink-faint)] font-[500]">{post.date}</span>
                    </div>
                    <h3 className="font-[800] text-[18px] leading-[1.25] mb-3 tracking-[-0.01em]">{post.title}</h3>
                    <p className="text-[13.5px] text-[var(--ink-soft)] leading-[1.65] flex-1">{post.excerpt}</p>
                    {expanded === post.id && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-[var(--line)]">
                        <p className="text-[13.5px] text-[var(--ink-soft)] leading-[1.7]">{post.content}</p>
                      </motion.div>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-[12.5px] text-[var(--ink-faint)] font-[600]">By {post.author}</span>
                      <span className="text-[12.5px] font-[700] text-[var(--violet)]">{expanded === post.id ? 'Show less ↑' : 'Read more →'}</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
