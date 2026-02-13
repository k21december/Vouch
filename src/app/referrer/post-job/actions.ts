"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { z } from "zod";

function normalizeList(raw: string): string[] {
    return raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 30);
}

const JobSchema = z.object({
    company: z.string().min(1, "Company is required"),
    title: z.string().min(1, "Job title is required"),
    description: z.string().min(1, "Description is required"),
    location: z.string().optional().default(""),
    salaryRange: z.string().optional().default(""),
    requirements: z.string().transform(normalizeList),
    jobUrl: z
        .string()
        .transform((v) => v.trim())
        .refine(
            (v) => v === "" || /^https?:\/\/.+/.test(v),
            "Must be a valid URL starting with http:// or https://"
        ),
    notes: z.string().optional().default(""),
});

export async function createJob(formData: FormData) {
    const supabase = await createServerSupabase();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    const parsed = JobSchema.safeParse({
        company: formData.get("company"),
        title: formData.get("title"),
        description: formData.get("description"),
        location: formData.get("location") ?? "",
        salaryRange: formData.get("salaryRange") ?? "",
        requirements: formData.get("requirements") ?? "",
        jobUrl: formData.get("jobUrl") ?? "",
        notes: formData.get("notes") ?? "",
    });

    if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Invalid input";
        return { error: msg };
    }

    const { company, title, description, location, salaryRange, requirements, notes } = parsed.data;

    const { error } = await supabase.from("jobs").insert({
        referrer_id: user.id,
        company,
        title,
        description: description + (notes ? `\n\nNotes: ${notes}` : ""),
        location: location || null,
        salary_range: salaryRange || null,
        requirements: requirements.length > 0 ? requirements : null,
    });

    if (error) return { error: error.message };

    return { success: true };
}
