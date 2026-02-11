import AssetCard from "./AssetCard";

const MOCK_ASSETS = [
    {
        id: "1",
        type: "pdf" as const,
        title: "Senior SWE Resume 2025.pdf",
        url: "#",
        date: "Added 2 days ago",
    },
    {
        id: "2",
        type: "link" as const,
        title: "GitHub: High Scale System Design",
        url: "#",
        date: "Added 1 week ago",
    },
    {
        id: "3",
        type: "image" as const,
        title: "Architecture Diagram",
        url: "https://images.unsplash.com/photo-1558655146-d09347e0b7a8?q=80&w=2600&auto=format&fit=crop",
        date: "Added 2 weeks ago",
    },
];

export default function AssetGrid() {
    if (MOCK_ASSETS.length === 0) {
        return (
            <div className="flex h-64 flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-white/10 bg-white/5 text-center">
                <p className="text-sm font-medium text-white">No assets yet</p>
                <p className="text-xs text-[var(--muted)]">Upload a file to get started</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MOCK_ASSETS.map((asset) => (
                <AssetCard key={asset.id} {...asset} />
            ))}

            {/* Add New Placeholder - Dashed Style */}
            <button className="flex h-48 w-full flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border-2 border-dashed border-white/10 bg-transparent text-[var(--muted)] transition-colors hover:border-white/20 hover:text-white">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </div>
                <span className="text-sm font-medium">Add New</span>
            </button>
        </div>
    );
}
