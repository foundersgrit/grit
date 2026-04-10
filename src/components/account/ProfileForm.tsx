"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export function ProfileForm() {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          setName(data.name || user.displayName || "");
          setEmail(data.email || user.email || "");
          setAddress(data.address || "");
        } else {
          setName(user.displayName || "");
          setEmail(user.email || "");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsUpdating(true);
    
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        name,
        email,
        address,
        updatedAt: new Date().toISOString()
      });
      
      showToast("Profile updated.");
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast("Setback occurred. Try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="animate-pulse font-structural text-sm uppercase tracking-widest text-gray-500">Loading profile...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <label className="font-structural text-sm uppercase tracking-widest text-gray-400">Full Name</label>
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-bottle-green border border-white/20 px-4 py-3 text-white font-editorial focus:outline-none focus:border-wattle transition-all"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-structural text-sm uppercase tracking-widest text-gray-400">Email Address</label>
        <input 
          type="email" 
          disabled
          value={email}
          className="w-full bg-bottle-green border border-white/10 px-4 py-3 text-gray-500 font-editorial focus:outline-none opacity-60 cursor-not-allowed"
        />
        <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Contact support to change email</span>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-structural text-sm uppercase tracking-widest text-gray-400">Shipping Address</label>
        <textarea 
          rows={3}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Street Address, City, State, ZIP"
          className="w-full bg-bottle-green border border-white/20 px-4 py-3 text-white font-editorial focus:outline-none focus:border-wattle transition-all resize-none"
        />
      </div>
      
      <div className="border-t border-white/10 pt-8 mt-4">
        <h3 className="font-structural text-xl uppercase tracking-wide mb-4">Security</h3>
        <p className="font-editorial text-xs text-gray-500 mb-6">Passwords can be reset via the login screen. Password updates here are currently disabled for account integrity.</p>
        <div className="flex flex-col gap-2 opacity-50">
          <label className="font-structural text-sm uppercase tracking-widest text-gray-400">New Password</label>
          <input 
            type="password" 
            disabled
            className="w-full bg-bottle-green border border-white/20 px-4 py-3 text-white font-editorial focus:outline-none"
          />
        </div>
      </div>

      <div className="pt-4">
        <Button variant="accent" type="submit" disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Persist Changes"}
        </Button>
      </div>
    </form>
  );
}
