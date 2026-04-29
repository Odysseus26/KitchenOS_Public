"use client";

import "@/app/globals.css";
import { useState, useEffect } from "react";
import { Eye, ChevronRight } from "lucide-react";

const TOOLS = [
  {
    name: "VIEW PUBLIC RECIPES",
    id: "PUBLIC",
    description: "Browse and add community recipes to your collection",
    icon: <Eye className="h-8 w-8" />,
  },
  
];

export default function Organization_Tools_Overview({ onSelect }: { onSelect: (input: string) => void }) {
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
          className={`mb-12 text-center transition-all duration-700 ${
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
            Organisation Tools
          </h2>
          <p className="mt-3 text-text-gray text-lg">
            Enhance your culinary workflow with these utilities
          </p>
          <div className="mt-4 h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto" />
        </div>

        {}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {TOOLS.map((tool) => (
            <div
              key={tool.id}
              onClick={() => onSelect(tool.id)}
              className="group relative cursor-pointer rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 hover:shadow-primary/10"
            >
              {}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

              {}
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                {tool.icon}
              </div>

              {}
              <h3 className="mt-5 text-xl font-bold text-text-light tracking-tight">
                {tool.name}
              </h3>
              <p className="mt-2 text-sm text-text-gray leading-relaxed">
                {tool.description}
              </p>

              {}
              <div className="mt-4 flex items-center text-primary/70 transition-all group-hover:translate-x-1 group-hover:text-primary">
                <span className="text-sm font-medium">Launch</span>
                <ChevronRight className="ml-1 h-4 w-4" />
              </div>

              {}
              <div className="pointer-events-none absolute -bottom-2 -right-2 h-16 w-16 rounded-full bg-primary/10 blur-xl" />
            </div>
          ))}
        </div>

        {}
        {TOOLS.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl text-center max-w-md mx-auto">
            <p className="text-text-gray">No tools available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}