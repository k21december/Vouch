"use client";

import { useEffect } from "react";
import { useTheme } from "@/lib/auth/ThemeProvider";

export default function ThemeManager() {
    const { role } = useTheme();

    useEffect(() => {
        // Apply role as data-role attribute
        document.documentElement.setAttribute("data-role", role);
        document.body.setAttribute("data-role", role);

        // Also keep data-theme for backward compatibility with existing styles
        document.documentElement.setAttribute("data-theme", role);
        document.body.setAttribute("data-theme", role);

        // Remove old class if present (cleanup)
        document.body.classList.remove("theme-teal");
    }, [role]);

    return null;
}
