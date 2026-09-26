import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DepartureBoard } from '../components/DepartureBoard';
import { Globe } from '../components/Globe';
import { Accent } from '../components/PageHero';
import { Counter, EASE, EASE_IN_OUT, Eyebrow, MaskLines, Pill, Rise } from '../components/primitives';
import { mailto, site, stats } from '../config/site';
import { chapters, type Chapter } from '../data/chapters';
import { usePageMeta } from '../hooks/usePageMeta';
import { useLenis } from '../lib/smooth';

const REGION: Record<string, string> = {
  Uzbekistan: 'Central Asia',
  Kazakhstan: 'Central Asia',
  Kyrgyzstan: 'Central Asia',
  Tajikistan: 'Central Asia',
  Turkmenistan: 'Central Asia',
  Georgia: 'Caucasus & Türkiye',
  Turkey: 'Caucasus & Türkiye',
  UK: 'Europe',
  Nigeria: 'Africa',
  Kenya: 'Africa',
  India: 'South Asia',
  Colombia: 'Latin America',
};
const regionOf = (c: Chapter) => REGION[c.country] ?? 'Worldwide';

const STEPS = [
  { t: 'Register', d: 'Tell us who you are and where you are. We pair you with a mentor from an existing chapter.' },
  { t: 'Organize', d: 'Plan your first financial literacy event with our playbook, slides and activities.' },
  { t: 'Host', d: 'Run it with at least 10 verified attendees. That is the bar — no more, no less.' },
  { t: 'Go live', d: 'Your chapter is officially recognized and gets a permanent place on the map. You become its Chapter Founder.' },
];

function ChapterPanel({ chapter, onClose }: { chapter: Chapter; onClose: () => void }) {
  const lenis = useLenis();
  useEffect(() => {
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      lenis?.start();
      window.removeEventListener('keydown', onKey);
    };
  }, [lenis, onClose]);

  return (
    <motion.div className="fixed inset-0 z-[65] flex justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button type="button" aria-label="Close chapter" className="absolute inset-0 bg-ink/60 backdrop-blur-[2px]" onClick={onClose} />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="chapter-title"
        data-lenis-prevent
        className="relative flex h-full w-full max-w-[640px] flex-col overflow-y-auto bg-paper"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.8, ease: EASE_IN_OUT }}
      >
        <div className="bg-ink p-8 pt-24 text-paper">
          <div className="mono flex items-center justify-between text-paper/60">
            <span>{regionOf(chapter)} · Est. {chapter.founded}</span>
            <span className={chapter.status === 'active' ? 'text-signal' : ''}>● {chapter.status}</span>
          </div>
          <h2 id="chapter-title" className="display mt-6 text-[clamp(72px,12vw,130px)]">{chapter.city}</h2>
          <div className="serif mt-2 text-[28px] italic text-paper/70">{chapter.country}{chapter.university ? ` · ${chapter.university}` : ''}</div>
        </div>
        <div className="grid grid-cols-3 border-b border-ink/10">
          {[
            ['Members', chapter.members],
            ['Events', chapter.eventsHosted],
            ['Students', chapter.studentsEducated],
          ].map(([k, v]) => (
            <div key={k} className="border-r border-ink/10 p-6 last:border-r-0">
              <div className="display text-[48px] leading-none">{Number(v).toLocaleString('en-US')}</div>
              <div className="mono mt-2 text-mute">{k}</div>
            </div>
          ))}
        </div>
        <div className="flex-1 space-y-8 p-8">
          <p className="text-[18px] leading-relaxed">{chapter.about}</p>
          <dl className="grid grid-cols-2 gap-6">
            <div><dt className="mono text-mute">Founder</dt><dd className="mt-1 text-[16px] font-[600]">{chapter.founder}</dd></div>
            <div><dt className="mono text-mute">Chapter lead</dt><dd className="mt-1 text-[16px] font-[600]">{chapter.lead}</dd></div>
            <div className="col-span-2"><dt className="mono text-mute">Focus</dt><dd className="mt-1 text-[16px]">{chapter.focus}</dd></div>
          </dl>
          <ul className="mono flex flex-wrap gap-2">
            {chapter.tags.map((t) => (
              <li key={t} className="rounded-full border border-ink/20 px-3 py-1.5">{t}</li>
            ))}
          </ul>
        </div>
        <div className="sticky bottom-0 flex flex-wrap gap-3 border-t border-ink/10 bg-paper p-6">
          <Pill href={mailto(site.email.chapters, `Join ${chapter.name}`)} variant="signal">Join this chapter</Pill>
          <button type="button" onClick={onClose} className="rounded-full border border-ink/25 px-6 py-3.5 text-[13px] font-[650] uppercase tracking-[0.06em]">
            Close
          </button>
        </div>
      </motion.aside>
    </motion.div>
  );
}

