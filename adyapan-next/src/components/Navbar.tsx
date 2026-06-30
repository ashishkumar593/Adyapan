"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/context";
import { assets } from "@/data/assets";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/#home",         label: "Home" },
    { href: "/#features",     label: "Features" },
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/#faq",          label: "FAQ" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-[1000] bg-[#171717] border-b border-white/5 py-3 transition-all">
      <div className="w-full px-12 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg text-white no-underline">
          <Image src={assets.logo} alt="Adyapan AI" width={26} height={26} className="object-contain" />
          <span>Adyapan AI</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="text-[0.85rem] font-medium text-[#c5c5c5] hover:text-white transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 text-[#c5c5c5] hover:text-white transition-colors" aria-label="Toggle theme">
            <i className={`fas ${theme === "dark" ? "fa-sun" : "fa-moon"} text-sm`} />
          </button>
          <Link href="/login" className="text-white text-[0.85rem] font-medium px-4 py-2 rounded-full hover:bg-white/10 transition-colors">
            Login
          </Link>
          <Link href="/login" className="bg-white text-[#0d0d0d] text-[0.85rem] font-medium px-4 py-2 rounded-full hover:bg-white/90 transition-colors">
            Get Started
          </Link>
          {/* Hamburger */}
          <button className="md:hidden ml-2 text-white" onClick={() => setMobileOpen(o => !o)}>
            <i className={`fas ${mobileOpen ? "fa-times" : "fa-bars"} text-lg`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 w-72 h-screen bg-[var(--bg-dark)] border-l border-[var(--border-color)] flex flex-col pt-24 px-8 gap-6 z-50"
          >
            {links.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className="text-[var(--text-secondary)] hover:text-white font-medium transition-colors">
                {l.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
