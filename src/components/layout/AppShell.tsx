import type { ReactNode } from "react";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh pb-[80px] md:pb-0">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <TopBar />
      </div>

      {/* Wider than before so Discover can breathe. Added pt-28 for fixed nav clearance */}
      <main className="mx-auto w-full max-w-7xl px-6 py-8 pt-28">{children}</main>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
