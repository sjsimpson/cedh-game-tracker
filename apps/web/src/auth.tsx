import { createContext, ReactNode, useContext, useState } from "react";

import { RouterInputs, trpc } from "./utils/trpc";

export type AuthContext = {
  user: string | null;
  isAuthenticated: boolean;
  login: (credentials: RouterInputs["auth"]["login"]) => Promise<void>;
  logout: () => Promise<void>;
};

const authContext = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthContext["user"] | null>(null);
  const isAuthenticated = !!user;

  const login = trpc.auth.login.useMutation();
  const logout = trpc.auth.logout.useMutation();

  return (
    <authContext.Provider
      value={{
        isAuthenticated,
        user,
        login: async (credentials) => {
          const authedUser = await login.mutateAsync(credentials);
          setUser(authedUser);
        },
        logout: async () => {
          setUser(null);
          await logout.mutateAsync();
        },
      }}
    >
      {children}
    </authContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(authContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
