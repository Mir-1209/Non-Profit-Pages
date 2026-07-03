import React from 'react';
import { useRoute, Link } from 'wouter';
import { motion } from 'framer-motion';
import { newsPosts } from '../data/news';

const catLabel: Record<string, string> = {
  Research: 'RESEARCH',
  Update: 'UPDATE',
  Story: 'STORY',
  Announcement: 'ANNOUNCEMENT',
};

function PhotoPlaceholder({ bg, label, className = '', aspectLabel = '', style }: { bg: string; label: string; className?: string; aspectLabel?: string; style?: React.CSSProperties }) {
  return (
    <div className={`relative overflow-hidden flex items-end ${className}`} style={{ background: bg, ...style }}>
      <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.035) 0px,rgba(255,255,255,0.035) 1px,transparent 1px,transparent 22px)' }} />
      {aspectLabel && (
        <div className="absolute top-4 right-4 text-[10px] font-[700] uppercase tracking-wider text-white/30">{aspectLabel}</div>
      )}
      <div className="relative z-10 p-5">
        <div className="text-[10px] font-[800] uppercase tracking-[0.12em] text-white/40 border border-white/20 px-2 py-1 inline-block">{label}</div>
      </div>
    </div>
  );
}

export function NewsDetail() {
  const [, params] = useRoute('/news/:id');
  const post = newsPosts.find(p => p.id === params?.id);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-[100px]">
        <div className="text-center">
          <div className="text-[80px] font-[800] text-[var(--line)]">404</div>
          <h2 className="font-[800] text-2xl mb-4">Article not found.</h2>
          <Link href="/news" className="btn btn-dark">← Back to News</Link>
        </div>
      </div>
    );
  }

  const otherPosts = newsPosts.filter(p => p.id !== post.id && p.published).slice(0, 3);

  return (
    <main className="pb-32 pt-[90px]" style={{ background: 'var(--paper-alt)' }}>
      <div className="max-w-[1240px] mx-auto px-8">

        {/* ─── NEWSPAPER MASTHEAD ─── */}
        <div className="border-b-[2.5px] border-[var(--ink)] pb-4 mb-6">
          <div className="flex items-center justify-between text-[11px] font-[700] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
            <Link href="/news" className="hover:text-[var(--ink)] transition-colors">← THE GCL POST</Link>
            <span>{post.date}</span>
            <span>{post.readTime}</span>
          </div>
        </div>

        {/* ─── ARTICLE HEADER ─── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[11px] font-[800] uppercase tracking-[0.15em] px-3 py-1.5 border-[2px] border-[var(--ink)]">{catLabel[post.category]}</span>
            {post.tags.map(tag => (
              <span key={tag} className="text-[11px] font-[600] uppercase tracking-wider text-[var(--ink-faint)] border border-[var(--line)] px-2 py-1">{tag}</span>
            ))}
          </div>

          <h1 className="font-[800] text-[clamp(30px,5vw,62px)] leading-[1.0] tracking-[-0.03em] mb-6 max-w-[820px]">
            {post.title}
          </h1>

          <p className="text-[18px] text-[var(--ink-soft)] leading-[1.65] max-w-[680px] mb-6 font-[400] italic">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-5 pb-6 border-b-[2px] border-[var(--line)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--ink)] flex items-center justify-center text-white text-[14px] font-[800]">
                {post.author.charAt(0)}
              </div>
              <div>
                <div className="font-[800] text-[14px]">{post.author}</div>
                <div className="text-[12px] text-[var(--ink-faint)]">{post.authorTitle}</div>
              </div>
            </div>
            <div className="text-[var(--line)]">|</div>
            <div className="text-[13px] text-[var(--ink-faint)]">{post.date}</div>
            <div className="text-[var(--line)]">|</div>
            <div className="text-[13px] text-[var(--ink-faint)]">{post.readTime}</div>
          </div>
        </motion.div>

        {/* ─── HERO IMAGE ─── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.15 }} className="mb-10">
          <PhotoPlaceholder
            bg={post.imageBg}
            label={post.imageLabel}
            aspectLabel="Main Photo"
            className="w-full border-[2.5px] border-[var(--ink)] shadow-[8px_8px_0px_var(--ink)]"
            style={{ height: 'clamp(260px, 40vw, 480px)' } as React.CSSProperties}
          />
          <div className="mt-2 text-[11px] font-[600] uppercase tracking-wider text-[var(--ink-faint)]">
            {post.imageLabel} · Global Capital League
          </div>
        </motion.div>

        {/* ─── ARTICLE BODY + SIDEBAR ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">

          {/* Article Text */}
          <div>
            <div className="space-y-0">
              {post.fullContent.map((paragraph, i) => (
                <div key={i}>
                  {i === 2 && (
                    <div className="my-8">
                      <PhotoPlaceholder
                        bg={post.imageBg.replace('100%', '80%').replace('0%', '10%')}
                        label="Secondary Photo"
                        aspectLabel="Photo 2 of 4"
                        className="w-full border-[2.5px] border-[var(--ink)] shadow-[6px_6px_0px_var(--ink)]"
                        style={{ height: 260 } as React.CSSProperties}
                      />
                      <div className="mt-2 text-[11px] font-[600] uppercase tracking-wider text-[var(--ink-faint)]">
                        Caption placeholder · {post.author}
                      </div>
                    </div>
                  )}
                  {i === 4 && (
                    <blockquote className="my-8 pl-6 border-l-[5px] border-[var(--ink)]">
                      <p className="font-[800] text-[20px] leading-[1.35] tracking-[-0.01em] text-[var(--ink)] italic">
                        "{paragraph.slice(0, 120)}..."
                      </p>
                    </blockquote>
                  )}
                  {i !== 4 && (
                    <p className={`text-[16px] leading-[1.8] text-[var(--ink-soft)] mb-6 ${i === 0 ? 'text-[18px] font-[500] text-[var(--ink)]' : ''}`}>
                      {paragraph}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Photo grid at bottom */}
            <div className="grid grid-cols-2 gap-3 mt-10 mb-8">
              <PhotoPlaceholder
                bg={post.imageBg}
                label="Photo 3 of 4"
                className="border-[2.5px] border-[var(--ink)] shadow-[4px_4px_0px_var(--ink)]"
                style={{ height: 200 } as React.CSSProperties}
              />
              <PhotoPlaceholder
                bg={post.imageBg.replace('135deg', '315deg')}
                label="Photo 4 of 4"
                className="border-[2.5px] border-[var(--ink)] shadow-[4px_4px_0px_var(--ink)]"
                style={{ height: 200 } as React.CSSProperties}
              />
            </div>
            <div className="text-[11px] font-[600] uppercase tracking-wider text-[var(--ink-faint)] mb-10">
              Photography: {post.imageLabel}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-8 border-t-[2px] border-[var(--line)] mb-8">
              {post.tags.map(tag => (
                <span key={tag} className="text-[12px] font-[700] uppercase tracking-wider px-4 py-2 border-[2px] border-[var(--ink)] hover:bg-[var(--ink)] hover:text-white transition-colors cursor-pointer">
                  {tag}
                </span>
              ))}
            </div>

            {/* Author Box */}
            <div className="border-[2.5px] border-[var(--ink)] shadow-[6px_6px_0px_var(--ink)] p-7 flex gap-5 items-start" style={{ background: 'var(--paper-alt)' }}>
              <div className="w-16 h-16 rounded-full bg-[var(--ink)] flex items-center justify-center text-white text-[22px] font-[800] shrink-0">
                {post.author.charAt(0)}
              </div>
              <div>
                <div className="text-[10px] font-[800] uppercase tracking-[0.15em] text-[var(--ink-faint)] mb-1">Written by</div>
                <div className="font-[800] text-[17px] mb-1">{post.author}</div>
                <div className="text-[13px] text-[var(--ink-soft)]">{post.authorTitle}</div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* More Photos */}
            <div>
              <div className="text-[10px] font-[800] uppercase tracking-[0.15em] text-[var(--ink-faint)] mb-3 border-b-[2px] border-[var(--line)] pb-2">In This Story</div>
              <div className="space-y-3">
                {[
                  { label: 'On Location', aspect: 'Portrait' },
                  { label: 'Documentation', aspect: 'Square' },
                  { label: 'Community', aspect: 'Landscape' },
                ].map((ph, i) => (
                  <div key={i} className="border-[2px] border-[var(--ink)] shadow-[3px_3px_0px_var(--ink)] overflow-hidden">
                    <PhotoPlaceholder
                      bg={post.imageBg}
                      label={ph.label}
                      aspectLabel={ph.aspect}
                      className=""
                      style={{ height: 140 } as React.CSSProperties}
                    />
                    <div className="bg-white px-3 py-2 text-[11px] text-[var(--ink-faint)] font-[600]">{ph.label} · {post.date}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Facts */}
            <div className="border-[2.5px] border-[var(--ink)] shadow-[5px_5px_0px_var(--ink)] p-6 bg-white">
              <div className="text-[10px] font-[800] uppercase tracking-[0.15em] text-[var(--violet)] mb-4">Key Facts</div>
              <div className="space-y-4">
                {[
                  { label: 'Category', value: post.category },
                  { label: 'Published', value: post.date },
                  { label: 'Author', value: post.author },
                  { label: 'Read Time', value: post.readTime },
                ].map(item => (
                  <div key={item.label} className="border-b border-[var(--line)] pb-3">
                    <div className="text-[10px] font-[700] uppercase tracking-wider text-[var(--ink-faint)] mb-1">{item.label}</div>
                    <div className="text-[14px] font-[700] text-[var(--ink)]">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related */}
            <div>
              <div className="text-[10px] font-[800] uppercase tracking-[0.15em] text-[var(--ink-faint)] mb-3 border-b-[2px] border-[var(--line)] pb-2">Related Stories</div>
              <div className="space-y-4">
                {otherPosts.map(related => (
                  <Link key={related.id} href={`/news/${related.id}`}
                    className="flex gap-3 group items-start">
                    <PhotoPlaceholder
                      bg={related.imageBg}
                      label=""
                      className="shrink-0 border border-[var(--ink)]"
                      style={{ width: 72, height: 72 } as React.CSSProperties}
                    />
                    <div>
                      <div className="text-[10px] font-[800] uppercase tracking-wider text-[var(--ink-faint)] mb-1">{related.category}</div>
                      <div className="font-[700] text-[13px] leading-tight group-hover:underline underline-offset-2">{related.title}</div>
                      <div className="text-[11px] text-[var(--ink-faint)] mt-1">{related.readTime}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
