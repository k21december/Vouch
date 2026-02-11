// Storage utilities for context requests and portfolio items

import type { ContextRequest, PortfolioItem } from "@/types";

const CONTEXT_REQUESTS_KEY = "context_requests";
const PORTFOLIO_ITEMS_KEY = "portfolio_items";

// ---------- Context Requests ----------

export function getContextRequests(): ContextRequest[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(CONTEXT_REQUESTS_KEY);
    if (!data) return [];
    try {
        const requests = JSON.parse(data);
        // Convert date strings back to Date objects
        return requests.map((r: any) => ({
            ...r,
            createdAt: new Date(r.createdAt),
            respondedAt: r.respondedAt ? new Date(r.respondedAt) : undefined,
        }));
    } catch {
        return [];
    }
}

export function createContextRequest(
    request: Omit<ContextRequest, "id" | "createdAt" | "status">
): ContextRequest {
    const requests = getContextRequests();
    const newRequest: ContextRequest = {
        ...request,
        id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: "requested",
        createdAt: new Date(),
    };
    requests.push(newRequest);
    localStorage.setItem(CONTEXT_REQUESTS_KEY, JSON.stringify(requests));
    return newRequest;
}

export function updateContextRequest(
    id: string,
    updates: Partial<Pick<ContextRequest, "status" | "sharedItemIds" | "respondedAt">>
): ContextRequest | null {
    const requests = getContextRequests();
    const index = requests.findIndex((r) => r.id === id);
    if (index === -1) return null;

    const updated = {
        ...requests[index],
        ...updates,
        respondedAt: updates.status ? new Date() : requests[index].respondedAt,
    };
    requests[index] = updated;
    localStorage.setItem(CONTEXT_REQUESTS_KEY, JSON.stringify(requests));
    return updated;
}

export function getRequestForCandidateAndReferrer(
    candidateId: string,
    referrerId: string
): ContextRequest | null {
    const requests = getContextRequests();
    return requests.find(
        (r) => r.candidateId === candidateId && r.referrerId === referrerId
    ) || null;
}

export function getRequestsForCandidate(candidateId: string): ContextRequest[] {
    const requests = getContextRequests();
    return requests.filter((r) => r.candidateId === candidateId);
}

export function getRequestsForReferrer(referrerId: string): ContextRequest[] {
    const requests = getContextRequests();
    return requests.filter((r) => r.referrerId === referrerId);
}

export function getPendingRequestsCount(candidateId: string): number {
    const requests = getRequestsForCandidate(candidateId);
    return requests.filter((r) => r.status === "requested").length;
}

// ---------- Portfolio Items ----------

export function getPortfolioItems(): PortfolioItem[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(PORTFOLIO_ITEMS_KEY);
    if (!data) return [];
    try {
        return JSON.parse(data);
    } catch {
        return [];
    }
}

export function getPortfolioItemsByCandidate(candidateId: string): PortfolioItem[] {
    const items = getPortfolioItems();
    return items.filter((item) => item.candidateId === candidateId);
}

export function getPortfolioItemsByIds(ids: string[]): PortfolioItem[] {
    const items = getPortfolioItems();
    return items.filter((item) => ids.includes(item.id));
}

export function initializePortfolioItems(items: PortfolioItem[]): void {
    localStorage.setItem(PORTFOLIO_ITEMS_KEY, JSON.stringify(items));
}

// ---------- Reset Demo Data ----------

export function resetContextData(): void {
    localStorage.removeItem(CONTEXT_REQUESTS_KEY);
    localStorage.removeItem(PORTFOLIO_ITEMS_KEY);
}
