import type { ReactNode } from "react";

interface SurfaceProps {
  children: ReactNode;
  className?: string;
}

export default function Surface({ children, className = "" }: SurfaceProps) {
  return (
    <div
      className={`h-full w-full rounded-[var(--radius-lg)] p-8 ${className}`}
      style={{
        background: `
          linear-gradient(
            165deg,
            rgb(28 28 30 / 0.95) 0%,
            rgb(18 18 20 / 0.98) 100%
          )
        `,
        boxShadow: `
          0 10px 40px -10px rgba(0,0,0,0.5),
          0 0 0 1px rgba(255,255,255,0.03) inset,
          0 1px 0 0 var(--accent-aura) inset
        `,
        // Removing external border, relying on inner light and shadow for separation
        backdropFilter: "blur(12px)",
      }}
    >
      {children}
    </div>
  );
}
