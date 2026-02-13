"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { VouchWordmark } from "@/components/ui/VouchWordmark";
import { Mail, Lock, Eye, EyeOff, Zap, Target, ArrowRight, AlertCircle, Sparkles } from "lucide-react";

const inputClasses =
    "w-full pl-10 pr-3.5 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[15px] outline-none transition-all duration-200 placeholder:text-white/25 focus:border-[var(--button)]/30 focus:bg-white/[0.06] focus:ring-1 focus:ring-[var(--button)]/20";

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const supabase = createClient();
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/onboarding` },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        router.push("/onboarding");
        router.refresh();
    }

    const pwStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
    const pwColors = ["bg-white/10", "bg-red-400", "bg-amber-400", "bg-emerald-400"];
    const pwLabels = ["", "Weak", "Fair", "Strong"];

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            {/* Animated gradient orbs — uses theme accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none">
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full blur-[120px] animate-pulse"
                    style={{ background: "var(--accent-aura)" }}
                />
                <div
                    className="absolute bottom-10 right-10 w-[250px] h-[250px] rounded-full blur-[100px] animate-pulse [animation-delay:1s]"
                    style={{ background: "var(--accent-glow)" }}
                />
            </div>

            <div className="w-full max-w-[420px] relative z-10">
                {/* Glass card */}
                <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.03)] overflow-hidden">
                    {/* Top glow */}
                    <div
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-[250px] h-[1px] pointer-events-none"
                        style={{ background: `linear-gradient(90deg, transparent, var(--accent-aura), transparent)` }}
                    />

                    <div className="p-8 pb-6">
                        {/* Logo */}
                        <div className="flex justify-center mb-6">
                            <div
                                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                                style={{ background: "var(--button)", boxShadow: "0 8px 24px var(--accent-glow)" }}
                            >
                                <VouchWordmark size="sm" className="text-white" style={{ fontSize: 16, letterSpacing: "-0.05em" }} />
                            </div>
                        </div>

                        {/* Header */}
                        <h1 className="text-[26px] font-bold text-white text-center tracking-tight mb-1">
                            Create your account
                        </h1>
                        <p className="text-white/35 text-center text-sm mb-7">
                            Join Vouch and get matched today
                        </p>

                        {/* Error alert */}
                        {error && (
                            <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-500/8 border border-red-500/15 text-red-400 text-sm mb-5">
                                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {/* Email */}
                            <div className="relative">
                                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className={inputClasses}
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                                    <input
                                        type={showPw ? "text" : "password"}
                                        placeholder="Password (min 6 characters)"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        className={inputClasses + " pr-10"}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPw(!showPw)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                                        tabIndex={-1}
                                    >
                                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>

                                {/* Password strength */}
                                {password.length > 0 && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="flex-1 flex gap-1">
                                            {[1, 2, 3].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${pwStrength >= level ? pwColors[pwStrength] : "bg-white/[0.06]"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className={`text-[11px] font-medium ${pwStrength >= 3 ? "text-emerald-400/60" : pwStrength >= 2 ? "text-amber-400/60" : "text-red-400/60"
                                            }`}>
                                            {pwLabels[pwStrength]}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`
                                    w-full py-3 rounded-xl font-semibold text-[15px] text-white
                                    transition-all duration-200 outline-none flex items-center justify-center gap-2
                                    hover:-translate-y-0.5
                                    active:translate-y-0 active:scale-[0.98]
                                    ${loading ? "opacity-60 cursor-not-allowed" : ""}
                                `}
                                style={{
                                    background: "var(--button)",
                                    boxShadow: "0 4px 16px var(--accent-glow)",
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--button-hover)"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--button)"; }}
                            >
                                {loading ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Creating account…
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={16} />
                                        Create Account
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-white/[0.04]" />

                    {/* Footer */}
                    <div className="px-8 py-4 bg-white/[0.01]">
                        <p className="text-white/30 text-center text-sm">
                            Already have an account?{" "}
                            <a
                                href="/login"
                                className="no-underline transition-colors font-medium"
                                style={{ color: "rgb(var(--accent-hover))" }}
                            >
                                Sign in →
                            </a>
                        </p>
                    </div>
                </div>

                {/* Feature bullets */}
                <div className="mt-8 flex flex-col items-center gap-3">
                    {[
                        { icon: <Zap size={13} />, text: "Direct intros, not job boards" },
                        { icon: <Target size={13} />, text: "Matched by role-fit + acceptance odds" },
                        { icon: <ArrowRight size={13} />, text: "Fast onboarding in under 2 minutes" },
                    ].map((b) => (
                        <div key={b.text} className="flex items-center gap-2.5 text-white/20 text-xs">
                            <span style={{ color: "var(--accent-weak)" }}>{b.icon}</span>
                            <span>{b.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
