import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin, RegisteredUser } from '../context/AdminContext';
import { useAppAuth } from '../context/AuthContext';
import { Event } from '../data/events';
import { Course } from '../data/courses';
import { NewsPost } from '../data/news';

type Section = 'overview' | 'events' | 'courses' | 'news' | 'users' | 'roles';

const NAV_ITEMS: { id: Section; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'events', label: 'Events', icon: '🗓️' },
  { id: 'courses', label: 'Courses', icon: '📚' },
  { id: 'news', label: 'News Posts', icon: '📰' },
  { id: 'users', label: 'Members', icon: '👥' },
  { id: 'roles', label: 'Team & Roles', icon: '🛡️' },
];

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-[24px] border-[2.5px] border-[var(--ink)] shadow-[10px_10px_0px_var(--ink)] w-full max-w-[560px] max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-7 py-5 border-b border-[var(--line)]">
          <h3 className="font-[800] text-[18px] tracking-[-0.01em]">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[var(--paper-alt)] flex items-center justify-center text-[var(--ink-soft)] hover:bg-[var(--line)] transition-colors text-[18px]">×</button>
        </div>
        <div className="p-7">{children}</div>
      </motion.div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-[13px] font-[700] text-[var(--ink)] mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-4 py-3 rounded-[10px] border-[2px] border-[var(--line)] text-[14px] font-[500] outline-none transition-all focus:border-[var(--violet)] bg-[var(--paper-alt)]";
const selectCls = `${inputCls} cursor-pointer`;

