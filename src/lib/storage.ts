import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./firebase";
import { generateFaviconBlob, generateFaviconDataUrl } from "./favicon";

export async function uploadFile(
  file: File | Blob,
  path: string
): Promise<string> {
  if (!storage) throw new Error("Firebase Storage not configured");
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function deleteFile(path: string): Promise<void> {
  if (!storage) throw new Error("Firebase Storage not configured");
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}

export function getStoragePath(folder: string, fileName: string): string {
  const timestamp = Date.now();
  const sanitized = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  return `${folder}/${timestamp}_${sanitized}`;
}

export const PROFILE_FAVICON_PATH = "profile/favicon.png";

export async function uploadProfileFavicon(
  source: File | string,
  posX: number,
  posY: number,
): Promise<string | null> {
  let blob: Blob | null = null;
  if (typeof source === "string") {
    const dataUrl = await generateFaviconDataUrl(source, posX, posY);
    if (dataUrl) {
      blob = await fetch(dataUrl).then((response) => response.blob());
    }
  } else {
    blob = await generateFaviconBlob(source, posX, posY);
  }

  if (!blob) return null;
  return uploadFile(blob, PROFILE_FAVICON_PATH);
}
