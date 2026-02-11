
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { StorageService } from "@/lib/storage";
import { Database } from "@/lib/supabase/database.types";

type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
type RequestInsert = Database["public"]["Tables"]["requests"]["Insert"];

export default function MigrationHelper() {
    const [status, setStatus] = useState<string>("Ready");
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) => setLogs((prev) => [...prev, msg]);

    const runMigration = async () => {
        setStatus("Migrating...");
        setLogs([]);

        if (!supabase) {
            addLog("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.");
            setStatus("Failed: No Supabase connection");
            return;
        }

        try {
            // 1. Migrate Candidates -> Profiles
            const candidates = StorageService.getCandidates();
            addLog(`Found ${candidates.length} candidates in localStorage.`);

            for (const c of candidates) {
                const profileData: ProfileInsert = {
                    id: c.id,
                    role: "candidate",
                    first_name: c.firstName,
                    last_name: "", // Split or blank
                    headline: c.headline,
                    bio: c.bio,
                    location: c.location,
                    metadata: {
                        age: c.age,
                        skills: c.skills,
                        experience: c.experience,
                        education: c.education,
                        jobFocus: c.jobFocus
                    }
                };

                // Upsert Profile
                const { error: profileError } = await supabase.from("profiles").upsert(profileData);

                if (profileError) {
                    addLog(`Error migrating candidate ${c.firstName}: ${profileError.message}`);
                } else {
                    addLog(`Migrated candidate ${c.firstName}`);
                }
            }

            // 2. Migrate Session User (Referrer) -> Profile
            const session = StorageService.getSession();
            if (session.role === "referrer") {
                const referrerData: ProfileInsert = {
                    id: session.userId,
                    role: "referrer",
                    first_name: "Current",
                    last_name: "Referrer",
                    headline: "Migrated Referrer",
                    bio: "Migrated from localStorage"
                };

                const { error: refError } = await supabase.from("profiles").upsert(referrerData);
                if (refError) addLog(`Error migrating referrer: ${refError.message}`);
                else addLog(`Migrated referrer ${session.userId}`);
            }


            // 3. Migrate Matches -> Requests
            const matchesMap = StorageService.getMatchesMap();
            const matches = Object.values(matchesMap);
            addLog(`Found ${matches.length} matches/requests.`);

            for (const m of matches) {
                let status: RequestInsert["status"] = "pending";
                if (m.connectionState === "matched") status = "matched";
                if (m.connectionState === "vouched") status = "vouched";
                if (m.connectionState === "passed") status = "passed"; // Assuming 'passed' is in DB types now? Schema had "passed"
                if (m.connectionState === "details_requested") status = "details_requested";

                const requestData: RequestInsert = {
                    id: m.id,
                    candidate_id: m.candidateId,
                    referrer_id: m.referrerId,
                    status: status,
                    // job_id: null, // Legacy matches didn't have jobs
                    created_at: new Date(m.createdAt).toISOString(),
                    updated_at: new Date(m.updatedAt).toISOString()
                };

                const { error: reqError } = await supabase.from("requests").upsert(requestData);

                if (reqError) {
                    addLog(`Error migrating match ${m.id}: ${reqError.message}`);
                } else {
                    addLog(`Migrated match ${m.id} as ${status}`);
                }
            }

            setStatus("Done!");

        } catch (err: any) {
            setStatus(`Failed: ${err.message}`);
            addLog(`Critical Error: ${err.message}`);
        }
    };

    return (
        <div className="p-4 bg-black/90 text-white rounded-lg border border-white/10 mt-8">
            <h3 className="font-bold mb-4">Supabase Migration Tool</h3>
            <div className="max-h-60 overflow-y-auto font-mono text-xs bg-black p-2 rounded mb-4 border border-white/5">
                {logs.length === 0 ? "Logs will appear here..." : logs.map((l, i) => <div key={i}>{l}</div>)}
            </div>
            <div className="flex gap-4 items-center">
                <button
                    onClick={runMigration}
                    className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-500 font-bold text-sm"
                >
                    {status === "Ready" ? "Start Migration" : status}
                </button>
                <span className="text-xs text-gray-400">
                    Reads localStorage -&gt; Writes to Supabase (must be logged in or anon enabled)
                </span>
            </div>
        </div>
    );
}
