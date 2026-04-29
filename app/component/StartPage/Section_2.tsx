
"use client";

import { useState, useEffect } from "react";

export default function StartSection_About() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    
    setIsVisible(true);
  }, []);

  
  const features = [
    {
      title: "Recipe Management",
      description: "Create, view, edit, and organize all your recipes in one beautiful interface.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      title: "Staff & Inventory",
      description: "Keep track of your team and kitchen supplies effortlessly.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      title: "Efficiency Tools",
      description: "Get peak efficiency in whatever you make with our smart analytics.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: "Community Sharing",
      description: "Share your creations with friends and build cooking communities.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-background-dark to-surface-dark">
      {}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-secondary/20 blur-3xl animate-float [animation-delay:-1s]" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-third/20 blur-3xl animate-float [animation-delay:-3s]" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-primary/15 blur-3xl animate-float [animation-delay:-5s]" />
        {}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:40px_40px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {}
        <div
          className={`max-w-3xl mx-auto text-center mb-16 md:mb-24 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-sm font-medium text-primary">✦ About Us</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            From a{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-third bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              fun little project
            </span>{" "}
            to a complete kitchen OS.
          </h2>

          <p className="text-text-gray text-lg md:text-xl leading-relaxed">
            {`This started as a fun little project for a friend to store recipes and evolved into a
            lot more. Now it's the all-in-one platform for modern kitchens.`}
          </p>
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:bg-white/10 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {}
              <div className="relative w-14 h-14 mb-5 rounded-xl bg-gradient-to-br from-primary/20 to-dark/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-dark/30 transition-all duration-300">
                <div className="text-primary group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
              </div>

              <h3 className="text-xl font-semibold text-text-light mb-2">
                {feature.title}
              </h3>
              <p className="text-text-gray text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {}
        <div
          className={`max-w-4xl mx-auto mt-20 p-8 md:p-10 rounded-2xl bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 backdrop-blur-sm border border-white/10 transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-center md:text-left">
              <p className="text-text-light text-lg md:text-xl italic">
                “Create, view, edit, and manage all your recipes, staff and inventory.
                Use our tools to help you get peak efficiency in whatever you make.
                Share with friends and create communities.”
              </p>
              <div className="mt-4 h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto md:mx-0" />
            </div>
          </div>
        </div>

        {}
        <div className="absolute -bottom-12 left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none hidden lg:block" />
        <div className="absolute top-20 right-10 w-32 h-32 bg-secondary/5 rounded-full blur-3xl pointer-events-none hidden lg:block" />
      </div>
    </section>
  );
}