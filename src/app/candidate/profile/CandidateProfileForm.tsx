"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { updateCandidateProfile, uploadPortfolio } from "./actions";
import GlassCard from "@/components/ui/GlassCard";
import TagInput from "@/components/ui/TagInput";
import { User, Target, Wrench, Globe, FileText, Upload, CheckCircle2, Circle } from "lucide-react";

const ROLE_GROUPS: { label: string; roles: string[] }[] = [
    {
        label: "Software Engineering",
        roles: [
            "Frontend Engineer", "Backend Engineer", "Full Stack Engineer", "Mobile Engineer",
            "Platform Engineer", "DevOps Engineer", "Site Reliability Engineer", "Security Engineer",
            "Systems Engineer", "Embedded Software Engineer", "Game Developer",
        ],
    },
    {
        label: "Data / AI",
        roles: [
            "Data Analyst", "Data Scientist", "Machine Learning Engineer", "AI Engineer",
            "Research Engineer", "Applied Scientist", "MLOps Engineer", "Quantitative Analyst",
            "Quantitative Researcher",
        ],
    },
    {
        label: "Hardware / Robotics",
        roles: [
            "Hardware Engineer", "Electrical Engineer", "Firmware Engineer", "Robotics Engineer",
            "Controls Engineer", "FPGA Engineer", "Semiconductor Engineer", "Mechatronics Engineer",
        ],
    },
    {
        label: "Product / Hybrid",
        roles: [
            "Product Manager", "Technical Product Manager", "Solutions Engineer", "Sales Engineer",
            "Technical Program Manager", "UX Engineer", "UX Designer", "Technical Consultant",
        ],
    },
    {
        label: "Research",
        roles: ["Research Scientist", "Research Engineer", "PhD Intern", "Applied Researcher"],
    },
];

interface Props {
    initial: {
        yearsWorking: number;
        skills: string[];
        domains: string[];
        intentRole: string;
        intentRoleCustom: string;
        portfolioFilename: string | null;
        portfolioUploadedAt: string | null;
    };
}

const inputClasses =
    "w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm outline-none transition-all duration-200 placeholder:text-white/20 focus:border-white/20 focus:bg-white/[0.06] focus:ring-1 focus:ring-white/10";

