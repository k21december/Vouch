import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";

export async function GET() {
    const supabase = await createServerSupabase();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data: cp } = await supabase
        .from("candidate_profiles")
        .select("portfolio_path")
        .eq("user_id", user.id)
        .single();

    if (!cp?.portfolio_path) {
        return NextResponse.json({ error: "No portfolio uploaded" }, { status: 404 });
    }

    const { data, error } = await adminClient.storage
        .from("portfolios")
        .createSignedUrl(cp.portfolio_path, 3600);

    if (error || !data?.signedUrl) {
        return NextResponse.json({ error: "Failed to generate URL" }, { status: 500 });
    }

    return NextResponse.json({ url: data.signedUrl });
}
