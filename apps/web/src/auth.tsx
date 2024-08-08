import { createContext, ReactNode, useContext, useState } from "react";

export type AuthContext = {
  user: string | null;
  setUser: (user: string | null) => void;
};

const authContext = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthContext["user"] | null>(
    localStorage.getItem("user"),
  );

  return (
    <authContext.Provider
      value={{
        user,
        setUser: (user) => {
          if (user) {
            localStorage.setItem("user", user);
          } else {
            localStorage.removeItem("user");
          }

          setUser(user);
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
