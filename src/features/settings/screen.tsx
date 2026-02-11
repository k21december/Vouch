"use client";

import { useState, useEffect } from "react";
import SettingsSection from "./components/SettingsSection";
import ToggleRow from "./components/ToggleRow";
import { useTheme } from "@/lib/auth/ThemeProvider";
import { supabase } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/database.types";

type ProfileSettings = {
  notifications: boolean;
  email_updates: boolean;
  profile_visible: boolean;
};

export default function SettingsScreen() {
  const { role, switchRoleWithSplash } = useTheme();

  // Local state for optimistic updates
  // Default to server defaults
  const [settings, setSettings] = useState<ProfileSettings>({
    notifications: true,
    email_updates: false,
    profile_visible: true
  });

  const [loading, setLoading] = useState(true);

  // Fetch from Supabase on mount
  useEffect(() => {
    async function loadSettings() {
      if (!supabase) { setLoading(false); return; }
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from("profiles")
          .select("settings, role")
          .eq("id", user.id)
          .single();

        if (data) {
          const dbSettings = data.settings as unknown as ProfileSettings;
          if (dbSettings) {
            setSettings({
              notifications: dbSettings.notifications ?? true,
              email_updates: dbSettings.email_updates ?? false,
              profile_visible: dbSettings.profile_visible ?? true
            });
          }
        }
      } catch (err) {
        console.error("Error loading settings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const updateSetting = async (key: keyof ProfileSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").update({
          settings: newSettings as unknown as Database["public"]["Tables"]["profiles"]["Update"]["settings"]
        }).eq("id", user.id);
      }
    }
  };

  const handleRoleToggle = async () => {
    const nextRole = role === "candidate" ? "referrer" : "candidate";
    switchRoleWithSplash(nextRole);

    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").update({ role: nextRole }).eq("id", user.id);
      }
    }
  };

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    localStorage.removeItem("vouch.auth");
    localStorage.removeItem("vouch.session");
    window.location.href = "/";
  };

  return (
    <div className="min-h-[calc(100dvh-96px)] w-full">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-white flex items-center justify-between">
          <span>Settings</span>
          {loading && <span className="text-sm font-normal text-gray-500 animate-pulse">Syncing...</span>}
        </h1>

        <SettingsSection title="Mode">
          <div className="flex items-center justify-between p-4">
            <div className="flex flex-col gap-1">
              <span className="text-base font-medium text-white">Referrer Mode</span>
              <span className="text-sm text-[var(--muted)]">Switch between finding jobs and finding candidates</span>
            </div>
            <button
              onClick={handleRoleToggle}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${role === "referrer" ? "bg-[rgb(var(--accent))]" : "bg-white/10"
                }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${role === "referrer" ? "translate-x-6" : "translate-x-1"
                  }`}
              />
            </button>
          </div>
        </SettingsSection>

        <SettingsSection title="Preferences">
          <ToggleRow
            label="Push Notifications"
            description="Receive alerts for new matches and messages"
            value={settings.notifications}
            onChange={(v) => updateSetting("notifications", v)}
          />
          <ToggleRow
            label="Email Updates"
            description="Weekly digest of profile activity"
            value={settings.email_updates}
            onChange={(v) => updateSetting("email_updates", v)}
            isLast={true}
          />
        </SettingsSection>

        <SettingsSection title="Privacy">
          <ToggleRow
            label="Profile Visibility"
            description="Allow recruiters to find you in Discover"
            value={settings.profile_visible}
            onChange={(v) => updateSetting("profile_visible", v)}
            isLast={true}
          />
        </SettingsSection>

        <SettingsSection title="Account">
          <div className="p-5">
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-red-500 hover:text-red-400 transition-colors"
            >
              Log Out
            </button>
          </div>
        </SettingsSection>

        <div className="text-center text-xs text-[var(--muted)] opacity-50">
          Version 0.1.0 (Beta)
        </div>
      </div>
    </div>
  );
}
