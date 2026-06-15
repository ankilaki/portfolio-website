import { useEffect } from "react";
import { useSiteSettings } from "@/hooks/useFirestore";
import {
  DEFAULT_PROFILE_SRC,
  getProfilePictureUrl,
  getProfilePosition,
} from "@/lib/profilePicture";
import { generateFaviconDataUrl, setFavicon } from "@/lib/favicon";

const DEFAULT_FAVICON = "/favicon.png";

export function useProfileFavicon() {
  const { settings, loading } = useSiteSettings();

  useEffect(() => {
    const src = getProfilePictureUrl(settings, loading);
    if (!src) return;
    const position = getProfilePosition(settings);
    let cancelled = false;

    (async () => {
      if (settings.faviconUrl) {
        setFavicon(settings.faviconUrl);
        return;
      }

      const dataUrl = await generateFaviconDataUrl(
        src,
        position.x,
        position.y,
      );

      if (cancelled) return;

      if (dataUrl) {
        setFavicon(dataUrl);
      } else if (settings.profilePictureUrl) {
        setFavicon(settings.profilePictureUrl);
      } else {
        setFavicon(DEFAULT_FAVICON);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    loading,
    settings.profilePictureUrl,
    settings.profilePicturePositionX,
    settings.profilePicturePositionY,
    settings.faviconUrl,
  ]);
}
