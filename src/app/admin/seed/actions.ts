"use server";

import { seedDemoData } from "@/lib/seed/seedDemoData";
import { logEvent } from "@/lib/events/logEvent";
import { createServerSupabase } from "@/lib/supabase/server";

export async function runSeed() {
    const supabase = await createServerSupabase();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    const allowedEmails = (process.env.DEV_ADMIN_EMAILS ?? "")
        .split(",")
        .map((e) => e.trim().toLowerCase());

    if (!allowedEmails.includes(user.email?.toLowerCase() ?? "")) {
        return { error: "Not authorized" };
    }

    try {
        const result = await seedDemoData();

        await logEvent(user.id, "seed_ran", {
            referrersCreated: result.referrersCreated,
            candidatesCreated: result.candidatesCreated,
            matchesInserted: result.matchResult.matchesInserted,
        });

        return {
            success: true,
            referrersCreated: result.referrersCreated,
            candidatesCreated: result.candidatesCreated,
            matchesInserted: result.matchResult.matchesInserted,
            errors: [...result.errors, ...result.matchResult.errors],
        };
    } catch (e) {
        return { error: e instanceof Error ? e.message : "Unknown error" };
    }
}