export default function CandidateProfileForm({ initial }: Props) {
    const router = useRouter();
    const [yearsText, setYearsText] = useState(
        initial.yearsWorking === 0 ? "0" : String(initial.yearsWorking)
    );
    const [skills, setSkills] = useState<string[]>(initial.skills);
    const [domains, setDomains] = useState<string[]>(initial.domains);
    const [intentRole, setIntentRole] = useState(initial.intentRole);
    const [intentRoleCustom, setIntentRoleCustom] = useState(initial.intentRoleCustom);

    const [portfolioFilename, setPortfolioFilename] = useState(initial.portfolioFilename);
    const [portfolioUploadedAt, setPortfolioUploadedAt] = useState(initial.portfolioUploadedAt);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const [feedback, setFeedback] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!feedback) return;
        const t = setTimeout(() => setFeedback(null), 4000);
        return () => clearTimeout(t);
    }, [feedback]);

    function handleYearsChange(e: React.ChangeEvent<HTMLInputElement>) {
        const raw = e.target.value;
        if (raw === "") { setYearsText(""); return; }
        const digits = raw.replace(/\D/g, "");
        if (digits === "") { setYearsText(""); return; }
        setYearsText(String(Number(digits)));
    }
    function handleYearsBlur() {
        if (yearsText === "") { setYearsText("0"); return; }
        setYearsText(String(Math.min(40, Math.max(0, Number(yearsText)))));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFeedback(null);
        setLoading(true);

        const fd = new FormData();
        fd.set("yearsWorking", yearsText || "0");
        fd.set("skills", skills.join(", "));
        fd.set("domains", domains.join(", "));
        fd.set("intentRole", intentRole);
        fd.set("intentRoleCustom", intentRole === "Other" ? intentRoleCustom : "");

        const result = await updateCandidateProfile(fd);
        setLoading(false);
        if (result.error) {
            setFeedback("error:" + result.error);
        } else {
            setFeedback("success:Profile saved! Redirecting…");
            setTimeout(() => router.push("/candidate"), 600);
        }
    }

    async function handleFileUpload(file: File) {
        if (file.type !== "application/pdf") { setFeedback("error:Only PDF files are accepted"); return; }
        if (file.size > 10 * 1024 * 1024) { setFeedback("error:File must be under 10 MB"); return; }

        setUploading(true);
        setFeedback(null);
        const fd = new FormData();
        fd.set("file", file);
        const result = await uploadPortfolio(fd);
        setUploading(false);

        if (result.error) {
            setFeedback("error:" + result.error);
        } else {
            setPortfolioFilename(result.filename ?? file.name);
            setPortfolioUploadedAt(result.uploadedAt ?? new Date().toISOString());
            setFeedback("success:Portfolio uploaded!");
        }
        if (fileRef.current) fileRef.current.value = "";
    }

    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) handleFileUpload(file);
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFileUpload(file);
    }

    async function handleViewPortfolio() {
        try {
            const res = await fetch("/api/portfolio/signed-url");
            const data = await res.json();
            if (data.url) { window.open(data.url, "_blank", "noopener"); }
            else { setFeedback("error:" + (data.error ?? "Could not load portfolio")); }
        } catch { setFeedback("error:Failed to load portfolio URL"); }
    }

    const isError = feedback?.startsWith("error:");
    const feedbackMsg = feedback?.replace(/^(error:|success:)/, "");

    const basicsComplete = yearsText !== "" && intentRole !== "";
    const prefsComplete = skills.length > 0;
    const portfolioComplete = !!portfolioFilename;

    const sections = [
        { label: "Basics", done: basicsComplete },
        { label: "Preferences", done: prefsComplete },
        { label: "Portfolio", done: portfolioComplete },
    ];

    return (
        <form onSubmit={handleSubmit}>
            {/* Feedback toast */}
            {feedback && (
                <div
                    className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium border transition-all duration-300 ${isError
                        ? "bg-red-500/10 border-red-500/20 text-red-400"
                        : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        }`}
                    role="alert"
                >
                    <div className="flex items-center gap-2">
                        <span>{isError ? "✕" : "✓"}</span>
                        <span>{feedbackMsg}</span>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
                {/* LEFT — Form sections */}
                <div className="space-y-6">
                    {/* Section 1: Basics */}
                    <GlassCard
                        accent="indigo"
                        icon={<User size={18} />}
                        title="Basics"
                        subtitle="Your experience and target role"
                    >
                        <div className="space-y-5">
                            {/* Years Working */}
                            <div className="space-y-1.5">
                                <label className="text-white/50 text-xs font-medium block">
                                    Years Working (Full-time) <span className="text-red-400/60">*</span>
                                </label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={yearsText}
                                    onChange={handleYearsChange}
                                    onBlur={handleYearsBlur}
                                    required
                                    className={inputClasses + " max-w-[120px]"}
                                    placeholder="e.g. 5"
                                />
                                <p className="text-[11px] text-white/20">0–40 years</p>
                            </div>

                            {/* Target Role */}
                            <div className="space-y-1.5">
                                <label className="text-white/50 text-xs font-medium flex items-center gap-1.5">
                                    <Target size={12} className="text-white/30" />
                                    Target Role <span className="text-red-400/60">*</span>
                                </label>
                                <select
                                    value={intentRole}
                                    onChange={(e) => {
                                        setIntentRole(e.target.value);
                                        if (e.target.value !== "Other") setIntentRoleCustom("");
                                    }}
                                    className={inputClasses}
                                >
                                    {ROLE_GROUPS.map((group) => (
                                        <optgroup key={group.label} label={group.label}>
                                            {group.roles.map((r) => (
                                                <option key={r} value={r}>{r}</option>
                                            ))}
                                        </optgroup>
                                    ))}
                                    <optgroup label="──────────">
                                        <option value="Other">Other</option>
                                    </optgroup>
                                </select>
                            </div>

                            {intentRole === "Other" && (
                                <div className="space-y-1.5 -mt-2">
                                    <label className="text-white/50 text-xs font-medium block">
                                        Specify your role <span className="text-red-400/60">*</span>
                                    </label>
                                    <input
                                        value={intentRoleCustom}
                                        onChange={(e) => setIntentRoleCustom(e.target.value)}
                                        required
                                        minLength={2}
                                        placeholder="e.g. Blockchain Engineer"
                                        className={inputClasses}
                                    />
                                </div>
                            )}
                        </div>
                    </GlassCard>

                    {/* Section 2: Preferences */}
                    <GlassCard
                        accent="indigo"
                        icon={<Wrench size={18} />}
                        title="Skills & Domains"
                        subtitle="Help referrers find you"
                    >
                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-white/50 text-xs font-medium block">
                                    Skills <span className="text-white/20 font-normal">(max 25)</span>
                                </label>
                                <TagInput
                                    value={skills}
                                    onChange={setSkills}
                                    placeholder="Type a skill and press Enter…"
                                    accent="indigo"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-white/50 text-xs font-medium flex items-center gap-1.5">
                                    <Globe size={12} className="text-white/30" />
                                    Domains
                                </label>
                                <TagInput
                                    value={domains}
                                    onChange={setDomains}
                                    placeholder="Type a domain and press Enter…"
                                    accent="indigo"
                                />
                            </div>
                        </div>
                    </GlassCard>

                    {/* Section 3: Portfolio */}
                    <GlassCard
                        accent="indigo"
                        icon={<FileText size={18} />}
                        title="Portfolio"
                        subtitle="Upload a PDF résumé or portfolio"
                    >
                        <div className="space-y-4">
                            {/* Current file */}
                            {portfolioFilename && (
                                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-500/5 border border-indigo-500/15">
                                    <div className="shrink-0 w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                                        <FileText size={16} className="text-indigo-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white truncate">{portfolioFilename}</p>
                                        {portfolioUploadedAt && (
                                            <p className="text-[11px] text-white/30">
                                                Uploaded {new Date(portfolioUploadedAt).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleViewPortfolio}
                                        className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors whitespace-nowrap font-medium"
                                    >
                                        View ↗
                                    </button>
                                </div>
                            )}

                            {/* Drop zone */}
                            <label
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                                className={`
                                    flex flex-col items-center justify-center gap-2 w-full py-8 rounded-xl
                                    border-2 border-dashed cursor-pointer transition-all duration-200
                                    ${dragOver
                                        ? "border-indigo-500/40 bg-indigo-500/5"
                                        : "border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.02]"
                                    }
                                    ${uploading ? "opacity-50 pointer-events-none" : ""}
                                `}
                            >
                                <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center">
                                    <Upload size={18} className="text-white/30" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-white/40">
                                        {uploading ? "Uploading…" : "Drag & drop or click to upload"}
                                    </p>
                                    <p className="text-[11px] text-white/20 mt-1">PDF only, max 10 MB</p>
                                </div>
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </GlassCard>
                </div>

                {/* RIGHT — Progress + Preview */}
                <div className="space-y-5 lg:sticky lg:top-28">
                    {/* Progress */}
                    <GlassCard accent="indigo">
                        <div className="space-y-3">
                            <p className="text-xs font-medium text-white/40">Profile completion</p>
                            {sections.map((s) => (
                                <div key={s.label} className="flex items-center gap-2.5">
                                    {s.done ? (
                                        <CheckCircle2 size={16} className="text-indigo-400 shrink-0" />
                                    ) : (
                                        <Circle size={16} className="text-white/15 shrink-0" />
                                    )}
                                    <span className={`text-sm ${s.done ? "text-white/60" : "text-white/25"}`}>
                                        {s.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </GlassCard>

                    {/* Profile Preview */}
                    <GlassCard accent="indigo" title="Profile preview" subtitle="What referrers see">
                        <div className="space-y-3">
                            <div>
                                <p className="text-[15px] font-semibold text-white">
                                    {intentRole === "Other" ? intentRoleCustom || "Your Role" : intentRole}
                                </p>
                                <p className="text-xs text-white/35 mt-0.5">
                                    {yearsText ? `${yearsText} years experience` : "Experience"}
                                </p>
                            </div>

                            {skills.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {skills.slice(0, 6).map(s => (
                                        <span key={s} className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/15 text-[10px] text-indigo-300 font-medium">
                                            {s}
                                        </span>
                                    ))}
                                    {skills.length > 6 && (
                                        <span className="text-[10px] text-white/25 self-center">
                                            +{skills.length - 6}
                                        </span>
                                    )}
                                </div>
                            )}

                            {domains.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {domains.slice(0, 4).map(d => (
                                        <span key={d} className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] text-white/40 font-medium">
                                            {d}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {portfolioFilename && (
                                <div className="flex items-center gap-1.5 text-[11px] text-indigo-400/60">
                                    <FileText size={11} />
                                    <span>Portfolio attached</span>
                                </div>
                            )}
                        </div>
                    </GlassCard>
                </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3 mt-8">
                <button
                    type="submit"
                    disabled={loading}
                    className={`
                        px-8 py-3 rounded-xl font-semibold text-[15px] text-white
                        transition-all duration-200 outline-none
                        bg-gradient-to-br from-indigo-500 to-indigo-600
                        hover:from-indigo-400 hover:to-indigo-500
                        hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/25
                        active:translate-y-0 active:scale-[0.98]
                        ${loading ? "opacity-60 cursor-not-allowed" : ""}
                    `}
                >
                    {loading ? "Saving…" : "Save Profile →"}
                </button>
            </div>
        </form>
    );
}
