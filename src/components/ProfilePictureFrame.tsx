import { useEffect, useRef, useState } from "react";
import { clampProfilePosition } from "@/lib/profilePicture";

interface Props {
  src?: string;
  alt: string;
  positionX: number;
  positionY: number;
  className?: string;
  editable?: boolean;
  onPositionChange?: (x: number, y: number) => void;
}

export default function ProfilePictureFrame({
  src,
  alt,
  positionX,
  positionY,
  className = "w-36 h-36",
  editable = false,
  onPositionChange,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [dragging, setDragging] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
    if (!src) return;

    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) {
      setImageLoaded(true);
    }
  }, [src]);
  const dragStart = useRef<{
    x: number;
    y: number;
    posX: number;
    posY: number;
  } | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!editable || !onPositionChange) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      posX: positionX,
      posY: positionY,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging || !dragStart.current || !onPositionChange) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    const newX = clampProfilePosition(
      dragStart.current.posX - (dx / rect.width) * 100,
    );
    const newY = clampProfilePosition(
      dragStart.current.posY - (dy / rect.height) * 100,
    );
    onPositionChange(newX, newY);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setDragging(false);
    dragStart.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex-shrink-0 rounded-full overflow-hidden ${className} ${
        editable ? (dragging ? "cursor-grabbing" : "cursor-grab") : ""
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div
        aria-hidden={!!src}
        className={`absolute inset-0 bg-bg-elevated transition-opacity duration-200 ${
          src && imageLoaded ? "opacity-0" : "opacity-100"
        }`}
      />
      {src ? (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          draggable={false}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover select-none pointer-events-none transition-opacity duration-200 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          style={{ objectPosition: `${positionX}% ${positionY}%` }}
        />
      ) : null}
    </div>
  );
}
