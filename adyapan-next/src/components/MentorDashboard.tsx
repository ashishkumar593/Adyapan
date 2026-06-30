"use client";

import { useState } from "react";
import { useAuthGuard } from "@/hooks";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import {
  mentorSidebarItems, mentorStats, mockMentorStudents, mockMentorReviews, mockSessions,
} from "@/data/mockData";

export default function MentorDashboard() {
  const { isReady } = useAuthGuard(["mentor"]);
  const [section, setSection] = useState("overview");

  if (!isReady) return null;

  const avgRating = mockMentorReviews.length
    ? (mockMentorReviews.reduce((s, r) => s + r.rating, 0) / mockMentorReviews.length).toFixed(1)
    : "0.0";

  return (
    <DashboardLayout
      role="mentor"
      logoHref="/dashboard/mentor"
      profileHref="/profile/mentor"
      sidebarItems={mentorSidebarItems}
      activeSection={section}
      onNavigate={setSection}
    >
      {section === "overview" && (
        <section className="mentor-section active-section">
          <div className="dashboard-header">
            <div className="user-welcome">
              <h1>Welcome back, Mentor!</h1>
              <p>Here&apos;s a snapshot of your students and mentoring activity.</p>
            </div>
          </div>
          <div className="dashboard-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            {mentorStats.map(s => <StatCard key={s.label} {...s} />)}
          </div>
        </section>
      )}

      {section === "students" && (
        <section className="mentor-section active-section">
          <div className="dashboard-header">
            <div className="user-welcome"><h1>My Students</h1><p>Track student progress and manage assignments.</p></div>
          </div>
          <div className="admin-table-card glass">
            <div className="table-scroll">
              <table className="admin-table">
                <thead>
                  <tr><th>#</th><th>Student</th><th>Goal</th><th>Progress</th><th>Last Session</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {mockMentorStudents.map(s => (
                    <tr key={s.id}>
                      <td>{s.id}</td><td>{s.studentName}</td><td>{s.goal}</td>
                      <td>{s.progress}%</td><td>{s.lastSession}</td>
                      <td><span className="status-badge" style={{ background: "rgba(16,185,129,0.15)", color: "#10b981" }}>{s.status}</span></td>
                      <td><button className="admin-action-btn btn-outline">View</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {section === "feedback" && (
        <section className="mentor-section active-section">
          <div className="dashboard-header">
            <div className="user-welcome"><h1>Feedback &amp; Reviews</h1><p>See what students say about your sessions.</p></div>
          </div>
          <div className="panel-grid">
            <div className="panel-card glass">
              <h2 className="panel-title">Rating Summary</h2>
              <div className="rating-summary">
                <div className="big-rating">{avgRating}</div>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.82rem" }}>Based on {mockMentorReviews.length} reviews</div>
              </div>
            </div>
            <div className="panel-card glass">
              <h2 className="panel-title">Recent Reviews</h2>
              {mockMentorReviews.map(r => (
                <div key={r.id} className="review-card" style={{ marginBottom: "1rem" }}>
                  <div className="review-header"><strong>{r.studentName}</strong><span>{"★".repeat(r.rating)}</span></div>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{r.comment}</p>
                  <small style={{ color: "var(--text-muted)" }}>{r.date}</small>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {section === "messages" && (
        <section className="mentor-section active-section">
          <div className="dashboard-header">
            <div className="user-welcome"><h1>Messages</h1><p>Communicate with your assigned students.</p></div>
          </div>
          <div className="panel-card glass">
            <p style={{ color: "var(--text-secondary)" }}>Chat integration will be available when backend is connected.</p>
          </div>
        </section>
      )}

      {section === "performance" && (
        <section className="mentor-section active-section">
          <div className="dashboard-header">
            <div className="user-welcome"><h1>Performance</h1><p>Your teaching analytics and student outcomes.</p></div>
          </div>
          <div className="panel-card glass">
            <h2 className="panel-title">Upcoming Sessions</h2>
            {mockSessions.map(s => (
              <div key={s.id} className="compact-widget-item" style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0" }}>
                <span>{s.studentName} — {s.topic}</span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{s.dateTime}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </DashboardLayout>
  );
}
