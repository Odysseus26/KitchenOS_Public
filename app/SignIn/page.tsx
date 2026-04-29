"use client";

import "@/app/globals.css";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase/client-side";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    
    emailInputRef.current?.focus();
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = async () => {
    
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    setIsLoading(true);
    setError("");

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });

    if (signInError) {
      setError(signInError.message || "Invalid email or password. Please try again.");
      setIsLoading(false);
    } else {
      
      router.push("/Homepage"); 
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]">
      {}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 h-96 w-96 rounded-full blur-3xl animate-float"
          style={{ backgroundColor: `var(--PRIMARY_COLOR)`, opacity: 0.2 }}
        />
        <div
          className="absolute bottom-0 left-0 h-80 w-80 rounded-full blur-3xl animate-float [animation-delay:-2s]"
          style={{ backgroundColor: `var(--SECONDARD_COLOR)`, opacity: 0.15 }}
        />
        <div
          className="absolute top-1/2 right-1/4 h-64 w-64 rounded-full blur-3xl animate-float [animation-delay:-4s]"
          style={{ backgroundColor: `var(--THIRD_COLOR)`, opacity: 0.2 }}
        />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#0a0a0a]/40 to-[#0a0a0a]/80" />
      </div>

      {}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8 rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl shadow-2xl animate-fadeIn md:p-12">
          {}
          <div className="space-y-2 text-center">
            <h2
              className="text-3xl font-bold md:text-4xl"
              style={{
                background: `linear-gradient(135deg, var(--PRIMARY_COLOR), var(--SECONDARD_COLOR), var(--THIRD_COLOR))`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                backgroundSize: "200% auto",
                animation: "gradient 6s linear infinite",
              }}
            >
              Welcome back
            </h2>
            <p className="text-sm text-text-gray">Sign in to your account</p>
          </div>

          {}
          <div className="space-y-5">
            {}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-gray/80">
                Email address
              </label>
              <input
                ref={emailInputRef}
                type="email"
                value={email}
                onChange={handleEmailChange}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder="your@email.com"
                className="w-full rounded-xl border border-white/15 bg-black/40 px-5 py-3.5 text-sm text-text-light placeholder-text-gray/50 transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
            </div>

            {}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-xs font-medium text-text-gray/80">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary/70 transition-colors hover:text-primary"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/15 bg-black/40 px-5 py-3.5 text-sm text-text-light placeholder-text-gray/50 transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
            </div>

            {}
            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-center">
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}

            {}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="group relative w-full overflow-hidden rounded-xl py-4 text-center font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              style={{ background: `linear-gradient(135deg, var(--PRIMARY_COLOR) 0%, var(--DARKER) 100%)` }}
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative z-10 flex items-center justify-center gap-2 text-base" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {isLoading ? "Signing in..." : "Sign in →"}
                {!isLoading && (
                  <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                )}
              </span>
            </button>

            {}
            <div className="text-center pt-4">
              <p className="text-xs text-text-gray/70">
                Don't have an account?{" "}
                <Link href="/Signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}