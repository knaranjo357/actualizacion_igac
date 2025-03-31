import React, { createContext, useContext, useState, ReactNode } from 'react';
import usersData from '../data/users.json';
import { User, AuthState } from '../types/user';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => boolean;
  logout: () => void;
  registerUser: (email: string, password: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    currentUser: null,
  });

  const login = (email: string, password: string): boolean => {
    const user = usersData.users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      setState({ isAuthenticated: true, currentUser: user });
      return true;
    }
    return false;
  };

  const logout = () => {
    setState({ isAuthenticated: false, currentUser: null });
  };

  const registerUser = (email: string, password: string): boolean => {
    const userExists = usersData.users.some((u) => u.email === email);
    if (userExists) return false;

    usersData.users.push({ email, password });
    return true;
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, registerUser }}>
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