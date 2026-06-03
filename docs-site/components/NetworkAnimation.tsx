"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulse: number;
  pulseSpeed: number;
}

export default function NetworkAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let nodes: Node[] = [];

    const NODE_COUNT = 20;
    const CONNECTION_DIST = 150;
    const MOUSE_INFLUENCE = 120;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const createNodes = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 2 + 1.2,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.015 + 0.008,
      }));
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const mouse = mouseRef.current;

      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += node.pulseSpeed;

        // Mouse attraction
        const mdx = mouse.x - node.x;
        const mdy = mouse.y - node.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < MOUSE_INFLUENCE && mDist > 1) {
          const force = (1 - mDist / MOUSE_INFLUENCE) * 0.008;
          node.vx += (mdx / mDist) * force;
          node.vy += (mdy / mDist) * force;
        }

        // Damping
        node.vx *= 0.998;
        node.vy *= 0.998;

        // Bounds
        if (node.x < 0 || node.x > w) node.vx *= -1;
        if (node.y < 0 || node.y > h) node.vy *= -1;
        node.x = Math.max(0, Math.min(w, node.x));
        node.y = Math.max(0, Math.min(h, node.y));
      });

      // Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.2;
            const gradient = ctx.createLinearGradient(
              nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y
            );
            gradient.addColorStop(0, `rgba(163, 255, 18, ${alpha})`);
            gradient.addColorStop(0.5, `rgba(96, 165, 250, ${alpha * 0.5})`);
            gradient.addColorStop(1, `rgba(163, 255, 18, ${alpha})`);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Nodes
      nodes.forEach((node) => {
        const pulseRadius = node.radius + Math.sin(node.pulse) * 1;
        const outerAlpha = (Math.sin(node.pulse) * 0.5 + 0.5) * 0.12;

        // Glow
        const glow = ctx.createRadialGradient(
          node.x, node.y, 0, node.x, node.y, pulseRadius * 5
        );
        glow.addColorStop(0, `rgba(163, 255, 18, 0.25)`);
        glow.addColorStop(0.3, `rgba(163, 255, 18, ${outerAlpha})`);
        glow.addColorStop(1, `rgba(163, 255, 18, 0)`);
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseRadius * 5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#a3ff12";
        ctx.globalAlpha = 0.85;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animationId = requestAnimationFrame(draw);
    };

    resize();
    createNodes();
    draw();

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    const resizeObserver = new ResizeObserver(() => {
      resize();
      createNodes();
    });
    resizeObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[320px]">
      <div className="absolute inset-0 rounded-2xl border border-white/[0.04] bg-white/[0.01]" />
      <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-[#a3ff12]/30 rounded-tl-2xl" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-[#a3ff12]/30 rounded-tr-2xl" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-[#a3ff12]/30 rounded-bl-2xl" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-[#a3ff12]/30 rounded-br-2xl" />

      <div
        className="absolute top-4 left-4 flex items-center gap-2 text-[10px] text-zinc-500 z-10"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-[#a3ff12] status-dot" />
        HOOK NETWORK / LIVE
      </div>

      <div
        className="absolute bottom-4 right-4 text-[10px] text-[#a3ff12]/30 z-10"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {NODE_COUNT} NODES
      </div>

      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-2xl"
        style={{ display: "block" }}
      />
    </div>
  );
}

const NODE_COUNT = 20;
