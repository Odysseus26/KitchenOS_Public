"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

import start1 from "./static/start_1.jpeg";
import start2 from "./static/start_2.jpeg";
import start3 from "./static/start_3.jpeg";
import start4 from "./static/start_4.jpeg";
import start5 from "./static/start_5.jpeg";
import start6 from "./static/start_6.webp";


const images = [
  { src: start1, alt: "Recipe preparation" },
  { src: start2, alt: "Kitchen inventory" },
  { src: start3, alt: "Cooking process" },
  { src: start4, alt: "Restaurant management" },
  { src: start5, alt: "Staff collaboration" },
  { src: start6, alt: "Recipe collection" },
];

const features = [
  { num: "01", text: "Can't remember all your Recipes? We got you." },
  { num: "02", text: "Need to keep track of your inventory? No problem." },
  { num: "03", text: "Easy to use for admins, managers, and staff alike." },
];

const stats = [
  { label: "Active Chefs", value: "10k+" },
  { label: "Recipes Shared", value: "50k+" },
  { label: "5-Star Rating", value: "4.9" },
];

export default function StartSection_Welcome() {
  const [activeImage, setActiveImage] = useState(0);


  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => link.remove();
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-background-dark">

      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "180px 180px",
        }}
      />


      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-float absolute -right-24 -top-24 h-[700px] w-[700px] rounded-full bg-primary/10 blur-[130px]" />
        <div className="animate-float absolute -left-32 top-[35%] h-[500px] w-[500px] rounded-full bg-secondary/10 blur-[110px] [animation-delay:-3s]" />
        <div className="animate-float absolute bottom-[-15%] right-[25%] h-[450px] w-[450px] rounded-full bg-third/10 blur-[110px] [animation-delay:-6s]" />
      </div>


      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />


      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-28 md:pt-36 lg:pt-44">
        <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-center lg:gap-20">


          <div className="flex-1 space-y-10 text-center lg:text-left">


            <div className="inline-flex items-center gap-3">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span
                className="text-xs uppercase tracking-[0.2em] text-text-gray"
                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
              >
                Limited Beta — Free Version
              </span>
            </div>


            <div>
              <p
                className="text-xl leading-none text-text-gray md:text-2xl"
                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
              >
                Get Ready to
              </p>
              <h1
                className="leading-[0.9] tracking-wide"
                style={{
                  fontFamily: "'Bebas Neue', 'Arial Black', sans-serif",
                  fontSize: "clamp(6rem, 14vw, 12rem)",
                  background:
                    "linear-gradient(90deg, #E50914 0%, #F72731 35%, #09E56C 70%, #0982E5 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  backgroundSize: "200% auto",
                  animation: "gradient 8s linear infinite",
                }}
              >
                COOK.
              </h1>
            </div>


            <div className="space-y-5 pt-2">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group flex animate-fadeIn items-start gap-4 opacity-0 [animation-fill-mode:forwards]"
                  style={{ animationDelay: `${index * 0.15 + 0.3}s` }}
                >

                  <span
                    className="mt-px flex-shrink-0 text-xs font-medium tabular-nums text-primary"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {feature.num}
                  </span>


                  <div className="mt-1 h-5 w-px flex-shrink-0 bg-white/15" />


                  <p
                    className="text-base leading-relaxed text-text-gray transition-colors duration-300 group-hover:text-text-light md:text-lg"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {feature.text}
                  </p>
                </div>
              ))}
            </div>


            <div className="flex items-stretch border-t border-white/10 pt-7">
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
          </div>


          <div className="relative w-full max-w-[560px] flex-1">


            <div
              className="absolute inset-0 rounded-2xl border border-primary/25 bg-primary/5"
              style={{ transform: "translate(14px, 14px) rotate(1.8deg)" }}
            />


            <div
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"
              style={{ transform: "rotate(-0.4deg)" }}
            >

              <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.04] px-4 py-[10px]">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                </div>
                <div className="mx-4 flex flex-1 items-center justify-center rounded-full border border-white/10 bg-white/5 py-1">
                  <span
                    className="text-[10px] tracking-widest text-text-gray"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    chefhub.app
                  </span>
                </div>
              </div>


              <div className="relative aspect-[4/3] overflow-hidden">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-700 ${
                      index === activeImage
                        ? "scale-100 opacity-100"
                        : "pointer-events-none scale-[1.03] opacity-0"
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                ))}

                {}
                <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`rounded-full transition-all duration-300 ${
                        index === activeImage
                          ? "h-1.5 w-6 bg-primary"
                          : "h-1.5 w-1.5 bg-white/35 hover:bg-white/60"
                      }`}
                    />
                  ))}
                </div>


                <div className="absolute bottom-4 right-4 z-20">
                  <span
                    className="text-[9px] uppercase tracking-[0.2em] text-white/50"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {images[activeImage].alt}
                  </span>
                </div>
              </div>
            </div>


            <div
              className="absolute -left-9 top-14 hidden rounded-xl border border-white/10 bg-surface-dark px-3.5 py-2.5 shadow-2xl backdrop-blur-md lg:block"
              style={{ transform: "rotate(-2.5deg)" }}
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-primary/20">
                  <svg className="h-3.5 w-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <p
                    className="text-xs font-medium text-text-light"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    50k+ Recipes
                  </p>
                  <p
                    className="text-[10px] text-text-gray"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                  >
                    Community library
                  </p>
                </div>
              </div>
            </div>


            <div
              className="absolute -right-7 bottom-16 hidden rounded-xl border border-white/10 bg-surface-dark px-3.5 py-2.5 shadow-2xl backdrop-blur-md lg:block"
              style={{ transform: "rotate(2deg)" }}
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-secondary/20">
                  <svg className="h-3.5 w-3.5 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <p
                    className="text-xs font-medium text-text-light"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    4.9 / 5.0
                  </p>
                  <p
                    className="text-[10px] text-text-gray"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                  >
                    User rating
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 animate-bounce flex-col items-center gap-2 text-text-gray/40">
        <span
          className="text-[9px] uppercase tracking-[0.35em]"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Scroll
        </span>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}