// ─── Overview Section ──────────────────────────────────────────
function OverviewSection() {
  const { events, courses, news, users } = useAdmin();
  const stats = [
    { label: 'Total Members', value: users.length, icon: '👥', color: 'var(--blue)' },
    { label: 'Courses Published', value: courses.length, icon: '📚', color: 'var(--violet)' },
    { label: 'Events Scheduled', value: events.length, icon: '🗓️', color: 'var(--magenta)' },
    { label: 'News Posts', value: news.filter(n => n.published).length, icon: '📰', color: '#28c840' },
  ];
  const completions = users.reduce((sum, u) => sum + u.completedCourses.length, 0);
  const registrations = users.reduce((sum, u) => sum + u.registeredEvents.length, 0);

  return (
    <div>
      <h2 className="font-[800] text-[26px] tracking-[-0.02em] mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-white rounded-[18px] border-[2px] border-[var(--line)] shadow-[4px_4px_0px_var(--ink)] p-5">
            <div className="text-2xl mb-3">{s.icon}</div>
            <div className="font-[800] text-[32px] tracking-[-0.02em]" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[13px] text-[var(--ink-soft)] font-[600] mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-[18px] border-[2px] border-[var(--line)] shadow-[4px_4px_0px_var(--ink)] p-6">
          <h3 className="font-[800] text-[16px] mb-4">Engagement</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[var(--ink-soft)]">Course completions</span>
              <span className="font-[800] text-[18px]">{completions}</span>
            </div>
            <div className="w-full bg-[var(--paper-alt)] rounded-full h-2">
              <div className="h-2 rounded-full" style={{ width: `${Math.min((completions / (users.length * courses.length)) * 100, 100)}%`, background: 'var(--grad-brand)' }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[var(--ink-soft)]">Event registrations</span>
              <span className="font-[800] text-[18px]">{registrations}</span>
            </div>
            <div className="w-full bg-[var(--paper-alt)] rounded-full h-2">
              <div className="h-2 rounded-full" style={{ width: `${Math.min((registrations / (users.length * events.length)) * 100, 100)}%`, background: 'linear-gradient(90deg, var(--magenta), var(--violet))' }} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[18px] border-[2px] border-[var(--line)] shadow-[4px_4px_0px_var(--ink)] p-6">
          <h3 className="font-[800] text-[16px] mb-4">Recent Members</h3>
          <div className="space-y-3">
            {users.slice(0, 5).map(u => (
              <div key={u.id} className="flex items-center justify-between">
                <div>
                  <div className="font-[700] text-[14px]">{u.name}</div>
                  <div className="text-[12px] text-[var(--ink-faint)]">{u.joinedDate}</div>
                </div>
                <div className="text-[12px] font-[600] text-[var(--violet)]">{u.completedCourses.length} courses</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Events Section ────────────────────────────────────────────
function EventsSection() {
  const { events, addEvent, updateEvent, deleteEvent } = useAdmin();
  const [modal, setModal] = useState<null | 'add' | Event>(null);
  const [form, setForm] = useState<Partial<Event>>({});

  const openAdd = () => { setForm({ id: `e${Date.now()}`, date: { day: '', month: '', year: '', full: '' }, title: '', speaker: '', format: 'Online', type: 'Free' }); setModal('add'); };
  const openEdit = (e: Event) => { setForm({ ...e }); setModal(e); };
  const close = () => setModal(null);

  const save = () => {
    if (!form.title || !form.speaker) return;
    const ev = form as Event;
    if (modal === 'add') addEvent(ev); else updateEvent(ev);
    close();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-[800] text-[26px] tracking-[-0.02em]">Events</h2>
        <button onClick={openAdd} className="px-5 py-2.5 rounded-full text-white font-[700] text-[14px] transition-all hover:-translate-y-[1px]" style={{ background: 'var(--grad-brand)', boxShadow: '0 4px 14px rgba(139,92,246,0.25)' }}>+ New Event</button>
      </div>

      <div className="space-y-3">
        {events.map((ev, i) => (
          <motion.div key={ev.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="bg-white rounded-[14px] border-[2px] border-[var(--line)] shadow-[3px_3px_0px_var(--ink)] p-4 flex items-center gap-4">
            <div className="shrink-0 w-[54px] h-[54px] rounded-[12px] bg-[var(--pill-bg)] flex flex-col items-center justify-center">
              <div className="font-[800] text-[18px] text-[var(--pill-ink)] leading-none">{ev.date.day}</div>
              <div className="text-[9px] font-[700] tracking-wider uppercase text-[var(--pill-ink)] opacity-70">{ev.date.month}</div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-[700] text-[15px] truncate">{ev.title}</div>
              <div className="text-[12.5px] text-[var(--ink-soft)]">{ev.speaker} · {ev.format} · {ev.type}</div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEdit(ev)} className="px-3 py-1.5 rounded-[8px] text-[12.5px] font-[700] bg-[var(--paper-alt)] hover:bg-[var(--line)] transition-colors">Edit</button>
              <button onClick={() => deleteEvent(ev.id)} className="px-3 py-1.5 rounded-[8px] text-[12.5px] font-[700] bg-red-50 text-red-500 hover:bg-red-100 transition-colors">Delete</button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {modal && (
          <Modal title={modal === 'add' ? 'New Event' : 'Edit Event'} onClose={close}>
            <Field label="Event Title">
              <input className={inputCls} value={form.title ?? ''} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Youth Money Summit" />
            </Field>
            <Field label="Speaker / Host">
              <input className={inputCls} value={form.speaker ?? ''} onChange={e => setForm(p => ({ ...p, speaker: e.target.value }))} placeholder="e.g. Dr. Elena Rostova" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Day">
                <input className={inputCls} value={form.date?.day ?? ''} onChange={e => setForm(p => ({ ...p, date: { ...p.date!, day: e.target.value } }))} placeholder="14" />
              </Field>
              <Field label="Month (3-letter)">
                <input className={inputCls} value={form.date?.month ?? ''} onChange={e => setForm(p => ({ ...p, date: { ...p.date!, month: e.target.value.toUpperCase() } }))} placeholder="AUG" maxLength={3} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Format">
                <select className={selectCls} value={form.format ?? 'Online'} onChange={e => setForm(p => ({ ...p, format: e.target.value as any }))}>
                  <option>Online</option>
                  <option>In-Person</option>
                </select>
              </Field>
              <Field label="Type">
                <select className={selectCls} value={form.type ?? 'Free'} onChange={e => setForm(p => ({ ...p, type: e.target.value as any }))}>
                  <option>Free</option>
                  <option>Ticketed</option>
                  <option>Invite-Only</option>
                </select>
              </Field>
            </div>
            <div className="flex gap-3 mt-2">
              <button onClick={close} className="flex-1 py-3 rounded-[10px] border-[2px] border-[var(--line)] font-[700] text-[14px] hover:bg-[var(--paper-alt)] transition-colors">Cancel</button>
              <button onClick={save} className="flex-1 py-3 rounded-[10px] text-white font-[700] text-[14px]" style={{ background: 'var(--grad-brand)' }}>Save Event</button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Courses Section ───────────────────────────────────────────
function CoursesSection() {
  const { courses, addCourse, updateCourse, deleteCourse } = useAdmin();
  const [modal, setModal] = useState<null | 'add' | Course>(null);
  const [form, setForm] = useState<Partial<Course & { moduleText: string }>>({});

  const openAdd = () => {
    setForm({ slug: '', title: '', tag: '', level: 'Beginner', duration: '', color: 't1', modules: [], instructors: [], moduleText: '' });
    setModal('add');
  };
  const openEdit = (c: Course) => {
    setForm({ ...c, moduleText: c.modules.map(m => `${m.title}: ${m.description}`).join('\n') });
    setModal(c);
  };
  const close = () => setModal(null);

  const save = () => {
    if (!form.title || !form.slug) return;
    const modules = (form.moduleText ?? '').split('\n').filter(Boolean).map((line, i) => {
      const [t, ...rest] = line.split(':');
      return { title: t?.trim() || `Module ${i + 1}`, description: rest.join(':').trim() };
    });
    const course: Course = {
      slug: form.slug!.toLowerCase().replace(/\s+/g, '-'),
      title: form.title!,
      tag: form.tag ?? '',
      level: form.level ?? 'Beginner',
      duration: form.duration ?? '',
      color: (form.color ?? 't1') as 't1' | 't2' | 't3',
      modules: modules.length ? modules : [{ title: 'Module 1', description: 'Coming soon.' }],
      instructors: form.instructors ?? [],
    };
    if (modal === 'add') addCourse(course); else updateCourse(course);
    close();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-[800] text-[26px] tracking-[-0.02em]">Courses</h2>
        <button onClick={openAdd} className="px-5 py-2.5 rounded-full text-white font-[700] text-[14px] transition-all hover:-translate-y-[1px]" style={{ background: 'var(--grad-brand)', boxShadow: '0 4px 14px rgba(139,92,246,0.25)' }}>+ New Course</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((c, i) => (
          <motion.div key={c.slug} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="bg-white rounded-[14px] border-[2px] border-[var(--line)] shadow-[3px_3px_0px_var(--ink)] p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="font-[800] text-[15px] leading-tight">{c.title}</div>
                <div className="text-[12.5px] text-[var(--ink-soft)] mt-1">{c.level} · {c.duration} · {c.tag}</div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(c)} className="px-3 py-1.5 rounded-[8px] text-[12px] font-[700] bg-[var(--paper-alt)] hover:bg-[var(--line)] transition-colors">Edit</button>
                <button onClick={() => deleteCourse(c.slug)} className="px-3 py-1.5 rounded-[8px] text-[12px] font-[700] bg-red-50 text-red-500 hover:bg-red-100 transition-colors">Delete</button>
              </div>
            </div>
            <div className="text-[12px] text-[var(--ink-faint)]">{c.modules.length} modules · {c.instructors.map(i => i.name).join(', ')}</div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {modal && (
          <Modal title={modal === 'add' ? 'New Course' : 'Edit Course'} onClose={close}>
            <Field label="Course Title">
              <input className={inputCls} value={form.title ?? ''} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Psychology of Money" />
            </Field>
            <Field label="Slug (URL)">
              <input className={inputCls} value={form.slug ?? ''} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} placeholder="e.g. psychology-of-money" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Tag">
                <input className={inputCls} value={form.tag ?? ''} onChange={e => setForm(p => ({ ...p, tag: e.target.value }))} placeholder="Foundations" />
              </Field>
              <Field label="Level">
                <select className={selectCls} value={form.level ?? 'Beginner'} onChange={e => setForm(p => ({ ...p, level: e.target.value }))}>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                  <option>All Levels</option>
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Duration (e.g. 6 Modules)">
                <input className={inputCls} value={form.duration ?? ''} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} placeholder="6 Modules" />
              </Field>
              <Field label="Color Theme">
                <select className={selectCls} value={form.color ?? 't1'} onChange={e => setForm(p => ({ ...p, color: e.target.value as any }))}>
                  <option value="t1">Blue/Violet</option>
                  <option value="t2">Magenta/Pink</option>
                  <option value="t3">Cyan/Blue</option>
                </select>
              </Field>
            </div>
            <Field label="Modules (one per line: Title: Description)">
              <textarea
                className={`${inputCls} resize-y`}
                rows={5}
                value={form.moduleText ?? ''}
                onChange={e => setForm(p => ({ ...p, moduleText: e.target.value }))}
                placeholder={"Module 1: Intro to behavioral finance\nModule 2: Common cognitive biases"}
              />
            </Field>
            <div className="flex gap-3 mt-2">
              <button onClick={close} className="flex-1 py-3 rounded-[10px] border-[2px] border-[var(--line)] font-[700] text-[14px] hover:bg-[var(--paper-alt)] transition-colors">Cancel</button>
              <button onClick={save} className="flex-1 py-3 rounded-[10px] text-white font-[700] text-[14px]" style={{ background: 'var(--grad-brand)' }}>Save Course</button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── News Section ──────────────────────────────────────────────
function NewsSection() {
  const { news, addNews, updateNews, deleteNews } = useAdmin();
  const [modal, setModal] = useState<null | 'add' | NewsPost>(null);
  const [form, setForm] = useState<Partial<NewsPost>>({});

  const openAdd = () => { setForm({ id: `n${Date.now()}`, title: '', excerpt: '', content: '', author: '', date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), category: 'Announcement', published: true }); setModal('add'); };
  const openEdit = (p: NewsPost) => { setForm({ ...p }); setModal(p); };
  const close = () => setModal(null);

  const save = () => {
    if (!form.title || !form.content) return;
    const post = form as NewsPost;
    if (modal === 'add') addNews(post); else updateNews(post);
    close();
  };

  const catColor: Record<string, string> = { Research: '#3358ff', Update: '#8b5cf6', Story: '#e93fc7', Announcement: '#28c840' };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-[800] text-[26px] tracking-[-0.02em]">News Posts</h2>
        <button onClick={openAdd} className="px-5 py-2.5 rounded-full text-white font-[700] text-[14px] transition-all hover:-translate-y-[1px]" style={{ background: 'var(--grad-brand)', boxShadow: '0 4px 14px rgba(139,92,246,0.25)' }}>+ New Post</button>
      </div>

      <div className="space-y-3">
        {news.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="bg-white rounded-[14px] border-[2px] border-[var(--line)] shadow-[3px_3px_0px_var(--ink)] p-4 flex items-start gap-4">
            <div className="w-[5px] self-stretch rounded-full shrink-0" style={{ background: catColor[p.category] ?? '#888' }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[11px] font-[800] uppercase tracking-wide" style={{ color: catColor[p.category] }}>{p.category}</span>
                <span className="text-[12px] text-[var(--ink-faint)]">· {p.date}</span>
                <span className={`text-[11px] font-[700] px-2 py-0.5 rounded-full ${p.published ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>{p.published ? 'Published' : 'Draft'}</span>
              </div>
              <div className="font-[700] text-[15px] truncate">{p.title}</div>
              <div className="text-[12.5px] text-[var(--ink-soft)] truncate">{p.excerpt}</div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEdit(p)} className="px-3 py-1.5 rounded-[8px] text-[12px] font-[700] bg-[var(--paper-alt)] hover:bg-[var(--line)] transition-colors">Edit</button>
              <button onClick={() => deleteNews(p.id)} className="px-3 py-1.5 rounded-[8px] text-[12px] font-[700] bg-red-50 text-red-500 hover:bg-red-100 transition-colors">Delete</button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {modal && (
          <Modal title={modal === 'add' ? 'New Post' : 'Edit Post'} onClose={close}>
            <Field label="Title">
              <input className={inputCls} value={form.title ?? ''} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Article headline" />
            </Field>
            <Field label="Excerpt (short summary)">
              <textarea className={`${inputCls} resize-y`} rows={2} value={form.excerpt ?? ''} onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))} placeholder="A brief summary shown in the news feed." />
            </Field>
            <Field label="Full Content">
              <textarea className={`${inputCls} resize-y`} rows={5} value={form.content ?? ''} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} placeholder="Write the full article content here." />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Author">
                <input className={inputCls} value={form.author ?? ''} onChange={e => setForm(p => ({ ...p, author: e.target.value }))} placeholder="Dr. Elena Rostova" />
              </Field>
              <Field label="Category">
                <select className={selectCls} value={form.category ?? 'Announcement'} onChange={e => setForm(p => ({ ...p, category: e.target.value as any }))}>
                  <option>Research</option>
                  <option>Update</option>
                  <option>Story</option>
                  <option>Announcement</option>
                </select>
              </Field>
            </div>
            <Field label="Date">
              <input className={inputCls} value={form.date ?? ''} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} placeholder="June 28, 2026" />
            </Field>
            <Field label="Status">
              <select className={selectCls} value={form.published ? 'published' : 'draft'} onChange={e => setForm(p => ({ ...p, published: e.target.value === 'published' }))}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </Field>
            <div className="flex gap-3 mt-2">
              <button onClick={close} className="flex-1 py-3 rounded-[10px] border-[2px] border-[var(--line)] font-[700] text-[14px] hover:bg-[var(--paper-alt)] transition-colors">Cancel</button>
              <button onClick={save} className="flex-1 py-3 rounded-[10px] text-white font-[700] text-[14px]" style={{ background: 'var(--grad-brand)' }}>Publish</button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Users Section ─────────────────────────────────────────────
function UsersSection() {
  const { users, courses, events } = useAdmin();
  const [selected, setSelected] = useState<RegisteredUser | null>(null);

  const getCourse = (slug: string) => courses.find(c => c.slug === slug);
  const getEvent = (id: string) => events.find(e => e.id === id);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-[800] text-[26px] tracking-[-0.02em]">Members ({users.length})</h2>
        <div className="text-[13px] text-[var(--ink-soft)] font-[600]">Click a member to view details</div>
      </div>

      <div className="bg-white rounded-[18px] border-[2px] border-[var(--line)] shadow-[4px_4px_0px_var(--ink)] overflow-hidden mb-6">
        <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-0 px-5 py-3 bg-[var(--paper-alt)] border-b border-[var(--line)] text-[12px] font-[800] uppercase tracking-wider text-[var(--ink-faint)]">
          <div>Name</div>
          <div>Email</div>
          <div>Joined</div>
          <div>Courses</div>
          <div>Events</div>
        </div>
        {users.map((u, i) => (
          <motion.div
            key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
            className={`grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-0 px-5 py-3.5 border-b border-[var(--line)] last:border-0 cursor-pointer hover:bg-[var(--paper-alt)] transition-colors ${selected?.id === u.id ? 'bg-[var(--pill-bg)]' : ''}`}
            onClick={() => setSelected(selected?.id === u.id ? null : u)}
          >
            <div className="font-[700] text-[14px]">{u.name}</div>
            <div className="text-[13px] text-[var(--ink-soft)] truncate">{u.email}</div>
            <div className="text-[13px] text-[var(--ink-soft)]">{u.joinedDate}</div>
            <div className="text-[13px] font-[700] text-[var(--violet)]">{u.completedCourses.length}</div>
            <div className="text-[13px] font-[700] text-[var(--magenta)]">{u.registeredEvents.length}</div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
            className="bg-white rounded-[18px] border-[2px] border-[var(--ink)] shadow-[6px_6px_0px_var(--ink)] p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-[800] text-[20px]">{selected.name}</h3>
                <div className="text-[13px] text-[var(--ink-soft)]">{selected.email} · Joined {selected.joinedDate}</div>
              </div>
              <button onClick={() => setSelected(null)} className="text-[var(--ink-soft)] hover:text-[var(--ink)] font-[700]">Close ×</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="font-[800] text-[13px] uppercase tracking-wider text-[var(--ink-faint)] mb-3">Completed Courses ({selected.completedCourses.length})</div>
                {selected.completedCourses.length === 0
                  ? <div className="text-[13px] text-[var(--ink-faint)]">No completed courses yet.</div>
                  : selected.completedCourses.map(slug => {
                    const c = getCourse(slug);
                    return c ? (
                      <div key={slug} className="flex items-center gap-3 mb-2 p-3 rounded-[10px] bg-[var(--paper-alt)]">
                        <span className="text-lg">📚</span>
                        <div>
                          <div className="font-[700] text-[13.5px]">{c.title}</div>
                          <div className="text-[11.5px] text-[var(--ink-faint)]">{c.level} · {c.duration}</div>
                        </div>
                        <span className="ml-auto text-[11px] font-[800] text-green-600 bg-green-50 px-2 py-0.5 rounded-full">✓ Done</span>
                      </div>
                    ) : null;
                  })}
              </div>
              <div>
                <div className="font-[800] text-[13px] uppercase tracking-wider text-[var(--ink-faint)] mb-3">Registered Events ({selected.registeredEvents.length})</div>
                {selected.registeredEvents.length === 0
                  ? <div className="text-[13px] text-[var(--ink-faint)]">No event registrations yet.</div>
                  : selected.registeredEvents.map(id => {
                    const ev = getEvent(id);
                    return ev ? (
                      <div key={id} className="flex items-center gap-3 mb-2 p-3 rounded-[10px] bg-[var(--paper-alt)]">
                        <div className="w-9 h-9 rounded-[8px] bg-[var(--pill-bg)] flex flex-col items-center justify-center shrink-0">
                          <div className="font-[800] text-[12px] text-[var(--pill-ink)] leading-none">{ev.date.day}</div>
                          <div className="text-[8px] font-[700] text-[var(--pill-ink)] opacity-70">{ev.date.month}</div>
                        </div>
                        <div>
                          <div className="font-[700] text-[13.5px]">{ev.title}</div>
                          <div className="text-[11.5px] text-[var(--ink-faint)]">{ev.format} · {ev.type}</div>
                        </div>
                      </div>
                    ) : null;
                  })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Roles Section ─────────────────────────────────────────────
const ROLE_META: Record<string, { label: string; color: string; bg: string }> = {
  member:   { label: 'Member',   color: 'var(--ink-soft)', bg: 'var(--paper-alt)' },
  gcl_team: { label: 'GCL Team', color: '#0891b2',         bg: '#ecfeff'          },
  admin:    { label: 'Admin',    color: '#7c3aed',         bg: '#f5f3ff'          },
};

type LocalRole = 'member' | 'gcl_team' | 'admin';

function RolesSection() {
  const { users } = useAdmin();
  const [roles, setRoles] = useState<Record<string, LocalRole>>({});

  const getRole = (id: string): LocalRole => roles[id] ?? 'member';
  const setRole = (id: string, role: LocalRole) => setRoles(prev => ({ ...prev, [id]: role }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-[800] text-[26px] tracking-[-0.02em]">Team & Roles</h2>
          <p className="text-[13px] text-[var(--ink-soft)] mt-1">Promote members to GCL Team or Admin, or revoke access.</p>
        </div>
      </div>

      <div className="bg-white rounded-[18px] border-[2px] border-[var(--line)] shadow-[4px_4px_0px_var(--ink)] overflow-hidden">
        <div className="grid grid-cols-[2fr_2fr_1fr_1.3fr] gap-0 px-5 py-3 bg-[var(--paper-alt)] border-b border-[var(--line)] text-[12px] font-[800] uppercase tracking-wider text-[var(--ink-faint)]">
          <div>Name</div>
          <div>Email</div>
          <div>Role</div>
          <div>Change Role</div>
        </div>
        {users.map((u, i) => {
          const currentRole = getRole(u.id);
          const meta = ROLE_META[currentRole] ?? ROLE_META.member;
          return (
            <motion.div
              key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
              className="grid grid-cols-[2fr_2fr_1fr_1.3fr] gap-0 px-5 py-3.5 border-b border-[var(--line)] last:border-0 items-center"
            >
              <div className="font-[700] text-[14px]">{u.name}</div>
              <div className="text-[13px] text-[var(--ink-soft)] truncate">{u.email}</div>
              <div>
                <span className="text-[11px] font-[800] px-2.5 py-1 rounded-full" style={{ color: meta.color, background: meta.bg }}>{meta.label}</span>
              </div>
              <select
                value={currentRole}
                onChange={e => setRole(u.id, e.target.value as LocalRole)}
                className="text-[13px] font-[600] px-3 py-2 rounded-[8px] border-[1.5px] border-[var(--line)] bg-[var(--paper-alt)]"
              >
                <option value="member">Member</option>
                <option value="gcl_team">GCL Team</option>
                <option value="admin">Admin</option>
              </select>
            </motion.div>
          );
        })}
        {users.length === 0 && (
          <div className="px-5 py-10 text-center text-[13px] text-[var(--ink-faint)]">No members found.</div>
        )}
      </div>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────
export function AdminDashboard() {
  const { isAuthenticated, isLoading, isAdmin, user, logout } = useAppAuth();
  const [, setLocation] = useLocation();
  const [section, setSection] = useState<Section>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return <main className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-[var(--line)] border-t-[var(--violet)] rounded-full animate-spin" /></main>;
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="font-[800] text-[24px] mb-2">Access Denied</h2>
          <p className="text-[var(--ink-soft)] mb-6">You need to be logged in as an admin to view this page.</p>
          <Link href="/signin" className="btn btn-dark">Go to Sign In</Link>
        </div>
      </main>
    );
  }

  const handleLogout = () => { logout(); setLocation('/'); };

  return (
    <div className="min-h-screen bg-[var(--paper-alt)] flex">
      {/* Sidebar */}
      <aside className="w-[240px] shrink-0 bg-[var(--brutal-bg)] flex flex-col sticky top-0 h-screen overflow-y-auto hidden md:flex">
        <div className="p-6 border-b border-[rgba(246,244,255,0.08)]">
          <Link href="/" className="flex items-center gap-2 mb-1">
            <div className="w-[22px] h-[22px] rounded-full" style={{ background: 'conic-gradient(from 200deg, var(--blue), var(--violet), var(--magenta), #33c7e8, var(--blue))' }} />
            <span className="font-[800] text-[15px]" style={{ background: 'var(--grad-brand)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>GCL Admin</span>
          </Link>
          <div className="text-[11px] text-[var(--brutal-text-dim)] font-[600]">Control Panel</div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className="w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-[10px] text-[14px] font-[600] transition-all"
              style={section === item.id
                ? { background: 'rgba(255,255,255,0.1)', color: 'var(--neon-cyan)' }
                : { color: 'var(--brutal-text-dim)' }}
            >
              <span className="text-[16px]">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[rgba(246,244,255,0.08)]">
          <Link href="/" className="block w-full text-left px-4 py-2.5 rounded-[10px] text-[13px] font-[600] text-[var(--brutal-text-dim)] hover:text-white transition-colors mb-1">← Back to site</Link>
          <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 rounded-[10px] text-[13px] font-[600] text-red-400 hover:bg-red-900/20 transition-colors">Sign Out</button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[var(--brutal-bg)] px-4 py-3 flex items-center justify-between border-b border-[rgba(246,244,255,0.1)]">
        <span className="font-[800] text-white text-[15px]">GCL Admin</span>
        <button onClick={() => setSidebarOpen(v => !v)} className="text-white text-xl">☰</button>
      </div>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-10 mt-[52px] md:mt-0 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div key={section} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            {section === 'overview' && <OverviewSection />}
            {section === 'events' && <EventsSection />}
            {section === 'courses' && <CoursesSection />}
            {section === 'news' && <NewsSection />}
            {section === 'users' && <UsersSection />}
            {section === 'roles' && <RolesSection />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="md:hidden fixed inset-0 z-50 bg-[var(--brutal-bg)] flex flex-col p-6 pt-16">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-white text-2xl">×</button>
            <nav className="space-y-2">
              {NAV_ITEMS.map(item => (
                <button key={item.id} onClick={() => { setSection(item.id); setSidebarOpen(false); }}
                  className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-[10px] text-[16px] font-[700]"
                  style={section === item.id ? { color: 'var(--neon-cyan)' } : { color: 'var(--brutal-text-dim)' }}>
                  <span>{item.icon}</span>{item.label}
                </button>
              ))}
            </nav>
            <div className="mt-auto">
              <button onClick={handleLogout} className="text-red-400 font-[700] text-[15px] mt-4">Sign Out</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
