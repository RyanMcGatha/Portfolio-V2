"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

export default function BackgroundAnimation() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const circles = useMemo(() => {
    if (windowSize.width === 0 || windowSize.height === 0) return [];

    return Array.from({ length: 20 }).map((_, i) => {
      const size = Math.random() * 30 + 10;
      return {
        key: i,
        initialX: Math.random() * windowSize.width,
        initialY: Math.random() * windowSize.height,
        finalX: Math.random() * windowSize.width,
        finalY: Math.random() * windowSize.height,
        scale: Math.random() * 0.5 + 0.5,
        size,
        duration: Math.random() * 15 + 25,
      };
    });
  }, [windowSize]);

  if (windowSize.width === 0 || windowSize.height === 0) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.08 }}
        transition={{ duration: 2 }}
      >
        {circles.map((circle) => (
          <motion.div
            key={circle.key}
            className="absolute rounded-full will-change-transform"
            style={{
              width: `${circle.size}px`,
              height: `${circle.size}px`,
              backgroundColor: `hsl(var(--primary) / 60%)`,
            }}
            initial={{
              x: circle.initialX,
              y: circle.initialY,
              scale: circle.scale,
            }}
            animate={{
              x: circle.finalX,
              y: circle.finalY,
              scale: circle.scale,
            }}
            transition={{
              duration: circle.duration,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
