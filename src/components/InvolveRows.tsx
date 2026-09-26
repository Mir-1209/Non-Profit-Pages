import { applyHref, donateHref, mailto, site, summerPhase } from '../config/site';
import { Arrow } from './primitives';
import { Link } from 'wouter';

export const WAYS = [
  {
    id: 'donate',
    verb: 'Donate',
    line: 'Fund a workshop, a classroom, a city. Every student learns for free — donors make that true.',
    href: donateHref,
  },
  {
    id: 'volunteer',
    verb: 'Teach',
    line: `Join ${summerPhase() === 'complete' ? 'the next cohort' : "the Summer '26 team"} or your local chapter. Train, then teach financial literacy where it is missing.`,
    href: applyHref,
  },
  {
    id: 'partner',
    verb: 'Partner',
    line: 'Schools, universities, NGOs and companies: bring GCL to your students, staff or community.',
    href: mailto(site.email.partnerships, 'Partnership enquiry'),
  },
  {
    id: 'chapter',
    verb: 'Found',
    line: 'Start a chapter. Host one event with ten verified attendees and your city goes on the map.',
    href: '/chapters#start',
  },
] as const;

/** Oversized rows; hovering floods the row with signal orange. */
export function InvolveRows() {
  return (
    <ul className="rule border-t">
      {WAYS.map((w, i) => {
        const inner = (
          <>
            <span className="absolute inset-0 origin-bottom scale-y-0 bg-signal transition-transform duration-700 ease-out-expo group-hover:scale-y-100" />
            <span className="mono relative w-10 shrink-0 self-start pt-3 md:pt-6">0{i + 1}</span>
            <span className="display relative text-[clamp(64px,12vw,210px)] leading-[0.82] transition-[font-stretch] duration-700 ease-out-expo md:group-hover:[font-stretch:88%]">
              {w.verb}
            </span>
            <span className="relative ml-auto hidden max-w-[330px] text-[16px] leading-relaxed md:block">{w.line}</span>
            <span className="relative ml-auto grid h-14 w-14 shrink-0 place-items-center rounded-full border md:ml-0 border-current transition-all duration-500 group-hover:rotate-45 group-hover:border-ink group-hover:bg-ink group-hover:text-signal md:h-20 md:w-20">
              <Arrow className="h-5 w-5" />
            </span>
          </>
        );
        const cls = 'group relative flex items-center gap-4 overflow-hidden py-4 md:gap-10 md:py-6';
        return (
          <li key={w.id} className="rule border-b" id={`way-${w.id}`}>
            {w.href.startsWith('/') ? (
              <Link href={w.href} className={cls}>{inner}</Link>
            ) : (
              <a href={w.href} className={cls} {...(w.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                {inner}
              </a>
            )}
            <p className="pb-5 text-[15px] leading-relaxed text-mute md:hidden">{w.line}</p>
          </li>
        );
      })}
    </ul>
  );
}
