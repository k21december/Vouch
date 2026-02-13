import type { Database } from "@/lib/supabase/database.types";

type CandidateProfile = Database["public"]["Tables"]["candidate_profiles"]["Row"];
type ReferrerProfile = Database["public"]["Tables"]["referrer_profiles"]["Row"];

export interface ScoreBreakdown {
    roleAlignment: number;
    riskReduction: number;
    intentFit: number;
}

export interface MatchScore {
    totalScore: number;
    breakdown: ScoreBreakdown;
}

const SENIORITY_LEVELS: Record<string, number> = {
    junior: 1,
    mid: 2,
    senior: 3,
    staff: 4,
    principal: 5,
    lead: 4,
    director: 5,
};

function seniorityValue(s: string): number {
    return SENIORITY_LEVELS[s.toLowerCase()] ?? 2;
}

function arrayOverlap(a: string[], b: string[]): number {
    if (a.length === 0 || b.length === 0) return 0;
    const setB = new Set(b.map((x) => x.toLowerCase()));
    const matches = a.filter((x) => setB.has(x.toLowerCase())).length;
    return matches / Math.max(a.length, b.length);
}

function computeRoleAlignment(
    candidate: CandidateProfile,
    referrer: ReferrerProfile
): number {
    const skillOverlap = arrayOverlap(candidate.skills, referrer.prefer_skills);

    const domainOverlap = arrayOverlap(candidate.domains, referrer.prefer_domains);
    const domainBonus = domainOverlap > 0 ? 0.15 : 0;

    const senDiff = Math.abs(
        seniorityValue(candidate.seniority) - seniorityValue(referrer.seniority)
    );
    const seniorityCompat = Math.max(0, 1 - senDiff * 0.25);

    return clamp(skillOverlap * 0.5 + domainBonus + seniorityCompat * 0.35);
}

function computeRiskReduction(
    candidate: CandidateProfile,
    referrer: ReferrerProfile
): number {
    const impactNorm = clamp(Number(candidate.impact_score) / 100);

    const senDiff = Math.abs(
        seniorityValue(candidate.seniority) - seniorityValue(referrer.seniority)
    );
    const senConsistency = Math.max(0, 1 - senDiff * 0.3);

    const domainDepth = arrayOverlap(candidate.domains, referrer.prefer_domains);

    return clamp(impactNorm * 0.4 + senConsistency * 0.3 + domainDepth * 0.3);
}

function computeIntentFit(
    candidate: CandidateProfile,
    referrer: ReferrerProfile
): number {
    const roleMatch = referrer.refer_roles
        .map((r) => r.toLowerCase())
        .includes(candidate.intent_role.toLowerCase())
        ? 1
        : 0;

    const senDiff = Math.abs(
        seniorityValue(candidate.seniority) - seniorityValue(referrer.seniority)
    );
    const mismatchPenalty = senDiff > 2 ? 0.3 : 0;

    return clamp(roleMatch - mismatchPenalty);
}

function clamp(value: number, min = 0, max = 1): number {
    return Math.min(max, Math.max(min, value));
}

export function computeScore(
    candidate: CandidateProfile,
    referrer: ReferrerProfile
): MatchScore {
    const roleAlignment = computeRoleAlignment(candidate, referrer);
    const riskReduction = computeRiskReduction(candidate, referrer);
    const intentFit = computeIntentFit(candidate, referrer);

    const totalScore = parseFloat(
        (0.5 * roleAlignment + 0.3 * riskReduction + 0.2 * intentFit).toFixed(4)
    );

    return {
        totalScore,
        breakdown: {
            roleAlignment: parseFloat(roleAlignment.toFixed(4)),
            riskReduction: parseFloat(riskReduction.toFixed(4)),
            intentFit: parseFloat(intentFit.toFixed(4)),
        },
    };
}
