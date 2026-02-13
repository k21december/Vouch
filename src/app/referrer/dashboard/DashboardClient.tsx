"use client";

import { useState, useTransition } from "react";
import { acceptMatch, declineMatch } from "./actions";

interface MatchData {
    id: string;
    candidateId: string;
    score: number;
    breakdown: {
        roleAlignment: number;
        riskReduction: number;
        intentFit: number;
    };
    candidateName: string;
    seniority: string;
    skills: string[];
    domains: string[];
    intentRole: string;
}

const DECLINE_REASONS = [
    "Not the right fit for current openings",
    "Seniority level mismatch",
    "Skill set doesn't align",
    "Domain experience insufficient",
    "Other",
];

export default function DashboardClient({
    matches: initialMatches,
    referrerName,
}: {
    matches: MatchData[];
    referrerName: string;
}) {
    const [matches, setMatches] = useState(initialMatches);
    const [isPending, startTransition] = useTransition();
    const [declineTarget, setDeclineTarget] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

    function handleAccept(matchId: string, candidateId: string) {
        startTransition(async () => {
            const formData = new FormData();
            formData.set("matchId", matchId);
            formData.set("candidateId", candidateId);
            const result = await acceptMatch(formData);
            if (result.error) {
                setFeedback({ type: "error", message: result.error });
            } else {
                setMatches((prev) => prev.filter((m) => m.id !== matchId));
                setFeedback({ type: "success", message: "Candidate accepted!" });
            }
        });
    }

    function handleDecline(matchId: string, candidateId: string, reason: string) {
        setDeclineTarget(null);
        startTransition(async () => {
            const formData = new FormData();
            formData.set("matchId", matchId);
            formData.set("candidateId", candidateId);
            formData.set("reason", reason);
            const result = await declineMatch(formData);
            if (result.error) {
                setFeedback({ type: "error", message: result.error });
            } else {
                setMatches((prev) => prev.filter((m) => m.id !== matchId));
                setFeedback({ type: "success", message: "Candidate declined." });
            }
        });
    }

    return (
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <header style={{ marginBottom: 32 }}>
                <h1
                    style={{
                        fontSize: 28,
                        fontWeight: 700,
                        color: "#fff",
                        margin: 0,
                    }}
                >
                    Referrer Dashboard
                </h1>
                <p style={{ color: "rgba(255,255,255,0.6)", marginTop: 4 }}>
                    Welcome, {referrerName}. You have {matches.length} candidates to review.
                </p>
            </header>

            {feedback && (
                <div
                    style={{
                        padding: "12px 16px",
                        borderRadius: 8,
                        marginBottom: 16,
                        background: feedback.type === "success" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                        color: feedback.type === "success" ? "#22c55e" : "#ef4444",
                        border: `1px solid ${feedback.type === "success" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                    }}
                >
                    {feedback.message}
                    <button
                        onClick={() => setFeedback(null)}
                        style={{
                            float: "right",
                            background: "none",
                            border: "none",
                            color: "inherit",
                            cursor: "pointer",
                            fontSize: 16,
                        }}
                    >
                        ✕
                    </button>
                </div>
            )}

            {matches.length === 0 && (
                <div
                    style={{
                        textAlign: "center",
                        padding: 48,
                        color: "rgba(255,255,255,0.5)",
                    }}
                >
                    <p style={{ fontSize: 18 }}>No candidates to review right now.</p>
                    <p>Check back later for new matches.</p>
                </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {matches.map((match) => (
                    <div
                        key={match.id}
                        style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: 12,
                            padding: 24,
                            transition: "border-color 0.2s",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div>
                                <h2 style={{ fontSize: 20, fontWeight: 600, color: "#fff", margin: 0 }}>
                                    {match.candidateName}
                                </h2>
                                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: "4px 0 0" }}>
                                    {match.seniority.charAt(0).toUpperCase() + match.seniority.slice(1)} · {match.intentRole}
                                </p>
                            </div>
                            <div
                                style={{
                                    background: scoreColor(match.score),
                                    borderRadius: 8,
                                    padding: "8px 14px",
                                    fontWeight: 700,
                                    fontSize: 18,
                                    color: "#fff",
                                    minWidth: 60,
                                    textAlign: "center",
                                }}
                            >
                                {(match.score * 100).toFixed(0)}
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "12px 0" }}>
                            {match.skills.map((skill) => (
                                <span
                                    key={skill}
                                    style={{
                                        background: "rgba(99,102,241,0.15)",
                                        color: "#818cf8",
                                        padding: "4px 10px",
                                        borderRadius: 6,
                                        fontSize: 12,
                                        fontWeight: 500,
                                    }}
                                >
                                    {skill}
                                </span>
                            ))}
                            {match.domains.map((domain) => (
                                <span
                                    key={domain}
                                    style={{
                                        background: "rgba(20,184,166,0.15)",
                                        color: "#2dd4bf",
                                        padding: "4px 10px",
                                        borderRadius: 6,
                                        fontSize: 12,
                                        fontWeight: 500,
                                    }}
                                >
                                    {domain}
                                </span>
                            ))}
                        </div>

                        <div
                            style={{
                                display: "flex",
                                gap: 8,
                                fontSize: 12,
                                color: "rgba(255,255,255,0.4)",
                                marginBottom: 16,
                            }}
                        >
                            <span>Role: {(match.breakdown.roleAlignment * 100).toFixed(0)}%</span>
                            <span>·</span>
                            <span>Risk: {(match.breakdown.riskReduction * 100).toFixed(0)}%</span>
                            <span>·</span>
                            <span>Intent: {(match.breakdown.intentFit * 100).toFixed(0)}%</span>
                        </div>

                        <div style={{ display: "flex", gap: 8 }}>
                            <button
                                onClick={() => handleAccept(match.id, match.candidateId)}
                                disabled={isPending}
                                style={{
                                    flex: 1,
                                    padding: "10px 16px",
                                    borderRadius: 8,
                                    border: "none",
                                    background: "linear-gradient(135deg, #22c55e, #16a34a)",
                                    color: "#fff",
                                    fontWeight: 600,
                                    fontSize: 14,
                                    cursor: isPending ? "not-allowed" : "pointer",
                                    opacity: isPending ? 0.6 : 1,
                                    transition: "opacity 0.2s",
                                }}
                            >
                                ✓ Accept
                            </button>

                            {declineTarget === match.id ? (
                                <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: 6 }}>
                                    {DECLINE_REASONS.map((reason) => (
                                        <button
                                            key={reason}
                                            onClick={() => handleDecline(match.id, match.candidateId, reason)}
                                            disabled={isPending}
                                            style={{
                                                padding: "8px 12px",
                                                borderRadius: 6,
                                                border: "1px solid rgba(239,68,68,0.3)",
                                                background: "rgba(239,68,68,0.08)",
                                                color: "#f87171",
                                                fontSize: 12,
                                                cursor: isPending ? "not-allowed" : "pointer",
                                                textAlign: "left",
                                            }}
                                        >
                                            {reason}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setDeclineTarget(null)}
                                        style={{
                                            padding: "6px 12px",
                                            borderRadius: 6,
                                            border: "none",
                                            background: "transparent",
                                            color: "rgba(255,255,255,0.4)",
                                            fontSize: 12,
                                            cursor: "pointer",
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setDeclineTarget(match.id)}
                                    disabled={isPending}
                                    style={{
                                        flex: 1,
                                        padding: "10px 16px",
                                        borderRadius: 8,
                                        border: "1px solid rgba(239,68,68,0.3)",
                                        background: "rgba(239,68,68,0.08)",
                                        color: "#f87171",
                                        fontWeight: 600,
                                        fontSize: 14,
                                        cursor: isPending ? "not-allowed" : "pointer",
                                        opacity: isPending ? 0.6 : 1,
                                        transition: "opacity 0.2s",
                                    }}
                                >
                                    ✗ Decline
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function scoreColor(score: number): string {
    if (score >= 0.7) return "linear-gradient(135deg, #22c55e, #15803d)";
    if (score >= 0.4) return "linear-gradient(135deg, #eab308, #a16207)";
    return "linear-gradient(135deg, #ef4444, #b91c1c)";
}
