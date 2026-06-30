import type {
  Feature, WorkflowStep, Testimonial, FaqItem, StatItem,
  Course, SkillBadge, InternshipItem, Application,
  MentorStudent, MentorReview, Session,
  AdminUser, AdminMentor,
} from "@/types";
import { assets } from "./assets";

// ── Landing Page ─────────────────────────────────────────────────
export const features: Feature[] = [
  { title: "AI Study Assistant",       description: "Generate notes, MCQs, assignments, and PPTs instantly. Your personal AI academic companion.",             image: assets.studyAssistant,      link: "/dashboard/student" },
  { title: "AI Career Guide",          description: "Personalized career roadmaps, skill gap analysis, and domain recommendations powered by AI.",             image: assets.careerGuide,         link: "/dashboard/student" },
  { title: "AI Resume Builder",        description: "Build ATS-optimized resumes with AI assistance and get real-time scoring and analysis.",                  image: assets.resumeBuilder,       link: "/dashboard/student" },
  { title: "AI Interview Coach",       description: "Practice HR and technical interviews with our AI coach. Get instant feedback and improvement tips.",       image: assets.interviewCoach,      link: "/dashboard/student" },
  { title: "AI Internship Assistant",  description: "Find and match with internship opportunities curated by AI based on your profile and skills.",             image: assets.internshipAssistant, link: "/dashboard/student" },
  { title: "AI Placement Hub",         description: "Comprehensive placement preparation: aptitude, logical reasoning, mock tests, and readiness scores.",     image: assets.placementHub,        link: "/dashboard/student" },
];

export const workflowSteps: WorkflowStep[] = [
  { num: "01", title: "Create Your Profile",      description: "Set up your academic profile with your college, branch, and career aspirations." },
  { num: "02", title: "Choose Career Goal",        description: "Select your target domain and let AI map your personalised learning path." },
  { num: "03", title: "Learn with AI",             description: "Generate notes, solve coding problems, and build projects guided by AI." },
  { num: "04", title: "Prepare for Interviews",    description: "Practice mock interviews, improve your resume and communication skills." },
  { num: "05", title: "Find Opportunities",        description: "AI matches you with internships and jobs aligned to your skills and goals." },
  { num: "06", title: "Get Hired",                 description: "Land your dream role with a complete placement-ready profile." },
];

