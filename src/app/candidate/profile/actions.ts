"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { z } from "zod";

function normalizeList(raw: string): string[] {
    const items = raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    return [...new Set(items)].slice(0, 25);
}

const CandidateSchema = z
    .object({
        yearsWorking: z.coerce.number().int().min(0).max(40),
        skills: z.string().transform(normalizeList),
        domains: z.string().transform(normalizeList),
        intentRole: z.string().min(1, "Role is required"),
        intentRoleCustom: z.string().optional().default(""),
    })
    .refine(
        (d) => d.intentRole !== "Other" || d.intentRoleCustom.trim().length >= 2,
        { message: "Please specify your role", path: ["intentRoleCustom"] }
    );

export async function updateCandidateProfile(formData: FormData) {
    const supabase = await createServerSupabase();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    const parsed = CandidateSchema.safeParse({
        yearsWorking: formData.get("yearsWorking"),
        skills: formData.get("skills") ?? "",
        domains: formData.get("domains") ?? "",
        intentRole: formData.get("intentRole"),
        intentRoleCustom: formData.get("intentRoleCustom") ?? "",
    });

    if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Invalid input";
        return { error: msg };
    }

    const { yearsWorking, skills, domains, intentRole, intentRoleCustom } = parsed.data;

    const { error } = await supabase.from("candidate_profiles").upsert(
        {
            user_id: user.id,
            years_working: yearsWorking,
            skills,
            domains,
            intent_role: intentRole,
            intent_role_custom: intentRole === "Other" ? intentRoleCustom.trim() : null,
        },
        { onConflict: "user_id" }
    );

    if (error) return { error: error.message };

    return { success: true };
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function uploadPortfolio(formData: FormData) {
    const supabase = await createServerSupabase();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    const file = formData.get("file") as File | null;
    if (!file || file.size === 0) return { error: "No file provided" };

    if (file.type !== "application/pdf") {
        return { error: "Only PDF files are accepted" };
    }

    if (file.size > MAX_FILE_SIZE) {
        return { error: "File must be under 10 MB" };
    }

    const ts = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = `${user.id}/${ts}_${safeName}`;

    const { error: uploadErr } = await supabase.storage
        .from("portfolios")
        .upload(storagePath, file, {
            contentType: "application/pdf",
            upsert: false,
        });

    if (uploadErr) return { error: uploadErr.message };

    const { error: dbErr } = await supabase.from("candidate_profiles").upsert(
        {
            user_id: user.id,
            portfolio_path: storagePath,
            portfolio_filename: file.name,
            portfolio_uploaded_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
    );

    if (dbErr) return { error: dbErr.message };

    return {
        success: true,
        filename: file.name,
        uploadedAt: new Date().toISOString(),
    };
}
