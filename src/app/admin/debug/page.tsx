import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminDebugPage() {
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
                <p style={{ color: "#f87171", fontSize: 18 }}>Access denied.</p>
            </div>
        );
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    const { count: matchCount } = await supabase
        .from("matches")
        .select("*", { count: "exact", head: true })
        .or(`candidate_id.eq.${user.id},referrer_id.eq.${user.id}`);

    const { count: decisionCount } = await supabase
        .from("decisions")
        .select("*", { count: "exact", head: true })
        .or(`candidate_id.eq.${user.id},referrer_id.eq.${user.id}`);

    const { count: eventCount } = await supabase
        .from("events")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

    const sectionStyle: React.CSSProperties = {
        padding: 16,
        borderRadius: 8,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        marginBottom: 16,
    };

    const labelStyle: React.CSSProperties = {
        color: "rgba(255,255,255,0.4)",
        fontSize: 12,
        fontWeight: 500,
    };

    const valueStyle: React.CSSProperties = {
        color: "#fff",
        fontSize: 14,
        fontFamily: "monospace",
    };

    return (
        <div style={{ minHeight: "100vh", padding: 24 }}>
            <div style={{ maxWidth: 600, margin: "0 auto" }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: "0 0 24px" }}>
                    Admin — Debug
                </h1>

                <div style={sectionStyle}>
                    <h2 style={{ fontSize: 16, fontWeight: 600, color: "#fff", margin: "0 0 12px" }}>Current User</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div><span style={labelStyle}>ID: </span><span style={valueStyle}>{user.id}</span></div>
                        <div><span style={labelStyle}>Email: </span><span style={valueStyle}>{user.email}</span></div>
                    </div>
                </div>

                <div style={sectionStyle}>
                    <h2 style={{ fontSize: 16, fontWeight: 600, color: "#fff", margin: "0 0 12px" }}>Profile Row</h2>
                    {profile ? (
                        <pre style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                            {JSON.stringify(profile, null, 2)}
                        </pre>
                    ) : (
                        <p style={{ color: "#f87171", margin: 0 }}>❌ No profile row found. Go to /onboarding.</p>
                    )}
                </div>

                <div style={sectionStyle}>
                    <h2 style={{ fontSize: 16, fontWeight: 600, color: "#fff", margin: "0 0 12px" }}>Visible Counts (RLS-filtered)</h2>
                    <div style={{ display: "flex", gap: 24 }}>
                        <div>
                            <div style={labelStyle}>Matches</div>
                            <div style={{ ...valueStyle, fontSize: 24, fontWeight: 700, color: (matchCount ?? 0) > 0 ? "#22c55e" : "#f87171" }}>
                                {matchCount ?? 0}
                            </div>
                        </div>
                        <div>
                            <div style={labelStyle}>Decisions</div>
                            <div style={{ ...valueStyle, fontSize: 24, fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>
                                {decisionCount ?? 0}
                            </div>
                        </div>
                        <div>
                            <div style={labelStyle}>Events</div>
                            <div style={{ ...valueStyle, fontSize: 24, fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>
                                {eventCount ?? 0}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 20 }}>
                    <a href="/admin/seed" style={{ color: "#818cf8", fontSize: 13, textDecoration: "none" }}>Seed →</a>
                    <a href="/referrer/dashboard" style={{ color: "#818cf8", fontSize: 13, textDecoration: "none" }}>Dashboard →</a>
                    <a href="/api/health" style={{ color: "#818cf8", fontSize: 13, textDecoration: "none" }}>Health →</a>
                    <a href="/logout" style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, textDecoration: "none" }}>Sign out →</a>
                </div>
            </div>
        </div>
    );
}
