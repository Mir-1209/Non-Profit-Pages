import React, { createContext, useContext, useState, useEffect } from 'react';
import { courses as initialCourses, Course } from '../data/courses';
import { events as initialEvents, Event } from '../data/events';
import { newsPosts as initialNews, NewsPost } from '../data/news';

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
  completedCourses: string[];
  registeredEvents: string[];
}

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
}

const AdminContext = createContext<AdminContextType | null>(null);

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

  useEffect(() => { save('gcl_events', events); }, [events]);
  useEffect(() => { save('gcl_courses', courses); }, [courses]);
  useEffect(() => { save('gcl_news', news); }, [news]);

  const addEvent = (e: Event) => setEvents(prev => [e, ...prev]);
  const updateEvent = (e: Event) => setEvents(prev => prev.map(x => x.id === e.id ? e : x));
  const deleteEvent = (id: string) => setEvents(prev => prev.filter(x => x.id !== id));

  const addCourse = (c: Course) => setCourses(prev => [c, ...prev]);
  const updateCourse = (c: Course) => setCourses(prev => prev.map(x => x.slug === c.slug ? c : x));
  const deleteCourse = (slug: string) => setCourses(prev => prev.filter(x => x.slug !== slug));

  const addNews = (p: NewsPost) => setNews(prev => [p, ...prev]);
  const updateNews = (p: NewsPost) => setNews(prev => prev.map(x => x.id === p.id ? p : x));
  const deleteNews = (id: string) => setNews(prev => prev.filter(x => x.id !== id));

  return (
    <AdminContext.Provider value={{ events, addEvent, updateEvent, deleteEvent, courses, addCourse, updateCourse, deleteCourse, news, addNews, updateNews, deleteNews, users }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
