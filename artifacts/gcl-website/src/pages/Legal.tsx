import React from 'react';

export function Privacy() {
  return (
    <main className="pb-24 pt-[120px]">
      <div className="max-w-[800px] mx-auto px-8 prose prose-slate prose-headings:font-[800] prose-headings:tracking-[-0.02em] prose-p:text-[var(--ink-soft)]">
        <h1 className="text-4xl md:text-5xl uppercase bg-[var(--grad-brand)] text-transparent bg-clip-text mb-2">Privacy Policy</h1>
        <p className="text-sm font-[600] text-[var(--ink-faint)] mb-10">Last updated: October 2023</p>
        
        <p>Global Capital League ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by GCL.</p>

        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly to us when you register for a course, attend an event, or communicate with us. This may include:</p>
        <ul>
          <li>Name and contact data</li>
          <li>Educational background or affiliation</li>
          <li>Survey responses and feedback</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve our educational programs</li>
          <li>Communicate with you about courses and events</li>
          <li>Measure and report on the impact of our programs anonymously</li>
        </ul>

        <h2>3. Data Security</h2>
        <p>We implement reasonable security measures to protect the security of your personal information. However, no security system is impenetrable, and we cannot guarantee the security of our systems 100%.</p>

        <h2>4. Contact Us</h2>
        <p>If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:privacy@globalcapitalleague.org">privacy@globalcapitalleague.org</a></p>
      </div>
    </main>
  );
}

export function Terms() {
  return (
    <main className="pb-24 pt-[120px]">
      <div className="max-w-[800px] mx-auto px-8 prose prose-slate prose-headings:font-[800] prose-headings:tracking-[-0.02em] prose-p:text-[var(--ink-soft)]">
        <h1 className="text-4xl md:text-5xl uppercase bg-[var(--grad-brand)] text-transparent bg-clip-text mb-2">Terms of Service</h1>
        <p className="text-sm font-[600] text-[var(--ink-faint)] mb-10">Last updated: October 2023</p>
        
        <p>Please read these Terms of Service carefully before using the Global Capital League website or participating in our programs.</p>

        <h2>1. Acceptance of Terms</h2>
        <p>By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.</p>

        <h2>2. Educational Purpose</h2>
        <p>All content provided by GCL is for educational purposes only. We are not financial advisors, and our materials do not constitute professional financial, investment, or legal advice.</p>

        <h2>3. Intellectual Property</h2>
        <p>The curriculum, frameworks, and content provided by GCL are our intellectual property. We encourage the sharing of knowledge, but commercial use or unauthorized redistribution of our specific materials requires explicit written permission or formal partnership.</p>

        <h2>4. Code of Conduct</h2>
        <p>Participants in our online forums, live workshops, and events are expected to maintain a respectful, inclusive environment. Harassment, discrimination, or abusive behavior will result in immediate removal from our programs.</p>

      </div>
    </main>
  );
}
