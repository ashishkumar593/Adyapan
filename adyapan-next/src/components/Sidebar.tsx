"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import type { SidebarItemConfig } from "@/data/mockData";
import { useToast } from "@/lib/context";

interface SidebarProps {
  items: SidebarItemConfig[];
  activeSection?: string;
  onNavigate?: (section: string) => void;
  logoHref?: string;
}

export default function Sidebar({ items, activeSection, onNavigate }: SidebarProps) {
  const { showToast } = useToast();
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [hovered, setHovered] = useState(false);
  const pathname = usePathname();

  const toggleMenu = (label: string) => {
    setOpenMenus(prev => prev.includes(label) ? prev.filter(l => l !== label) : [label]);
  };

  const handleClick = (item: { label: string; href?: string; section?: string }) => {
    if (item.section && onNavigate) { onNavigate(item.section); return; }
    if (!item.href || item.href === "#") {
      showToast(`${item.label} will be available in the upcoming release!`);
    }
  };

  const renderItem = (item: SidebarItemConfig, isChild = false) => {
    const isActive = item.section
      ? activeSection === item.section
      : item.href ? pathname === item.href : false;
    const isOpen = openMenus.includes(item.label);
    const baseClass = `w-full flex items-center gap-3 px-2 py-2 rounded-xl transition-all text-sm font-medium border border-transparent
      ${isActive ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "text-[var(--text-secondary)] hover:bg-white/5"}
      ${isChild ? "text-[0.74rem] py-1.5" : ""}`;

    if (item.href && !item.children) {
      return (
        <Link href={item.href} className={baseClass} style={{ justifyContent: hovered ? "flex-start" : "center" }}>
          <i className={`fas ${item.icon} w-5 text-center text-base flex-shrink-0`} />
          {hovered && <span className="whitespace-nowrap">{item.label}</span>}
        </Link>
      );
    }

    if (item.children) {
      return (
        <>
          <button onClick={() => toggleMenu(item.label)} className={baseClass} style={{ justifyContent: hovered ? "flex-start" : "center" }}>
            <i className={`fas ${item.icon} w-5 text-center text-base flex-shrink-0`} />
            {hovered && (
              <>
                <span className="flex-1 text-left whitespace-nowrap">{item.label}</span>
                <i className={`fas fa-chevron-down text-[0.55rem] opacity-60 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </>
            )}
          </button>
          {hovered && isOpen && (
            <ul className="pl-5 flex flex-col gap-0.5 mt-0.5 list-none p-0 ml-5">
              {item.children.map(child => (
                <li key={child.label}>
                  {child.href ? (
                    <Link href={child.href} className="w-full text-left px-2 py-1.5 text-[0.74rem] font-medium text-[var(--text-secondary)] rounded-lg hover:text-[var(--text-primary)] hover:bg-white/4 transition-all whitespace-nowrap block">
                      {child.label}
                    </Link>
                  ) : (
                    <button onClick={() => handleClick(child)} className="w-full text-left px-2 py-1.5 text-[0.74rem] font-medium text-[var(--text-secondary)] rounded-lg hover:text-[var(--text-primary)] hover:bg-white/4 transition-all whitespace-nowrap">
                      {child.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      );
    }

    return (
      <button onClick={() => handleClick(item)} className={baseClass} style={{ justifyContent: hovered ? "flex-start" : "center" }}>
        <i className={`fas ${item.icon} w-5 text-center text-base flex-shrink-0`} />
        {hovered && <span className="whitespace-nowrap">{item.label}</span>}
      </button>
    );
  };

  return (
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="sidebar hide-scrollbar"
      style={{
        width: hovered ? "280px" : "80px",
        paddingLeft: hovered ? "0.7rem" : "0.5rem",
        paddingRight: hovered ? "0.7rem" : "0.5rem",
        overflowY: hovered ? "auto" : "hidden",
      }}
    >
      <nav style={{ flexGrow: 1, marginTop: "0.5rem" }}>
        <ul className="sidebar-menu">
          {items.map(item => (
            <li key={item.label} className={`sidebar-item ${item.section && activeSection === item.section ? "active" : ""} ${item.children ? "has-submenu" : ""}`}>
              {renderItem(item)}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
