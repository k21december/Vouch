"use client";

import { useState, useEffect, useRef } from "react";
import { Message } from "@/types";
import { StorageService } from "@/lib/storage";
import { useRole } from "@/lib/auth/useRole";
import Surface from "@/components/common/Surface";

interface ChatInterfaceProps {
    matchId: string; // Effectively candidateId for now
}

const CONVERSATION_STARTERS = [
    "Confirm role interest",
    "Share availability",
    "Ask a clarifying question"
];

export default function ChatInterface({ matchId }: ChatInterfaceProps) {
    const { role } = useRole();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Determine my sender ID based on role
    // In a real app, this would be the authenticated user's ID
    const myId = role === "referrer" ? "referrer_1" : "candidate_1";

    const loadMessages = () => {
        const msgs = StorageService.getMessages(matchId);
        setMessages(msgs);
    };

    useEffect(() => {
        loadMessages();
        // Poll for new messages every 2 seconds (simple real-time simulation)
        const interval = setInterval(loadMessages, 2000);
        return () => clearInterval(interval);
    }, [matchId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim()) return;

        StorageService.sendMessage(matchId, inputValue.trim(), myId);
        setInputValue("");
        loadMessages(); // Instant update
    };

    const handleStarterClick = (starter: string) => {
        setInputValue(starter);
        // Optional: auto-focus input
        const input = document.querySelector('input[type="text"]') as HTMLInputElement;
        input?.focus();
    };

    return (
        <div className="flex flex-1 flex-col overflow-hidden rounded-[var(--radius-lg)] bg-[#18181b]/50 border border-white/5">
            {/* Messages Area */}
            <div className="flex-1 space-y-6 overflow-y-auto p-4 sm:p-6">
                {messages.length === 0 && (
                    <div className="flex h-full flex-col items-center justify-center text-center opacity-40">
                        <p className="text-sm">No messages yet.</p>
                    </div>
                )}

                {messages.map((msg) => {
                    const isSystem = msg.type === "system";
                    const isMe = msg.senderId === myId;

                    if (isSystem) {
                        return (
                            <div key={msg.id} className="flex justify-center my-6">
                                <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-[var(--muted)] text-center max-w-sm">
                                    {msg.text}
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div
                            key={msg.id}
                            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm ${isMe
                                    ? "bg-white text-black rounded-tr-sm"
                                    : "bg-[#27272a] text-white border border-white/5 rounded-tl-sm"
                                    }`}
                            >
                                <p>{msg.text}</p>
                                <p
                                    className={`mt-1.5 text-[10px] uppercase tracking-wider font-semibold ${isMe ? "text-black/40" : "text-white/30"
                                        }`}
                                >
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-white/5 bg-[#18181b] p-4">
                {/* Conversation Starters (only show if no user messages yet, or just always for simplicity?) */}
                {/* Let's show them if 0 user messages or just 1 system message */}
                {messages.filter(m => m.type !== "system").length === 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar mb-1">
                        {CONVERSATION_STARTERS.map((starter) => (
                            <button
                                key={starter}
                                onClick={() => handleStarterClick(starter)}
                                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-white/70 transition-colors"
                            >
                                {starter}
                            </button>
                        ))}
                    </div>
                )}

                <form onSubmit={handleSend} className="flex gap-3 items-end">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 rounded-2xl bg-white/5 px-4 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim()}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-0.5"
                        >
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
}


