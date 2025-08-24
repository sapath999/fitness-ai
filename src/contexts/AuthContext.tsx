import React, { createContext, useContext, useState, useEffect } from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';

interface User {
  name?: string;
  email?: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentialResponse: any) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = (credentialResponse: any) => {
    if (credentialResponse.credential) {
      const decodedToken = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
      const userData = {
        name: decodedToken.name,
        email: decodedToken.email,
        picture: decodedToken.picture,
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const logout = () => {
    googleLogout();
    setUser(null);
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
