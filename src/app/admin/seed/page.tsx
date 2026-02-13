import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SeedRunner from "./SeedRunner";

export default async function AdminSeedPage() {
    const supabase = await createServerSupabase();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const allowedEmails = (process.env.DEV_ADMIN_EMAILS ?? "")
        .split(",")
        .map((e) => e.trim().toLowerCase());

    if (!allowedEmails.includes(user.email?.toLowerCase() ?? "")) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: "#f87171", fontSize: 18 }}>Access denied. Your email is not in DEV_ADMIN_EMAILS.</p>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", padding: 24 }}>
            <div style={{ maxWidth: 600, margin: "0 auto" }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>
                    Admin — Seed Database
                </h1>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: "0 0 24px" }}>
                    Creates 30 referrers + 120 candidates, generates matches. Idempotent.
                </p>
                <SeedRunner />
            </div>
        </div>
    );
}
