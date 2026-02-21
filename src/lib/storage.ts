import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./firebase";

export async function uploadFile(
  file: File,
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
