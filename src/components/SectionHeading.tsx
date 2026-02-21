import { motion } from "framer-motion";

interface Props {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function SectionHeading({ title, subtitle, className = "" }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`mb-14 ${className}`}
    >
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-text-secondary max-w-2xl text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
