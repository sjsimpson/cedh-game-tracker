import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthContext = {
  user: string | null;
  saveUser: (username: string) => void;
};

const authContext = createContext<AuthContext>({
  user: null,
  saveUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthContext["user"] | null>(null);

  useEffect(() => {
    const username = localStorage.getItem("username");

    if (!username) {
      clearUser();
    } else {
      saveUser(username);
    }
  }, []);

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("username");
  };

  const saveUser = (username: string) => {
    localStorage.setItem("username", username);
    setUser(username);
  };

  return (
    <authContext.Provider value={{ user, saveUser }}>
      {children}
    </authContext.Provider>
  );
}

export const useAuth = () => useContext(authContext);
