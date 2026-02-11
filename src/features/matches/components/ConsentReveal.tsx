"use client";

import { useState } from "react";
import Surface from "@/components/common/Surface";
import RevealStatus from "./RevealStatus";

export default function ConsentReveal() {
    const [hasConsented, setHasConsented] = useState(false);

    return (
        <div className="mb-6">
            <Surface className="!p-5">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-sm font-semibold text-white">Identity Reveal</h3>
                        <RevealStatus status={hasConsented ? "accepted" : "pending"} />
                    </div>

                    <button
                        onClick={() => setHasConsented(!hasConsented)}
                        className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all ${hasConsented
                                ? "bg-[var(--sucess)]/20 text-[var(--success)]"
                                : "bg-white text-black hover:opacity-90 active:scale-95"
                            }`}
                    >
                        {hasConsented ? "Revealed" : "Reveal info"}
                    </button>
                </div>

                {hasConsented && (
                    <div className="mt-4 border-t border-white/5 pt-4">
                        <div className="flex flex-col gap-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-[var(--muted)]">Email</span>
                                <span className="font-medium text-white">jay@example.com</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[var(--muted)]">Phone</span>
                                <span className="font-medium text-white">+1 (555) 012-3400</span>
                            </div>
                        </div>
                    </div>
                )}
            </Surface>
        </div>
    );
}
