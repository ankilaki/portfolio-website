import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Star,
  StarOff,
  Upload,
  X,
  Lock,
  FolderOpen,
  FileText,
  GripVertical,
  Save,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  User,
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import {
  useProjects,
  useResumes,
  addProject,
  updateProject,
  deleteProject,
  addResume,
  updateResume,
  deleteResume,
  useSiteSettings,
  updateSiteSettings,
} from "@/hooks/useFirestore";
import { uploadFile, getStoragePath, uploadProfileFavicon } from "@/lib/storage";
import LoadingSpinner from "@/components/LoadingSpinner";
import { extractGoogleDocId } from "@/lib/googleDocs";
import {
  formatGithubUrlsForInput,
  parseGithubUrlsInput,
} from "@/lib/githubUrls";
import {
  DEFAULT_PROFILE_POSITION,
  getProfilePosition,
} from "@/lib/profilePicture";
import ProfilePictureFrame from "@/components/ProfilePictureFrame";
import type { Project, Resume, MediaItem, ResumeDomain, ResumeSourceType } from "@/types";

const RESUME_DOMAINS: ResumeDomain[] = [
  "Robotics",
  "AI / Machine Learning",
  "Embedded / Devices",
  "Software Engineering",
  "General",
];

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-bg-input border border-border focus:border-accent/50 focus:ring-1 focus:ring-accent/20 outline-none text-sm text-text transition-all placeholder:text-text-muted";

function firebaseErrorMessage(err: unknown, fallback: string): string {
  const code = (err as { code?: string })?.code;
  if (code === "permission-denied" || code === "storage/unauthorized") {
    return "Permission denied. Sign in again or check Firebase security rules.";
  }
  if (code === "storage/unauthenticated") {
    return "You must be signed in to upload files.";
  }
  if (code === "storage/canceled") {
    return "Upload was canceled.";
  }
  if (code === "storage/quota-exceeded") {
    return "Storage quota exceeded.";
  }
  const message = (err as { message?: string })?.message;
  return message || fallback;
}

function isImageFile(file: File): boolean {
  if (file.type.startsWith("image/")) return true;
  return /\.(jpe?g|png|gif|webp|bmp|svg|avif|heic|heif)$/i.test(file.name);
}

