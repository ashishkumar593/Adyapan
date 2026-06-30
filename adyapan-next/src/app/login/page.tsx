"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaSignInAlt, FaUser, FaPhone, FaUniversity, FaGraduationCap, FaCalendar, FaUserPlus, FaPaperPlane, FaShieldAlt, FaKey } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Navbar from "@/components/Navbar";
import GalaxyCanvas from "@/components/GalaxyCanvas";
import { mockUsers } from "@/data/mockData";
import { useAuth, useToast } from "@/lib/context";
import type { UserRole } from "@/types";

type AuthView = "login" | "register" | "forgot";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const { showToast } = useToast();
  const [view, setView] = useState<AuthView>("login");
  const [error, setError] = useState("");
  const [forgotStep, setForgotStep] = useState<"email" | "reset">("email");
  const [message, setMessage] = useState("");

  const redirectByRole = (role: UserRole) => {
    if (role === "admin") router.push("/dashboard/admin");
    else if (role === "mentor") router.push("/dashboard/mentor");
    else router.push("/dashboard/student");
  };

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email"));
    const password = String(fd.get("password"));
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (!user) {
      setError("Invalid email or password.");
      return;
    }
    setUser(user.email, user.name, user.role);
    redirectByRole(user.role);
  };

  const handleRegister = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const password = String(fd.get("password"));
    const confirm = String(fd.get("confirmPassword"));
    if (password !== confirm) { setError("Passwords do not match!"); return; }
    const name = String(fd.get("name"));
    const email = String(fd.get("email"));
    setUser(email, name, "student");
    showToast("Account created successfully!");
    router.push("/dashboard/student");
  };

  const handleForgot = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    if (forgotStep === "email") {
      setForgotStep("reset");
      setMessage("OTP sent to your email (mock). Enter OTP and new password.");
      return;
    }
    const fd = new FormData(e.currentTarget);
    if (String(fd.get("password")) !== String(fd.get("confirmPassword"))) {
      setMessage("Passwords do not match.");
      return;
    }
    showToast("Password reset successfully!");
    setView("login");
    setForgotStep("email");
  };

  return (
    <>
      <GalaxyCanvas />
      <Navbar />
      <div className="auth-page">
        <div className="auth-right">
          <motion.div
            className={`auth-right-container glass ${view === "register" ? "register-mode" : ""}`}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          >
            {view === "login" && (
              <>
                <div className="auth-header">
                  <h1>Welcome Back</h1>
                  <p>Login to resume your Adyapan journey</p>
                </div>
                <form className="auth-form" onSubmit={handleLogin}>
                  <div className="form-group">
                    <label>Email Address</label>
                    <div className="input-wrapper">
                      <FaEnvelope /><input name="email" type="email" className="auth-input" placeholder="you@university.edu" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <div className="input-wrapper">
                      <FaLock /><input name="password" type="password" className="auth-input" placeholder="••••••••" required />
                    </div>
                  </div>
                  <div className="form-options">
                    <label className="remember-me"><input type="checkbox" /> Remember me</label>
                    <a href="#" className="forgot-link" onClick={(e) => { e.preventDefault(); setView("forgot"); }}>Forgot password?</a>
                  </div>
                  {error && <div className="form-group" style={{ color: "#ef4444", fontSize: "0.85rem", fontWeight: 600 }}>{error}</div>}
                  <button type="submit" className="btn btn-primary auth-submit-btn">Login <FaSignInAlt /></button>
                  <div className="divider">Or login with</div>
                  <div className="social-auth-grid">
                    <button type="button" className="social-btn google-btn" onClick={() => showToast("Google login will be available with NextAuth integration.")}><FcGoogle /> Google</button>
                    <button type="button" className="social-btn github-btn" onClick={() => showToast("GitHub login will be available with NextAuth integration.")}><i className="fab fa-github" /> GitHub</button>
                  </div>
                  <div className="auth-footer">Don&apos;t have an account? <a href="#" onClick={(e) => { e.preventDefault(); setView("register"); }}>Register here</a></div>
                </form>
              </>
            )}

            {view === "register" && (
              <>
                <div className="auth-header">
                  <h1>Create an Account</h1>
                  <p>Sign up now to start learning with AI</p>
                </div>
                <form className="auth-form" id="register-form" onSubmit={handleRegister}>
                  {[
                    { name: "name", label: "Full Name", icon: FaUser, placeholder: "John Doe" },
                    { name: "email", label: "Email Address", icon: FaEnvelope, placeholder: "john.doe@college.edu", type: "email" },
                    { name: "phone", label: "Phone Number", icon: FaPhone, placeholder: "9876543210", type: "tel" },
                    { name: "college", label: "College/University", icon: FaUniversity, placeholder: "State University" },
                    { name: "branch", label: "Branch/Specialization", icon: FaGraduationCap, placeholder: "Computer Science" },
                  ].map(f => (
                    <div key={f.name} className="form-group">
                      <label>{f.label}</label>
                      <div className="input-wrapper">
                        <f.icon /><input name={f.name} type={f.type || "text"} className="auth-input" placeholder={f.placeholder} required />
                      </div>
                    </div>
                  ))}
                  <div className="form-group">
                    <label>Academic Year</label>
                    <div className="input-wrapper">
                      <FaCalendar />
                      <select name="year" className="auth-input" required defaultValue="">
                        <option value="" disabled>Select Year</option>
                        {["1", "2", "3", "4", "Graduated"].map(y => <option key={y} value={y}>{y === "Graduated" ? "Graduated" : `${y}${y === "1" ? "st" : y === "2" ? "nd" : y === "3" ? "rd" : "th"} Year`}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <div className="input-wrapper"><FaLock /><input name="password" type="password" className="auth-input" placeholder="••••••••" required /></div>
                  </div>
                  <div className="form-group">
                    <label>Confirm Password</label>
                    <div className="input-wrapper"><FaLock /><input name="confirmPassword" type="password" className="auth-input" placeholder="••••••••" required /></div>
                  </div>
                  {error && <div className="form-group full-width" style={{ color: "#ef4444", fontSize: "0.85rem", fontWeight: 600 }}>{error}</div>}
                  <button type="submit" className="btn btn-primary auth-submit-btn">Create Account <FaUserPlus /></button>
                  <div className="auth-footer">Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setView("login"); }}>Sign in</a></div>
                </form>
              </>
            )}

            {view === "forgot" && (
              <>
                <div className="auth-header">
                  <h1>Reset Password</h1>
                  <p>Verify the OTP sent to your email before choosing a new password</p>
                </div>
                <form className="auth-form" id="forgot-form" onSubmit={handleForgot}>
                  <div className="form-group">
                    <label>Email Address</label>
                    <div className="input-wrapper"><FaEnvelope /><input name="email" type="email" className="auth-input" placeholder="you@university.edu" required disabled={forgotStep === "reset"} /></div>
                  </div>
                  {forgotStep === "reset" && (
                    <>
                      <div className="form-group">
                        <label>Email OTP</label>
                        <div className="input-wrapper"><FaShieldAlt /><input name="otp" className="auth-input" placeholder="6-digit OTP" maxLength={6} required /></div>
                      </div>
                      <div className="form-group">
                        <label>New Password</label>
                        <div className="input-wrapper"><FaLock /><input name="password" type="password" className="auth-input" placeholder="New password" required /></div>
                      </div>
                      <div className="form-group">
                        <label>Confirm New Password</label>
                        <div className="input-wrapper"><FaLock /><input name="confirmPassword" type="password" className="auth-input" placeholder="Confirm new password" required /></div>
                      </div>
                    </>
                  )}
                  {message && <div className="form-group" style={{ color: message.includes("match") ? "#ef4444" : "#22c55e", fontSize: "0.85rem", fontWeight: 600 }}>{message}</div>}
                  <button type="submit" className="btn btn-primary auth-submit-btn">
                    {forgotStep === "email" ? <>Send OTP <FaPaperPlane /></> : <>Verify OTP & Reset <FaKey /></>}
                  </button>
                  <div className="auth-footer">Remember your password? <a href="#" onClick={(e) => { e.preventDefault(); setView("login"); setForgotStep("email"); }}>Sign in</a></div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}
