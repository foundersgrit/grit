"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<{ error: unknown } | null>;
  signUp: (email: string, password: string, metadata?: Record<string, unknown>) => Promise<{ data: unknown; error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: unknown } | null>;
  signInWithPhone: (phone: string) => Promise<{ error: unknown } | null>;
  verifyOtp: (phone: string, token: string) => Promise<{ error: unknown } | null>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<unknown>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Check active sessions and sets the user
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = (email: string, pass: string) => 
    supabase.auth.signInWithPassword({ email, password: pass });

  const signUp = async (email: string, password: string, metadata: Record<string, unknown> = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      return { data, error: null };
    } catch (err: unknown) {
      return { data: null, error: err as Error };
    }
  };

  const signInWithGoogle = () => 
    supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/account/profile`
      }
    });

  const signInWithPhone = (phone: string) =>
    supabase.auth.signInWithOtp({ phone });

  const verifyOtp = (phone: string, token: string) =>
    supabase.auth.verifyOtp({ phone, token, type: 'sms' });

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = (email: string) => 
    supabase.auth.resetPasswordForEmail(email);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn, 
      signUp, 
      signInWithGoogle,
      signInWithPhone,
      verifyOtp,
      logout,
      resetPassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
