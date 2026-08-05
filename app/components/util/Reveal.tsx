"use client";

import React, { useEffect, useRef } from "react";
import { useAnimation, useInView, useReducedMotion, motion, Variant } from "framer-motion";

interface RevealProps {
  children: React.ReactNode;
  width?: "w-fit" | "w-full" | "w-auto";
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  once?: boolean;
  className?: string;
  slide?: boolean;
  slideColor?: string;
  /** Outer wrapper tag. Use "li" inside <ul>/<ol> so the list's direct
   * children stay <li> elements instead of the wrapping <div>. */
  as?: "div" | "li";
}

const directionVariants = {
  up: (distance: number): Variant => ({ y: distance }),
  down: (distance: number): Variant => ({ y: -distance }),
  left: (distance: number): Variant => ({ x: distance }),
  right: (distance: number): Variant => ({ x: -distance }),
};

export const Reveal: React.FC<RevealProps> = ({
  children,
  width = "w-fit",
  delay = 0.25,
  duration = 0.5,
  direction = "up",
  distance = 75,
  once = true,
  className = "",
  slide = true,
  slideColor = "hsl(var(--primary))",
  as: Wrapper = "div",
}) => {
  const ref = useRef<HTMLDivElement & HTMLLIElement>(null);
  const isInView = useInView(ref, { once, margin: "-50px" });
  const prefersReducedMotion = useReducedMotion();

  const mainControls = useAnimation();
  const slideControls = useAnimation();

  useEffect(() => {
    if (prefersReducedMotion) {
      mainControls.set("visible");
      slideControls.set("visible");
      return;
    }
    if (isInView) {
      mainControls.start("visible");
      if (slide) slideControls.start("visible");
    } else if (!once) {
      mainControls.start("hidden");
      if (slide) slideControls.start("hidden");
    }
  }, [isInView, mainControls, once, slideControls, slide, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <Wrapper
        ref={ref}
        className={`relative ${slide ? "overflow-hidden" : ""} ${width} ${className}`}
      >
        {children}
      </Wrapper>
    );
  }

  return (
    <Wrapper
      ref={ref}
      className={`relative ${slide ? "overflow-hidden" : ""} ${width} ${className}`}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, ...directionVariants[direction](distance) },
          visible: {
            opacity: 1,
            [direction === "up" || direction === "down" ? "y" : "x"]: 0,
          },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration, delay }}
        style={{ willChange: "transform, opacity" }}
      >
        {children}
      </motion.div>
      {slide && (
        <motion.div
          variants={{
            hidden: { x: "0%" },
            visible: { x: "100%" },
          }}
          initial="hidden"
          animate={slideControls}
          transition={{ duration: duration * 1.25, ease: "easeInOut" }}
          style={{ backgroundColor: slideColor, willChange: "transform" }}
          className="absolute inset-0 z-20"
          aria-hidden="true"
        />
      )}
    </Wrapper>
  );
};

export default React.memo(Reveal);
