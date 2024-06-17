import { createContext, ReactNode, useContext, useState } from "react";

import { RouterInputs, trpc } from "./utils/trpc";

export type AuthContext = {
  user: string | null;
  login: (
    credentials: RouterInputs["auth"]["login"],
    options?: { onSuccess?: () => void; onError?: () => void },
  ) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: () => Promise<boolean>;
};

const authContext = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthContext["user"] | null>(null);

  const login = trpc.auth.login.useMutation();
  const logout = trpc.auth.logout.useMutation();
  const validate = trpc.auth.validate.useMutation();

  return (
    <authContext.Provider
      value={{
        user,
        login: async (credentials, options) => {
          try {
            const authedUser = await login.mutateAsync(credentials);
            if (options?.onSuccess) options.onSuccess();
            setUser(authedUser);
          } catch (e) {
            if (options?.onError) options.onError;
            console.log("error logging user in"); // TODO: Replace with toast
          }
        },
        logout: async () => {
          setUser(null);
          await logout.mutateAsync();
        },
        isAuthenticated: async () => {
          try {
            const value = await validate.mutateAsync();
            setUser(value.id);
            return true;
          } catch (e) {
            setUser(null);
            return false;
          }
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
