import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function CandidateMatchesPage() {
    const supabase = await createServerSupabase();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-[600px] mx-auto">
                <h1 className="text-2xl font-bold text-white mb-1">Matches</h1>
                <p className="text-white/40 text-sm mb-8">
                    Your accepted intros and pending requests will appear here.
                </p>

                <div className="px-5 py-10 rounded-2xl bg-white/[0.025] border border-white/[0.06] text-center">
                    <div className="mb-3 text-white/15">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </div>
                    <p className="text-white/30 text-sm font-medium">No matches yet</p>
                    <p className="text-white/20 text-xs mt-1">
                        Start swiping to find referrers
                    </p>
                </div>
            </div>
        </div>
    );
}
