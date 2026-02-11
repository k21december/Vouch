import Surface from "@/components/common/Surface";

interface Job {
    id: string;
    title: string;
    company: string;
    salary: string;
    location: string;
    description: string;
    referrer: {
        name: string;
        role: string;
    };
}

interface JobCardProps {
    job: Job;
    onSwipe: (direction: "left" | "right" | "up") => void;
    isLeaving: "left" | "right" | "up" | null;
}

export default function JobCard({ job, onSwipe, isLeaving }: JobCardProps) {
    // Same action button components as SwipeableCard
    // For brevity re-declaring them or we could extract them to shared
    // ... (Assuming we just inline or duplicate for now to keep it self contained as per Anti-Gravity "variants")

    // ... (Actually, let's just reuse the layout structure)

    const getAnimationClass = () => {
        if (isLeaving === "right") return "animate-swipe-right";
        if (isLeaving === "left") return "animate-swipe-left";
        if (isLeaving === "up") return "animate-swipe-up";
        return "";
    };

    return (
        <div
            className={`h-full w-full cursor-grab select-none active:cursor-grabbing ${getAnimationClass()}`}
        >
            <Surface>
                <div className="relative flex h-full flex-col overflow-y-auto">
                    {/* Header */}
                    <div className="flex flex-col gap-1 mb-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-bold tracking-tight text-white leading-none">
                                {job.company}
                            </h2>
                            <div
                                className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md"
                                style={{
                                    color: "rgb(var(--accent))",
                                    background: "var(--accent-weak)",
                                    border: "1px solid rgba(var(--accent), 0.2)"
                                }}
                            >
                                Job
                            </div>
                        </div>

                        <h3 className="text-xl font-medium mt-1" style={{ color: "rgb(var(--accent))" }}>
                            {job.title}
                        </h3>
                    </div>

                    {/* Details */}
                    <div className="space-y-6">
                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1 text-[var(--fg)]">
                                Compensation
                            </div>
                            <div className="text-xl font-medium text-white">
                                {job.salary}
                            </div>
                        </div>

                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1 text-[var(--fg)]">
                                Location
                            </div>
                            <div className="text-lg font-medium text-white">
                                {job.location}
                            </div>
                        </div>

                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2 text-[var(--fg)]">
                                Referrer
                            </div>
                            <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
                                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold">
                                    {job.referrer.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white">{job.referrer.name}</div>
                                    <div className="text-xs text-[var(--muted)]">{job.referrer.role}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1 mt-8 text-sm leading-relaxed text-[var(--muted)] line-clamp-4">
                        {job.description}
                    </div>

                    <div className="flex-1" />

                    {/* Actions (Mocked for visual) */}
                    <div className="grid grid-cols-2 gap-3 pt-4">
                        <button
                            onClick={() => onSwipe("left")}
                            className="btn-base btn-neutral w-full rounded-2xl py-4 text-sm font-bold uppercase tracking-wide"
                        >
                            Pass
                        </button>
                        <button
                            onClick={() => onSwipe("right")}
                            className="btn-base btn-primary w-full rounded-2xl py-4 text-sm font-bold uppercase tracking-wide"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </Surface>
        </div>
    );
}