export const testimonials: Testimonial[] = [
  {
    text: "\"Adyapan AI completely transformed my placement preparation. The mock interviews helped me crack my SDE internship at TechCorp!\"",
    author: "Aditi Sharma", role: "SDE Intern at TechCorp · Computer Science, 4th Year",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face",
  },
  {
    text: "\"The AI study assistant helped me generate quality notes in minutes. My CGPA improved significantly this semester.\"",
    author: "Rahul Verma", role: "B.Tech IT Student · 3rd Year",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
];

export const faqItems: FaqItem[] = [
  { question: "Is Adyapan AI free to use?",              answer: "Adyapan AI offers a free tier with core features. Premium plans unlock advanced AI models, unlimited generations, and priority support." },
  { question: "How does the AI resume builder work?",    answer: "Our AI analyzes your profile, skills, and career goals to generate an ATS-optimised resume. You can customise and download it instantly." },
  { question: "Can I practice real interview questions?", answer: "Yes! Our AI Interview Coach simulates HR and technical interview scenarios, provides instant feedback, and tracks your progress over time." },
];

export const stats: StatItem[] = [
  { target: 50000, suffix: "+", label: "Students Enrolled" },
  { target: 95,    suffix: "%", label: "Placement Success Rate" },
  { target: 500,   suffix: "+", label: "Partner Companies" },
  { target: 10,    suffix: "M+", label: "AI Interactions" },
];

// ── Student Dashboard ─────────────────────────────────────────────
export const studentMetrics = [
  { label: "Learning Score",       value: "82%",    iconClass: "fa-graduation-cap", color: "#8b5cf6", bg: "rgba(139,92,246,0.1)",  trend: "+8%",  trendUp: true },
  { label: "Resume Score",         value: "78/100", iconClass: "fa-file-invoice",  color: "#3b82f6", bg: "rgba(59,130,246,0.1)",   trend: "+5",   trendUp: true },
  { label: "Interview Score",      value: "74%",    iconClass: "fa-microphone",    color: "#10b981", bg: "rgba(16,185,129,0.1)",   trend: "+12%", trendUp: true },
  { label: "Placement Readiness",  value: "80%",    iconClass: "fa-award",         color: "#f59e0b", bg: "rgba(245,158,11,0.1)",   trend: "+6%",  trendUp: true },
  { label: "Assignments Created",  value: "24",     iconClass: "fa-folder-open",   color: "#06b6d4", bg: "rgba(6,182,212,0.1)",    trend: "This Term" },
  { label: "Research Papers",      value: "6",      iconClass: "fa-book-open",     color: "#ec4899", bg: "rgba(236,72,153,0.1)",   trend: "+1",   trendUp: true },
];

export const activeCourses: Course[] = [
  { name: "Deep Learning Specialization",  progress: 64, next: "Neural Networks Basics", color: "#8b5cf6" },
  { name: "Data Structures & Algorithms",  progress: 82, next: "Graph Algorithms",        color: "#10b981" },
  { name: "Database Management Systems",   progress: 45, next: "SQL Joins & Indexes",     color: "#3b82f6" },
];

export const skillBadges: SkillBadge[] = [
  { title: "Python Developer",  level: "Advanced · Gold Badge",     iconClass: "fab fa-python",   color: "#ec4899", bg: "rgba(236,72,153,0.1)" },
  { title: "SQL Specialist",    level: "Intermediate · Silver Badge", iconClass: "fas fa-database", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  { title: "Machine Learning",  level: "Intermediate · Silver Badge", iconClass: "fas fa-brain",    color: "#06b6d4", bg: "rgba(6,182,212,0.1)"  },
];

export const internshipRecommendations: InternshipItem[] = [
  { company: "Google",    role: "Machine Learning Intern", meta: "Bangalore · 92% Match",  iconClass: "fab fa-google",      color: "#4285f4", bg: "rgba(66,133,244,0.1)"  },
  { company: "Microsoft", role: "Data Science Intern",     meta: "Hyderabad · 85% Match",  iconClass: "fab fa-microsoft",   color: "#00a4f0", bg: "rgba(0,164,240,0.1)"   },
  { company: "Meta",      role: "AI Research Assistant",   meta: "Mumbai · 80% Match",     iconClass: "fab fa-facebook-f",  color: "#1877f2", bg: "rgba(24,119,242,0.1)"  },
];

export const recentApplications: Application[] = [
  { role: "Data Analyst Intern", status: "Applied",      statusColor: "#3b82f6", statusBg: "rgba(59,130,246,0.15)",  meta: "Applied 2 Days Ago" },
  { role: "ML Intern",           status: "Under Review", statusColor: "#f59e0b", statusBg: "rgba(245,158,11,0.15)", meta: "In Evaluation Queue" },
  { role: "Software Engineer",   status: "Scheduled",    statusColor: "#10b981", statusBg: "rgba(16,185,129,0.15)", meta: "Interview Scheduled" },
];

export const quickActions = [
  { label: "Generate Notes",    iconClass: "fa-file-alt" },
  { label: "Create PPT",        iconClass: "fa-file-powerpoint" },
  { label: "Create Assignment", iconClass: "fa-file-edit" },
  { label: "Generate MCQs",     iconClass: "fa-tasks" },
  { label: "Build Resume",      iconClass: "fa-file-invoice" },
  { label: "Check ATS Score",   iconClass: "fa-check-double" },
  { label: "Start Interview",   iconClass: "fa-microphone" },
  { label: "Research Paper AI", iconClass: "fa-brain" },
  { label: "Coding Assistant",  iconClass: "fa-code" },
  { label: "Apply for Internship", iconClass: "fa-briefcase" },
];

export const recentActivities = [
  { title: "Generated ML Notes",        color: "#f59e0b" },
  { title: "Completed HR Interview",    color: "#10b981" },
  { title: "Created Resume",            color: "#3b82f6" },
  { title: "Generated Research Paper",  color: "#ec4899" },
  { title: "Solved DSA Assignment",     color: "#f59e0b" },
  { title: "Applied for Internship",    color: "#06b6d4" },
];

// ── Mentor Dashboard ──────────────────────────────────────────────
export const mockMentorStudents: MentorStudent[] = [
  { id: 3, studentName: "john",          goal: "Software Engineer",  progress: 72, lastSession: "2026-06-25", status: "Active" },
  { id: 4, studentName: "Node Explorer", goal: "Backend Engineer",   progress: 85, lastSession: "2026-06-28", status: "Active" },
];

export const mockMentorReviews: MentorReview[] = [
  { id: 1, studentName: "john",          rating: 5, comment: "Incredible mentor! Explained neural networks so clearly with real-world analogies.", date: "2026-06-24" },
  { id: 2, studentName: "Node Explorer", rating: 4, comment: "Very practical approach to database sharding and index optimization. Learned a lot.",  date: "2026-06-27" },
];

export const mockSessions: Session[] = [
  { id: 1, studentName: "john",          topic: "Machine Learning Foundations",  dateTime: "2026-07-01T14:00", status: "scheduled" },
  { id: 2, studentName: "Node Explorer", topic: "System Design & Scalability",   dateTime: "2026-07-03T16:30", status: "scheduled" },
];

// ── Admin Dashboard ───────────────────────────────────────────────
export const mockAdminUsers: AdminUser[] = [
  { id: 1, name: "Aditi Sharma",   email: "aditi@college.edu",  joined: "2026-01-15", plan: "Premium",     status: "Active" },
  { id: 2, name: "Rahul Verma",    email: "rahul@univ.ac.in",   joined: "2026-02-20", plan: "Free",        status: "Active" },
  { id: 3, name: "Priya Singh",    email: "priya@iit.ac.in",    joined: "2026-03-05", plan: "Institution", status: "Active" },
  { id: 4, name: "Vikram Nair",    email: "vikram@nit.ac.in",   joined: "2026-03-18", plan: "Free",        status: "Pending" },
];

export const mockAdminMentors: AdminMentor[] = [
  { id: 1, name: "Mentor Pro",     expertise: "Web Dev, AI, Cloud",   students: 12, rating: 4.8, status: "Active" },
  { id: 2, name: "Dr. Kavita Ray", expertise: "Data Science, Python", students: 8,  rating: 4.6, status: "Active" },
];
