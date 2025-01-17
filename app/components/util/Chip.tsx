"use client";

import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

interface ChipProps {
  children: ReactNode;
  className?: string;
}

export const Chip = ({ children, className }: ChipProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={twMerge(
        `relative z-0 flex items-center gap-2 overflow-hidden rounded-[--radius] border-[1px] 
        border-primary px-4 py-2 font-body text-sm
        text-primary transition-all duration-300
        bg-background
        
        before:absolute before:inset-0
        before:-z-10 before:translate-x-[150%]
        before:translate-y-[150%] before:scale-[2.5]
        before:rounded-[100%] before:bg-primary
        before:transition-transform before:duration-1000
        before:content-[""]

        hover:text-background
        hover:before:translate-x-[0%]
        hover:before:translate-y-[0%]
        active:scale-95`,
        className
      )}
    >
      {children}
    </motion.div>
  );
};
