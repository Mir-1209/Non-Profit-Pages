import React, { createContext, useContext, useState, useEffect } from 'react';
import { courses as initialCourses, Course } from '../data/courses';
import { events as initialEvents, Event } from '../data/events';
import { newsPosts as initialNews, NewsPost } from '../data/news';
import { FormSection, SUMMER26_FORM_SCHEMA } from '../data/applicationForm';

export type { FormSection, FormField, FieldType } from '../data/applicationForm';

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
  completedCourses: string[];
  registeredEvents: string[];
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  category: string;
  assignedTo: 'all' | string[];
  createdAt: string;
}

export interface AssignmentSubmission {
  assignmentId: string;
  memberId: string;
  memberName: string;
  done: boolean;
  fileName?: string;
  fileSize?: string;
  note?: string;
  submittedAt?: string;
}

export interface ProgramApplicant {
  id: string;
  memberId: string;
  name: string;
  email: string;
  appliedDate: string;
  decision: 'draft' | 'pending' | 'accepted' | 'waitlisted' | 'rejected';
  decisionDate?: string;
  responses?: Record<string, any>;
  submittedAt?: string;
}

export interface Program {
  id: string;
  name: string;
  type: string;
  description: string;
  deadline?: string;
  active: boolean;
  formUrl?: string;
  applicants: ProgramApplicant[];
  formSchema?: FormSection[];
  slug?: string;
}

export const GCL_TEAM_MEMBERS: { id: string; name: string }[] = [
  { id: 'Mirzo11', name: 'Mirzo (Team Lead)' },
  { id: 'sarah_gcl', name: 'Sarah Chen' },
  { id: 'david_gcl', name: 'David Osei' },
  { id: 'aisha_gcl', name: 'Aisha Malik' },
  { id: 'leon_gcl', name: 'Leon Park' },
];

const INITIAL_ASSIGNMENTS: Assignment[] = [
  { id: 'a1', title: 'Onboard New Chapter — Nairobi', description: 'Guide the Nairobi chapter through the standard onboarding checklist and submit completion report.', dueDate: '2026-07-20', category: 'Chapter Operations', assignedTo: 'all', createdAt: '2026-07-01' },
  { id: 'a2', title: 'Review Q2 Chapter Health Reports', description: 'Assess and score the health reports submitted by your assigned regional chapters.', dueDate: '2026-07-28', category: 'Reporting', assignedTo: 'all', createdAt: '2026-07-01' },
  { id: 'a3', title: 'Volunteer Kickoff Call Facilitation', description: 'Co-facilitate the summer cohort onboarding call alongside the program director.', dueDate: '2026-07-12', category: 'Events', assignedTo: ['Mirzo11', 'sarah_gcl'], createdAt: '2026-07-01' },
  { id: 'a4', title: 'GCL Summit Logistics Support', description: 'Coordinate registration, room assignments, and volunteer schedules for the August summit.', dueDate: '2026-08-10', category: 'Events', assignedTo: 'all', createdAt: '2026-07-01' },
  { id: 'a5', title: 'Spring Chapter Recruitment Drive', description: 'Reached out to 14 universities and submitted outreach reports for all contacts.', dueDate: '2026-06-01', category: 'Outreach', assignedTo: 'all', createdAt: '2026-05-01' },
  { id: 'a6', title: 'Member Feedback Survey Analysis', description: 'Compiled and summarized member survey responses from Q1 into the standard template.', dueDate: '2026-05-15', category: 'Reporting', assignedTo: ['Mirzo11', 'david_gcl'], createdAt: '2026-04-15' },
];

const INITIAL_SUBMISSIONS: AssignmentSubmission[] = [
  { assignmentId: 'a5', memberId: 'Mirzo11', memberName: 'Mirzo (Team Lead)', done: true, submittedAt: '2026-06-01' },
  { assignmentId: 'a6', memberId: 'Mirzo11', memberName: 'Mirzo (Team Lead)', done: true, fileName: 'survey_analysis_Q1.pdf', fileSize: '2.4 MB', submittedAt: '2026-05-14' },
  { assignmentId: 'a6', memberId: 'david_gcl', memberName: 'David Osei', done: true, fileName: 'q1_member_feedback.xlsx', fileSize: '1.1 MB', submittedAt: '2026-05-15' },
];

