"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const BackgroundAnimation = dynamic(() => import("./BackgroundAnimation"), {
  ssr: false,
});

export function BackgroundAnimationLazy() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const idleCb =
      (
        window as unknown as {
          requestIdleCallback?: (
            cb: () => void,
            opts?: { timeout: number },
          ) => number;
        }
      ).requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1500));

    const handle = idleCb(() => setShouldLoad(true), { timeout: 3000 });

    return () => {
      const cancel = (
        window as unknown as { cancelIdleCallback?: (handle: number) => void }
      ).cancelIdleCallback;
      if (cancel && typeof handle === "number") cancel(handle);
    };
  }, []);

  if (!shouldLoad) return null;
  return <BackgroundAnimation />;
}
