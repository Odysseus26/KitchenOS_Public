
"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const stats = [
  { label: "Active Users", value: "10k+" },
  { label: "Recipes Saved", value: "1.2M" },
  { label: "Communities", value: "850+" },
];

export default function StartSection_Sign() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  useEffect(() => {
    
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const t = requestAnimationFrame(() => setIsVisible(true));
    return () => {
      link.remove();
      cancelAnimationFrame(t);
    };
  }, []);


  const isValidEmail = (email: string): boolean => {
    const re = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    return re.test(email);
  };


  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) setEmailError("");
  };


  const handleStartJourney = (e: React.MouseEvent<HTMLButtonElement>) => {

    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address (e.g., name@domain.com)");
      return;
    }


    const btn = buttonRef.current;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement("span");
      ripple.style.cssText = `
        position: absolute; border-radius: 50%;
        background: rgba(255,255,255,0.25);
        width: ${size}px; height: ${size}px;
        left: ${e.clientX - rect.left - size / 2}px;
        top: ${e.clientY - rect.top - size / 2}px;
        transform: scale(0); animation: ripple 0.6s linear;
        pointer-events: none;
      `;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    }


    router.push(`/Signup?email=${encodeURIComponent(email)}`);
  };

  return (
    <section className="relative overflow-hidden bg-background-dark py-28 md:py-36">
      {}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "180px 180px",
        }}
      />

      {}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-float absolute -left-32 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="animate-float absolute -right-24 bottom-1/3 h-[450px] w-[450px] rounded-full bg-secondary/10 blur-[110px] [animation-delay:-2s]" />
        <div className="animate-float absolute left-1/3 top-2/3 h-[350px] w-[350px] rounded-full bg-third/10 blur-[100px] [animation-delay:-4s]" />
      </div>

      {}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {}
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {}
          <div
            className={`space-y-10 text-center transition-all duration-700 lg:text-left ${
              isVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
            }`}
          >
            {}
            <div className="inline-flex items-center gap-3">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span
                className="text-xs uppercase tracking-[0.2em] text-text-gray"
                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
              >
                Join the Community
              </span>
            </div>

            {}
            <div>
              <p
                className="text-xl leading-none text-text-gray md:text-2xl"
                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
              >
                Turn your kitchen into a
              </p>
              <h2
                className="leading-[0.9] tracking-wide"
                style={{
                  fontFamily: "'Bebas Neue', 'Arial Black', sans-serif",
                  fontSize: "clamp(4.5rem, 10vw, 9rem)",
                  background:
                    "linear-gradient(90deg, #E50914 0%, #F72731 35%, #09E56C 70%, #0982E5 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  backgroundSize: "200% auto",
                  animation: "gradient 8s linear infinite",
                }}
              >
                Smart Hub.
              </h2>
            </div>

            {}
            <p
              className="max-w-md text-base leading-relaxed text-text-gray md:text-lg"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
            >
              Join thousands of cooks who organize recipes, manage inventory, and collaborate — all in one place.
            </p>

            {}
            <div className="flex items-stretch justify-center border-t border-white/10 pt-7 lg:justify-start">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className={`flex flex-col justify-center ${
                    i === 0 ? "pr-6" : i === stats.length - 1 ? "pl-6" : "px-6"
                  } ${i > 0 ? "border-l border-white/10" : ""}`}
                >
                  <span
                    className="text-2xl font-medium text-text-light md:text-3xl"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {stat.value}
                  </span>
                  <span
                    className="mt-0.5 text-[11px] uppercase tracking-widest text-text-gray"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {}
            <div className="border-l-2 border-primary/50 py-1 pl-5 text-left">
              <p
                className="text-sm italic leading-relaxed text-text-gray"
                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
              >
                "This platform saved me hours of inventory management. The recipe scaling feature is a game changer."
              </p>
              <p
                className="mt-2.5 text-xs font-medium text-primary"
                style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em" }}
              >
                — Jamie D., Head Chef
              </p>
            </div>
          </div>

          {}
          <div
            className={`transition-all duration-700 delay-150 ${
              isVisible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
            }`}
          >
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-xl">
              <div className="h-[2px] w-full bg-gradient-to-r from-primary via-light to-primary/30" />

              <div className="space-y-6 p-8 md:p-10">
                {}
                <div>
                  <h3
                    className="text-2xl font-medium text-text-light md:text-3xl"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Get started today
                  </h3>
                  <p
                    className="mt-1.5 text-sm text-text-gray"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                  >
                    No credit card required. Not now, not ever.
                  </p>
                </div>

                {}
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="your@email.com"
                    className={`w-full rounded-xl border ${
                      emailError ? "border-red-500/70" : "border-white/15"
                    } bg-black/40 px-5 py-3.5 text-sm text-text-light placeholder-text-gray/50 transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                    <svg className="h-4 w-4 text-text-gray/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  {emailError && (
                    <p className="mt-1.5 text-xs text-red-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {emailError}
                    </p>
                  )}
                </div>

                {}
                <button
                  ref={buttonRef}
                  onClick={handleStartJourney}
                  className="group relative block w-full overflow-hidden rounded-xl py-4 text-center font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/25 cursor-pointer"
                  style={{ background: "linear-gradient(135deg, #E50914 0%, #B70710 100%)" }}
                >
                  {}
                  <span className="pointer-events-none absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]" />
                  <span
                    className="relative z-10 flex items-center justify-center gap-2 text-base"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Start your journey
                    <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </button>

                {}
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-white/10" />
                  <span
                    className="text-xs text-text-gray/60"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    or
                  </span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                {}
                <div className="space-y-3 text-center">
                  <p
                    className="text-sm text-text-gray"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Already have an account?{" "}
                    <Link
                      href="/SignIn"
                      className="group inline-flex items-center gap-1 font-medium text-primary transition-colors hover:text-light"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Sign In
                      <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </p>

                </div>

                {}
                <div className="flex flex-wrap justify-center gap-5 border-t border-white/10 pt-5">
                  {[
                    {
                      label: "Secure & encrypted",
                      icon: (
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      ),
                    },
                    {
                      label: "No hidden fees",
                      icon: (
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ),
                    },
                    {
                      label: "Cancel anytime",
                      icon: (
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      ),
                    },
                  ].map((item) => (
                    <span
                      key={item.label}
                      className="flex items-center gap-1.5 text-[11px] text-text-gray/50"
                      style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                    >
                      {item.icon}
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {}
      <style jsx>{`
        @keyframes ripple {
          to { transform: scale(4); opacity: 0; }
        }
      `}</style>
    </section>
  );
}