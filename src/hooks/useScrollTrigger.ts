import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useScrollTrigger(
  animationFn: (el: HTMLElement) => void,
  deps: React.DependencyList = []
) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    animationFn(el);

    return () => {
      // Clean up ScrollTrigger instances
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === el) {
          trigger.kill();
        }
      });
    };
  }, deps);

  return ref;
}

// Preset animations
export function fadeUpOnScroll(el: HTMLElement, delay = 0) {
  gsap.fromTo(
    el,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay,
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        end: "top 50%",
        scrub: false,
        markers: false,
      },
    }
  );
}

export function scaleOnScroll(el: HTMLElement) {
  gsap.fromTo(
    el,
    { opacity: 0, scale: 0.95 },
    {
      opacity: 1,
      scale: 1,
      duration: 0.9,
      scrollTrigger: {
        trigger: el,
        start: "top 75%",
        end: "top 45%",
        scrub: false,
      },
    }
  );
}

export function slideInFromLeftOnScroll(el: HTMLElement) {
  gsap.fromTo(
    el,
    { opacity: 0, x: -60 },
    {
      opacity: 1,
      x: 0,
      duration: 0.9,
      scrollTrigger: {
        trigger: el,
        start: "top 75%",
        end: "top 45%",
        scrub: false,
      },
    }
  );
}

export function slideInFromRightOnScroll(el: HTMLElement) {
  gsap.fromTo(
    el,
    { opacity: 0, x: 60 },
    {
      opacity: 1,
      x: 0,
      duration: 0.9,
      scrollTrigger: {
        trigger: el,
        start: "top 75%",
        end: "top 45%",
        scrub: false,
      },
    }
  );
}

export function staggerChildrenOnScroll(el: HTMLElement) {
  const children = el.querySelectorAll("> *");
  gsap.fromTo(
    children,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      scrollTrigger: {
        trigger: el,
        start: "top 75%",
        end: "top 45%",
        scrub: false,
      },
    }
  );
}
