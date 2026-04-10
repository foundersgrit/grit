"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/providers/AuthProvider";

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("+880");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signIn, signUp, signInWithGoogle, signInWithPhone, verifyOtp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      let result;
      if (authMethod === "email") {
        if (isLogin) {
          result = await signIn(email, password);
        } else {
          result = await signUp(email, password);
        }
      } else if (authMethod === "phone") {
        if (!otpSent) {
          result = await signInWithPhone(phoneNumber);
          if (!result.error) {
            setOtpSent(true);
            setSuccess("Code sent. Persistence is key.");
            setIsLoading(false);
            return;
          }
        } else {
          result = await verifyOtp(phoneNumber, otp);
        }
      }

      if (result?.error) {
        setError(result.error.message || "A temporary setback. Try again.");
      } else if (authMethod === "phone" && otpSent) {
        setSuccess("Identity verified. Welcome.");
        redirectUser();
      } else if (authMethod === "email") {
        setSuccess(isLogin ? "Welcome back. The work continues." : "You're in. The arena awaits.");
        redirectUser();
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected failure occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const redirectUser = () => {
    setTimeout(() => {
      router.push("/account/profile");
      router.refresh();
    }, 800);
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
      setSuccess("Authenticated. The arena awaits.");
      // Supabase OAuth usually handles redirects via redirectTo option
    } catch (err: any) {
      setError(err.message || "Google authentication failed. Attempt another way.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 border border-white/10 bg-bottle-green">
      <div className="flex gap-8 mb-8 border-b border-white/10 pb-4">
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

      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setAuthMethod("email")}
          className={`text-xs uppercase tracking-widest px-3 py-1 border ${authMethod === "email" ? "border-wattle text-wattle" : "border-white/20 text-gray-500"}`}
        >
          Email
        </button>
        <button 
          onClick={() => setAuthMethod("phone")}
          className={`text-xs uppercase tracking-widest px-3 py-1 border ${authMethod === "phone" ? "border-wattle text-wattle" : "border-white/20 text-gray-500"}`}
        >
          Phone
        </button>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-900/40 border border-red-500/50 text-red-100 font-editorial text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 mb-6 bg-wattle/20 border border-wattle/50 text-wattle font-editorial text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {authMethod === "email" ? (
          <>
            <div className="flex flex-col gap-2">
              <label className="font-structural text-sm uppercase tracking-widest text-gray-400">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark-slate border border-white/20 px-4 py-3 text-white font-editorial focus:outline-none focus:border-wattle/50 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-structural text-sm uppercase tracking-widest text-gray-400">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark-slate border border-white/20 px-4 py-3 text-white font-editorial focus:outline-none focus:border-wattle/50 transition-all"
              />
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <label className="font-structural text-sm uppercase tracking-widest text-gray-400">Phone Number</label>
              <input 
                type="tel" 
                required
                disabled={otpSent}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+8801XXXXXXXXX"
                className="w-full bg-dark-slate border border-white/20 px-4 py-3 text-white font-editorial focus:outline-none focus:border-wattle/50 transition-all disabled:opacity-50"
              />
            </div>

            {otpSent && (
              <div className="flex flex-col gap-2">
                <label className="font-structural text-sm uppercase tracking-widest text-gray-400">6-Digit Code</label>
                <input 
                  type="text" 
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="000000"
                  className="w-full bg-dark-slate border border-white/20 px-4 py-3 text-white font-editorial focus:outline-none focus:border-wattle/50 transition-all"
                />
              </div>
            )}
          </>
        )}

        <Button variant="accent" type="submit" disabled={isLoading} className="mt-4">
          {isLoading ? "Processing..." : (authMethod === "phone" && !otpSent ? "Send Code" : (isLogin ? "Enter" : "Join"))}
        </Button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest">
          <span className="bg-bottle-green px-4 text-gray-500">Or continue with</span>
        </div>
      </div>

      <button 
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="w-full border border-white/20 py-3 flex items-center justify-center gap-3 font-structural text-sm uppercase tracking-widest hover:border-white/40 transition-all disabled:opacity-50"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
          />
        </svg>
        Google
      </button>
    </div>
  );
}


