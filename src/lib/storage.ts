
import { Candidate, Match, Session, ConnectionState, Message, SwipeAction } from "@/types";

const STORAGE_KEYS = {
    CANDIDATES: "vouch.candidates",
    MATCHES_V2: "vouch.matches_v2",
    SESSION: "vouch.session",
    MESSAGES: "vouch.messages"
};

// Events
export const EVENTS = {
    SESSION_CHANGED: "vouch:session-changed",
    MATCH_UPDATED: "vouch:match-updated"
};

/* ---------- Seed Data (Corrected Types) ---------- */
const SEED_CANDIDATES: Omit<Candidate, "id">[] = [
    {
        firstName: "Sarah", age: 28, jobFocus: "Senior Product Designer", location: "NYC", skills: ["Figma", "Design Systems", "Prototyping", "User Research"],
        currentRole: "Senior Designer @ Ramp", previousRole: "Product Designer @ Stripe", experience: "2022-Present", education: "Parsons School of Design, BFA", headline: "Designing financial tools for humans.", verified: true, bio: "Obsessed with micro-interactions and clean UI. I specialize in complex fintech flows.", hasLikedCurrentUser: true,
    },
    {
        firstName: "David", age: 32, jobFocus: "Staff Software Engineer", location: "Remote", skills: ["React", "System Architecture", "Node.js", "AWS"],
        currentRole: "Staff Engineer @ Linear", previousRole: "Senior SWE @ Google", experience: "2021-Present", education: "University of Waterloo, BS CS", headline: "Simplifying complexity at scale.", verified: true, bio: "Full-stack engineer who loves scaling systems. I blog about performance optimization.", hasLikedCurrentUser: false,
    },
    {
        firstName: "Jessica", age: 26, jobFocus: "Growth Marketing Manager", location: "SF", skills: ["SEO", "Paid Acquisition", "Analytics", "Copywriting"],
        currentRole: "Growth Manager @ Notion", previousRole: "Marketing Lead @ Glossier", experience: "2020-Present", education: "UC Berkeley, BA Econ", headline: "Data-driven growth engines.", verified: true, bio: "Data-driven marketer. I turn spreadsheets into revenue.", hasLikedCurrentUser: true,
    },
    {
        firstName: "Marcus", age: 29, jobFocus: "Backend Engineer", location: "Austin", skills: ["Go", "Kubernetes"],
        currentRole: "Senior Backend @ Vercel", previousRole: "Backend Eng @ Cloudflare", experience: "6y exp • Cloud Infrastructure Focus", education: "UT Austin", headline: "Building robust distributed systems.", verified: false, bio: "High-performance distributed systems enthusiast.", hasLikedCurrentUser: true
    }
    // Added minimal set to ensure types work. In a real app we'd migrate all 30.
];

