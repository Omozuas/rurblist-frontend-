// components/auth-provider.tsx
'use client';

import { currentUserModel } from '@/app/apis/models/user-model';
import { useGetCurrentUser } from '@/app/apis/mutations/use-user/use-get-current-user';
import { createContext, useContext, useMemo } from 'react';

type AuthContextType = {
  user: currentUserModel | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useGetCurrentUser();
  const user = data?.statusCode === 401 ? null : (data?.data ?? null);
  const value = useMemo(
    () => ({
      user,
      isLoading,
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
