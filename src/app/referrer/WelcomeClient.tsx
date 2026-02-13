"use client";

import Link from "next/link";

const STEPS = [
    {
        num: 1,
        title: "Post a job & roles",
        desc: "Describe the role you're hiring for — title, team, seniority, skills — so we can find great matches.",
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            </svg>
        ),
    },
    {
        num: 2,
        title: "Get ranked candidates",
        desc: "Our matching engine scores candidates against your role. Review the best fits first.",
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
        ),
    },
    {
        num: 3,
        title: "Accept or decline",
        desc: "Review each candidate's profile and portfolio. Accept to refer them, decline to pass.",
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 11 12 14 22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
        ),
    },
    {
        num: 4,
        title: "Intro request sent",
        desc: "Once you accept, the candidate is notified and the intro is facilitated. Track everything in your dashboard.",
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
        ),
    },
];

export default function ReferrerWelcomeClient({ name }: { name: string }) {
    return (
        <div className="min-h-screen">
            {/* ── Hero ── */}
            <section className="min-h-[85vh] flex flex-col items-center justify-center px-6 text-center">
                <p className="text-white/30 text-sm font-medium tracking-wider uppercase mb-3">
                    Referrer
                </p>
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">
                    Welcome, {name}
                </h1>
                <p className="text-white/40 text-lg max-w-md mb-10">
                    Source pre-vetted candidates and earn your reputation as a top referrer
                </p>

                <div className="flex items-center gap-3">
                    <Link
                        href="/referrer/post-job"
                        className="px-8 py-3 rounded-xl font-semibold text-[15px] text-white no-underline
                            bg-gradient-to-br from-teal-500 to-teal-600
                            hover:from-teal-400 hover:to-teal-500
                            hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-500/25
                            active:translate-y-0 active:scale-[0.98]
                            transition-all duration-200"
                    >
                        Post a Job
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
                    Four steps to refer top talent and build your reputation
                </p>

                <div className="flex flex-col gap-6">
                    {STEPS.map((step) => (
                        <div
                            key={step.num}
                            className="flex gap-5 items-start p-5 rounded-2xl bg-white/[0.025] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-200"
                        >
                            <div className="shrink-0 w-14 h-14 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                                {step.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[11px] font-bold text-teal-400/60 uppercase tracking-widest">
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

                <div className="mt-12 text-center">
                    <Link
                        href="/referrer/post-job"
                        className="inline-block px-10 py-3.5 rounded-xl font-semibold text-[15px] text-white no-underline
                            bg-gradient-to-br from-teal-500 to-teal-600
                            hover:from-teal-400 hover:to-teal-500
                            hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-500/25
                            active:translate-y-0 active:scale-[0.98]
                            transition-all duration-200"
                    >
                        Post a Job →
                    </Link>
                    <div className="mt-4">
                        <Link
                            href="/referrer/dashboard"
                            className="text-xs text-white/30 no-underline hover:text-white/50 transition-colors"
                        >
                            Go to dashboard
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
