"use client";
import { motion } from "framer-motion";

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  titleRight?: React.ReactNode;
}

export default function DashboardCard({ title, children, className = "", titleRight }: DashboardCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`glass p-5 border border-[var(--border-color)] rounded-2xl transition-all ${className}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-title text-base font-bold">{title}</h2>
        {titleRight}
      </div>
      {children}
    </motion.div>
  );
}
