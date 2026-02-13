import "server-only";

import { adminClient } from "@/lib/supabase/admin";
import { generateMatches } from "@/lib/matching/generateMatches";

const SKILLS = ["React", "Node", "Python", "SQL", "Finance", "ML", "Security", "Product", "Systems", "Data"];
const DOMAINS = ["Fintech", "Healthtech", "AI", "SaaS", "Defense", "Consumer"];
const ROLES = ["SWE", "Data", "Product", "Finance", "Security"];
const SENIORITIES = ["junior", "mid", "senior", "staff", "principal"];
const COMPANIES = [
    "Stripe", "Plaid", "Brex", "Ramp", "Affirm",
    "Oscar Health", "Tempus", "Flatiron", "Cityblock", "Noom",
    "OpenAI", "Anthropic", "Cohere", "Databricks", "Scale AI",
    "Figma", "Notion", "Linear", "Vercel", "Supabase",
    "Palantir", "Anduril", "Shield AI", "SpaceX", "Lockheed",
    "Meta", "Apple", "Netflix", "Spotify", "Snap",
];

const FIRST_NAMES = [
    "Alex", "Jordan", "Taylor", "Morgan", "Casey",
    "Riley", "Avery", "Quinn", "Drew", "Sage",
    "Finley", "Harper", "Rowan", "Cameron", "Logan",
    "Emery", "Reese", "Phoenix", "Dakota", "Skyler",
    "Blake", "Hayden", "Kendall", "Lane", "Parker",
    "Shay", "Ellis", "Tatum", "Rory", "Kai",
    "Ari", "Jaden", "Milan", "Rio", "Zion",
    "Nova", "Wren", "Sterling", "Hollis", "Lennox",
    "Sasha", "Noel", "Eden", "Marlowe", "Briar",
    "Oakley", "Jules", "Indigo", "Ashton", "Peyton",
    "Bay", "Fern", "Haven", "Lark", "Reign",
    "Sol", "Toby", "Vale", "Cleo", "Darian",
    "Echo", "Gray", "Ira", "Jesse", "Kit",
    "Lake", "Mika", "Nyx", "Ori", "Pax",
    "Ren", "Sky", "True", "Uma", "Vox",
    "West", "Xan", "Yael", "Zara", "Ames",
    "Birch", "Cedar", "Dale", "Elm", "Frost",
    "Glen", "Haze", "Ivy", "Jade", "Knox",
    "Lux", "Moss", "Neve", "Oak", "Pine",
    "Rain", "Slate", "Tide", "Umber", "Vine",
    "Wynn", "Yarrow", "Zenith", "Alba", "Beau",
    "Coral", "Dew", "Ember", "Flint", "Gem",
    "Heath", "Isle", "Joy", "Kale", "Lyric",
    "Maple", "North", "Onyx", "Pearl", "Quill",
    "Reed", "Snow", "Thyme", "Umber", "Vere",
    "Wilde", "Xyla", "Yew", "Zephyr", "Aster",
    "Brook", "Cliff", "Dove", "Ever", "Flame",
    "Grove", "Hart", "Iron", "Jet", "Key",
];
const LAST_NAMES = [
    "Chen", "Patel", "Kim", "Nakamura", "Singh",
    "Rodriguez", "Williams", "Johnson", "Li", "Zhang",
    "Park", "Ahmad", "Okafor", "Andersen", "Moreau",
    "Volkov", "Sato", "Meyer", "Costa", "Erikson",
    "Rivera", "Murphy", "Becker", "Santos", "Laurent",
    "Gupta", "Yamada", "Fischer", "Alves", "Bergman",
];

function pick<T>(arr: T[], index: number): T {
    return arr[index % arr.length];
}

function pickSlice<T>(arr: T[], start: number, count: number): T[] {
    const result: T[] = [];
    for (let i = 0; i < count; i++) {
        result.push(arr[(start + i) % arr.length]);
    }
    return [...new Set(result)];
}

function deterministicEmail(prefix: string, index: number): string {
    return `${prefix}_${index}@vouch-demo.test`;
}

