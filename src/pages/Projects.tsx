import { motion } from "framer-motion";
import { useProjects } from "@/hooks/useFirestore";
import ProjectCard from "@/components/ProjectCard";
import SectionHeading from "@/components/SectionHeading";
import LoadingSpinner from "@/components/LoadingSpinner";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export default function Projects() {
  const { projects, loading } = useProjects(false);

  return (
    <main className="px-6 pt-24 pb-32 max-w-[980px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
      >
        <SectionHeading
          eyebrow="Portfolio"
          title="All Projects"
          subtitle="The complete collection of engineering work across software, AI, and robotics."
          align="center"
        />
      </motion.div>

      {loading ? (
        <LoadingSpinner />
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center py-24 rounded-3xl bg-bg-card/50 border border-border"
        >
          <p className="text-text-muted">No projects yet. Check back soon.</p>
        </motion.div>
      )}
    </main>
  );
}
