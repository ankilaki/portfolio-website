import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  Tag,
} from "lucide-react";
import { useProject } from "@/hooks/useFirestore";
import LoadingSpinner from "@/components/LoadingSpinner";
import MediaGallery from "@/components/MediaGallery";
import GithubSourceLinks from "@/components/GithubSourceLinks";

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
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-6 px-6">
        <p className="text-text-secondary text-xl">Project not found.</p>
        <Link to="/" className="btn-primary">
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
    <div className="min-h-screen pt-20 pb-32 px-6">
      <div className="max-w-[720px] mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease }}
        >
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm text-accent hover:opacity-80 transition-opacity mb-12"
          >
            <ArrowLeft size={15} />
            Projects
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <p className="eyebrow mb-4">Project</p>
          <h1 className="section-heading text-text">{project.title}</h1>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-6">
            <span className="flex items-center gap-2 text-sm text-text-muted">
              <Calendar size={14} />
              {createdDate}
            </span>

            <GithubSourceLinks urls={project.githubUrls ?? []} variant="inline" />

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-accent hover:opacity-80 transition-opacity"
              >
                <ExternalLink size={14} />
                Live Demo
              </a>
            )}
          </div>
        </motion.div>

        {project.media.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
          >
            <MediaGallery media={project.media} title={project.title} />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
          className="mt-16"
        >
          <h2 className="text-xl font-semibold mb-5 text-text tracking-tight">
            Overview
          </h2>
          <div className="text-[17px] text-text-secondary leading-[1.7] whitespace-pre-line">
            {project.description}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease }}
          className="mt-16"
        >
          <h2 className="text-xl font-semibold mb-5 text-text tracking-tight">
            Technologies
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 text-sm rounded-full bg-bg-card border border-border text-text-secondary"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

        {project.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease }}
            className="mt-12"
          >
            <h2 className="text-xl font-semibold mb-5 text-text tracking-tight flex items-center gap-2">
              <Tag size={18} className="text-text-muted" />
              Keywords
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 text-sm text-text-muted rounded-full bg-bg-elevated"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease }}
          className="mt-16 pt-8 border-t border-border flex flex-wrap gap-4"
        >
          <GithubSourceLinks urls={project.githubUrls ?? []} variant="button" />
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <ExternalLink size={16} />
              Live Demo
            </a>
          )}
        </motion.div>
      </div>
    </div>
  );
}
