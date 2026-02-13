"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { usePathname } from "next/navigation";
import {
    DEFAULT_ROLE,
    Role,
    Theme,
    Permission,
    hasPermission,
} from "./role";
import { supabase } from "@/lib/supabase/client";

const AUTH_ROUTES = ["/login", "/signup", "/onboarding"];

interface SplashState {
    open: boolean;
    theme: Theme;
}

interface ThemeContextValue {
    role: Role;
    theme: Theme;
    setRole: (role: Role) => void;
    switchRoleWithSplash: (nextRole: Role) => void;
    can: (perm: Permission) => boolean;
    splashState: SplashState;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getStoredSession() {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem("vouch.session");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function setStoredSession(session: { userId: string; role: Role } | null) {
    if (typeof window === "undefined") return;
    if (!session) localStorage.removeItem("vouch.session");
    else localStorage.setItem("vouch.session", JSON.stringify(session));
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthRoute = AUTH_ROUTES.some((route) =>
        pathname?.startsWith(route)
    );

    const [authenticated, setAuthenticated] = useState(false);
    const [role, setRoleState] = useState<Role>(DEFAULT_ROLE);

    const [splashState, setSplashState] = useState<SplashState>({
        open: false,
        theme: "navy",
    });

    /**
     * THEME LOGIC (Single Source of Truth)
     */
    const theme: Theme = useMemo(() => {
        if (isAuthRoute) return "navy";
        if (!authenticated) return "navy";
        return role;
    }, [authenticated, role, isAuthRoute]);

    /**
     * Apply theme to DOM
     */
    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        document.body.dataset.theme = theme;
    }, [theme]);

    /**
     * Supabase Auth Sync
     */
    useEffect(() => {
        if (!supabase) return;
        let mounted = true;

        async function syncAuth() {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                if (mounted) {
                    setAuthenticated(false);
                    setRoleState(DEFAULT_ROLE);
                    setStoredSession(null);
                }
                return;
            }

            if (mounted) setAuthenticated(true);

            const { data } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single();

            if (mounted && data?.role) {
                const dbRole = data.role as Role;
                setRoleState(dbRole);
                setStoredSession({ userId: user.id, role: dbRole });
            }
        }

        syncAuth();

        const { data: { subscription } } =
            supabase.auth.onAuthStateChange((event) => {
                if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
                    syncAuth();
                }

                if (event === "SIGNED_OUT") {
                    if (mounted) {
                        setAuthenticated(false);
                        setRoleState(DEFAULT_ROLE);
                        setStoredSession(null);
                    }
                }
            });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    /**
     * Switch role (only when authenticated)
     */
    const setRole = async (next: Role) => {
        if (!authenticated) return;

        setRoleState(next);

        if (supabase) {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase
                    .from("profiles")
                    .update({ role: next })
                    .eq("id", user.id);

                setStoredSession({ userId: user.id, role: next });
            }
        }
    };

    const switchRoleWithSplash = (nextRole: Role) => {
        if (!authenticated) return;

        setSplashState({ open: true, theme: nextRole });
        setTimeout(() => setRole(nextRole), 100);
        setTimeout(() => setSplashState({ open: false, theme: nextRole }), 500);
    };

    const can = useMemo(
        () => (perm: Permission) => hasPermission(role, perm),
        [role]
    );

    const value: ThemeContextValue = {
        role,
        theme,
        setRole,
        switchRoleWithSplash,
        can,
        splashState,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return context;
}