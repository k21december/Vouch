import Surface from "@/components/common/Surface";

interface AssetCardProps {
    type: "pdf" | "link" | "image";
    title: string;
    url: string;
    date: string;
}

export default function AssetCard({ type, title, url, date }: AssetCardProps) {
    return (
        <div className="group relative h-48 w-full cursor-pointer transition-transform hover:-translate-y-1">
            <Surface className="!p-0 overflow-hidden">
                {/* Mock Preview Background */}
                <div className={`h-full w-full bg-white/5 p-6 transition-colors group-hover:bg-white/10 ${type === 'image' ? 'bg-cover bg-center' : ''
                    }`} style={type === 'image' ? { backgroundImage: `url(${url})` } : {}}>
                    {type !== 'image' && (
                        <div className="flex h-full flex-col justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                                {type === 'pdf' ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold text-white line-clamp-2">{title}</h3>
                                <p className="mt-1 text-xs text-[var(--muted)]">{date}</p>
                            </div>
                        </div>
                    )}
                </div>
            </Surface>
        </div>
    );
}
