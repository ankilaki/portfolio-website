import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import type { Project } from "@/types";

interface Props {
  project: Project;
  index: number;
  featured?: boolean;
}

export default function ProjectCard({ project, index, featured = false }: Props) {
  const thumbnail = project.media?.[project.thumbnailIndex ?? 0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="h-full"
    >
      <Link
        to={`/projects/${project.id}`}
        className="group flex flex-col h-full rounded-2xl overflow-hidden border border-border bg-bg-card hover:border-border-hover hover:shadow-lg hover:shadow-black/[0.04] transition-all duration-300"
      >
        <div className={`${featured ? "h-64 sm:h-80" : "h-52 sm:h-56"} bg-bg-elevated overflow-hidden flex-shrink-0`}>
          {thumbnail ? (
            thumbnail.type === "video" ? (
              <video
                src={thumbnail.url}
                muted
                loop
                playsInline
                className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-500"
                onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                onMouseOut={(e) => {
                  const v = e.target as HTMLVideoElement;
                  v.pause();
                  v.currentTime = 0;
                }}
              />
            ) : (
              <img
                src={thumbnail.url}
                alt={project.title}
                className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-500"
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl font-bold text-text-muted/20">
                {project.title[0]}
              </span>
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg text-text group-hover:text-accent transition-colors duration-200">
              {project.title}
            </h3>
            <ArrowUpRight
              size={18}
              className="text-text-muted group-hover:text-accent transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0 mt-1"
            />
          </div>

          <p className="text-sm text-text-secondary mt-2">
            {project.shortDescription}
          </p>

          <div className="flex flex-wrap gap-1.5 mt-4">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 text-xs font-medium bg-accent-muted text-accent rounded-lg"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-2.5 py-1 text-xs font-medium text-text-muted">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
            {project.githubUrls?.length > 0 && (
              <span className="flex items-center gap-1.5 text-xs text-text-muted">
                <Github size={13} />
                {project.githubUrls.length === 1 ? "Source" : `${project.githubUrls.length} Repos`}
              </span>
            )}
            <div className="flex flex-wrap gap-1.5">
              {project.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs text-text-muted">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
