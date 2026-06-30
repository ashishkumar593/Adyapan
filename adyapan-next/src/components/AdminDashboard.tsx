"use client";

import { useState } from "react";
import { useAuthGuard } from "@/hooks";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { adminSidebarItems, adminStats, mockAdminUsers, mockAdminMentors } from "@/data/mockData";

export default function AdminDashboard() {
  const { isReady } = useAuthGuard(["admin"]);
  const [section, setSection] = useState("overview");

  if (!isReady) return null;

  return (
    <DashboardLayout
      role="admin"
      logoHref="/dashboard/admin"
      profileHref="/profile/admin"
      sidebarItems={adminSidebarItems}
      activeSection={section}
      onNavigate={setSection}
    >
      {section === "overview" && (
        <section className="admin-section active-section">
          <div className="dashboard-header">
            <div className="user-welcome"><h1>Admin Overview</h1><p>Platform health, user growth, and real-time metrics.</p></div>
            <div className="dashboard-actions"><span className="live-badge"><i className="fas fa-circle" /> Live</span></div>
          </div>
          <div className="dashboard-grid">
            {adminStats.map(s => <StatCard key={s.label} {...s} />)}
          </div>
          <div className="panel-grid" style={{ marginTop: "1.5rem" }}>
            <div className="panel-card glass">
              <h2 className="panel-title">Quick Actions</h2>
              <div className="quick-actions-grid">
                {[
                  { icon: "fa-user-plus", label: "Add User", sec: "users" },
                  { icon: "fa-user-tie", label: "Invite Mentor", sec: "mentors" },
                  { icon: "fa-crown", label: "Manage Plans", sec: "premium" },
                  { icon: "fa-flag", label: "View Reports", sec: "reports" },
                ].map(a => (
                  <button key={a.label} className="quick-action-btn" onClick={() => setSection(a.sec)}>
                    <i className={`fas ${a.icon}`} /><span>{a.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="panel-card glass">
              <h2 className="panel-title">Platform Status</h2>
              <div className="status-list">
                {[
                  ["API Server", "Operational", "dot-green"],
                  ["Database", "Operational", "dot-green"],
                  ["AI Engine", "Pending", "dot-yellow"],
                  ["Payment Gateway", "Pending", "dot-yellow"],
                  ["Email Service", "Operational", "dot-green"],
                ].map(([l, v, d]) => (
                  <div key={l} className="status-item">
                    <span className={`status-dot ${d}`} /><span className="status-label">{l}</span>
                    <span className={`status-val ${v === "Operational" ? "status-ok" : "status-warn"}`}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {section === "users" && (
        <section className="admin-section active-section">
          <div className="dashboard-header">
            <div className="user-welcome"><h1>Users Management 👥</h1><p>View, manage, and moderate all registered users.</p></div>
          </div>
          <div className="admin-table-card glass">
            <div className="table-scroll">
              <table className="admin-table">
                <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Joined</th><th>Plan</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {mockAdminUsers.map(u => (
                    <tr key={u.id}>
                      <td>{u.id}</td><td>{u.name}</td><td>{u.email}</td><td>{u.joined}</td>
                      <td>{u.plan}</td>
                      <td><span className="status-badge" style={{ background: "rgba(16,185,129,0.15)", color: "#10b981" }}>{u.status}</span></td>
                      <td><button className="admin-action-btn btn-outline">Edit</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-footer"><span className="table-count">{mockAdminUsers.length} users</span></div>
          </div>
        </section>
      )}

      {section === "mentors" && (
        <section className="admin-section active-section">
          <div className="dashboard-header">
            <div className="user-welcome"><h1>Mentors</h1><p>Manage mentor profiles, approvals, and activity.</p></div>
          </div>
          <div className="admin-table-card glass">
            <div className="table-scroll">
              <table className="admin-table">
                <thead><tr><th>#</th><th>Name</th><th>Expertise</th><th>Students</th><th>Rating</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {mockAdminMentors.map(m => (
                    <tr key={m.id}>
                      <td>{m.id}</td><td>{m.name}</td><td>{m.expertise}</td><td>{m.students}</td>
                      <td>{m.rating}</td>
                      <td><span className="status-badge" style={{ background: "rgba(16,185,129,0.15)", color: "#10b981" }}>{m.status}</span></td>
                      <td><button className="admin-action-btn btn-outline">Manage</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {(section === "premium" || section === "revenue" || section === "reports" || section === "settings") && (
        <section className="admin-section active-section">
          <div className="dashboard-header">
            <div className="user-welcome">
              <h1>{section.charAt(0).toUpperCase() + section.slice(1)}</h1>
              <p>This section will be fully functional when backend services are integrated.</p>
            </div>
          </div>
          <div className="panel-card glass">
            <p style={{ color: "var(--text-secondary)" }}>Mock data and UI shell are ready for PostgreSQL + Prisma integration.</p>
          </div>
        </section>
      )}
    </DashboardLayout>
  );
}
