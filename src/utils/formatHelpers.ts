import type { MediaType, NamingType, OutputFormat } from '../types/media';

/**
 * Format byte size to human-readable string.
 */
export const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format seconds to mm:ss or hh:mm:ss string.
 */
export const formatDuration = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
};

/**
 * Detect media type from a File's MIME type.
 */
export const detectMediaType = (file: File): MediaType | null => {
  const mime = file.type.toLowerCase();
  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('video/')) return 'video';
  if (mime.startsWith('audio/')) return 'audio';
  
  // Fallback: detect by extension
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  const imageExts = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'bmp', 'gif', 'ico', 'tiff', 'tif', 'svg'];
  const videoExts = ['mp4', 'webm', 'avi', 'mov', 'mkv', 'flv', 'wmv', 'm4v', '3gp'];
  const audioExts = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a', 'wma', 'opus'];

  if (imageExts.includes(ext)) return 'image';
  if (videoExts.includes(ext)) return 'video';
  if (audioExts.includes(ext)) return 'audio';

  return null;
};

/**
 * Generate output filename based on naming rules.
 */
export const getConvertedFilename = (
  originalName: string,
  format: OutputFormat,
  namingType: NamingType,
  customPrefix: string,
  customSuffix: string,
  index: number
): string => {
  const lastDotIndex = originalName.lastIndexOf('.');
  const baseName = lastDotIndex !== -1 ? originalName.substring(0, lastDotIndex) : originalName;
  const ext = format;

  if (namingType === 'original') {
    return `${baseName}.${ext}`;
  } else if (namingType === 'suffix') {
    const suffix = customSuffix !== undefined ? customSuffix : '_converted';
    return `${baseName}${suffix}.${ext}`;
  } else {
    const prefix = customPrefix || 'file';
    const paddedIndex = String(index + 1).padStart(3, '0');
    return `${prefix}_${paddedIndex}.${ext}`;
  }
};

/**
 * Generate a unique ID for items.
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9) + '-' + Date.now();
};

/**
 * Get a human-readable media type label.
 */
export const getMediaTypeLabel = (type: MediaType): string => {
  switch (type) {
    case 'image': return 'Изображение';
    case 'video': return 'Видео';
    case 'audio': return 'Аудио';
  }
};

/**
 * Get file extension from filename.
 */
export const getFileExtension = (filename: string): string => {
  const lastDot = filename.lastIndexOf('.');
  return lastDot !== -1 ? filename.substring(lastDot + 1).toLowerCase() : '';
};
