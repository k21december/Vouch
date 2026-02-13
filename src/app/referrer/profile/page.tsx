import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ReferrerProfileForm from "./ReferrerProfileForm";

export default async function ReferrerProfilePage() {
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

    if (!profile || profile.role !== "referrer") redirect("/onboarding");

    const { data: rp } = await supabase
        .from("referrer_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

    return (
        <div className="min-h-screen pb-12">
            <div className="max-w-[1100px] mx-auto">
                {/* Hero */}
                <div className="mb-8">
                    <p className="text-white/30 text-xs font-medium tracking-wider uppercase mb-2">
                        Referrer
                    </p>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-1.5">
                        Your Profile
                    </h1>
                    <p className="text-white/40 text-sm max-w-md">
                        Set your preferences so we can match you with the best candidates.
                    </p>
                </div>

                <ReferrerProfileForm
                    initial={{
                        company: rp?.company ?? "",
                        jobTitle: rp?.job_title ?? "",
                        seniority: rp?.seniority ?? "mid",
                        referRoles: rp?.refer_roles ?? [],
                        preferSkills: rp?.prefer_skills ?? [],
                        preferDomains: rp?.prefer_domains ?? [],
                    }}
                />
            </div>
        </div>
    );
}
