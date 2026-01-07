import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  user: { email: string } | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);

  // Fake login - chấp nhận bất kỳ email/password nào
  const login = async (email: string, password: string): Promise<boolean> => {
    // Giả lập delay như gọi API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Fake validation - chỉ cần email và password không rỗng
    if (email && password) {
      setUser({ email });
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

