"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { OutlineButton } from "@/app/components/buttons/OutlineButton";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <OutlineButton
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon className="size-5" />
      ) : (
        <Sun className="size-5" />
      )}
    </OutlineButton>
  );
}
