"use client";

import { useState } from "react";
import { useAuthGuard } from "@/hooks";
import { useAuth, useToast } from "@/lib/context";
import DashboardLayout from "@/components/DashboardLayout";
import ProfileCard from "@/components/ProfileCard";
import { studentSidebarItems, defaultStudentProfile } from "@/data/mockData";
import type { StudentProfile } from "@/types";

export default function StudentProfileView() {
  const { isReady } = useAuthGuard(["student"]);
  const { name, email } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<StudentProfile>({ ...defaultStudentProfile, name: name || defaultStudentProfile.name, email: email || defaultStudentProfile.email });
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);

  if (!isReady) return null;

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({ ...profile, ...form, profile: { ...profile.profile, ...form.profile } });
    setEditing(false);
    showToast("Profile updated successfully!");
  };

  const skills = profile.profile.skills ? profile.profile.skills.split(",").map(s => s.trim()).filter(Boolean) : [];

  return (
    <DashboardLayout role="student" logoHref="/dashboard/student" profileHref="/profile/student" sidebarItems={studentSidebarItems} showStudentNav>
      <div className="profile-page-header">
        <div className="profile-avatar-large"><i className="fas fa-user" /></div>
        <div className="profile-header-info">
          <h1>{profile.name}</h1>
          <p>{profile.email}</p>
          <div className="profile-meta-tags">
            <span className="profile-tag"><i className="fas fa-university" /> {profile.college}</span>
            <span className="profile-tag"><i className="fas fa-graduation-cap" /> {profile.branch} • {profile.year}</span>
            <span className="profile-tag"><i className="fas fa-bullseye" /> {profile.profile.careerGoal}</span>
          </div>
        </div>
        <button className="btn btn-primary profile-edit-toggle" onClick={() => { setForm(profile); setEditing(!editing); }}>
          <i className={`fas ${editing ? "fa-times" : "fa-pen"}`} /> {editing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <div className="profile-stats-row">
        <ProfileCard label="Resume Score" value={`${profile.stats.resumeScore}/100`} iconClass="fa-file-invoice" color="#3b82f6" bg="rgba(59,130,246,0.1)" />
        <ProfileCard label="Interviews Completed" value={String(profile.stats.interviewsCompleted)} iconClass="fa-microphone" color="#10b981" bg="rgba(16,185,129,0.1)" />
        <ProfileCard label="Career Progress" value={`${profile.stats.careerProgress}%`} iconClass="fa-chart-line" color="#8b5cf6" bg="rgba(139,92,246,0.1)" />
        <ProfileCard label="Notes Generated" value={String(profile.stats.notesGenerated)} iconClass="fa-file-alt" color="#f59e0b" bg="rgba(245,158,11,0.1)" />
      </div>

      <div className="profile-layout-grid">
        <div className="profile-left-col">
          {editing ? (
            <div className="panel-card glass">
              <h2 className="panel-title"><i className="fas fa-pen" style={{ color: "var(--primary)", marginRight: "0.5rem" }} />Edit Profile</h2>
              <form className="profile-edit-form" onSubmit={saveProfile}>
                <div className="edit-form-grid">
                  {[
                    { key: "name", label: "Full Name", field: "name" as const },
                    { key: "phone", label: "Phone Number", field: "phone" as const },
                    { key: "college", label: "College / University", field: "college" as const },
                    { key: "branch", label: "Branch / Specialization", field: "branch" as const },
                  ].map(f => (
                    <div key={f.key} className="edit-form-group">
                      <label>{f.label}</label>
                      <div className="edit-input-wrap">
                        <input value={form[f.field]} onChange={e => setForm({ ...form, [f.field]: e.target.value })} />
                      </div>
                    </div>
                  ))}
                  <div className="edit-form-group">
                    <label>Career Goal</label>
                    <div className="edit-input-wrap">
                      <input value={form.profile.careerGoal} onChange={e => setForm({ ...form, profile: { ...form.profile, careerGoal: e.target.value } })} />
                    </div>
                  </div>
                  <div className="edit-form-group full">
                    <label>Skills (comma-separated)</label>
                    <div className="edit-input-wrap">
                      <input value={form.profile.skills} onChange={e => setForm({ ...form, profile: { ...form.profile, skills: e.target.value } })} />
                    </div>
                  </div>
                </div>
                <div className="edit-form-actions">
                  <button type="submit" className="btn btn-primary profile-save-btn"><i className="fas fa-save" /> Save Changes</button>
                  <button type="button" className="btn btn-secondary profile-cancel-btn" onClick={() => setEditing(false)}><i className="fas fa-times" /> Cancel</button>
                </div>
              </form>
            </div>
          ) : (
            <div className="panel-card glass">
              <h2 className="panel-title">About</h2>
              <div className="profile-info-list">
                <div className="profile-info-item"><span>Phone</span><strong>{profile.phone || "—"}</strong></div>
                <div className="profile-info-item"><span>College</span><strong>{profile.college}</strong></div>
                <div className="profile-info-item"><span>Branch</span><strong>{profile.branch}</strong></div>
                <div className="profile-info-item"><span>Year</span><strong>{profile.year}</strong></div>
                <div className="profile-info-item"><span>Career Goal</span><strong>{profile.profile.careerGoal}</strong></div>
              </div>
            </div>
          )}
        </div>

        <div className="profile-right-col">
          <div className="panel-card glass">
            <h2 className="panel-title"><i className="fas fa-file-pdf" style={{ color: "#ef4444", marginRight: "0.5rem" }} />Resume</h2>
            <div className="resume-empty-state">
              <div className="resume-empty-icon"><i className="fas fa-cloud-upload-alt" /></div>
              <p>No resume uploaded yet</p>
              <span>Upload your resume to get an ATS score and job match analysis</span>
            </div>
            <button className="btn btn-secondary" style={{ width: "100%", marginTop: "1rem" }} onClick={() => showToast("Resume upload will be available when backend is integrated.")}>
              Upload Resume (PDF / DOCX)
            </button>
          </div>
          <div className="panel-card glass">
            <h2 className="panel-title"><i className="fas fa-tools" style={{ color: "#06b6d4", marginRight: "0.5rem" }} />Skills</h2>
            <div className="skills-chips-container">
              {skills.length ? skills.map(s => <span key={s} className="skill-chip">{s}</span>) : (
                <span className="skill-chip-empty">No skills added yet. Edit your profile to add skills.</span>
              )}
            </div>
          </div>
          <div className="panel-card glass">
            <h2 className="panel-title"><i className="fas fa-history" style={{ color: "#10b981", marginRight: "0.5rem" }} />Recent Activity</h2>
            <div className="activity-list">
              {profile.activities.map(a => (
                <div key={a.id} className="activity-item">
                  <div className="activity-dot" />
                  <div className="activity-details"><p>{a.title}</p><span className="activity-time">{a.time}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
