"use client";

interface ToggleRowProps {
    label: string;
    description?: string;
    value: boolean;
    onChange: (newValue: boolean) => void;
    isLast?: boolean;
}

export default function ToggleRow({
    label,
    description,
    value,
    onChange,
    isLast,
}: ToggleRowProps) {
    return (
        <div
            className={`flex items-center justify-between p-5 ${!isLast ? "border-b border-white/5" : ""
                }`}
        >
            <div>
                <div className="text-base font-medium text-white">{label}</div>
                {description && (
                    <div className="mt-1 text-sm text-[var(--muted)]">{description}</div>
                )}
            </div>

            <button
                onClick={() => onChange(!value)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${value ? "bg-[rgb(var(--accent))]" : "bg-white/10"
                    }`}
            >
                <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${value ? "translate-x-6" : "translate-x-1"
                        }`}
                />
            </button>
        </div>
    );
}
