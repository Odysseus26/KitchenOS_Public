"use client";

import "@/app/globals.css";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";               
import { Home } from "lucide-react";        

const NAV_ITEMS = ["RECIPES", "TOOLS", "SHARING"] as const; 
type NavItem = (typeof NAV_ITEMS)[number];

export default function Personal_Navigation({ onSelect }: { onSelect: (input: NavItem) => void }) {
  const [active, setActive] = useState<NavItem>(NAV_ITEMS[0]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<NavItem, HTMLButtonElement | null>>({} as Record<NavItem, HTMLButtonElement | null>);

  
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  
  useEffect(() => {
    const update = () => {
      const activeEl = itemRefs.current[active];
      const container = navRef.current;
      if (!activeEl || !container) return;
      const cRect = container.getBoundingClientRect();
      const aRect = activeEl.getBoundingClientRect();
      setIndicatorStyle({
        left: aRect.left - cRect.left,
        width: aRect.width,
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [active]);

  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSelect = (item: NavItem) => {
    setActive(item);
    setMobileOpen(false);
    onSelect(item);
  };

  
  useEffect(() => {
    onSelect(NAV_ITEMS[0]);
    setTimeout(() => {
      const activeEl = itemRefs.current[NAV_ITEMS[0]];
      const container = navRef.current;
      if (activeEl && container) {
        const cRect = container.getBoundingClientRect();
        const aRect = activeEl.getBoundingClientRect();
        setIndicatorStyle({ left: aRect.left - cRect.left, width: aRect.width });
      }
    }, 50);
  }, []);

  return (
    <>
      {}
      <nav
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${
          scrolled
            ? "bg-gradient-to-b from-black via-black to-black/95 shadow-[0_20px_35px_-15px_rgba(0,0,0,0.9)] border-b border-primary/20"
            : "bg-black border-b border-primary/10"
        }`}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {}
            <div className="flex-shrink-0">
              <span
                className="text-2xl font-black tracking-tight cursor-default drop-shadow-[0_0_8px_rgba(229,9,20,0.5)]"
                style={{
                  background: `linear-gradient(135deg, var(--PRIMARY_COLOR), var(--SECONDARD_COLOR))`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                KITCHEN
                <span className="text-white/40">OS</span>
              </span>
            </div>

            {}
            <div ref={navRef} className="hidden md:flex md:items-center md:space-x-1 relative">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item}
                  ref={(el) => (itemRefs.current[item] = el)}
                  onClick={() => handleSelect(item)}
                  className={`relative z-10 px-4 py-2 text-sm font-medium tracking-wide transition-all duration-200 ${
                    active === item ? "text-white" : "text-gray-500 hover:text-white"
                  }`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {item}
                </button>
              ))}
              <motion.div
                className="absolute bottom-0 h-0.5 rounded-full"
                style={{
                  left: indicatorStyle.left,
                  width: indicatorStyle.width,
                  background: `linear-gradient(90deg, var(--PRIMARY_COLOR), var(--SECONDARD_COLOR))`,
                  boxShadow: `0 0 8px var(--PRIMARY_COLOR)`,
                }}
                layoutId="glowPill"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
              />
            </div>

            {}
            <div className="hidden md:flex items-center gap-3">
              {}
              <Link
                href="/Homepage"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 transition-all duration-200 hover:bg-primary/20 hover:text-white hover:border-primary/40"
                aria-label="Return to Homepage"
              >
                <Home className="h-4 w-4" />
              </Link>
              {}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-dark/30 border border-white/10 shadow-inner" />
            </div>

            {}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`relative z-50 md:hidden flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-lg border transition-all duration-300 ${
                mobileOpen
                  ? "border-primary bg-primary/10"
                  : "border-white/10 bg-black/40 hover:border-white/30"
              }`}
              aria-label="Toggle menu"
            >
              <span
                className={`h-px w-5 rounded-full bg-white transition-all duration-300 ${
                  mobileOpen ? "rotate-45 translate-y-[5px]" : ""
                }`}
              />
              <span
                className={`h-px w-5 rounded-full bg-white transition-all duration-300 ${
                  mobileOpen ? "opacity-0 -translate-x-2" : ""
                }`}
              />
              <span
                className={`h-px w-5 rounded-full bg-white transition-all duration-300 ${
                  mobileOpen ? "-rotate-45 -translate-y-[5px]" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      {}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 z-50 h-full w-64 bg-black border-l border-primary/20 shadow-2xl"
            >
              <div className="flex flex-col p-5 pt-20 gap-2">
                {NAV_ITEMS.map((item, idx) => (
                  <button
                    key={item}
                    onClick={() => handleSelect(item)}
                    className={`group relative px-4 py-3 rounded-lg text-left text-sm font-medium transition-all duration-200 overflow-hidden ${
                      active === item
                        ? "bg-primary/10 text-primary border-l-2 border-primary"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <span className="inline-block w-6 text-primary/50 tabular-nums">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    {item}
                    {active === item && (
                      <span className="absolute top-0 right-0 bottom-0 w-px bg-primary" />
                    )}
                  </button>
                ))}

                <hr className="my-4 border-white/10" />

                {}
                <div className="flex items-center gap-3 px-4 py-3 text-gray-400">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-dark/30 border border-white/10" />
                  <span className="text-sm">Account</span>
                </div>

                {}
                <Link
                  href="/Homepage"
                  onClick={() => setMobileOpen(false)}
                  className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-primary/10 hover:text-white hover:border-primary/30"
                >
                  <Home className="h-4 w-4" />
                  Return to Homepage
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}