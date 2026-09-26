import { useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { Chapter } from '../data/chapters';
import { useClock } from './Nav';
import { site } from '../config/site';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function pad(s: string, n: number) {
  const clean = s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase();
  return clean.length > n ? clean.slice(0, n) : clean.padEnd(n, ' ');
}

/** Characters shuffle through the alphabet, then settle left-to-right. */
function Flaps({ text, start, delay = 0, signal = false }: { text: string; start: boolean; delay?: number; signal?: boolean }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(() => (reduce ? text : text.replace(/./g, ' ')));

  useEffect(() => {
    if (!start || reduce) {
      if (reduce) setShown(text);
      return;
    }
    let frame = 0;
    let id = 0;
    const timeout = window.setTimeout(() => {
      id = window.setInterval(() => {
        frame++;
        const settled = Math.floor(frame / 2);
        setShown(
          Array.from(text)
            .map((ch, i) => (i < settled || ch === ' ' ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
            .join(''),
        );
        if (settled >= text.length) window.clearInterval(id);
      }, 45);
    }, delay);
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(id);
    };
  }, [start, text, delay, reduce]);

  return (
    <span className="inline-flex" aria-hidden="true">
      {Array.from(shown).map((ch, i) => (
        <span key={i} className={`flap ${signal ? 'is-signal' : ''}`}>
          {ch}
        </span>
      ))}
    </span>
  );
}

const STATUS: Record<Chapter['status'], string> = { active: 'ACTIVE', growing: 'GROWING', new: 'NEW', dormant: 'DORMANT' };

export function DepartureBoard({ rows, title = 'Departures', subtitle = 'Next stop: financial freedom', onSelect }: { rows: Chapter[]; title?: string; subtitle?: string; onSelect?: (c: Chapter) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });
  const time = useClock(site.hq.timeZone);

  return (
    <div ref={ref} className="on-dark overflow-hidden rounded-[10px] bg-[#0a0a09] text-paper shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] ring-1 ring-white/5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4 sm:px-7">
        <div className="flex items-center gap-4">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-signal text-ink">
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true"><path fill="currentColor" d="M2.5 19h19v2h-19zM22 9.5c-.3-1-1.4-1.6-2.4-1.3L14.4 9.6 7.6 3.3 5.7 3.8l4.1 7.1-5 1.3-2-1.5-1.4.4 2.6 4.6 17.3-4.6c1-.3 1.6-1.4 1.3-2.4z"/></svg>
          </span>
          <div>
            <div className="display text-[28px] leading-none">{title}</div>
            <div className="mono mt-1 text-paper/50">{subtitle}</div>
          </div>
        </div>
        <div className="mono text-right text-paper/60">
          <div>
            Local time · {site.hq.city} <span className="tabular text-signal">{time}</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] border-collapse text-[clamp(13px,1.45vw,20px)]">
          <caption className="sr-only">GCL chapters: city, country, year established, members and status</caption>
          <thead>
            <tr className="mono text-left text-paper/45">
              <th scope="col" className="px-5 py-3 font-normal sm:px-7">Destination</th>
              <th scope="col" className="hidden px-3 py-3 font-normal md:table-cell">Country</th>
              <th scope="col" className="hidden px-3 py-3 font-normal sm:table-cell">Est.</th>
              <th scope="col" className="hidden px-3 py-3 font-normal lg:table-cell">Crew</th>
              <th scope="col" className="px-5 py-3 text-right font-normal sm:px-7">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c, i) => (
              <tr
                key={c.id}
                className={`group border-t border-white/[0.06] transition-colors hover:bg-white/[0.04] ${onSelect ? 'cursor-pointer' : ''}`}
                onClick={onSelect ? () => onSelect(c) : undefined}
                data-cursor={onSelect ? 'Open' : undefined}
              >
                <th scope="row" className="px-5 py-2 text-left font-normal sm:px-7">
                  <span className="sr-only">{c.city}</span>
                  {onSelect ? (
                    <button type="button" className="text-left" onClick={(e) => { e.stopPropagation(); onSelect(c); }} aria-label={`Open ${c.name}`}>
                      <Flaps text={pad(c.city, 10)} start={inView} delay={i * 70} />
                    </button>
                  ) : (
                    <Flaps text={pad(c.city, 10)} start={inView} delay={i * 70} />
                  )}
                </th>
                <td className="hidden px-3 py-2 md:table-cell">
                  <span className="sr-only">{c.country}</span>
                  <Flaps text={pad(c.country, 12)} start={inView} delay={i * 70 + 120} />
                </td>
                <td className="hidden px-3 py-2 sm:table-cell">
                  <span className="sr-only">{c.founded}</span>
                  <Flaps text={String(c.founded)} start={inView} delay={i * 70 + 200} />
                </td>
                <td className="hidden px-3 py-2 lg:table-cell">
                  <span className="sr-only">{c.members} members</span>
                  <Flaps text={String(c.members).padStart(3, '0')} start={inView} delay={i * 70 + 260} />
                </td>
                <td className="px-5 py-2 text-right sm:px-7">
                  <span className="sr-only">{STATUS[c.status]}</span>
                  <Flaps text={pad(STATUS[c.status], 7)} start={inView} delay={i * 70 + 300} signal={c.status === 'active'} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
