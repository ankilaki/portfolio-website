const URL_SPLIT_RE = /\r?\n|,\s*/;
const URL_EXTRACT_RE = /https?:\/\/[^\s,]+/gi;

function cleanUrl(url: string): string {
  const trimmed = url.trim().replace(/[,\s]+$/, "");
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function splitUrlInput(value: string): string[] {
  const extracted = value.match(URL_EXTRACT_RE);
  if (extracted?.length) {
    return extracted.map((url) => url.trim()).filter(Boolean);
  }

  return value
    .split(URL_SPLIT_RE)
    .map((url) => url.trim())
    .filter(Boolean);
}

/** Normalize GitHub URLs from Firestore or admin form input. */
export function normalizeGithubUrls(value: unknown): string[] {
  if (!value) return [];

  if (typeof value === "string") {
    return splitUrlInput(value).map(cleanUrl).filter(Boolean);
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => {
      if (typeof item !== "string") return [];
      return splitUrlInput(item).map(cleanUrl).filter(Boolean);
    });
  }

  return [];
}

export function formatGithubUrlsForInput(value: unknown): string {
  return normalizeGithubUrls(value).join("\n");
}

export function parseGithubUrlsInput(input: string): string[] {
  return normalizeGithubUrls(input);
}

export function getGithubRepoLabel(url: string): string {
  try {
    const pathname = new URL(url).pathname.replace(/^\/+|\/+$/g, "");
    const [owner, repo] = pathname.split("/");
    if (owner && repo) return `${owner}/${repo}`;
    return pathname || url;
  } catch {
    return url;
  }
}
