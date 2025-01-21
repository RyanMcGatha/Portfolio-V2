import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

export default function BackgroundAnimation() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Update window dimensions on mount and whenever resized
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    // Initialize on mount
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Memoize an array of circle configs so they don't re-randomize on each render
  const circles = useMemo(() => {
    if (windowSize.width === 0 || windowSize.height === 0) return [];

    return Array.from({ length: 50 }).map((_, i) => {
      const size = Math.random() * 20 + 10;
      return {
        key: i,
        initialX: Math.random() * windowSize.width,
        initialY: Math.random() * windowSize.height,
        finalX: Math.random() * windowSize.width,
        finalY: Math.random() * windowSize.height,
        scale: Math.random() * 0.5 + 0.5,
        size,
        duration: Math.random() * 10 + 20,
      };
    });
  }, [windowSize]);

  // If dimensions are not set yet, don't render anything
  if (windowSize.width === 0 || windowSize.height === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Fade the entire container in over 2 seconds to 0.1 opacity */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2 }}
      >
        {circles.map((circle) => (
          <motion.div
            key={circle.key}
            className="absolute rounded-full"
            style={{
              width: `${circle.size}px`,
              height: `${circle.size}px`,
              backgroundColor: `hsl(var(--muted-foreground))`,
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
