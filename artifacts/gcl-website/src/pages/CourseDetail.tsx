import React, { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { motion } from 'framer-motion';
import { useAdmin } from '../context/AdminContext';
import { psychologyOfSpendingContent } from '../data/courseContent';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(s => (
        <svg key={s} viewBox="0 0 16 16" className="w-4 h-4" fill={s <= Math.round(rating) ? '#f59e0b' : 'none'} stroke="#f59e0b" strokeWidth="1.5">
          <path d="M8 1l1.85 3.75 4.14.6-3 2.92.71 4.12L8 10.27l-3.7 1.95.71-4.12-3-2.92 4.14-.6z" />
        </svg>
      ))}
    </div>
  );
}

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [vis, setVis] = React.useState(false);
  React.useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.08 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 22 }} animate={vis ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay }} className={className}>
      {children}
    </motion.div>
  );
}

export function CourseDetail() {
  const [, params] = useRoute('/courses/:slug');
  const { courses } = useAdmin();
  const course = courses.find(c => c.slug === params?.slug);
  const [openModule, setOpenModule] = useState<number | null>(0);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">📚</div>
          <h2 className="font-[800] text-2xl mb-2">Course not found.</h2>
          <Link href="/courses" className="btn btn-dark mt-4">Browse All Courses</Link>
        </div>
      </div>
    );
  }

  const isPsychology = course.slug === 'psychology-of-spending';
  const content = isPsychology ? psychologyOfSpendingContent : null;

  const gradientMap = { t1: 'from-[#dbe4ff] to-[#c9b8ff]', t2: 'from-[#f1c9f7] to-[#ffd3ea]', t3: 'from-[#c7f0ff] to-[#c3e3ff]' };
  const gradient = gradientMap[course.color] ?? gradientMap.t1;
  const totalModules = course.modules.length;
  const totalHours = parseFloat(course.duration) * 1.5 || totalModules * 0.6;

  const fileIcon = (type: string) => ({ pdf: '📄', worksheet: '📝', template: '📋', audio: '🎧' }[type] ?? '📎');

  return (
    <main className="pb-24">
      {/* ─── HERO BANNER ─── */}
      <section className="relative pt-[100px] pb-0 overflow-hidden" style={{ background: 'var(--brutal-bg)' }}>
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 80% 20%, var(--violet), transparent)' }} />
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(90deg,white 0px,white 1px,transparent 1px,transparent 80px),repeating-linear-gradient(0deg,white 0px,white 1px,transparent 1px,transparent 80px)' }} />

        <div className="max-w-[1240px] mx-auto px-8 pb-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
            <div>
              <Link href="/courses" className="inline-flex items-center gap-2 text-[13px] font-[700] text-[var(--brutal-text-dim)] hover:text-[var(--neon-cyan)] transition-colors mb-6">
                ← All Courses
              </Link>

              <div className="flex flex-wrap gap-2 mb-5">
                <span className="text-[11px] font-[800] uppercase tracking-wider px-3 py-1.5 rounded-full" style={{ background: 'rgba(139,92,246,0.2)', color: 'var(--violet)', border: '1px solid rgba(139,92,246,0.3)' }}>{course.tag}</span>
                <span className="text-[11px] font-[800] uppercase tracking-wider px-3 py-1.5 rounded-full" style={{ background: 'rgba(94,234,255,0.12)', color: 'var(--neon-cyan)', border: '1px solid rgba(94,234,255,0.25)' }}>{course.level}</span>
                {content && <span className="text-[11px] font-[800] uppercase tracking-wider px-3 py-1.5 rounded-full" style={{ background: 'rgba(40,200,64,0.12)', color: '#28c840', border: '1px solid rgba(40,200,64,0.25)' }}>🏆 Certificate</span>}
              </div>

              <h1 className="font-[800] text-[clamp(32px,5vw,58px)] leading-[1.02] tracking-[-0.03em] text-white mb-5">{course.title}</h1>

              {content && (
                <p className="text-[16px] text-[var(--brutal-text-dim)] leading-[1.7] max-w-[580px] mb-7">
                  {content.aboutCourse.split('\n')[0]}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-5 mb-6">
                {content && (
                  <>
                    <div className="flex items-center gap-2">
                      <StarRating rating={content.rating} />
                      <span className="font-[800] text-[var(--neon-cyan)] text-[15px]">{content.rating}</span>
                      <span className="text-[13px] text-[var(--brutal-text-dim)]">({content.reviewCount.toLocaleString()} reviews)</span>
                    </div>
                    <span className="text-[13px] text-[var(--brutal-text-dim)]">👥 {content.totalEnrolled.toLocaleString()} enrolled</span>
                    <span className="text-[13px] text-[var(--brutal-text-dim)]">🌐 {content.language}</span>
                    <span className="text-[13px] text-[var(--brutal-text-dim)]">📅 Updated {content.lastUpdated}</span>
                  </>
                )}
              </div>

              <div className="flex flex-wrap gap-5 text-[13.5px] font-[600] text-[var(--brutal-text-dim)]">
                <span className="flex items-center gap-1.5">📚 <strong className="text-white">{totalModules} modules</strong></span>
                <span className="flex items-center gap-1.5">⏱️ <strong className="text-white">{course.duration}</strong></span>
                <span className="flex items-center gap-1.5">🎯 <strong className="text-white">{course.level}</strong></span>
                {content && <span className="flex items-center gap-1.5">📝 <strong className="text-white">{totalModules * 3} quiz questions</strong></span>}
                {content && <span className="flex items-center gap-1.5">🏆 <strong className="text-white">Score 8+/10 for certificate</strong></span>}
              </div>

              {content && (
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {['#3358ff', '#8b5cf6', '#e93fc7', '#28c840'].map((c, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-[var(--brutal-bg)]" style={{ background: `linear-gradient(135deg, ${c}, ${c}99)` }} />
                    ))}
                  </div>
                  <span className="text-[13px] text-[var(--brutal-text-dim)]">
                    <strong className="text-white">{(content.totalEnrolled - 12).toLocaleString()}+</strong> people completed this course
                  </span>
                </div>
              )}
            </div>

            {/* Sticky Enrollment Card */}
            <div className="lg:sticky lg:top-[100px]">
              <div className="bg-white rounded-[24px] border-[2.5px] border-[var(--ink)] shadow-[10px_10px_0px_var(--ink)] overflow-hidden">
                {/* Course preview */}
                <div className={`h-[180px] bg-gradient-to-br ${gradient} flex items-center justify-center relative border-b-[2.5px] border-[var(--ink)]`}>
                  <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-25">📚</div>
                  <div className="relative text-center">
                    <div className="w-14 h-14 rounded-full bg-white/90 border-[2px] border-[var(--ink)] flex items-center justify-center shadow-[4px_4px_0px_var(--ink)] cursor-pointer hover:scale-110 transition-transform mx-auto mb-2">
                      <span className="text-2xl ml-1">▶</span>
                    </div>
                    <div className="text-[12px] font-[700] text-[var(--ink)] bg-white/80 px-3 py-1 rounded-full">Preview course</div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-[800] text-[28px] text-[var(--ink)]">Free</div>
                    <span className="text-[12px] font-[700] text-[var(--violet)] bg-[var(--pill-bg)] px-3 py-1 rounded-full">Open Access</span>
                  </div>
                  <p className="text-[13px] text-[var(--ink-soft)] mb-5 pb-5 border-b border-[var(--line)]">All GCL courses are completely free — no credit card, no catch.</p>

                  {isPsychology ? (
                    <Link href={`/courses/${course.slug}/learn`}
                      className="w-full py-4 rounded-[14px] text-white font-[800] text-[16px] flex items-center justify-center gap-2 transition-all hover:-translate-y-[2px] mb-4"
                      style={{ background: 'var(--grad-brand)', boxShadow: '0 6px 20px rgba(139,92,246,0.35)' }}>
                      Enroll Now — Start Learning →
                    </Link>
                  ) : (
                    <button className="w-full py-4 rounded-[14px] text-white font-[800] text-[16px] flex items-center justify-center gap-2 transition-all hover:-translate-y-[2px] mb-4"
                      style={{ background: 'var(--grad-brand)', boxShadow: '0 6px 20px rgba(139,92,246,0.35)' }}>
                      Enroll Now →
                    </button>
                  )}

                  <ul className="space-y-3 text-[13.5px] text-[var(--ink)]">
                    {[
                      { icon: '📚', text: `${totalModules} modules` },
                      { icon: '🎬', text: 'Video lessons per module' },
                      { icon: '📝', text: 'Reading materials & worksheets' },
                      { icon: '🧩', text: 'Quizzes to test understanding' },
                      { icon: '📁', text: 'Downloadable files & templates' },
                      { icon: '♾️', text: 'Full lifetime access' },
                      { icon: '🏆', text: 'Certificate on score 8+/10' },
                    ].map(item => (
                      <li key={item.text} className="flex items-center gap-3">
                        <span className="text-base">{item.icon}</span>
                        <span className="font-[500]">{item.text}</span>
                      </li>
                    ))}
                  </ul>

                  {content && (
                    <div className="mt-5 pt-5 border-t border-[var(--line)]">
                      <div className="text-[12px] font-[800] uppercase tracking-wider text-[var(--ink-faint)] mb-3">Certificate Scoring</div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex-1 h-2.5 rounded-full bg-[var(--paper-alt)] overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-[var(--blue)] to-[var(--violet)]" style={{ width: '80%' }} />
                        </div>
                        <span className="text-[12px] font-[800] text-[var(--violet)]">8/10</span>
                      </div>
                      <p className="text-[12px] text-[var(--ink-soft)]">Score 8 or higher across all module quizzes to earn your certificate.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MAIN CONTENT ─── */}
      <div className="max-w-[1240px] mx-auto px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          <div>
            {/* What you'll learn */}
            {content && (
              <Reveal className="mb-10">
                <div className="rounded-[20px] border-[2.5px] border-[var(--ink)] shadow-[6px_6px_0px_var(--ink)] p-8" style={{ background: 'linear-gradient(135deg, #e8edff, #f5effe)' }}>
                  <h2 className="font-[800] text-[22px] tracking-[-0.01em] mb-6">What you'll learn</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {content.whatYouLearn.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 text-[14px] font-[500]">
                        <span className="text-[var(--violet)] font-[800] shrink-0 mt-0.5">✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}

            {/* Curriculum */}
            <Reveal className="mb-10">
              <h2 className="font-[800] text-[24px] tracking-[-0.01em] mb-2">Course Curriculum</h2>
              <p className="text-[14px] text-[var(--ink-soft)] mb-6">{totalModules} modules · {course.duration} · {content ? `${totalModules * 3} quiz questions` : 'Quizzes included'}</p>

              <div className="space-y-3">
                {course.modules.map((mod, i) => {
                  const moduleContent = content?.modules[i];
                  const isOpen = openModule === i;
                  return (
                    <div key={i} className="rounded-[16px] border-[2px] border-[var(--line)] bg-white overflow-hidden transition-shadow hover:shadow-[4px_4px_0px_var(--ink)]">
                      <button
                        className="w-full flex items-center justify-between p-5 text-left"
                        onClick={() => setOpenModule(isOpen ? null : i)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-9 h-9 rounded-[10px] bg-[var(--pill-bg)] flex items-center justify-center font-[800] text-[13px] text-[var(--pill-ink)] shrink-0">
                            {String(i + 1).padStart(2, '0')}
                          </div>
                          <div className="text-left">
                            <div className="font-[800] text-[15px] leading-tight">{mod.title}</div>
                            {moduleContent && (
                              <div className="text-[12px] text-[var(--ink-faint)] mt-0.5 flex items-center gap-3">
                                <span>🎬 {moduleContent.video.duration}</span>
                                <span>📝 {moduleContent.reading.readTime}</span>
                                <span>📁 {moduleContent.files.length} files</span>
                                <span>🧩 {moduleContent.quiz.length} questions</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <span className="text-[var(--ink-soft)] font-[700] text-[18px] shrink-0 ml-4 transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}>⌄</span>
                      </button>

                      {isOpen && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="border-t border-[var(--line)]">
                          <div className="p-5 space-y-2">
                            <p className="text-[13.5px] text-[var(--ink-soft)] leading-[1.6] mb-4">{mod.description}</p>
                            {moduleContent && (
                              <>
                                <div className="flex items-center gap-3 p-3 rounded-[10px] bg-[var(--paper-alt)] text-[13px]">
                                  <span>🎬</span>
                                  <span className="font-[600] flex-1">{moduleContent.video.title}</span>
                                  <span className="text-[var(--ink-faint)] shrink-0">{moduleContent.video.duration}</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-[10px] bg-[var(--paper-alt)] text-[13px]">
                                  <span>📖</span>
                                  <span className="font-[600] flex-1">{moduleContent.reading.title}</span>
                                  <span className="text-[var(--ink-faint)] shrink-0">{moduleContent.reading.readTime}</span>
                                </div>
                                {moduleContent.files.map(f => (
                                  <div key={f.name} className="flex items-center gap-3 p-3 rounded-[10px] bg-[var(--paper-alt)] text-[13px]">
                                    <span>{fileIcon(f.type)}</span>
                                    <span className="font-[600] flex-1">{f.name}</span>
                                    <span className="text-[var(--ink-faint)] shrink-0">{f.size}</span>
                                  </div>
                                ))}
                                <div className="flex items-center gap-3 p-3 rounded-[10px] bg-[var(--paper-alt)] text-[13px]">
                                  <span>🧩</span>
                                  <span className="font-[600] flex-1">Module Quiz — {moduleContent.quiz.length} questions</span>
                                  <span className="text-[var(--ink-faint)] shrink-0">~5 min</span>
                                </div>
                              </>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Reveal>

            {/* Requirements */}
            {content && (
              <Reveal className="mb-10">
                <h2 className="font-[800] text-[22px] tracking-[-0.01em] mb-5">Requirements</h2>
                <ul className="space-y-2">
                  {content.requirements.map((r, i) => (
                    <li key={i} className="flex items-start gap-3 text-[14.5px] text-[var(--ink-soft)]">
                      <span className="text-[var(--violet)] mt-0.5">•</span>{r}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {/* Instructors */}
            <Reveal className="mb-10">
              <h2 className="font-[800] text-[22px] tracking-[-0.01em] mb-5">Instructors</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {course.instructors.map((inst, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 rounded-[16px] border-[2px] border-[var(--line)] bg-white hover:border-[var(--violet)] transition-colors">
                    <div className="w-[56px] h-[56px] rounded-full flex items-center justify-center text-white font-[800] text-[20px] shrink-0"
                      style={{ background: i % 2 === 0 ? 'linear-gradient(135deg,var(--blue),var(--violet))' : 'linear-gradient(135deg,var(--violet),var(--magenta))' }}>
                      {inst.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-[800] text-[15px]">{inst.name}</div>
                      <div className="text-[13px] text-[var(--ink-faint)] font-[500]">{inst.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Who is this for */}
            {content && (
              <Reveal>
                <h2 className="font-[800] text-[22px] tracking-[-0.01em] mb-5">Who this course is for</h2>
                <ul className="space-y-2">
                  {content.targetAudience.map((a, i) => (
                    <li key={i} className="flex items-start gap-3 text-[14.5px] text-[var(--ink-soft)]">
                      <span className="text-[var(--violet)] mt-0.5">→</span>{a}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </div>

          {/* Right column — desktop only (already shown above on mobile) */}
          <div className="hidden lg:block" />
        </div>
      </div>

      {/* ─── BOTTOM CTA ─── */}
      <div className="max-w-[1240px] mx-auto px-8 mt-16">
        <Reveal>
          <div className="rounded-[24px] p-10 flex flex-col md:flex-row items-center justify-between gap-8 border-[2.5px] border-[var(--ink)] shadow-[8px_8px_0px_var(--ink)]"
            style={{ background: 'linear-gradient(135deg, #0b0817 0%, #1c1640 100%)' }}>
            <div>
              <div className="font-[800] text-[26px] text-white mb-2">Ready to start?</div>
              <div className="text-[15px] text-[var(--brutal-text-dim)] max-w-[440px]">
                Join {content?.totalEnrolled.toLocaleString() ?? 'thousands of'} learners who have already completed this course. It's free, self-paced, and could change how you think about money forever.
              </div>
            </div>
            {isPsychology ? (
              <Link href={`/courses/${course.slug}/learn`}
                className="shrink-0 py-4 px-10 rounded-full text-white font-[800] text-[16px] transition-all hover:-translate-y-[2px] whitespace-nowrap"
                style={{ background: 'var(--grad-brand)', boxShadow: '0 6px 24px rgba(139,92,246,0.4)' }}>
                Start Learning Free →
              </Link>
            ) : (
              <button className="shrink-0 py-4 px-10 rounded-full text-white font-[800] text-[16px] transition-all hover:-translate-y-[2px] whitespace-nowrap"
                style={{ background: 'var(--grad-brand)', boxShadow: '0 6px 24px rgba(139,92,246,0.4)' }}>
                Enroll Now — It's Free →
              </button>
            )}
          </div>
        </Reveal>
      </div>
    </main>
  );
}
