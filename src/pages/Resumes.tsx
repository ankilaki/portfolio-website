import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Download,
  Eye,
  Cpu,
  Brain,
  CircuitBoard,
  Code2,
  FileText,
} from "lucide-react";
import { useResumes } from "@/hooks/useFirestore";
import { downloadResume } from "@/lib/downloadResume";
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

export default function Resumes() {
  const { resumes, loading } = useResumes();

  return (
    <section className="px-6 pt-24 pb-32 max-w-[980px] mx-auto">
      <SectionHeading
        eyebrow="Resume"
        title="Choose your focus."
        subtitle="Each version highlights the experience most relevant to that domain."
        align="center"
      />

      {loading ? (
        <LoadingSpinner />
      ) : resumes.length > 0 ? (
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
                className="rounded-2xl bg-bg-card border border-border hover:border-border-hover transition-colors duration-300"
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
                          <p className="text-sm text-text-secondary mt-2">
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
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        downloadResume(resume);
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium text-accent rounded-full border border-accent/30 hover:bg-accent-muted transition-colors cursor-pointer"
                    >
                      <Download size={14} />
                      Download
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 rounded-3xl bg-bg-card/50 border border-border">
          <p className="text-text-muted">Resumes coming soon.</p>
        </div>
      )}
    </section>
  );
}
