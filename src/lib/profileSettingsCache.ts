import type { SiteSettings } from "@/types";

const CACHE_KEY = "portfolio-site-profile-settings-v1";

type CachedProfileSettings = Pick<
  SiteSettings,
  | "profilePictureUrl"
  | "profilePicturePositionX"
  | "profilePicturePositionY"
  | "faviconUrl"
>;

export function readCachedProfileSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as SiteSettings;
  } catch {
    return {};
  }
}

export function writeCachedProfileSettings(settings: SiteSettings): void {
  const cached: CachedProfileSettings = {
    profilePictureUrl: settings.profilePictureUrl,
    profilePicturePositionX: settings.profilePicturePositionX,
    profilePicturePositionY: settings.profilePicturePositionY,
    faviconUrl: settings.faviconUrl,
  };

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
  } catch {
    // Ignore quota or private-mode errors.
  }
}

export function preloadProfileImage(url: string): void {
  const img = new Image();
  img.src = url;
}
