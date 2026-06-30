"use client";

import DashboardTopNav from "./DashboardTopNav";
import Sidebar from "./Sidebar";
import type { SidebarItemConfig } from "@/data/mockData";
import type { UserRole } from "@/types";

interface DashboardLayoutProps {
  role: UserRole;
  logoHref: string;
  profileHref: string;
  sidebarItems: SidebarItemConfig[];
  activeSection?: string;
  onNavigate?: (section: string) => void;
  showStudentNav?: boolean;
  children: React.ReactNode;
}

export default function DashboardLayout({
  role, logoHref, profileHref, sidebarItems, activeSection, onNavigate, showStudentNav, children,
}: DashboardLayoutProps) {
  return (
    <div className="dashboard-layout">
      <DashboardTopNav role={role} logoHref={logoHref} profileHref={profileHref} showStudentNav={showStudentNav} />
      <Sidebar items={sidebarItems} activeSection={activeSection} onNavigate={onNavigate} logoHref={logoHref} />
      <main className="main-content">{children}</main>
    </div>
  );
}
