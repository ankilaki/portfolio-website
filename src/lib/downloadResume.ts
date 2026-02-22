import type { Resume } from "@/types";
import { getGoogleDocExportPdfUrl } from "./googleDocs";

function getDownloadUrl(resume: Resume): string {
  if (resume.sourceType === "google-doc") {
    return getGoogleDocExportPdfUrl(resume.fileUrl) ?? resume.fileUrl;
  }
  return resume.fileUrl;
}

function buildFilename(resume: Resume): string {
  return `Ankith Lakshman's Resume - ${resume.domain}.pdf`;
}

export async function downloadResume(resume: Resume): Promise<void> {
  const url = getDownloadUrl(resume);
  const filename = buildFilename(resume);

  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);
  } catch {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}
