import "server-only";

import { adminClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/supabase/database.types";

export async function logEvent(
    userId: string | null,
    type: string,
    payload: Record<string, unknown> = {}
): Promise<void> {
    const { error } = await adminClient.from("events").insert({
        user_id: userId,
        type,
        payload: payload as unknown as Json,
    });

    if (error) {
        console.error(`[logEvent] Failed to log "${type}":`, error.message);
    }
}
