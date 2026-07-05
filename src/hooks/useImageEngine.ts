import type { ImageSettings } from '../types/media';

/**
 * Convert a single image file using Canvas API.
 * Returns the converted blob and an object URL.
 */
export async function convertImage(
  file: File,
  settings: ImageSettings,
  _onProgress?: (pct: number) => void,
): Promise<{ blob: Blob; url: string }> {
  const { format, quality, resizeMax } = settings;

  // Create source image object
  const img = new Image();
  const objectUrl = URL.createObjectURL(file);

  await new Promise<void>((resolve, reject) => {
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve();
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Файл повреждён или не является поддерживаемым изображением.'));
    };
    img.src = objectUrl;
  });

  // Calculate dimensions
  let width = img.naturalWidth;
  let height = img.naturalHeight;

  if (width === 0 || height === 0) {
    throw new Error('Изображение имеет недопустимый размер (0×0).');
  }

  if (resizeMax && (width > resizeMax || height > resizeMax)) {
    if (width > height) {
      height = Math.round((height * resizeMax) / width);
      width = resizeMax;
    } else {
      width = Math.round((width * resizeMax) / height);
      height = resizeMax;
    }
  }

  // Create offscreen canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Не удалось инициализировать 2D контекст.');
  }

  // Fill white background for JPEG/JPG (no alpha channel)
  if (format === 'jpeg' || format === 'jpg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Draw original image (potentially resized)
  ctx.drawImage(img, 0, 0, width, height);

  // Resolve MIME type
  const mimeMap: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    avif: 'image/avif',
    bmp: 'image/bmp',
    gif: 'image/gif',
    ico: 'image/x-icon',
    tiff: 'image/tiff',
  };
  const mimeType = mimeMap[format] || `image/${format}`;
  const compressionQuality = (format === 'png' || format === 'bmp' || format === 'gif' || format === 'ico' || format === 'tiff') ? undefined : quality;

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), mimeType, compressionQuality);
  });

  if (!blob) {
    throw new Error('Сжатие изображения завершилось с ошибкой.');
  }

  const url = URL.createObjectURL(blob);

  // Image conversion is instant — report 100%
  _onProgress?.(100);

  return { blob, url };
}
