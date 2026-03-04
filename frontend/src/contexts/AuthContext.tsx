import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { User, LoginCredentials, RegisterData } from '../types';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStorageData = () => {
      const storedUser = localStorage.getItem('@videoplatform:user');
      const storedToken = localStorage.getItem('@videoplatform:token');

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      }

      setLoading(false);
    };

    loadStorageData();
  }, []);

  const login = async ({ email, password }: LoginCredentials) => {
    const response = await api.post('/auth/login', { email, password });
    const { user, token } = response.data;

    localStorage.setItem('@videoplatform:user', JSON.stringify(user));
    localStorage.setItem('@videoplatform:token', token);

    setUser(user);
  };

  const register = async ({ name, email, password }: RegisterData) => {
    const response = await api.post('/auth/register', { name, email, password });
    const { user, token } = response.data;

    localStorage.setItem('@videoplatform:user', JSON.stringify(user));
    localStorage.setItem('@videoplatform:token', token);

    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('@videoplatform:user');
    localStorage.removeItem('@videoplatform:token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