const INITIAL_PROGRAMS: Program[] = [
  {
    id: 'prog1',
    slug: 'summer-26',
    name: "GCL Summer '26 Team",
    type: 'Volunteer · Competitive',
    description: 'Teach financial literacy to youth around the world. July 20 – August 20, 2026.',
    deadline: '2026-07-10',
    active: true,
    formSchema: SUMMER26_FORM_SCHEMA,
    applicants: [
      { id: 'ap1', memberId: 'Mirzo10', name: 'Mirzo (Member)', email: 'mirzo10@gcl.org', appliedDate: 'Jan 15, 2026', decision: 'accepted', decisionDate: 'July 4, 2026' },
      { id: 'ap2', memberId: 'Mirzo11', name: 'Mirzo (Team)', email: 'mirzo11@gcl.org', appliedDate: 'Jan 15, 2026', decision: 'accepted', decisionDate: 'July 4, 2026' },
    ],
  },
  {
    id: 'prog2',
    name: 'GCL Financial Literacy Educator',
    type: 'Training Program',
    description: 'Certification program for GCL financial literacy educators. Requires completion of core courses.',
    deadline: '2026-04-30',
    active: true,
    applicants: [
      { id: 'ap3', memberId: 'Mirzo10', name: 'Mirzo (Member)', email: 'mirzo10@gcl.org', appliedDate: 'Mar 2, 2026', decision: 'pending' },
    ],
  },
  {
    id: 'prog3',
    name: 'GCL Chapter Lead Training',
    type: 'Leadership Program',
    description: 'Leadership and management training for aspiring GCL chapter leads.',
    deadline: '2026-06-30',
    active: false,
    applicants: [
      { id: 'ap4', memberId: 'Mirzo11', name: 'Mirzo (Team)', email: 'mirzo11@gcl.org', appliedDate: 'Apr 5, 2026', decision: 'pending' },
    ],
  },
];

const MOCK_USERS: RegisteredUser[] = [
  { id: 'u1', name: 'Amara Diallo', email: 'amara@example.com', joinedDate: 'Jan 12, 2026', completedCourses: ['psychology-of-spending', 'financial-identity'], registeredEvents: ['e1', 'e3'] },
  { id: 'u2', name: 'Luca Romano', email: 'luca@example.com', joinedDate: 'Feb 3, 2026', completedCourses: ['decisions-under-scarcity'], registeredEvents: ['e2'] },
  { id: 'u3', name: 'Priya Nair', email: 'priya@example.com', joinedDate: 'Feb 20, 2026', completedCourses: ['psychology-of-spending', 'building-systems', 'investing-for-impact'], registeredEvents: ['e1', 'e5', 'e6'] },
  { id: 'u4', name: 'James Okafor', email: 'james@example.com', joinedDate: 'Mar 5, 2026', completedCourses: [], registeredEvents: ['e3'] },
  { id: 'u5', name: 'Sofia Ruiz', email: 'sofia@example.com', joinedDate: 'Mar 18, 2026', completedCourses: ['money-and-power'], registeredEvents: ['e4', 'e7'] },
  { id: 'u6', name: 'Kenji Watanabe', email: 'kenji@example.com', joinedDate: 'Apr 2, 2026', completedCourses: ['psychology-of-spending'], registeredEvents: [] },
  { id: 'u7', name: 'Fatima Al-Rashid', email: 'fatima@example.com', joinedDate: 'Apr 14, 2026', completedCourses: ['financial-identity', 'decisions-under-scarcity'], registeredEvents: ['e5'] },
  { id: 'u8', name: 'Carlos Mendez', email: 'carlos@example.com', joinedDate: 'May 1, 2026', completedCourses: ['building-systems'], registeredEvents: ['e1', 'e2'] },
  { id: 'u9', name: 'Aisha Kamara', email: 'aisha@example.com', joinedDate: 'May 22, 2026', completedCourses: [], registeredEvents: ['e3', 'e6'] },
  { id: 'u10', name: 'Noah Fischer', email: 'noah@example.com', joinedDate: 'Jun 10, 2026', completedCourses: ['investing-for-impact'], registeredEvents: [] },
];

