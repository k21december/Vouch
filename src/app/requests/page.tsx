import { RequestList } from "@/components/referrer/RequestList";
import { SlidersHorizontal } from "lucide-react";

export default function RequestsPage() {
    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
                        Inbox
                    </h1>
                    <p className="text-sm text-[var(--muted)] font-medium">
                        Review inbound requests
                    </p>
                </div>

                <button className="rounded-full p-2 text-white/40 hover:bg-white/5 hover:text-white transition-colors">
                    <SlidersHorizontal className="h-5 w-5" />
                </button>
            </div>

            <RequestList />
        </div>
    );
}
