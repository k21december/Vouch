export type Role = "candidate" | "referrer";

export type Theme = Role | "navy";

export type Permission =
  | "view_discover"
  | "view_matches"
  | "view_portfolio"
  | "create_portfolio"
  | "post_job"
  | "edit_profile"
  | "view_settings";

export const DEFAULT_ROLE: Role = "candidate";
export const DEFAULT_THEME: Theme = "navy";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  candidate: [
    "view_discover",
    "view_matches",
    "view_portfolio",
    "create_portfolio",
    "edit_profile",
    "view_settings",
  ],
  referrer: [
    "view_discover",
    "view_matches",
    "view_portfolio",
    "post_job",
    "edit_profile",
    "view_settings",
  ],
};

export function hasPermission(role: Role, perm: Permission) {
  return ROLE_PERMISSIONS[role].includes(perm);
}
