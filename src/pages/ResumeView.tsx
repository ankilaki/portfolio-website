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
      <div className="min-h-screen pt-24">
        <LoadingSpinner />
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen pt-24 px-6 flex flex-col items-center justify-center gap-6">
        <p className="text-text-secondary text-xl">Resume not found.</p>
        <Link to="/resumes" className="link-arrow">
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
    <section className="px-6 pt-20 pb-12 max-w-[980px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/resumes"
              className="p-2 rounded-full text-text-secondary hover:text-text hover:bg-bg-card transition-colors"
              aria-label="Back to resumes"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-text">
                {resume.title}
              </h1>
              <p className="text-sm text-text-muted mt-0.5">{resume.domain}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => downloadResume(resume)}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-accent rounded-full border border-accent/30 hover:bg-accent-muted transition-colors self-start sm:self-auto cursor-pointer"
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
