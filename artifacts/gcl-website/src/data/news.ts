export interface NewsPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  fullContent: string[];
  author: string;
  authorTitle: string;
  date: string;
  readTime: string;
  category: 'Research' | 'Update' | 'Story' | 'Announcement';
  published: boolean;
  imageBg: string;
  imageLabel: string;
  tags: string[];
}

export const newsPosts: NewsPost[] = [
  {
    id: "n1",
    title: "GCL Launches Youth Finance Pilot in East Africa",
    excerpt: "A new 6-month pilot program is bringing behavioral finance education to 1,200 youth in Kenya, Tanzania, and Uganda.",
    content: "Global Capital League is expanding its footprint across East Africa with a landmark 6-month pilot program targeting youth aged 16–24 across Kenya, Tanzania, and Uganda.",
    fullContent: [
      "Global Capital League is expanding its footprint across East Africa with a landmark 6-month pilot program targeting youth aged 16–24 across Kenya, Tanzania, and Uganda. The pilot, backed by local NGO partners, will deploy GCL's flagship behavioral economics curriculum in 18 community centers across the three countries.",
      "The program targets young people with limited or no access to formal financial services — a demographic that makes up over 60% of East Africa's population under 25. Rather than teaching traditional budgeting rules, GCL's curriculum focuses on the cognitive and emotional drivers of financial decisions: how scarcity changes thinking, why emotional spending is rational under certain conditions, and how to design behavioral systems that don't rely on willpower.",
      "Community partners in each country have worked with GCL to adapt the curriculum to local economic contexts. In Tanzania, the program includes a module on informal savings groups (known locally as Upatu) and how to formalize them. In Uganda, there's a specific focus on mobile money systems and the behavioral traps associated with frictionless digital payments.",
      "\"Financial education that ignores culture and context doesn't work,\" said Marcus Chen, GCL's Executive Director. \"This pilot is built on the principle that communities understand their own financial realities better than any outside expert. Our job is to bring the science and let the community bring the wisdom.\"",
      "The pilot will be independently evaluated by the University of Nairobi's behavioral economics research unit, with results expected in early 2027.",
    ],
    author: "GCL Editorial Team",
    authorTitle: "Global Capital League",
    date: "June 28, 2026",
    readTime: "4 min read",
    imageBg: "linear-gradient(135deg, #1a3a2a 0%, #0f2518 100%)",
    imageLabel: "East Africa Youth Finance Pilot",
    tags: ["Africa", "Youth", "Pilot", "Expansion"],
    category: "Announcement",
    published: true,
  },
  {
    id: "n2",
    title: "New Research: Behavioral Interventions Cut Impulsive Spending by 38%",
    excerpt: "Our latest field study across 4 countries shows GCL-trained youth demonstrate significantly lower impulsive purchase rates.",
    content: "A peer-reviewed study conducted in partnership with three universities has confirmed what GCL has observed in the field for years.",
    fullContent: [
      "A peer-reviewed study conducted in partnership with three universities has confirmed what GCL has observed in the field for years: targeted behavioral economics education significantly reduces impulsive financial decisions among young adults.",
      "The study tracked 840 participants across Colombia, Ghana, Indonesia, and Poland over 12 months. Half received GCL's behavioral economics curriculum; the control group received conventional financial literacy education covering budgeting, saving ratios, and debt management.",
      "At 6 months, both groups showed similar improvements in stated financial knowledge. But at 12 months, the picture diverged dramatically. The behavioral economics group showed a 38% reduction in self-reported impulsive purchases, compared to 11% in the control group. More significantly, the behavioral group showed a 44% increase in pre-commitment savings behavior — automatically routing money before it could be spent — compared to 8% in the control group.",
      "\"The difference is in the mechanism,\" said Dr. Elena Rostova, lead researcher on the study. \"Conventional financial education treats behavior as a knowledge problem: if you know you should save 20%, you will. But decades of behavioral research shows that knowing and doing are governed by completely different neural systems. We work on the doing.\"",
      "The study has been accepted for publication in the Journal of Behavioral Decision Making. GCL is making the full methodology available open-source for other organizations to replicate.",
    ],
    author: "Dr. Elena Rostova",
    authorTitle: "Behavioral Economist, Oxford University",
    date: "June 15, 2026",
    readTime: "6 min read",
    imageBg: "linear-gradient(135deg, #1a1a3a 0%, #0a0a2a 100%)",
    imageLabel: "Research: Behavioral Intervention Study",
    tags: ["Research", "Behavioral Economics", "Impact", "Study"],
    category: "Research",
    published: true,
  },
  {
    id: "n3",
    title: "Meet the 2026 GCL Youth Champions",
    excerpt: "These 12 young people trained by GCL are now teaching financial literacy in their own communities.",
    content: "Every year, GCL selects a cohort of exceptional youth graduates who demonstrate leadership, initiative, and a passion for community impact.",
    fullContent: [
      "Every year, GCL selects a cohort of exceptional youth graduates who demonstrate leadership, initiative, and a passion for community impact. This year's 12 Youth Champions come from 9 different countries and are already running their own micro-programs, reaching hundreds of peers.",
      "Amara Diallo, 22, from Senegal, has trained 140 young women in Dakar's Medina district on the psychology of savings, running weekly sessions in community centers on Saturday mornings — because that's when women are available before the afternoon market rush.",
      "Keziah Mwangi, 19, from Kenya, created a WhatsApp-based accountability group with 80 members who share weekly financial decisions and receive peer feedback. Keziah developed the framework herself, adapting GCL's pre-commitment module into a lightweight social system.",
      "Ricardo Alves, 21, from Brazil's favelas of São Paulo, has partnered with a local school to deliver GCL's curriculum as an after-school elective. He teaches the class himself, in Portuguese, having translated the materials. 'The kids understand every concept immediately because I grew up in the same financial reality they're living,' he says.",
      "The 2026 Youth Champions program includes a 3-month mentorship with GCL senior educators, a $500 micro-grant to support their community programs, and an invitation to represent GCL at the Global Systems Summit in September.",
    ],
    author: "Marcus Chen",
    authorTitle: "GCL Co-Founder & Executive Director",
    date: "May 30, 2026",
    readTime: "5 min read",
    imageBg: "linear-gradient(135deg, #2a1a10 0%, #1a0f08 100%)",
    imageLabel: "2026 GCL Youth Champions",
    tags: ["Youth", "Community", "Champions", "Stories"],
    category: "Story",
    published: true,
  },
  {
    id: "n4",
    title: "GCL Partners with 3 New Universities for Curriculum Development",
    excerpt: "University of Nairobi, UNAM Mexico, and University of Warsaw join GCL's academic network.",
    content: "GCL is proud to announce academic partnerships with three leading institutions to co-develop the next generation of behavioral finance curriculum.",
    fullContent: [
      "GCL is proud to announce academic partnerships with three leading institutions to co-develop the next generation of behavioral finance curriculum. These partnerships will bring academic rigor to GCL's community-driven approach and open pathways for formal credit recognition.",
      "The University of Nairobi partnership focuses on East African financial behavior, with a specific research program on mobile money psychology — how M-Pesa and similar platforms change spending behavior, savings rates, and susceptibility to scams among youth users.",
      "UNAM Mexico brings expertise in Latin American informal economies. Their research unit will collaborate on a dedicated curriculum module on the psychology of informal work — understanding financial decisions when income is irregular, unprotected, and often invisible to formal systems.",
      "The University of Warsaw partnership centers on behavioral economics in post-communist economies — a context with unique financial psychology shaped by historical experiences of currency collapse, state redistribution, and generational wealth trauma that is under-researched in the behavioral finance literature.",
      "All three partnerships include a credit recognition pathway: students who complete the full GCL curriculum alongside the university partner program can receive elective credit toward their degrees. This represents GCL's first formal bridge between community education and accredited university learning.",
    ],
    author: "GCL Editorial Team",
    authorTitle: "Global Capital League",
    date: "May 10, 2026",
    readTime: "4 min read",
    imageBg: "linear-gradient(135deg, #1a2a3a 0%, #0a1a2a 100%)",
    imageLabel: "University Partnership Announcement",
    tags: ["Partnerships", "Universities", "Academic", "Curriculum"],
    category: "Announcement",
    published: true,
  },
  {
    id: "n5",
    title: "Q1 2026 Impact Report: 8,000+ Youth Reached",
    excerpt: "Our quarterly update shows record-breaking reach, with workshops delivered in 14 countries across 5 continents.",
    content: "The first quarter of 2026 marks GCL's highest-ever impact numbers. With 8,000+ young people formally completing at least one GCL module.",
    fullContent: [
      "The first quarter of 2026 marks GCL's highest-ever impact numbers. With 8,000+ young people formally completing at least one GCL module, and 120+ workshops delivered globally, we are on track to exceed our annual targets by 40%.",
      "Q1 highlights by region: Sub-Saharan Africa (3,100 youth, 48 workshops), Latin America (2,200 youth, 31 workshops), Southeast Asia (1,400 youth, 22 workshops), Europe (900 youth, 14 workshops), and MENA (400 youth, 7 workshops). Workshop delivery in South Asia is set to begin in Q2 following the completion of curriculum localization for Hindi and Urdu.",
      "Completion rates — the percentage of enrolled youth who finish at least 75% of a course — reached 92% in Q1, up from 87% in Q4 2025. GCL attributes this to the introduction of mobile-optimized content (74% of learners access content via smartphone) and new peer accountability features in the platform.",
      "Financial behavior data from GCL's longitudinal tracking shows that graduates continue to demonstrate improved financial decision-making 12 months after completing the curriculum. Pre-commitment savings behavior is the most durable change: 68% of graduates maintain some form of automated saving at 12 months, versus 12% in matched control groups.",
      "The full Q1 2026 Impact Report is available for download from the GCL research portal.",
    ],
    author: "GCL Editorial Team",
    authorTitle: "Global Capital League",
    date: "April 12, 2026",
    readTime: "5 min read",
    imageBg: "linear-gradient(135deg, #1a2818 0%, #0f1a0f 100%)",
    imageLabel: "Q1 2026 Impact Data",
    tags: ["Impact Report", "Data", "Global Reach"],
    category: "Update",
    published: true,
  },
  {
    id: "n6",
    title: "Why Traditional Budgeting Fails Young People",
    excerpt: "A deep dive into the psychology behind why conventional personal finance advice doesn't stick for youth audiences.",
    content: "Most personal finance education teaches rules: the 50/30/20 budget, the emergency fund, the debt snowball. These rules assume stable income.",
    fullContent: [
      "Most personal finance education teaches rules: the 50/30/20 budget, the emergency fund, the debt snowball. These rules assume stable income, rational actors, and an absence of psychological pressure. For the young people GCL works with — many living in economic uncertainty — these assumptions collapse immediately.",
      "The 50/30/20 rule requires that you know what your income will be this month. For a gig worker in Nairobi or a seasonal agricultural laborer in Colombia, that knowledge doesn't exist. The rule fails before the first calculation.",
      "The emergency fund assumes surplus. 'Save 3-6 months of expenses' is advice that's only actionable once you've already solved the problem it's meant to solve. For someone living paycheck to paycheck, it is noise.",
      "And perhaps most insidiously, conventional financial advice is built on the assumption that better information produces better decisions. Research in behavioral economics has comprehensively disproved this. We know what we should do. We do something else. That gap is not an information gap — it is a behavioral gap, and it requires behavioral solutions.",
      "GCL's approach is built on a fundamentally different premise: that financial behavior is driven by psychology, not knowledge. Our curriculum doesn't teach people what to do — it helps them understand why they do what they do, and gives them the tools to design their own behavioral environments to make better decisions automatic.",
      "The evidence is accumulating. Behavioral interventions consistently outperform information-based financial education in longitudinal studies. The question is not whether the approach works — it's why it isn't yet the standard.",
    ],
    author: "Sarah Jenkins",
    authorTitle: "Research Director, GCL",
    date: "March 22, 2026",
    readTime: "7 min read",
    imageBg: "linear-gradient(135deg, #2a1a1a 0%, #1a0a0a 100%)",
    imageLabel: "Opinion: Rethinking Financial Education",
    tags: ["Research", "Opinion", "Behavioral Economics", "Education"],
    category: "Research",
    published: true,
  },
];
