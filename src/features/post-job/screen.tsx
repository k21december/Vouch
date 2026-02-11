"use client";

import JobForm from "./components/JobForm";

export default function PostJobScreen() {
  return (
    <div className="min-h-[calc(100dvh-96px)] w-full">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-white">
            Post a Job
          </h1>
          <p className="max-w-md text-sm text-[var(--muted)]">
            Share a new opportunity with your network. Referrals are incentivized.
          </p>
        </div>

        <JobForm />
      </div>
    </div>
  );
}
