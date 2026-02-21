import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  where,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Project, Resume } from "@/types";

export function useProjects(featuredOnly = false) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];
    if (featuredOnly) {
      constraints.unshift(where("featured", "==", true));
    }
    const q = query(collection(db, "projects"), ...constraints);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as Project
      );
      if (featuredOnly) {
        data.sort((a, b) => a.featuredOrder - b.featuredOrder);
      }
      setProjects(data);
      setLoading(false);
    }, () => {
      setLoading(false);
    });
    return unsubscribe;
  }, [featuredOnly]);

  return { projects, loading };
}

export function useProject(id: string | undefined) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !db) {
      setLoading(false);
      return;
    }
    getDoc(doc(db, "projects", id)).then((snap) => {
      if (snap.exists()) {
        setProject({ id: snap.id, ...snap.data() } as Project);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  return { project, loading };
}

export function useResumes() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    const q = query(collection(db, "resumes"), orderBy("updatedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as Resume
      );
      setResumes(data);
      setLoading(false);
    }, () => {
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { resumes, loading };
}

export async function addProject(
  project: Omit<Project, "id">
): Promise<string> {
  if (!db) throw new Error("Firebase not configured");
  const docRef = await addDoc(collection(db, "projects"), project);
  return docRef.id;
}

export async function updateProject(
  id: string,
  data: Partial<Project>
): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await updateDoc(doc(db, "projects", id), data);
}

export async function deleteProject(id: string): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await deleteDoc(doc(db, "projects", id));
}

export async function addResume(
  resume: Omit<Resume, "id">
): Promise<string> {
  if (!db) throw new Error("Firebase not configured");
  const docRef = await addDoc(collection(db, "resumes"), resume);
  return docRef.id;
}

export async function updateResume(
  id: string,
  data: Partial<Resume>
): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await updateDoc(doc(db, "resumes", id), data);
}

export async function deleteResume(id: string): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await deleteDoc(doc(db, "resumes", id));
}
