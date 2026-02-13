"use client";

import { clsx } from "clsx";

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    icon?: React.ReactNode;
    title?: string;
    subtitle?: string;
    accent?: "indigo" | "teal";
}

export default function GlassCard({ children, className, icon, title, subtitle, accent = "indigo" }: GlassCardProps) {
    const glowColor = accent === "teal" ? "teal" : "indigo";

    return (
        <div
            className={clsx(
                "relative rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm",
                "shadow-[0_0_0_1px_rgba(255,255,255,0.03)] overflow-hidden",
                className
            )}
        >
            {/* Top glow */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[1px] pointer-events-none"
                style={{
                    background: `linear-gradient(90deg, transparent, ${glowColor === "teal" ? "rgba(20,184,166,0.4)" : "rgba(99,102,241,0.4)"}, transparent)`,
                }}
            />

            {(title || icon) && (
                <div className="flex items-center gap-3 px-6 pt-5 pb-0">
                    {icon && (
                        <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${accent === "teal" ? "bg-teal-500/10 text-teal-400" : "bg-indigo-500/10 text-indigo-400"
                            }`}>
                            {icon}
                        </div>
                    )}
                    <div>
                        {title && <h3 className="text-[15px] font-semibold text-white">{title}</h3>}
                        {subtitle && <p className="text-xs text-white/35 mt-0.5">{subtitle}</p>}
                    </div>
                </div>
            )}

            <div className="p-6">{children}</div>
        </div>
    );
}
