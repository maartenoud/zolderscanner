"use client";

import { useState, useEffect } from "react";

interface Dot {
  id: number;
  x: number;
  y: number;
  size: number;
}

export default function ScanParticles({ active }: { active: boolean }) {
  const [dots, setDots] = useState<Dot[]>([]);

  useEffect(() => {
    if (!active) {
      setDots([]);
      return;
    }
    const id = setInterval(() => {
      setDots((prev) => {
        const next = [
          ...prev,
          {
            id: Date.now(),
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: 3 + Math.random() * 5,
          },
        ];
        return next.slice(-20);
      });
    }, 180);
    return () => clearInterval(id);
  }, [active]);

  if (!active) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        borderRadius: 16,
        pointerEvents: "none",
      }}
    >
      {dots.map((d) => (
        <div
          key={d.id}
          style={{
            position: "absolute",
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.size,
            height: d.size,
            borderRadius: "50%",
            background: "#22c55e",
            opacity: 0.7,
            animation: "pulse-dot 1.2s ease-out forwards",
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: 3,
          background:
            "linear-gradient(90deg, transparent, #22c55e, transparent)",
          animation: "scan-line 2s ease-in-out infinite",
        }}
      />
    </div>
  );
}
