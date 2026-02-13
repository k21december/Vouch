"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateReferrerProfile } from "./actions";
import GlassCard from "@/components/ui/GlassCard";
import TagInput from "@/components/ui/TagInput";
import { Building2, Briefcase, User, Sparkles, Globe } from "lucide-react";

interface Props {
    initial: {
        company: string;
        jobTitle: string;
        seniority: string;
        referRoles: string[];
        preferSkills: string[];
        preferDomains: string[];
    };
}

const inputClasses =
    "w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm outline-none transition-all duration-200 placeholder:text-white/20 focus:border-white/20 focus:bg-white/[0.06] focus:ring-1 focus:ring-white/10";

export default function ReferrerProfileForm({ initial }: Props) {
    const router = useRouter();
    const [company, setCompany] = useState(initial.company);
    const [jobTitle, setJobTitle] = useState(initial.jobTitle);
    const [seniority, setSeniority] = useState(initial.seniority);
    const [referRoles, setReferRoles] = useState<string[]>(initial.referRoles);
    const [preferSkills, setPreferSkills] = useState<string[]>(initial.preferSkills);
    const [preferDomains, setPreferDomains] = useState<string[]>(initial.preferDomains);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!feedback) return;
        const t = setTimeout(() => setFeedback(null), 4000);
        return () => clearTimeout(t);
    }, [feedback]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFeedback(null);
        setLoading(true);

        const fd = new FormData();
        fd.set("company", company);
        fd.set("jobTitle", jobTitle);
        fd.set("seniority", seniority);
        fd.set("referRoles", referRoles.join(", "));
        fd.set("preferSkills", preferSkills.join(", "));
        fd.set("preferDomains", preferDomains.join(", "));

        const result = await updateReferrerProfile(fd);
        setLoading(false);
        if (result.error) {
            setFeedback("error:" + result.error);
        } else {
            setFeedback("success:Profile saved!");
            setTimeout(() => router.push("/referrer"), 600);
        }
    }

    const isError = feedback?.startsWith("error:");
    const feedbackMsg = feedback?.replace(/^(error:|success:)/, "");

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
                {/* LEFT — Form */}
                <div className="space-y-6">
                    {/* About you */}
                    <GlassCard
                        accent="teal"
                        icon={<Building2 size={18} />}
                        title="About you"
                        subtitle="Company and role information"
                    >
                        <div className="space-y-5">
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

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-white/50 text-xs font-medium flex items-center gap-1.5">
                                        <Briefcase size={12} className="text-white/30" />
                                        Job Title <span className="text-red-400/60">*</span>
                                    </label>
                                    <input
                                        value={jobTitle}
                                        onChange={(e) => setJobTitle(e.target.value)}
                                        required
                                        placeholder="e.g. Senior SWE"
                                        className={inputClasses}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-white/50 text-xs font-medium flex items-center gap-1.5">
                                        <User size={12} className="text-white/30" />
                                        Seniority
                                    </label>
                                    <select
                                        value={seniority}
                                        onChange={(e) => setSeniority(e.target.value)}
                                        className={inputClasses}
                                    >
                                        {["junior", "mid", "senior", "staff", "principal"].map((s) => (
                                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Referral Preferences */}
                    <GlassCard
                        accent="teal"
                        icon={<Sparkles size={18} />}
                        title="Referral preferences"
                        subtitle="What kind of candidates you're looking for"
                    >
                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-white/50 text-xs font-medium block">
                                    Roles you refer for
                                </label>
                                <TagInput
                                    value={referRoles}
                                    onChange={setReferRoles}
                                    placeholder="Type a role and press Enter…"
                                    accent="teal"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-white/50 text-xs font-medium block">
                                    Preferred Skills
                                </label>
                                <TagInput
                                    value={preferSkills}
                                    onChange={setPreferSkills}
                                    placeholder="Type a skill and press Enter…"
                                    accent="teal"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-white/50 text-xs font-medium flex items-center gap-1.5">
                                    <Globe size={12} className="text-white/30" />
                                    Preferred Domains
                                </label>
                                <TagInput
                                    value={preferDomains}
                                    onChange={setPreferDomains}
                                    placeholder="Type a domain and press Enter…"
                                    accent="teal"
                                />
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* RIGHT — Preview */}
                <div className="lg:sticky lg:top-28">
                    <GlassCard accent="teal" title="Profile preview" subtitle="What candidates see">
                        <div className="space-y-3">
                            <div>
                                <p className="text-[15px] font-semibold text-white">
                                    {jobTitle || "Your Title"}
                                </p>
                                <p className="text-xs text-white/35 mt-0.5">
                                    {company || "Company"} · {seniority.charAt(0).toUpperCase() + seniority.slice(1)}
                                </p>
                            </div>

                            {referRoles.length > 0 && (
                                <div>
                                    <p className="text-[10px] text-white/25 uppercase tracking-wider font-medium mb-1">Refers for</p>
                                    <div className="flex flex-wrap gap-1">
                                        {referRoles.slice(0, 5).map(r => (
                                            <span key={r} className="px-2 py-0.5 rounded-md bg-teal-500/10 border border-teal-500/15 text-[10px] text-teal-300 font-medium">
                                                {r}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {preferSkills.length > 0 && (
                                <div>
                                    <p className="text-[10px] text-white/25 uppercase tracking-wider font-medium mb-1">Skills</p>
                                    <div className="flex flex-wrap gap-1">
                                        {preferSkills.slice(0, 5).map(s => (
                                            <span key={s} className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] text-white/40 font-medium">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {preferDomains.length > 0 && (
                                <div>
                                    <p className="text-[10px] text-white/25 uppercase tracking-wider font-medium mb-1">Domains</p>
                                    <div className="flex flex-wrap gap-1">
                                        {preferDomains.slice(0, 4).map(d => (
                                            <span key={d} className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] text-white/40 font-medium">
                                                {d}
                                            </span>
                                        ))}
                                    </div>
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
                        bg-gradient-to-br from-teal-500 to-teal-600
                        hover:from-teal-400 hover:to-teal-500
                        hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-500/25
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
