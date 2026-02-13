"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Surface from "@/components/common/Surface";
import { useRole } from "@/lib/auth/useRole";
import { Inbox, MessageSquare, Briefcase, Settings } from "lucide-react";

function HomeView() {
  const { role } = useRole();
  const router = useRouter();

  if (role === "referrer") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 relative">
        {/* Top Right Settings */}
        <div className="absolute top-6 right-6">
          <Link href="/settings">
            <button className="rounded-full p-2 text-white/40 hover:bg-white/5 hover:text-white transition-colors">
              <Settings className="h-5 w-5" />
            </button>
          </Link>
        </div>

        <div className="w-full max-w-md flex flex-col gap-8">
          {/* Referrer Header */}
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-bold tracking-tighter text-white">Welcome Back</h1>
            <p className="text-xl text-white/60">Manage your inbound requests</p>
          </div>

          {/* Action Dashboard */}
          <div className="flex flex-col gap-4">
            {/* Primary Action: View Requests */}
            <div
              onClick={() => router.push("/requests")}
              className="group cursor-pointer rounded-2xl bg-white p-1 hover:scale-[1.01] transition-transform active:scale-[0.99] shadow-lg shadow-white/5"
            >
              <div className="flex items-center gap-4 rounded-xl border border-black/5 bg-white px-6 py-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white group-hover:bg-[rgb(var(--accent))] transition-colors">
                  <Inbox className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-black group-hover:text-[rgb(var(--accent))] transition-colors">
                    Review Actions
                  </h3>
                  <p className="text-sm font-medium text-black/60">
                    View pending requests
                  </p>
                </div>
                {/* Arrow or Badge can go here */}
              </div>
            </div>

            {/* Secondary Actions Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Chats */}
              <div
                onClick={() => router.push("/chats")}
                className="group cursor-pointer rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-md hover:bg-white/10 hover:scale-[1.02] transition-all active:scale-[0.98]"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white group-hover:bg-white/20 transition-colors">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-white mb-0.5">Open Chats</h3>
                <p className="text-xs text-white/50">Active conversations</p>
              </div>

              {/* Post Job */}
              <div
                onClick={() => router.push("/post-job")}
                className="group cursor-pointer rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-md hover:bg-white/10 hover:scale-[1.02] transition-all active:scale-[0.98]"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white group-hover:bg-white/20 transition-colors">
                  <Briefcase className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-white mb-0.5">Post a Job</h3>
                <p className="text-xs text-white/50">Create new listing</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default / Candidate View
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-md flex flex-col gap-8">
        {/* Welcome Header */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold tracking-tighter text-white">Welcome</h1>
          <p className="text-xl text-white/60">How to use Vouch</p>
        </div>

        {/* Instructions */}
        <div className="grid gap-4">
          <Link href="/discover" className="block group">
            <Surface className="!p-6 flex items-start gap-4 transition-transform duration-200 group-hover:scale-[1.02] cursor-pointer">
              <div className="p-3 rounded-full bg-white/10 text-white group-hover:bg-white/20 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </div>
              <div>
                <h3 className="font-bold text-white text-lg group-hover:text-[rgb(var(--accent))] transition-colors">Swipe Right</h3>
                <p className="text-white/60">Match with candidates or companies you're interested in.</p>
              </div>
            </Surface>
          </Link>

          <Link href="/discover" className="block group">
            <Surface className="!p-6 flex items-start gap-4 transition-transform duration-200 group-hover:scale-[1.02] cursor-pointer">
              <div className="p-3 rounded-full text-[rgb(var(--accent))]" style={{ background: "var(--accent-weak)" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
              </div>
              <div>
                <h3 className="font-bold text-white text-lg group-hover:text-[rgb(var(--accent))] transition-colors">Swipe Up</h3>
                <p className="text-white/60">Request a Demo instantly. Guaranteed notification.</p>
              </div>
            </Surface>
          </Link>
        </div>

        {/* CTA */}
        <Link href="/discover" className="w-full">
          <button className="w-full py-4 rounded-2xl bg-white text-black font-bold text-lg uppercase tracking-wide hover:bg-gray-100 transition-all active:scale-[0.98] shadow-lg shadow-white/10">
            Start Swiping
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem("vouch.auth");
    if (auth !== "true") {
      router.replace("/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) return null;

  return <HomeView />;
}
