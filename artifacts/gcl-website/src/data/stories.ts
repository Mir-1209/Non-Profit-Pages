export interface Story {
  id: string;
  quote: string;
  name: string;
  role: string;
  location: string;
  color: string;
}

export const stories: Story[] = [
  {
    id: "s1",
    quote: "GCL didn't just teach me how to budget. They taught me why my brain was fighting me every time I tried to save. Understanding the psychology changed everything.",
    name: "Amara N.",
    role: "University Student",
    location: "Accra, Ghana",
    color: "var(--blue)"
  },
  {
    id: "s2",
    quote: "The 'Decisions Under Scarcity' module was a revelation. It removed the shame I felt about my financial choices and gave me practical tools to build bandwidth.",
    name: "Priya S.",
    role: "Community Organizer",
    location: "Mumbai, India",
    color: "var(--violet)"
  },
  {
    id: "s3",
    quote: "I thought finance was for people with capital. GCL showed me that understanding the system is the first step to changing it. Now I run local workshops in my neighborhood.",
    name: "Carlos M.",
    role: "Youth Advocate",
    location: "Bogotá, Colombia",
    color: "var(--magenta)"
  },
  {
    id: "s4",
    quote: "Transitioning from a post-conflict economy to standard capitalism was jarring. GCL's curriculum provided the exact bridge we needed to navigate the new reality.",
    name: "Jelena K.",
    role: "Small Business Owner",
    location: "Sarajevo, Serbia",
    color: "var(--blue)"
  },
  {
    id: "s5",
    quote: "We are taught that wealth is purely a math problem. The realization that it's deeply tied to emotional regulation and identity has completely shifted my trajectory.",
    name: "Jordan T.",
    role: "First-Gen Graduate",
    location: "Detroit, USA",
    color: "var(--violet)"
  },
  {
    id: "s6",
    quote: "Before GCL, I felt completely locked out of the financial conversation. The accessible language and focus on behavioral economics made me feel seen and empowered.",
    name: "Wei C.",
    role: "Freelance Designer",
    location: "Taipei, Taiwan",
    color: "var(--magenta)"
  }
];
