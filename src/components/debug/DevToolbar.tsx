"use client";

import { useEffect, useState } from "react";
import { useRole } from "@/lib/auth/useRole";
import { StorageService } from "@/lib/storage"; // Will be used for resets
import type { Session } from "@/types";

export default function DevToolbar() {
    const { role, switchUser } = useRole();
    const [isOpen, setIsOpen] = useState(false);
    const [currentSession, setCurrentSession] = useState<Session | null>(null);

    // Poll session for UI updates (Toolbar only)
    useEffect(() => {
        const interval = setInterval(() => {
            const session = StorageService.getSession();
            setCurrentSession(session);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    if (process.env.NODE_ENV === "production" && !isOpen) return null; // Or hide completely

    return (
        <div className="fixed bottom-4 left-4 z-[9999] flex flex-col gap-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="h-8 w-8 rounded-full bg-red-500/20 text-[10px] font-bold text-red-500 hover:bg-red-500/40 border border-red-500/50 flex items-center justify-center transition-all"
            >
                {isOpen ? "X" : "DEV"}
            </button>

            {isOpen && (
                <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-[#0A0A0A]/95 p-3 shadow-2xl backdrop-blur-md w-64 animate-in fade-in slide-in-from-bottom-5">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                            Lifecycle Simulation
                        </span>
                        <div className={`h-2 w-2 rounded-full ${role === "referrer" ? "bg-teal-500" : "bg-indigo-500"}`} />
                    </div>

                    <div className="flex flex-col gap-1 py-1">
                        <div className="text-xs text-white/50">Current: <span className="text-white font-mono">{currentSession?.userId}</span></div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => switchUser("referrer_1", "referrer")}
                            className={`rounded-lg px-3 py-2 text-xs font-bold transition-all ${currentSession?.userId === "referrer_1"
                                    ? "bg-teal-500/20 text-teal-500 ring-1 ring-teal-500/50"
                                    : "bg-white/5 text-white/60 hover:bg-white/10"
                                }`}
                        >
                            Referrer (You)
                        </button>
                        <button
                            onClick={() => switchUser("candidate_1", "candidate")}
                            className={`rounded-lg px-3 py-2 text-xs font-bold transition-all ${currentSession?.userId === "candidate_1"
                                    ? "bg-indigo-500/20 text-indigo-500 ring-1 ring-indigo-500/50"
                                    : "bg-white/5 text-white/60 hover:bg-white/10"
                                }`}
                        >
                            Candidate (Sarah)
                        </button>
                    </div>

                    <div className="mt-2 text-xs font-mono text-white/30 border-t border-white/5 pt-2">
                        Actions
                    </div>

                    <button
                        onClick={() => {
                            if (confirm("Reset all simulation data?")) {
                                StorageService.reset();
                            }
                        }}
                        className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-bold text-red-500 transition-colors hover:bg-red-500/20"
                    >
                        Reset World
                    </button>
                </div>
            )}
        </div>
    );
}
