import { clsx } from "clsx";

interface VouchWordmarkProps {
    className?: string;
    size?: "sm" | "md" | "lg" | "xl" | "2xl";
    style?: React.CSSProperties;
}

export function VouchWordmark({ className, size = "md", style }: VouchWordmarkProps) {
    const sizeClasses = {
        sm: "text-lg",
        md: "text-2xl",
        lg: "text-4xl",
        xl: "text-5xl",
        "2xl": "text-6xl"
    };

    return (
        <span
            className={clsx(
                "font-brand tracking-tight leading-none",
                sizeClasses[size],
                className
            )}
            style={{
                // Ensure nice letter spacing for the brand font
                letterSpacing: "-0.03em",
                ...style
            }}
        >
            Vouch
        </span>
    );
}
