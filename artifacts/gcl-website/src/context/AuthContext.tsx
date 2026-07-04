import React, { createContext, useContext } from 'react';
import { useAuth as useReplitAuth } from '@workspace/replit-auth-web';
import { useGetMyProfile, getGetMyProfileQueryKey, MemberProfile } from '@workspace/api-client-react';

export type Role = 'member' | 'gcl_team' | 'admin';

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: { id: string; email: string | null; firstName: string | null; lastName: string | null; profileImageUrl: string | null } | null;
  role: Role;
  isTeam: boolean;
  isAdmin: boolean;
  login: () => void;
  logout: () => void;
  profile: MemberProfile | undefined;
  profileLoading: boolean;
  refetchProfile: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated, login, logout } = useReplitAuth();

  const {
    data: profile,
    isLoading: profileLoading,
    refetch,
  } = useGetMyProfile({
    query: { enabled: isAuthenticated, queryKey: getGetMyProfileQueryKey() },
  });

  const role: Role = (profile?.role as Role) ?? 'member';

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        user,
        role,
        isTeam: role === 'gcl_team' || role === 'admin',
        isAdmin: role === 'admin',
        login,
        logout,
        profile,
        profileLoading,
        refetchProfile: () => refetch(),
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
