"use client";

import { useEffect, useState } from "react";

export function useCounter(target: number, duration = 2000, enabled = true) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let start: number | null = null;
    let frame: number;

    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, enabled]);

  return value;
}
