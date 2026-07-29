"use client";

import { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Props {
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
  href: string;
  children: string;
  value: string;
}

const MotionLink = motion.create(Link);

export const SideBarLink = ({
  setSelected,
  selected,
  children,
  href,
  value,
}: Props) => {
  const isActive = selected === value;

  return (
    <MotionLink
      initial={{ x: -70 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      href={href}
      data-nav="sidebar"
      onClick={() => {
        setSelected(value);
      }}
      aria-current={isActive ? "true" : undefined}
      className={`group relative flex flex-col items-center justify-center h-24 w-full transition-all font-heading focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-inset outline-none ${
        isActive
          ? "bg-foreground/5 text-foreground"
          : "border-transparent hover:bg-muted text-muted-foreground hover:text-foreground"
      }`}
    >
      <span className="text-sm font-heading writing-vertical">{children}</span>
      {isActive && (
        <motion.div
          className="absolute left-0 w-1 h-8 rounded-r bg-foreground"
          layoutId="activeSection"
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 30,
          }}
        />
      )}
    </MotionLink>
  );
};
