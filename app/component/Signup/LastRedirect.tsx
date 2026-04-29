"use client";

import "@/app/globals.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Signup_LastRedirect() {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
        <div
          className={`w-full max-w-md space-y-8 rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl shadow-2xl transition-all duration-700 md:p-12 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {}
          <div className="flex justify-center">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full"
              style={{ backgroundColor: `var(--PRIMARY_COLOR)1A` }}
            >
              <svg
                className="h-10 w-10"
                style={{ color: `var(--PRIMARY_COLOR)` }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          {}
          <div className="space-y-3 text-center">
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
              Verify your email!
            </h2>
            <p className="text-text-gray text-sm md:text-base" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
              We've sent a confirmation link to your inbox.
            </p>
          </div>

          {}
          <div className="space-y-4 rounded-xl border border-white/10 bg-black/20 p-5 text-center">
            <p className="text-sm text-text-light" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Please check your email and click the verification link to activate your account.
            </p>
            <div className="flex flex-col gap-2 text-xs text-text-gray/70">
              <p>✨ Didn’t receive the email?</p>
              <p>🔍 Check your spam folder or </p>
            </div>
          </div>

          {}
          <div className="space-y-3">
            <button
              onClick={() => {
                
                alert("Resend functionality – integrate with Supabase or your backend");
              }}
              className="group relative w-full overflow-hidden rounded-xl py-3 text-center font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              style={{ background: `linear-gradient(135deg, var(--PRIMARY_COLOR) 0%, var(--DARKER) 100%)` }}
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative z-10 flex items-center justify-center gap-2 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Resend verification email
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </span>
            </button>

            <Link
              href="/SignIn"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-black/40 py-3 text-sm text-text-gray transition-all hover:border-primary/50 hover:text-primary"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Already verified? Sign in →
            </Link>
          </div>

          {}
          <p className="text-center text-[11px] text-text-gray/50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            The link expires in 24 hours. Contact support if you need help.
          </p>
        </div>
      </div>
    </section>
  );
}