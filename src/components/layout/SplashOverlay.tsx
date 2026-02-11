"use client";

import { Role } from "@/lib/auth/role";
import { VouchWordmark } from "@/components/ui/VouchWordmark";


interface SplashOverlayProps {
    open: boolean;
    theme: Role;
}

export default function SplashOverlay({ open, theme }: SplashOverlayProps) {
    if (!open) return null;

    const accentVar = theme === "referrer" ? "--accent-teal" : "--accent-indigo";

    return (
        <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-[#121212]"
                style={{
                    animation: "fade-in-out 450ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards"
                }}
            >
                {/* Dynamic Aura - Target Theme Based */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: `radial-gradient(circle at center, rgba(var(${accentVar}), 0.25), transparent 60%)`
                    }}
                />
            </div>

            {/* Logo - Dynamic Color - Target Theme Based */}
            <div
                className="relative z-10"
                style={{
                    color: `rgb(var(${accentVar}))`,
                    animation: "logo-scale 450ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards"
                }}
            >
                <VouchWordmark size="2xl" />
            </div>
        </div>
    );
}
