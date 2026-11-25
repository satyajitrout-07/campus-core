import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
}

const DEFAULT_USERS: Record<UserRole, UserProfile> = {
  Admin: {
    id: 'usr-admin-1',
    email: 'admin@college.edu',
    fullName: 'Satyajit Rout',
    role: 'Admin',
    avatarUrl: '/satyajit.jpg',
    phone: '+1 555-0100',
  },
  Teacher: {
    id: 'usr-teacher-1',
    email: 'robert.martin@college.edu',
    fullName: 'Prof. Robert Martin',
    role: 'Teacher',
    teacherId: 'tch-1',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    phone: '+1 555-0191',
  },
  Student: {
    id: 'usr-student-1',
    email: 'alex.rivera@student.edu',
    fullName: 'Alex Rivera',
    role: 'Student',
    studentId: 'stu-1',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
    phone: '+1 555-0101',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('sms_auth_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.fullName === 'Dr. Arthur Pendelton' || parsed.fullName === 'Satyajit Rout') {
          parsed.fullName = 'Satyajit Rout';
          parsed.avatarUrl = '/satyajit.jpg';
        }
        return parsed;
      } catch (e) { /* ignore */ }
    }
    return DEFAULT_USERS.Admin; // Default to Admin for easy initial testing
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('sms_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sms_auth_user');
    }
  }, [user]);

  const login = (email: string, selectedRole: UserRole) => {
    const matchedProfile = DEFAULT_USERS[selectedRole];
    const newUser = {
      ...matchedProfile,
      email: email || matchedProfile.email,
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    setUser(DEFAULT_USERS[newRole]);
  };

  const role = user?.role || 'Admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: Boolean(user),
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
