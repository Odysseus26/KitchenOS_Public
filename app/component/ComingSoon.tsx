"use client";

import "@/app/globals.css";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ComingSoon() {
  const [isVisible, setIsVisible] = useState(false);

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
          className={`w-full max-w-lg space-y-8 rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl shadow-2xl text-center transition-all duration-700 md:p-12 ${
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {}
          <h2
            className="text-4xl font-bold md:text-6xl"
            style={{
              background: `linear-gradient(135deg, var(--PRIMARY_COLOR), var(--SECONDARD_COLOR), var(--THIRD_COLOR))`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              backgroundSize: "200% auto",
              animation: "gradient 6s linear infinite",
            }}
          >
            Coming Soon
          </h2>

          {}
          <p
            className="text-text-gray text-base md:text-lg"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
          >
            We're cooking up something amazing. This feature isn't ready yet,
            but it will be worth the wait.
          </p>

          {}
          <div className="w-24 h-px mx-auto bg-gradient-to-r from-transparent via-primary/50 to-transparent my-4" />

          {}
          <Link
            href="/Homepage"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/25"
            style={{ background: `linear-gradient(135deg, var(--PRIMARY_COLOR) 0%, var(--DARKER) 100%)` }}
          >
            Return to Home
            <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          {}
          <p
            className="text-xs text-text-gray/50 pt-4"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
          >
            Follow us for updates
          </p>
        </div>
      </div>
    </section>
  );
}