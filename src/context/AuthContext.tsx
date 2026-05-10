import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  signup: (token: string, user: User) => void;
  logout: () => void;
  toggleSaveProperty: (propertyId: number) => Promise<void>;
  savedPropertyIds: number[];
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [savedPropertyIds, setSavedPropertyIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      Promise.all([
        fetch('/api/auth/me', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.ok ? res.json() : null),
        fetch('/api/saved-properties/ids', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.ok ? res.json() : [])
      ])
        .then(([userData, savedIds]) => {
          if (userData) {
            setUser(userData);
            setSavedPropertyIds(Array.isArray(savedIds) ? savedIds : []);
          } else {
            throw new Error('Session invalid');
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setSavedPropertyIds([]);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const toggleSaveProperty = async (propertyId: number) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/saved-properties/${propertyId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.saved) {
          setSavedPropertyIds(prev => [...prev, propertyId]);
        } else {
          setSavedPropertyIds(prev => prev.filter(id => id !== propertyId));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUser);
    // Refresh saved IDs on login
    fetch('/api/saved-properties/ids', { headers: { 'Authorization': `Bearer ${newToken}` } })
      .then(res => res.ok ? res.json() : [])
      .then(ids => setSavedPropertyIds(ids))
      .catch(() => setSavedPropertyIds([]));
  };

  const signup = (newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUser);
    setSavedPropertyIds([]);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setSavedPropertyIds([]);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, toggleSaveProperty, savedPropertyIds, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