/* ---------- Service ---------- */
export const StorageService = {
    // 1. Session Store (Single Truth)
    getSession: (): Session => {
        if (typeof window === "undefined") return { userId: "referrer_1", role: "referrer" };
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.SESSION);
            if (stored) return JSON.parse(stored);
        } catch { }
        return { userId: "referrer_1", role: "referrer" };
    },

    setSession: (session: Session) => {
        if (typeof window === "undefined") return;
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
        window.dispatchEvent(new CustomEvent(EVENTS.SESSION_CHANGED, { detail: session }));
    },

    // 2. Candidates
    seed: () => {
        if (typeof window === "undefined") return;
        const existing = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
        if (!existing) {
            const candidates: Candidate[] = SEED_CANDIDATES.map(c => ({
                ...c,
                id: crypto.randomUUID(),
                // Fix for any missing fields if type was loose
                education: c.education || "Unknown",
                previousRole: c.previousRole || "",
                currentRole: c.currentRole || "",
                experience: c.experience || ""
            } as Candidate));
            localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
        }
    },

    getCandidates: (): Candidate[] => {
        if (typeof window === "undefined") return [];
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.CANDIDATES) || "[]");
    },

    // 3. Matches (Single Truth)
    getMatchesMap: (): Record<string, Match> => {
        if (typeof window === "undefined") return {};
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.MATCHES_V2) || "{}");
    },

    getMatch: (candidateId: string, referrerId: string): Match | undefined => {
        const matches = StorageService.getMatchesMap();
        return matches[`${referrerId}_${candidateId}`];
    },

    updateMatch: (match: Match) => {
        if (typeof window === "undefined") return;
        const matches = StorageService.getMatchesMap();
        const key = `${match.referrerId}_${match.candidateId}`;

        matches[key] = { ...match, updatedAt: Date.now() };

        localStorage.setItem(STORAGE_KEYS.MATCHES_V2, JSON.stringify(matches));
        window.dispatchEvent(new CustomEvent(EVENTS.MATCH_UPDATED, { detail: match }));
        window.dispatchEvent(new Event("vouch:matches-changed"));
    },

    // ACTIONS

    // Swipe Logic
    swipe: (candidateId: string, action: SwipeAction): { isMatch: boolean } => {
        const session = StorageService.getSession();
        let connectionState: ConnectionState = "passed";
        let isMatch = false;

        if (action === "NOPE") {
            connectionState = "passed";
        } else if (action === "LIKE" || action === "DEMO") {
            const candidate = StorageService.getCandidates().find(c => c.id === candidateId);
            if (action === "DEMO" || (candidate && candidate.hasLikedCurrentUser)) {
                connectionState = "matched";
                isMatch = true;
            } else {
                connectionState = "passed";
            }
        }

        const existing = StorageService.getMatch(candidateId, session.userId);
        const match: Match = {
            id: existing?.id || crypto.randomUUID(),
            candidateId,
            referrerId: session.userId,
            connectionState,
            createdAt: existing?.createdAt || Date.now(),
            updatedAt: Date.now(),
            chatUnlocked: existing?.chatUnlocked || false,
            contextRequestData: existing?.contextRequestData
        };

        StorageService.updateMatch(match);
        return { isMatch };
    },

    // Request Details Action
    requestDetails: (candidateId: string) => {
        const session = StorageService.getSession();
        const existing = StorageService.getMatch(candidateId, session.userId);

        if (!existing) return; // Should not happen if flow is correct

        const updated: Match = {
            ...existing,
            connectionState: "details_requested",
            updatedAt: Date.now()
        };
        StorageService.updateMatch(updated);
    },

    // Vouch Action
    vouch: (candidateId: string) => {
        const session = StorageService.getSession();
        const existing = StorageService.getMatch(candidateId, session.userId);

        if (!existing) return;

        const updated: Match = {
            ...existing,
            connectionState: "vouched",
            chatUnlocked: true,
            updatedAt: Date.now()
        };
        StorageService.updateMatch(updated);
        StorageService.addSystemMessage(candidateId, "Referrer has vouched for you. Chat unlocked.");
    },

    // Request Management (Referrer)
    acceptRequest: (matchId: string) => {
        const session = StorageService.getSession();
        const matches = StorageService.getMatchesMap();
        const match = Object.values(matches).find(m => m.id === matchId);

        if (!match || match.referrerId !== session.userId) return;

        const updated: Match = {
            ...match,
            connectionState: "vouched",
            chatUnlocked: true,
            updatedAt: Date.now()
        };
        StorageService.updateMatch(updated);
        StorageService.addSystemMessage(match.candidateId, "Referrer has vouched for you. Chat unlocked.");
    },

    declineRequest: (matchId: string) => {
        const session = StorageService.getSession();
        const matches = StorageService.getMatchesMap();
        const match = Object.values(matches).find(m => m.id === matchId);

        if (!match || match.referrerId !== session.userId) return;

        const updated: Match = {
            ...match,
            connectionState: "passed",
            updatedAt: Date.now()
        };
        StorageService.updateMatch(updated);
    },

    // Feed
    getFeed: (): Candidate[] => {
        const session = StorageService.getSession();
        const allCandidates = StorageService.getCandidates();
        const matches = StorageService.getMatchesMap();

        return allCandidates.filter(c => {
            const key = `${session.userId}_${c.id}`;
            const match = matches[key];

            // If no match record => New => Show in Feed
            if (!match) return true;

            // If "matched" => Show in Feed (to allow Request Details)
            if (match.connectionState === "matched") return true;

            // If "passed", "details_requested", "vouched" => Hide from feed
            return false;
        });
    },

    // Matches List
    getMatchesList: (role: "referrer" | "candidate"): Match[] => {
        const session = StorageService.getSession();
        const all = StorageService.getMatchesMap();
        const matches = Object.values(all);

        const userMatches = matches.filter(m =>
            role === "referrer" ? m.referrerId === session.userId : m.candidateId === session.userId
        );

        return userMatches.filter(m => {
            // Referrers need to see "matched" (Requests) and "vouched"/"matched" (Active)
            if (role === "referrer") {
                return m.connectionState === "matched" || m.connectionState === "vouched" || m.connectionState === "details_requested";
            }
            // Candidates 
            return m.connectionState === "details_requested" || m.connectionState === "vouched";
        });
    },

    /* ---------- Helper for Messages ---------- */
    getMessages: (candidateId: string): Message[] => {
        if (typeof window === "undefined") return [];
        const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || "{}");
        return all[candidateId] || [];
    },

    sendMessage: (candidateId: string, text: string, senderId: string) => {
        if (typeof window === "undefined") return;
        const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || "{}");
        const msgs: Message[] = all[candidateId] || [];
        msgs.push({
            id: crypto.randomUUID(),
            senderId,
            text,
            timestamp: Date.now(),
            type: "user"
        });
        all[candidateId] = msgs;
        localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(all));
    },

    addSystemMessage: (candidateId: string, text: string) => {
        if (typeof window === "undefined") return;
        const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || "{}");
        const msgs = all[candidateId] || [];
        msgs.push({
            id: crypto.randomUUID(),
            senderId: "system",
            text,
            timestamp: Date.now(),
            type: "system"
        });
        all[candidateId] = msgs;
        localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(all));
    },

    reset: () => {
        if (typeof window === "undefined") return;
        localStorage.clear();
        window.location.reload();
    }
};
