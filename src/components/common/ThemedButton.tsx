import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "neutral";

interface ThemedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    children: React.ReactNode;
}

export default function ThemedButton({
    variant = "primary",
    className = "",
    children,
    ...props
}: ThemedButtonProps) {
    const baseClasses = "btn-base";
    const variantClasses = {
        primary: "btn-primary",
        secondary: "btn-secondary",
        neutral: "btn-neutral",
    };

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${className}`.trim()}
            {...props}
        >
            {children}
        </button>
    );
}
