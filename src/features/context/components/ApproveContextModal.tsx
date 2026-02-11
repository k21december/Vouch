"use client";

import { useState } from "react";
import type { PortfolioItem, ContextRequest } from "@/types";

interface ApproveContextModalProps {
    isOpen: boolean;
    onClose: () => void;
    request: ContextRequest;
    portfolioItems: PortfolioItem[];
    onApprove: (itemIds: string[]) => void;
    onDecline: () => void;
}

export default function ApproveContextModal({
    isOpen,
    onClose,
    request,
    portfolioItems,
    onApprove,
    onDecline,
}: ApproveContextModalProps) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    if (!isOpen) return null;

    const handleToggleItem = (itemId: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(itemId)) {
            newSet.delete(itemId);
        } else {
            newSet.add(itemId);
        }
        setSelectedIds(newSet);
    };

    const handleSelectTop2 = () => {
        // Select first 2 items
        const top2 = portfolioItems.slice(0, 2).map((item) => item.id);
        setSelectedIds(new Set(top2));
    };

    const handleApprove = () => {
        if (selectedIds.size === 0) return;
        onApprove(Array.from(selectedIds));
        setSelectedIds(new Set());
    };

    const handleDecline = () => {
        onDecline();
        setSelectedIds(new Set());
    };

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
                        Share portfolio context?
                    </h2>
                    <p className="text-sm text-white/60">
                        Nothing personal is shared. You choose what they see.
                    </p>
                    {request.note && (
                        <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10">
                            <p className="text-xs text-white/40 mb-1">They're asking about:</p>
                            <p className="text-sm text-white/80 italic">"{request.note}"</p>
                        </div>
                    )}
                </div>

                {/* Quick Action */}
                <div className="mb-4 flex justify-between items-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-white/40">
                        Select items to share
                    </p>
                    <button
                        onClick={handleSelectTop2}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all hover:brightness-110"
                        style={{
                            color: "rgb(var(--accent))",
                            background: "var(--accent-weak)",
                        }}
                    >
                        Select top 2
                    </button>
                </div>

                {/* Portfolio Items */}
                <div className="space-y-3 mb-6">
                    {portfolioItems.length === 0 ? (
                        <p className="text-sm text-white/40 text-center py-8">
                            No portfolio items yet
                        </p>
                    ) : (
                        portfolioItems.map((item) => (
                            <label
                                key={item.id}
                                className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-all group"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedIds.has(item.id)}
                                    onChange={() => handleToggleItem(item.id)}
                                    className="mt-1 w-5 h-5 rounded border-2 bg-transparent cursor-pointer transition-all"
                                    style={{
                                        borderColor: selectedIds.has(item.id)
                                            ? "rgb(var(--accent))"
                                            : "rgba(255, 255, 255, 0.2)",
                                        accentColor: "rgb(var(--accent))",
                                    }}
                                />
                                <div className="flex-1">
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
                            </label>
                        ))
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={handleDecline}
                        className="flex-1 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wide transition-all hover:bg-white/10 text-white/60"
                        style={{ background: "rgba(255, 255, 255, 0.05)" }}
                    >
                        Decline
                    </button>
                    <button
                        onClick={handleApprove}
                        disabled={selectedIds.size === 0}
                        className="flex-1 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wide transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-white"
                        style={{
                            background:
                                selectedIds.size > 0
                                    ? "rgb(var(--accent))"
                                    : "rgba(var(--accent), 0.3)",
                            boxShadow:
                                selectedIds.size > 0
                                    ? "0 4px 20px rgba(var(--accent), 0.4)"
                                    : "none",
                        }}
                    >
                        Share Selected ({selectedIds.size})
                    </button>
                </div>
            </div>
        </div>
    );
}
