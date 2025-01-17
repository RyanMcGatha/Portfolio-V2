"use client";

import * as React from "react";
import { Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { OutlineButton } from "@/app/components/buttons/OutlineButton";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <OutlineButton>
          <Palette className="size-5" />
          <span className="sr-only">Toggle theme</span>
        </OutlineButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-40 rounded-[--radius] border-primary bg-background p-2 font-body"
      >
        {[
          "light",
          "dark",
          "sepia",
          "neon",
          "forest",
          "ocean",
          "sunset",
          "monochrome",
        ].map((themeName) => (
          <DropdownMenuItem
            key={themeName}
            onClick={() => setTheme(themeName)}
            className={`flex cursor-pointer items-center gap-2 rounded-[--radius] px-4 py-2 text-sm transition-colors
              ${
                theme === themeName
                  ? "bg-primary text-background"
                  : "text-muted-foreground hover:bg-primary hover:text-background"
              }`}
          >
            {themeName
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
