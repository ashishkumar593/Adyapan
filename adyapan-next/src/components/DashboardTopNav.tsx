"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { assets } from "@/data/assets";
import { notifications } from "@/data/mockData";
import { useAuth, useTheme, useToast } from "@/lib/context";
import type { UserRole } from "@/types";

interface DashboardTopNavProps {
  role: UserRole;
  logoHref: string;
  profileHref: string;
  showStudentNav?: boolean;
}

export default function DashboardTopNav({ role, logoHref, profileHref, showStudentNav = false }: DashboardTopNavProps) {
  const { theme, toggleTheme } = useTheme();
  const { name, email, logout } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [evaluateOpen, setEvaluateOpen] = useState(false);

  const comingSoon = (label: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    showToast(`${label} will be available in the upcoming release!`);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="dashboard-top-nav">
      <div className="top-nav-left">
        <Link href={logoHref} className="dashboard-logo">
          <Image src={assets.logo} alt="Adyapan AI" width={30} height={30} />
          <span>Adyapan AI</span>
        </Link>
        <div className="search-bar-wrapper">
          <i className="fas fa-search search-icon" />
          <input type="text" placeholder={role === "student" ? "Search notes, assignments, jobs, tools..." : role === "mentor" ? "Search students, sessions..." : "Search users, mentors, reports..."} />
        </div>
      </div>

      <div className="top-nav-center">
        {showStudentNav ? (
          <>
            <div className="nav-dropdown-wrapper">
              <button className="top-nav-btn btn-generate nav-dropdown-toggle" onClick={() => setGenerateOpen(o => !o)}>
                <i className="fas fa-plus" /> Generate <i className="fas fa-chevron-down toggle-arrow" />
              </button>
              {generateOpen && (
                <div className="nav-dropdown-menu">
                  {["Notes", "Assignment", "PPT", "MCQs", "Research Paper", "Resume"].map(item => (
                    <a key={item} href="#" onClick={comingSoon(item)}><i className="far fa-file-alt" /> {item}</a>
                  ))}
                </div>
              )}
            </div>
            <button className="top-nav-btn btn-interview" onClick={comingSoon("AI Interview")}>
              <i className="fas fa-microphone" /> AI Interview
            </button>
            <div className="nav-dropdown-wrapper">
              <button className="top-nav-btn btn-evaluate nav-dropdown-toggle" onClick={() => setEvaluateOpen(o => !o)}>
                <i className="fas fa-wand-magic-sparkles" /> Evaluate <i className="fas fa-chevron-down toggle-arrow" />
              </button>
              {evaluateOpen && (
                <div className="nav-dropdown-menu">
                  {["ATS Score", "Resume Analysis", "Skill Assessment", "Placement Readiness"].map(item => (
                    <a key={item} href="#" onClick={comingSoon(item)}><i className="fas fa-star" /> {item}</a>
                  ))}
                </div>
              )}
            </div>
            <span className="nav-divider" />
            <a href="#" className="top-nav-link" onClick={comingSoon("Jobs")}>Jobs</a>
            <a href="#" className="top-nav-link" onClick={comingSoon("Internships")}>Internships</a>
          </>
        ) : (
          <span className={`role-badge role-${role}`}>
            <i className={`fas ${role === "admin" ? "fa-shield-halved" : "fa-graduation-cap"}`} />
            {role === "admin" ? "Admin Panel" : "Mentor Portal"}
          </span>
        )}
      </div>

      <div className="top-nav-right">
        {showStudentNav && (
          <button className="top-nav-btn btn-premium" onClick={comingSoon("Premium")}>
            <i className="fas fa-crown" /> Premium
          </button>
        )}
        <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
          <i className={`fas ${theme === "dark" ? "fa-sun" : "fa-moon"}`} />
        </button>
        <div className="notification-wrapper" onMouseEnter={() => setNotifOpen(true)} onMouseLeave={() => setNotifOpen(false)}>
          <div className="notification-btn">
            <i className="far fa-bell" />
            <span className="notification-badge">{showStudentNav ? 2 : 0}</span>
          </div>
          {notifOpen && showStudentNav && (
            <div className="notification-dropdown">
              <div className="notif-header"><span>Notifications</span><span className="mark-read">Mark all as read</span></div>
              <div className="notif-list">
                {notifications.map((n, i) => (
                  <div key={i} className={`notif-item ${n.unread ? "unread" : ""}`}>
                    <div className="notif-icon" style={{ color: n.color, background: n.bg }}><i className={`fas ${n.iconClass}`} /></div>
                    <div className="notif-content">
                      <p className="notif-text">{n.text}</p>
                      <span className="notif-time">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="user-profile-wrapper" onMouseEnter={() => setProfileOpen(true)} onMouseLeave={() => setProfileOpen(false)}>
          <div className="user-profile-btn"><i className="far fa-user-circle" /></div>
          {profileOpen && (
            <div className="profile-dropdown glass">
              <div className="dropdown-user-header">
                <div className="dropdown-avatar-circle"><i className="fas fa-user" /></div>
                <div className="dropdown-user-details">
                  <div className="dropdown-user-name">{name || "User"}</div>
                  <div className="dropdown-user-email">{email}</div>
                </div>
              </div>
              {showStudentNav && (
                <div className="dropdown-actions-wrapper">
                  <a href="#" className="dropdown-action-btn" onClick={comingSoon("Community Profile")}>View Community Profile</a>
                  <a href="#" className="dropdown-action-btn" onClick={comingSoon("Manage Account")}>Manage Account</a>
                </div>
              )}
              <div className="dropdown-divider" />
              <ul className="dropdown-menu-list">
                <li><Link href={profileHref}><i className="fas fa-user" /> My Profile</Link></li>
                {showStudentNav && (
                  <>
                    <li><a href="#" onClick={comingSoon("Learning Progress")}><i className="fas fa-chart-line" /> Learning Progress</a></li>
                    <li><a href="#" onClick={comingSoon("Certificates")}><i className="fas fa-award" /> Certificates</a></li>
                    <li className="menu-divider" />
                    <li><a href="#" onClick={comingSoon("Settings")}><i className="fas fa-cog" /> Settings</a></li>
                    <li><a href="#" onClick={comingSoon("Billing")}><i className="fas fa-credit-card" /> Billing</a></li>
                  </>
                )}
                {!showStudentNav && <li><a href="#" onClick={comingSoon("Settings")}><i className="fas fa-cog" /> Settings</a></li>}
                <li className="menu-divider" />
                <li><a href="/" onClick={(e) => { e.preventDefault(); handleLogout(); }}><i className="fas fa-sign-out-alt" /> Logout</a></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
