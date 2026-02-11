"use client";

import { useState } from "react";
import type { ContextRequest } from "@/types";

interface RequestContextModalProps {
    isOpen: boolean;
    onClose: () => void;
    candidateName: string;
    onSubmit: (areas: ContextRequest["requestedAreas"], note: string) => void;
}

const REQUEST_AREAS = [
    { id: "resume", label: "Resume summary" },
    { id: "projects", label: "Projects" },
    { id: "system-design", label: "System design" },
    { id: "metrics", label: "Metrics/impact" },
    { id: "education", label: "Education" },
] as const;

export default function RequestContextModal({
    isOpen,
    onClose,
    candidateName,
    onSubmit,
}: RequestContextModalProps) {
    const [selectedAreas, setSelectedAreas] = useState<Set<string>>(new Set());
    const [note, setNote] = useState("");

    if (!isOpen) return null;

    const handleToggleArea = (areaId: string) => {
        const newSet = new Set(selectedAreas);
        if (newSet.has(areaId)) {
            newSet.delete(areaId);
        } else {
            newSet.add(areaId);
        }
        setSelectedAreas(newSet);
    };

    const handleSubmit = () => {
        if (selectedAreas.size === 0) return;
        onSubmit(Array.from(selectedAreas) as any, note);
        // Reset state
        setSelectedAreas(new Set());
        setNote("");
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0, 0, 0, 0.8)" }}
            onClick={onClose}
        >
            <div
                className="w-full max-w-md rounded-3xl border border-white/10 p-6 shadow-2xl"
                style={{
                    background: "rgb(var(--surface-elevated))",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Request Portfolio Context
                    </h2>
                    <p className="text-sm text-white/60">
                        Ask for supporting work; {candidateName} can share only what they choose.
                    </p>
                </div>

                {/* Request Areas */}
                <div className="space-y-3 mb-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">
                        What would you like to review?
                    </p>
                    {REQUEST_AREAS.map((area) => (
                        <label
                            key={area.id}
                            className="flex items-center gap-3 cursor-pointer group"
                        >
                            <input
                                type="checkbox"
                                checked={selectedAreas.has(area.id)}
                                onChange={() => handleToggleArea(area.id)}
                                className="w-5 h-5 rounded border-2 bg-transparent cursor-pointer transition-all"
                                style={{
                                    borderColor: selectedAreas.has(area.id)
                                        ? "rgb(var(--accent))"
                                        : "rgba(255, 255, 255, 0.2)",
                                    accentColor: "rgb(var(--accent))",
                                }}
                            />
                            <span className="text-sm text-white group-hover:text-white/80 transition-colors">
                                {area.label}
                            </span>
                        </label>
                    ))}
                </div>

                {/* Optional Note */}
                <div className="mb-6">
                    <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">
                        What are you vouching for? (Optional)
                    </label>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value.slice(0, 140))}
                        maxLength={140}
                        rows={2}
                        placeholder="e.g., Their design thinking and execution..."
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/20 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20 resize-none"
                    />
                    <p className="text-[10px] text-white/40 mt-1 text-right">
                        {note.length}/140
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wide transition-all hover:bg-white/10 text-white/60"
                        style={{ background: "rgba(255, 255, 255, 0.05)" }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={selectedAreas.size === 0}
                        className="flex-1 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wide transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-white"
                        style={{
                            background: selectedAreas.size > 0 ? "rgb(var(--accent))" : "rgba(var(--accent), 0.3)",
                            boxShadow: selectedAreas.size > 0 ? "0 4px 20px rgba(var(--accent), 0.4)" : "none",
                        }}
                    >
                        Send Request
                    </button>
                </div>
            </div>
        </div>
    );
}
