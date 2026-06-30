"use client";

import { useEffect, useRef } from "react";

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colors = [
      "rgba(245, 158, 11, 0.45)", "rgba(244, 147, 54, 0.45)",
      "rgba(251, 191, 36, 0.45)", "rgba(255, 255, 255, 0.35)", "rgba(217, 119, 6, 0.45)",
    ];
    const isMobile = window.innerWidth <= 768;
    const maxParticles = isMobile ? 300 : 900;
    const mouse = { x: null as number | null, y: null as number | null, radius: 150 };

    type P = { x: number; y: number; originX: number; originY: number; vx: number; vy: number; radius: number; alpha: number; color: string; baseColor: string; hoverColor: string };
    let particles: P[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      particles = Array.from({ length: maxParticles }, () => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        return {
          x, y, originX: x, originY: y,
          vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 2 + 0.5, alpha: Math.random() * 0.5 + 0.1,
          color: "rgba(255, 255, 255, 0.25)", baseColor: "rgba(255, 255, 255, 0.25)",
          hoverColor: colors[Math.floor(Math.random() * colors.length)],
        };
      });
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => { mouse.x = null; mouse.y = null; };

    let frame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x, dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            p.x -= (dx / dist) * force * 2;
            p.y -= (dy / dist) * force * 2;
            p.color = p.hoverColor;
          } else {
            p.x += (p.originX - p.x) * 0.02;
            p.y += (p.originY - p.y) * 0.02;
            p.color = p.baseColor;
          }
        }
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener("resize", resize);
    canvas.parentElement?.addEventListener("mousemove", onMove);
    canvas.parentElement?.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      canvas.parentElement?.removeEventListener("mousemove", onMove);
      canvas.parentElement?.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} id="hero-canvas" className="absolute inset-0 w-full h-full pointer-events-none" />;
}
