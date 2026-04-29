"use client";

import { TOOLS_ITEMS } from "../../utils/Tools";
import "@/app/globals.css";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {User} from "@supabase/supabase-js"

export default function Personal_Tools_Overview({user,onSelect}:{
  user: User
  onSelect: (input:string) => void
}) {
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

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:py-32">
        {}
        <div
          className={`text-center transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <h2
            className="text-4xl font-bold md:text-5xl"
            style={{
              background: `linear-gradient(135deg, var(--PRIMARY_COLOR), var(--SECONDARD_COLOR), var(--THIRD_COLOR))`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              backgroundSize: "200% auto",
              animation: "gradient 6s linear infinite",
            }}
          >
            Kitchen Tools
          </h2>
          <p className="mt-3 text-text-gray text-lg">Powerful utilities to level up your cooking</p>
        </div>

        {}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOOLS_ITEMS.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="group relative"
            >
              <div
                className={`
                  relative aspect-square w-full rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl shadow-2xl
                  transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 hover:shadow-primary/20
                  ${item.comingSoon ? "cursor-not-allowed" : "cursor-pointer"}
                `
              }
              onClick={()=>onSelect(item.identity)}
              >
                {}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                {}
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                  {item.icon}
                </div>

                {}
                <h3 className="mt-6 text-xl font-semibold text-text-light">{item.name}</h3>
                <p className="mt-2 text-sm text-text-gray">{item.description}</p>

                {}
                {item.comingSoon && (
                  <div className="absolute top-4 right-4 rounded-full bg-primary/20 px-2.5 py-0.5 text-[10px] font-medium text-primary">
                    Soon
                  </div>
                )}

                {}
                <div className="pointer-events-none absolute inset-0 rounded-2xl transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(229,9,14,0.3)]" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}