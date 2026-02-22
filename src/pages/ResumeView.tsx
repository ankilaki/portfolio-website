import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Download } from "lucide-react";
import { useResume } from "@/hooks/useFirestore";
import { getGoogleDocPreviewUrl } from "@/lib/googleDocs";
import { downloadResume } from "@/lib/downloadResume";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ResumeView() {
  const { id } = useParams<{ id: string }>();
  const { resume, loading } = useResume(id);

  if (loading) {
    return (
      <div className="min-h-screen pt-32">
        <LoadingSpinner />
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen pt-32 px-6 flex flex-col items-center justify-center gap-4">
        <p className="text-text-muted text-lg">Resume not found.</p>
        <Link
          to="/resumes"
          className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
        >
          <ArrowLeft size={14} />
          Back to Resumes
        </Link>
      </div>
    );
  }

  const isGoogleDoc = resume.sourceType === "google-doc";
  const viewUrl = isGoogleDoc
    ? getGoogleDocPreviewUrl(resume.fileUrl)
    : resume.fileUrl;

  return (
    <section className="px-6 pt-28 pb-12 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Link
              to="/resumes"
              className="p-2 rounded-xl border border-border text-text-secondary hover:text-accent hover:border-accent/30 transition-all duration-200"
              aria-label="Back to resumes"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-text">
                {resume.title}
              </h1>
              <p className="text-sm text-text-muted mt-0.5">{resume.domain}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => downloadResume(resume)}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-accent border border-accent/20 rounded-xl hover:bg-accent hover:text-text-inverse transition-all duration-200 self-start sm:self-auto cursor-pointer"
          >
            <Download size={14} />
            Download PDF
          </button>
        </div>

        <div className="rounded-2xl border border-border bg-bg-card overflow-hidden">
          {viewUrl ? (
            <iframe
              src={viewUrl}
              title={resume.title}
              className="w-full bg-white"
              style={{ height: "calc(100vh - 200px)", minHeight: "600px" }}
              allow="autoplay"
            />
          ) : (
            <div className="flex items-center justify-center py-24 text-text-muted">
              Unable to preview this resume.
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
