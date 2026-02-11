// Seed portfolio items for demo
import type { PortfolioItem } from "@/types";

export const SEED_PORTFOLIO_ITEMS: PortfolioItem[] = [
    // Sarah - Senior Product Designer
    {
        id: "port_sarah_1",
        candidateId: "candidate_1",
        type: "case-study",
        title: "Fintech Checkout Redesign",
        company: "Stripe",
        description: "Reduced cart abandonment by 23% through simplification",
        category: "projects",
    },
    {
        id: "port_sarah_2",
        candidateId: "candidate_1",
        type: "project",
        title: "Design System Migration",
        company: "Ramp",
        description: "Led migration to unified component library, 40% faster builds",
        category: "projects",
    },
    {
        id: "port_sarah_3",
        candidateId: "candidate_1",
        type: "resume",
        title: "Resume Summary",
        description: "5+ years designing financial products at Stripe and Ramp",
        category: "resume",
    },
    {
        id: "port_sarah_4",
        candidateId: "candidate_1",
        type: "metrics",
        title: "Impact Metrics",
        description: "Shipped 12+ features, 95% user satisfaction across products",
        category: "metrics",
    },

    // David - Staff Software Engineer
    {
        id: "port_david_1",
        candidateId: "candidate_2",
        type: "project",
        title: "Distributed Tracing System",
        company: "Google",
        description: "Built internal observability platform serving 1000+ services",
        category: "system-design",
    },
    {
        id: "port_david_2",
        candidateId: "candidate_2",
        type: "project",
        title: "API Gateway Redesign",
        company: "Linear",
        description: "Reduced P99 latency from 800ms to 120ms through edge caching",
        category: "system-design",
    },
    {
        id: "port_david_3",
        candidateId: "candidate_2",
        type: "resume",
        title: "Resume Summary",
        description: "8+ years building scalable systems at Google, Dropbox, Linear",
        category: "resume",
    },
    {
        id: "port_david_4",
        candidateId: "candidate_2",
        type: "metrics",
        title: "Performance Wins",
        description: "3x throughput improvement, 99.99% uptime across infrastructure",
        category: "metrics",
    },

    // Jessica - Growth Marketing Manager
    {
        id: "port_jessica_1",
        candidateId: "candidate_3",
        type: "case-study",
        title: "0-to-1 Growth Strategy",
        company: "Glossier",
        description: "Scaled DTC brand from $0 to $10M ARR in 18 months",
        category: "metrics",
    },
    {
        id: "port_jessica_2",
        candidateId: "candidate_3",
        type: "project",
        title: "SEO Overhaul",
        company: "Notion",
        description: "Increased organic traffic 300% through content strategy",
        category: "projects",
    },
    {
        id: "port_jessica_3",
        candidateId: "candidate_3",
        type: "resume",
        title: "Resume Summary",
        description: "4+ years driving growth at consumer and B2B SaaS companies",
        category: "resume",
    },
    {
        id: "port_jessica_4",
        candidateId: "candidate_3",
        type: "metrics",
        title: "Campaign Performance",
        description: "Managed $50k+ monthly ad spend, 4.2x average ROAS",
        category: "metrics",
    },
];
