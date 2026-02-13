import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith("http");
    const urlPrefix = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").slice(0, 30);
    const hasAnon = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").length > 20;
    const hasServiceRole = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").length > 20;

    let dbConnected = false;
    let dbError: string | null = null;

    if (hasUrl && hasAnon) {
        try {
            const supabase = await createServerSupabase();
            const { error } = await supabase.from("profiles").select("id", { count: "exact", head: true });
            if (error) {
                dbError = error.message;
            } else {
                dbConnected = true;
            }
        } catch (e) {
            dbError = e instanceof Error ? e.message : "Unknown error";
        }
    }

    return NextResponse.json({
        ok: hasUrl && hasAnon && hasServiceRole && dbConnected,
        hasUrl,
        urlPrefix,
        hasAnon,
        hasServiceRole,
        dbConnected,
        dbError,
    });
}
