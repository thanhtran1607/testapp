import { clearStore, getStore, setStore } from '@/stores';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

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
      await setStore({ key: 'token', value: 'token', typeStorage: 'cookie' });
      await setStore({ key: 'user', value: JSON.stringify({ email }), typeStorage: 'cookie' });
      await setStore({ key: 'isLoggedIn', value: 'true', typeStorage: 'cookie' });
      setUser({ email });
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = async () => {
    setUser(null);
    setIsLoggedIn(false);
    await clearStore({ typeStorage: 'cookie' });
    await clearStore({ typeStorage: 'mmkv' });
  };

  useEffect(() => {
    const checkLogin = async () => {
      const token = await getStore({ key: 'token', typeStorage: 'cookie' });
      const user = await getStore({ key: 'user', typeStorage: 'cookie' });
      const isLoggedIn = await getStore({ key: 'isLoggedIn', typeStorage: 'cookie' });
      setUser(user ? JSON.parse(user) : null);
      setIsLoggedIn(isLoggedIn === 'true');
    };
    checkLogin();
  }, []);

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

