import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X, Play } from "lucide-react";
import type { MediaItem } from "@/types";

interface Props {
  media: MediaItem[];
  title: string;
}

const swipeThreshold = 50;

export default function MediaGallery({ media, title }: Props) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const count = media.length;
  const item = media[current];

  const go = useCallback(
    (next: number) => {
      setDirection(next > current ? 1 : -1);
      setCurrent(next);
    },
    [current],
  );

  const prev = useCallback(
    () => go((current - 1 + count) % count),
    [current, count, go],
  );
  const next = useCallback(
    () => go((current + 1) % count),
    [current, count, go],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setLightbox(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  };

  if (count === 0) return null;

  if (count === 1) {
    return (
      <div className="mt-10 max-w-3xl mx-auto">
        <div className="rounded-2xl overflow-hidden border border-border bg-bg-card">
          <div className="relative max-h-[480px] flex items-center justify-center bg-black/[.03]">
            <MediaRenderer item={item} title={title} constrain />
          </div>
          {item.caption && (
            <p className="px-5 py-3 text-sm text-text-muted border-t border-border">
              {item.caption}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div ref={containerRef} className="mt-10 max-w-3xl mx-auto">
        <div className="rounded-2xl overflow-hidden border border-border bg-bg-card shadow-sm">
          {/* Main display */}
          <div className="relative max-h-[480px] h-[56vw] md:h-[480px] bg-black/[.03] overflow-hidden group">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -swipeThreshold) next();
                  else if (info.offset.x > swipeThreshold) prev();
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <MediaRenderer item={item} title={title} constrain />
              </motion.div>
            </AnimatePresence>

            {/* Nav arrows */}
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass-strong flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer hover:scale-105 z-10"
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass-strong flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer hover:scale-105 z-10"
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>

            {/* Expand button */}
            <button
              onClick={() => setLightbox(true)}
              className="absolute top-3 right-3 w-8 h-8 rounded-lg glass-strong flex items-center justify-center opacity-0 group-hover:opacity-70 hover:!opacity-100 transition-opacity duration-200 cursor-pointer z-10"
              aria-label="Expand"
            >
              <Maximize2 size={14} />
            </button>

            {/* Counter pill */}
            <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full glass-strong text-xs font-medium text-text-secondary z-10">
              {current + 1} / {count}
            </div>
          </div>

          {/* Caption */}
          <AnimatePresence mode="wait">
            {item.caption && (
              <motion.p
                key={`caption-${current}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="px-5 py-3 text-sm text-text-muted border-t border-border"
              >
                {item.caption}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Thumbnail strip */}
          <div className="flex gap-1.5 p-3 border-t border-border overflow-x-auto gallery-thumbs">
            {media.map((m, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={`relative shrink-0 w-16 h-11 rounded-lg overflow-hidden transition-all duration-200 cursor-pointer ${
                  i === current
                    ? "ring-2 ring-accent ring-offset-1 ring-offset-bg-card opacity-100"
                    : "opacity-50 hover:opacity-80"
                }`}
                aria-label={`Go to media ${i + 1}`}
              >
                {m.type === "video" ? (
                  <>
                    <video
                      src={m.url}
                      muted
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Play size={12} className="text-white" fill="white" />
                    </div>
                  </>
                ) : (
                  <img
                    src={m.url}
                    alt={m.caption || `${title} ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-1.5 pb-3">
            {media.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  i === current
                    ? "w-6 h-1.5 bg-accent"
                    : "w-1.5 h-1.5 bg-text-muted/30 hover:bg-text-muted/50"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setLightbox(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative max-w-[90vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <MediaRenderer item={item} title={title} lightbox />
              <button
                onClick={() => setLightbox(false)}
                className="absolute -top-12 right-0 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={18} className="text-white" />
              </button>
              {count > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Previous"
                  >
                    <ChevronLeft size={20} className="text-white" />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Next"
                  >
                    <ChevronRight size={20} className="text-white" />
                  </button>
                </>
              )}
              {item.caption && (
                <p className="absolute -bottom-10 left-0 right-0 text-center text-sm text-white/70">
                  {item.caption}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MediaRenderer({
  item,
  title,
  constrain,
  lightbox,
}: {
  item: MediaItem;
  title: string;
  constrain?: boolean;
  lightbox?: boolean;
}) {
  if (item.type === "video") {
    return (
      <video
        src={item.url}
        controls
        playsInline
        className={
          lightbox
            ? "max-w-[90vw] max-h-[85vh] rounded-xl"
            : constrain
              ? "max-h-[480px] w-full object-contain"
              : "w-full"
        }
      />
    );
  }

  return (
    <img
      src={item.url}
      alt={item.caption || title}
      className={
        lightbox
          ? "max-w-[90vw] max-h-[85vh] rounded-xl object-contain"
          : constrain
            ? "max-h-[480px] w-full object-contain"
            : "w-full"
      }
    />
  );
}
