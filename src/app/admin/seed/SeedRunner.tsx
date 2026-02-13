"use client";

import { useState } from "react";
import { runSeed } from "./actions";

export default function SeedRunner() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{
        success?: boolean;
        error?: string;
        referrersCreated?: number;
        candidatesCreated?: number;
        matchesInserted?: number;
        errors?: string[];
    } | null>(null);

    async function handleSeed() {
        setLoading(true);
        setResult(null);
        const res = await runSeed();
        setResult(res);
        setLoading(false);
    }

    return (
        <div>
            <button
                onClick={handleSeed}
                disabled={loading}
                style={{
                    padding: "12px 24px",
                    borderRadius: 8,
                    border: "none",
                    background: loading ? "rgba(255,255,255,0.08)" : "linear-gradient(135deg, #f59e0b, #d97706)",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: loading ? "not-allowed" : "pointer",
                }}
            >
                {loading ? "Seeding… (this takes ~60s)" : "🌱 Run Seed"}
            </button>

            {result && (
                <div style={{
                    marginTop: 20,
                    padding: 16,
                    borderRadius: 8,
                    background: result.error ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)",
                    border: `1px solid ${result.error ? "rgba(239,68,68,0.25)" : "rgba(34,197,94,0.25)"}`,
                }}>
                    {result.error ? (
                        <p style={{ color: "#f87171", margin: 0 }}>❌ {result.error}</p>
                    ) : (
                        <>
                            <p style={{ color: "#22c55e", fontWeight: 600, margin: "0 0 8px" }}>✅ Seed complete!</p>
                            <ul style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, margin: 0, paddingLeft: 20 }}>
                                <li>Referrers created: {result.referrersCreated}</li>
                                <li>Candidates created: {result.candidatesCreated}</li>
                                <li>Matches inserted: {result.matchesInserted}</li>
                            </ul>
                            {(result.errors?.length ?? 0) > 0 && (
                                <div style={{ marginTop: 12, fontSize: 12, color: "#f59e0b" }}>
                                    <p style={{ margin: "0 0 4px", fontWeight: 600 }}>Warnings:</p>
                                    {result.errors?.map((err, i) => <p key={i} style={{ margin: 0 }}>{err}</p>)}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
