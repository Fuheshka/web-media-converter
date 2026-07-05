import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import type { VideoSettings, AudioSettings } from '../types/media';

let ffmpegInstance: FFmpeg | null = null;
let loadPromise: Promise<boolean> | null = null;

/**
 * Get or create a singleton FFmpeg instance.
 * Lazily loads the WASM core on first call.
 */
export async function getFFmpeg(
  onLoadingChange?: (loading: boolean) => void
): Promise<FFmpeg> {
  if (ffmpegInstance && ffmpegInstance.loaded) {
    return ffmpegInstance;
  }

  if (loadPromise) {
    await loadPromise;
    return ffmpegInstance!;
  }

  onLoadingChange?.(true);
  ffmpegInstance = new FFmpeg();

  loadPromise = ffmpegInstance.load({
    coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.js',
    wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.wasm',
  });

  try {
    await loadPromise;
  } catch (err) {
    loadPromise = null;
    ffmpegInstance = null;
    onLoadingChange?.(false);
    throw new Error('Не удалось загрузить FFmpeg. Проверьте подключение к интернету.');
  }

  onLoadingChange?.(false);
  return ffmpegInstance;
}

/**
 * Check if FFmpeg is already loaded.
 */
export function isFFmpegLoaded(): boolean {
  return !!ffmpegInstance?.loaded;
}

// ─── Video Conversion ──────────────────────────────────────────

function buildVideoArgs(
  inputName: string,
  outputName: string,
  settings: VideoSettings,
): string[] {
  const args: string[] = ['-i', inputName];

  // Trim
  if (settings.trimStart != null && settings.trimStart > 0) {
    args.push('-ss', String(settings.trimStart));
  }
  if (settings.trimEnd != null && settings.trimEnd > 0) {
    args.push('-to', String(settings.trimEnd));
  }

  // Codec
  if (settings.codec !== 'copy') {
    const codecMap: Record<string, string> = {
      h264: 'libx264',
      vp9: 'libvpx-vp9',
      h265: 'libx265',
    };
    args.push('-c:v', codecMap[settings.codec] || 'libx264');
  } else {
    args.push('-c:v', 'copy');
  }

  // Bitrate
  if (settings.videoBitrate !== 'auto' && settings.codec !== 'copy') {
    args.push('-b:v', settings.videoBitrate);
  }

  // FPS
  if (settings.fps != null && settings.codec !== 'copy') {
    args.push('-r', String(settings.fps));
  }

  // Resolution (scale filter)
  if (settings.resolution != null && settings.codec !== 'copy') {
    args.push('-vf', `scale=-2:${settings.resolution}`);
  }

  // Output format-specific
  if (settings.format === 'gif') {
    // For GIF output, override codec settings
    args.length = 0;
    args.push('-i', inputName);
    if (settings.trimStart != null && settings.trimStart > 0) {
      args.push('-ss', String(settings.trimStart));
    }
    if (settings.trimEnd != null && settings.trimEnd > 0) {
      args.push('-to', String(settings.trimEnd));
    }
    const scale = settings.resolution ? `scale=-1:${settings.resolution}` : 'scale=480:-1';
    args.push('-vf', `${scale},fps=${settings.fps || 10}`);
  }

  // Audio codec (copy for most, aac for mp4)
  if (settings.format !== 'gif') {
    if (settings.codec === 'copy') {
      args.push('-c:a', 'copy');
    } else {
      args.push('-c:a', 'aac');
    }
  } else {
    args.push('-an'); // No audio in GIF
  }

  args.push('-y', outputName);
  return args;
}

