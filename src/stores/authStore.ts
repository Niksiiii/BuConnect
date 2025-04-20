import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  fullName?: string;
  enrollmentNumber?: string;
  course?: string;
  phoneNumber?: string;
  vendorName?: string;
  role: 'student' | 'food_vendor' | 'laundry_vendor';
  points: number;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: Partial<User> & { password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    if (data.user) {
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      set({ user: userData });
    }
  },
  
  signUp: async (userData) => {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email!,
      password: userData.password!,
    });
    
    if (error) throw error;
    
    if (data.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: data.user.id,
            email: userData.email,
            full_name: userData.fullName,
            enrollment_number: userData.enrollmentNumber,
            course: userData.course,
            phone_number: userData.phoneNumber,
            vendor_name: userData.vendorName,
            role: userData.role,
          },
        ]);
        
      if (profileError) throw profileError;
    }
  },
  
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null });
  },
  
  loadUser: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      set({ user: userData, loading: false });
    } else {
      set({ user: null, loading: false });
    }
  },
}));