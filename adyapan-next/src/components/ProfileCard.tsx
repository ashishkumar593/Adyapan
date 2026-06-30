"use client";
import { motion } from "framer-motion";

interface ProfileCardProps {
  label: string;
  value: string;
  iconClass?: string;
  color?: string;
  bg?: string;
}

export default function ProfileCard({ label, value, iconClass, color, bg }: ProfileCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      className="glass p-4 flex flex-col gap-1 text-center border border-[var(--border-color)] rounded-2xl"
    >
      {iconClass && (
        <div className="w-9 h-9 rounded-lg flex items-center justify-center mx-auto mb-1 text-base" style={{ background: bg, color }}>
          <i className={`fas ${iconClass}`} />
        </div>
      )}
      <div className="font-title text-xl font-bold">{value}</div>
      <div className="text-[var(--text-secondary)] text-xs font-medium">{label}</div>
    </motion.div>
  );
}
