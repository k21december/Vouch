"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { z } from "zod";
import { redirect } from "next/navigation";

const OnboardingSchema = z.object({
    role: z.enum(["candidate", "referrer"]),
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    portfolio: z
        .string()
        .transform((v) => v.trim())
        .refine(
            (v) => v === "" || v.startsWith("http://") || v.startsWith("https://"),
            "Portfolio URL must start with http:// or https://"
        ),
    phone: z
        .string()
        .transform((v) => v.replace(/\D/g, ""))
        .refine(
            (v) => v === "" || v.length >= 7,
            "Phone must be at least 7 digits"
        ),
});

export async function completeOnboarding(formData: FormData) {
    const supabase = await createServerSupabase();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    const parsed = OnboardingSchema.safeParse({
        role: formData.get("role"),
        fullName: formData.get("fullName"),
        portfolio: formData.get("portfolio") ?? "",
        phone: formData.get("phone") ?? "",
    });

    if (!parsed.success) {
        const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
        return { error: firstError };
    }

    const { role, fullName, portfolio, phone } = parsed.data;

    const { error } = await supabase.from("profiles").upsert(
        {
            id: user.id,
            email: user.email,
            full_name: fullName,
            portfolio: portfolio || null,
            phone: phone || null,
            role,
            previous_state: "onboarding_completed",
        },
        { onConflict: "id" }
    );

    if (error) return { error: error.message };

    if (role === "candidate") {
        await supabase.from("candidate_profiles").upsert({ user_id: user.id });
        redirect("/candidate/profile");
    } else {
        await supabase.from("referrer_profiles").upsert({ user_id: user.id });
        redirect("/referrer/profile");
    }
}
