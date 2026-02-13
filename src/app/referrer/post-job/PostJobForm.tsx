"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createJob } from "./actions";
import GlassCard from "@/components/ui/GlassCard";
import TagInput from "@/components/ui/TagInput";
import { Briefcase, Sparkles, Link2, MapPin, DollarSign, FileText, Building2 } from "lucide-react";

const inputClasses =
    "w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm outline-none transition-all duration-200 placeholder:text-white/20 focus:border-white/20 focus:bg-white/[0.06] focus:ring-1 focus:ring-white/10";

function QualityMeter({ score }: { score: number }) {
    const label = score >= 80 ? "Great" : score >= 50 ? "Good" : score >= 25 ? "Basic" : "Minimal";
    const color = score >= 80 ? "text-emerald-400" : score >= 50 ? "text-teal-400" : score >= 25 ? "text-amber-400" : "text-white/30";
    const barColor = score >= 80 ? "bg-emerald-400" : score >= 50 ? "bg-teal-400" : score >= 25 ? "bg-amber-400" : "bg-white/20";

    return (
        <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
                    style={{ width: `${Math.min(100, score)}%` }}
                />
            </div>
            <span className={`text-xs font-medium ${color} whitespace-nowrap`}>
                {label}
            </span>
        </div>
    );
}

