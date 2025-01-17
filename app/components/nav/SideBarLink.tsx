import { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Props {
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
  href: string;
  children: string;
  value: string;
  icon: React.ReactNode;
}

const MotionLink = motion(Link);

export const SideBarLink = ({
  setSelected,
  selected,
  children,
  href,
  value,
  icon,
}: Props) => {
  return (
    <MotionLink
      initial={{ x: -70 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      href={href}
      onClick={() => {
        setSelected(value);
      }}
      className={`group flex flex-col items-center justify-center h-20 w-full transition-all font-heading ${
        selected === value
          ? "bg-primary/10 border-r-2 border-primary text-primary"
          : "border-transparent hover:bg-accent/50 text-muted-foreground hover:text-foreground"
      }`}
    >
      <span className="text-xl mb-1">{icon}</span>
      <span className="text-xs">{children}</span>
      {selected === value && (
        <motion.div
          className="absolute left-0 w-1 h-8 bg-primary rounded-[--radius]"
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
