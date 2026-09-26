import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Accent, PageHero } from '../components/PageHero';
import { Eyebrow, Pill } from '../components/primitives';
import { mailto, site } from '../config/site';
import { events, type Event } from '../data/events';
import { chapters } from '../data/chapters';
import { usePageMeta } from '../hooks/usePageMeta';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
// An event stays "upcoming" until the end of its day.
const dateOf = (e: Event) => new Date(Number(e.date.year), MONTHS.indexOf(e.date.month), Number(e.date.day), 23, 59, 59);

function EventRow({ e, past }: { e: Event; past: boolean }) {
  const [open, setOpen] = useState(false);
  const chapter = chapters.find((c) => c.id === e.chapterId);
  return (
    <li className="rule border-b">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`group grid w-full grid-cols-[88px_1fr_40px] items-center gap-4 py-6 text-left md:grid-cols-[150px_1fr_220px_140px_48px] md:gap-8 ${past ? 'opacity-55 hover:opacity-100' : ''}`}
      >
        <span className="leading-none">
          <span className="display block text-[clamp(56px,6vw,96px)] leading-[0.8]">{e.date.day}</span>
          <span className="mono mt-2 block text-mute">{e.date.month} {e.date.year}</span>
        </span>
        <span>
          <span className="display block text-[clamp(32px,3.6vw,60px)] transition-colors group-hover:text-signal">{e.title}</span>
          <span className="mt-1 block text-[15px] text-mute">{e.subtitle}</span>
        </span>
        <span className="mono hidden text-mute md:block">
          {e.format} · {chapter ? `GCL ${chapter.city}` : 'GCL'}
          <br />
          {e.time} {e.timezone.split(' ')[0]}
        </span>
        <span className="hidden md:block">
          <span className={`mono inline-block rounded-full px-3 py-1.5 ${past ? 'border border-ink/20' : e.type === 'Free' ? 'bg-signal' : 'bg-ink text-paper'}`}>
            {past ? 'Archive' : e.type}
          </span>
        </span>
        <span className={`grid h-10 w-10 place-items-center justify-self-end rounded-full border border-ink/25 text-[18px] transition-transform duration-500 ${open ? 'rotate-45 bg-ink text-paper' : ''}`}>+</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
            <div className="grid gap-10 pb-10 md:grid-cols-[150px_1fr_1fr] md:gap-8">
              <span className="hidden md:block" />
              <div>
                <p className="text-[17px] leading-relaxed">{e.longDescription}</p>
                <dl className="mt-6 grid grid-cols-2 gap-4">
                  <div><dt className="mono text-mute">Where</dt><dd className="mt-1 text-[15px]">{e.location}</dd></div>
                  <div><dt className="mono text-mute">Host</dt><dd className="mt-1 text-[15px]">{e.speaker}</dd></div>
                </dl>
                <div className="mt-8">
                  {past ? (
                    <Pill href={mailto(site.email.general, `Recording / notes — ${e.title}`)} variant="ghost">Ask for the notes</Pill>
                  ) : (
                    <Pill href={mailto(site.email.general, `Register — ${e.title} (${e.date.full})`, 'Name:\nCity / country:\nSchool or organization (optional):')} variant="signal">
                      Reserve a seat
                    </Pill>
                  )}
                </div>
              </div>
              <ol className="rule border-t">
                {e.agenda.map((a) => (
                  <li key={a.time + a.title} className="rule grid grid-cols-[90px_1fr] gap-3 border-b py-3">
                    <span className="mono pt-0.5 text-signal">{a.time}</span>
                    <span>
                      <span className="block text-[15px] font-[620]">{a.title}</span>
                      {a.description && <span className="block text-[14px] leading-relaxed text-mute">{a.description}</span>}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export default function Events() {
  usePageMeta('Events', 'Workshops, summits and retreats — online and in person. Free to attend unless noted.');
  const now = new Date();
  const sorted = [...events].sort((a, b) => dateOf(a).getTime() - dateOf(b).getTime());
  const upcoming = sorted.filter((e) => dateOf(e) >= now);
  const past = sorted.filter((e) => dateOf(e) < now).reverse();
  const next = upcoming[0];

  return (
    <>
      <PageHero
        label="Events"
        lines={['Rooms', <>worth <Accent>showing</Accent></>, 'up to.']}
        intro={<>Workshops, summits, webinars and retreats — hosted by chapters around the world. Almost everything is free. Everything is shame-free.</>}
        aside={
          next ? (
            <div className="max-w-[360px] rounded-[28px] bg-ink p-6 text-paper">
              <div className="mono text-signal">Next up · {next.date.full}</div>
              <div className="display mt-3 text-[40px]">{next.title}</div>
              <div className="mono mt-3 text-paper/50">{next.format} · {next.location}</div>
            </div>
          ) : undefined
        }
      />

      <section className="gutter pb-[clamp(80px,10vw,140px)]">
        <Eyebrow index="04.1" className="mb-8">Upcoming · {upcoming.length}</Eyebrow>
        {upcoming.length ? (
          <ul className="rule border-t">
            {upcoming.map((e) => (
              <EventRow key={e.id} e={e} past={false} />
            ))}
          </ul>
        ) : (
          <div className="rounded-[28px] border border-dashed border-ink/25 p-12 text-center">
            <div className="display text-[48px]">The calendar is being written.</div>
            <p className="mt-3 text-mute">New events are announced first to chapters. Write to us to host one in your city.</p>
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section className="gutter pb-[clamp(80px,10vw,140px)]">
          <Eyebrow index="04.2" className="mb-8">Archive · {past.length}</Eyebrow>
          <ul className="rule border-t">
            {past.map((e) => (
              <EventRow key={e.id} e={e} past />
            ))}
          </ul>
        </section>
      )}

      <section className="gutter bg-signal py-[clamp(80px,10vw,140px)]">
        <div className="flex flex-wrap items-end justify-between gap-10">
          <h2 className="display text-[clamp(64px,9vw,160px)]">
            Host one <span className="serif normal-case italic tracking-[-0.03em]">in your city.</span>
          </h2>
          <Pill href={mailto(site.email.chapters, 'I want to host a GCL event')} variant="ink">Pitch an event</Pill>
        </div>
      </section>
    </>
  );
}