export default function Chapters() {
  usePageMeta('Chapters', `${stats.chapters.value} youth-led chapters across ${stats.countries.value}+ countries — find yours, or start one in your city.`);
  const [status, setStatus] = useState<'all' | Chapter['status']>('all');
  const [region, setRegion] = useState('All regions');
  const [selected, setSelected] = useState<Chapter | null>(null);
  const close = useCallback(() => setSelected(null), []);

  const regions = useMemo(() => ['All regions', ...Array.from(new Set(chapters.map(regionOf)))], []);
  const rows = chapters.filter((c) => (status === 'all' || c.status === status) && (region === 'All regions' || regionOf(c) === region));
  const students = chapters.reduce((n, c) => n + c.studentsEducated, 0);
  const events = chapters.reduce((n, c) => n + c.eventsHosted, 0);

  return (
    <>
      <section className="on-dark glow-dark relative overflow-hidden pb-20 pt-[128px] text-paper md:pt-[150px]">
        <div className="gutter grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
          <div className="relative z-10">
            <Eyebrow index="03" className="mb-8 text-paper/70">Chapters</Eyebrow>
            <h1 className="display text-[clamp(68px,8.6vw,170px)]">
              {['Every city', <>is a <Accent>starting</Accent></>, 'point.'].map((l, i) => (
                <span key={i} className="block overflow-hidden pb-[0.03em]">
                  <motion.span className="block" initial={{ y: '105%' }} animate={{ y: '0%' }} transition={{ duration: 1.2, ease: EASE, delay: 0.45 + i * 0.08 }}>
                    {l}
                  </motion.span>
                </span>
              ))}
            </h1>
            <p className="mt-10 max-w-[520px] text-[clamp(18px,1.5vw,22px)] leading-[1.45] text-paper/75">
              Every chapter begins with one young person and one event. Each is locally led, globally connected — and drawn here as an arc from where it all started: {site.hq.city}.
            </p>
            <div className="mt-10 grid max-w-[560px] grid-cols-3 gap-6 border-t border-paper/15 pt-6">
              <div><div className="display text-[clamp(44px,5vw,72px)] leading-none"><Counter value={stats.chapters.value} /></div><div className="mono mt-2 text-paper/50">Chapters</div></div>
              <div><div className="display text-[clamp(44px,5vw,72px)] leading-none"><Counter value={stats.countries.value} suffix="+" /></div><div className="mono mt-2 text-paper/50">Countries</div></div>
              <div><div className="display text-[clamp(44px,5vw,72px)] leading-none text-signal"><Counter value={stats.youth.value / 1000} suffix="K+" /></div><div className="mono mt-2 text-paper/50">Youth taught</div></div>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[720px]">
            <Globe />
            <div className="mono pointer-events-none absolute bottom-2 left-0 right-0 text-center text-paper/40">Drag to spin · ● chapter · ⌒ link to HQ</div>
          </div>
        </div>
      </section>

      <section className="gutter bg-paper-2 py-[clamp(80px,10vw,140px)]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow index="03.1" className="mb-6">The board</Eyebrow>
            <MaskLines as="h2" className="display text-[clamp(56px,8vw,140px)]" lines={['Flagship', <><Accent>chapters.</Accent></>]} />
          </div>
          <p className="mono max-w-[340px] text-mute">
            {chapters.length} flagship chapters shown · {events} events hosted · {students.toLocaleString('en-US')} students educated. Select a row to open a chapter.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter chapters">
          {(['all', 'active', 'growing', 'new'] as const).map((s) => (
            <button key={s} type="button" aria-pressed={status === s} onClick={() => setStatus(s)} className={`mono rounded-full border px-4 py-2 transition-colors ${status === s ? 'border-ink bg-ink text-paper' : 'border-ink/20 hover:border-ink'}`}>
              {s === 'all' ? 'All statuses' : s}
            </button>
          ))}
          <span className="mx-2 hidden w-px bg-ink/15 sm:block" />
          <label className="sr-only" htmlFor="region">Region</label>
          <select id="region" value={region} onChange={(e) => setRegion(e.target.value)} className="mono rounded-full border border-ink/20 bg-transparent px-4 py-2">
            {regions.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>

        {rows.length ? (
          <DepartureBoard key={status + region} rows={rows} onSelect={setSelected} title="All departures" subtitle={`${rows.length} chapter${rows.length === 1 ? '' : 's'} · tap to open`} />
        ) : (
          <div className="rounded-[28px] border border-dashed border-ink/25 p-12 text-center">
            <div className="display text-[48px]">No departures yet.</div>
            <p className="mt-3 text-mute">Nobody has founded a chapter matching this filter — which means it could be you.</p>
          </div>
        )}
      </section>

      <section id="start" className="gutter py-[clamp(96px,12vw,180px)]">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <Eyebrow index="03.2" className="mb-6">Start a chapter</Eyebrow>
            <MaskLines as="h2" className="display text-[clamp(64px,9vw,160px)]" lines={['Put your', <>city on <Accent>the map.</Accent></>]} />
            <p className="mt-8 max-w-[480px] text-[18px] leading-relaxed text-mute">
              You do not need permission, funding or a finance degree. You need one room, ten people and the will to teach. We provide the rest.
            </p>
            <div className="mt-10">
              <Pill href={mailto(site.email.chapters, 'I want to start a GCL chapter', 'City:\nCountry:\nSchool / university (if any):\nWhy I want to start a chapter:')} variant="signal">
                Start a chapter
              </Pill>
            </div>
          </div>
          <ol className="rule border-t">
            {STEPS.map((s, i) => (
              <Rise key={s.t} delay={i * 0.06}>
                <li className="rule grid grid-cols-[64px_1fr] gap-4 border-b py-7">
                  <span className="display text-[56px] leading-[0.8] text-signal">{i + 1}</span>
                  <div>
                    <div className="display text-[40px]">{s.t}</div>
                    <p className="mt-2 text-[16px] leading-relaxed text-mute">{s.d}</p>
                  </div>
                </li>
              </Rise>
            ))}
          </ol>
        </div>

        <div className="mt-24 grid gap-6 md:grid-cols-2">
          {[
            ['Chapter Founder', 'The permanent title earned by whoever opens a chapter — your name stays on the chapter forever.'],
            ['Chapter Reviver', 'Chapters without a verified event for six months go dormant. Any volunteer who revives one with a new event earns this title.'],
          ].map(([t, d]) => (
            <Rise key={t} className="flex flex-col justify-between gap-12 rounded-[28px] bg-ink p-8 text-paper md:p-10">
              <div className="mono text-signal">Title</div>
              <div>
                <div className="serif text-[clamp(44px,4.5vw,72px)] leading-none italic">{t}</div>
                <p className="mt-4 max-w-[440px] text-[16px] leading-relaxed text-paper/65">{d}</p>
              </div>
            </Rise>
          ))}
        </div>
      </section>

      <AnimatePresence>{selected && <ChapterPanel chapter={selected} onClose={close} />}</AnimatePresence>
    </>
  );
}
