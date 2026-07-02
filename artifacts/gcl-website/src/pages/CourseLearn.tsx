import React, { useState, useEffect, useRef } from 'react';
import { useRoute, Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../context/AdminContext';
import { psychologyOfSpendingContent, type QuizQuestion, type CourseModuleContent } from '../data/courseContent';

/* ─── Types ─── */
interface ModuleProgress {
  videoWatched: boolean;
  readingRead: boolean;
  quizAnswers: Record<string, number>;
  quizSubmitted: boolean;
  quizScore: number;
  completed: boolean;
}

type Tab = 'video' | 'reading' | 'files' | 'quiz';

/* ─── Helpers ─── */
function getStorageKey(courseSlug: string) {
  return `gcl_course_${courseSlug}`;
}

function loadProgress(courseSlug: string, moduleCount: number): ModuleProgress[] {
  try {
    const raw = localStorage.getItem(getStorageKey(courseSlug));
    if (raw) return JSON.parse(raw);
  } catch {}
  return Array.from({ length: moduleCount }, () => ({
    videoWatched: false, readingRead: false, quizAnswers: {}, quizSubmitted: false, quizScore: 0, completed: false,
  }));
}

function saveProgress(courseSlug: string, progress: ModuleProgress[]) {
  localStorage.setItem(getStorageKey(courseSlug), JSON.stringify(progress));
}

function calcOverallScore(progress: ModuleProgress[], content: typeof psychologyOfSpendingContent): number {
  let totalCorrect = 0, totalQuestions = 0;
  content.modules.forEach((mod, i) => {
    totalQuestions += mod.quiz.length;
    if (progress[i]?.quizSubmitted) totalCorrect += progress[i].quizScore;
  });
  if (totalQuestions === 0) return 0;
  return Math.round((totalCorrect / totalQuestions) * 100) / 10;
}

function calcCompletedModules(progress: ModuleProgress[]) {
  return progress.filter(p => p.completed).length;
}

/* ─── Sub-components ─── */
function VideoPlayer({ video, onWatched }: { video: CourseModuleContent['video']; onWatched: () => void }) {
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [marked, setMarked] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalSecs = (() => {
    const [m, s] = video.duration.split(':').map(Number);
    return m * 60 + s;
  })();

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setElapsed(prev => {
          const next = prev + 1;
          if (next >= totalSecs) { setPlaying(false); clearInterval(intervalRef.current!); return totalSecs; }
          if (next >= totalSecs * 0.85 && !marked) { setMarked(true); onWatched(); }
          return next;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing]);

  const pct = (elapsed / totalSecs) * 100;
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div>
      {/* Video canvas */}
      <div className="rounded-[20px] overflow-hidden border-[2.5px] border-[var(--ink)] shadow-[8px_8px_0px_var(--ink)] mb-5" style={{ background: 'linear-gradient(135deg,#0b0817,#1c1640)' }}>
        <div className="relative" style={{ paddingTop: '56.25%' }}>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-[72px] h-[72px] rounded-full border-[2.5px] border-white/30 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all"
                onClick={() => setPlaying(p => !p)}>
                {playing
                  ? <div className="flex gap-2"><div className="w-3 h-8 bg-white rounded-sm" /><div className="w-3 h-8 bg-white rounded-sm" /></div>
                  : <div className="w-0 h-0 border-t-[16px] border-b-[16px] border-l-[28px] border-transparent border-l-white ml-2" />}
              </div>
            </div>
            <div className="text-center px-8">
              <div className="font-[800] text-white text-[18px] mb-1">{video.title}</div>
              <div className="text-white/50 text-[13px]">{playing ? 'Playing…' : elapsed > 0 ? 'Paused' : 'Click play to begin'}</div>
            </div>
          </div>
          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-3 text-white/70 text-[12px] mb-2">
              <span>{fmt(elapsed)}</span>
              <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer" onClick={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                const ratio = (e.clientX - rect.left) / rect.width;
                setElapsed(Math.floor(ratio * totalSecs));
              }}>
                <div className="h-full bg-white rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
              <span>{video.duration}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters */}
      <div className="mb-6">
        <div className="text-[13px] font-[800] uppercase tracking-wider text-[var(--ink-faint)] mb-3">Chapters</div>
        <div className="space-y-1">
          {video.chapters.map((ch, i) => {
            const [m, s] = ch.time.split(':').map(Number);
            const chSec = m * 60 + s;
            const active = elapsed >= chSec && (i === video.chapters.length - 1 || elapsed < (() => { const [nm, ns] = video.chapters[i + 1].time.split(':').map(Number); return nm * 60 + ns; })());
            return (
              <button key={i} onClick={() => setElapsed(chSec)}
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13px] transition-all ${active ? 'bg-[var(--pill-bg)] font-[700]' : 'hover:bg-[var(--paper-alt)]'}`}>
                <span className="font-[700] text-[var(--violet)] w-10 shrink-0">{ch.time}</span>
                <span className={active ? 'text-[var(--ink)]' : 'text-[var(--ink-soft)]'}>{ch.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Key takeaways */}
      <div className="rounded-[14px] border-[2px] border-[var(--line)] p-5 bg-[var(--paper-alt)]">
        <div className="text-[13px] font-[800] uppercase tracking-wider text-[var(--ink-faint)] mb-3">Video Description</div>
        <p className="text-[14px] text-[var(--ink-soft)] leading-[1.65]">{video.description}</p>
      </div>
    </div>
  );
}

function ReadingPanel({ reading, onRead }: { reading: CourseModuleContent['reading']; onRead: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    if (notified) return;
    const el = ref.current;
    if (!el) return;
    const handler = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      if (scrollTop + clientHeight >= scrollHeight - 40) {
        setNotified(true);
        onRead();
      }
    };
    el.addEventListener('scroll', handler);
    return () => el.removeEventListener('scroll', handler);
  }, [notified, onRead]);

  function renderContent(text: string) {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} className="font-[800] text-[22px] tracking-[-0.01em] mt-8 mb-4 first:mt-0">{line.replace('## ', '')}</h2>;
      if (line.startsWith('**') && line.endsWith('**') && !line.includes(':')) return <strong key={i} className="block font-[800]">{line.replace(/\*\*/g, '')}</strong>;
      if (line === '') return <div key={i} className="h-3" />;
      const parts = line.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
        part.startsWith('**') ? <strong key={j} className="font-[800] text-[var(--ink)]">{part.replace(/\*\*/g, '')}</strong> : part
      );
      if (line.startsWith('- ') || line.startsWith('1. ')) {
        return <li key={i} className="ml-4 text-[15px] leading-[1.7] text-[var(--ink-soft)] mb-1">{line.replace(/^[-•] /, '').replace(/^\d+\. /, '')}</li>;
      }
      return <p key={i} className="text-[15px] leading-[1.75] text-[var(--ink-soft)] mb-3">{parts}</p>;
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-[800] text-[22px] tracking-[-0.01em]">{reading.title}</h2>
          <span className="text-[13px] text-[var(--ink-faint)]">{reading.readTime} · Scroll to the bottom to mark as complete</span>
        </div>
      </div>

      <div ref={ref} className="rounded-[20px] border-[2.5px] border-[var(--ink)] shadow-[6px_6px_0px_var(--ink)] bg-white p-8 md:p-10 overflow-y-auto" style={{ maxHeight: '65vh' }}>
        {reading.content.map((section, i) => (
          <div key={i} className="prose-section mb-2">{renderContent(section)}</div>
        ))}
        <div className="mt-10 pt-6 border-t border-[var(--line)] flex items-center gap-3 text-[13px] text-[var(--ink-faint)]">
          <span>📖</span>
          <span>You've reached the end of the reading. Great work! Move to the Files or Quiz tab next.</span>
        </div>
      </div>
    </div>
  );
}

function FilesPanel({ files }: { files: CourseModuleContent['files'] }) {
  const icons: Record<string, string> = { pdf: '📄', worksheet: '📝', template: '📋', audio: '🎧' };
  const colors: Record<string, string> = { pdf: '#e53e3e', worksheet: '#805ad5', template: '#3182ce', audio: '#d69e2e' };

  return (
    <div>
      <h2 className="font-[800] text-[22px] tracking-[-0.01em] mb-2">Downloadable Resources</h2>
      <p className="text-[14px] text-[var(--ink-soft)] mb-6">These materials complement the video and reading. Download them for offline use.</p>
      <div className="space-y-4">
        {files.map((f, i) => (
          <div key={i} className="flex items-center gap-5 p-5 rounded-[16px] border-[2.5px] border-[var(--line)] bg-white hover:border-[var(--violet)] hover:shadow-[4px_4px_0px_var(--ink)] transition-all group cursor-pointer">
            <div className="w-14 h-14 rounded-[14px] flex items-center justify-center text-[24px] shrink-0 border-[2px] border-[var(--line)]"
              style={{ background: `${colors[f.type] ?? '#888'}15` }}>
              {icons[f.type] ?? '📎'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-[800] text-[14.5px] mb-1 group-hover:text-[var(--violet)] transition-colors truncate">{f.name}</div>
              <div className="text-[13px] text-[var(--ink-soft)]">{f.description}</div>
              <div className="text-[12px] text-[var(--ink-faint)] mt-1 font-[600]">{f.size} · {f.type.charAt(0).toUpperCase() + f.type.slice(1)}</div>
            </div>
            <button className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border-[2px] border-[var(--ink)] text-[13px] font-[700] bg-white hover:bg-[var(--brutal-bg)] hover:text-white transition-all">
              ↓ Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuizPanel({
  questions, submitted, answers, score, onAnswer, onSubmit, onRetry
}: {
  questions: QuizQuestion[];
  submitted: boolean;
  answers: Record<string, number>;
  score: number;
  onAnswer: (qid: string, idx: number) => void;
  onSubmit: () => void;
  onRetry: () => void;
}) {
  const total = questions.length;
  const allAnswered = questions.every(q => answers[q.id] !== undefined);

  if (submitted) {
    const pct = Math.round((score / total) * 100);
    const excellent = score === total;
    const good = score >= Math.ceil(total * 0.67);
    return (
      <div>
        <div className={`rounded-[20px] p-8 text-center mb-8 border-[2.5px] border-[var(--ink)] shadow-[6px_6px_0px_var(--ink)] ${excellent ? 'bg-gradient-to-br from-[#d4f7dc] to-[#e8f5ff]' : good ? 'bg-gradient-to-br from-[#e8edff] to-[#f5effe]' : 'bg-gradient-to-br from-[#fff0f5] to-[#f5effe]'}`}>
          <div className="text-[56px] mb-4">{excellent ? '🏆' : good ? '⭐' : '📚'}</div>
          <div className="font-[800] text-[36px] mb-1">{score}/{total} correct</div>
          <div className="text-[16px] text-[var(--ink-soft)] mb-4">{pct}% accuracy on this module</div>
          {excellent && <div className="text-[14px] font-[700] text-green-700 bg-green-100 rounded-full px-5 py-2 inline-block">Perfect score! Excellent work.</div>}
          {good && !excellent && <div className="text-[14px] font-[700] text-[var(--violet)] bg-[var(--pill-bg)] rounded-full px-5 py-2 inline-block">Great work! Keep going.</div>}
          {!good && <div className="text-[14px] font-[700] text-orange-700 bg-orange-50 rounded-full px-5 py-2 inline-block">Review the material and try again.</div>}
        </div>

        <div className="space-y-6 mb-8">
          {questions.map((q, i) => {
            const chosen = answers[q.id];
            const correct = q.correct;
            const isRight = chosen === correct;
            return (
              <div key={q.id} className={`rounded-[16px] border-[2.5px] p-6 ${isRight ? 'border-green-400 bg-green-50' : 'border-red-300 bg-red-50'}`}>
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-[18px] shrink-0">{isRight ? '✅' : '❌'}</span>
                  <div className="font-[700] text-[15px] leading-[1.5]">Q{i + 1}: {q.question}</div>
                </div>
                <div className="space-y-2 mb-4">
                  {q.options.map((opt, oi) => {
                    const isCorrect = oi === correct;
                    const isChosen = oi === chosen;
                    return (
                      <div key={oi} className={`px-4 py-3 rounded-[10px] text-[13.5px] font-[500] border ${isCorrect ? 'border-green-500 bg-green-100 font-[700]' : isChosen && !isCorrect ? 'border-red-400 bg-red-100' : 'border-transparent bg-white/60'}`}>
                        {isCorrect && <span className="mr-2">✓</span>}{isChosen && !isCorrect && <span className="mr-2">✗</span>}{opt}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-start gap-2 text-[13px] text-[var(--ink-soft)] bg-white/70 rounded-[10px] p-4">
                  <span className="shrink-0 text-[var(--violet)]">💡</span>
                  <span><strong className="text-[var(--ink)]">Explanation:</strong> {q.explanation}</span>
                </div>
              </div>
            );
          })}
        </div>

        {!good && (
          <button onClick={onRetry}
            className="w-full py-4 rounded-[14px] border-[2.5px] border-[var(--ink)] font-[800] text-[15px] bg-white hover:bg-[var(--paper-alt)] transition-colors">
            Retry Quiz
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-[800] text-[22px] tracking-[-0.01em] mb-2">Module Quiz</h2>
      <p className="text-[14px] text-[var(--ink-soft)] mb-7">{total} questions · Choose the best answer for each question · No time limit</p>
      <div className="space-y-8 mb-8">
        {questions.map((q, i) => (
          <div key={q.id} className="rounded-[16px] border-[2.5px] border-[var(--line)] bg-white p-6">
            <div className="font-[800] text-[15.5px] leading-[1.5] mb-5">
              <span className="text-[var(--violet)] mr-2">Q{i + 1}.</span>{q.question}
            </div>
            <div className="space-y-3">
              {q.options.map((opt, oi) => (
                <button key={oi} onClick={() => onAnswer(q.id, oi)}
                  className={`w-full text-left px-4 py-3.5 rounded-[12px] border-[2px] text-[14px] font-[500] transition-all ${answers[q.id] === oi
                    ? 'border-[var(--violet)] bg-[var(--pill-bg)] font-[700] text-[var(--ink)]'
                    : 'border-[var(--line)] bg-[var(--paper-alt)] hover:border-[var(--violet)] hover:bg-[var(--pill-bg)]'}`}>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border-[2px] mr-3 text-[12px] font-[800] shrink-0"
                    style={{ borderColor: answers[q.id] === oi ? 'var(--violet)' : 'var(--line)', background: answers[q.id] === oi ? 'var(--violet)' : 'transparent', color: answers[q.id] === oi ? 'white' : 'var(--ink-faint)' }}>
                    {String.fromCharCode(65 + oi)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button onClick={onSubmit} disabled={!allAnswered}
        className="w-full py-4 rounded-[14px] text-white font-[800] text-[16px] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: allAnswered ? 'var(--grad-brand)' : 'var(--ink-faint)', boxShadow: allAnswered ? '0 6px 20px rgba(139,92,246,0.35)' : 'none' }}>
        {allAnswered ? 'Submit Quiz →' : `Answer all ${total} questions to submit`}
      </button>
    </div>
  );
}

/* ─── Main component ─── */
export function CourseLearn() {
  const [, params] = useRoute('/courses/:slug/learn');
  const { courses } = useAdmin();
  const course = courses.find(c => c.slug === params?.slug);
  const content = course?.slug === 'psychology-of-spending' ? psychologyOfSpendingContent : null;

  const [activeModule, setActiveModule] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>('video');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [progress, setProgress] = useState<ModuleProgress[]>([]);
  const [showCert, setShowCert] = useState(false);

  useEffect(() => {
    if (course && content) {
      setProgress(loadProgress(course.slug, content.modules.length));
    }
  }, [course?.slug]);

  if (!course || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🚧</div>
          <h2 className="font-[800] text-2xl mb-2">Course content coming soon.</h2>
          <Link href="/courses" className="btn btn-dark mt-4">Browse Courses</Link>
        </div>
      </div>
    );
  }

  const updateProgress = (idx: number, patch: Partial<ModuleProgress>) => {
    setProgress(prev => {
      const next = prev.map((p, i) => i === idx ? { ...p, ...patch } : p);
      saveProgress(course.slug, next);
      return next;
    });
  };

  const completedCount = calcCompletedModules(progress);
  const overallScore = calcOverallScore(progress, content);
  const totalPct = Math.round((completedCount / content.modules.length) * 100);
  const mod = content.modules[activeModule];
  const modProg = progress[activeModule] ?? { videoWatched: false, readingRead: false, quizAnswers: {}, quizSubmitted: false, quizScore: 0, completed: false };

  const handleMarkComplete = () => {
    const p = progress[activeModule];
    if (p?.videoWatched && p?.readingRead && p?.quizSubmitted) {
      updateProgress(activeModule, { completed: true });
    }
  };

  const allDone = progress.every(p => p.completed);
  const canCert = allDone && overallScore >= content.passingScore;

  const tabs: { id: Tab; label: string; icon: string; done: boolean }[] = [
    { id: 'video', label: 'Video', icon: '🎬', done: modProg.videoWatched },
    { id: 'reading', label: 'Reading', icon: '📖', done: modProg.readingRead },
    { id: 'files', label: 'Files', icon: '📁', done: false },
    { id: 'quiz', label: 'Quiz', icon: '🧩', done: modProg.quizSubmitted },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--paper)' }}>
      {/* ─── TOP BAR ─── */}
      <header className="sticky top-0 z-50 border-b-[2px] border-[var(--line)] bg-white/95 backdrop-blur-md">
        <div className="flex items-center gap-4 px-4 h-[60px]">
          <Link href={`/courses/${course.slug}`} className="flex items-center gap-2 text-[13px] font-[700] text-[var(--ink-soft)] hover:text-[var(--ink)] shrink-0">
            ← Back
          </Link>
          <div className="w-px h-5 bg-[var(--line)]" />
          <div className="font-[800] text-[14px] truncate flex-1">{course.title}</div>

          {/* Progress bar */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <div className="w-[180px] h-2 rounded-full bg-[var(--paper-alt)] overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${totalPct}%`, background: 'var(--grad-brand)' }} />
            </div>
            <span className="text-[13px] font-[700] text-[var(--ink-soft)]">{totalPct}% complete</span>
          </div>

          {allDone && (
            <button onClick={() => setShowCert(true)}
              className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-[800] text-white"
              style={{ background: canCert ? 'var(--grad-brand)' : 'var(--ink-faint)' }}>
              {canCert ? '🏆 Get Certificate' : '📋 View Score'}
            </button>
          )}
        </div>

        {/* Module progress strip */}
        <div className="flex h-1">
          {content.modules.map((_, i) => (
            <div key={i} className="flex-1" style={{
              background: progress[i]?.completed ? 'var(--violet)' : i < completedCount ? 'var(--blue)' : 'var(--line)'
            }} />
          ))}
        </div>
      </header>

      {/* ─── BODY ─── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="shrink-0 border-r-[2px] border-[var(--line)] bg-white overflow-y-auto overflow-x-hidden"
              style={{ height: 'calc(100vh - 62px)', position: 'sticky', top: 62 }}
            >
              <div style={{ width: 300 }}>
                <div className="px-5 py-4 border-b border-[var(--line)]">
                  <div className="text-[11px] font-[800] uppercase tracking-widest text-[var(--ink-faint)] mb-2">Course Contents</div>
                  <div className="text-[13px] font-[600] text-[var(--ink-soft)]">{completedCount}/{content.modules.length} modules · {totalPct}% done</div>
                </div>
                <div className="py-3">
                  {content.modules.map((m, i) => {
                    const p = progress[i];
                    const active = i === activeModule;
                    const done = p?.completed;
                    return (
                      <button key={i} onClick={() => { setActiveModule(i); setActiveTab('video'); }}
                        className={`w-full text-left px-5 py-4 transition-all flex items-start gap-3 border-l-[3px] ${active ? 'border-l-[var(--violet)] bg-[var(--pill-bg)]' : 'border-l-transparent hover:bg-[var(--paper-alt)]'}`}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-[800] shrink-0 mt-0.5 border-[2px] ${done ? 'bg-[var(--violet)] border-[var(--violet)] text-white' : active ? 'border-[var(--violet)] text-[var(--violet)]' : 'border-[var(--line)] text-[var(--ink-faint)]'}`}>
                          {done ? '✓' : i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-[13px] font-[700] leading-tight mb-1 ${active ? 'text-[var(--ink)]' : 'text-[var(--ink-soft)]'}`}>{m.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</div>
                          <div className="flex gap-2 flex-wrap">
                            {['video', 'reading', 'quiz'].map(k => {
                              const isDone = k === 'video' ? p?.videoWatched : k === 'reading' ? p?.readingRead : p?.quizSubmitted;
                              return <span key={k} className={`text-[10px] font-[700] ${isDone ? 'text-[var(--violet)]' : 'text-[var(--ink-faint)]'}`}>{isDone ? '✓' : '○'} {k}</span>;
                            })}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[860px] mx-auto px-6 py-8">
            {/* Module header */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                <div className="text-[12px] font-[800] uppercase tracking-wider text-[var(--ink-faint)] mb-1">
                  Module {activeModule + 1} of {content.modules.length}
                </div>
                <h1 className="font-[800] text-[clamp(22px,3vw,30px)] tracking-[-0.02em] leading-tight">
                  {mod.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </h1>
              </div>
              <button onClick={() => setSidebarOpen(p => !p)}
                className="shrink-0 w-9 h-9 rounded-[10px] border-[2px] border-[var(--line)] flex items-center justify-center text-[var(--ink-soft)] hover:border-[var(--violet)] transition-colors">
                ☰
              </button>
            </div>

            {/* Key takeaways pill */}
            <div className="flex flex-wrap gap-2 mb-6">
              {mod.keyTakeaways.map((t, i) => (
                <span key={i} className="text-[12px] font-[600] text-[var(--ink-soft)] bg-[var(--paper-alt)] px-3 py-1.5 rounded-full border border-[var(--line)]">
                  {t.length > 60 ? t.slice(0, 57) + '…' : t}
                </span>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-[var(--paper-alt)] rounded-[14px] border-[2px] border-[var(--line)] mb-7">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-2 rounded-[10px] text-[13px] font-[700] transition-all ${activeTab === tab.id ? 'bg-white shadow-sm border border-[var(--line)] text-[var(--ink)]' : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'}`}>
                  <span>{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                  {tab.done && <span className="text-[var(--violet)] text-[10px]">✓</span>}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              <motion.div key={`${activeModule}-${activeTab}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                {activeTab === 'video' && (
                  <VideoPlayer video={mod.video} onWatched={() => updateProgress(activeModule, { videoWatched: true })} />
                )}
                {activeTab === 'reading' && (
                  <ReadingPanel reading={mod.reading} onRead={() => updateProgress(activeModule, { readingRead: true })} />
                )}
                {activeTab === 'files' && <FilesPanel files={mod.files} />}
                {activeTab === 'quiz' && (
                  <QuizPanel
                    questions={mod.quiz}
                    submitted={modProg.quizSubmitted}
                    answers={modProg.quizAnswers}
                    score={modProg.quizScore}
                    onAnswer={(qid, idx) => updateProgress(activeModule, { quizAnswers: { ...modProg.quizAnswers, [qid]: idx } })}
                    onSubmit={() => {
                      const score = mod.quiz.filter(q => modProg.quizAnswers[q.id] === q.correct).length;
                      const passed = score >= Math.ceil(mod.quiz.length * 0.67);
                      updateProgress(activeModule, {
                        quizSubmitted: true,
                        quizScore: score,
                        completed: modProg.videoWatched && modProg.readingRead && passed,
                      });
                    }}
                    onRetry={() => updateProgress(activeModule, { quizAnswers: {}, quizSubmitted: false, quizScore: 0 })}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Module completion / Next */}
            <div className="mt-10 pt-8 border-t-[2px] border-[var(--line)] flex items-center justify-between gap-4">
              <div>
                {modProg.completed ? (
                  <div className="flex items-center gap-2 text-[14px] font-[700] text-green-700">
                    <span className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-[12px]">✓</span>
                    Module complete
                  </div>
                ) : (
                  <div className="text-[13px] text-[var(--ink-soft)]">
                    Complete video, reading, and quiz to finish this module
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                {activeModule > 0 && (
                  <button onClick={() => { setActiveModule(m => m - 1); setActiveTab('video'); }}
                    className="px-5 py-2.5 rounded-[12px] border-[2px] border-[var(--ink)] font-[700] text-[14px] bg-white hover:bg-[var(--paper-alt)] transition-colors">
                    ← Prev
                  </button>
                )}
                {activeModule < content.modules.length - 1 ? (
                  <button onClick={() => { setActiveModule(m => m + 1); setActiveTab('video'); }}
                    className="px-6 py-2.5 rounded-[12px] text-white font-[800] text-[14px] transition-all"
                    style={{ background: 'var(--grad-brand)' }}>
                    Next Module →
                  </button>
                ) : (
                  <button onClick={() => setShowCert(true)}
                    className="px-6 py-2.5 rounded-[12px] text-white font-[800] text-[14px] transition-all"
                    style={{ background: 'var(--grad-brand)' }}>
                    {canCert ? '🏆 Get Certificate' : 'View My Score'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── CERTIFICATE MODAL ─── */}
      <AnimatePresence>
        {showCert && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={e => { if (e.target === e.currentTarget) setShowCert(false); }}>
            <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
              className="bg-white rounded-[28px] border-[3px] border-[var(--ink)] shadow-[16px_16px_0px_var(--ink)] max-w-[560px] w-full overflow-hidden">
              {canCert ? (
                <>
                  <div className="p-10 text-center" style={{ background: 'linear-gradient(135deg,#e8edff,#f5effe,#fce4f2)' }}>
                    <div className="text-[64px] mb-3">🏆</div>
                    <div className="font-[800] text-[12px] uppercase tracking-[0.15em] text-[var(--violet)] mb-2">Certificate of Completion</div>
                    <h2 className="font-[800] text-[28px] tracking-[-0.02em] mb-1">{course.title}</h2>
                    <div className="text-[14px] text-[var(--ink-soft)]">Global Capital League · GCL Education</div>
                  </div>
                  <div className="p-8">
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      {[
                        { label: 'Score', value: `${overallScore}/10` },
                        { label: 'Modules', value: `${completedCount}/${content.modules.length}` },
                        { label: 'Status', value: 'Passed ✓' },
                      ].map(s => (
                        <div key={s.label} className="text-center p-4 rounded-[14px] bg-[var(--paper-alt)]">
                          <div className="font-[800] text-[24px] text-[var(--violet)]">{s.value}</div>
                          <div className="text-[12px] text-[var(--ink-faint)] font-[600] mt-1">{s.label}</div>
                        </div>
                      ))}
                    </div>
                    <button className="w-full py-4 rounded-[14px] text-white font-[800] text-[16px] mb-3"
                      style={{ background: 'var(--grad-brand)', boxShadow: '0 6px 20px rgba(139,92,246,0.35)' }}>
                      Download Certificate (PDF)
                    </button>
                    <button onClick={() => setShowCert(false)}
                      className="w-full py-3 rounded-[14px] border-[2px] border-[var(--line)] font-[700] text-[14px] text-[var(--ink-soft)] hover:bg-[var(--paper-alt)] transition-colors">
                      Close
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-10 text-center">
                  <div className="text-[56px] mb-4">📊</div>
                  <h2 className="font-[800] text-[26px] tracking-[-0.02em] mb-2">Your Score</h2>
                  <div className="text-[48px] font-[800] text-[var(--violet)] mb-1">{overallScore}<span className="text-[24px] text-[var(--ink-soft)]">/10</span></div>
                  <div className="text-[14px] text-[var(--ink-soft)] mb-6">
                    {allDone
                      ? `You need 8.0 to earn the certificate. You scored ${overallScore}. Review modules and retry the quizzes.`
                      : `Complete all ${content.modules.length} modules to see your final score.`}
                  </div>
                  <div className="mb-2 text-[12px] font-[700] text-[var(--ink-faint)]">Modules completed</div>
                  <div className="flex gap-1.5 justify-center mb-8">
                    {content.modules.map((_, i) => (
                      <div key={i} className="w-8 h-3 rounded-sm" style={{ background: progress[i]?.completed ? 'var(--violet)' : 'var(--paper-alt)', border: '1.5px solid var(--line)' }} />
                    ))}
                  </div>
                  <button onClick={() => setShowCert(false)}
                    className="w-full py-3 rounded-[14px] border-[2px] border-[var(--ink)] font-[800] text-[14px] hover:bg-[var(--paper-alt)] transition-colors">
                    Keep Learning →
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
