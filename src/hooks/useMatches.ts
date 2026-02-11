import { useState, useEffect } from "react";
import { StorageService, EVENTS } from "@/lib/storage";
import { Match } from "@/types";
import { useRole } from "@/lib/auth/useRole";

export function useMatches() {
    const { role } = useRole();
    const [matches, setMatches] = useState<Match[]>([]);

    useEffect(() => {
        // Initial Load
        setMatches(StorageService.getMatchesList(role as "referrer" | "candidate"));

        // Listener
        const handleUpdate = () => {
            setMatches(StorageService.getMatchesList(role as "referrer" | "candidate"));
        };

        window.addEventListener("vouch:matches-changed", handleUpdate);
        window.addEventListener(EVENTS.MATCH_UPDATED, handleUpdate);

        return () => {
            window.removeEventListener("vouch:matches-changed", handleUpdate);
            window.removeEventListener(EVENTS.MATCH_UPDATED, handleUpdate);
        };
    }, [role]);

    return { matches };
}
