import type { ReactNode } from 'react';
import { PageHero } from '../components/PageHero';
import { mailto, site } from '../config/site';
import { usePageMeta } from '../hooks/usePageMeta';

const UPDATED = 'September 2026';

function Doc({ sections }: { sections: [string, ReactNode][] }) {
  return (
    <section className="gutter pb-[clamp(80px,10vw,140px)]">
      <div className="mono mb-10 text-mute">Last updated · {UPDATED}</div>
      <div className="rule border-t">
        {sections.map(([h, body], i) => (
          <div key={h} className="rule grid gap-4 border-b py-10 md:grid-cols-[80px_1fr_1.6fr] md:gap-10">
            <span className="mono text-signal">{String(i + 1).padStart(2, '0')}</span>
            <h2 className="display text-[40px]">{h}</h2>
            <div className="max-w-[720px] space-y-4 text-[17px] leading-relaxed text-ink/80">{body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Privacy() {
  usePageMeta('Privacy', `How ${site.name} handles your information — in short: we collect almost nothing.`);
  return (
    <>
      <PageHero label="Privacy" lines={['Privacy.']} intro={<>Short version: this website has no accounts, no sign-in, no advertising and no tracking cookies. We only know what you choose to email us.</>} />
      <Doc
        sections={[
          ['What we collect', <><p>This site does not ask you to create an account and does not use analytics, advertising or social-media tracking scripts. Fonts, images and code are served from our own domain — no third-party requests are made when you browse.</p><p>Our hosting provider keeps short-lived technical logs (such as IP address and pages requested) to keep the service secure and running. We do not use these logs to identify you.</p></>],
          ['When you email us', <p>Buttons such as “Donate”, “Join this chapter” or “Reserve a seat” open your own email app. If you send the message, we receive your email address and whatever you choose to include. We use it only to reply and to handle your request.</p>],
          ['Local storage', <p>We store a single flag in your browser’s session storage so the opening animation plays once per visit. It never leaves your device and is cleared when you close the tab.</p>],
          ['Children and young people', <p>Many of our students are under 18. We never publish a student’s personal details. If you — or a young person in your care — appear in a photo on this site and would like it removed, email us and we will take it down promptly.</p>],
          ['Your rights', <p>You can ask us what we hold about you, and ask us to correct or delete it, at any time. Write to <a className="link-sweep text-signal" href={mailto(site.email.general, 'Privacy request')}>{site.email.general}</a>.</p>],
        ]}
      />
    </>
  );
}

export function Terms() {
  usePageMeta('Terms', `Terms of use for the ${site.name} website.`);
  return (
    <>
      <PageHero label="Terms" lines={['Terms.']} intro={<>The plain-language rules for using this website.</>} />
      <Doc
        sections={[
          ['Education, not advice', <p>Everything on this site and in our programs is general educational material about behavioral economics and personal finance. It is not financial, investment, tax or legal advice. Please consult a qualified professional before making financial decisions.</p>],
          ['Using our content', <p>You are welcome to share links to this site. Text, curriculum, photographs and the GCL name and logo belong to {site.name} or the people pictured; please ask before re-using them. Chapters and partners may use materials under the terms of their agreement with us.</p>],
          ['Events', <p>Event details can change. Registration by email is a request, not a guaranteed place; we will confirm by reply. Please follow the code of conduct shared with your confirmation.</p>],
          ['Donations', <p>Donations are voluntary and support our programs. For receipts, restricted gifts or questions, write to <a className="link-sweep text-signal" href={mailto(site.email.giving)}>{site.email.giving}</a>.</p>],
          ['Liability', <p>We work hard to keep this site accurate and available, but provide it “as is”. To the extent permitted by law, {site.name} is not liable for losses arising from its use.</p>],
          ['Contact', <p>Questions about these terms: <a className="link-sweep text-signal" href={mailto(site.email.general, 'Terms of use')}>{site.email.general}</a>.</p>],
        ]}
      />
    </>
  );
}
