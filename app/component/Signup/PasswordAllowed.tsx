"use client";

import "@/app/globals.css";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase/client-side";
import { useRouter } from "next/navigation";
import Signup_ErrorRedirect from "./Signup_ErrorRedirect";
import Signup_LastRedirect from "./LastRedirect";

export default function SignUp_Password_Allowed({ email }: { email: string }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [redirectState, setRedirectState] = useState<"Error" | "Accepted" | "">("");
  const [redirectActive, setRedirectActive] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    
    passwordInputRef.current?.focus();
  }, []);

  async function handleSubmit() {
    
    setPasswordError("");

    
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      setRedirectState("Error");
    } else {
      setRedirectState("Accepted");
    }
    setRedirectActive(true);
    setIsSubmitting(false);
  }

  
  if (redirectActive && redirectState === "Accepted") {
    
    return <Signup_LastRedirect/>
  }

  
  if (redirectActive && redirectState === "Error") {
    return <Signup_ErrorRedirect message="Something went wrong! Please try again." />;
  }

  
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
            <h2 className="text-2xl font-bold text-text-light md:text-3xl">
              Create your account
            </h2>
            <p className="text-sm text-text-gray">
              We’re setting up your profile for <span className="text-primary">{email}</span>
            </p>
          </div>

          {}
          <div className="space-y-5">
            {}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-gray/80">
                Password
              </label>
              <input
                ref={passwordInputRef}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/15 bg-black/40 px-5 py-3.5 text-sm text-text-light placeholder-text-gray/50 transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
            </div>

            {}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-gray/80">
                Confirm password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/15 bg-black/40 px-5 py-3.5 text-sm text-text-light placeholder-text-gray/50 transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
            </div>

            {}
            {passwordError && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-center">
                <p className="text-xs text-red-400">{passwordError}</p>
              </div>
            )}

            {}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="group relative w-full overflow-hidden rounded-xl py-4 text-center font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              style={{ background: `linear-gradient(135deg, var(--PRIMARY_COLOR) 0%, var(--DARKER) 100%)` }}
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative z-10 flex items-center justify-center gap-2 text-base" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {isSubmitting ? "Creating account..." : "Sign up →"}
                {!isSubmitting && (
                  <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                )}
              </span>
            </button>

            {}
            <div className="pt-4 text-center">
              <button
                onClick={() => router.back()}
                className="text-xs text-text-gray/70 transition-colors hover:text-text-gray"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                ← Go back
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}