"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/providers/ToastProvider";

export function ProfileForm() {
  const { data: session } = useSession();
  
  const [name, setName] = useState(session?.user?.name || "Alex Vance");
  const [email, setEmail] = useState(session?.user?.email || "alex.vance@example.com");
  const [address, setAddress] = useState("142 Industrial Ave, Unit B\nSeattle, WA 98101");
  const [password, setPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    // Mock API call
    setTimeout(() => {
      setIsUpdating(false);
      showToast("Address updated.");
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl flex flex-col gap-8">


      <div className="flex flex-col gap-2">
        <label className="font-structural text-sm uppercase tracking-widest text-gray-400">Full Name</label>
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-bottle-green border border-white/20 px-4 py-3 text-white font-editorial focus:outline-none focus:border-bottle-green focus:ring-1 focus:ring-bottle-green transition-all"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-structural text-sm uppercase tracking-widest text-gray-400">Email Address</label>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-bottle-green border border-white/20 px-4 py-3 text-white font-editorial focus:outline-none focus:border-bottle-green focus:ring-1 focus:ring-bottle-green transition-all"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-structural text-sm uppercase tracking-widest text-gray-400">Shipping Address</label>
        <textarea 
          rows={3}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full bg-bottle-green border border-white/20 px-4 py-3 text-white font-editorial focus:outline-none focus:border-bottle-green focus:ring-1 focus:ring-bottle-green transition-all resize-none"
        />
      </div>
      
      <div className="border-t border-white/10 pt-8 mt-4">
        <h3 className="font-structural text-xl uppercase tracking-wide mb-6">Security</h3>
        <div className="flex flex-col gap-2">
          <label className="font-structural text-sm uppercase tracking-widest text-gray-400">New Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-bottle-green border border-white/20 px-4 py-3 text-white font-editorial focus:outline-none focus:border-bottle-green focus:ring-1 focus:ring-bottle-green transition-all"
          />
        </div>
      </div>

      <div className="pt-4">
        <Button variant="secondary" type="submit" disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Update"}
        </Button>
      </div>
    </form>
  );
}
