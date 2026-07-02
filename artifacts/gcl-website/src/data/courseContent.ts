export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface ModuleFile {
  name: string;
  size: string;
  type: 'pdf' | 'worksheet' | 'template' | 'audio';
  description: string;
}

export interface ModuleVideo {
  title: string;
  duration: string;
  description: string;
  chapters: { time: string; title: string }[];
}

export interface ModuleReading {
  title: string;
  readTime: string;
  content: string[];
}

export interface CourseModuleContent {
  slug: string;
  moduleIndex: number;
  video: ModuleVideo;
  reading: ModuleReading;
  files: ModuleFile[];
  quiz: QuizQuestion[];
  keyTakeaways: string[];
}

export interface FullCourseContent {
  courseSlug: string;
  totalEnrolled: number;
  rating: number;
  reviewCount: number;
  lastUpdated: string;
  language: string;
  certificate: boolean;
  passingScore: number;
  whatYouLearn: string[];
  requirements: string[];
  targetAudience: string[];
  aboutCourse: string;
  modules: CourseModuleContent[];
}

export const psychologyOfSpendingContent: FullCourseContent = {
  courseSlug: 'psychology-of-spending',
  totalEnrolled: 3847,
  rating: 4.8,
  reviewCount: 612,
  lastUpdated: 'June 2026',
  language: 'English',
  certificate: true,
  passingScore: 8,
  aboutCourse: `Money is emotional. The vast majority of financial decisions we make aren't driven by logic — they're driven by fear, identity, social pressure, and cognitive shortcuts our brains developed thousands of years ago. This course gives you the scientific framework to understand your own financial behavior and reprogram it from the inside out.\n\nBuilt on cutting-edge behavioral economics research, this course translates academic findings into practical tools you can use immediately — regardless of your income level, country, or prior financial knowledge.`,
  whatYouLearn: [
    'How the brain makes financial decisions — and where it goes wrong',
    'The psychology of emotional and impulsive spending',
    'How brands and marketers exploit cognitive biases against you',
    'Framing effects, anchoring, and how pricing manipulates perception',
    'Science-backed techniques to build delayed gratification',
    'How to create sustainable spending habits using behavioral design',
    'Why willpower alone always fails — and what actually works instead',
    'How to identify and rewire your personal money scripts',
  ],
  requirements: [
    'No prior financial knowledge needed',
    'Curiosity about human behavior and money',
    'A willingness to reflect on your own financial patterns',
  ],
  targetAudience: [
    'Young adults looking to take control of their finances',
    'Anyone who struggles with impulsive or emotional spending',
    'Educators and community leaders delivering financial literacy programs',
    'Anyone interested in behavioral economics applied to everyday life',
  ],
  modules: [
    {
      slug: 'the-brain-on-money',
      moduleIndex: 0,
      keyTakeaways: [
        'The brain has two systems: fast (emotional) and slow (rational)',
        'Most spending decisions are made by System 1 — before you consciously choose',
        'Loss aversion means losses feel twice as painful as equivalent gains',
        'Understanding these systems is the first step to changing behavior',
      ],
      video: {
        title: 'The Brain on Money: How Your Mind Makes Financial Decisions',
        duration: '18:42',
        description: 'In this module, we explore the neuroscience behind financial decision-making. You\'ll learn about dual-process theory, the role of the limbic system in money anxiety, and why the brain treats financial loss the same way it treats physical pain.',
        chapters: [
          { time: '0:00', title: 'Introduction — Why money makes us irrational' },
          { time: '3:15', title: 'System 1 vs System 2 thinking' },
          { time: '7:40', title: 'The neuroscience of financial pain' },
          { time: '12:20', title: 'Loss aversion — the 2:1 asymmetry' },
          { time: '15:55', title: 'Key takeaways and reflection exercise' },
        ],
      },
      reading: {
        title: 'Understanding Your Financial Brain',
        readTime: '8 min read',
        content: [
          `## Why Your Brain Isn't Built for Modern Finance\n\nYour brain evolved over 200,000 years to survive on the African savanna — not to navigate credit card interest rates, stock market volatility, or subscription billing cycles. The mismatch between our ancient neural architecture and modern financial complexity is the root cause of most financial suffering.`,
          `## The Two-System Brain\n\nPsychologist Daniel Kahneman's landmark research identifies two distinct cognitive systems that govern all decision-making:\n\n**System 1** is fast, automatic, and emotional. It operates below conscious awareness, processes information in parallel, and draws on heuristics (mental shortcuts) developed through evolution and experience. When you see a "SALE" sign and feel an urge to buy something you didn't plan to purchase, that's System 1.\n\n**System 2** is slow, deliberate, and analytical. It requires conscious effort, operates sequentially, and can override System 1 — but only when it's not depleted by decision fatigue, stress, or cognitive load. When you force yourself to calculate whether a bulk purchase actually saves money, that's System 2.`,
          `## The Financial Implications\n\nThe critical insight for financial behavior: **most spending decisions happen in System 1, before System 2 is even consulted.** You decide, then you rationalize. This is why knowing what you "should" do financially almost never translates into actually doing it.\n\nResearch by neuroscientist Brian Knutson at Stanford shows that the anticipation of a purchase activates the nucleus accumbens (the brain's reward center) — the same region activated by food, sex, and addictive substances. Meanwhile, the experience of paying (especially with cash) activates the insula, the brain region associated with physical pain.\n\nThis is why credit cards increase spending by 12-18% compared to cash: they reduce the "pain of paying" by abstracting the transaction from the physical handing-over of money.`,
          `## Loss Aversion: The 2:1 Asymmetry\n\nOne of the most robust findings in behavioral economics is **loss aversion**: the psychological pain of losing $100 is approximately twice as intense as the pleasure of gaining $100. This asymmetry, documented by Kahneman and Tversky in their seminal Prospect Theory research, has profound financial consequences:\n\n- We hold losing investments too long (hoping to "break even") and sell winning investments too early\n- We avoid switching insurance providers or utility companies even when cheaper options exist (the effort feels like a loss)\n- We're more motivated by "saving $50" framing than "earning $50" framing, even when the outcome is identical\n- We overweigh small probabilities of catastrophic loss (hence the popularity of insurance for unlikely events)`,
          `## Practical Reflection\n\nBefore moving to the quiz, take 5 minutes to answer these questions in your notes:\n\n1. Think of a recent purchase you regretted. Which system was driving it — and when did System 2 arrive to rationalize it?\n2. Can you identify a financial decision in your life where loss aversion is currently keeping you stuck?\n3. How does paying with your phone versus cash change how you feel about spending money?`,
        ],
      },
      files: [
        { name: 'Module 1 — Financial Brain Worksheet.pdf', size: '1.2 MB', type: 'worksheet', description: 'A guided self-assessment to map your personal System 1 spending triggers' },
        { name: 'Kahneman Prospect Theory — Summary Notes.pdf', size: '0.8 MB', type: 'pdf', description: 'Condensed summary of the original academic paper with annotations' },
        { name: 'Weekly Spending Tracker Template.pdf', size: '0.5 MB', type: 'template', description: 'A printable tracker to identify emotional vs rational purchase patterns' },
      ],
      quiz: [
        {
          id: 'm1q1',
          question: 'According to dual-process theory, which system is responsible for most moment-to-moment spending decisions?',
          options: ['System 2 — because financial decisions require analytical thought', 'System 1 — because decisions are made automatically before conscious reasoning', 'Both systems equally — every decision involves a negotiation', 'Neither — spending is purely habitual and involves no active cognition'],
          correct: 1,
          explanation: 'System 1 (fast, automatic, emotional) drives the vast majority of everyday spending decisions. System 2 typically arrives after the decision to rationalize or occasionally override it — but this requires significant cognitive effort.',
        },
        {
          id: 'm1q2',
          question: 'Research shows that paying with a credit card versus cash changes spending behavior. Which finding is accurate?',
          options: ['Credit cards reduce spending by making people more aware of their balance', 'Credit cards increase spending by 12–18% by reducing the psychological "pain of paying"', 'Cash and credit cards produce identical spending outcomes', 'Credit cards reduce spending because users fear future bills'],
          correct: 1,
          explanation: 'Brian Knutson\'s neuroimaging research shows that physical cash payment activates the insula (pain response), while card payments abstract this sensation. This "pain of paying" reduction leads to 12–18% higher spending on average when using credit cards.',
        },
        {
          id: 'm1q3',
          question: 'Loss aversion describes which psychological phenomenon?',
          options: ['The tendency to avoid making any financial decisions to prevent loss', 'The finding that losses feel approximately twice as painful as equivalent gains feel pleasurable', 'A preference for guaranteed losses over probabilistic ones', 'The tendency to spend more money after experiencing a financial loss'],
          correct: 1,
          explanation: 'Loss aversion, formalized in Prospect Theory by Kahneman and Tversky, shows that losses are felt roughly 2x more intensely than equivalent gains. This asymmetry explains many irrational financial behaviors, from holding losing stocks to overpaying for insurance.',
        },
      ],
    },
    {
      slug: 'emotional-spending',
      moduleIndex: 1,
      keyTakeaways: [
        'Emotional spending is a coping mechanism — it temporarily relieves negative emotions',
        'The "retail therapy" effect is real but short-lived (under 30 minutes)',
        'Specific emotions trigger specific spending patterns (boredom → novelty, anxiety → comfort, shame → status)',
        'The 72-hour rule is the most effective single intervention for impulse spending',
      ],
      video: {
        title: 'Emotional Spending: The Psychology Behind "Retail Therapy"',
        duration: '21:15',
        description: 'This module unpacks the emotional drivers behind unplanned spending. We examine the neuroscience of mood-repair purchasing, how specific emotional states predict spending categories, and evidence-based interventions that interrupt the emotional spending cycle.',
        chapters: [
          { time: '0:00', title: 'What is emotional spending?' },
          { time: '4:30', title: 'The mood-repair hypothesis' },
          { time: '9:10', title: 'Emotion-to-spending category mapping' },
          { time: '14:45', title: 'Breaking the cycle — 4 interventions' },
          { time: '18:20', title: 'The 72-hour rule explained' },
        ],
      },
      reading: {
        title: 'The Science of Emotional Spending',
        readTime: '9 min read',
        content: [
          `## What Is Emotional Spending?\n\nEmotional spending — purchasing driven by emotional state rather than genuine need or considered preference — accounts for an estimated 62% of non-essential consumer spending according to research by the CreditCards.com institute. Yet most people who do it deny it.`,
          `## The Mood-Repair Hypothesis\n\nResearchers Atalay and Meloy demonstrated in a landmark 2011 study that people in negative emotional states use shopping as mood regulation. The mechanism: the anticipation and selection process of shopping temporarily occupies the mind, reducing rumination on negative thoughts. The purchase itself triggers a dopamine release. The effect is real — but it lasts an average of 24 minutes before mood returns to baseline (or drops lower, due to post-purchase guilt).`,
          `## Emotion-to-Category Mapping\n\nDifferent emotional states predict different spending categories:\n\n**Boredom** → novelty purchases (gadgets, subscription boxes, random online browsing)\n**Anxiety** → comfort products (food delivery, familiar brands, things associated with childhood security)\n**Sadness** → premium/luxury items (research by Cryder et al. shows sad people pay 300% more for the same item)\n**Shame/Inadequacy** → status symbols (clothes, cars, tech visible to others)\n**Excitement** → impulse variety (multiple different items, less price sensitivity)\n\nIdentifying your emotional trigger is the first step to interrupting the spending response.`,
          `## Four Evidence-Based Interventions\n\n**1. The 72-Hour Rule**\nFor any non-essential purchase over a personal threshold (many GCL participants set $30-50), commit to waiting 72 hours. Research shows desire intensity drops 40-60% over 72 hours for impulse items. If you still want it after 3 days and it fits your values, you can buy it guilt-free.\n\n**2. Emotion Labeling**\nNeuroscience research (Lieberman et al., UCLA) shows that simply naming an emotion ("I feel anxious") activates the prefrontal cortex and reduces amygdala activation — literally calming the emotional response. Before opening a shopping app, name what you're feeling.\n\n**3. The Functional Alternative**\nFor each emotional spending trigger, identify a non-spending mood regulation alternative. Boredom → a playlist of podcasts saved for that moment. Anxiety → a 10-minute walk. The alternative needs to be pre-planned; you cannot think of it in the moment.\n\n**4. Friction Engineering**\nDeliberately increase the difficulty of unplanned online spending. Delete saved payment methods. Remove shopping apps from your home screen. Turn off one-click purchasing. Each additional step gives System 2 time to engage.`,
        ],
      },
      files: [
        { name: 'Emotional Spending Audit — 30-Day Log.pdf', size: '1.0 MB', type: 'worksheet', description: 'Track your emotional state before each purchase for one month to identify your personal triggers' },
        { name: 'Functional Alternatives Menu.pdf', size: '0.6 MB', type: 'template', description: 'A pre-built menu of mood-regulation alternatives organized by emotion type' },
      ],
      quiz: [
        {
          id: 'm2q1',
          question: 'According to the mood-repair hypothesis, how long does the emotional relief from a shopping purchase typically last?',
          options: ['Several hours — enough to meaningfully improve mood', 'About 24 minutes on average, before mood returns to baseline or drops lower', 'Until the item arrives (for online purchases)', 'The relief is permanent — purchases genuinely solve emotional problems'],
          correct: 1,
          explanation: 'Research by Atalay and Meloy shows the mood-lifting effect of shopping is real but temporary — averaging about 24 minutes — often followed by post-purchase guilt that worsens the original emotional state.',
        },
        {
          id: 'm2q2',
          question: 'Which emotional state has been shown to make people pay up to 300% more for the same item?',
          options: ['Excitement — because it reduces price sensitivity', 'Anxiety — because people seek comfort regardless of cost', 'Sadness — because sad people overvalue material goods as compensation', 'Boredom — because novelty becomes extremely appealing'],
          correct: 2,
          explanation: 'Research by Cryder et al. found that sadness specifically triggers a "misery is not miserly" effect — sad participants were willing to pay up to 300% more for identical items compared to neutral-state participants, as a form of emotional self-compensation.',
        },
        {
          id: 'm2q3',
          question: 'The "72-hour rule" works primarily because of which psychological mechanism?',
          options: ['It gives you time to research better prices elsewhere', 'Desire intensity for impulse items drops 40–60% over 72 hours naturally', 'It allows emotions to fully resolve before making the decision', 'It triggers guilt that prevents the purchase'],
          correct: 1,
          explanation: 'The 72-hour rule exploits the natural decay of desire. Research shows that for impulse-driven purchase intent, the emotional urgency that drives the desire drops 40–60% within 72 hours. Items that survive that window are far more likely to be genuine preferences rather than emotional reactions.',
        },
      ],
    },
    {
      slug: 'the-marketing-machine',
      moduleIndex: 2,
      keyTakeaways: [
        'Modern marketing is a sophisticated behavioral engineering system',
        'Scarcity and social proof are the most powerful buying triggers known to psychology',
        'FOMO-based marketing artificially activates the brain\'s threat-detection system',
        'Knowing the techniques doesn\'t fully immunize you — but awareness reduces susceptibility by ~30%',
      ],
      video: {
        title: 'The Marketing Machine: How Brands Hack Your Decisions',
        duration: '24:08',
        description: 'An insider look at the behavioral psychology techniques used by the world\'s largest brands to drive purchases. From Cialdini\'s six principles of influence to neuromarketing strategies used in retail environments, this module makes the invisible visible.',
        chapters: [
          { time: '0:00', title: 'Introduction — The $600B persuasion industry' },
          { time: '3:45', title: 'Cialdini\'s six principles applied to modern marketing' },
          { time: '10:20', title: 'Scarcity, urgency, and artificial FOMO' },
          { time: '16:00', title: 'Neuromarketing — store layouts, colors, smells' },
          { time: '20:30', title: 'Digital dark patterns and subscription traps' },
        ],
      },
      reading: {
        title: 'Decoding the Persuasion Machine',
        readTime: '10 min read',
        content: [
          `## The $600 Billion Persuasion Industry\n\nThe global marketing industry spends approximately $600 billion annually on advertising and persuasion. A significant portion of this investment funds research into how human psychology can be leveraged to drive purchase decisions. You are the target of a multi-billion-dollar behavioral engineering effort every single day.`,
          `## Cialdini's Six Principles — In Every Ad You See\n\nRobert Cialdini's research on influence identified six universal principles exploited by marketers:\n\n**Scarcity**: "Only 3 left in stock." "Offer ends tonight." Scarcity activates the brain's threat-detection system — we're wired to fear missing resources. The manufactured scarcity of digital goods (there are infinite copies) is perhaps the most psychologically dishonest practice in modern marketing.\n\n**Social Proof**: Star ratings, "X people are viewing this right now," best-seller badges. The brain uses social information as a cognitive shortcut: if others chose it, it must be good.\n\n**Authority**: "Doctor-recommended." "Award-winning." We're wired to defer to authority — so brands manufacture it.\n\n**Reciprocity**: Free samples, trials, and gifts trigger an obligation to return the favor. This is why "free" almost never is.\n\n**Commitment/Consistency**: Once you've added something to a cart, started a free trial, or publicly stated interest, psychological pressure builds to follow through.\n\n**Liking**: Attractive spokespeople, relatable brand voices, user-generated content. We buy from people and brands we like.`,
          `## Digital Dark Patterns\n\nBeyond traditional influence, digital platforms have engineered a new category of manipulative design:\n\n- **Roach motel**: Easy to sign up, deliberately difficult to cancel\n- **Confirmshaming**: "No thanks, I don't want to save money" as the opt-out\n- **Hidden costs**: Fees revealed only at checkout after emotional investment in the purchase\n- **Forced continuity**: Free trial silently converts to paid subscription\n- **Disguised ads**: Paid results styled identically to organic content\n\nThe EU's Digital Services Act (2024) has begun regulating the worst of these, but most remain legal and common.`,
        ],
      },
      files: [
        { name: 'Marketing Bias Spotter — Field Guide.pdf', size: '1.4 MB', type: 'pdf', description: 'A visual reference guide to identifying 22 common marketing manipulation techniques in the wild' },
        { name: 'Pre-Purchase Checklist.pdf', size: '0.4 MB', type: 'template', description: 'A quick checklist to run before any non-planned purchase to identify manipulation at play' },
      ],
      quiz: [
        {
          id: 'm3q1',
          question: 'A website shows "Only 2 left!" for a digital product that has unlimited copies. This is an example of which influence principle?',
          options: ['Authority — implying the product is so good it almost ran out', 'Social Proof — showing that many others have already purchased', 'Manufactured Scarcity — creating artificial urgency to trigger fear-of-missing-out', 'Reciprocity — the brand is "giving" you a warning as a gift'],
          correct: 2,
          explanation: 'Digital scarcity is nearly always manufactured. Unlike physical goods, digital products have zero marginal reproduction cost — there is no genuine "only 2 left." The scarcity claim artificially triggers the brain\'s resource-threat response, which evolved for genuinely scarce physical resources.',
        },
        {
          id: 'm3q2',
          question: 'The "roach motel" dark pattern refers to which UX design practice?',
          options: ['Making checkout pages extremely fast and frictionless to increase conversion', 'Designing sign-up as easy while making cancellation deliberately confusing and difficult', 'Hiding subscription costs until after the user has completed the checkout process', 'Using dark color schemes to make pricing less visible to users'],
          correct: 1,
          explanation: 'The roach motel (you can check in but you can\'t check out) describes intentionally asymmetric friction: sign-up takes 30 seconds, cancellation requires calling a phone number during business hours, navigating 5 pages of retention offers, and talking to a specialist trained to prevent cancellations.',
        },
        {
          id: 'm3q3',
          question: 'Research on the "inoculation effect" in marketing literacy shows that knowing about manipulation techniques:',
          options: ['Fully immunizes people — once you know a trick it stops working entirely', 'Has no measurable effect — awareness doesn\'t change behavior', 'Reduces susceptibility by approximately 30%, but does not eliminate it', 'Increases susceptibility by making people overconfident in their resistance'],
          correct: 2,
          explanation: 'Marketing literacy research shows awareness reduces (not eliminates) susceptibility. Techniques like scarcity and social proof operate partly through automatic System 1 processes that even experts experience. The value of awareness is creating a pause that allows System 2 to evaluate — reducing effectiveness by roughly 30%.',
        },
      ],
    },
    {
      slug: 'framing-and-anchoring',
      moduleIndex: 3,
      keyTakeaways: [
        'The same information presented differently produces different decisions — this is framing',
        'Anchoring makes the first number you see disproportionately influential on all subsequent judgments',
        'Price presentation (per day vs per year, before vs after discount) exploits these effects systematically',
        'Reference prices are the most powerful anchoring tool in retail',
      ],
      video: {
        title: 'Framing & Anchoring: Why the Same $100 Feels Completely Different',
        duration: '19:55',
        description: 'This module reveals how the presentation of financial information — not just the information itself — determines decisions. You\'ll see documented experiments showing identical outcomes producing opposite choices based purely on framing, and learn to recognize when anchoring is being used against you.',
        chapters: [
          { time: '0:00', title: 'The Asian Disease Problem — same outcome, opposite choices' },
          { time: '4:50', title: 'Gain vs loss framing in financial products' },
          { time: '9:30', title: 'Anchoring — the first number wins' },
          { time: '14:10', title: 'Reference prices and the myth of "was $200, now $80"' },
          { time: '17:45', title: 'De-anchoring techniques you can use immediately' },
        ],
      },
      reading: {
        title: 'How Presentation Hijacks Your Financial Judgment',
        readTime: '7 min read',
        content: [
          `## The Same Choice, Opposite Decisions\n\nIn a famous experiment by Kahneman and Tversky, participants were asked to choose between two public health programs to address a disease expected to kill 600 people:\n\n**Version A**: "Program A saves 200 lives. Program B has a 1/3 probability of saving all 600 lives and 2/3 probability of saving none."\n\nResult: 72% chose Program A (the certain option).\n\n**Version B**: "Program C means 400 people will die. Program D has a 1/3 probability that nobody will die and 2/3 probability that all 600 will die."\n\nResult: 78% chose Program D (the risky option).\n\nBut Programs A and C are mathematically identical. As are Programs B and D. The framing (gains vs losses) completely reversed the preference.`,
          `## Anchoring: The First Number Wins\n\nAnchoring is the cognitive bias where the first piece of numerical information encountered (the "anchor") disproportionately influences all subsequent judgments, even when the anchor is arbitrary or irrelevant.\n\n**Classic demonstration**: Dan Ariely's research at MIT had students write down the last two digits of their Social Security Number, then bid on items in an auction. Students with high SSN endings (80–99) bid 216–346% more than those with low endings (00–19). A random, irrelevant number shaped how much money they were willing to pay for actual goods.\n\n**In retail**: "Was $299, now $99" uses $299 as an anchor. Whether that original price was ever real (it often wasn't), your brain uses it as a reference point, making $99 feel like a bargain rather than evaluating whether $99 is a good price on its own merits.`,
          `## De-Anchoring Strategies\n\nTo protect yourself from anchoring:\n\n1. **Evaluate absolute price, not relative discount.** Ask: "Is $99 a fair price for what this is?" — not "Is 67% off a good deal?"\n2. **Generate your own anchor first.** Before seeing a price, ask yourself what you'd pay. Write it down. This creates a competing anchor.\n3. **Ignore reference prices.** They are frequently fabricated. The FTC has documented countless retailers inflating "original" prices to create false anchors.\n4. **Compare to alternatives, not the anchor.** What does a comparable product cost elsewhere? That is your real reference point.`,
        ],
      },
      files: [
        { name: 'Framing Effects — Real-World Examples.pdf', size: '1.1 MB', type: 'pdf', description: '25 documented real-world examples of framing effects in financial products, insurance, and retail' },
        { name: 'De-Anchoring Shopping Protocol.pdf', size: '0.5 MB', type: 'template', description: 'A step-by-step protocol to apply before any significant purchase decision' },
      ],
      quiz: [
        {
          id: 'm4q1',
          question: 'In Kahneman and Tversky\'s framing experiment, participants showed opposite preferences for mathematically identical outcomes based on:',
          options: ['The complexity of the probability calculations involved', 'Whether the outcomes were framed in terms of lives saved versus lives lost', 'The order in which the options were presented', 'The authority of the institution presenting the choices'],
          correct: 1,
          explanation: 'The key variable was framing: "saves 200 lives" (gain frame) vs "400 people will die" (loss frame). Because of loss aversion, identical outcomes produce opposite risk preferences depending on whether they\'re framed as gains or losses.',
        },
        {
          id: 'm4q2',
          question: 'Dan Ariely\'s Social Security Number auction experiment demonstrated that:',
          options: ['People with higher SSNs are wealthier and bid more', 'Completely arbitrary numbers can serve as financial anchors and significantly influence willingness to pay', 'The auction format itself was the primary driver of bidding behavior', 'SSNs correlate with geographic regions that have different price expectations'],
          correct: 1,
          explanation: 'Ariely\'s experiment is among the clearest demonstrations of anchoring\'s power: an entirely arbitrary, irrelevant number (SSN ending) influenced real bids by 216–346%. The first number in view becomes an anchor regardless of its relevance.',
        },
        {
          id: 'm4q3',
          question: 'The most effective de-anchoring strategy before evaluating a discounted price is:',
          options: ['Calculating the percentage discount to verify the deal\'s quality', 'Generating your own price estimate before seeing the listed price', 'Asking a friend what they would pay for the same item', 'Checking the price history to see if the original price was ever charged'],
          correct: 1,
          explanation: 'Creating your own anchor before seeing the seller\'s price is the most effective counter — you give your brain a competing reference point. Checking price history is also valuable (answer D), but the anchor you generate yourself before exposure is the strongest defense against the seller\'s anchor.',
        },
      ],
    },
    {
      slug: 'delaying-gratification',
      moduleIndex: 4,
      keyTakeaways: [
        'Delayed gratification is a trainable skill, not a fixed personality trait',
        'The Marshmallow Test results were overstated — environment matters more than willpower',
        'Temporal discounting (the bias that makes future rewards feel smaller) can be reduced with specific techniques',
        '"Implementation intentions" (if-then planning) are 2-3x more effective than goal-setting alone',
      ],
      video: {
        title: 'Delaying Gratification: The Science of Patience with Money',
        duration: '22:30',
        description: 'The Marshmallow Test told half the story. This module examines what we now know about delayed gratification — including the massive role of environment, trust, and resource scarcity in determining whether people wait for larger rewards. You\'ll leave with practical techniques to strengthen your temporal patience.',
        chapters: [
          { time: '0:00', title: 'The Marshmallow Test — what it really showed' },
          { time: '5:20', title: 'Temporal discounting — why $100 today beats $150 in a year' },
          { time: '11:00', title: 'Environment over willpower — the Watts study' },
          { time: '16:30', title: 'Implementation intentions — if-then planning' },
          { time: '19:50', title: 'Precommitment devices — locking your future self in' },
        ],
      },
      reading: {
        title: 'Beyond Willpower: Building Real Financial Patience',
        readTime: '8 min read',
        content: [
          `## The Marshmallow Test Revisited\n\nWalter Mischel's famous 1960s Marshmallow Test showed that children who could wait 15 minutes for two marshmallows instead of eating one immediately had better life outcomes decades later. This was widely interpreted as evidence that willpower is the key to financial success.\n\nBut a 2018 replication by Tyler Watts at NYU with 900 children (10x the original sample) told a more nuanced story: once socioeconomic background was controlled for, the predictive power of the Marshmallow Test nearly disappeared. Children from resource-scarce environments had learned — rationally — that waiting for future rewards is unreliable. Their "impatience" was a perfectly calibrated response to an unreliable world.`,
          `## Temporal Discounting\n\nTemporal discounting is the well-documented tendency to value present rewards more than future ones — and to discount that future reward more steeply the nearer it is to the present. This is why "I'll start saving next month" feels reasonable while "I'll start saving in 10 years" sounds absurd — the near future triggers the same immediate-reward circuitry as the present.\n\nKey insight: **temporal discounting is not a personality flaw — it's a universal human bias with evolutionary roots.** An uncertain future reward was genuinely worth less to our ancestors than a certain present one. The challenge is that modern financial systems require us to act against this bias consistently.`,
          `## What Actually Works\n\n**Implementation Intentions**: Research by Peter Gollwitzer shows that "if-then" planning (rather than simple goal-setting) increases goal achievement by 200–300%. Not "I'll save more money" but "If I receive any payment over $500, then I will immediately transfer 20% to my savings account before doing anything else."\n\n**Precommitment Devices**: Instruments that reduce your future-self's ability to choose immediate gratification. Shlomo Benartzi and Richard Thaler's Save More Tomorrow (SMarT) program increased savings rates by 300% by having employees pre-commit to directing future pay raises to savings — rather than reducing current income.\n\n**Temporal Self-Continuity**: Research shows that people save more when they feel more connected to their future self. Viewing age-progressed photos of yourself increases savings behavior. Writing letters to your future self has a similar effect. The mechanism: the future self becomes more "real" and therefore more worth protecting.`,
        ],
      },
      files: [
        { name: 'Implementation Intentions Worksheet.pdf', size: '0.9 MB', type: 'worksheet', description: 'Convert your financial goals into if-then format with this structured template' },
        { name: 'Precommitment Strategy Guide.pdf', size: '1.2 MB', type: 'pdf', description: 'A comprehensive guide to precommitment devices available in your country' },
        { name: 'Module 5 Reflection Audio.mp3', size: '8.4 MB', type: 'audio', description: '12-minute guided reflection exercise on your relationship with future rewards' },
      ],
      quiz: [
        {
          id: 'm5q1',
          question: 'The 2018 replication of the Marshmallow Test (Watts et al.) showed that when socioeconomic background is controlled for, the original results:',
          options: ['Were fully replicated — willpower is equally predictive across all backgrounds', 'Were reversed — poorer children actually showed stronger delayed gratification', 'Lost most of their predictive power — environment matters more than individual willpower', 'Were strengthened — the effect was larger in a more diverse sample'],
          correct: 2,
          explanation: 'The Watts replication showed the Marshmallow Test primarily measured the reliability of adult promises and resource availability in children\'s environments — not innate willpower. Children from unstable environments rationally learned that future rewards are uncertain, making eating the marshmallow now a logical choice.',
        },
        {
          id: 'm5q2',
          question: 'Gollwitzer\'s research on implementation intentions shows they are approximately how much more effective than simple goal-setting?',
          options: ['10–20% more effective', '50% more effective', '200–300% more effective', 'Equally effective — the format of goal-setting doesn\'t matter'],
          correct: 2,
          explanation: 'Peter Gollwitzer\'s meta-analysis of 94 studies found that forming specific if-then implementation intentions (rather than "I will X" goal intentions) increased goal achievement by 200–300%. The specificity activates automatic responses to situational cues, bypassing the need for deliberate decision-making.',
        },
        {
          id: 'm5q3',
          question: 'The Save More Tomorrow (SMarT) program increased savings rates by approximately 300% through which mechanism?',
          options: ['Providing financial education about the importance of compound interest', 'Automatically increasing savings by small fixed amounts each month', 'Having employees pre-commit to directing future pay raises to savings before receiving them', 'Matching employee contributions to create stronger financial incentives'],
          correct: 2,
          explanation: 'SMarT exploited temporal discounting and loss aversion together: future pay raises feel less "real" than current income, so committing them to savings feels less painful. Participants pre-committed to future behavior when the psychological cost was lower — and the automatic implementation removed the moment-of-decision friction.',
        },
      ],
    },
    {
      slug: 'building-better-habits',
      moduleIndex: 5,
      keyTakeaways: [
        'Habits are neural loops: cue → routine → reward. Change the routine, keep the cue and reward.',
        'Behavior design (making good behaviors easier) outperforms motivation every time',
        'Identity-based habits ("I am someone who...") are more durable than outcome-based goals',
        'Tiny habits compounded over time create larger financial changes than occasional large efforts',
      ],
      video: {
        title: 'Building Better Financial Habits: Systems Over Willpower',
        duration: '20:18',
        description: 'The final module synthesizes everything you\'ve learned into a practical habit-building framework. Drawing on Charles Duhigg\'s habit loop, BJ Fogg\'s Tiny Habits method, and James Clear\'s identity-based habits, you\'ll leave with a concrete 30-day plan to rewire your relationship with money.',
        chapters: [
          { time: '0:00', title: 'Why good intentions alone always fail' },
          { time: '3:30', title: 'The habit loop — cue, routine, reward' },
          { time: '8:45', title: 'BJ Fogg\'s Tiny Habits method applied to finance' },
          { time: '13:20', title: 'Identity-based habits — becoming the person who...' },
          { time: '17:00', title: 'Your 30-day financial rewiring plan' },
        ],
      },
      reading: {
        title: 'From Knowledge to Action: Building Financial Habits That Stick',
        readTime: '9 min read',
        content: [
          `## The Implementation Gap\n\nYou now understand the neuroscience of financial decisions, the psychology of emotional spending, how marketing manipulates you, and how framing and anchoring distort your judgment. Knowledge is necessary — but not sufficient. The gap between knowing and doing is where most financial education fails.\n\nThis final module is about closing that gap permanently.`,
          `## The Habit Loop\n\nCharles Duhigg's research identifies every habit as a three-part loop:\n\n**Cue**: The trigger that initiates the behavior (a time, place, emotional state, or preceding action)\n**Routine**: The behavior itself\n**Reward**: The satisfying outcome that tells the brain to remember and repeat this loop\n\nHabit change is most effective when you keep the cue and reward while substituting the routine. If you habitually spend money online when bored at night (cue: evening boredom; reward: novelty stimulation), replacing the spending routine with something equally stimulating (watching a specific YouTube channel, playing a game, calling a friend) is far more effective than trying to eliminate the cue or deny yourself the reward.`,
          `## Tiny Habits — BJ Fogg's Method\n\nStanford behavior scientist BJ Fogg's research shows that motivation is the wrong lever for behavior change — it's unreliable. The right lever is **ease**. Behaviors that are easy get done; behaviors that require effort don't.\n\nFogg's Tiny Habits method:\n1. **Anchor**: Identify an existing behavior you already do reliably (make coffee, open your phone, sit at your desk)\n2. **Tiny new behavior**: Attach a tiny version of the desired habit immediately after (open budget app and look at one number, transfer $1 to savings, review one receipt)\n3. **Celebration**: Immediately celebrate the tiny habit (say "I'm building wealth!" aloud — this is not silly; it creates a reward signal)\n\nThe goal is to make the habit automatic. Once it's automatic, you scale it up.`,
          `## Identity-Based Habits\n\nJames Clear's research shows that the most durable behavior changes come from identity shifts, not goal-setting. "I want to save more money" (outcome-based) versus "I am someone who pays themselves first" (identity-based) produce different neural relationships with the behavior.\n\nEvery time you make a savings transfer, you cast a vote for the identity "I am financially responsible." Every time you use the 72-hour rule, you cast a vote for "I am someone who spends intentionally." Identity is built from accumulated evidence of your own behavior — which means small, consistent actions matter more than occasional large efforts.\n\n**Your assignment**: Write down the identity statement that would make everything you've learned in this course automatic. What kind of person do you want to be with money? Then design your next week to cast 5 votes for that identity.`,
        ],
      },
      files: [
        { name: '30-Day Financial Habit Rewiring Plan.pdf', size: '1.8 MB', type: 'worksheet', description: 'A day-by-day structured plan to implement everything from this course into your daily life' },
        { name: 'Habit Loop Audit Worksheet.pdf', size: '0.7 MB', type: 'worksheet', description: 'Map your current financial habits to identify cues, routines, and rewards to modify' },
        { name: 'Identity Statement Builder.pdf', size: '0.5 MB', type: 'template', description: 'A structured template to write and anchor your new financial identity' },
        { name: 'Course Completion — Reflection Prompts.pdf', size: '0.6 MB', type: 'pdf', description: 'Deep reflection questions to synthesize your learning across all 6 modules' },
      ],
      quiz: [
        {
          id: 'm6q1',
          question: 'When trying to change an existing habit using the habit loop framework, which approach is most effective?',
          options: ['Eliminate the cue entirely so the habit never gets triggered', 'Replace the routine while keeping the same cue and reward', 'Change the reward to make the old behavior less satisfying', 'Increase motivation through goal-setting to overpower the existing habit'],
          correct: 1,
          explanation: 'Duhigg\'s research shows cues and rewards are deeply ingrained and very difficult to eliminate. The most effective strategy is routine substitution: identify the cue and reward, then replace the routine with one that delivers the same (or better) reward. Fighting the cue or reward directly rarely works long-term.',
        },
        {
          id: 'm6q2',
          question: 'According to BJ Fogg\'s Tiny Habits research, the primary lever for sustainable behavior change is:',
          options: ['Motivation — you need to want the behavior strongly enough', 'Accountability — sharing your goals with others', 'Ease — making the desired behavior as effortless as possible', 'Frequency — doing the behavior many times quickly to build the habit'],
          correct: 2,
          explanation: 'Fogg\'s core finding is that motivation is unreliable and cannot be sustained. The real lever is ease (what he calls "ability" in his Fogg Behavior Model). If you make a behavior tiny and easy enough, motivation becomes almost irrelevant — the behavior happens automatically regardless of how you feel.',
        },
        {
          id: 'm6q3',
          question: 'Identity-based habits ("I am someone who...") are more durable than outcome-based goals ("I want to...") because:',
          options: ['Identity statements are easier to remember than specific outcome goals', 'Each action becomes a vote for the identity, creating intrinsic reinforcement rather than external pressure', 'Outcomes are uncertain, while identity is within your control', 'Psychologists have found identity to be more motivating than outcomes for all people'],
          correct: 1,
          explanation: 'The power of identity-based habits is the feedback loop: every time you act consistently with the identity, you accumulate evidence that the identity is true — reinforcing the behavior intrinsically. Outcome-based goals create anxiety when progress is slow and provide no intrinsic reinforcement for each individual action.',
        },
      ],
    },
  ],
};
