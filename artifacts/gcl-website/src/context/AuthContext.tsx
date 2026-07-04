import React, { createContext, useContext, useState } from 'react';
import { useLocation } from 'wouter';

export type Role = 'member' | 'gcl_team' | 'admin';

export interface MemberProfile {
  role: Role;
  courses: { courseSlug: string; progress: number; completed: boolean }[];
  certificates: { id: string; courseSlug: string; issuedAt: string }[];
  joinedAt: string;
}

interface AppUser {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
}

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: AppUser | null;
  role: Role;
  isTeam: boolean;
  isAdmin: boolean;
  login: () => void;
  logout: () => void;
  profile: MemberProfile | undefined;
  profileLoading: boolean;
  refetchProfile: () => void;
  signInWithCredentials: (username: string, password: string) => { success: boolean; error?: string };
}

interface Account {
  password: string;
  role: Role;
  firstName: string;
  redirect: string;
}

const ACCOUNTS: Record<string, Account> = {
  Mirzo12: { password: 'vandy', role: 'admin',    firstName: 'Mirzo', redirect: '/admin'     },
  Mirzo11: { password: 'vandy', role: 'gcl_team', firstName: 'Mirzo', redirect: '/portal'    },
  Mirzo10: { password: 'vandy', role: 'member',   firstName: 'Mirzo', redirect: '/dashboard' },
};

const STORAGE_KEY = 'gcl_auth_session';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [, navigate] = useLocation();

  const [session, setSession] = useState<{ username: string; role: Role } | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  });

  const signInWithCredentials = (username: string, password: string): { success: boolean; error?: string } => {
    const account = ACCOUNTS[username];
    if (!account || account.password !== password) {
      return { success: false, error: 'Invalid username or password.' };
    }
    const newSession = { username, role: account.role };
    setSession(newSession);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
    return { success: true };
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem(STORAGE_KEY);
    navigate('/signin');
  };

  const login = () => navigate('/signin');

  const isAuthenticated = session !== null;
  const role: Role = session?.role ?? 'member';
  const account = session ? ACCOUNTS[session.username] : null;

  const user: AppUser | null = session
    ? {
        id: session.username,
        email: `${session.username.toLowerCase()}@gcl.org`,
        firstName: account?.firstName ?? session.username,
        lastName: null,
        profileImageUrl: null,
      }
    : null;

  const profile: MemberProfile | undefined = session
    ? {
        role,
        courses: [],
        certificates: [],
        joinedAt: '2026-01-01T00:00:00Z',
      }
    : undefined;

  return (
    <AuthContext.Provider
      value={{
        isLoading: false,
        isAuthenticated,
        user,
        role,
        isTeam: role === 'gcl_team' || role === 'admin',
        isAdmin: role === 'admin',
        login,
        logout,
        profile,
        profileLoading: false,
        refetchProfile: () => {},
        signInWithCredentials,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAppAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAppAuth must be used within AuthProvider');
  return ctx;
}
