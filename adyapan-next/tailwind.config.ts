import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:   "#f59e0b",
        secondary: "#d97706",
        "app-dark":   "#080710",
        "app-card":   "rgba(255,255,255,0.03)",
        "app-card-hover": "rgba(255,255,255,0.07)",
        "nav-dark":   "#060b0e",
        "input-dark": "#0d151c",
      },
      fontFamily: {
        title: ["Crimson Text", "serif"],
        body:  ["Plus Jakarta Sans", "sans-serif"],
        sans:  ["Plus Jakarta Sans", "sans-serif"],
      },
      backgroundImage: {
        "gradient-main": "linear-gradient(135deg,#f59e0b,#d97706)",
      },
      boxShadow: {
        glow:        "0 0 30px rgba(245,158,11,0.2)",
        "glow-strong": "0 0 50px rgba(245,158,11,0.45)",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.16,1,0.3,1)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%":     { transform: "translateY(-20px) rotate(1deg)" },
        },
        slideIn: {
          from: { transform: "translateX(120%)", opacity: "0" },
          to:   { transform: "translateX(0)",   opacity: "1" },
        },
        slideOut: {
          from: { transform: "translateX(0)",   opacity: "1" },
          to:   { transform: "translateX(120%)", opacity: "0" },
        },
        pulseOpacity: {
          "0%,100%": { opacity: "1" },
          "50%":     { opacity: "0.3" },
        },
      },
      animation: {
        float:         "float 6s ease-in-out infinite",
        "slide-in":    "slideIn 0.3s ease forwards",
        "slide-out":   "slideOut 0.3s ease forwards",
        "pulse-opacity": "pulseOpacity 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
