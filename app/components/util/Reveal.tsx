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
  delay = 0.15,
  duration = 0.45,
  direction = "up",
  distance = 50,
  once = true,
  className = "",
  slide = false,
  slideColor = "hsl(var(--primary))",
}) => {
  const ref = useRef<HTMLDivElement>(null);
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
      <div
        ref={ref}
        className={`relative ${slide ? "overflow-hidden" : ""} ${width} ${className}`}
      >
        {children}
      </div>
    );
  }

  return (
    <div
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
            hidden: { left: 0 },
            visible: { left: "100%" },
          }}
          initial="hidden"
          animate={slideControls}
          transition={{ duration: duration * 1.25, ease: "easeInOut" }}
          style={{ backgroundColor: slideColor }}
          className="absolute inset-0 z-20"
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default React.memo(Reveal);
