"use client";

import { useAuthGuard, useGreeting } from "@/hooks";
import { useAuth, useToast } from "@/lib/context";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import {
  studentSidebarItems, studentMetrics, activeCourses, skillBadges,
  internshipRecommendations, recentApplications, quickActions, recentActivities,
} from "@/data/mockData";

export default function StudentDashboard() {
  const { isReady } = useAuthGuard(["student"]);
  const { name } = useAuth();
  const { showToast } = useToast();
  const greeting = useGreeting(name);

  if (!isReady) return null;

  const comingSoon = (label: string) => () => showToast(`${label} will be available in the upcoming release!`);

  return (
    <DashboardLayout
      role="student"
      logoHref="/dashboard/student"
      profileHref="/profile/student"
      sidebarItems={studentSidebarItems}
      showStudentNav
    >
      <div className="welcome-banner glass-card">
        <div className="welcome-banner-content">
          <h1>{greeting}</h1>
          <p>Continue your learning journey and track your placement readiness.</p>
          <div className="banner-profile-completion">
            <div className="banner-completion-text">Profile Completion: <span className="completion-val">85%</span></div>
            <div className="progress-bar-linear banner-bar">
              <div className="progress-fill-linear" style={{ width: "85%" }} />
            </div>
          </div>
        </div>
        <div className="banner-actions">
          <button className="banner-btn btn-primary" onClick={comingSoon("Continue Learning")}>Continue Learning</button>
          <button className="banner-btn btn-outline" onClick={comingSoon("Resume Analysis")}>Resume Analysis</button>
          <button className="banner-btn btn-outline" onClick={comingSoon("Start Interview")}>Start Interview</button>
        </div>
      </div>

      <div className="dashboard-grid key-metrics-grid">
        {studentMetrics.map(m => (
          <StatCard key={m.label} {...m} />
        ))}
      </div>

      <div className="dashboard-layout-grid">
        <div className="layout-column">
          <div className="panel-card glass">
            <h2 className="panel-title">Learning Progress</h2>
            <div className="card-progress-section">
              <div className="progress-info"><span>Overall Learning Progress</span><span className="progress-percent">72%</span></div>
              <div className="progress-bar-linear"><div className="progress-fill-linear" style={{ width: "72%" }} /></div>
            </div>
            <div className="compact-widget-list" style={{ marginTop: "1rem" }}>
              {[["Notes Generated", "56"], ["MCQs Practiced", "420"], ["Assignments Created", "18"], ["PPTs Generated", "12"], ["Coding Problems Solved", "134"]].map(([l, v]) => (
                <div key={l} className="compact-widget-item"><span>{l}</span><strong>{v}</strong></div>
              ))}
            </div>
          </div>
          <div className="panel-card glass">
            <h2 className="panel-title">Coding Performance</h2>
            <div className="compact-widget-list">
              {[["DSA Questions Solved", "145"], ["Coding Assignments", "28"], ["Projects Completed", "6"], ["GitHub Portfolio Score", "80%"]].map(([l, v]) => (
                <div key={l} className="compact-widget-item"><span>{l}</span><strong style={l.includes("GitHub") ? { color: "var(--primary)" } : undefined}>{v}</strong></div>
              ))}
            </div>
          </div>
          <div className="panel-card glass">
            <h2 className="panel-title">Active Courses</h2>
            <div className="active-courses-list">
              {activeCourses.map(c => (
                <div key={c.name} className="course-progress-item">
                  <div className="course-info"><span className="course-name">{c.name}</span><span className="course-val">{c.progress}%</span></div>
                  <div className="progress-bar-linear"><div className="progress-fill-linear" style={{ width: `${c.progress}%`, background: c.color }} /></div>
                  <div className="course-meta">Next up: {c.next}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="panel-card glass">
            <h2 className="panel-title">Skills & Badges</h2>
            <div className="skills-badges-list">
              {skillBadges.map(b => (
                <div key={b.title} className="skill-badge-item">
                  <div className="badge-icon-wrapper" style={{ color: b.color, background: b.bg }}><i className={b.iconClass} /></div>
                  <div className="badge-details">
                    <div className="badge-title">{b.title}</div>
                    <div className="badge-level">{b.level}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="layout-column">
          <div className="panel-card glass flagship-card">
            <h2 className="panel-title" style={{ marginBottom: "0.5rem" }}>Placement Readiness Score</h2>
            <div className="flagship-gauge-container">
              <div className="circular-gauge" style={{ background: "conic-gradient(var(--primary) 82%, var(--border-color) 0)" }}>
                <div className="circular-gauge-inner">
                  <span className="gauge-value">82%</span>
                  <span className="gauge-label">Ready</span>
                </div>
              </div>
            </div>
            <div className="breakdown-list">
              {[["Resume", 78], ["Interview", 84], ["Coding", 80], ["Aptitude", 75], ["Projects", 90]].map(([l, v]) => (
                <div key={l} className="breakdown-item">
                  <span>{l}</span>
                  <span className="breakdown-fill"><div className="fill-inner" style={{ width: `${v}%` }} /></span>
                  <strong>{v}%</strong>
                </div>
              ))}
            </div>
          </div>
          <div className="panel-card glass">
            <h2 className="panel-title">Recommended Internships</h2>
            <div className="internships-list">
              {internshipRecommendations.map(i => (
                <div key={i.company} className="internship-item">
                  <div className="internship-company-logo" style={{ background: i.bg, color: i.color }}><i className={i.iconClass} /></div>
                  <div className="internship-details">
                    <div className="internship-role">{i.role}</div>
                    <div className="internship-meta">{i.company} • {i.meta}</div>
                  </div>
                  <span className="internship-apply-badge" onClick={comingSoon("Apply")} role="button" tabIndex={0}>Apply</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="layout-column">
          <div className="panel-card glass">
            <h2 className="panel-title">Applications Overview</h2>
            <div className="application-summary-grid">
              {[["8", "Internships"], ["14", "Jobs"], ["4", "Shortlisted"], ["2", "Interviews"]].map(([v, l]) => (
                <div key={l} className="app-metric-item"><strong>{v}</strong><span>{l}</span></div>
              ))}
            </div>
            <div className="recent-applications-list" style={{ marginTop: "1rem" }}>
              {recentApplications.map(a => (
                <div key={a.role} className="recent-app-item">
                  <div className="app-details-header">
                    <strong>{a.role}</strong>
                    <span className="status-badge" style={{ background: a.statusBg, color: a.statusColor }}>{a.status}</span>
                  </div>
                  <div className="app-details-meta">{a.meta}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="panel-card glass">
            <h2 className="panel-title">Quick Actions</h2>
            <div className="quick-actions-grid">
              {quickActions.map(a => (
                <button key={a.label} className="quick-action-btn" onClick={comingSoon(a.label)}>
                  <i className={`fas ${a.iconClass}`} /><span>{a.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="panel-card glass">
            <h2 className="panel-title">Recent Activity</h2>
            <div className="activity-list">
              {recentActivities.map((a, i) => (
                <div key={i} className="activity-item">
                  <div className="activity-dot" style={{ background: a.color }} />
                  <div className="activity-details"><p>{a.title}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
