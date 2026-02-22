/**
 * Utilities for working with public Google Doc URLs.
 *
 * Supported input formats:
 *   https://docs.google.com/document/d/{ID}/edit?usp=sharing
 *   https://docs.google.com/document/d/{ID}/preview
 *   https://docs.google.com/document/d/{ID}/pub
 *   https://docs.google.com/document/d/{ID}
 */

const DOC_ID_RE = /\/document\/d\/([a-zA-Z0-9_-]+)/;

export function extractGoogleDocId(url: string): string | null {
  const match = url.match(DOC_ID_RE);
  return match ? match[1] : null;
}

export function getGoogleDocPreviewUrl(url: string): string | null {
  const id = extractGoogleDocId(url);
  if (!id) return null;
  return `https://docs.google.com/document/d/${id}/preview`;
}

export function getGoogleDocExportPdfUrl(url: string): string | null {
  const id = extractGoogleDocId(url);
  if (!id) return null;
  return `https://docs.google.com/document/d/${id}/export?format=pdf`;
}