export default function Admin() {
  const { loading: authLoading, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<"projects" | "resumes" | "site">("projects");

  if (authLoading) {
    return (
      <div className="min-h-screen pt-24 bg-bg">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAdmin) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 bg-bg">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-text">Admin Panel</h1>
          <button
            onClick={() => auth && signOut(auth)}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl border border-border hover:border-accent/30 hover:text-accent transition-all duration-200 text-text-secondary"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>

        <div className="flex gap-2 mb-10">
          {(["projects", "resumes", "site"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === tab
                  ? "bg-accent text-text-inverse"
                  : "border border-border text-text-secondary hover:text-accent hover:border-accent/30"
              }`}
            >
              {tab === "projects" ? (
                <span className="flex items-center gap-2">
                  <FolderOpen size={16} />
                  Projects
                </span>
              ) : tab === "resumes" ? (
                <span className="flex items-center gap-2">
                  <FileText size={16} />
                  Resumes
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <User size={16} />
                  Site
                </span>
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "projects" ? (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ProjectsManager />
            </motion.div>
          ) : activeTab === "resumes" ? (
            <motion.div
              key="resumes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ResumesManager />
            </motion.div>
          ) : (
            <motion.div
              key="site"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <SiteSettingsManager />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Login Form ─── */

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!auth) throw new Error("Firebase not configured — check .env file and restart dev server");
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      const msg = err?.code === "auth/invalid-credential"
        ? "Invalid email or password."
        : err?.code === "auth/too-many-requests"
        ? "Too many attempts. Try again later."
        : err?.message || "Login failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-bg">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleLogin}
        className="w-full max-w-sm rounded-2xl border border-border bg-bg-card p-8"
      >
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-accent-muted mx-auto mb-6">
          <Lock size={24} className="text-accent" />
        </div>
        <h2 className="text-xl font-bold text-center mb-6 text-text">Admin Access</h2>

        {error && (
          <p className="text-red-600 text-sm text-center mb-4 bg-red-50 p-3 rounded-xl border border-red-200">
            {error}
          </p>
        )}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-accent text-text-inverse rounded-xl font-medium text-sm hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}

/* ─── Site Settings Manager ─── */

function SiteSettingsManager() {
  const { settings, loading } = useSiteSettings();
  const [uploading, setUploading] = useState(false);
  const [savingPosition, setSavingPosition] = useState(false);
  const [error, setError] = useState("");
  const [position, setPosition] = useState(DEFAULT_PROFILE_POSITION);

  const profilePictureUrl = settings.profilePictureUrl ?? "/profile.png";
  const savedPosition = getProfilePosition(settings);
  const positionDirty =
    position.x !== savedPosition.x || position.y !== savedPosition.y;

  useEffect(() => {
    setPosition(getProfilePosition(settings));
  }, [settings.profilePicturePositionX, settings.profilePicturePositionY]);

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!isImageFile(file)) {
      setError("Please upload an image file.");
      return;
    }
    setError("");
    setUploading(true);
    try {
      const path = getStoragePath("profile", file.name);
      const url = await uploadFile(file, path);
      const resetPosition = { ...DEFAULT_PROFILE_POSITION };
      setPosition(resetPosition);
      const faviconUrl = await uploadProfileFavicon(
        file,
        resetPosition.x,
        resetPosition.y,
      );
      await updateSiteSettings({
        profilePictureUrl: url,
        profilePicturePositionX: resetPosition.x,
        profilePicturePositionY: resetPosition.y,
        ...(faviconUrl ? { faviconUrl } : {}),
      });
    } catch (err) {
      console.error("Profile upload failed:", err);
      setError(firebaseErrorMessage(err, "Upload failed. Please try again."));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSavePosition = async () => {
    setSavingPosition(true);
    setError("");
    try {
      const faviconUrl = await uploadProfileFavicon(
        profilePictureUrl,
        position.x,
        position.y,
      );
      await updateSiteSettings({
        profilePicturePositionX: position.x,
        profilePicturePositionY: position.y,
        ...(faviconUrl ? { faviconUrl } : {}),
      });
    } catch (err) {
      console.error("Position save failed:", err);
      setError(firebaseErrorMessage(err, "Failed to save position."));
    } finally {
      setSavingPosition(false);
    }
  };

  const handleResetPosition = () => {
    setPosition({ ...DEFAULT_PROFILE_POSITION });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="text-xl font-semibold text-text mb-6">Site Settings</h2>

      <div className="rounded-2xl border border-border bg-bg-card p-6">
        <h3 className="text-sm font-medium text-text-secondary mb-4">Profile Picture</h3>
        <p className="text-sm text-text-muted mb-6">
          This image appears on the home page hero section. Drag the photo to center your face in the circle.
        </p>

        <div className="flex flex-col lg:flex-row items-start gap-8">
          <div className="relative flex-shrink-0 mx-auto lg:mx-0">
            <ProfilePictureFrame
              src={profilePictureUrl}
              alt="Profile preview"
              positionX={position.x}
              positionY={position.y}
              editable
              onPositionChange={(x, y) => setPosition({ x, y })}
              className="w-44 h-44"
            />
            <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-accent border-2 border-bg-card pointer-events-none" />
          </div>

          <div className="flex-1 w-full space-y-5">
            <label className="flex items-center gap-2 px-4 py-2.5 bg-accent text-text-inverse rounded-xl text-sm font-medium hover:bg-accent-hover transition-colors cursor-pointer w-fit">
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileUpload}
                className="hidden"
                disabled={uploading}
              />
              {uploading ? (
                <>
                  <LoadingSpinner />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Change Photo
                </>
              )}
            </label>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-text-secondary">Horizontal</label>
                  <span className="text-xs text-text-muted">{Math.round(position.x)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={position.x}
                  onChange={(e) =>
                    setPosition((prev) => ({ ...prev, x: Number(e.target.value) }))
                  }
                  className="w-full accent-accent"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-text-secondary">Vertical</label>
                  <span className="text-xs text-text-muted">{Math.round(position.y)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={position.y}
                  onChange={(e) =>
                    setPosition((prev) => ({ ...prev, y: Number(e.target.value) }))
                  }
                  className="w-full accent-accent"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleSavePosition}
                disabled={!positionDirty || savingPosition}
                className="flex items-center gap-2 px-4 py-2.5 bg-accent text-text-inverse rounded-xl text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
              >
                <Save size={16} />
                {savingPosition ? "Saving..." : "Save Position"}
              </button>
              <button
                onClick={handleResetPosition}
                disabled={!positionDirty}
                className="px-4 py-2.5 rounded-xl text-sm font-medium border border-border text-text-secondary hover:border-accent/30 hover:text-accent transition-colors disabled:opacity-50"
              >
                Reset
              </button>
            </div>

            {!settings.profilePictureUrl && (
              <p className="text-xs text-text-muted">
                Using default image from <code className="text-text-secondary">/profile.png</code>
              </p>
            )}
            {error && (
              <p className="text-red-500 text-xs">{error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Projects Manager ─── */

function ProjectsManager() {
  const { projects, loading } = useProjects(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text">
          Projects ({projects.length})
        </h2>
        <button
          onClick={() => {
            setCreating(true);
            setEditing(null);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent text-text-inverse rounded-xl text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          <Plus size={16} />
          New Project
        </button>
      </div>

      <AnimatePresence>
        {(creating || editing) && (
          <ProjectForm
            project={editing}
            onClose={() => {
              setEditing(null);
              setCreating(false);
            }}
          />
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            layout
            className="rounded-xl border border-border bg-bg-card p-4 flex items-center gap-4"
          >
            <GripVertical size={16} className="text-text-muted flex-shrink-0" />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-text truncate">{project.title}</h3>
                {project.featured && (
                  <span className="px-2 py-0.5 text-xs bg-amber-50 text-amber-600 rounded-lg font-medium border border-amber-200">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-sm text-text-muted truncate mt-0.5">
                {project.shortDescription}
              </p>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() =>
                  updateProject(project.id, {
                    featured: !project.featured,
                    featuredOrder: project.featured
                      ? 0
                      : projects.filter((p) => p.featured).length,
                  })
                }
                className="p-2 rounded-lg hover:bg-accent-glow transition-colors"
                title={project.featured ? "Unfeature" : "Feature"}
              >
                {project.featured ? (
                  <Star size={16} className="text-amber-500 fill-amber-500" />
                ) : (
                  <StarOff size={16} className="text-text-muted" />
                )}
              </button>
              <button
                onClick={() => {
                  setEditing(project);
                  setCreating(false);
                }}
                className="p-2 rounded-lg hover:bg-accent-glow transition-colors"
              >
                <Pencil size={16} className="text-text-secondary" />
              </button>
              <button
                onClick={() => {
                  if (confirm("Delete this project?")) {
                    deleteProject(project.id);
                  }
                }}
                className="p-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 size={16} className="text-red-400" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Project Form ─── */

function ProjectForm({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: project?.title ?? "",
    shortDescription: project?.shortDescription ?? "",
    description: project?.description ?? "",
    githubUrls: formatGithubUrlsForInput(
      project?.githubUrls ??
        (project as Project & { githubUrl?: string })?.githubUrl,
    ),
    liveUrl: project?.liveUrl ?? "",
    tags: project?.tags?.join(", ") ?? "",
    technologies: project?.technologies?.join(", ") ?? "",
    featured: project?.featured ?? false,
    featuredOrder: project?.featuredOrder ?? 0,
  });
  const [media, setMedia] = useState<MediaItem[]>(project?.media ?? []);
  const [thumbnailIndex, setThumbnailIndex] = useState<number>(project?.thumbnailIndex ?? 0);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploadingMedia(true);
    try {
      const newMedia: MediaItem[] = [];
      for (const file of Array.from(files)) {
        const path = getStoragePath("projects", file.name);
        const url = await uploadFile(file, path);
        const type = file.type.startsWith("video/") ? "video" : "image";
        newMedia.push({ type, url });
      }
      setMedia([...media, ...newMedia]);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const data = {
      title: form.title.trim(),
      shortDescription: form.shortDescription.trim(),
      description: form.description.trim(),
      githubUrls: parseGithubUrlsInput(form.githubUrls),
      liveUrl: form.liveUrl.trim(),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      technologies: form.technologies.split(",").map((t) => t.trim()).filter(Boolean),
      featured: form.featured,
      featuredOrder: form.featuredOrder,
      media,
      thumbnailIndex,
      updatedAt: Date.now(),
    };
    try {
      if (project) {
        await updateProject(project.id, data);
      } else {
        await addProject({ ...data, createdAt: Date.now() });
      }
      onClose();
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden mb-6"
    >
      <div className="rounded-2xl border border-border bg-bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg text-text">
            {project ? "Edit Project" : "New Project"}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-glass-hover transition-colors">
            <X size={18} className="text-text-muted" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Project Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
          <input placeholder="Short Description" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className={inputClass} />
          <textarea placeholder={"GitHub URLs (one per line)\nhttps://github.com/user/repo1\nhttps://github.com/user/repo2"} value={form.githubUrls} onChange={(e) => setForm({ ...form, githubUrls: e.target.value })} rows={3} className={`${inputClass} resize-none`} />
          <input placeholder="Live Demo URL (optional)" value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} className={inputClass} />
          <input placeholder="Tags (comma separated): robotics, ai, cv" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className={inputClass} />
          <input placeholder="Technologies (comma separated): React, Python, ROS" value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} className={inputClass} />
        </div>

        <textarea
          placeholder="Full project description..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={5}
          className={`${inputClass} resize-none`}
        />

        {/* Media */}
        <div>
          <label className="text-sm font-medium text-text-secondary mb-2 block">
            Media (Images & Videos) — drag order determines carousel order
          </label>
          <div className="flex flex-wrap gap-3">
            {media.map((item, i) => (
              <div
                key={`${item.url}-${i}`}
                className={`relative group w-28 h-28 rounded-xl overflow-hidden bg-bg-elevated border-2 transition-colors ${
                  thumbnailIndex === i ? "border-accent" : "border-border"
                }`}
              >
                {item.type === "image" ? (
                  <img src={item.url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <video src={item.url} className="w-full h-full object-cover" />
                )}

                {/* Thumbnail badge */}
                {thumbnailIndex === i && (
                  <span className="absolute top-1 left-1 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-accent text-white text-[10px] font-bold">
                    <ImageIcon size={9} />
                    Card
                  </span>
                )}

                {/* Position badge (only when not thumbnail) */}
                {thumbnailIndex !== i && (
                  <span className="absolute top-1 left-1 w-5 h-5 rounded-md bg-black/60 text-white text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                )}

                {/* Overlay controls on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        if (i === 0) return;
                        const next = [...media];
                        [next[i - 1], next[i]] = [next[i], next[i - 1]];
                        if (thumbnailIndex === i) setThumbnailIndex(i - 1);
                        else if (thumbnailIndex === i - 1) setThumbnailIndex(i);
                        setMedia(next);
                      }}
                      disabled={i === 0}
                      className="p-1 rounded-md bg-white/20 hover:bg-white/40 disabled:opacity-30 transition-colors"
                      title="Move left"
                    >
                      <ChevronLeft size={14} className="text-white" />
                    </button>
                    <button
                      onClick={() => {
                        if (i === media.length - 1) return;
                        const next = [...media];
                        [next[i], next[i + 1]] = [next[i + 1], next[i]];
                        if (thumbnailIndex === i) setThumbnailIndex(i + 1);
                        else if (thumbnailIndex === i + 1) setThumbnailIndex(i);
                        setMedia(next);
                      }}
                      disabled={i === media.length - 1}
                      className="p-1 rounded-md bg-white/20 hover:bg-white/40 disabled:opacity-30 transition-colors"
                      title="Move right"
                    >
                      <ChevronRight size={14} className="text-white" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    {thumbnailIndex !== i && (
                      <button
                        onClick={() => setThumbnailIndex(i)}
                        className="p-1 rounded-md bg-accent/80 hover:bg-accent transition-colors"
                        title="Set as card thumbnail"
                      >
                        <ImageIcon size={14} className="text-white" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setMedia(media.filter((_, idx) => idx !== i));
                        if (thumbnailIndex >= i && thumbnailIndex > 0) {
                          setThumbnailIndex(thumbnailIndex - 1);
                        }
                      }}
                      className="p-1 rounded-md bg-red-500/80 hover:bg-red-500 transition-colors"
                      title="Remove"
                    >
                      <X size={14} className="text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <label className="w-28 h-28 rounded-xl border-2 border-dashed border-border hover:border-accent/30 cursor-pointer flex items-center justify-center transition-colors">
              <input type="file" multiple accept="image/*,video/*" onChange={handleMediaUpload} className="hidden" />
              {uploadingMedia ? <LoadingSpinner /> : <Upload size={20} className="text-text-muted" />}
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer text-text-secondary">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="rounded accent-accent"
            />
            Featured on homepage
          </label>

          <button
            onClick={handleSave}
            disabled={saving || !form.title}
            className="flex items-center gap-2 px-6 py-2.5 bg-accent text-text-inverse rounded-xl text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Saving..." : project ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Resumes Manager ─── */

function ResumesManager() {
  const { resumes, loading } = useResumes();
  const [editing, setEditing] = useState<Resume | null>(null);
  const [creating, setCreating] = useState(false);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text">
          Resumes ({resumes.length})
        </h2>
        <button
          onClick={() => {
            setCreating(true);
            setEditing(null);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent text-text-inverse rounded-xl text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          <Plus size={16} />
          New Resume
        </button>
      </div>

      <AnimatePresence>
        {(creating || editing) && (
          <ResumeForm
            resume={editing}
            onClose={() => {
              setEditing(null);
              setCreating(false);
            }}
          />
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {resumes.map((resume) => (
          <motion.div
            key={resume.id}
            layout
            className="rounded-xl border border-border bg-bg-card p-4 flex items-center gap-4"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-text truncate">{resume.title}</h3>
                <span className={`px-2 py-0.5 text-xs rounded-lg font-medium border ${
                  resume.sourceType === "google-doc"
                    ? "bg-blue-50 text-blue-600 border-blue-200"
                    : "bg-emerald-50 text-emerald-600 border-emerald-200"
                }`}>
                  {resume.sourceType === "google-doc" ? "Google Doc" : "PDF"}
                </span>
              </div>
              <p className="text-sm text-text-muted mt-0.5 truncate">
                {resume.domain} &middot; {resume.sourceType === "google-doc" ? "Linked document" : resume.fileName}
              </p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => {
                  setEditing(resume);
                  setCreating(false);
                }}
                className="p-2 rounded-lg hover:bg-accent-glow transition-colors"
              >
                <Pencil size={16} className="text-text-secondary" />
              </button>
              <button
                onClick={() => {
                  if (confirm("Delete this resume?")) {
                    deleteResume(resume.id);
                  }
                }}
                className="p-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 size={16} className="text-red-400" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Resume Form ─── */

function ResumeForm({
  resume,
  onClose,
}: {
  resume: Resume | null;
  onClose: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sourceType, setSourceType] = useState<ResumeSourceType>(
    resume?.sourceType ?? "pdf"
  );
  const [form, setForm] = useState({
    title: resume?.title ?? "",
    domain: resume?.domain ?? ("General" as ResumeDomain),
    description: resume?.description ?? "",
    fileUrl: resume?.fileUrl ?? "",
    fileName: resume?.fileName ?? "",
  });
  const [googleDocUrl, setGoogleDocUrl] = useState(
    resume?.sourceType === "google-doc" ? resume.fileUrl : ""
  );
  const [googleDocError, setGoogleDocError] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const path = getStoragePath("resumes", file.name);
      const url = await uploadFile(file, path);
      setForm({ ...form, fileUrl: url, fileName: file.name });
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleGoogleDocUrlChange = (url: string) => {
    setGoogleDocUrl(url);
    setGoogleDocError("");
    if (url.trim() && !extractGoogleDocId(url.trim())) {
      setGoogleDocError("Could not extract a valid Google Doc ID from this URL.");
    }
  };

  const handleSave = async () => {
    setSaving(true);

    let fileUrl = form.fileUrl;
    let fileName = form.fileName;

    if (sourceType === "google-doc") {
      const trimmed = googleDocUrl.trim();
      if (!extractGoogleDocId(trimmed)) {
        setGoogleDocError("Invalid Google Doc URL.");
        setSaving(false);
        return;
      }
      fileUrl = trimmed;
      fileName = form.title.trim() || "Google Doc";
    }

    const data = {
      title: form.title.trim(),
      domain: form.domain,
      description: form.description.trim(),
      sourceType,
      fileUrl,
      fileName,
      updatedAt: Date.now(),
    };
    try {
      if (resume) {
        await updateResume(resume.id, data);
      } else {
        await addResume(data);
      }
      onClose();
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const isSaveDisabled =
    saving ||
    !form.title ||
    (sourceType === "pdf" && !form.fileUrl) ||
    (sourceType === "google-doc" && (!googleDocUrl.trim() || !!googleDocError));

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden mb-6"
    >
      <div className="rounded-2xl border border-border bg-bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg text-text">
            {resume ? "Edit Resume" : "New Resume"}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-glass-hover transition-colors">
            <X size={18} className="text-text-muted" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Resume Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
          <select
            value={form.domain}
            onChange={(e) => setForm({ ...form, domain: e.target.value as ResumeDomain })}
            className={inputClass}
          >
            {RESUME_DOMAINS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <textarea
          placeholder="Brief description of this resume variant..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          className={`${inputClass} resize-none`}
        />

        {/* Source type toggle */}
        <div>
          <label className="text-sm font-medium text-text-secondary mb-2 block">Source Type</label>
          <div className="flex gap-2">
            {(["pdf", "google-doc"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSourceType(type)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  sourceType === type
                    ? "bg-accent text-text-inverse"
                    : "border border-border text-text-secondary hover:text-accent hover:border-accent/30"
                }`}
              >
                {type === "pdf" ? "Upload PDF" : "Google Doc Link"}
              </button>
            ))}
          </div>
        </div>

        {sourceType === "pdf" ? (
          <div>
            <label className="text-sm font-medium text-text-secondary mb-2 block">PDF File</label>
            <div className="flex items-center gap-3">
              <label className="px-4 py-2.5 rounded-xl text-sm cursor-pointer border border-border hover:border-accent/30 hover:text-accent transition-all duration-200 flex items-center gap-2 text-text-secondary">
                <Upload size={16} />
                {uploading ? "Uploading..." : "Upload PDF"}
                <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
              </label>
              {form.fileName && (
                <span className="text-sm text-text-muted">{form.fileName}</span>
              )}
            </div>
          </div>
        ) : (
          <div>
            <label className="text-sm font-medium text-text-secondary mb-2 block">Google Doc URL</label>
            <input
              placeholder="https://docs.google.com/document/d/.../edit?usp=sharing"
              value={googleDocUrl}
              onChange={(e) => handleGoogleDocUrlChange(e.target.value)}
              className={inputClass}
            />
            {googleDocError && (
              <p className="text-red-500 text-xs mt-1.5">{googleDocError}</p>
            )}
            {googleDocUrl.trim() && !googleDocError && (
              <p className="text-emerald-600 text-xs mt-1.5">Valid Google Doc URL detected.</p>
            )}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            disabled={isSaveDisabled}
            className="flex items-center gap-2 px-6 py-2.5 bg-accent text-text-inverse rounded-xl text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Saving..." : resume ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
