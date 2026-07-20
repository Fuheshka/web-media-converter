// ─── Media Types ───────────────────────────────────────────────
export type MediaType = 'image' | 'video' | 'audio';

// ─── Format Types ──────────────────────────────────────────────
export type ImageFormat = 'jpg' | 'jpeg' | 'png' | 'webp' | 'avif' | 'bmp' | 'gif' | 'ico' | 'tiff';
export type VideoFormat = 'mp4' | 'webm' | 'avi' | 'mov' | 'mkv' | 'gif';
export type AudioFormat = 'mp3' | 'wav' | 'ogg' | 'aac' | 'flac' | 'm4a';

export type OutputFormat = ImageFormat | VideoFormat | AudioFormat;

// ─── Naming ────────────────────────────────────────────────────
export type NamingType = 'original' | 'suffix' | 'custom';

// ─── Conversion Status ────────────────────────────────────────
export type ConversionStatus = 'idle' | 'converting' | 'success' | 'error';

// ─── Media Item ────────────────────────────────────────────────
export interface MediaItem {
  id: string;
  file: File;
  mediaType: MediaType;
  status: ConversionStatus;
  progress: number; // 0–100 for video/audio, instant for images
  convertedUrl: string | null;
  convertedSize: number | null;
  convertedBlob: Blob | null;
  error: string | null;
  // Metadata (populated after file is added)
  duration?: number; // seconds — for video/audio
  width?: number;    // pixels — for image/video
  height?: number;   // pixels — for image/video
}

// ─── Settings ──────────────────────────────────────────────────
export interface ImageSettings {
  format: ImageFormat;
  quality: number; // 0.1–1.0
  resizeMax: number | null; // max dimension in px, null = no resize
  targetSizeMb: number | null; // target size in MB, null = disabled
}

export interface VideoSettings {
  format: VideoFormat;
  codec: 'h264' | 'vp9' | 'h265' | 'copy';
  videoBitrate: string; // e.g. '2M', '5M', 'auto'
  fps: number | null; // null = keep original
  resolution: number | null; // height in px, null = keep original (e.g. 1080, 720, 480)
  trimStart: number | null; // seconds
  trimEnd: number | null;   // seconds
  targetSizeMb: number | null; // target size in MB, null = disabled
}

export interface AudioSettings {
  format: AudioFormat;
  bitrate: string; // e.g. '128k', '192k', '320k'
  sampleRate: number | null; // e.g. 44100, 48000, null = keep original
  trimStart: number | null;
  trimEnd: number | null;
}

// ─── Converter Return Type ─────────────────────────────────────
export interface UseMediaConverterReturn {
  items: MediaItem[];
  imageSettings: ImageSettings;
  videoSettings: VideoSettings;
  audioSettings: AudioSettings;
  isConverting: boolean;
  error: string | null;
  namingType: NamingType;
  customPrefix: string;
  customSuffix: string;
  ffmpegLoaded: boolean;
  ffmpegLoading: boolean;

  // File management
  handleFilesAdd: (files: File[] | FileList) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;

  // Settings setters
  setImageSettings: (settings: Partial<ImageSettings>) => void;
  setVideoSettings: (settings: Partial<VideoSettings>) => void;
  setAudioSettings: (settings: Partial<AudioSettings>) => void;
  setNamingType: (type: NamingType) => void;
  setCustomPrefix: (prefix: string) => void;
  setCustomSuffix: (suffix: string) => void;

  // Actions
  convertAll: () => Promise<void>;
  downloadAllZip: () => Promise<void>;
}

// ─── MIME type helpers ─────────────────────────────────────────
export const IMAGE_MIME_PREFIXES = ['image/'] as const;
export const VIDEO_MIME_PREFIXES = ['video/'] as const;
export const AUDIO_MIME_PREFIXES = ['audio/'] as const;

export const IMAGE_FORMATS: ImageFormat[] = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'bmp', 'gif', 'ico', 'tiff'];
export const VIDEO_FORMATS: VideoFormat[] = ['mp4', 'webm', 'avi', 'mov', 'mkv', 'gif'];
export const AUDIO_FORMATS: AudioFormat[] = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'];

export const VIDEO_CODECS = [
  { value: 'h264', label: 'H.264' },
  { value: 'vp9', label: 'VP9' },
  { value: 'h265', label: 'H.265' },
  { value: 'copy', label: 'Без перекодирования' },
] as const;

export const VIDEO_RESOLUTIONS = [
  { value: null, label: 'Оригинал' },
  { value: 2160, label: '4K' },
  { value: 1080, label: '1080p' },
  { value: 720, label: '720p' },
  { value: 480, label: '480p' },
] as const;

export const VIDEO_FPS_OPTIONS = [
  { value: null, label: 'Оригинал' },
  { value: 24, label: '24' },
  { value: 30, label: '30' },
  { value: 60, label: '60' },
] as const;

export const AUDIO_BITRATES = [
  { value: '96k', label: '96 kbps' },
  { value: '128k', label: '128 kbps' },
  { value: '192k', label: '192 kbps' },
  { value: '256k', label: '256 kbps' },
  { value: '320k', label: '320 kbps' },
] as const;

export const AUDIO_SAMPLE_RATES = [
  { value: null, label: 'Оригинал' },
  { value: 22050, label: '22050 Hz' },
  { value: 44100, label: '44100 Hz' },
  { value: 48000, label: '48000 Hz' },
] as const;
