import { clsx } from "clsx";

interface LogoProps {
    className?: string;
    size?: number;
}

export function Logo({ className, size = 24 }: LogoProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={clsx("text-accent", className)}
        >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
    );
}

export function LogoWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={clsx("relative flex items-center justify-center rounded-3xl bg-[rgba(139,92,246,0.1)] shadow-[0_0_40px_-10px_rgba(139,92,246,0.5)]", className)}>
            {children}
        </div>
    );
}
