"use client";

import { useAuthGuard } from "@/hooks";
import { useAuth } from "@/lib/context";
import DashboardLayout from "@/components/DashboardLayout";
import { adminSidebarItems } from "@/data/mockData";

export default function AdminProfileView() {
  const { isReady } = useAuthGuard(["admin"]);
  const { name, email } = useAuth();

  if (!isReady) return null;

  return (
    <DashboardLayout role="admin" logoHref="/dashboard/admin" profileHref="/profile/admin" sidebarItems={adminSidebarItems}>
      <div className="profile-page-header">
        <div className="profile-avatar-large"><i className="fas fa-shield-halved" /></div>
        <div className="profile-header-info">
          <h1>{name || "System Admin"}</h1>
          <p>{email || "admin@adyapan.ai"}</p>
          <div className="profile-meta-tags"><span className="profile-tag"><i className="fas fa-shield-halved" /> Platform Administrator</span></div>
        </div>
      </div>
      <div className="panel-card glass" style={{ maxWidth: 720 }}>
        <h2 className="panel-title">Admin Profile</h2>
        <div className="profile-info-list">
          <div className="profile-info-item"><span>Role</span><strong>Administrator</strong></div>
          <div className="profile-info-item"><span>Access Level</span><strong>Full Platform Access</strong></div>
          <div className="profile-info-item"><span>Status</span><strong style={{ color: "#10b981" }}>Active</strong></div>
        </div>
      </div>
    </DashboardLayout>
  );
}
