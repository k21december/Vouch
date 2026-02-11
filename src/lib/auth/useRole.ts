import { useRouter } from "next/navigation";
import { useTheme } from "./ThemeProvider";

export function useRole() {
  const router = useRouter();
  // We use internal state for immediate checks, but sync with storage
  // Actually, we should initialize from storage.
  const { role, setRole, can, switchRoleWithSplash } = useTheme();

  function toggle() {
    const nextRole = role === "candidate" ? "referrer" : "candidate";
    const nextUserId = nextRole === "candidate" ? "candidate_1" : "referrer_1"; // Simple toggle for simulation

    // Persist session
    // We need to import StorageService dynamically or assume it's safe (client-only)
    // Since useRole is client-side hook
    import("@/lib/storage").then(({ StorageService }) => {
      StorageService.setSession({ userId: nextUserId, role: nextRole });
    });

    // Use switchRoleWithSplash for the transition
    switchRoleWithSplash(nextRole);

    // Navigate to the appropriate page after splash
    setTimeout(() => {
      router.push(nextRole === "referrer" ? "/requests" : "/matches");
    }, 550);
  }

  // Also, we might want a way to "force" set a user (for DevToolbar)
  const switchUser = (userId: string, targetRole: "candidate" | "referrer") => {
    import("@/lib/storage").then(({ StorageService }) => {
      StorageService.setSession({ userId, role: targetRole });
      setRole(targetRole);
      router.refresh(); // Force refresh to pick up new data? Or just route push.

      router.push(targetRole === "referrer" ? "/requests" : "/matches");
    });
  };

  return { role, setRole, toggleRole: toggle, can, switchUser };
}
