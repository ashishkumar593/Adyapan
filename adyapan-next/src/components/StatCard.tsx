"use client";
import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: string;
  iconClass: string;
  color: string;
  bg: string;
  trend?: string;
  trendUp?: boolean;
}

export default function StatCard({ label, value, iconClass, color, bg, trend, trendUp }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.015 }}
      className="glass p-4 flex flex-col border border-[var(--border-color)] rounded-2xl transition-all"
      style={{ "--hover-border": "rgba(245,158,11,0.2)" } as React.CSSProperties}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base" style={{ background: bg, color }}>
          <i className={`fas ${iconClass}`} />
        </div>
        {trend && (
          <span className={`text-xs font-semibold flex items-center gap-1 ${trendUp ? "text-emerald-500" : "text-[var(--text-muted)]"}`}>
            {trendUp && <i className="fas fa-caret-up" />}
            {trend}
          </span>
        )}
      </div>
      <div className="font-title text-2xl font-bold mb-0.5">{value}</div>
      <div className="text-[var(--text-secondary)] text-xs font-medium">{label}</div>
    </motion.div>
  );
}
