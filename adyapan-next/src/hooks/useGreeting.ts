"use client";

import { useMemo } from "react";

export function useGreeting(name: string) {
  return useMemo(() => {
    const hour = new Date().getHours();
    const prefix =
      hour < 12 ? "Good Morning" :
      hour < 17 ? "Good Afternoon" :
      "Good Evening";
    return `${prefix}, ${name || "Student"}`;
  }, [name]);
}
