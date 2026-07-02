export interface Event {
  id: string;
  date: { day: string; month: string };
  title: string;
  speaker: string;
  format: 'Online' | 'In-Person';
  type: 'Free' | 'Invite-Only' | 'Ticketed';
}

export const events: Event[] = [
  {
    id: "e1",
    date: { day: "12", month: "AUG" },
    title: "Behavioral Traps in Investing",
    speaker: "Dr. Elena Rostova",
    format: "Online",
    type: "Free"
  },
  {
    id: "e2",
    date: { day: "24", month: "AUG" },
    title: "Community Wealth Building",
    speaker: "David Osei",
    format: "In-Person",
    type: "Ticketed"
  },
  {
    id: "e3",
    date: { day: "05", month: "SEP" },
    title: "Global Systems Summit",
    speaker: "Prof. Maria Santos & Guests",
    format: "Online",
    type: "Free"
  },
  {
    id: "e4",
    date: { day: "18", month: "SEP" },
    title: "Youth Leadership Retreat",
    speaker: "GCL Executive Team",
    format: "In-Person",
    type: "Invite-Only"
  },
  {
    id: "e5",
    date: { day: "02", month: "OCT" },
    title: "The Psychology of Scarcity",
    speaker: "Sarah Jenkins",
    format: "Online",
    type: "Free"
  },
  {
    id: "e6",
    date: { day: "15", month: "OCT" },
    title: "Impact Investing 101",
    speaker: "Chloe Bennett",
    format: "Online",
    type: "Free"
  },
  {
    id: "e7",
    date: { day: "08", month: "NOV" },
    title: "Financial Dignity Workshop",
    speaker: "Jamal Thompson",
    format: "In-Person",
    type: "Ticketed"
  },
  {
    id: "e8",
    date: { day: "22", month: "NOV" },
    title: "End of Year Review: Systems Check",
    speaker: "Marcus Chen",
    format: "Online",
    type: "Free"
  }
];
