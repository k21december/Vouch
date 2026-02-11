"use client";

import type { ContextRequest } from "@/types";

interface ContextRequestsListProps {
    requests: ContextRequest[];
    onRequestClick: (request: ContextRequest) => void;
}

export default function ContextRequestsList({
    requests,
    onRequestClick,
}: ContextRequestsListProps) {
    if (requests.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-sm text-white/40">No context requests yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {requests.map((request) => (
                <button
                    key={request.id}
                    onClick={() => onRequestClick(request)}
                    className="w-full text-left p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                >
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <h3 className="text-base font-semibold text-white mb-1">
                                Context Request
                            </h3>
                            <p className="text-xs text-white/50">
                                {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div
                            className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${request.status === "requested"
                                    ? "bg-yellow-400/10 text-yellow-400 border border-yellow-400/30"
                                    : request.status === "shared"
                                        ? "bg-green-400/10 text-green-400 border border-green-400/30"
                                        : "bg-red-400/10 text-red-400 border border-red-400/30"
                                }`}
                        >
                            {request.status}
                        </div>
                    </div>

                    {request.requestedAreas.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {request.requestedAreas.map((area) => (
                                <span
                                    key={area}
                                    className="text-[10px] px-2 py-1 rounded bg-white/10 text-white/60"
                                >
                                    {area}
                                </span>
                            ))}
                        </div>
                    )}

                    {request.note && (
                        <p className="mt-3 text-sm text-white/70 italic">
                            "{request.note}"
                        </p>
                    )}
                </button>
            ))}
        </div>
    );
}
