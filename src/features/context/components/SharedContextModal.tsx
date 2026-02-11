"use client";

import type { PortfolioItem, ContextRequest } from "@/types";

interface SharedContextModalProps {
    isOpen: boolean;
    onClose: () => void;
    sharedItems: PortfolioItem[];
    request: ContextRequest;
}

export default function SharedContextModal({
    isOpen,
    onClose,
    sharedItems,
    request,
}: SharedContextModalProps) {
    if (!isOpen) return null;

    const getTypeBadgeColor = (type: PortfolioItem["type"]) => {
        switch (type) {
            case "resume":
                return "text-blue-400 bg-blue-400/10 border-blue-400/30";
            case "case-study":
                return "text-purple-400 bg-purple-400/10 border-purple-400/30";
            case "project":
                return "text-green-400 bg-green-400/10 border-green-400/30";
            case "metrics":
                return "text-orange-400 bg-orange-400/10 border-orange-400/30";
            case "link":
                return "text-cyan-400 bg-cyan-400/10 border-cyan-400/30";
            default:
                return "text-white/40 bg-white/10 border-white/20";
        }
    };

    const getEmptyStateContent = () => {
        if (request.status === "requested") {
            return {
                title: "Awaiting candidate approval",
                description: "The candidate hasn't responded to your request yet.",
            };
        }
        if (request.status === "declined") {
            return {
                title: "Request declined",
                description: "The candidate chose not to share additional context.",
            };
        }
        return {
            title: "No items shared",
            description: "No portfolio items were shared.",
        };
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0, 0, 0, 0.8)" }}
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl max-h-[80vh] rounded-3xl border border-white/10 p-6 shadow-2xl overflow-y-auto"
                style={{
                    background: "rgb(var(--surface-elevated))",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Shared Context
                    </h2>
                    <p className="text-sm text-white/60">
                        Portfolio items shared by the candidate
                    </p>
                </div>

                {/* Empty State or Items */}
                {sharedItems.length === 0 ? (
                    <div className="text-center py-12">
                        <h3 className="text-lg font-semibold text-white mb-2">
                            {getEmptyStateContent().title}
                        </h3>
                        <p className="text-sm text-white/50">
                            {getEmptyStateContent().description}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3 mb-6">
                        {sharedItems.map((item) => (
                            <div
                                key={item.id}
                                className="p-4 rounded-xl border border-white/10 bg-white/5"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span
                                        className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${getTypeBadgeColor(
                                            item.type
                                        )}`}
                                    >
                                        {item.type.replace("-", " ")}
                                    </span>
                                    {item.company && (
                                        <span className="text-xs text-white/60">
                                            @ {item.company}
                                        </span>
                                    )}
                                </div>
                                <h4 className="text-sm font-semibold text-white mb-1">
                                    {item.title}
                                </h4>
                                <p className="text-xs text-white/50">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="w-full px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wide transition-all hover:bg-white/10 text-white"
                    style={{ background: "rgba(255, 255, 255, 255, 0.05)" }}
                >
                    Close
                </button>
            </div>
        </div>
    );
}
