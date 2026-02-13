import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function ReferrerDashboardPage() {
    const supabase = await createServerSupabase();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: profile } = await supabase
        .from("profiles")
        .select("role, first_name, last_name")
        .eq("id", user.id)
        .single();

    if (!profile || profile.role !== "referrer") {
        redirect("/");
    }

    let formattedMatches: {
        id: string;
        candidateId: string;
        score: number;
        breakdown: { roleAlignment: number; riskReduction: number; intentFit: number };
        candidateName: string;
        seniority: string;
        skills: string[];
        domains: string[];
        intentRole: string;
    }[] = [];

    try {
        const { data: decidedMatchIds } = await supabase
            .from("decisions")
            .select("match_id")
            .eq("referrer_id", user.id);

        const excludeIds = (decidedMatchIds ?? []).map((d) => d.match_id);

        let query = supabase
            .from("matches")
            .select(`
          id,
          candidate_id,
          score,
          breakdown,
          candidate_profiles!inner (
            user_id,
            seniority,
            skills,
            domains,
            intent_role,
            impact_score
          ),
          profiles!matches_candidate_id_fkey (
            first_name,
            last_name
          )
        `)
            .eq("referrer_id", user.id)
            .order("score", { ascending: false })
            .limit(15);

        if (excludeIds.length > 0) {
            query = query.not("id", "in", `(${excludeIds.join(",")})`);
        }

        const { data: matches, error } = await query;

        if (error) {
            console.error("Failed to fetch matches:", error.message);
        }

        type MatchRow = NonNullable<typeof matches>[number];

        formattedMatches = (matches ?? []).map((m: MatchRow) => {
            const cp = Array.isArray(m.candidate_profiles)
                ? m.candidate_profiles[0]
                : m.candidate_profiles;
            const p = Array.isArray(m.profiles) ? m.profiles[0] : m.profiles;

            return {
                id: m.id,
                candidateId: m.candidate_id,
                score: Number(m.score),
                breakdown: m.breakdown as { roleAlignment: number; riskReduction: number; intentFit: number },
                candidateName: `${p?.first_name ?? "Unknown"} ${p?.last_name ?? ""}`.trim(),
                seniority: cp?.seniority ?? "unknown",
                skills: cp?.skills ?? [],
                domains: cp?.domains ?? [],
                intentRole: cp?.intent_role ?? "",
            };
        });
    } catch (err) {
        console.error("Dashboard data fetch failed (tables may not exist yet):", err);
    }

    return (
        <div style={{ minHeight: "100vh", padding: "24px" }}>
            <DashboardClient
                matches={formattedMatches}
                referrerName={`${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim()}
            />
        </div>
    );
}
