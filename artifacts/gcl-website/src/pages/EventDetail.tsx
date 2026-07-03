import React, { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { motion } from 'framer-motion';
import { events } from '../data/events';

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [vis, setVis] = React.useState(false);
  React.useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.06 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 18 }} animate={vis ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay }} className={className}>
      {children}
    </motion.div>
  );
}

function RegistrationForm({ event }: { event: (typeof events)[number] }) {
  const [form, setForm] = useState({ name: '', email: '', country: '', org: '', background: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const spotsLeft = event.capacity - event.registered;
  const full = spotsLeft <= 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (full) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1200);
  };

  if (event.type === 'Invite-Only') {
    return (
      <div className="border-[2.5px] border-[var(--ink)] shadow-[8px_8px_0px_var(--ink)] p-8 bg-[var(--paper-alt)]">
        <div className="text-[11px] font-[800] uppercase tracking-[0.15em] text-[var(--ink-faint)] mb-3">Registration</div>
        <div className="text-[18px] font-[800] mb-3">Invite-Only Event</div>
        <p className="text-[14px] text-[var(--ink-soft)] leading-[1.65] mb-6">
          This event is reserved for GCL youth graduates who have been personally selected. If you believe you should be considered, contact us directly.
        </p>
        <a href="mailto:events@globalcapitalleague.org"
          className="block text-center py-4 font-[800] text-[14px] uppercase tracking-wider border-[2.5px] border-[var(--ink)] hover:bg-[var(--ink)] hover:text-white transition-colors">
          Contact Events Team →
        </a>
      </div>
    );
  }

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
        className="border-[2.5px] border-[var(--ink)] shadow-[8px_8px_0px_var(--ink)] p-10 text-center" style={{ background: 'var(--brutal-bg)' }}>
        <div className="text-[56px] mb-4">✓</div>
        <div className="font-[800] text-[24px] text-white mb-2 uppercase">You're Registered</div>
        <p className="text-[14px] text-[var(--brutal-text-dim)] mb-6">
          A confirmation has been sent to <strong className="text-white">{form.email}</strong>. You'll receive event details 48 hours before the event.
        </p>
        <div className="border border-white/15 p-5 text-left mb-6">
          <div className="text-[11px] font-[800] uppercase tracking-wider text-[var(--neon-cyan)] mb-3">Event Details</div>
          <div className="text-[13px] text-[var(--brutal-text-dim)] space-y-1">
            <div><span className="font-[700] text-white">{event.title}</span></div>
            <div>{event.date.full} · {event.time} {event.timezone}</div>
            <div>{event.location}</div>
          </div>
        </div>
        <button onClick={() => setSubmitted(false)}
          className="text-[13px] font-[600] text-[var(--brutal-text-dim)] hover:text-white transition-colors">
          Register another person →
        </button>
      </motion.div>
    );
  }

  return (
    <div className="border-[2.5px] border-[var(--ink)] shadow-[8px_8px_0px_var(--ink)]">
      <div className="border-b-[2.5px] border-[var(--ink)] px-7 py-5 flex items-center justify-between" style={{ background: 'var(--brutal-bg)' }}>
        <div>
          <div className="text-[11px] font-[800] uppercase tracking-[0.15em] text-[var(--neon-cyan)] mb-1">Register</div>
          <div className="font-[800] text-[20px] text-white">{event.type === 'Free' ? 'Free — Spots Limited' : 'Reserve Your Spot'}</div>
        </div>
        <div className="text-right">
          <div className="font-[800] text-[28px] text-white leading-none"
            style={{ color: spotsLeft <= 10 ? '#e53e3e' : spotsLeft <= 30 ? '#d69e2e' : '#28c840' }}>
            {spotsLeft}
          </div>
          <div className="text-[11px] font-[600] uppercase tracking-wider text-[var(--brutal-text-dim)]">Spots left</div>
        </div>
      </div>

      {/* Capacity bar */}
      <div className="h-2 bg-[var(--brutal-bg)]">
        <div className="h-full" style={{
          width: `${(event.registered / event.capacity) * 100}%`,
          background: spotsLeft <= 10 ? '#e53e3e' : spotsLeft <= 30 ? '#d69e2e' : '#28c840'
        }} />
      </div>

      <form onSubmit={handleSubmit} className="p-7 bg-white space-y-5">
        {[
          { id: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name', required: true },
          { id: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com', required: true },
          { id: 'country', label: 'Country', type: 'text', placeholder: 'Where are you joining from?', required: true },
          { id: 'org', label: 'Organisation / School', type: 'text', placeholder: 'Optional', required: false },
        ].map(field => (
          <div key={field.id}>
            <label className="block text-[11px] font-[800] uppercase tracking-[0.12em] text-[var(--ink-faint)] mb-2">
              {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type={field.type}
              placeholder={field.placeholder}
              required={field.required}
              value={(form as Record<string, string>)[field.id]}
              onChange={e => setForm(f => ({ ...f, [field.id]: e.target.value }))}
              className="w-full px-4 py-3 border-[2px] border-[var(--line)] text-[14px] font-[500] text-[var(--ink)] outline-none focus:border-[var(--ink)] transition-colors bg-[var(--paper-alt)] rounded-none placeholder-[var(--ink-faint)]"
            />
          </div>
        ))}

        <div>
          <label className="block text-[11px] font-[800] uppercase tracking-[0.12em] text-[var(--ink-faint)] mb-2">
            Background (optional)
          </label>
          <select
            value={form.background}
            onChange={e => setForm(f => ({ ...f, background: e.target.value }))}
            className="w-full px-4 py-3 border-[2px] border-[var(--line)] text-[14px] font-[500] text-[var(--ink)] outline-none focus:border-[var(--ink)] transition-colors bg-[var(--paper-alt)] rounded-none">
            <option value="">Select your background</option>
            {['Student', 'Young professional (18–30)', 'Educator / Trainer', 'Community organizer', 'NGO / Nonprofit', 'Government / Policy', 'Other'].map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-[800] uppercase tracking-[0.12em] text-[var(--ink-faint)] mb-2">
            What are you hoping to get from this event?
          </label>
          <textarea
            rows={3}
            placeholder="Optional — but helps us tailor the session"
            value={form.message}
            onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            className="w-full px-4 py-3 border-[2px] border-[var(--line)] text-[14px] font-[500] text-[var(--ink)] outline-none focus:border-[var(--ink)] transition-colors bg-[var(--paper-alt)] rounded-none resize-none placeholder-[var(--ink-faint)]"
          />
        </div>

        <button type="submit" disabled={full || loading}
          className="w-full py-4 font-[800] text-[15px] uppercase tracking-wider text-white transition-all border-[2.5px] border-[var(--ink)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          style={{ background: full ? 'var(--ink-faint)' : 'var(--ink)', boxShadow: full ? 'none' : '4px 4px 0px rgba(21,19,44,0.25)' }}>
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Registering…
            </>
          ) : full ? 'Event Full' : 'Register Now →'}
        </button>

        <p className="text-[11px] text-[var(--ink-faint)] text-center leading-[1.6]">
          Free to attend. No account required. A confirmation email will be sent immediately.
        </p>
      </form>
    </div>
  );
}

export function EventDetail() {
  const [, params] = useRoute('/events/:id');
  const event = events.find(e => e.id === params?.id);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-[100px]">
        <div className="text-center">
          <div className="text-[80px] font-[800] text-[var(--line)]">404</div>
          <h2 className="font-[800] text-2xl mb-4">Event not found.</h2>
          <Link href="/events" className="btn btn-dark">← All Events</Link>
        </div>
      </div>
    );
  }

  const spotsLeft = event.capacity - event.registered;
  const capacityPct = Math.round((event.registered / event.capacity) * 100);
  const relatedEvents = events.filter(e => e.id !== event.id).slice(0, 3);

  return (
    <main className="pb-32 pt-[90px]" style={{ background: 'var(--paper-alt)' }}>
      {/* ─── HERO BANNER ─── */}
      <section className="pt-0 pb-0 overflow-hidden" style={{ background: 'var(--brutal-bg)' }}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(90deg,white 0px,white 1px,transparent 1px,transparent 80px),repeating-linear-gradient(0deg,white 0px,white 1px,transparent 1px,transparent 80px)' }} />
        <div className="max-w-[1240px] mx-auto px-8 pt-8 pb-12 relative z-10">
          <Link href="/events" className="inline-flex items-center gap-2 text-[13px] font-[700] text-[var(--brutal-text-dim)] hover:text-[var(--neon-cyan)] transition-colors mb-8 uppercase tracking-wider">
            ← All Events
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-start">
            <div>
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="text-[10px] font-[800] uppercase tracking-wider px-3 py-1.5 border border-[var(--neon-cyan)]/40 text-[var(--neon-cyan)]">{event.format}</span>
                <span className="text-[10px] font-[800] uppercase tracking-wider px-3 py-1.5 border text-[var(--ink-faint)]"
                  style={{ borderColor: event.type === 'Free' ? 'rgba(40,200,64,0.4)' : 'rgba(255,255,255,0.15)', color: event.type === 'Free' ? '#28c840' : 'rgba(255,255,255,0.4)' }}>
                  {event.type}
                </span>
                {event.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-[600] uppercase tracking-wider px-3 py-1.5 border border-white/10 text-white/40">{tag}</span>
                ))}
              </div>

              <h1 className="font-[800] text-[clamp(28px,5vw,58px)] leading-[1.0] tracking-[-0.03em] text-white mb-3">{event.title}</h1>
              <p className="text-[16px] text-[var(--neon-cyan)] font-[600] mb-5">{event.subtitle}</p>
              <p className="text-[15px] text-[var(--brutal-text-dim)] leading-[1.7] max-w-[580px]">{event.description}</p>
            </div>

            {/* Date block */}
            <div className="border-[2.5px] border-white/20 px-10 py-8 text-center shrink-0">
              <div className="font-[800] text-[64px] leading-none text-[var(--neon-cyan)]">{event.date.day}</div>
              <div className="font-[800] text-[18px] uppercase tracking-wider text-white/70 mt-1">{event.date.month}</div>
              <div className="font-[600] text-[14px] text-white/50">{event.date.year}</div>
              <div className="mt-4 pt-4 border-t border-white/15">
                <div className="font-[700] text-[16px] text-white">{event.time}</div>
                <div className="text-[12px] text-white/50">{event.timezone}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DETAILS + FORM ─── */}
      <div className="max-w-[1240px] mx-auto px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">

          {/* Left column */}
          <div className="space-y-10">
            {/* Key info grid */}
            <Reveal>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-0 border-[2.5px] border-[var(--ink)] shadow-[6px_6px_0px_var(--ink)]">
                {[
                  { icon: '📍', label: 'Location', value: event.location, sub: event.locationDetail },
                  { icon: '🕐', label: 'Time', value: event.time, sub: event.timezone },
                  { icon: '🎤', label: 'Speaker', value: event.speaker, sub: event.speakerTitle },
                  { icon: '👥', label: 'Capacity', value: `${event.capacity} seats`, sub: `${event.registered} registered` },
                  { icon: '🎟', label: 'Admission', value: event.type, sub: event.type === 'Free' ? 'No cost, no card' : event.type === 'Ticketed' ? 'See registration' : 'By invitation' },
                  { icon: '📅', label: 'Format', value: event.format, sub: event.format === 'Online' ? 'Anywhere with internet' : 'Physical attendance' },
                ].map((item, i) => (
                  <div key={i} className={`p-5 ${i % 3 !== 2 ? 'border-r-[2.5px]' : ''} ${i < 3 ? 'border-b-[2.5px]' : ''} border-[var(--ink)] bg-white`}>
                    <div className="text-[20px] mb-2">{item.icon}</div>
                    <div className="text-[10px] font-[800] uppercase tracking-wider text-[var(--ink-faint)] mb-1">{item.label}</div>
                    <div className="font-[800] text-[14px] text-[var(--ink)]">{item.value}</div>
                    {item.sub && <div className="text-[12px] text-[var(--ink-soft)] mt-0.5">{item.sub}</div>}
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Capacity bar */}
            <Reveal>
              <div className="border-[2.5px] border-[var(--ink)] shadow-[5px_5px_0px_var(--ink)] p-6 bg-[var(--paper-alt)]">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[11px] font-[800] uppercase tracking-wider text-[var(--ink-faint)]">Registration Status</div>
                  <div className="font-[800] text-[14px]" style={{ color: spotsLeft <= 10 ? '#e53e3e' : spotsLeft <= 30 ? '#d69e2e' : '#28c840' }}>
                    {event.type === 'Invite-Only' ? 'Full (Invite-Only)' : `${spotsLeft} spots remaining`}
                  </div>
                </div>
                <div className="h-3 border-[2px] border-[var(--ink)] overflow-hidden mb-2">
                  <div className="h-full transition-all" style={{
                    width: `${capacityPct}%`,
                    background: spotsLeft <= 10 ? '#e53e3e' : spotsLeft <= 30 ? '#d69e2e' : '#28c840'
                  }} />
                </div>
                <div className="flex justify-between text-[12px] text-[var(--ink-faint)] font-[600]">
                  <span>{event.registered} registered</span>
                  <span>{event.capacity} total capacity</span>
                </div>
              </div>
            </Reveal>

            {/* About */}
            <Reveal>
              <h2 className="font-[800] text-[22px] tracking-[-0.01em] mb-4 uppercase">About This Event</h2>
              <p className="text-[15px] text-[var(--ink-soft)] leading-[1.75]">{event.longDescription}</p>
            </Reveal>

            {/* Agenda */}
            <Reveal>
              <h2 className="font-[800] text-[22px] tracking-[-0.01em] mb-5 uppercase">Schedule & Agenda</h2>
              <div className="border-[2.5px] border-[var(--ink)] shadow-[6px_6px_0px_var(--ink)] overflow-hidden">
                {event.agenda.map((item, i) => (
                  <div key={i} className={`flex gap-0 ${i < event.agenda.length - 1 ? 'border-b-[2.5px] border-[var(--ink)]' : ''}`}>
                    <div className="shrink-0 w-[120px] px-5 py-4 font-[800] text-[13px] text-[var(--ink)] border-r-[2.5px] border-[var(--ink)] flex items-start bg-[var(--paper-alt)]">
                      {item.time}
                    </div>
                    <div className="p-5 bg-white flex-1">
                      <div className="font-[800] text-[15px] mb-1">{item.title}</div>
                      {item.description && <div className="text-[13px] text-[var(--ink-soft)] leading-[1.55]">{item.description}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Speaker */}
            <Reveal>
              <h2 className="font-[800] text-[22px] tracking-[-0.01em] mb-5 uppercase">Speaker</h2>
              <div className="border-[2.5px] border-[var(--ink)] shadow-[6px_6px_0px_var(--ink)] bg-white p-7 flex gap-6 items-start">
                <div className="w-20 h-20 rounded-full bg-[var(--ink)] flex items-center justify-center text-white text-[26px] font-[800] shrink-0">
                  {event.speaker.charAt(0)}
                </div>
                <div>
                  <div className="font-[800] text-[20px] mb-0.5">{event.speaker}</div>
                  <div className="text-[13px] text-[var(--ink-soft)] font-[600] mb-4">{event.speakerTitle}</div>
                  <p className="text-[14px] text-[var(--ink-soft)] leading-[1.65]">{event.speakerBio}</p>
                </div>
              </div>
            </Reveal>

            {/* Location */}
            <Reveal>
              <h2 className="font-[800] text-[22px] tracking-[-0.01em] mb-5 uppercase">Location</h2>
              <div className="border-[2.5px] border-[var(--ink)] shadow-[6px_6px_0px_var(--ink)] overflow-hidden">
                {/* Map placeholder */}
                <div className="h-[220px] relative flex items-center justify-center" style={{ background: 'repeating-linear-gradient(45deg,rgba(21,19,44,0.04) 0px,rgba(21,19,44,0.04) 1px,transparent 1px,transparent 28px),var(--paper-alt)' }}>
                  <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(90deg,rgba(21,19,44,0.06) 0px,rgba(21,19,44,0.06) 1px,transparent 1px,transparent 60px),repeating-linear-gradient(0deg,rgba(21,19,44,0.06) 0px,rgba(21,19,44,0.06) 1px,transparent 1px,transparent 60px)' }} />
                  <div className="text-center relative">
                    <div className="text-4xl mb-2">📍</div>
                    <div className="font-[800] text-[15px] text-[var(--ink)]">{event.location}</div>
                    {event.locationDetail && <div className="text-[13px] text-[var(--ink-soft)] mt-1">{event.locationDetail}</div>}
                    <div className="text-[11px] font-[700] uppercase tracking-wider text-[var(--ink-faint)] mt-3">Map Placeholder</div>
                  </div>
                </div>
                <div className="bg-white p-5 border-t-[2.5px] border-[var(--ink)]">
                  <div className="font-[800] text-[15px] mb-1">{event.location}</div>
                  {event.locationDetail && <div className="text-[13px] text-[var(--ink-soft)]">{event.locationDetail}</div>}
                  {event.format === 'Online' && (
                    <div className="mt-3 text-[13px] text-[var(--ink-soft)]">
                      🔗 Connection link will be sent by email 48 hours before the event.
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right column — Registration */}
          <div>
            <div className="sticky top-[100px] space-y-6">
              <RegistrationForm event={event} />

              {/* What to expect */}
              <div className="border-[2.5px] border-[var(--ink)] shadow-[5px_5px_0px_var(--ink)] p-6 bg-[var(--paper-alt)]">
                <div className="text-[11px] font-[800] uppercase tracking-[0.15em] text-[var(--ink-faint)] mb-4">What to Expect</div>
                <ul className="space-y-3">
                  {[
                    'Confirmation email immediately after registration',
                    'Event details sent 48 hours before',
                    `${event.agenda.length} scheduled segments`,
                    event.format === 'Online' ? 'Join from anywhere — no travel needed' : 'In-person attendance required',
                    'Free materials and resources provided',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[13.5px] text-[var(--ink-soft)]">
                      <span className="font-[800] text-[var(--ink)] mt-0.5 shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ─── RELATED EVENTS ─── */}
        <div className="mt-20 pt-10 border-t-[2.5px] border-[var(--ink)]">
          <h2 className="font-[800] text-[22px] tracking-[-0.01em] mb-8 uppercase">More Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {relatedEvents.map((ev, i) => (
              <Reveal key={ev.id} delay={i * 0.08}>
                <Link href={`/events/${ev.id}`}
                  className="block border-[2.5px] border-[var(--ink)] shadow-[5px_5px_0px_var(--ink)] bg-white hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_var(--ink)] transition-all group">
                  <div className="border-b-[2.5px] border-[var(--ink)] px-5 py-4 flex items-center justify-between" style={{ background: 'var(--brutal-bg)' }}>
                    <div>
                      <div className="font-[800] text-[28px] text-[var(--neon-cyan)] leading-none">{ev.date.day}</div>
                      <div className="text-[11px] font-[700] uppercase tracking-wider text-white/60">{ev.date.month} {ev.date.year}</div>
                    </div>
                    <span className="text-[10px] font-[800] uppercase px-2.5 py-1 border border-[var(--neon-cyan)]/30 text-[var(--neon-cyan)]">{ev.format}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-[800] text-[16px] leading-tight mb-2 group-hover:underline underline-offset-2">{ev.title}</h3>
                    <p className="text-[12.5px] text-[var(--ink-soft)] line-clamp-2 mb-3">{ev.description}</p>
                    <div className="text-[12px] font-[700] text-[var(--ink)] uppercase tracking-wider">View Details →</div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