interface AdminContextType {
  events: Event[];
  addEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;
  courses: Course[];
  addCourse: (course: Course) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (slug: string) => void;
  news: NewsPost[];
  addNews: (post: NewsPost) => void;
  updateNews: (post: NewsPost) => void;
  deleteNews: (id: string) => void;
  users: RegisteredUser[];
  assignments: Assignment[];
  addAssignment: (a: Assignment) => void;
  updateAssignment: (a: Assignment) => void;
  deleteAssignment: (id: string) => void;
  submissions: AssignmentSubmission[];
  upsertSubmission: (s: AssignmentSubmission) => void;
  programs: Program[];
  addProgram: (p: Program) => void;
  updateProgram: (p: Program) => void;
  deleteProgram: (id: string) => void;
  updateApplicantDecision: (programId: string, applicantId: string, decision: ProgramApplicant['decision']) => void;
  addApplicant: (programId: string, applicant: ProgramApplicant) => void;
  deleteApplicant: (programId: string, applicantId: string) => void;
  getMyPrograms: (memberId: string) => { program: Program; applicant: ProgramApplicant }[];
  getMyAssignments: (memberId: string) => Assignment[];
  getApplication: (programId: string, memberId: string) => ProgramApplicant | undefined;
  saveApplication: (programId: string, memberId: string, data: { name: string; email: string; responses: Record<string, any> }, submit: boolean) => { success: boolean; error?: string };
}

const AdminContext = createContext<AdminContextType | null>(null);

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {}
  return fallback;
}

