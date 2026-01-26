"use client";

import { useEffect, useMemo, useState } from "react";
import Surface from "@/components/common/Surface";

type Profile = {
  id: string;
  handle: string;
  space: "Finance" | "SWE" | "Engineering";
  role: string;
  location: string;
  skills: string[];
  about: string;
};

const demo: Profile[] = [
  {
    id: "p1",
    handle: "AnonSWE",
    space: "SWE",
    role: "Backend / Fullstack",
    location: "NYC",
    skills: ["TypeScript", "Node", "SQL", "React"],
    about: "Early-stage builder. Fast iteration. High-signal conversations only.",
  },
  {
    id: "p2",
    handle: "AnonFin",
    space: "Finance",
    role: "IB Analyst",
    location: "NYC",
    skills: ["Valuation", "Excel", "Pitchbooks"],
    about: "Finance student. Wants a referral path with zero LinkedIn cringe.",
  },
];

export default function SwipeDeck() {
  const profiles = useMemo(() => demo, []);
  const [i, setI] = useState(0);

  const current = profiles[i];

  const next = () => setI((x) => Math.min(x + 1, profiles.length));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") next(); // pass
      if (e.key === "ArrowRight") next(); // like
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  if (!current) {
    return (
      <Surface className="p-10 text-center">
        <div className="text-sm text-muted-foreground">No more profiles.</div>
      </Surface>
    );
  }

  return (
    <Surface className="p-6">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">
          {current.handle} • {current.space}
        </div>
        <div className="text-xs text-muted-foreground">{current.location}</div>
      </div>

      <div className="mt-4 text-2xl font-semibold tracking-tight">
        {current.role}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {current.skills.map((s) => (
          <span
            key={s}
            className="rounded-full border border-border/40 bg-secondary/50 px-3 py-1 text-xs"
          >
            {s}
          </span>
        ))}
      </div>

      <p className="mt-5 text-sm text-muted-foreground">{current.about}</p>

      <div className="mt-8 flex gap-2">
        <button
          onClick={next}
          className="h-11 flex-1 rounded-2xl bg-secondary/70 text-sm hover:bg-secondary transition"
        >
          Pass
        </button>
        <button
          onClick={next}
          className="h-11 flex-1 rounded-2xl bg-foreground text-background text-sm hover:opacity-90 transition"
        >
          Like
        </button>
      </div>

      <div className="mt-3 text-xs text-muted-foreground">
        Tip: identity stays hidden until mutual reveal.
      </div>
    </Surface>
  );
}
