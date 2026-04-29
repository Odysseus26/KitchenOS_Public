"use client";

import "@/app/globals.css";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Signup_ErrorRedirect({ message }: { message: string }) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    
    inputRef.current?.focus();
  }, []);

  const isValidEmail = (email: string): boolean => {
    const re = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    
    if (emailError) setEmailError("");
  };

  const handleSubmit = () => {
    
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }
    
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address (e.g., name@domain.com)");
      return;
    }

    
    setIsSubmitting(true);
    router.push(`/Signup?email=${encodeURIComponent(email)}`);
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
          <div className="space-y-3 text-center">
            <div
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: `var(--PRIMARY_COLOR` }}
            >
              <svg
                className="h-8 w-8"
                style={{ color: `var(--PRIMARY_COLOR)` }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-text-light md:text-3xl">
              Oops! Something went wrong
            </h2>
          </div>

          {}
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-center">
            <p className="text-sm text-red-400 md:text-base" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {message || "An unexpected error occurred. Please try again."}
            </p>
          </div>

          {}
          <div className="space-y-5">
            <p className="text-center text-sm text-text-gray md:text-base">
              Enter your email address to restart the signup process.
            </p>

            <div>
              <input
                ref={inputRef}
                type="email"
                value={email}
                onChange={handleEmailChange}
                onKeyDown={handleKeyDown}
                disabled={isSubmitting}
                placeholder="your@email.com"
                className={`w-full rounded-xl border ${
                  emailError ? "border-red-500/70" : "border-white/15"
                } bg-black/40 px-5 py-3.5 text-sm text-text-light placeholder-text-gray/50 transition-all focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
              {emailError && (
                <p className="mt-1.5 text-xs text-red-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {emailError}
                </p>
              )}
            </div>

            {}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="group relative w-full overflow-hidden rounded-xl py-4 text-center font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              style={{ background: `linear-gradient(135deg, var(--PRIMARY_COLOR) 0%, var(--DARKER) 100%)` }}
            >
              {}
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative z-10 flex items-center justify-center gap-2 text-base" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {isSubmitting ? "Redirecting..." : "Try again →"}
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
                onClick={() => (window.location.href = "/")}
                className="text-xs text-text-gray/70 transition-colors hover:text-text-gray"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                ← Back to home
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}