import { ChatList } from "@/components/referrer/ChatList";
import { MoreHorizontal } from "lucide-react";

export default function ChatsPage() {
    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
                        Chats
                    </h1>
                    <p className="text-sm text-[var(--muted)] font-medium">
                        Active conversations
                    </p>
                </div>

                <button className="rounded-full p-2 text-white/40 hover:bg-white/5 hover:text-white transition-colors">
                    <MoreHorizontal className="h-5 w-5" />
                </button>
            </div>

            <ChatList />
        </div>
    );
}
