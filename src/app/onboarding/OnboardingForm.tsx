"use client";

import { useState, useEffect } from "react";
import { completeOnboarding } from "./actions";

interface InitialData {
    fullName: string;
    portfolio: string;
    phone: string;
    role: "candidate" | "referrer" | null;
}

export default function OnboardingForm({
    userEmail,
    initial,
}: {
    userEmail: string;
    initial: InitialData;
}) {
    const [role, setRole] = useState<"candidate" | "referrer" | null>(initial.role);
    const [fullName, setFullName] = useState(initial.fullName);
    const [portfolio, setPortfolio] = useState(initial.portfolio);
    const [phone, setPhone] = useState(initial.phone);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (!error) return;
        setShowToast(true);
        const t = setTimeout(() => setShowToast(false), 4000);
        return () => clearTimeout(t);
    }, [error]);

    function validate(): string | null {
        if (!role) return "Please select a role";
        if (fullName.trim().length < 2) return "Name must be at least 2 characters";
        if (portfolio.trim() && !portfolio.trim().startsWith("http://") && !portfolio.trim().startsWith("https://"))
            return "Portfolio URL must start with http:// or https://";
        const digits = phone.replace(/\D/g, "");
        if (phone.trim() && digits.length < 7) return "Phone must be at least 7 digits";
        return null;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const clientErr = validate();
        if (clientErr) {
            setError(clientErr);
            return;
        }
        setError(null);
        setLoading(true);

        const fd = new FormData();
        fd.set("role", role!);
        fd.set("fullName", fullName.trim());
        fd.set("portfolio", portfolio.trim());
        fd.set("phone", phone.trim());

        const result = await completeOnboarding(fd);
        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
    }

    return (
        <>
            {/* Toast */}
            {showToast && error && (
                <div
                    className="fixed top-5 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[calc(100%-2rem)] px-4 py-3 rounded-xl bg-red-500/15 border border-red-500/25 backdrop-blur-lg text-red-400 text-sm font-medium shadow-lg shadow-red-500/5 animate-[slideDown_300ms_ease-out]"
                    role="alert"
                >
                    <div className="flex items-center gap-2.5">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <span>{error}</span>
                        <button
                            onClick={() => setShowToast(false)}
                            className="ml-auto text-red-400/60 hover:text-red-400 transition-colors"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-[460px] flex flex-col gap-6"
            >
                {/* Header */}
                <div className="text-center space-y-1">
                    <h1 className="text-[28px] font-bold text-white tracking-tight">
                        Welcome to Vouch
                    </h1>
                    <p className="text-sm text-white/40">{userEmail}</p>
                </div>

                {/* Role Selection */}
                <div className="space-y-3">
                    <label className="text-white/50 text-xs font-medium uppercase tracking-wider block">
                        I am a…
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <RoleCard
                            selected={role === "candidate"}
                            onClick={() => setRole("candidate")}
                            icon={
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 8v8M8 12h8" />
                                </svg>
                            }
                            title="Candidate"
                            subtitle="Looking for referrals"
                            accentColor="139, 92, 246"
                        />
                        <RoleCard
                            selected={role === "referrer"}
                            onClick={() => setRole("referrer")}
                            icon={
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            }
                            title="Referrer"
                            subtitle="Refer top talent"
                            accentColor="20, 184, 166"
                        />
                    </div>
                </div>

                {/* Full Name */}
                <div className="space-y-1.5">
                    <label className="text-white/50 text-xs font-medium block">
                        Full name <span className="text-red-400/60">*</span>
                    </label>
                    <input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        minLength={2}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm outline-none transition-all duration-200 placeholder:text-white/20 focus:border-white/20 focus:bg-white/[0.06] focus:ring-1 focus:ring-white/10"
                        placeholder="Alex Chen"
                    />
                </div>

                {/* Email (read-only) */}
                <div className="space-y-1.5">
                    <label className="text-white/50 text-xs font-medium block">
                        Email
                    </label>
                    <div className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-white/40 text-sm select-none">
                        {userEmail}
                    </div>
                </div>

                {/* Portfolio + Phone row */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <label className="text-white/50 text-xs font-medium block">
                            Portfolio URL
                        </label>
                        <input
                            value={portfolio}
                            onChange={(e) => setPortfolio(e.target.value)}
                            type="url"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm outline-none transition-all duration-200 placeholder:text-white/20 focus:border-white/20 focus:bg-white/[0.06] focus:ring-1 focus:ring-white/10"
                            placeholder="https://…"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-white/50 text-xs font-medium block">
                            Phone
                        </label>
                        <input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            type="tel"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm outline-none transition-all duration-200 placeholder:text-white/20 focus:border-white/20 focus:bg-white/[0.06] focus:ring-1 focus:ring-white/10"
                            placeholder="+1 555 123 4567"
                        />
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading || !role}
                    className={`
                        w-full py-3 rounded-xl font-semibold text-[15px] text-white
                        transition-all duration-200 outline-none
                        ${role
                            ? "bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/25 active:translate-y-0 active:scale-[0.98]"
                            : "bg-white/[0.06] text-white/30 cursor-not-allowed"
                        }
                        ${loading ? "opacity-60 cursor-not-allowed" : ""}
                    `}
                >
                    {loading ? "Setting up…" : "Continue →"}
                </button>
            </form>
        </>
    );
}

/* ──────────────────────────────────────────────────── */
/* Role Selection Card                                  */
/* ──────────────────────────────────────────────────── */

function RoleCard({
    selected,
    onClick,
    icon,
    title,
    subtitle,
    accentColor,
}: {
    selected: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    accentColor: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                group relative flex flex-col items-center gap-3 p-6 rounded-2xl
                transition-all duration-200 cursor-pointer outline-none
                border text-center min-h-[140px] justify-center
                ${selected
                    ? "border-white/20 bg-white/[0.06]"
                    : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] hover:-translate-y-0.5"
                }
            `}
            style={selected ? {
                boxShadow: `0 0 24px rgba(${accentColor}, 0.12), 0 0 0 1px rgba(${accentColor}, 0.25)`,
            } : undefined}
        >
            {selected && (
                <div
                    className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: `rgba(${accentColor}, 0.2)` }}
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={`rgb(${accentColor})`} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
            )}

            <div
                className="transition-colors duration-200"
                style={{ color: selected ? `rgb(${accentColor})` : "rgba(255,255,255,0.35)" }}
            >
                {icon}
            </div>

            <div className="space-y-0.5">
                <div
                    className="font-semibold text-[15px] transition-colors duration-200"
                    style={{ color: selected ? "#fff" : "rgba(255,255,255,0.7)" }}
                >
                    {title}
                </div>
                <div className="text-xs text-white/30">{subtitle}</div>
            </div>
        </button>
    );
}
