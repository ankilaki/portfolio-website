import { motion } from "framer-motion";

interface Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  eyebrow,
  align = "left",
  className = "",
}: Props) {
  const centered = align === "center";

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`mb-16 md:mb-20 ${centered ? "text-center mx-auto max-w-3xl" : ""} ${className}`}
    >
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h2 className="section-heading text-text">{title}</h2>
      {subtitle && (
        <p
          className={`mt-5 text-lg md:text-xl text-text-secondary leading-relaxed ${
            centered ? "mx-auto max-w-2xl" : "max-w-2xl"
          }`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
