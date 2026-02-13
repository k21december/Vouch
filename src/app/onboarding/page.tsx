import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import OnboardingForm from "./OnboardingForm";

export default async function OnboardingPage() {
    const supabase = await createServerSupabase();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: profile } = await supabase
        .from("profiles")
        .select("id, role, full_name, portfolio, phone")
        .eq("id", user.id)
        .single();

    if (profile?.role === "candidate") {
        redirect("/candidate/profile");
    }
    if (profile?.role === "referrer") {
        redirect("/referrer/dashboard");
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <OnboardingForm
                userEmail={user.email ?? ""}
                initial={{
                    fullName: profile?.full_name ?? "",
                    portfolio: profile?.portfolio ?? "",
                    phone: profile?.phone ?? "",
                    role: (profile?.role ?? null) as "candidate" | "referrer" | null,
                }}
            />
        </div>
    );
}
