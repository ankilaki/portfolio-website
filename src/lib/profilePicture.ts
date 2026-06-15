import type { SiteSettings } from "@/types";

export const DEFAULT_PROFILE_SRC = "/profile.png";
export const DEFAULT_PROFILE_POSITION = { x: 50, y: 20 };

export function getProfilePictureUrl(
  settings: SiteSettings,
  loading: boolean,
): string | undefined {
  if (settings.profilePictureUrl) return settings.profilePictureUrl;
  if (loading) return undefined;
  return DEFAULT_PROFILE_SRC;
}

export function getProfilePosition(settings: SiteSettings = {}) {
  return {
    x: settings.profilePicturePositionX ?? DEFAULT_PROFILE_POSITION.x,
    y: settings.profilePicturePositionY ?? DEFAULT_PROFILE_POSITION.y,
  };
}

export function getProfileObjectPosition(settings: SiteSettings = {}) {
  const { x, y } = getProfilePosition(settings);
  return `${x}% ${y}%`;
}

export function clampProfilePosition(value: number) {
  return Math.min(100, Math.max(0, value));
}
