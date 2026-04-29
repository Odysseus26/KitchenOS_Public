// hooks/useSmoothScroll.ts
import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

// ─── Easing ───────────────────────────────────────────────────────────────────
// Expo-out: near-instant response at the start, long silky deceleration tail.
// This is what gives the "the page is floating" feel — fast initial movement
// that bleeds off smoothly instead of stopping abruptly.
const expoOut = (t: number): number =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      // ── Core feel ────────────────────────────────────────────────────────────
      // 1.1–1.3 is the sweet spot: responsive enough to feel immediate,
      // long enough to feel luxurious. 2.0 feels like wading through water.
      duration: 1.1,
      easing: expoOut,

      // ── Input sensitivity ─────────────────────────────────────────────────
      smoothWheel: true,
      // 1.0 is the natural baseline. Going below 1 makes the page feel
      // resistant — like it doesn't want to scroll. Keep it at 1.
      wheelMultiplier: 1,
      // Touch/trackpad: 2.0 prevents the page feeling sticky on trackpads
      // while still being controllable on touch screens.
      touchMultiplier: 2,

      // ── Other ─────────────────────────────────────────────────────────────
      infinite: false,
    });

    // Store the RAF ID so we can actually cancel it on cleanup.
    // Without this, the loop keeps firing after the component unmounts —
    // a silent memory leak that accumulates across navigations.
    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId); // ← stop the loop first
      lenis.destroy();             // ← then tear down Lenis
    };
  }, []);
}