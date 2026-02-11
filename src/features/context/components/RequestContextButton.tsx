"use client";

import ThemedButton from "@/components/common/ThemedButton";

interface RequestContextButtonProps {
    onRequestClick: () => void;
    onViewContext?: () => void;
    requestStatus?: "requested" | "shared" | "declined" | null;
}

export default function RequestContextButton({
    onRequestClick,
    onViewContext,
    requestStatus,
}: RequestContextButtonProps) {
    if (requestStatus === "shared" && onViewContext) {
        return (
            <div className="flex flex-col items-center gap-3 py-3">
                <div
                    className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md border text-[rgb(var(--accent))]"
                    style={{
                        borderColor: "rgba(var(--accent), 0.3)",
                        background: "var(--accent-weak)",
                    }}
                >
                    Context Shared
                </div>
                <ThemedButton
                    onClick={onViewContext}
                    variant="primary"
                    className="px-4 py-2.5 rounded-xl text-sm font-medium uppercase tracking-wide"
                >
                    View Context
                </ThemedButton>
            </div>
        );
    }

    if (requestStatus) {
        const statusConfig = {
            requested: { text: "Context Requested", color: "text-yellow-400/70" },
            declined: { text: "Declined", color: "text-red-400/70" },
        };

        const config = statusConfig[requestStatus as "requested" | "declined"];
        if (!config) return null;

        return (
            <div className="flex items-center justify-center gap-2 py-3">
                <div
                    className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md border ${config.color}`}
                    style={{
                        borderColor: "rgba(255, 255, 255, 0.1)",
                        background: "rgba(255, 255, 255, 0.03)",
                    }}
                >
                    {config.text}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-1 py-3">
            <ThemedButton
                onClick={onRequestClick}
                variant="secondary"
                className="px-4 py-2.5 rounded-xl text-sm font-medium uppercase tracking-wide"
            >
                Request Context
            </ThemedButton>
            <p className="text-[10px] text-white/40">They choose what to share</p>
        </div>
    );
}
