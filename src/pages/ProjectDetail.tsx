import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Calendar,
  Tag,
} from "lucide-react";
import { useProject } from "@/hooks/useFirestore";
import LoadingSpinner from "@/components/LoadingSpinner";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export default function ProjectDetail() {
  const { id } = useParams();
  const { project, loading } = useProject(id);

  if (loading) {
    return (
      <div className="min-h-screen pt-24">
        <LoadingSpinner />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4">
        <p className="text-text-muted text-lg">Project not found</p>
        <Link
          to="/"
          className="px-5 py-2.5 bg-accent text-text-inverse rounded-xl text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          Go Home
        </Link>
      </div>
    );
  }

  const createdDate = new Date(project.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen pt-28 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors duration-200 mb-10"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center gap-5 mt-5">
            <span className="flex items-center gap-2 text-sm text-text-muted">
              <Calendar size={14} />
              {createdDate}
            </span>

            {project.githubUrls?.map((url, i) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors duration-200"
              >
                <Github size={14} />
                {project.githubUrls.length === 1 ? "Source Code" : `Repo ${i + 1}`}
                <ExternalLink size={12} />
              </a>
            ))}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors duration-200"
              >
                <ExternalLink size={14} />
                Live Demo
              </a>
            )}
          </div>
        </motion.div>

        {/* Media */}
        {project.media.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease }}
            className="mt-10 space-y-4"
          >
            {project.media.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden border border-border bg-bg-card"
              >
                {item.type === "video" ? (
                  <video
                    src={item.url}
                    controls
                    className="w-full"
                    playsInline
                  />
                ) : (
                  <img
                    src={item.url}
                    alt={item.caption || project.title}
                    className="w-full"
                  />
                )}
                {item.caption && (
                  <p className="px-5 py-3 text-sm text-text-muted border-t border-border">
                    {item.caption}
                  </p>
                )}
              </div>
            ))}
          </motion.div>
        )}

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease }}
          className="mt-12"
        >
          <h2 className="text-xl font-semibold mb-4 text-text">About This Project</h2>
          <div className="text-text-secondary leading-relaxed whitespace-pre-line">
            {project.description}
          </div>
        </motion.div>

        {/* Technologies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease }}
          className="mt-12"
        >
          <h2 className="text-xl font-semibold mb-5 text-text">Technologies & Frameworks</h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 text-sm font-medium rounded-xl border border-border bg-bg-card text-accent"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Tags */}
        {project.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease }}
            className="mt-10"
          >
            <h2 className="text-xl font-semibold mb-5 text-text flex items-center gap-2">
              <Tag size={18} />
              Keywords
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 text-sm bg-bg-card text-text-secondary rounded-lg border border-border"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease }}
          className="mt-14 flex flex-wrap gap-4"
        >
          {project.githubUrls?.map((url, i) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl font-medium text-sm border border-border hover:border-accent/30 hover:bg-accent-glow hover:text-accent transition-all duration-200 flex items-center gap-2"
            >
              <Github size={18} />
              {project.githubUrls.length === 1 ? "View on GitHub" : `Repo ${i + 1}`}
            </a>
          ))}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-text text-text-inverse rounded-xl font-medium text-sm hover:bg-text/90 transition-colors duration-200 flex items-center gap-2 shadow-sm"
            >
              <ExternalLink size={18} />
              Live Demo
            </a>
          )}
        </motion.div>
      </div>
    </div>
  );
}
