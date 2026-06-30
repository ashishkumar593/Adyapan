"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context";
import type { UserRole } from "@/types";

export function useAuthGuard(allowedRoles?: UserRole[]) {
  const { role, email } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!email || !role) {
      router.replace("/login");
      return;
    }
    if (allowedRoles && !allowedRoles.includes(role)) {
      const redirect =
        role === "admin" ? "/dashboard/admin" :
        role === "mentor" ? "/dashboard/mentor" :
        "/dashboard/student";
      router.replace(redirect);
    }
  }, [email, role, allowedRoles, router]);

  return { role, email, isReady: Boolean(email && role) };
}
