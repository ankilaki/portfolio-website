import { motion } from "framer-motion";
import { useProjects } from "@/hooks/useFirestore";
import ProjectCard from "@/components/ProjectCard";
import SectionHeading from "@/components/SectionHeading";
import LoadingSpinner from "@/components/LoadingSpinner";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export default function Projects() {
  const { projects, loading } = useProjects(false);

  return (
    <main className="px-6 py-24 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
      >
        <SectionHeading
          title="All Projects"
          subtitle="The complete collection of my engineering work across software, AI, and robotics."
        />
      </motion.div>

      {loading ? (
        <LoadingSpinner />
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center py-24 rounded-2xl border border-border border-dashed mt-12"
        >
          <p className="text-text-muted">
            No projects yet. Check back soon.
          </p>
        </motion.div>
      )}
    </main>
  );
}
