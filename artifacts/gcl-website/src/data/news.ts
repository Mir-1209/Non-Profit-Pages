export interface NewsPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: 'Research' | 'Update' | 'Story' | 'Announcement';
  published: boolean;
  image?: string;
}

export const newsPosts: NewsPost[] = [
  {
    id: "n1",
    title: "GCL Launches Youth Finance Pilot in East Africa",
    excerpt: "A new 6-month pilot program is bringing behavioral finance education to 1,200 youth in Kenya, Tanzania, and Uganda.",
    content: "Global Capital League is expanding its footprint across East Africa with a landmark 6-month pilot program targeting youth aged 16–24 across Kenya, Tanzania, and Uganda. The pilot, backed by local NGO partners, will deploy GCL's flagship behavioral economics curriculum in 18 community centers.",
    author: "GCL Editorial Team",
    date: "June 28, 2026",
    category: "Announcement",
    published: true,
  },
  {
    id: "n2",
    title: "New Research: Behavioral Interventions Cut Impulsive Spending by 38%",
    excerpt: "Our latest field study across 4 countries shows GCL-trained youth demonstrate significantly lower impulsive purchase rates.",
    content: "A peer-reviewed study conducted in partnership with three universities has confirmed what GCL has observed in the field for years: targeted behavioral economics education significantly reduces impulsive financial decisions among young adults. The study tracked 840 participants across Colombia, Ghana, Indonesia, and Poland over 12 months.",
    author: "Dr. Elena Rostova",
    date: "June 15, 2026",
    category: "Research",
    published: true,
  },
  {
    id: "n3",
    title: "Meet the 2026 GCL Youth Champions",
    excerpt: "These 12 young people trained by GCL are now teaching financial literacy in their own communities.",
    content: "Every year, GCL selects a cohort of exceptional youth graduates who demonstrate leadership, initiative, and a passion for community impact. This year's 12 Youth Champions come from 9 different countries and are already running their own micro-programs, reaching hundreds of peers.",
    author: "Marcus Chen",
    date: "May 30, 2026",
    category: "Story",
    published: true,
  },
  {
    id: "n4",
    title: "GCL Partners with 3 New Universities for Curriculum Development",
    excerpt: "University of Nairobi, UNAM Mexico, and University of Warsaw join GCL's academic network.",
    content: "GCL is proud to announce academic partnerships with three leading institutions to co-develop the next generation of behavioral finance curriculum. These partnerships will bring academic rigor to GCL's community-driven approach and open pathways for formal credit recognition.",
    author: "GCL Editorial Team",
    date: "May 10, 2026",
    category: "Announcement",
    published: true,
  },
  {
    id: "n5",
    title: "Q1 2026 Impact Report: 8,000+ Youth Reached",
    excerpt: "Our quarterly update shows record-breaking reach, with workshops delivered in 14 countries across 5 continents.",
    content: "The first quarter of 2026 marks GCL's highest-ever impact numbers. With 8,000+ young people formally completing at least one GCL module, and 120+ workshops delivered globally, we are on track to exceed our annual targets by 40%.",
    author: "GCL Editorial Team",
    date: "April 12, 2026",
    category: "Update",
    published: true,
  },
  {
    id: "n6",
    title: "Why Traditional Budgeting Fails Young People — And What Actually Works",
    excerpt: "A deep dive into the psychology behind why conventional personal finance advice doesn't stick for youth audiences.",
    content: "Most personal finance education teaches rules: the 50/30/20 budget, the emergency fund, the debt snowball. These rules assume stable income, rational actors, and an absence of psychological pressure. For the young people GCL works with — many living in economic uncertainty — these assumptions collapse immediately.",
    author: "Sarah Jenkins",
    date: "March 22, 2026",
    category: "Research",
    published: true,
  }
];
