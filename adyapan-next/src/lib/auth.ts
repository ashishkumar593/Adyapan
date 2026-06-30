/**
 * Auth helpers — placeholder for future NextAuth/Auth.js integration.
 * Currently the app uses React Context + mockUsers in mockData.ts.
 */
import type { UserRole } from "@/types";

export function getDashboardPath(role: UserRole): string {
  switch (role) {
    case "admin": return "/dashboard/admin";
    case "mentor": return "/dashboard/mentor";
    default: return "/dashboard/student";
  }
}

export function getProfilePath(role: UserRole): string {
  switch (role) {
    case "admin": return "/profile/admin";
    case "mentor": return "/profile/mentor";
    default: return "/profile/student";
  }
}
