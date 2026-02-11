import { FileText, Github, Globe, Linkedin, Link as LinkIcon, Download } from "lucide-react";
import Surface from "@/components/common/Surface";

export default function PortfolioCard() {
    return (
        <Surface className="h-full flex flex-col gap-6 !p-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/5">
                    <FileText className="h-5 w-5 text-white/60" />
                </div>
                <div>
                    <h3 className="font-semibold text-white">Portfolio & Evidence</h3>
                    <p className="text-xs text-[var(--muted)]">Review external materials</p>
                </div>
            </div>

            {/* Links */}
            <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Links</h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <a href="#" className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 p-3 hover:bg-white/10 transition-colors group">
                        <Github className="h-5 w-5 text-white/60 group-hover:text-white" />
                        <span className="text-sm font-medium text-white/80 group-hover:text-white">GitHub</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 p-3 hover:bg-white/10 transition-colors group">
                        <Linkedin className="h-5 w-5 text-white/60 group-hover:text-white" />
                        <span className="text-sm font-medium text-white/80 group-hover:text-white">LinkedIn</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 p-3 hover:bg-white/10 transition-colors group">
                        <Globe className="h-5 w-5 text-white/60 group-hover:text-white" />
                        <span className="text-sm font-medium text-white/80 group-hover:text-white">Personal Site</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 p-3 hover:bg-white/10 transition-colors group">
                        <LinkIcon className="h-5 w-5 text-white/60 group-hover:text-white" />
                        <span className="text-sm font-medium text-white/80 group-hover:text-white">Medium</span>
                    </a>
                </div>
            </div>

            {/* Resume */}
            <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Resume</h4>
                <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded bg-red-500/10 text-red-400">
                            <span className="text-xs font-bold">PDF</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-white">Full_Resume_2024.pdf</span>
                            <span className="text-xs text-[var(--muted)]">Updated 2 weeks ago</span>
                        </div>
                    </div>
                    <button className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                        <Download className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Featured Projects */}
            <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Featured Projects</h4>
                <div className="space-y-3">
                    <div className="rounded-lg border border-white/5 bg-black/20 p-4 hover:border-white/10 transition-colors">
                        <div className="mb-2 flex items-center justify-between">
                            <h5 className="font-medium text-white">E-Commerce Redesign</h5>
                            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/60">Case Study</span>
                        </div>
                        <p className="text-xs leading-relaxed text-[var(--muted)]">
                            Led the redesign of the checkout flow, resulting in a 15% increase in conversion.
                        </p>
                    </div>
                    <div className="rounded-lg border border-white/5 bg-black/20 p-4 hover:border-white/10 transition-colors">
                        <div className="mb-2 flex items-center justify-between">
                            <h5 className="font-medium text-white">Design System</h5>
                            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/60">System</span>
                        </div>
                        <p className="text-xs leading-relaxed text-[var(--muted)]">
                            Built and maintained a multi-brand design system used by 40+ engineers.
                        </p>
                    </div>
                </div>
            </div>
        </Surface>
    );
}
