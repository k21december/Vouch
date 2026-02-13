import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = [
    "/onboarding",
    "/candidate",
    "/referrer",
    "/admin",
    "/discover",
    "/matches",
    "/settings",
    "/portfolio",
];

const AUTH_PAGES = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;

    const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
    const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));

    if (!user && isProtected) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    if (user && isAuthPage) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        const url = request.nextUrl.clone();

        if (!profile?.role) {
            url.pathname = "/onboarding";
        } else if (profile.role === "candidate") {
            url.pathname = "/candidate";
        } else {
            url.pathname = "/referrer";
        }

        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|api/).*)",
    ],
};
