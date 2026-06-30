"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { assets } from "@/data/assets";
import { useToast } from "@/lib/context";

interface SidebarItem {
  label: string;
  icon: string;
  href?: string;
  section?: string;
  children?: { label: string; href?: string; section?: string }[];
}

interface SidebarProps {
  items: SidebarItem[];
  activeSection?: string;
  onNavigate?: (section: string) => void;
  logoHref?: string;
}

export default function Sidebar({ items, activeSection, onNavigate, logoHref = "/" }: SidebarProps) {
  const { showToast } = useToast();
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [hovered, setHovered] = useState(false);
  const pathname = usePathname();

  const toggleMenu = (label: string) => {
    setOpenMenus(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [label]
    );
  };

  const handleClick = (item: { label: string; href?: string; section?: string }) => {
    if (item.section && onNavigate) { onNavigate(item.section); return; }
    if (!item.href || item.href === "#") { showToast(`${item.label} will be available in the upcoming release!`); }
  };

  return (
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="hide-scrollbar fixed top-[70px] left-0 z-[99] flex flex-col border-r border-[var(--border-color)] transition-all duration-300 overflow-hidden"
      style={{
        width: hovered ? "280px" : "80px",
        height: "calc(100vh - 70px)",
        background: "var(--glass-bg)",
        backdropFilter: "var(--glass-blur)",
        paddingTop: "1.5rem",
        paddingBottom: "1.5rem",
        paddingLeft: hovered ? "0.7rem" : "0.5rem",
        paddingRight: hovered ? "0.7rem" : "0.5rem",
        overflowY: hovered ? "auto" : "hidden",
      }}
    >
      <nav className="flex-1 mt-2">
        <ul className="flex flex-col gap-1 list-none p-0 m-0">
          {items.map(item => {
            const isActive = item.section
              ? activeSection === item.section
              : pathname === item.href;
            const isOpen = openMenus.includes(item.label);

            return (
              <li key={item.label}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleMenu(item.label)}
                      className={`w-full flex items-center gap-3 px-2 py-2 rounded-xl transition-all text-sm font-medium border border-transparent
                        ${isActive ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "text-[var(--text-secondary)] hover:bg-white/5"}`}
                      style={{ justifyContent: hovered ? "flex-start" : "center" }}
                    >
                      <i className={`fas ${item.icon} w-5 text-center text-base flex-shrink-0`} />
                      {hovered && <><span className="flex-1 text-left whitespace-nowrap">{item.label}</span><i className={`fas fa-chevron-down text-[0.55rem] opacity-60 transition-transform ${isOpen ? "rotate-180" : ""}`} /></>}
                    </button>
                    {hovered && isOpen && (
                      <ul className="pl-5 flex flex-col gap-0.5 mt-0.5 list-none p-0 ml-5">
                        {item.children.map(child => (
                          <li key={child.label}>
                            <button
                              onClick={() => handleClick(child)}
                              className="w-full text-left px-2 py-1.5 text-[0.74rem] font-medium text-[var(--text-secondary)] rounded-lg hover:text-[var(--text-primary)] hover:bg-white/4 transition-all whitespace-nowrap"
                            >
                              {child.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => handleClick(item)}
                    className={`w-full flex items-center gap-3 px-2 py-2 rounded-xl transition-all text-sm font-medium border border-transparent
                      ${isActive ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "text-[var(--text-secondary)] hover:bg-white/5"}`}
                    style={{ justifyContent: hovered ? "flex-start" : "center" }}
                  >
                    <i className={`fas ${item.icon} w-5 text-center text-base flex-shrink-0`} />
                    {hovered && <span className="whitespace-nowrap">{item.label}</span>}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
