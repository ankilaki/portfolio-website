import { motion } from "framer-motion";
import {
  ArrowDown,
  Download,
  ExternalLink,
  Cpu,
  Brain,
  CircuitBoard,
  Code2,
  FileText,
} from "lucide-react";
import { useProjects, useResumes } from "@/hooks/useFirestore";
import ProjectCard from "@/components/ProjectCard";
import SectionHeading from "@/components/SectionHeading";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { ResumeDomain } from "@/types";

const domainIcons: Record<ResumeDomain, typeof Cpu> = {
  Robotics: Cpu,
  "AI / Machine Learning": Brain,
  "Embedded / Devices": CircuitBoard,
  "Software Engineering": Code2,
  General: FileText,
};

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export default function Home() {
  const { projects: featuredProjects, loading: projectsLoading } =
    useProjects(true);
  const { resumes, loading: resumesLoading } = useResumes();
  const featuredSlice = featuredProjects.slice(0, 3);

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-accent/[0.06] rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/5 w-[400px] h-[400px] bg-emerald-300/[0.05] rounded-full blur-[100px]" />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.06) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 max-w-5xl w-full">
          {/* Profile Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease }}
            className="flex-shrink-0"
          >
            <div className="relative">
              <img
                src="/profile.png"
                alt="Profile"
                className="w-44 h-44 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full object-cover object-top border-2 border-border shadow-xl shadow-black/[0.06]"
              />
              <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 w-7 h-7 md:w-8 md:h-8 rounded-full bg-accent border-[3px] border-bg" />
            </div>
          </motion.div>

          {/* Text Content */}
          <div className="text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease }}
            >
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-border bg-bg-elevated text-sm text-text-secondary mb-7 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                Software &middot; AI &middot; Robotics Engineer
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease }}
              className="text-5xl sm:text-6xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08]"
            >
              Ankith{" "}
              <span className="gradient-text">Lakshman</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease }}
              className="mt-6 text-lg text-text-secondary max-w-lg leading-relaxed"
            >
              I design and build software, AI models, and robotic systems that
              push the boundaries of what&apos;s possible.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease }}
              className="mt-9 flex flex-wrap items-center justify-center md:justify-start gap-4"
            >
              <a
                href="#projects"
                className="px-7 py-3.5 bg-text text-text-inverse rounded-xl font-medium text-sm hover:bg-text/90 transition-colors duration-200 shadow-sm"
              >
                View Projects
              </a>
              <a
                href="#resumes"
                className="px-7 py-3.5 rounded-xl font-medium text-sm border border-border text-text-secondary hover:text-accent hover:border-accent/30 hover:bg-accent-glow transition-all duration-200"
              >
                Download Resume
              </a>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown size={20} className="text-text-muted" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Featured Projects ─── */}
      <section id="projects" className="px-6 py-24 max-w-6xl mx-auto scroll-mt-24">
        <SectionHeading
          title="Featured Projects"
          subtitle="A selection of my most impactful work across software, AI, and robotics."
        />

        {projectsLoading ? (
          <LoadingSpinner />
        ) : featuredSlice.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredSlice.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-2xl border border-border border-dashed">
            <p className="text-text-muted">
              No featured projects yet. Check back soon.
            </p>
          </div>
        )}
      </section>

      {/* ─── Resume Section ─── */}
      <section id="resumes" className="px-6 py-24 max-w-5xl mx-auto scroll-mt-24">
        <SectionHeading
          title="Resume"
          subtitle="Download a resume tailored to the domain you're interested in."
        />

        {resumesLoading ? (
          <LoadingSpinner />
        ) : resumes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {resumes.map((resume, i) => {
              const Icon = domainIcons[resume.domain] || FileText;

              return (
                <motion.div
                  key={resume.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease }}
                  className="rounded-2xl border border-border bg-bg-card p-6 hover:border-border-hover hover:shadow-md hover:shadow-black/[0.03] transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent-muted flex items-center justify-center mb-5">
                    <Icon size={22} className="text-accent" />
                  </div>

                  <h3 className="font-semibold text-text">{resume.title}</h3>
                  <p className="text-sm text-text-muted mt-1">
                    {resume.domain}
                  </p>
                  {resume.description && (
                    <p className="text-sm text-text-secondary mt-3 line-clamp-2">
                      {resume.description}
                    </p>
                  )}

                  <a
                    href={resume.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-accent border border-accent/20 rounded-xl hover:bg-accent hover:text-text-inverse transition-all duration-200"
                  >
                    <Download size={14} />
                    Download PDF
                    <ExternalLink size={12} />
                  </a>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 rounded-2xl border border-border border-dashed">
            <p className="text-text-muted">
              Resumes coming soon. Stay tuned.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
