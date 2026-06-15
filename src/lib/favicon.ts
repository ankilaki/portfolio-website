const FAVICON_SIZE = 64;

export function setFavicon(href: string, type = "image/png") {
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.type = type;
  link.href = href;
}

function drawObjectCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  size: number,
  posX: number,
  posY: number,
) {
  const scale = Math.max(size / img.naturalWidth, size / img.naturalHeight);
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  const focalX = (posX / 100) * img.naturalWidth;
  const focalY = (posY / 100) * img.naturalHeight;
  const x = (posX / 100) * size - focalX * scale;
  const y = (posY / 100) * size - focalY * scale;
  ctx.drawImage(img, x, y, w, h);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const isSameOrigin =
      src.startsWith("/") ||
      src.startsWith(window.location.origin) ||
      src.startsWith("data:");

    if (!isSameOrigin) {
      img.crossOrigin = "anonymous";
    }

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}

export async function generateFaviconDataUrl(
  src: string,
  posX: number,
  posY: number,
): Promise<string | null> {
  try {
    const img = await loadImage(src);
    return renderFaviconDataUrl(img, posX, posY);
  } catch {
    return null;
  }
}

export async function generateFaviconBlob(
  file: File,
  posX: number,
  posY: number,
): Promise<Blob | null> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await loadImage(objectUrl);
    const dataUrl = renderFaviconDataUrl(img, posX, posY);
    if (!dataUrl) return null;
    return await fetch(dataUrl).then((response) => response.blob());
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function renderFaviconDataUrl(
  img: HTMLImageElement,
  posX: number,
  posY: number,
): string | null {
  const canvas = document.createElement("canvas");
  canvas.width = FAVICON_SIZE;
  canvas.height = FAVICON_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  drawObjectCover(ctx, img, FAVICON_SIZE, posX, posY);
  try {
    return canvas.toDataURL("image/png");
  } catch {
    return null;
  }
}
