import { NextRequest, NextResponse } from "next/server";
import { seedDemoData } from "@/lib/seed/seedDemoData";

const ADMIN_EMAILS = (process.env.DEV_ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

export async function POST(request: NextRequest) {
    const authHeader = request.headers.get("x-admin-email");

    if (!authHeader || !ADMIN_EMAILS.includes(authHeader.toLowerCase())) {
        return NextResponse.json(
            { error: "Unauthorized. Set x-admin-email header to a DEV_ADMIN_EMAILS value." },
            { status: 401 }
        );
    }

    try {
        const result = await seedDemoData();
        return NextResponse.json(result, { status: 200 });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
