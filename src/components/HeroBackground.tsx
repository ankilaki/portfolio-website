import { useEffect, useRef, type RefObject } from "react";

interface Props {
  containerRef: RefObject<HTMLElement | null>;
}

export default function HeroBackground({ containerRef }: Props) {
  const auroraRef = useRef<HTMLDivElement>(null);
  const meshRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<HTMLDivElement>(null);
  const ringsTiltRef = useRef<SVGSVGElement>(null);
  const washRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const ambientRef = useRef<HTMLDivElement>(null);
  const cursorWashRef = useRef<HTMLDivElement>(null);
  const cursorTintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const pointer = {
      targetX: 0.5,
      targetY: 0.38,
      currentX: 0.5,
      currentY: 0.38,
      active: false,
    };

    const apply = () => {
      const px = (pointer.currentX - 0.5) * 2;
      const py = (pointer.currentY - 0.5) * 2;
      const mx = pointer.currentX * 100;
      const my = pointer.currentY * 100;
      const lean = 108 + px * 28 + py * 12;

      auroraRef.current?.style.setProperty(
        "transform",
        `translate(${px * 110}px, ${py * 75}px) rotate(${px * 1.5}deg)`,
      );
      meshRef.current?.style.setProperty(
        "transform",
        `translate(${px * -65}px, ${py * 48}px) rotate(${-px * 2.5}deg)`,
      );
      dotsRef.current?.style.setProperty(
        "transform",
        `translate(${px * -40}px, ${py * -28}px)`,
      );
      ringsRef.current?.style.setProperty(
        "transform",
        `translate(${px * 70}px, ${py * 45}px)`,
      );
      ringsTiltRef.current?.style.setProperty(
        "transform",
        `rotateY(${px * 14}deg) rotateX(${py * -11}deg) rotate(${-8 + px * 8}deg)`,
      );
      washRef.current?.style.setProperty(
        "transform",
        `translate(${px * 55}px, ${py * 38}px) skewX(${px * 3}deg)`,
      );
      spotlightRef.current?.style.setProperty(
        "transform",
        `translate(${px * 60}px, ${py * 42}px)`,
      );
      ambientRef.current?.style.setProperty(
        "transform",
        `translate(${px * -80}px, ${py * 25}px)`,
      );

      const opacity = pointer.active ? "1" : "0";

      if (cursorWashRef.current) {
        cursorWashRef.current.style.opacity = opacity;
        cursorWashRef.current.style.background = `
          linear-gradient(
            ${lean}deg,
            transparent 0%,
            rgba(10, 132, 255, 0.14) 28%,
            transparent 48%,
            rgba(255, 45, 85, 0.11) 72%,
            transparent 100%
          ),
          linear-gradient(
            ${lean - 65}deg,
            transparent 10%,
            rgba(255, 204, 0, 0.09) 45%,
            transparent 80%
          ),
          radial-gradient(
            ellipse 140% 55% at ${mx - 14 + px * 6}% ${my + 22}%,
            rgba(50, 215, 75, 0.16),
            transparent 58%
          )
        `;
      }

      if (cursorTintRef.current) {
        cursorTintRef.current.style.opacity = opacity;
        cursorTintRef.current.style.background = `
          radial-gradient(
            ellipse 95% 130% at ${mx + 24 + px * 5}% ${my - 18 + py * 4}%,
            rgba(255, 45, 85, 0.26),
            transparent 52%
          ),
          radial-gradient(
            ellipse 130% 70% at ${mx - 28 - px * 4}% ${my + 8}%,
            rgba(10, 132, 255, 0.3),
            transparent 55%
          ),
          radial-gradient(
            ellipse 80% 160% at ${mx + 8}% ${my + 32 - py * 6}%,
            rgba(255, 204, 0, 0.2),
            transparent 50%
          ),
          radial-gradient(
            ellipse 110% 85% at ${mx + 32}% ${my - 30 + py * 8}%,
            rgba(50, 215, 75, 0.18),
            transparent 48%
          )
        `;
      }
    };

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (!inside) {
        pointer.active = false;
        pointer.targetX = 0.5;
        pointer.targetY = 0.38;
        return;
      }

      pointer.targetX = (e.clientX - rect.left) / rect.width;
      pointer.targetY = (e.clientY - rect.top) / rect.height;
      pointer.active = true;
    };

    let rafId = 0;
    const tick = () => {
      pointer.currentX += (pointer.targetX - pointer.currentX) * 0.14;
      pointer.currentY += (pointer.targetY - pointer.currentY) * 0.14;
      apply();
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, [containerRef]);

  return (
    <div
      className="absolute -inset-x-[50%] -inset-y-[30%] pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Base aurora — asymmetric static washes */}
      <div ref={auroraRef} className="absolute inset-0 will-change-transform">
        <div className="hero-aurora" />
      </div>

      {/* Organic color mesh blob */}
      <div ref={meshRef} className="absolute inset-0 will-change-transform">
        <div className="hero-mesh" />
      </div>

      {/* Dot field */}
      <div ref={dotsRef} className="absolute inset-0 will-change-transform">
        <div className="hero-dots" />
      </div>

      {/* Orbital arcs — off-center */}
      <div className="absolute left-[56%] top-[34%] -translate-x-1/2 -translate-y-1/2 hero-rings-perspective">
        <div ref={ringsRef} className="will-change-transform hero-rings-3d">
          <svg
            ref={ringsTiltRef}
            className="w-[min(2400px,300vw)] h-[min(2000px,250vw)] opacity-[0.38] will-change-transform"
            viewBox="0 0 800 700"
            fill="none"
          >
            <ellipse
              cx="380"
              cy="340"
              rx="300"
              ry="260"
              stroke="url(#hero-ring-gradient)"
              strokeWidth="0.65"
              opacity="0.7"
            />
            <ellipse
              cx="420"
              cy="360"
              rx="220"
              ry="180"
              stroke="url(#hero-ring-gradient-bright)"
              strokeWidth="0.5"
              strokeDasharray="5 12"
              transform="rotate(-24 420 360)"
              opacity="0.55"
            />
            <path
              d="M 120 420 Q 400 180 680 380"
              stroke="url(#hero-ring-gradient)"
              strokeWidth="0.75"
              fill="none"
              opacity="0.45"
            />
            <path
              d="M 80 280 Q 350 520 720 300"
              stroke="url(#hero-ring-gradient-bright)"
              strokeWidth="0.45"
              fill="none"
              opacity="0.35"
            />
            <defs>
              <linearGradient id="hero-ring-gradient" x1="0" y1="0" x2="800" y2="700">
                <stop offset="0%" stopColor="#4db8ff" stopOpacity="1" />
                <stop offset="35%" stopColor="#ff2d55" stopOpacity="0.85" />
                <stop offset="62%" stopColor="#ffcc00" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#32d74b" stopOpacity="0.55" />
              </linearGradient>
              <linearGradient id="hero-ring-gradient-bright" x1="700" y1="0" x2="100" y2="700">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                <stop offset="40%" stopColor="#3399ff" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#ff4d6d" stopOpacity="0.35" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Diagonal color wash */}
      <div ref={washRef} className="absolute inset-0 will-change-transform">
        <div className="hero-wash" />
      </div>

      {/* Portrait-area light — elongated, offset */}
      <div className="absolute left-[46%] top-[28%] -translate-x-1/2 -translate-y-1/2">
        <div
          ref={spotlightRef}
          className="hero-spotlight will-change-transform w-[min(1200px,140vw)] h-[min(700px,80vh)] blur-[90px] md:blur-[130px]"
        />
      </div>

      {/* Lower ambient band */}
      <div className="absolute left-[38%] top-[62%] -translate-x-1/2">
        <div
          ref={ambientRef}
          className="hero-ambient will-change-transform w-[min(1600px,180vw)] h-[min(500px,55vh)] blur-[100px]"
        />
      </div>

      {/* Soft edge fade — asymmetric */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_90%_at_48%_32%,transparent_0%,#000_92%)]" />

      {/* Cursor-driven washes — full bleed, not disk-shaped */}
      <div
        ref={cursorWashRef}
        className="hero-cursor-layer absolute -inset-[20%] z-10 opacity-0 pointer-events-none mix-blend-screen"
      />
      <div
        ref={cursorTintRef}
        className="hero-cursor-layer absolute -inset-[15%] z-20 opacity-0 pointer-events-none mix-blend-screen"
      />

      {/* Bottom edge */}
      <div className="absolute bottom-[15%] inset-x-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
    </div>
  );
}
