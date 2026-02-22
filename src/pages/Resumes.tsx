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
    <section className="px-6 pt-32 pb-24 max-w-6xl mx-auto">
      <SectionHeading
        title="Resumes"
        subtitle="Download a resume tailored to the domain you're interested in."
      />

      {loading ? (
        <LoadingSpinner />
      ) : resumes.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {resumes.map((resume, i) => {
            const Icon = domainIcons[resume.domain] || FileText;

            return (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08, ease }}
                className="rounded-2xl border border-border bg-bg-card p-8 hover:border-border-hover hover:shadow-md hover:shadow-black/[0.03] transition-all duration-300 group"
              >
                <Link
                  to={`/resumes/${resume.id}`}
                  className="block cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-xl bg-accent-muted flex items-center justify-center mb-6">
                    <Icon size={26} className="text-accent" />
                  </div>

                  <h3 className="font-semibold text-text">{resume.title}</h3>
                  <p className="text-sm text-text-muted mt-1">
                    {resume.domain}
                  </p>
                  {resume.description && (
                    <p className="text-sm text-text-secondary mt-3">
                      {resume.description}
                    </p>
                  )}
                </Link>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to={`/resumes/${resume.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-text text-text-inverse rounded-xl hover:bg-text/90 transition-colors duration-200"
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
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-accent border border-accent/20 rounded-xl hover:bg-accent hover:text-text-inverse transition-all duration-200 cursor-pointer"
                  >
                    <Download size={14} />
                    Download
                  </button>
                </div>
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
  );
}