function save<T>(key: string, value: T) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>(() => load('gcl_events', initialEvents));
  const [courses, setCourses] = useState<Course[]>(() => load('gcl_courses', initialCourses));
  const [news, setNews] = useState<NewsPost[]>(() => load('gcl_news', initialNews));
  const [users] = useState<RegisteredUser[]>(MOCK_USERS);
  const [assignments, setAssignments] = useState<Assignment[]>(() => load('gcl_assignments', INITIAL_ASSIGNMENTS));
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(() => load('gcl_submissions', INITIAL_SUBMISSIONS));
  const [programs, setPrograms] = useState<Program[]>(() => load('gcl_programs', INITIAL_PROGRAMS));

  useEffect(() => { save('gcl_events', events); }, [events]);
  useEffect(() => { save('gcl_courses', courses); }, [courses]);
  useEffect(() => { save('gcl_news', news); }, [news]);
  useEffect(() => { save('gcl_assignments', assignments); }, [assignments]);
  useEffect(() => { save('gcl_submissions', submissions); }, [submissions]);
  useEffect(() => { save('gcl_programs', programs); }, [programs]);

  const addEvent = (e: Event) => setEvents(prev => [e, ...prev]);
  const updateEvent = (e: Event) => setEvents(prev => prev.map(x => x.id === e.id ? e : x));
  const deleteEvent = (id: string) => setEvents(prev => prev.filter(x => x.id !== id));

  const addCourse = (c: Course) => setCourses(prev => [c, ...prev]);
  const updateCourse = (c: Course) => setCourses(prev => prev.map(x => x.slug === c.slug ? c : x));
  const deleteCourse = (slug: string) => setCourses(prev => prev.filter(x => x.slug !== slug));

  const addNews = (p: NewsPost) => setNews(prev => [p, ...prev]);
  const updateNews = (p: NewsPost) => setNews(prev => prev.map(x => x.id === p.id ? p : x));
  const deleteNews = (id: string) => setNews(prev => prev.filter(x => x.id !== id));

  const addAssignment = (a: Assignment) => setAssignments(prev => [a, ...prev]);
  const updateAssignment = (a: Assignment) => setAssignments(prev => prev.map(x => x.id === a.id ? a : x));
  const deleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(x => x.id !== id));
    setSubmissions(prev => prev.filter(x => x.assignmentId !== id));
  };

  const upsertSubmission = (s: AssignmentSubmission) => {
    setSubmissions(prev => {
      const idx = prev.findIndex(x => x.assignmentId === s.assignmentId && x.memberId === s.memberId);
      if (idx >= 0) return prev.map((x, i) => i === idx ? s : x);
      return [...prev, s];
    });
  };

  const addProgram = (p: Program) => setPrograms(prev => [p, ...prev]);
  const updateProgram = (p: Program) => setPrograms(prev => prev.map(x => x.id === p.id ? p : x));
  const deleteProgram = (id: string) => setPrograms(prev => prev.filter(x => x.id !== id));

  const updateApplicantDecision = (programId: string, applicantId: string, decision: ProgramApplicant['decision']) => {
    setPrograms(prev => prev.map(p => {
      if (p.id !== programId) return p;
      return {
        ...p,
        applicants: p.applicants.map(a =>
          a.id === applicantId
            ? { ...a, decision, decisionDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }
            : a
        ),
      };
    }));
  };

  const addApplicant = (programId: string, applicant: ProgramApplicant) => {
    setPrograms(prev => prev.map(p =>
      p.id === programId ? { ...p, applicants: [...p.applicants, applicant] } : p
    ));
  };

  const deleteApplicant = (programId: string, applicantId: string) => {
    setPrograms(prev => prev.map(p =>
      p.id === programId ? { ...p, applicants: p.applicants.filter(a => a.id !== applicantId) } : p
    ));
  };

  const getMyPrograms = (memberId: string) => {
    const result: { program: Program; applicant: ProgramApplicant }[] = [];
    programs.forEach(p => {
      const applicant = p.applicants.find(a => a.memberId === memberId);
      if (applicant) result.push({ program: p, applicant });
    });
    return result;
  };

  const getMyAssignments = (memberId: string) => {
    return assignments.filter(a =>
      a.assignedTo === 'all' || (Array.isArray(a.assignedTo) && a.assignedTo.includes(memberId))
    );
  };

  const getApplication = (programId: string, memberId: string) => {
    const p = programs.find(x => x.id === programId);
    return p?.applicants.find(a => a.memberId === memberId);
  };

  const saveApplication = (
    programId: string,
    memberId: string,
    data: { name: string; email: string; responses: Record<string, any> },
    submit: boolean
  ): { success: boolean; error?: string } => {
    const program = programs.find(p => p.id === programId);
    if (!program) return { success: false, error: 'Program not found.' };

    const existing = program.applicants.find(a => a.memberId === memberId);
    if (existing && existing.decision !== 'draft') {
      return { success: false, error: 'This application has already been submitted and cannot be edited.' };
    }

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    setPrograms(prev => prev.map(p => {
      if (p.id !== programId) return p;
      const idx = p.applicants.findIndex(a => a.memberId === memberId);
      if (idx >= 0) {
        const applicants = [...p.applicants];
        applicants[idx] = {
          ...applicants[idx],
          name: data.name,
          email: data.email,
          responses: data.responses,
          decision: submit ? 'pending' : 'draft',
          appliedDate: submit ? formattedDate : applicants[idx].appliedDate,
          submittedAt: submit ? now.toISOString() : applicants[idx].submittedAt,
        };
        return { ...p, applicants };
      }
      const applicant: ProgramApplicant = {
        id: `ap${Date.now()}`,
        memberId,
        name: data.name,
        email: data.email,
        appliedDate: formattedDate,
        decision: submit ? 'pending' : 'draft',
        responses: data.responses,
        submittedAt: submit ? now.toISOString() : undefined,
      };
      return { ...p, applicants: [...p.applicants, applicant] };
    }));

    return { success: true };
  };

  return (
    <AdminContext.Provider value={{
      events, addEvent, updateEvent, deleteEvent,
      courses, addCourse, updateCourse, deleteCourse,
      news, addNews, updateNews, deleteNews,
      users,
      assignments, addAssignment, updateAssignment, deleteAssignment,
      submissions, upsertSubmission,
      programs, addProgram, updateProgram, deleteProgram,
      updateApplicantDecision, addApplicant, deleteApplicant,
      getMyPrograms, getMyAssignments,
      getApplication, saveApplication,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
