import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CandidateProfileForm from "./CandidateProfileForm";

export default async function CandidateProfilePage() {
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

    if (!profile || profile.role !== "candidate") redirect("/onboarding");

    const { data: cp } = await supabase
        .from("candidate_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

    return (
        <div className="min-h-screen pb-12">
            <div className="max-w-[1100px] mx-auto">
                {/* Hero */}
                <div className="mb-8">
                    <p className="text-white/30 text-xs font-medium tracking-wider uppercase mb-2">
                        Candidate
                    </p>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-1.5">
                        Your Profile
                    </h1>
                    <p className="text-white/40 text-sm max-w-md">
                        Complete your profile so referrers can match and vouch for you.
                    </p>
                </div>

                <CandidateProfileForm
                    initial={{
                        yearsWorking: cp?.years_working ?? 0,
                        skills: cp?.skills ?? [],
                        domains: cp?.domains ?? [],
                        intentRole: cp?.intent_role ?? "Frontend Engineer",
                        intentRoleCustom: cp?.intent_role_custom ?? "",
                        portfolioFilename: cp?.portfolio_filename ?? null,
                        portfolioUploadedAt: cp?.portfolio_uploaded_at ?? null,
                    }}
                />
            </div>
        </div>
    );
}
