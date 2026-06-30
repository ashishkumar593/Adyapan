"use client";
import { motion } from "framer-motion";
import React from "react";

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export default function Button({ variant = "primary", size = "md", children, className = "", ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-full cursor-pointer border transition-all";
  const sizes = { sm: "px-4 py-2 text-sm", md: "px-6 py-3 text-base", lg: "px-8 py-4 text-lg" };
  const variants = {
    primary:   "bg-gradient-main text-white border-transparent shadow-glow hover:shadow-glow-strong",
    secondary: "bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border-color)] backdrop-blur-sm hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-hover)]",
    outline:   "bg-transparent text-[var(--text-primary)] border-[var(--border-color)] hover:border-primary hover:text-primary",
  };

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
