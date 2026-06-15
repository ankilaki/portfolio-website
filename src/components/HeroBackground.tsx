import { motion } from "framer-motion";

export default function HeroBackground() {
  return (
    <div
      className="absolute -inset-x-[50%] -inset-y-[30%] pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Aurora mesh */}
      <div className="hero-aurora" />

      {/* Perspective dot field */}
      <div className="hero-dots" />

      {/* Orbital arcs */}
      <svg
        className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 w-[min(2200px,280vw)] h-[min(2200px,280vw)] opacity-[0.16]"
        viewBox="0 0 800 800"
        fill="none"
      >
        <circle
          cx="400"
          cy="400"
          r="160"
          stroke="url(#hero-ring-gradient)"
          strokeWidth="0.75"
        />
        <circle
          cx="400"
          cy="400"
          r="270"
          stroke="url(#hero-ring-gradient)"
          strokeWidth="0.5"
          strokeDasharray="4 8"
        />
        <circle
          cx="400"
          cy="400"
          r="380"
          stroke="url(#hero-ring-gradient)"
          strokeWidth="0.45"
          opacity="0.7"
        />
        <circle
          cx="400"
          cy="400"
          r="390"
          stroke="url(#hero-ring-gradient)"
          strokeWidth="0.3"
          opacity="0.35"
        />
        <ellipse
          cx="400"
          cy="400"
          rx="380"
          ry="120"
          stroke="url(#hero-ring-gradient)"
          strokeWidth="0.5"
          transform="rotate(-18 400 400)"
          opacity="0.45"
        />
        <ellipse
          cx="400"
          cy="400"
          rx="380"
          ry="120"
          stroke="url(#hero-ring-gradient)"
          strokeWidth="0.4"
          transform="rotate(72 400 400)"
          opacity="0.25"
        />
        <defs>
          <linearGradient id="hero-ring-gradient" x1="0" y1="0" x2="800" y2="800">
            <stop offset="0%" stopColor="#2997ff" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#2997ff" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>

      {/* Slow rotating glow behind portrait */}
      <motion.div
        className="absolute left-1/2 top-[32%] -translate-x-1/2 -translate-y-1/2 w-[min(1100px,130vw)] h-[min(1100px,130vw)] rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, transparent, rgba(41,151,255,0.12), transparent, rgba(167,139,250,0.08), transparent, rgba(41,151,255,0.06), transparent)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      />

      {/* Spotlight on portrait */}
      <div className="absolute left-1/2 top-[32%] -translate-x-1/2 -translate-y-1/2 w-[min(900px,110vw)] h-[min(900px,110vw)] rounded-full bg-accent/[0.06] blur-[100px] md:blur-[140px]" />

      {/* Secondary ambient glow */}
      <div className="absolute left-1/2 top-[55%] -translate-x-1/2 w-[min(1400px,160vw)] h-[min(800px,90vh)] rounded-full bg-indigo-500/[0.04] blur-[120px]" />

      {/* Edge vignette — looser so the larger background reads */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_90%_at_50%_38%,transparent_0%,#000_88%)]" />

      {/* Bottom edge */}
      <div className="absolute bottom-[15%] inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}
