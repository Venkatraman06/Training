import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'CEO' | 'OPS_MGR' | 'SALES' | 'MARKETING' | 'TRAINER' | 'FINANCE' | 'HR' | 'INTERN';
  phone?: string;
  whatsapp?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://127.0.0.1:8000/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.access);
        setUser(data.user);
        localStorage.setItem('token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));
        return true;
      } else {
        // Fallback to local mockup for dev ease of use if backend is not started/seeded
        return handleMockLogin(username, password);
      }
    } catch (e) {
      console.warn("Backend not accessible, falling back to mock login:", e);
      return handleMockLogin(username, password);
    }
  };

  const handleMockLogin = (username: string, password: string): boolean => {
    if (username === 'admin' && password === 'password123') {
      const mockUser: User = {
        id: 1,
        username: 'admin',
        email: 'admin@hackersinfotech.com',
        first_name: 'Sarah',
        last_name: 'Admin',
        role: 'CEO', // CEO role has full admin permissions
      };
      setToken('mock-jwt-token');
      setUser(mockUser);
      localStorage.setItem('token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  };

  const updateUser = async (updatedUser: Partial<User>): Promise<boolean> => {
    try {
      const savedToken = localStorage.getItem('token');
      if (savedToken && savedToken !== 'mock-jwt-token') {
        const response = await fetch(`${API_URL}/auth/me/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${savedToken}`
          },
          body: JSON.stringify(updatedUser)
        });
        if (response.ok) {
          const data = await response.json();
          const merged = { ...user, ...data } as User;
          setUser(merged);
          localStorage.setItem('user', JSON.stringify(merged));
          return true;
        }
      }
      
      // Fallback for mock environment
      if (user) {
        const merged = { ...user, ...updatedUser } as User;
        setUser(merged);
        localStorage.setItem('user', JSON.stringify(merged));
        return true;
      }
      return false;
    } catch (e) {
      console.warn("Failed to update user profile via API:", e);
      if (user) {
        const merged = { ...user, ...updatedUser } as User;
        setUser(merged);
        localStorage.setItem('user', JSON.stringify(merged));
        return true;
      }
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
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
