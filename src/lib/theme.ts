export type UserTheme = "navy" | "candidate" | "referrer";

export interface ThemeGradient {
    base: string;
    layers: string[];
    vignette: string;
}

// Shared subtle opacity values
const SUBTLE_GLOW_1 = "0.08";
const SUBTLE_GLOW_2 = "0.06";
const VIGNETTE_STRENGTH = "0.6";

export const themeMap: Record<UserTheme, ThemeGradient> = {
    // Logged OUT: Pure neutral dark base (Black + very faint indigo/purple hint)
    // Logged OUT: Navy Auth Theme (Deep Black + Navy Orbs)
    navy: {
        base: "#000000",
        layers: [
            // Layer 1: Linear base
            "linear-gradient(to bottom, #05070D 0%, #000000 100%)",
            // Layer 2: Top-left Navy Glow
            "radial-gradient(circle at 20% 25%, rgba(30,58,138,0.22) 0%, transparent 55%)",
            // Layer 3: Bottom-right Blue Glow
            "radial-gradient(circle at 75% 35%, rgba(29,78,216,0.14) 0%, transparent 60%)",
            // Layer 4: Bottom-center Navy Glow
            "radial-gradient(circle at 55% 80%, rgba(30,58,138,0.10) 0%, transparent 65%)",
            // Layer 5: Center darkened vignette
            "radial-gradient(circle at center, transparent 45%, rgba(0,0,0,0.75) 100%)",
        ],
        vignette:
            `radial-gradient(circle at center, transparent 50%, rgba(0,0,0,0.6) 100%)`,
    },

    // Candidate: Black base + slightly stronger Indigo accents
    candidate: {
        base: "#000000",
        layers: [
            "linear-gradient(to bottom, #05070D 0%, #000000 100%)",
            // Left orb (Indigo) - slightly more visible than base but still subtle
            `radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.12), transparent 60%)`,
            // Right orb (Violent)
            `radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.08), transparent 65%)`,
        ],
        vignette:
            `radial-gradient(circle at center, transparent 50%, rgba(0,0,0,${VIGNETTE_STRENGTH}) 100%)`,
    },

    // Referrer: Black base + slightly stronger Teal accents
    referrer: {
        base: "#000000",
        layers: [
            "linear-gradient(to bottom, #040f0d 0%, #000000 100%)",
            // Left orb (Teal)
            `radial-gradient(circle at 20% 30%, rgba(20, 184, 166, 0.12), transparent 60%)`,
            // Right orb (Emerald)
            `radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.08), transparent 65%)`,
        ],
        vignette:
            `radial-gradient(circle at center, transparent 50%, rgba(0,0,0,${VIGNETTE_STRENGTH}) 100%)`,
    },
};
