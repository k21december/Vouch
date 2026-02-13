export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    role: "candidate" | "referrer"
                    email: string | null
                    first_name: string | null
                    last_name: string | null
                    full_name: string | null
                    portfolio: string | null
                    phone: string | null
                    previous_state: string | null
                    headline: string | null
                    bio: string | null
                    location: string | null
                    avatar_url: string | null
                    company: string | null
                    reputation_score: number
                    metadata: Json
                    settings: Json
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    role: "candidate" | "referrer"
                    email?: string | null
                    first_name?: string | null
                    last_name?: string | null
                    full_name?: string | null
                    portfolio?: string | null
                    phone?: string | null
                    previous_state?: string | null
                    headline?: string | null
                    bio?: string | null
                    location?: string | null
                    avatar_url?: string | null
                    company?: string | null
                    reputation_score?: number
                    metadata?: Json
                    settings?: Json
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    role?: "candidate" | "referrer"
                    email?: string | null
                    first_name?: string | null
                    last_name?: string | null
                    full_name?: string | null
                    portfolio?: string | null
                    phone?: string | null
                    previous_state?: string | null
                    headline?: string | null
                    bio?: string | null
                    location?: string | null
                    avatar_url?: string | null
                    company?: string | null
                    reputation_score?: number
                    metadata?: Json
                    settings?: Json
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            candidate_profiles: {
                Row: {
                    user_id: string
                    seniority: string
                    skills: string[]
                    domains: string[]
                    intent_role: string
                    intent_role_custom: string | null
                    impact_score: number
                    years_working: number
                    portfolio_url: string | null
                    portfolio_path: string | null
                    portfolio_filename: string | null
                    portfolio_uploaded_at: string | null
                    updated_at: string
                }
                Insert: {
                    user_id: string
                    seniority?: string
                    skills?: string[]
                    domains?: string[]
                    intent_role?: string
                    intent_role_custom?: string | null
                    impact_score?: number
                    years_working?: number
                    portfolio_url?: string | null
                    portfolio_path?: string | null
                    portfolio_filename?: string | null
                    portfolio_uploaded_at?: string | null
                    updated_at?: string
                }
                Update: {
                    user_id?: string
                    seniority?: string
                    skills?: string[]
                    domains?: string[]
                    intent_role?: string
                    intent_role_custom?: string | null
                    impact_score?: number
                    years_working?: number
                    portfolio_url?: string | null
                    portfolio_path?: string | null
                    portfolio_filename?: string | null
                    portfolio_uploaded_at?: string | null
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "candidate_profiles_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            referrer_profiles: {
                Row: {
                    user_id: string
                    company: string
                    job_title: string
                    seniority: string
                    refer_roles: string[]
                    prefer_skills: string[]
                    prefer_domains: string[]
                    updated_at: string
                }
                Insert: {
                    user_id: string
                    company?: string
                    job_title?: string
                    seniority?: string
                    refer_roles?: string[]
                    prefer_skills?: string[]
                    prefer_domains?: string[]
                    updated_at?: string
                }
                Update: {
                    user_id?: string
                    company?: string
                    job_title?: string
                    seniority?: string
                    refer_roles?: string[]
                    prefer_skills?: string[]
                    prefer_domains?: string[]
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "referrer_profiles_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            matches: {
                Row: {
                    id: string
                    candidate_id: string
                    referrer_id: string
                    score: number
                    breakdown: Json
                    created_at: string
                }
                Insert: {
                    id?: string
                    candidate_id: string
                    referrer_id: string
                    score: number
                    breakdown?: Json
                    created_at?: string
                }
                Update: {
                    id?: string
                    candidate_id?: string
                    referrer_id?: string
                    score?: number
                    breakdown?: Json
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "matches_candidate_id_fkey"
                        columns: ["candidate_id"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "matches_referrer_id_fkey"
                        columns: ["referrer_id"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            decisions: {
                Row: {
                    id: string
                    match_id: string
                    referrer_id: string
                    candidate_id: string
                    decision: "accept" | "decline"
                    reason: string | null
                    decided_at: string
                }
                Insert: {
                    id?: string
                    match_id: string
                    referrer_id: string
                    candidate_id: string
                    decision: "accept" | "decline"
                    reason?: string | null
                    decided_at?: string
                }
                Update: {
                    id?: string
                    match_id?: string
                    referrer_id?: string
                    candidate_id?: string
                    decision?: "accept" | "decline"
                    reason?: string | null
                    decided_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "decisions_match_id_fkey"
                        columns: ["match_id"]
                        referencedRelation: "matches"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "decisions_referrer_id_fkey"
                        columns: ["referrer_id"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "decisions_candidate_id_fkey"
                        columns: ["candidate_id"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            events: {
                Row: {
                    id: string
                    user_id: string | null
                    type: string
                    payload: Json
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    type: string
                    payload?: Json
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    type?: string
                    payload?: Json
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "events_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            jobs: {
                Row: {
                    id: string
                    referrer_id: string
                    title: string
                    company: string
                    description: string
                    location: string | null
                    salary_range: string | null
                    requirements: string[] | null
                    embedding: string | null
                    verified: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    referrer_id: string
                    title: string
                    company: string
                    description: string
                    location?: string | null
                    salary_range?: string | null
                    requirements?: string[] | null
                    embedding?: string | null
                    verified?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    referrer_id?: string
                    title?: string
                    company?: string
                    description?: string
                    location?: string | null
                    salary_range?: string | null
                    requirements?: string[] | null
                    embedding?: string | null
                    verified?: boolean
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "jobs_referrer_id_fkey"
                        columns: ["referrer_id"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            requests: {
                Row: {
                    id: string
                    candidate_id: string
                    referrer_id: string
                    job_id: string | null
                    status: "pending" | "details_requested" | "matched" | "vouched" | "passed"
                    note: string | null
                    requested_areas: string[] | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    candidate_id: string
                    referrer_id: string
                    job_id?: string | null
                    status?: "pending" | "details_requested" | "matched" | "vouched" | "passed"
                    note?: string | null
                    requested_areas?: string[] | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    candidate_id?: string
                    referrer_id?: string
                    job_id?: string | null
                    status?: "pending" | "details_requested" | "matched" | "vouched" | "passed"
                    note?: string | null
                    requested_areas?: string[] | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "requests_candidate_id_fkey"
                        columns: ["candidate_id"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "requests_referrer_id_fkey"
                        columns: ["referrer_id"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "requests_job_id_fkey"
                        columns: ["job_id"]
                        referencedRelation: "jobs"
                        referencedColumns: ["id"]
                    }
                ]
            }
            portfolio_items: {
                Row: {
                    id: string
                    candidate_id: string
                    title: string
                    url: string | null
                    type: "resume" | "case-study" | "project" | "link" | "metrics"
                    description: string | null
                    embedding: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    candidate_id: string
                    title: string
                    url?: string | null
                    type: "resume" | "case-study" | "project" | "link" | "metrics"
                    description?: string | null
                    embedding?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    candidate_id?: string
                    title?: string
                    url?: string | null
                    type?: "resume" | "case-study" | "project" | "link" | "metrics"
                    description?: string | null
                    embedding?: string | null
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "portfolio_items_candidate_id_fkey"
                        columns: ["candidate_id"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            chat_messages: {
                Row: {
                    id: string
                    request_id: string
                    sender_id: string
                    content: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    request_id: string
                    sender_id: string
                    content: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    request_id?: string
                    sender_id?: string
                    content?: string
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "chat_messages_request_id_fkey"
                        columns: ["request_id"]
                        referencedRelation: "requests"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "chat_messages_sender_id_fkey"
                        columns: ["sender_id"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            reputation_events: {
                Row: {
                    id: string
                    user_id: string
                    event_type: string
                    score_delta: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    event_type: string
                    score_delta: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    event_type?: string
                    score_delta?: number
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "reputation_events_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            create_request: {
                Args: {
                    target_referrer_id: string
                    target_job_id: string
                    request_note: string
                }
                Returns: string
            }
            get_ranked_requests: {
                Args: {
                    target_referrer_id: string
                    target_job_id?: string | null
                }
                Returns: {
                    request_id: string
                    candidate_id: string
                    candidate_name: string
                    candidate_headline: string
                    match_score: number
                    reputation_score: number
                    created_at: string
                }[]
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
