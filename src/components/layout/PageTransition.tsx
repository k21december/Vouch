"use client";

import { useTheme } from "@/lib/auth/ThemeProvider";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { VouchWordmark } from "@/components/ui/VouchWordmark";


export default function PageTransition({
    children,
}: {
    children: React.ReactNode;
}) {
    const { role } = useTheme();
    const pathname = usePathname();
    const [isTransitioning, setIsTransitioning] = useState(false);

    const [transitionAccent, setTransitionAccent] = useState("--accent-indigo");

    // Ref to track previous path
    const prevPath = useRef(pathname);

    useEffect(() => {
        // Only trigger on specific route navigations (not role changes)
        const isHomeNav = pathname === "/" && prevPath.current !== "/";
        const isDiscoverNav = pathname === "/discover" && prevPath.current === "/";

        if (isHomeNav || isDiscoverNav) {
            // Use CURRENT role for route transitions
            if (role === "referrer") {
                setTransitionAccent("--accent-teal");
            } else {
                setTransitionAccent("--accent-indigo");
            }

            setIsTransitioning(true);
            const timer = setTimeout(() => setIsTransitioning(false), 450);

            prevPath.current = pathname;

            return () => clearTimeout(timer);
        } else {
            // Update ref even if no transition
            prevPath.current = pathname;
        }
    }, [role, pathname]);

    return (
        <>
            {/* Overlay */}
            {isTransitioning && (
                <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-[#121212]"
                        style={{
                            animation: "fade-in-out 450ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards"
                        }}
                    >
                        {/* Dynamic Aura in Overlay - Current Role Based */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background: `radial-gradient(circle at center, rgba(var(${transitionAccent}), 0.25), transparent 60%)`
                            }}
                        />
                    </div>

                    {/* Logo - Dynamic Color - Current Role Based */}
                    <div
                        className="relative z-10"
                        style={{
                            color: `rgb(var(${transitionAccent}))`,
                            animation: "logo-scale 450ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards"
                        }}
                    >
                        <VouchWordmark size="2xl" />
                    </div>
                </div>
            )}
            {children}
        </>
    );
}
