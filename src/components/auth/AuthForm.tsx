"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    if (isLogin) {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("A temporary setback. Try again.");
      } else {
        setSuccess("Welcome back. The work continues.");
        setTimeout(() => {
          router.push("/account/profile");
          router.refresh();
        }, 800);
      }
    } else {
      // Mock registration logic
      setSuccess("You're in. The arena awaits.");
      setTimeout(() => {
        signIn("credentials", { redirect: false, email, password }).then(() => {
          router.push("/account/profile");
          router.refresh();
        });
      }, 800);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 border border-white/10 bg-bottle-green">
      <div className="flex gap-8 mb-12 border-b border-white/10 pb-4">
        <button 
          onClick={() => { setIsLogin(true); setError(null); setSuccess(null); }}
          className={`font-structural text-xl uppercase tracking-wider transition-colors ${isLogin ? "text-wattle" : "text-gray-500 hover:text-gray-300"}`}
        >
          Login
        </button>
        <button 
          onClick={() => { setIsLogin(false); setError(null); setSuccess(null); }}
          className={`font-structural text-xl uppercase tracking-wider transition-colors ${!isLogin ? "text-wattle" : "text-gray-500 hover:text-gray-300"}`}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {error && (
          <div className="p-4 bg-red-900/40 border border-red-500/50 text-red-100 font-editorial text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="p-4 bg-wattle/20 border border-wattle/50 text-wattle font-editorial text-sm">
            {success}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="font-structural text-sm uppercase tracking-widest text-gray-400">Email Address</label>
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-dark-slate border border-white/20 px-4 py-3 text-white font-editorial focus:outline-none focus:border-bottle-green focus:ring-1 focus:ring-bottle-green transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-structural text-sm uppercase tracking-widest text-gray-400">Password</label>
          <input 
            type="password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-dark-slate border border-white/20 px-4 py-3 text-white font-editorial focus:outline-none focus:border-bottle-green focus:ring-1 focus:ring-bottle-green transition-all"
          />
        </div>

        <Button variant="accent" type="submit" disabled={isLoading} className="mt-4">
          {isLoading ? "Processing..." : isLogin ? "Enter" : "Join"}
        </Button>
      </form>
    </div>
  );
}
