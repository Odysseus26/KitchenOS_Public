"use client"

import StartSection_Welcome from "./Section_1";
import StartSection_About from "./Section_2";
import StartSection_Sign from "./Section_3";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

export default function StartPage() {
  //useSmoothScroll(); // <-- activates smooth scroll only on this page

  return (
    <>
      <StartSection_Welcome />
      <StartSection_About />
      <StartSection_Sign/>
    </>
  );
}