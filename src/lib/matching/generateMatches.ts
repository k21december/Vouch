import "server-only";

import { adminClient } from "@/lib/supabase/admin";
import { computeScore } from "./score";
import type { Database, Json } from "@/lib/supabase/database.types";

type CandidateProfile = Database["public"]["Tables"]["candidate_profiles"]["Row"];
type ReferrerProfile = Database["public"]["Tables"]["referrer_profiles"]["Row"];

const TOP_N_PER_REFERRER = 25;

export async function generateMatches(): Promise<{
    matchesInserted: number;
    errors: string[];
}> {
    const errors: string[] = [];

    const { data: candidates, error: cErr } = await adminClient
        .from("candidate_profiles")
        .select("*");

    if (cErr || !candidates) {
        return { matchesInserted: 0, errors: [`Failed to fetch candidates: ${cErr?.message}`] };
    }

    const { data: referrers, error: rErr } = await adminClient
        .from("referrer_profiles")
        .select("*");

    if (rErr || !referrers) {
        return { matchesInserted: 0, errors: [`Failed to fetch referrers: ${rErr?.message}`] };
    }

    let matchesInserted = 0;

    for (const referrer of referrers) {
        const scored = candidates.map((candidate) => ({
            candidate,
            ...computeScore(candidate, referrer),
        }));

        scored.sort((a, b) => b.totalScore - a.totalScore);
        const topCandidates = scored.slice(0, TOP_N_PER_REFERRER);

        const rows = topCandidates.map((s) => ({
            candidate_id: s.candidate.user_id,
            referrer_id: referrer.user_id,
            score: s.totalScore,
            breakdown: s.breakdown as unknown as Json,
        }));

        const { error: upsertErr, count } = await adminClient
            .from("matches")
            .upsert(rows, {
                onConflict: "candidate_id,referrer_id",
                ignoreDuplicates: false,
                count: "exact",
            });

        if (upsertErr) {
            errors.push(`Upsert error for referrer ${referrer.user_id}: ${upsertErr.message}`);
        } else {
            matchesInserted += count ?? rows.length;
        }
    }

    if (errors.length === 0) {
        await adminClient.from("events").insert({
            type: "match_generated",
            payload: {
                totalMatches: matchesInserted,
                referrerCount: referrers.length,
                candidateCount: candidates.length,
            } as unknown as Json,
        });
    }

    return { matchesInserted, errors };
}
