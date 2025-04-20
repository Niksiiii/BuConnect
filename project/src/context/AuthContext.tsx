import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types for our auth state
type UserRole = 'student' | 'foodVendor' | 'laundryVendor';

interface UserData {
  id: string;
  fullName?: string;
  enrollmentNumber?: string;
  course?: string;
  phoneNumber?: string;
  bennettId?: string;
  vendorName?: string;
  role: UserRole;
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  login: (credentials: { username: string; password: string; role: UserRole }) => Promise<void>;
  signup: (userData: Omit<UserData, 'id'> & { password: string }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('buconnect_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials: { username: string; password: string; role: UserRole }) => {
    setLoading(true);
    try {
      // In a real app, this would be an API call to validate credentials
      // For now, we'll simulate a successful login
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock user data based on the role
      let userData: UserData;
      
      if (credentials.role === 'student') {
        userData = {
          id: `student-${Date.now()}`,
          enrollmentNumber: credentials.username,
          fullName: 'Student User', // In a real app, this would come from the backend
          role: 'student'
        };
      } else if (credentials.role === 'foodVendor') {
        userData = {
          id: `food-vendor-${Date.now()}`,
          vendorName: credentials.username,
          role: 'foodVendor'
        };
      } else {
        userData = {
          id: `laundry-vendor-${Date.now()}`,
          vendorName: 'Laundry Service',
          role: 'laundryVendor'
        };
      }
      
      setUser(userData);
      localStorage.setItem('buconnect_user', JSON.stringify(userData));
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: Omit<UserData, 'id'> & { password: string }) => {
    setLoading(true);
    try {
      // In a real app, this would be an API call to register the user
      // For now, we'll simulate a successful registration
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: UserData = {
        id: `user-${Date.now()}`,
        fullName: userData.fullName,
        enrollmentNumber: userData.enrollmentNumber,
        course: userData.course,
        phoneNumber: userData.phoneNumber,
        bennettId: userData.bennettId,
        vendorName: userData.vendorName,
        role: userData.role
      };
      
      setUser(newUser);
      localStorage.setItem('buconnect_user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Signup failed:', error);
      throw new Error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('buconnect_user');
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};