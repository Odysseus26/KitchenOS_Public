"use client";

import "@/app/globals.css";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {User} from "@supabase/supabase-js"
import { useRouter } from "next/navigation";
import OrganizationPage from "@/app/Organization/page";
import PersonalPage from "@/app/Personal/page";

export default function Homebody({user}:{user:User}) {
  const [isVisible, setIsVisible] = useState(false);
  const [actionable,setActionable] = useState<boolean>(false);
  const [action,setAction] = useState<string>()
  const personalRef = useRef<HTMLDivElement>(null);
  const organizationRef = useRef<HTMLDivElement>(null);
  const router = useRouter()

  useEffect(() => {
    setIsVisible(true);
  }, []);

  function remoteRedirect(site:string){
    setAction(site)
    setActionable(true);
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, cardId: string) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (centerY - e.clientY) / (rect.height / 2);
    const tiltX = deltaY * 15;
    const tiltY = deltaX * 15;

    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
    card.style.transition = "transform 0.1s ease-out";
  };

  const handleMouseLeave = (cardId: string) => {
    const card = cardId === "personal" ? personalRef.current : organizationRef.current;
    if (card) {
      card.style.transform = "";
      card.style.transition = "transform 0.3s ease-out";
    }
  };

  if(actionable){
    if(action == "Organization"){
        return <OrganizationPage/>
    }
    if(action == "Personal"){
        return <PersonalPage/>
    }
  }

  return (
    <>
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]">

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

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <div
          className={`grid w-full max-w-5xl grid-cols-1 gap-8 transition-all duration-700 md:grid-cols-2 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >

          <div
            ref={personalRef}
            onMouseMove={(e) => handleMouseMove(e, "personal")}
            onMouseLeave={() => handleMouseLeave("personal")}
            className="group relative rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:shadow-primary/20"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div
              className="absolute inset-0 rounded-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle at var(--glow-x, 50%) var(--glow-y, 50%), var(
                  "--PRIMARY_COLOR"
                ), transparent 70%)`,
              }}
            />
            <div className="flex flex-col items-center space-y-6 text-center">
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full"
                style={{ backgroundColor: `var("--PRIMARY_COLOR")` }}
              >
                <svg className="h-10 w-10" style={{ color: `var(--PRIMARY_COLOR)` }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Personal
                </span>
              </h2>
              <p className="text-sm text-text-gray">
                Manage your own recipes, meal plans, and kitchen insights.
              </p>
              <div
              onClick={()=>{router.push("/Personal")}}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-2 text-sm font-medium text-text-light transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:text-primary"
              >
                Explore →
                </div>   
            </div>
          </div>


          <div
            ref={organizationRef}
            onMouseMove={(e) => handleMouseMove(e, "organization")}
            onMouseLeave={() => handleMouseLeave("organization")}
            className="group relative rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:shadow-primary/20"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div
              className="absolute inset-0 rounded-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle at var(--glow-x, 50%) var(--glow-y, 50%), var(
                  "--SECONDARD_COLOR"
                ), transparent 70%)`,
              }}
            />
            <div className="flex flex-col items-center space-y-6 text-center">
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full"
                style={{ backgroundColor: `var("--SECONDARD_COLOR")` }}
              >
                <svg className="h-10 w-10" style={{ color: `var(--SECONDARD_COLOR)` }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                <span className="bg-gradient-to-r from-secondary to-third bg-clip-text text-transparent">
                  Organization
                </span>
              </h2>
              <p className="text-sm text-text-gray">
                Collaborate with team members, manage inventory, and scale your culinary business.
              </p>
              <div
              onClick={()=>router.push("/Organization")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-2 text-sm font-medium text-text-light transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:text-primary"
              >
                Explore →
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 w-1/3 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </section>
    </>
  );
}