"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { VouchWordmark } from "@/components/ui/VouchWordmark";


export default function LoginPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect if already logged in
        const auth = localStorage.getItem("vouch.auth");
        if (auth === "true") {
            router.replace("/");
        }
    }, [router]);

    const handleLogin = () => {
        localStorage.setItem("vouch.auth", "true");
        router.push("/");
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--accent-subtle),_transparent_70%)] opacity-20" />

            <div className="z-10 flex flex-col items-center gap-12 w-full max-w-sm">
                {/* Logo */}
                <div className="flex flex-col items-center gap-2">
                    <VouchWordmark size="2xl" className="text-white scale-125" />

                    <p className="text-lg text-white/50">Professional validation.</p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col w-full gap-4">
                    <button
                        onClick={handleLogin}
                        className="group relative flex w-full items-center justify-center gap-3 rounded-2xl bg-white/5 p-4 text-base font-bold text-white transition-all hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="opacity-70">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </button>

                    <button
                        onClick={handleLogin}
                        className="group relative flex w-full items-center justify-center gap-3 rounded-2xl bg-white/5 p-4 text-base font-bold text-white transition-all hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <svg width="20" height="20" viewBox="0 0 23 23" fill="currentColor" className="opacity-70">
                            <path fill="#f3f3f3" d="M0 0h23v23H0z" />
                            <path fill="#f35325" d="M1 1h10v10H1z" />
                            <path fill="#81bc06" d="M12 1h10v10H12z" />
                            <path fill="#05a6f0" d="M1 12h10v10H1z" />
                            <path fill="#ffba08" d="M12 12h10v10H12z" />
                        </svg>
                        Continue with Microsoft
                    </button>

                    <button
                        onClick={handleLogin}
                        className="group relative flex w-full items-center justify-center gap-3 rounded-2xl bg-white/5 p-4 text-base font-bold text-white transition-all hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        Continue with Phone
                    </button>
                </div>
            </div>
        </div>
    );
}
