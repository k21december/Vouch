import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CandidateWelcomeClient from "./WelcomeClient";

export default async function CandidatePage() {
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

    if (!profile || profile.role !== "candidate") redirect("/onboarding");

    const { data: cp } = await supabase
        .from("candidate_profiles")
        .select("user_id")
        .eq("user_id", user.id)
        .single();

    if (!cp) redirect("/candidate/profile");

    return <CandidateWelcomeClient name={profile.full_name ?? "there"} />;
}
