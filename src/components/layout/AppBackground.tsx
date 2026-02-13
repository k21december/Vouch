"use client";

import { useTheme } from "@/lib/auth/ThemeProvider";
import { themeMap, UserTheme } from "@/lib/theme";

export default function AppBackground({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();

    const t = theme as UserTheme;
    const grad = themeMap[t] ?? themeMap.navy;

    return (
        <div
            className="relative min-h-screen text-white transition-colors duration-700"
            style={{ backgroundColor: grad.base }}
        >
            {/* Gradient layers */}
            <div
                className="fixed inset-0 pointer-events-none transition-opacity duration-700"
                style={{ backgroundImage: grad.layers.join(", ") }}
            />

            {/* Vignette — darkens edges for depth */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{ backgroundImage: grad.vignette }}
            />

            {/* Slow-pulse ambient orb */}
            <div
                className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[700px] pointer-events-none animate-bg-pulse"
                style={{
                    backgroundImage: grad.layers[1], // Use the colored orb layer
                    filter: "blur(120px)",
                    opacity: 0.15,
                }}
            />

            {/* Content */}
            <div className="relative z-10">{children}</div>
        </div>
    );
}
