"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { logEvent } from "@/lib/events/logEvent";
import { z } from "zod";

const AcceptSchema = z.object({
    matchId: z.string().uuid(),
    candidateId: z.string().uuid(),
});

const DeclineSchema = z.object({
    matchId: z.string().uuid(),
    candidateId: z.string().uuid(),
    reason: z.string().min(1).max(500),
});

export async function acceptMatch(formData: FormData) {
    const supabase = await createServerSupabase();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    const parsed = AcceptSchema.safeParse({
        matchId: formData.get("matchId"),
        candidateId: formData.get("candidateId"),
    });

    if (!parsed.success) return { error: "Invalid input" };

    const { matchId, candidateId } = parsed.data;

    const { error } = await supabase.from("decisions").insert({
        match_id: matchId,
        referrer_id: user.id,
        candidate_id: candidateId,
        decision: "accept",
    });

    if (error) return { error: error.message };

    await logEvent(user.id, "decision_made", {
        matchId,
        candidateId,
        decision: "accept",
    });

    return { success: true };
}

export async function declineMatch(formData: FormData) {
    const supabase = await createServerSupabase();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    const parsed = DeclineSchema.safeParse({
        matchId: formData.get("matchId"),
        candidateId: formData.get("candidateId"),
        reason: formData.get("reason"),
    });

    if (!parsed.success) return { error: "Invalid input" };

    const { matchId, candidateId, reason } = parsed.data;

    const { error } = await supabase.from("decisions").insert({
        match_id: matchId,
        referrer_id: user.id,
        candidate_id: candidateId,
        decision: "decline",
        reason,
    });

    if (error) return { error: error.message };

    await logEvent(user.id, "decision_made", {
        matchId,
        candidateId,
        decision: "decline",
        reason,
    });

    return { success: true };
}
