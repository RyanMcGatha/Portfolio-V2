"use client";

import React, { useEffect, useRef } from "react";
import { useAnimation, useInView, motion, Variant } from "framer-motion";

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
  delay = 0.25,
  duration = 0.5,
  direction = "up",
  distance = 75,
  once = true,
  className = "",
  slide = true,
  slideColor = "hsl(var(--primary))",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once });

  const mainControls = useAnimation();
  const slideControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
      slideControls.start("visible");
    } else if (!once) {
      mainControls.start("hidden");
      slideControls.start("hidden");
    }
  }, [isInView, mainControls, once, slideControls]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${width} ${className}`}>
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
        />
      )}
    </div>
  );
};

export default React.memo(Reveal);
