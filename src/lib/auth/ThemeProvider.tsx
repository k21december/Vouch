"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_ROLE, Role, Permission, hasPermission } from "./role";
import { supabase } from "@/lib/supabase/client";

const KEY = "refer.role";

interface SplashState {
    open: boolean;
    theme: Role;
}

interface ThemeContextValue {
    role: Role;
    setRole: (role: Role) => void;
    switchRoleWithSplash: (nextRole: Role) => void;
    can: (perm: Permission) => boolean;
    splashState: SplashState;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [role, setRoleState] = useState<Role>(() => {
        // Initialize from localStorage before first paint (Optimistic / Cache)
        if (typeof window !== "undefined") {
            try {
                // Check legacy session first
                const sessionStr = localStorage.getItem("vouch.session");
                if (sessionStr) {
                    const session = JSON.parse(sessionStr);
                    if (session.role) return session.role;
                }
                const saved = localStorage.getItem(KEY) as Role;
                if (saved) return saved;
            } catch (e) { }
        }
        return DEFAULT_ROLE;
    });

    const [splashState, setSplashState] = useState<SplashState>({
        open: false,
        theme: role,
    });

    // Apply theme to DOM
    useEffect(() => {
        document.documentElement.dataset.theme = role;
        document.body.dataset.theme = role;
    }, [role]);

    // Sync with Supabase (Source of Truth)
    useEffect(() => {
        if (!supabase) return;
        let mounted = true;
        async function syncRole() {
            const { data: { user } } = await supabase!.auth.getUser();
            if (!user) return;

            const { data } = await supabase!
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single();

            if (mounted && data?.role) {
                const dbRole = data.role as Role;
                if (dbRole !== role) {
                    setRoleState(dbRole);
                    localStorage.setItem(KEY, dbRole);
                }
            }
        }
        syncRole();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                syncRole();
            }
            if (event === 'SIGNED_OUT') {
                setRoleState(DEFAULT_ROLE);
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const setRole = async (next: Role) => {
        setRoleState(next);
        localStorage.setItem(KEY, next);

        if (supabase) {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase.from("profiles").update({ role: next }).eq("id", user.id);
            }
            localStorage.setItem("vouch.session", JSON.stringify({ userId: user?.id, role: next }));
        } else {
            localStorage.setItem("vouch.session", JSON.stringify({ userId: "referrer_1", role: next }));
        }
    };

    const switchRoleWithSplash = (nextRole: Role) => {
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
        setRole,
        switchRoleWithSplash,
        can,
        splashState,
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return context;
}
