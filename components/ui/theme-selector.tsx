"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { OutlineButton } from "@/app/components/buttons/OutlineButton";
import { trackEvent } from "@/app/components/util/ConversionTracking";

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render a stable placeholder on the server and during the first client
  // render to avoid hydration mismatches (React error #418). The real icon
  // is swapped in on the client once the theme is known.
  if (!mounted) {
    return (
      <OutlineButton aria-label="Toggle color theme">
        <Sun className="size-5 opacity-0" aria-hidden="true" />
      </OutlineButton>
    );
  }

  const isLight = resolvedTheme === "light";

  return (
    <OutlineButton
      onClick={() => {
        const next = isLight ? "dark" : "light";
        trackEvent("theme_toggle", { theme: next });
        setTheme(next);
      }}
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
    >
      {isLight ? <Moon className="size-5" /> : <Sun className="size-5" />}
    </OutlineButton>
  );
}
