import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PostJobForm from "./PostJobForm";

export default async function PostJobPage() {
    const supabase = await createServerSupabase();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (!profile || profile.role !== "referrer") redirect("/onboarding");

    return (
        <div className="min-h-screen pb-12">
            <div className="max-w-[1100px] mx-auto">
                {/* Hero */}
                <div className="mb-8">
                    <p className="text-white/30 text-xs font-medium tracking-wider uppercase mb-2">
                        Referrer
                    </p>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-1.5">
                        Post a role
                    </h1>
                    <p className="text-white/40 text-sm max-w-md">
                        Get matched with candidates who fit your role and have high acceptance odds.
                    </p>
                </div>

                <PostJobForm />
            </div>
        </div>
    );
}
