import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  Download,
  ExternalLink,
  Eye,
  Cpu,
  Brain,
  CircuitBoard,
  Code2,
  FileText,
} from "lucide-react";
import { useProjects, useResumes, useSiteSettings } from "@/hooks/useFirestore";
import { getGoogleDocExportPdfUrl } from "@/lib/googleDocs";
import { getProfilePosition } from "@/lib/profilePicture";
import ProjectCard from "@/components/ProjectCard";
import SectionHeading from "@/components/SectionHeading";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProfilePictureFrame from "@/components/ProfilePictureFrame";
import HeroBackground from "@/components/HeroBackground";
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
  const heroRef = useRef<HTMLElement>(null);
  const { projects: featuredProjects, loading: projectsLoading } =
    useProjects(true);
  const { resumes, loading: resumesLoading } = useResumes();
  const { settings } = useSiteSettings();
  const profilePictureUrl = settings.profilePictureUrl ?? "/profile.png";
  const profilePosition = getProfilePosition(settings);
  const featuredSlice = featuredProjects.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section
        ref={heroRef}
        className="relative min-h-[100svh] flex flex-col items-center justify-center px-6 pt-12 pb-24 overflow-hidden"
      >
        <HeroBackground containerRef={heroRef} />

        <div className="relative z-10 w-full max-w-[980px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="flex justify-center mb-10"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full ring-1 ring-white/15 shadow-[0_0_80px_rgba(41,151,255,0.12)]" />
              <ProfilePictureFrame
                src={profilePictureUrl}
                alt="Ankith Lakshman"
                positionX={profilePosition.x}
                positionY={profilePosition.y}
                className="relative w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-48 lg:h-48 ring-1 ring-white/20"
              />
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease }}
            className="eyebrow mb-6"
          >
            Software · AI · Robotics
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="display-heading text-text"
          >
            Ankith{" "}
            <span className="gradient-text">Lakshman</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            className="mt-6 text-xl md:text-2xl text-text-secondary max-w-xl mx-auto leading-relaxed font-normal"
          >
            Building software, intelligent systems, and robots that solve real problems.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease }}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-4"
          >
            <Link to="/resumes" className="btn-primary">
              View Resumes
            </Link>
            <a href="#projects" className="btn-secondary">
              Explore Projects
              <ChevronRight size={16} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      <section id="projects" className="scroll-mt-12">
        <div className="divider mb-24" />

        <div className="px-6 pb-32 max-w-[980px] mx-auto">
          <SectionHeading
            eyebrow="Work"
            title="Featured Projects"
            subtitle="Selected engineering work across software, machine learning, and robotics."
            align="center"
          />

          {projectsLoading ? (
            <LoadingSpinner />
          ) : featuredSlice.length === 3 ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5">
                <div className="lg:col-span-7">
                  <ProjectCard project={featuredSlice[0]} index={0} featured />
                </div>
                <div className="lg:col-span-5 flex flex-col gap-4 md:gap-5">
                  <ProjectCard project={featuredSlice[1]} index={1} />
                  <ProjectCard project={featuredSlice[2]} index={2} />
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-14 text-center"
              >
                <Link to="/projects" className="link-arrow">
                  View all projects
                  <ArrowRight size={14} />
                </Link>
              </motion.div>
            </>
          ) : featuredSlice.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                {featuredSlice.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} />
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-14 text-center"
              >
                <Link to="/projects" className="link-arrow">
                  View all projects
                  <ArrowRight size={14} />
                </Link>
              </motion.div>
            </>
          ) : (
            <div className="text-center py-20 rounded-3xl bg-bg-card/50 border border-border">
              <p className="text-text-muted">
                No featured projects yet. Check back soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Resumes */}
      <section id="resumes" className="scroll-mt-12 bg-bg-elevated">
        <div className="divider" />

        <div className="px-6 py-32 max-w-[980px] mx-auto">
          <SectionHeading
            eyebrow="Resume"
            title="Tailored for every domain."
            subtitle="Download a version focused on the role you're hiring for."
            align="center"
          />

          {resumesLoading ? (
            <LoadingSpinner />
          ) : resumes.length > 0 ? (
            <>
              <div className="space-y-3">
                {resumes.map((resume, i) => {
                  const Icon = domainIcons[resume.domain] || FileText;

                  return (
                    <motion.article
                      key={resume.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.06, ease }}
                      className="group rounded-2xl bg-bg-card border border-border hover:border-border-hover transition-colors duration-300"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-6 md:p-8">
                        <div className="flex items-start gap-5 flex-1 min-w-0">
                          <div className="w-11 h-11 rounded-xl bg-accent-muted flex items-center justify-center flex-shrink-0">
                            <Icon size={20} className="text-accent" />
                          </div>
                          <div className="min-w-0">
                            <Link
                              to={`/resumes/${resume.id}`}
                              className="block group/link"
                            >
                              <h3 className="text-lg font-semibold text-text group-hover/link:text-accent transition-colors">
                                {resume.title}
                              </h3>
                              <p className="text-sm text-text-muted mt-0.5">
                                {resume.domain}
                              </p>
                              {resume.description && (
                                <p className="text-sm text-text-secondary mt-2 line-clamp-2">
                                  {resume.description}
                                </p>
                              )}
                            </Link>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 sm:flex-shrink-0 pl-16 sm:pl-0">
                          <Link
                            to={`/resumes/${resume.id}`}
                            className="btn-primary text-[13px] py-2.5 px-5"
                          >
                            <Eye size={14} />
                            View
                          </Link>
                          <a
                            href={
                              resume.sourceType === "google-doc"
                                ? getGoogleDocExportPdfUrl(resume.fileUrl) ??
                                  resume.fileUrl
                                : resume.fileUrl
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium text-accent rounded-full border border-accent/30 hover:bg-accent-muted transition-colors"
                          >
                            <Download size={14} />
                            PDF
                            <ExternalLink size={11} className="opacity-60" />
                          </a>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-14 text-center"
              >
                <Link to="/resumes" className="link-arrow">
                  View all resumes
                  <ArrowRight size={14} />
                </Link>
              </motion.div>
            </>
          ) : (
            <div className="text-center py-20 rounded-3xl bg-bg-card/50 border border-border">
              <p className="text-text-muted">Resumes coming soon.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
