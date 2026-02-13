"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";

const PUBLIC_PATHS = ["/login", "/signup", "/onboarding"];

export default function AppShell({ children }: { children: ReactNode }) {
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    if (PUBLIC_PATHS.some((p) => window.location.pathname.startsWith(p))) {
      setShowNav(false);
      return;
    }

    let mounted = true;

    async function check() {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) setShowNav(!!session);
    }

    check();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setShowNav(!!session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-dvh pb-[80px] md:pb-0">
      {showNav && (
        <div className="hidden md:block">
          <TopBar />
        </div>
      )}

      <main className={`mx-auto w-full max-w-7xl px-6 py-8 ${showNav ? "pt-28" : "pt-8"}`}>
        {children}
      </main>

      {showNav && (
        <div className="md:hidden">
          <BottomNav />
        </div>
      )}
    </div>
  );
}
