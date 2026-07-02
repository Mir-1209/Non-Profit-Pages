export interface TeamMember {
  id: string;
  name: string;
  role: string;
  color: string;
}

export const team: TeamMember[] = [
  {
    id: "t1",
    name: "Aisha M.",
    role: "Executive Director",
    color: "var(--blue)"
  },
  {
    id: "t2",
    name: "Leo K.",
    role: "Head of Curriculum",
    color: "var(--violet)"
  },
  {
    id: "t3",
    name: "Sofia R.",
    role: "Director of Global Partnerships",
    color: "var(--magenta)"
  },
  {
    id: "t4",
    name: "Omar F.",
    role: "Lead Behavioral Economist",
    color: "var(--cyan, #33c7e8)"
  },
  {
    id: "t5",
    name: "Maya P.",
    role: "Community Director",
    color: "var(--blue)"
  },
  {
    id: "t6",
    name: "Julian S.",
    role: "Head of Digital Programs",
    color: "var(--violet)"
  }
];
