import { useEffect, useRef, useState } from "react";
import { ChevronDown, ExternalLink, Github } from "lucide-react";
import { getGithubRepoLabel } from "@/lib/githubUrls";

interface Props {
  urls: string[];
  variant?: "inline" | "button";
}

export default function GithubSourceLinks({ urls, variant = "inline" }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!urls.length) return null;

  if (urls.length === 1) {
    const label = variant === "button" ? "View on GitHub" : "Source Code";

    if (variant === "button") {
      return (
        <a
          href={urls[0]}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-xl font-medium text-sm border border-border hover:border-accent/30 hover:bg-accent-glow hover:text-accent transition-all duration-200 flex items-center gap-2"
        >
          <Github size={18} />
          {label}
        </a>
      );
    }

    return (
      <a
        href={urls[0]}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors duration-200"
      >
        <Github size={14} />
        {label}
        <ExternalLink size={12} />
      </a>
    );
  }

  const triggerClass =
    variant === "button"
      ? "px-6 py-3 rounded-xl font-medium text-sm border border-border hover:border-accent/30 hover:bg-accent-glow hover:text-accent transition-all duration-200 flex items-center gap-2"
      : "flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors duration-200";

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={triggerClass}
      >
        <Github size={variant === "button" ? 18 : 14} />
        {variant === "button" ? "View on GitHub" : "Source Code"}
        <ChevronDown
          size={variant === "button" ? 16 : 14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className={`absolute z-20 min-w-[220px] rounded-xl border border-border bg-bg-card shadow-lg py-1 ${
            variant === "button" ? "left-0 top-full mt-2" : "left-0 top-full mt-2"
          }`}
        >
          {urls.map((url) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-accent hover:bg-accent-glow transition-colors"
            >
              <span className="font-medium">{getGithubRepoLabel(url)}</span>
              <ExternalLink size={14} className="flex-shrink-0 opacity-60" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
