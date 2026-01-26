"use client";

import { useState, useEffect } from "react";
import SwipeCard from "./SwipeCard";
import { Profile } from "@/types/profile";

const demoProfiles: Profile[] = [
  {
    id: "1",
    handle: "K21",
    space: "SWE",
    role: "Backend / Fullstack",
    location: "NYC",
    skills: ["TypeScript", "React", "Node", "SQL"],
    about:
      "Building a referral-based hiring platform. Likes clean UI and fast iteration.",
  },
  {
    id: "2",
    handle: "AnonFin",
    space: "Finance",
    role: "IB Analyst",
    location: "NYC",
    skills: ["Valuation", "Excel", "PowerPoint"],
    about:
      "Finance student targeting IB / PE roles. Strong technical prep.",
  },
];

export default function SwipeDeck() {
  const [index, setIndex] = useState(0);

  const profile = demoProfiles[index];

  const next = () => {
    setIndex((i) => Math.min(i + 1, demoProfiles.length));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") next();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!profile) {
    return (
      <div className="text-sm text-muted-foreground">
        No more profiles.
      </div>
    );
  }

  return (
    <SwipeCard
      profile={profile}
      onLike={next}
      onPass={next}
    />
  );
}
