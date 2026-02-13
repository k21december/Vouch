import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ReferrerWelcomeClient from "./WelcomeClient";

export default async function ReferrerPage() {
    const supabase = await createServerSupabase();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: profile } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", user.id)
        .single();

    if (!profile || profile.role !== "referrer") redirect("/onboarding");

    return <ReferrerWelcomeClient name={profile.full_name ?? "there"} />;
}
