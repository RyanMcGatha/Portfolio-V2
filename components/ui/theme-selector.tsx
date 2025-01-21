"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { OutlineButton } from "@/app/components/buttons/OutlineButton";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <OutlineButton
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? (
        <Moon className="size-5" />
      ) : (
        <Sun className="size-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </OutlineButton>
  );
}