export async function convertVideo(
  file: File,
  settings: VideoSettings,
  onProgress?: (pct: number) => void,
  onLoadingChange?: (loading: boolean) => void,
): Promise<{ blob: Blob; url: string }> {
  const ffmpeg = await getFFmpeg(onLoadingChange);

  const inputExt = file.name.split('.').pop()?.toLowerCase() || 'mp4';
  const inputName = `input.${inputExt}`;
  const outputName = `output.${settings.format}`;

  // Set up progress listener
  let progressHandler: ((event: { progress: number }) => void) | null = null;
  if (onProgress) {
    progressHandler = ({ progress }: { progress: number }) => {
      onProgress(Math.min(Math.round(progress * 100), 99));
    };
    ffmpeg.on('progress', progressHandler);
  }

  try {
    // Write input file to FFmpeg's virtual filesystem
    const fileData = await fetchFile(file);
    await ffmpeg.writeFile(inputName, fileData);

    // Build and execute command
    const args = buildVideoArgs(inputName, outputName, settings);
    await ffmpeg.exec(args);

    // Read output
    const data = await ffmpeg.readFile(outputName);
    
    if (!(data instanceof Uint8Array) || data.length === 0) {
      throw new Error('FFmpeg не создал выходной файл.');
    }

    const buffer = new Uint8Array(data);

    const mimeMap: Record<string, string> = {
      mp4: 'video/mp4',
      webm: 'video/webm',
      avi: 'video/x-msvideo',
      mov: 'video/quicktime',
      mkv: 'video/x-matroska',
      gif: 'image/gif',
    };

    const blob = new Blob([buffer], { type: mimeMap[settings.format] || 'video/mp4' });
    const url = URL.createObjectURL(blob);

    onProgress?.(100);
    return { blob, url };
  } finally {
    // Clean up
    if (progressHandler) {
      ffmpeg.off('progress', progressHandler);
    }
    try { await ffmpeg.deleteFile(inputName); } catch { /* ignore */ }
    try { await ffmpeg.deleteFile(outputName); } catch { /* ignore */ }
  }
}

// ─── Audio Conversion ──────────────────────────────────────────

function buildAudioArgs(
  inputName: string,
  outputName: string,
  settings: AudioSettings,
): string[] {
  const args: string[] = ['-i', inputName];

  // Trim
  if (settings.trimStart != null && settings.trimStart > 0) {
    args.push('-ss', String(settings.trimStart));
  }
  if (settings.trimEnd != null && settings.trimEnd > 0) {
    args.push('-to', String(settings.trimEnd));
  }

  // No video
  args.push('-vn');

  // Codec based on format
  const codecMap: Record<string, string> = {
    mp3: 'libmp3lame',
    ogg: 'libvorbis',
    aac: 'aac',
    flac: 'flac',
    wav: 'pcm_s16le',
    m4a: 'aac',
  };
  args.push('-c:a', codecMap[settings.format] || 'aac');

  // Bitrate (not for lossless formats)
  if (settings.format !== 'wav' && settings.format !== 'flac') {
    args.push('-b:a', settings.bitrate);
  }

  // Sample rate
  if (settings.sampleRate != null) {
    args.push('-ar', String(settings.sampleRate));
  }

  args.push('-y', outputName);
  return args;
}

export async function convertAudio(
  file: File,
  settings: AudioSettings,
  onProgress?: (pct: number) => void,
  onLoadingChange?: (loading: boolean) => void,
): Promise<{ blob: Blob; url: string }> {
  const ffmpeg = await getFFmpeg(onLoadingChange);

  const inputExt = file.name.split('.').pop()?.toLowerCase() || 'mp3';
  const inputName = `input.${inputExt}`;
  const outputName = `output.${settings.format}`;

  let progressHandler: ((event: { progress: number }) => void) | null = null;
  if (onProgress) {
    progressHandler = ({ progress }: { progress: number }) => {
      onProgress(Math.min(Math.round(progress * 100), 99));
    };
    ffmpeg.on('progress', progressHandler);
  }

  try {
    const fileData = await fetchFile(file);
    await ffmpeg.writeFile(inputName, fileData);

    const args = buildAudioArgs(inputName, outputName, settings);
    await ffmpeg.exec(args);

    const data = await ffmpeg.readFile(outputName);

    if (!(data instanceof Uint8Array) || data.length === 0) {
      throw new Error('FFmpeg не создал выходной файл.');
    }

    const buffer = new Uint8Array(data);

    const mimeMap: Record<string, string> = {
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      ogg: 'audio/ogg',
      aac: 'audio/aac',
      flac: 'audio/flac',
      m4a: 'audio/mp4',
    };

    const blob = new Blob([buffer], { type: mimeMap[settings.format] || 'audio/mpeg' });
    const url = URL.createObjectURL(blob);

    onProgress?.(100);
    return { blob, url };
  } finally {
    if (progressHandler) {
      ffmpeg.off('progress', progressHandler);
    }
    try { await ffmpeg.deleteFile(inputName); } catch { /* ignore */ }
    try { await ffmpeg.deleteFile(outputName); } catch { /* ignore */ }
  }
}
