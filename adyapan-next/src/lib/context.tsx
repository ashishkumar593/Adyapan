"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Theme, UserRole, Toast } from "@/types";

// ── Theme ─────────────────────────────────────────────────────────
interface ThemeCtx { theme: Theme; toggleTheme: () => void; }
const ThemeContext = createContext<ThemeCtx>({ theme: "dark", toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = (localStorage.getItem("theme") as Theme) || "dark";
    setTheme(stored);
    document.documentElement.setAttribute("data-theme", stored);
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}
export const useTheme = () => useContext(ThemeContext);

// ── Auth ──────────────────────────────────────────────────────────
interface AuthCtx {
  email: string; name: string; role: UserRole | null;
  setUser: (email: string, name: string, role: UserRole) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthCtx>({
  email: "", name: "", role: null,
  setUser: () => {}, logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState("");
  const [name,  setName]  = useState("");
  const [role,  setRole]  = useState<UserRole | null>(null);

  useEffect(() => {
    setEmail(localStorage.getItem("userEmail") || "");
    setName(localStorage.getItem("userName")   || "");
    setRole((localStorage.getItem("userRole") as UserRole) || null);
  }, []);

  const setUser = (e: string, n: string, r: UserRole) => {
    setEmail(e); setName(n); setRole(r);
    localStorage.setItem("userEmail", e);
    localStorage.setItem("userName", n);
    localStorage.setItem("userRole", r);
  };

  const logout = () => {
    setEmail(""); setName(""); setRole(null);
    localStorage.clear();
  };

  return <AuthContext.Provider value={{ email, name, role, setUser, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);

// ── Toast ─────────────────────────────────────────────────────────
interface ToastCtx { showToast: (msg: string) => void; }
const ToastContext = createContext<ToastCtx>({ showToast: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(p => [...p, { id, message }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-[9999]">
        {toasts.map(t => (
          <div key={t.id} className="glass animate-slide-in flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white shadow-glow max-w-xs"
            style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", border: "1px solid rgba(255,255,255,0.15)" }}>
            <i className="fas fa-info-circle text-amber-400" />
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
export const useToast = () => useContext(ToastContext);
