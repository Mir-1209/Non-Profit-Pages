export interface Course {
  slug: string;
  title: string;
  tag: string;
  level: string;
  duration: string;
  modules: { title: string; description: string }[];
  instructors: { name: string; title: string; avatarId: number }[];
  color: 't1' | 't2' | 't3';
}

export const courses: Course[] = [
  {
    slug: "psychology-of-spending",
    title: "The Psychology of Spending",
    tag: "Foundations",
    level: "Beginner",
    duration: "6 Modules",
    color: "t1",
    modules: [
      { title: "Module 1: The Brain on Money", description: "Understand how cognitive biases shape our financial decisions." },
      { title: "Module 2: Emotional Spending", description: "Identify triggers that lead to unplanned purchases." },
      { title: "Module 3: The Marketing Machine", description: "Decode the behavioral tactics used by brands." },
      { title: "Module 4: Framing and Anchoring", description: "How the presentation of prices affects your perception." },
      { title: "Module 5: Delaying Gratification", description: "Strategies to build patience and long-term thinking." },
      { title: "Module 6: Building Better Habits", description: "Practical frameworks to rewire your daily spending." }
    ],
    instructors: [
      { name: "Dr. Elena Rostova", title: "Behavioral Economist", avatarId: 1 },
      { name: "Marcus Chen", title: "Financial Educator", avatarId: 2 }
    ]
  },
  {
    slug: "decisions-under-scarcity",
    title: "Decisions Under Scarcity",
    tag: "Behavioral Econ",
    level: "Intermediate",
    duration: "8 Modules",
    color: "t2",
    modules: [
      { title: "Module 1: The Scarcity Mindset", description: "How lack of resources fundamentally changes cognition." },
      { title: "Module 2: Tunneling and Bandwidth", description: "The hidden tax that scarcity places on mental capacity." },
      { title: "Module 3: Short-Term Survival", description: "Why humans default to immediate rewards under stress." },
      { title: "Module 4: The Poverty Penalty", description: "Structural barriers that make being poor expensive." },
      { title: "Module 5: Decision Fatigue", description: "Managing choices when every dollar counts." },
      { title: "Module 6: Escaping the Trap", description: "Systemic and individual approaches to breaking the cycle." },
      { title: "Module 7: Community Interventions", description: "How social support mitigates scarcity effects." },
      { title: "Module 8: Policy and Advocacy", description: "Advocating for structural changes in financial systems." }
    ],
    instructors: [
      { name: "Sarah Jenkins", title: "Policy Advocate", avatarId: 3 },
      { name: "Dr. Ahmed Tariq", title: "Sociologist", avatarId: 4 }
    ]
  },
  {
    slug: "building-systems",
    title: "Building Systems, Not Budgets",
    tag: "Applied Finance",
    level: "All Levels",
    duration: "5 Modules",
    color: "t3",
    modules: [
      { title: "Module 1: The Flaw of Willpower", description: "Why traditional budgeting fails 80% of the time." },
      { title: "Module 2: Automation First", description: "Setting up invisible systems that do the work for you." },
      { title: "Module 3: Value-Based Allocation", description: "Aligning your spending with what actually matters to you." },
      { title: "Module 4: The 50/30/20 Myth", description: "Adapting standard rules to real-world, irregular incomes." },
      { title: "Module 5: Maintenance and Review", description: "How to tune your system without obsessing over it." }
    ],
    instructors: [
      { name: "David Osei", title: "Financial Architect", avatarId: 5 }
    ]
  },
  {
    slug: "money-and-power",
    title: "Money & Power Dynamics",
    tag: "Advanced Theory",
    level: "Advanced",
    duration: "7 Modules",
    color: "t1",
    modules: [
      { title: "Module 1: Historical Context", description: "The origins of modern financial institutions and power." },
      { title: "Module 2: Wealth Concentration", description: "Mechanisms that accelerate the wealth gap." },
      { title: "Module 3: Debt as Leverage", description: "Understanding how debt functions at a systemic level." },
      { title: "Module 4: Institutional Gatekeeping", description: "Barriers to access in traditional banking and finance." },
      { title: "Module 5: Financial Imperialism", description: "Global dynamics of currency, trade, and economic influence." },
      { title: "Module 6: Decentralized Alternatives", description: "Exploring new models for distributed financial power." },
      { title: "Module 7: Activism and Capital", description: "Using financial knowledge to drive social change." }
    ],
    instructors: [
      { name: "Prof. Maria Santos", title: "Economic Historian", avatarId: 6 },
      { name: "James Wright", title: "Systems Analyst", avatarId: 7 }
    ]
  },
  {
    slug: "investing-for-impact",
    title: "Investing for Impact",
    tag: "Investments",
    level: "Intermediate",
    duration: "6 Modules",
    color: "t2",
    modules: [
      { title: "Module 1: Beyond Returns", description: "Defining impact and understanding ESG frameworks." },
      { title: "Module 2: The Divestment Movement", description: "The history and power of moving capital away from harm." },
      { title: "Module 3: Community Investing", description: "Directing funds into local, underserved ecosystems." },
      { title: "Module 4: Shareholder Activism", description: "Using your investments to force corporate accountability." },
      { title: "Module 5: Greenwashing", description: "How to spot fake impact and identify genuine sustainability." },
      { title: "Module 6: Building an Impact Portfolio", description: "Practical steps to align your investments with your values." }
    ],
    instructors: [
      { name: "Chloe Bennett", title: "Impact Investor", avatarId: 8 }
    ]
  },
  {
    slug: "financial-identity",
    title: "Financial Identity",
    tag: "Mindset",
    level: "Beginner",
    duration: "4 Modules",
    color: "t3",
    modules: [
      { title: "Module 1: Money Scripts", description: "Uncovering the unconscious beliefs you hold about wealth." },
      { title: "Module 2: Generational Trauma", description: "How family history shapes your current financial reality." },
      { title: "Module 3: Social Comparison", description: "Navigating peer pressure and lifestyle inflation." },
      { title: "Module 4: Rewriting Your Story", description: "Crafting a new, empowering narrative around your finances." }
    ],
    instructors: [
      { name: "Dr. Maya Lin", title: "Financial Psychologist", avatarId: 9 },
      { name: "Jamal Thompson", title: "Coach & Counselor", avatarId: 10 }
    ]
  }
];
