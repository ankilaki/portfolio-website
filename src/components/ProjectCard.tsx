import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Github } from "lucide-react";
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
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="h-full"
    >
      <Link
        to={`/projects/${project.id}`}
        className="group flex flex-col h-full rounded-2xl overflow-hidden bg-bg-card border border-border hover:border-border-hover transition-all duration-500"
      >
        <div
          className={`relative ${featured ? "aspect-[16/10]" : "aspect-[16/11]"} bg-black overflow-hidden flex-shrink-0`}
        >
          {thumbnail ? (
            thumbnail.type === "video" ? (
              <video
                src={thumbnail.url}
                muted
                loop
                playsInline
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-700 ease-out"
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
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-700 ease-out"
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-bg-elevated">
              <span className="text-5xl font-semibold text-white/5">
                {project.title[0]}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent opacity-60" />
        </div>

        <div className="p-5 md:p-6 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-[17px] md:text-lg text-text tracking-tight leading-snug">
              {project.title}
            </h3>
            <ChevronRight
              size={18}
              className="text-text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-300 flex-shrink-0 mt-0.5"
            />
          </div>

          <p className="text-[15px] text-text-secondary mt-2 line-clamp-2 leading-relaxed">
            {project.shortDescription}
          </p>

          <div className="mt-auto pt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            {project.technologies.slice(0, 3).map((tech) => (
              <span key={tech} className="text-[12px] text-text-muted">
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="text-[12px] text-text-muted/60">
                +{project.technologies.length - 3}
              </span>
            )}
            {project.githubUrls?.length > 0 && (
              <span className="flex items-center gap-1 text-[12px] text-text-muted ml-auto">
                <Github size={12} />
                {project.githubUrls.length === 1
                  ? "Source"
                  : `${project.githubUrls.length} repos`}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
