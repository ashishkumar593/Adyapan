// ── Auth / User ──────────────────────────────────────────────────
export type UserRole = "student" | "mentor" | "admin";
export type Theme = "dark" | "light";

export interface User {
  email: string;
  name: string;
  role: UserRole;
}

// ── Profile ──────────────────────────────────────────────────────
export interface ResumeInfo {
  filename: string;
  filenameOnDisk: string;
  path: string;
  size: number;
}

export interface StudentProfile {
  name: string;
  email: string;
  phone: string;
  college: string;
  branch: string;
  year: string;
  profile: {
    careerGoal: string;
    linkedin: string;
    github: string;
    skills: string;
    resume: ResumeInfo | null;
  };
  stats: {
    resumeScore: number;
    interviewsCompleted: number;
    careerProgress: number;
    notesGenerated: number;
  };
  activities: Activity[];
}

export interface MentorProfile {
  name: string;
  email: string;
  profile: {
    skills: string;
    bio: string;
    sessionRate?: string;
  };
}

// ── Dashboard ────────────────────────────────────────────────────
export interface Activity {
  id: number;
  title: string;
  time: string;
}

export interface WidgetCard {
  label: string;
  value: string;
  iconClass: string;
  color: string;
  bg: string;
  trend?: string;
  trendUp?: boolean;
}

export interface Course {
  name: string;
  progress: number;
  next: string;
  color: string;
}

export interface SkillBadge {
  title: string;
  level: string;
  iconClass: string;
  color: string;
  bg: string;
}

export interface Application {
  role: string;
  status: "Applied" | "Under Review" | "Scheduled" | "Rejected";
  statusColor: string;
  statusBg: string;
  meta: string;
}

export interface InternshipItem {
  company: string;
  role: string;
  meta: string;
  iconClass: string;
  color: string;
  bg: string;
}

// ── Mentor ───────────────────────────────────────────────────────
export interface MentorStudent {
  id: number;
  studentName: string;
  goal: string;
  progress: number;
  lastSession: string;
  status: "Active" | "Completed";
}

export interface MentorReview {
  id: number;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Session {
  id: number;
  studentName: string;
  topic: string;
  dateTime: string;
  status: "scheduled" | "completed";
}

// ── Admin ────────────────────────────────────────────────────────
export interface AdminUser {
  id: number;
  name: string;
  email: string;
  joined: string;
  plan: "Free" | "Premium" | "Institution";
  status: "Active" | "Suspended" | "Pending";
}

export interface AdminMentor {
  id: number;
  name: string;
  expertise: string;
  students: number;
  rating: number;
  status: "Active" | "Pending";
}

// ── Landing page ─────────────────────────────────────────────────
export interface Feature {
  title: string;
  description: string;
  image: string;
  link: string;
}

export interface WorkflowStep {
  num: string;
  title: string;
  description: string;
}

export interface Testimonial {
  text: string;
  author: string;
  role: string;
  avatar: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface StatItem {
  target: number;
  suffix: string;
  label: string;
}

// ── Notification toast ───────────────────────────────────────────
export interface Toast {
  id: string;
  message: string;
}
