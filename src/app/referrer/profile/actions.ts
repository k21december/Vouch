"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { z } from "zod";

const ReferrerSchema = z.object({
    company: z.string().min(1),
    jobTitle: z.string().min(1),
    seniority: z.enum(["junior", "mid", "senior", "staff", "principal"]),
    referRoles: z.string().transform((s) => s.split(",").map((x) => x.trim()).filter(Boolean)),
    preferSkills: z.string().transform((s) => s.split(",").map((x) => x.trim()).filter(Boolean)),
    preferDomains: z.string().transform((s) => s.split(",").map((x) => x.trim()).filter(Boolean)),
});

export async function updateReferrerProfile(formData: FormData) {
    const supabase = await createServerSupabase();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    const parsed = ReferrerSchema.safeParse({
        company: formData.get("company"),
        jobTitle: formData.get("jobTitle"),
        seniority: formData.get("seniority"),
        referRoles: formData.get("referRoles"),
        preferSkills: formData.get("preferSkills"),
        preferDomains: formData.get("preferDomains"),
    });

    if (!parsed.success) return { error: "Invalid input: " + parsed.error.message };

    const { company, jobTitle, seniority, referRoles, preferSkills, preferDomains } = parsed.data;

    const { error } = await supabase.from("referrer_profiles").upsert({
        user_id: user.id,
        company,
        job_title: jobTitle,
        seniority,
        refer_roles: referRoles,
        prefer_skills: preferSkills,
        prefer_domains: preferDomains,
    });

    if (error) return { error: error.message };

    return { success: true };
}
