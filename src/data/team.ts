export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  bio: string;
  location: string;
  email?: string;
  linkedin?: string;
  instagram?: string;
  initials: string;
  gradient: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: 'amir-karimov',
    name: 'Amir Karimov',
    role: 'Founder & Executive Director',
    department: 'Leadership',
    bio: 'Founded GCL in 2021 after running the first financial literacy workshop at a Tashkent youth center. Drives strategy, partnerships, and global expansion.',
    location: 'Tashkent, Uzbekistan',
    email: 'amir@globalcapitalleague.org',
    linkedin: '#',
    initials: 'AK',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  },
  {
    id: 'sofia-chen',
    name: 'Sofia Chen',
    role: 'Head of Curriculum',
    department: 'Education',
    bio: 'Behavioral economist and educator who architects all GCL course content. Makes behavioral finance actually teachable for youth everywhere.',
    location: 'Singapore',
    email: 'sofia@globalcapitalleague.org',
    linkedin: '#',
    initials: 'SC',
    gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)',
  },
  {
    id: 'omar-hassan',
    name: 'Omar Hassan',
    role: 'Chapters Director',
    department: 'Operations',
    bio: 'Leads all 38 active chapters worldwide — from recruitment and training to mentorship. Grew the chapter network from 3 to 38 in two years.',
    location: 'Nairobi, Kenya',
    email: 'omar@globalcapitalleague.org',
    linkedin: '#',
    initials: 'OH',
    gradient: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
  },
  {
    id: 'daria-koval',
    name: 'Daria Koval',
    role: 'Head of Programs',
    department: 'Programs',
    bio: 'Runs all live workshop and digital course rollouts across 14 countries. Expert in youth-centered program design and community facilitation.',
    location: 'Kyiv, Ukraine',
    email: 'daria@globalcapitalleague.org',
    linkedin: '#',
    initials: 'DK',
    gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
  },
  {
    id: 'lucas-ferreira',
    name: 'Lucas Ferreira',
    role: 'Technology Lead',
    department: 'Technology',
    bio: 'Builds and maintains the GCL digital infrastructure — the learning platform to the member portal. Full-stack developer turned financial literacy advocate.',
    location: 'São Paulo, Brazil',
    email: 'lucas@globalcapitalleague.org',
    linkedin: '#',
    initials: 'LF',
    gradient: 'linear-gradient(135deg, #10b981, #0ea5e9)',
  },
  {
    id: 'priya-nair',
    name: 'Priya Nair',
    role: 'Partnerships Manager',
    department: 'Partnerships',
    bio: 'Forges and manages relationships with NGOs, universities, and governments. Has onboarded 12 institutional partners in 2025 alone.',
    location: 'Mumbai, India',
    email: 'priya@globalcapitalleague.org',
    linkedin: '#',
    initials: 'PN',
    gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
  },
  {
    id: 'yuki-tanaka',
    name: 'Yuki Tanaka',
    role: 'Creative Director',
    department: 'Brand',
    bio: 'Shapes the GCL visual identity and storytelling from scratch — keeps it sharp, punchy, and unmistakably GCL across every touchpoint.',
    location: 'Tokyo, Japan',
    email: 'yuki@globalcapitalleague.org',
    instagram: '#',
    initials: 'YT',
    gradient: 'linear-gradient(135deg, #f43f5e, #f59e0b)',
  },
  {
    id: 'amara-diallo',
    name: 'Amara Diallo',
    role: 'Community Lead',
    department: 'Community',
    bio: 'Coordinates the GCL global community — member events, alumni network, and social channels. The reason GCL feels like a family, not just a program.',
    location: 'Accra, Ghana',
    email: 'amara@globalcapitalleague.org',
    instagram: '#',
    initials: 'AD',
    gradient: 'linear-gradient(135deg, #0ea5e9, #10b981)',
  },
];

export const departments = ['All', 'Leadership', 'Education', 'Operations', 'Programs', 'Technology', 'Partnerships', 'Brand', 'Community'];