export async function seedDemoData(): Promise<{
    referrersCreated: number;
    candidatesCreated: number;
    matchResult: { matchesInserted: number; errors: string[] };
    errors: string[];
}> {
    const errors: string[] = [];

    const { count: existingCount } = await adminClient
        .from("candidate_profiles")
        .select("*", { count: "exact", head: true });

    if (existingCount && existingCount > 0) {
        return {
            referrersCreated: 0,
            candidatesCreated: 0,
            matchResult: { matchesInserted: 0, errors: [] },
            errors: ["Seed data already exists. Skipping (idempotent)."],
        };
    }

    const referrerIds: string[] = [];
    for (let i = 0; i < 30; i++) {
        const email = deterministicEmail("referrer", i);
        const firstName = pick(FIRST_NAMES, i + 80);
        const lastName = pick(LAST_NAMES, i);

        const { data: authUser, error: authErr } = await adminClient.auth.admin.createUser({
            email,
            password: `VouchDemo2026!_${i}`,
            email_confirm: true,
            user_metadata: {
                role: "referrer",
                first_name: firstName,
                last_name: lastName,
            },
        });

        if (authErr || !authUser.user) {
            const { data: existing } = await adminClient.auth.admin.listUsers();
            const found = existing?.users?.find((u) => u.email === email);
            if (found) {
                referrerIds.push(found.id);
                continue;
            }
            errors.push(`Referrer ${i}: ${authErr?.message ?? "unknown error"}`);
            continue;
        }

        const uid = authUser.user.id;
        referrerIds.push(uid);

        await adminClient.from("profiles").upsert({
            id: uid,
            role: "referrer",
            email,
            first_name: firstName,
            last_name: lastName,
            company: pick(COMPANIES, i),
        });

        await adminClient.from("referrer_profiles").upsert({
            user_id: uid,
            company: pick(COMPANIES, i),
            job_title: pick(["Engineering Manager", "Staff Engineer", "Tech Lead", "VP Engineering", "Director"], i),
            seniority: pick(SENIORITIES.slice(2), i),
            refer_roles: pickSlice(ROLES, i, 2 + (i % 3)),
            prefer_skills: pickSlice(SKILLS, i * 2, 3 + (i % 3)),
            prefer_domains: pickSlice(DOMAINS, i, 1 + (i % 3)),
        });
    }

    const candidateIds: string[] = [];
    for (let i = 0; i < 120; i++) {
        const email = deterministicEmail("candidate", i);
        const firstName = pick(FIRST_NAMES, i);
        const lastName = pick(LAST_NAMES, i + 5);

        const { data: authUser, error: authErr } = await adminClient.auth.admin.createUser({
            email,
            password: `VouchDemo2026!_c${i}`,
            email_confirm: true,
            user_metadata: {
                role: "candidate",
                first_name: firstName,
                last_name: lastName,
            },
        });

        if (authErr || !authUser.user) {
            const { data: existing } = await adminClient.auth.admin.listUsers();
            const found = existing?.users?.find((u) => u.email === email);
            if (found) {
                candidateIds.push(found.id);
                continue;
            }
            errors.push(`Candidate ${i}: ${authErr?.message ?? "unknown error"}`);
            continue;
        }

        const uid = authUser.user.id;
        candidateIds.push(uid);

        let skills: string[];
        let domains: string[];
        let intentRole: string;
        let seniority: string;
        let impactScore: number;

        if (i < 10) {
            const ref = await adminClient
                .from("referrer_profiles")
                .select("*")
                .eq("user_id", referrerIds[i])
                .single();

            if (ref.data) {
                skills = ref.data.prefer_skills;
                domains = ref.data.prefer_domains;
                intentRole = ref.data.refer_roles[0] ?? "SWE";
                seniority = ref.data.seniority;
                impactScore = 80 + (i % 20);
            } else {
                skills = pickSlice(SKILLS, i * 3, 3);
                domains = pickSlice(DOMAINS, i * 2, 2);
                intentRole = pick(ROLES, i);
                seniority = pick(SENIORITIES, i);
                impactScore = 50 + (i % 40);
            }
        } else if (i >= 110) {
            const badIndex = i - 110;
            const refIdx = badIndex % referrerIds.length;
            const ref = await adminClient
                .from("referrer_profiles")
                .select("*")
                .eq("user_id", referrerIds[refIdx])
                .single();

            if (ref.data) {
                const unusedSkills = SKILLS.filter((s) => !ref.data.prefer_skills.includes(s));
                const unusedDomains = DOMAINS.filter((d) => !ref.data.prefer_domains.includes(d));
                const unusedRoles = ROLES.filter((r) => !ref.data.refer_roles.includes(r));

                skills = pickSlice(unusedSkills.length > 0 ? unusedSkills : SKILLS, badIndex, 2);
                domains = pickSlice(unusedDomains.length > 0 ? unusedDomains : DOMAINS, badIndex, 1);
                intentRole = unusedRoles.length > 0 ? pick(unusedRoles, badIndex) : "Finance";
                seniority = "junior";
                impactScore = 10 + (badIndex % 20);
            } else {
                skills = pickSlice(SKILLS, i * 3, 2);
                domains = pickSlice(DOMAINS, i * 2, 1);
                intentRole = "Finance";
                seniority = "junior";
                impactScore = 15;
            }
        } else {
            skills = pickSlice(SKILLS, i * 3, 2 + (i % 3));
            domains = pickSlice(DOMAINS, i * 2, 1 + (i % 2));
            intentRole = pick(ROLES, i);
            seniority = pick(SENIORITIES, i);
            impactScore = 30 + ((i * 7) % 60);
        }

        await adminClient.from("profiles").upsert({
            id: uid,
            role: "candidate",
            email,
            first_name: firstName,
            last_name: lastName,
        });

        await adminClient.from("candidate_profiles").upsert({
            user_id: uid,
            seniority,
            skills,
            domains,
            intent_role: intentRole,
            impact_score: impactScore,
        });
    }

    const matchResult = await generateMatches();

    return {
        referrersCreated: referrerIds.length,
        candidatesCreated: candidateIds.length,
        matchResult,
        errors,
    };
}
