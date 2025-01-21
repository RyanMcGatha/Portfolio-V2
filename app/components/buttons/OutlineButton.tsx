import React, { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  children: ReactNode;
  className?: string;
  inverted?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const OutlineButton = ({
  children,
  className,
  inverted = false,
  ...rest
}: Props) => {
  return (
    <button
      className={twMerge(
        `relative z-0 flex items-center gap-2 overflow-hidden rounded-[--radius] border-2 
        ${
          inverted
            ? "border-background text-background"
            : "border-primary text-primary"
        } px-4 py-2 font-heading text-sm
        transition-all duration-300
        
        before:absolute before:inset-0
        before:-z-10 before:translate-x-[150%]
        before:translate-y-[150%] before:scale-[2.5]
        before:rounded-[100%] ${
          inverted ? "before:bg-background" : "before:bg-primary"
        }
        before:transition-transform before:duration-1000
        before:content-[""]

        ${inverted ? "hover:text-primary" : "hover:text-background"}
        hover:before:translate-x-[0%]
        hover:before:translate-y-[0%]
        active:scale-95`,
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};
