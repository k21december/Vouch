"use client";

import { useState, useRef, useCallback } from "react";
import { X } from "lucide-react";

interface TagInputProps {
    value: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    max?: number;
    accent?: "indigo" | "teal";
}

export default function TagInput({ value, onChange, placeholder = "Type and press Enter…", max = 25, accent = "indigo" }: TagInputProps) {
    const [input, setInput] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const accentClasses = accent === "teal"
        ? "bg-teal-500/10 border-teal-500/20 text-teal-300"
        : "bg-indigo-500/10 border-indigo-500/20 text-indigo-300";

    const addTag = useCallback((raw: string) => {
        const tag = raw.trim();
        if (!tag) return;
        if (value.includes(tag)) return;
        if (value.length >= max) return;
        onChange([...value, tag]);
    }, [value, onChange, max]);

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(input);
            setInput("");
        }
        if (e.key === "Backspace" && input === "" && value.length > 0) {
            onChange(value.slice(0, -1));
        }
    }

    function handlePaste(e: React.ClipboardEvent) {
        e.preventDefault();
        const text = e.clipboardData.getData("text");
        const tags = text.split(",").map(s => s.trim()).filter(Boolean);
        const newTags = [...value];
        for (const t of tags) {
            if (!newTags.includes(t) && newTags.length < max) newTags.push(t);
        }
        onChange(newTags);
    }

    return (
        <div
            onClick={() => inputRef.current?.focus()}
            className="flex flex-wrap gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08]
                       cursor-text transition-all duration-200
                       focus-within:border-white/20 focus-within:bg-white/[0.06] focus-within:ring-1 focus-within:ring-white/10
                       min-h-[42px]"
        >
            {value.map((tag) => (
                <span
                    key={tag}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-xs font-medium
                               transition-all duration-150 hover:brightness-110 ${accentClasses}`}
                >
                    {tag}
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onChange(value.filter(t => t !== tag)); }}
                        className="p-0 bg-transparent border-none cursor-pointer text-current opacity-50 hover:opacity-100 transition-opacity"
                    >
                        <X size={12} />
                    </button>
                </span>
            ))}
            <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                onBlur={() => { if (input.trim()) { addTag(input); setInput(""); } }}
                placeholder={value.length === 0 ? placeholder : ""}
                className="flex-1 min-w-[100px] bg-transparent border-none outline-none text-white text-sm placeholder:text-white/20"
            />
        </div>
    );
}
