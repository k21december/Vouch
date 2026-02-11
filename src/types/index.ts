export type SwipeAction = "LIKE" | "NOPE" | "DEMO";
export type Swipe = Record<string, SwipeAction>;

export type ConnectionState = "matched" | "details_requested" | "vouched" | "passed";

export interface Candidate {
    id: string;
    firstName: string;
    age: number;
    jobFocus: string; // e.g., "Senior Product Designer"
    location: string; // "NYC", "SF", "Remote"
    skills: string[]; // ["Figma", "React", "Strategy"]
    experience: string; // "7 years across fintech & consumer"
    education: string; // "University of Toronto, BS CS"
    previousRole: string; // "Senior Swe @ Kraken"
    currentRole: string; // "Staff Engineer @ Anthropic"
    headline: string; // "Building the future of finance."
    verified: boolean;
    bio: string;
    // Hidden property for simulation
    hasLikedCurrentUser?: boolean;
}

export interface Referrer {
    id: string;
    firstName: string;
    age: number;
    currentRole: string; // e.g., "Senior PM @ Stripe"
    location: string; // "NYC", "SF", "Remote"
    yearsOfExp: number;
    verified: boolean;
    bio: string; // Short tagline
    company: string; // Current employer
}

export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string; // "Full-time", "Contract"
    salary: string; // "$120k - $180k"
    description: string;
    requirements: string[];
    referrerId: string; // ID of the referrer posting this job
    verified: boolean;
}

export interface Match {
    id: string;
    candidateId: string;
    referrerId: string;
    connectionState: ConnectionState;
    createdAt: number;
    updatedAt: number;
    contextRequestId?: string; // Link to the ContextRequest
    chatUnlocked: boolean;
    // Single Source of Truth for Request Data
    contextRequestData?: {
        id: string; // for key
        note?: string;
        requestedAreas: string[]; // Simplification of ContextRequest["requestedAreas"]
    };
    // Legacy support (optional)
    status?: "pending" | "accepted" | "rejected";
}

export interface Session {
    userId: string;
    role: "candidate" | "referrer";
}

export interface PortfolioItem {
    id: string;
    type: "resume" | "case-study" | "project" | "link" | "metrics";
    title: string;
    company?: string;  // Company names allowed
    description: string;  // What this proves
    category: "resume" | "projects" | "system-design" | "metrics" | "education";
    candidateId: string;
}

export interface ContextRequest {
    id: string;
    referrerId: string;
    candidateId: string;
    requestedAreas: Array<"resume" | "projects" | "system-design" | "metrics" | "education">;
    note?: string;  // Max 140 chars
    status: "requested" | "shared" | "declined";
    sharedItemIds?: string[];  // IDs of portfolio items candidate approved
    createdAt: Date;
    respondedAt?: Date;
}

export interface Message {
    id: string;
    senderId: string; // "me" | "them" | "system"
    text: string;
    timestamp: number;
    type: "user" | "system";
}

export interface VouchStatus {
    matchId: string;
    isVouched: boolean;
    vouchedAt?: number;
}
