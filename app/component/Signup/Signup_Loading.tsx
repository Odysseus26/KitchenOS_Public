"use client";

import "@/app/globals.css";
import { useEffect, useState, useRef } from "react";

export default function Signup_Loading() {
  const [loadingText, setLoadingText] = useState<string>("Loading");
  const dotCountRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      dotCountRef.current = (dotCountRef.current + 1) % 4; 
      const dots = ".".repeat(dotCountRef.current);
      setLoadingText(`Loading${dots}`);
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background-dark via-surface-dark to-background-dark">
      {}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-secondary/15 blur-3xl animate-float [animation-delay:-2s]" />
        <div className="absolute top-1/2 right-1/4 h-64 w-64 rounded-full bg-third/20 blur-3xl animate-float [animation-delay:-4s]" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-background-dark/40 to-background-dark/80" />
      </div>

      {}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        {}
        <div className="max-w-md w-full space-y-8 rounded-2xl border border-white/10 bg-white/[0.04] p-8 md:p-12 backdrop-blur-xl shadow-2xl animate-fadeIn">
          {}
          <div className="relative mx-auto h-24 w-24">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-secondary border-b-third border-l-transparent animate-spin" />
            <div className="absolute inset-2 rounded-full bg-primary/10 animate-pulse-slow" />
          </div>

          {}
          <div className="space-y-3">
            <h2
              className="text-3xl font-bold md:text-4xl"
              style={{
                background: "linear-gradient(135deg, var(--DARKER), var(--SECONDARD_COLOR), var(--THIRD_COLOR))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                backgroundSize: "200% auto",
                animation: "gradient 6s linear infinite",
              }}
            >
              {loadingText}
            </h2>
            <p className="text-text-gray text-base md:text-lg" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
              Give us a moment
            </p>
          </div>

          {}
          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary via-secondary to-third rounded-full animate-[pulse_1.5s_ease-in-out_infinite]" style={{ width: "70%" }} />
          </div>

          {}
          <p className="text-xs text-text-gray/50 mt-6 max-w-xs mx-auto">
            Did you know? Professional chefs organize an average of 150+ recipes. We're setting up your space...
          </p>
        </div>
      </div>

      {}
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse-slow {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </section>
  );
}