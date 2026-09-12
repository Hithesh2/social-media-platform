import { createContext, useContext, useState, useEffect } from 'react';
import {
  loginWithCredentials,
  loginWithGoogle,
  registerNewUserAccount,
  logoutUser,
  syncUserToFirestore,
  DEMO_USERS,
} from '../Services/authService';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'redcross_auth_user_v2';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) return parsed;
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const authenticatedUser = await loginWithCredentials(email, password);
      setUser(authenticatedUser);
      return authenticatedUser;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogleAccount = async (customGoogleDetails) => {
    setLoading(true);
    try {
      const authenticatedUser = await loginWithGoogle(customGoogleDetails);
      setUser(authenticatedUser);
      return authenticatedUser;
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (details) => {
    setLoading(true);
    try {
      const registeredUser = await registerNewUserAccount(details);
      setUser(registeredUser);
      return registeredUser;
    } finally {
      setLoading(false);
    }
  };

  const selectOfficerProfile = (profile) => {
    setUser((prev) => {
      const updated = {
        ...(prev || {}),
        uid: prev?.uid || 'off-' + Date.now(),
        email: profile.email || prev?.email || 'admin@redcross.org',
        name: profile.name,
        role: profile.role || 'Administrator',
        department: profile.department || 'Red Cross Operations',
        location: profile.location || 'Colombo HQ',
        avatar: profile.avatar || profile.name.slice(0, 2).toUpperCase(),
      };
      syncUserToFirestore(updated);
      return updated;
    });
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const switchRole = (roleName) => {
    setUser((prev) => {
      if (!prev) return DEMO_USERS.admin;
      const updated = {
        ...prev,
        role: roleName,
      };
      syncUserToFirestore(updated);
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithGoogleAccount,
        registerUser,
        selectOfficerProfile,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

