"use client";

import Link from "next/link";

const STEPS = [
    {
        num: 1,
        title: "Complete your profile",
        desc: "Add your skills, domains, years of experience, and target role so we can match you.",
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        ),
    },
    {
        num: 2,
        title: "Upload your portfolio",
        desc: "Add a PDF résumé or portfolio. Referrers see this when deciding to vouch for you.",
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
            </svg>
        ),
    },
    {
        num: 3,
        title: "Swipe on matches",
        desc: "Browse referrers matched to your profile. Swipe right to request an intro, left to skip.",
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 12h6M12 9v6" />
            </svg>
        ),
    },
    {
        num: 4,
        title: "Get intro requests",
        desc: "When a referrer accepts, you both get connected. Land interviews through warm intros.",
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        ),
    },
];

export default function CandidateWelcomeClient({ name }: { name: string }) {
    return (
        <div className="min-h-screen">
            {/* ── Hero ── */}
            <section className="min-h-[85vh] flex flex-col items-center justify-center px-6 text-center">
                <p className="text-white/30 text-sm font-medium tracking-wider uppercase mb-3">
                    Candidate
                </p>
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">
                    Welcome, {name}
                </h1>
                <p className="text-white/40 text-lg max-w-md mb-10">
                    Get matched with referrers who can vouch for you at top companies
                </p>

                <div className="flex items-center gap-3">
                    <Link
                        href="/candidate/discover"
                        className="px-8 py-3 rounded-xl font-semibold text-[15px] text-white no-underline
                            bg-gradient-to-br from-indigo-500 to-indigo-600
                            hover:from-indigo-400 hover:to-indigo-500
                            hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/25
                            active:translate-y-0 active:scale-[0.98]
                            transition-all duration-200"
                    >
                        Start Swiping
                    </Link>
                    <button
                        onClick={() =>
                            document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="px-8 py-3 rounded-xl font-semibold text-[15px]
                            text-white/60 border border-white/[0.1] bg-white/[0.03]
                            hover:bg-white/[0.06] hover:text-white/80 hover:border-white/[0.15]
                            hover:-translate-y-0.5
                            active:translate-y-0 active:scale-[0.98]
                            transition-all duration-200"
                    >
                        How it works ↓
                    </button>
                </div>

                {/* Scroll hint */}
                <div className="mt-16 animate-bounce text-white/20">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </div>
            </section>

            {/* ── Demo Section ── */}
            <section id="demo" className="px-6 pb-24 pt-16 max-w-[640px] mx-auto">
                <h2 className="text-2xl font-bold text-white text-center mb-2">
                    How Vouch works
                </h2>
                <p className="text-white/40 text-sm text-center mb-12">
                    Four steps to land your next role through warm intros
                </p>

                <div className="flex flex-col gap-6">
                    {STEPS.map((step) => (
                        <div
                            key={step.num}
                            className="flex gap-5 items-start p-5 rounded-2xl bg-white/[0.025] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-200"
                        >
                            {/* Number + Icon */}
                            <div className="shrink-0 w-14 h-14 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                {step.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[11px] font-bold text-indigo-400/60 uppercase tracking-widest">
                                        Step {step.num}
                                    </span>
                                </div>
                                <h3 className="text-[15px] font-semibold text-white mb-1">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-white/40 leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-12 text-center">
                    <Link
                        href="/candidate/discover"
                        className="inline-block px-10 py-3.5 rounded-xl font-semibold text-[15px] text-white no-underline
                            bg-gradient-to-br from-indigo-500 to-indigo-600
                            hover:from-indigo-400 hover:to-indigo-500
                            hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/25
                            active:translate-y-0 active:scale-[0.98]
                            transition-all duration-200"
                    >
                        Start Swiping →
                    </Link>
                    <div className="mt-4">
                        <Link
                            href="/candidate/profile"
                            className="text-xs text-white/30 no-underline hover:text-white/50 transition-colors"
                        >
                            Edit profile
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