export default function PostJobForm() {
    const router = useRouter();
    const [company, setCompany] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [salaryRange, setSalaryRange] = useState("");
    const [requirements, setRequirements] = useState<string[]>([]);
    const [jobUrl, setJobUrl] = useState("");
    const [notes, setNotes] = useState("");

    const [feedback, setFeedback] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!feedback) return;
        const t = setTimeout(() => setFeedback(null), 4000);
        return () => clearTimeout(t);
    }, [feedback]);

    const qualityScore =
        (company.trim() ? 15 : 0) +
        (title.trim() ? 15 : 0) +
        (description.trim().length > 20 ? 20 : description.trim() ? 10 : 0) +
        (location.trim() ? 10 : 0) +
        (salaryRange.trim() ? 10 : 0) +
        (requirements.length >= 3 ? 15 : requirements.length >= 1 ? 8 : 0) +
        (jobUrl.trim() ? 10 : 0) +
        (notes.trim() ? 5 : 0);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFeedback(null);
        setLoading(true);

        const fd = new FormData();
        fd.set("company", company.trim());
        fd.set("title", title.trim());
        fd.set("description", description.trim());
        fd.set("location", location.trim());
        fd.set("salaryRange", salaryRange.trim());
        fd.set("requirements", requirements.join(", "));
        fd.set("jobUrl", jobUrl.trim());
        fd.set("notes", notes.trim());

        const result = await createJob(fd);
        setLoading(false);

        if (result.error) {
            setFeedback("error:" + result.error);
        } else {
            setFeedback("success:Job posted! Redirecting…");
            setTimeout(() => router.push("/referrer/dashboard"), 600);
        }
    }

    const isError = feedback?.startsWith("error:");
    const feedbackMsg = feedback?.replace(/^(error:|success:)/, "");

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Feedback toast */}
            {feedback && (
                <div
                    className={`px-4 py-3 rounded-xl text-sm font-medium border transition-all duration-300 ${isError
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

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
                {/* LEFT — Job Details */}
                <div className="space-y-6">
                    <GlassCard
                        accent="teal"
                        icon={<Briefcase size={18} />}
                        title="Job details"
                        subtitle="Basic information about the role"
                    >
                        <div className="space-y-5">
                            {/* Company */}
                            <div className="space-y-1.5">
                                <label className="text-white/50 text-xs font-medium flex items-center gap-1.5">
                                    <Building2 size={12} className="text-white/30" />
                                    Company <span className="text-red-400/60">*</span>
                                </label>
                                <input
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    required
                                    placeholder="e.g. Google"
                                    className={inputClasses}
                                />
                            </div>

                            {/* Job Title */}
                            <div className="space-y-1.5">
                                <label className="text-white/50 text-xs font-medium flex items-center gap-1.5">
                                    <Briefcase size={12} className="text-white/30" />
                                    Job Title <span className="text-red-400/60">*</span>
                                </label>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    placeholder="e.g. Senior Frontend Engineer"
                                    className={inputClasses}
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5">
                                <label className="text-white/50 text-xs font-medium flex items-center gap-1.5">
                                    <FileText size={12} className="text-white/30" />
                                    Description <span className="text-red-400/60">*</span>
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    rows={4}
                                    placeholder="Describe the role, team, and what you're looking for…"
                                    className={inputClasses + " resize-y min-h-[100px]"}
                                />
                            </div>

                            {/* Location + Salary side by side */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-white/50 text-xs font-medium flex items-center gap-1.5">
                                        <MapPin size={12} className="text-white/30" />
                                        Location
                                    </label>
                                    <input
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="SF / Remote"
                                        className={inputClasses}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-white/50 text-xs font-medium flex items-center gap-1.5">
                                        <DollarSign size={12} className="text-white/30" />
                                        Compensation
                                    </label>
                                    <input
                                        value={salaryRange}
                                        onChange={(e) => setSalaryRange(e.target.value)}
                                        placeholder="$150k – $200k"
                                        className={inputClasses}
                                    />
                                </div>
                            </div>

                            {/* Job URL */}
                            <div className="space-y-1.5">
                                <label className="text-white/50 text-xs font-medium flex items-center gap-1.5">
                                    <Link2 size={12} className="text-white/30" />
                                    Job Posting URL
                                </label>
                                <input
                                    type="url"
                                    value={jobUrl}
                                    onChange={(e) => setJobUrl(e.target.value)}
                                    placeholder="https://careers.company.com/job/123"
                                    className={inputClasses}
                                />
                            </div>
                        </div>
                    </GlassCard>

                    {/* What you're looking for */}
                    <GlassCard
                        accent="teal"
                        icon={<Sparkles size={18} />}
                        title="What you're looking for"
                        subtitle="Help us match the right candidates"
                    >
                        <div className="space-y-5">
                            {/* Required Skills */}
                            <div className="space-y-1.5">
                                <label className="text-white/50 text-xs font-medium block">
                                    Required Skills
                                </label>
                                <TagInput
                                    value={requirements}
                                    onChange={setRequirements}
                                    placeholder="Type a skill and press Enter…"
                                    accent="teal"
                                />
                            </div>

                            {/* Notes */}
                            <div className="space-y-1.5">
                                <label className="text-white/50 text-xs font-medium block">
                                    Internal Notes
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={2}
                                    placeholder="Hiring preferences, team culture, etc."
                                    className={inputClasses + " resize-y min-h-[60px]"}
                                />
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* RIGHT — Preview + Quality */}
                <div className="space-y-5 lg:sticky lg:top-28">
                    {/* Quality Meter */}
                    <GlassCard accent="teal">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-white/40">Match quality</span>
                                <span className="text-xs text-white/25">{qualityScore}%</span>
                            </div>
                            <QualityMeter score={qualityScore} />
                            <p className="text-[11px] text-white/25">
                                Filling more fields improves candidate matching
                            </p>
                        </div>
                    </GlassCard>

                    {/* Live Preview */}
                    <GlassCard accent="teal" title="Preview" subtitle="How candidates will see this">
                        <div className="space-y-3">
                            <div>
                                <p className="text-[15px] font-semibold text-white">
                                    {title || "Job Title"}
                                </p>
                                <p className="text-xs text-white/40 mt-0.5">
                                    {company || "Company"}{location && ` · ${location}`}
                                </p>
                            </div>

                            {salaryRange && (
                                <p className="text-xs text-teal-400/80">{salaryRange}</p>
                            )}

                            {description && (
                                <p className="text-xs text-white/30 line-clamp-3 leading-relaxed">
                                    {description}
                                </p>
                            )}

                            {requirements.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {requirements.slice(0, 6).map(s => (
                                        <span key={s} className="px-2 py-0.5 rounded-md bg-teal-500/10 border border-teal-500/15 text-[10px] text-teal-300 font-medium">
                                            {s}
                                        </span>
                                    ))}
                                    {requirements.length > 6 && (
                                        <span className="text-[10px] text-white/25 self-center">
                                            +{requirements.length - 6} more
                                        </span>
                                    )}
                                </div>
                            )}

                            {!title && !company && !description && (
                                <p className="text-xs text-white/20 italic">
                                    Start filling in the form to see a preview…
                                </p>
                            )}
                        </div>
                    </GlassCard>
                </div>
            </div>

            {/* Submit bar */}
            <div className="flex items-center justify-end gap-3 pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className={`
                        px-8 py-3 rounded-xl font-semibold text-[15px] text-white
                        transition-all duration-200 outline-none
                        bg-gradient-to-br from-teal-500 to-teal-600
                        hover:from-teal-400 hover:to-teal-500
                        hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-500/25
                        active:translate-y-0 active:scale-[0.98]
                        ${loading ? "opacity-60 cursor-not-allowed" : ""}
                    `}
                >
                    {loading ? "Publishing…" : "Publish Job →"}
                </button>
            </div>
        </form>
    );
}
