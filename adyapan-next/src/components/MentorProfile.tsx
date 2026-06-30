"use client";

import { useState } from "react";
import { useAuthGuard } from "@/hooks";
import { useAuth, useToast } from "@/lib/context";
import DashboardLayout from "@/components/DashboardLayout";
import { mentorSidebarItems } from "@/data/mockData";

export default function MentorProfileView() {
  const { isReady } = useAuthGuard(["mentor"]);
  const { name, email } = useAuth();
  const { showToast } = useToast();
  const [bio, setBio] = useState("Experienced mentor in cloud architecture and AI/ML pipelines.");
  const [skills, setSkills] = useState("Web Development, AI, Cloud Computing");
  const [sessionRate, setSessionRate] = useState("150");

  if (!isReady) return null;

  return (
    <DashboardLayout role="mentor" logoHref="/dashboard/mentor" profileHref="/profile/mentor" sidebarItems={mentorSidebarItems}>
      <div className="profile-page-header">
        <div className="profile-avatar-large"><i className="fas fa-user-tie" /></div>
        <div className="profile-header-info">
          <h1>{name || "Mentor Pro"}</h1>
          <p>{email || "mentor@adyapan.ai"}</p>
          <div className="profile-meta-tags"><span className="profile-tag"><i className="fas fa-graduation-cap" /> Industry Mentor</span></div>
        </div>
      </div>
      <div className="panel-card glass" style={{ maxWidth: 720 }}>
        <h2 className="panel-title">Mentor Profile</h2>
        <form onSubmit={e => { e.preventDefault(); showToast("Profile saved (mock)."); }} className="profile-edit-form">
          <div className="edit-form-group"><label>Skills</label><div className="edit-input-wrap"><input value={skills} onChange={e => setSkills(e.target.value)} /></div></div>
          <div className="edit-form-group"><label>Bio</label><div className="edit-input-wrap"><textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} style={{ width: "100%", background: "transparent", border: "none", color: "inherit", resize: "vertical" }} /></div></div>
          <div className="edit-form-group"><label>Session Rate (₹/hr)</label><div className="edit-input-wrap"><input value={sessionRate} onChange={e => setSessionRate(e.target.value)} /></div></div>
          <button type="submit" className="btn btn-primary"><i className="fas fa-save" /> Save Profile</button>
        </form>
      </div>
    </DashboardLayout>
  );
}
