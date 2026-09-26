/**
 * Single source of truth for organization-wide facts, links and numbers.
 * Update values here — every page reads from this file.
 */

export const site = {
  name: 'Global Capital League',
  short: 'GCL',
  formerly: 'Vanguard Capital League',
  founded: 2021,
  hq: { city: 'Tashkent', country: 'Uzbekistan', timeZone: 'Asia/Tashkent', utc: 'GMT+5' },
  url: 'https://globalcapitalleague.org',
  tagline: 'Money is a behavior. We teach it.',
  description:
    "Global Capital League (GCL) is Asia's largest youth-led financial literacy non-profit — teaching behavioral economics and the psychology of money to young people across 14+ countries, free of charge.",

  email: {
    general: 'hello@globalcapitalleague.org',
    partnerships: 'partners@globalcapitalleague.org',
    giving: 'give@globalcapitalleague.org',
    chapters: 'chapters@globalcapitalleague.org',
    apply: 'apply@globalcapitalleague.org',
  },

  /**
   * Paste a hosted donation page here (Stripe Payment Link, Givebutter, Donorbox…).
   * While empty, every "Donate" button opens an email to the giving address instead.
   */
  donateUrl: '',

  /** Optional hosted application form for the Summer '26 program (Google Form, Tally…). */
  applyUrl: '',

  /** Leave a link empty to hide that network everywhere on the site. */
  social: {
    instagram: '',
    linkedin: '',
    telegram: '',
    youtube: '',
    tiktok: '',
  } as Record<string, string>,
} as const;

/** Headline impact numbers — shown in the ticker, hero and ledger. */
export const stats = {
  youth: { value: 8000, suffix: '+', label: 'Young people taught' },
  countries: { value: 14, suffix: '+', label: 'Countries' },
  chapters: { value: 38, suffix: '', label: 'Chapters' },
  workshops: { value: 120, suffix: '+', label: 'Workshops delivered' },
  completion: { value: 92, suffix: '%', label: 'Completion rate' },
  cost: { value: 0, suffix: '', label: 'Cost to students' },
};

export const summerProgram = {
  name: "GCL Summer '26",
  dates: 'July 20 – August 20, 2026',
  start: '2026-07-20',
  end: '2026-08-20',
};

/** Where the summer program sits relative to today — copy adapts automatically. */
export function summerPhase(now = new Date()): 'upcoming' | 'live' | 'complete' {
  if (now < new Date(summerProgram.start + 'T00:00:00')) return 'upcoming';
  if (now <= new Date(summerProgram.end + 'T23:59:59')) return 'live';
  return 'complete';
}

export function mailto(address: string, subject?: string, body?: string) {
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  const q = params.toString().replace(/\+/g, '%20');
  return `mailto:${address}${q ? `?${q}` : ''}`;
}

export const donateHref = site.donateUrl || mailto(site.email.giving, 'I would like to support GCL');
export const applyHref =
  site.applyUrl ||
  mailto(site.email.apply, summerPhase() === 'complete' ? 'Interest — next GCL cohort' : "Application — GCL Summer '26");

export const nav = [
  { href: '/', label: 'Index', note: '00' },
  { href: '/about', label: 'About', note: '01' },
  { href: '/programs', label: 'Programs', note: '02' },
  { href: '/chapters', label: 'Chapters', note: '03' },
  { href: '/events', label: 'Events', note: '04' },
  { href: '/team', label: 'Team', note: '05' },
  { href: '/get-involved', label: 'Get involved', note: '06' },
] as const;
