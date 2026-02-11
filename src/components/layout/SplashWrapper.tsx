"use client";

import { useTheme } from "@/lib/auth/ThemeProvider";
import SplashOverlay from "./SplashOverlay";

export default function SplashWrapper() {
    const { splashState } = useTheme();

    return <SplashOverlay open={splashState.open} theme={splashState.theme} />;
}
