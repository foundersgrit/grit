"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  UserCredential
} from 'firebase/auth';
import { auth, functions } from '@/lib/firebase/config';
import { httpsCallable } from 'firebase/functions';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<UserCredential>;
  signUp: (email: string, pass: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Get ID token and set session cookie via API
        const idToken = await user.getIdToken();
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        });

        // REFERRAL CLAIMING LOGIC
        const pendingRef = localStorage.getItem("grit_referral_code");
        if (pendingRef) {
          try {
            const claim = httpsCallable(functions, 'claimReferral');
            await claim({ referralCode: pendingRef });
            localStorage.removeItem("grit_referral_code"); // Clear after claim attempt
            console.log("Referral infiltration confirmed.");
          } catch (refErr) {
            console.error("Referral claim failure:", refErr);
          }
        }
      } else {
        // Clear session cookie
        await fetch('/api/auth/session', { method: 'DELETE' });
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = (email: string, pass: string) => signInWithEmailAndPassword(auth, email, pass);
  const signUp = (email: string, pass: string) => createUserWithEmailAndPassword(auth, email, pass);
  const signInWithGoogle = () => signInWithPopup(auth, new GoogleAuthProvider());
  const logout = () => signOut(auth);
  const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn, 
      signUp, 
      signInWithGoogle, 
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
