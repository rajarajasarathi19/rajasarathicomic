import { ComicStory } from '../types/comic';

export function exportComicJson(comic: ComicStory) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(comic, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  const safeTitle = comic.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  downloadAnchor.setAttribute('download', `${safeTitle}_comic.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function printComic() {
  window.print();
}

/**
 * High-resolution canvas rendering of the comic page for PNG export
 */
export async function downloadComicPageAsPng(elementId: string, comic: ComicStory): Promise<void> {
  const container = document.getElementById(elementId);
  if (!container) return;

  // Create an offscreen canvas
  const canvas = document.createElement('canvas');
  const scale = 2; // high-dpi
  const rect = container.getBoundingClientRect();
  canvas.width = rect.width * scale;
  canvas.height = rect.height * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.scale(scale, scale);

  // Draw paper background
  ctx.fillStyle = '#fffdfa';
  ctx.fillRect(0, 0, rect.width, rect.height);

  // We can clone the visual using SVG foreignObject or draw directly
  const data = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${rect.width}" height="${rect.height}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml">
          ${container.outerHTML}
        </div>
      </foreignObject>
    </svg>
  `;

  const img = new Image();
  const svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve) => {
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      
      const pngUrl = canvas.toDataURL('image/png');
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', pngUrl);
      const safeTitle = comic.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      downloadAnchor.setAttribute('download', `${safeTitle}_comic_page.png`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      resolve();
    };
    img.onerror = () => {
      // Fallback: window.print()
      window.print();
      resolve();
    };
    img.src = url;
  });
}
