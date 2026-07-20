import { useState, useCallback, useEffect, useRef } from 'react';
import JSZip from 'jszip';
import type {
  MediaItem,
  ImageSettings,
  VideoSettings,
  AudioSettings,
  NamingType,
  UseMediaConverterReturn,
  OutputFormat,
  MediaType,
} from '../types/media';
import { detectMediaType, getConvertedFilename, generateId } from '../utils/formatHelpers';
import { convertImage } from './useImageEngine';
import { convertVideo, convertAudio, isFFmpegLoaded } from './useFFmpegEngine';

const DEFAULT_IMAGE_SETTINGS: ImageSettings = {
  format: 'webp',
  quality: 0.85,
  resizeMax: null,
  targetSizeMb: null,
};

const DEFAULT_VIDEO_SETTINGS: VideoSettings = {
  format: 'mp4',
  codec: 'h264',
  videoBitrate: 'auto',
  fps: null,
  resolution: null,
  trimStart: null,
  trimEnd: null,
  targetSizeMb: null,
};

const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  format: 'mp3',
  bitrate: '192k',
  sampleRate: null,
  trimStart: null,
  trimEnd: null,
};

export function useMediaConverter(
  onConversionSuccess?: (
    fileName: string,
    outputName: string,
    mediaType: MediaType,
    originalSize: number,
    convertedSize: number
  ) => void
): UseMediaConverterReturn {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [imageSettings, setImageSettingsState] = useState<ImageSettings>(DEFAULT_IMAGE_SETTINGS);
  const [videoSettings, setVideoSettingsState] = useState<VideoSettings>(DEFAULT_VIDEO_SETTINGS);
  const [audioSettings, setAudioSettingsState] = useState<AudioSettings>(DEFAULT_AUDIO_SETTINGS);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [namingType, setNamingType] = useState<NamingType>('suffix');
  const [customPrefix, setCustomPrefix] = useState('file');
  const [customSuffix, setCustomSuffix] = useState('_converted');
  const [ffmpegLoaded, setFfmpegLoaded] = useState(isFFmpegLoaded());
  const [ffmpegLoading, setFfmpegLoading] = useState(false);

  // Track abort for cleanup
  const abortRef = useRef(false);

  // Revoke blob URLs on unmount
  useEffect(() => {
    return () => {
      items.forEach((item) => {
        if (item.convertedUrl) {
          URL.revokeObjectURL(item.convertedUrl);
        }
      });
    };
  }, [items]);

  // ─── File Management ─────────────────────────────────────────

  const handleFilesAdd = useCallback((newFiles: File[] | FileList) => {
    const fileList = Array.isArray(newFiles) ? newFiles : Array.from(newFiles);

    const validItems: MediaItem[] = [];
    let hasInvalid = false;

    fileList.forEach((file) => {
      const mediaType = detectMediaType(file);
      if (mediaType) {
        validItems.push({
          id: generateId(),
          file,
          mediaType,
          status: 'idle',
          progress: 0,
          convertedUrl: null,
          convertedSize: null,
          convertedBlob: null,
          error: null,
        });
      } else {
        hasInvalid = true;
      }
    });

    if (hasInvalid) {
      setError('Некоторые файлы не были добавлены — неподдерживаемый формат.');
    } else {
      setError(null);
    }

    if (validItems.length > 0) {
      setItems((prev) => [...prev, ...validItems]);

      // Extract metadata for video/audio files
      validItems.forEach((item) => {
        if (item.mediaType === 'video' || item.mediaType === 'audio') {
          extractMediaMetadata(item);
        } else if (item.mediaType === 'image') {
          extractImageMetadata(item);
        }
      });
    }
  }, []);

  const extractMediaMetadata = (item: MediaItem) => {
    const el = document.createElement(item.mediaType === 'video' ? 'video' : 'audio');
    el.preload = 'metadata';
    const url = URL.createObjectURL(item.file);
    el.src = url;

    el.onloadedmetadata = () => {
      setItems((prev) =>
        prev.map((p) =>
          p.id === item.id
            ? {
                ...p,
                duration: el.duration,
                ...(item.mediaType === 'video'
                  ? { width: (el as HTMLVideoElement).videoWidth, height: (el as HTMLVideoElement).videoHeight }
                  : {}),
              }
            : p
        )
      );
      URL.revokeObjectURL(url);
    };

    el.onerror = () => {
      URL.revokeObjectURL(url);
    };
  };

  const extractImageMetadata = (item: MediaItem) => {
    const img = new Image();
    const url = URL.createObjectURL(item.file);
    img.onload = () => {
      setItems((prev) =>
        prev.map((p) =>
          p.id === item.id
            ? { ...p, width: img.naturalWidth, height: img.naturalHeight }
            : p
        )
      );
      URL.revokeObjectURL(url);
    };
    img.onerror = () => URL.revokeObjectURL(url);
    img.src = url;
  };

  const removeFile = useCallback((id: string) => {
    setItems((prev) => {
      const itemToRemove = prev.find((item) => item.id === id);
      if (itemToRemove?.convertedUrl) {
        URL.revokeObjectURL(itemToRemove.convertedUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
  }, []);

  const clearFiles = useCallback(() => {
    abortRef.current = true;
    setItems((prev) => {
      prev.forEach((item) => {
        if (item.convertedUrl) {
          URL.revokeObjectURL(item.convertedUrl);
        }
      });
      return [];
    });
    setIsConverting(false);
    setError(null);
  }, []);

  // ─── Settings Setters ────────────────────────────────────────

  const setImageSettings = useCallback((patch: Partial<ImageSettings>) => {
    setImageSettingsState((prev) => ({ ...prev, ...patch }));
  }, []);

  const setVideoSettings = useCallback((patch: Partial<VideoSettings>) => {
    setVideoSettingsState((prev) => ({ ...prev, ...patch }));
  }, []);

  const setAudioSettings = useCallback((patch: Partial<AudioSettings>) => {
    setAudioSettingsState((prev) => ({ ...prev, ...patch }));
  }, []);

  // ─── Conversion ──────────────────────────────────────────────

  const convertAll = useCallback(async () => {
    if (items.length === 0) {
      setError('Список файлов пуст.');
      return;
    }

    abortRef.current = false;
    setIsConverting(true);
    setError(null);

    const itemsToConvert = [...items];

    // Process images concurrently, video/audio sequentially (FFmpeg is single-instance)
    const imageItems = itemsToConvert.filter((i) => i.mediaType === 'image');
    const mediaItems = itemsToConvert.filter((i) => i.mediaType === 'video' || i.mediaType === 'audio');

    // Helper: update item progress
    const updateProgress = (id: string, progress: number) => {
      setItems((prev) =>
        prev.map((p) => (p.id === id ? { ...p, progress } : p))
      );
    };

    // Helper: mark item as converting
    const markConverting = (id: string) => {
      setItems((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: 'converting', error: null, progress: 0 } : p))
      );
    };

    // Helper: mark item as success
    const markSuccess = (id: string, blob: Blob, url: string, oldUrl: string | null) => {
      if (oldUrl) URL.revokeObjectURL(oldUrl);

      // Trigger history callback
      const item = itemsToConvert.find((p) => p.id === id);
      if (item && onConversionSuccess) {
        const originalIndex = itemsToConvert.findIndex((p) => p.id === id);
        const format = item.mediaType === 'image'
          ? imageSettings.format
          : item.mediaType === 'video'
            ? videoSettings.format
            : audioSettings.format;

        const outputName = getConvertedFilename(
          item.file.name,
          format,
          namingType,
          customPrefix,
          customSuffix,
          originalIndex
        );
        onConversionSuccess(item.file.name, outputName, item.mediaType, item.file.size, blob.size);
      }

      setItems((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, status: 'success', convertedUrl: url, convertedSize: blob.size, convertedBlob: blob, progress: 100 }
            : p
        )
      );
    };

    // Helper: mark item as error
    const markError = (id: string, errMsg: string) => {
      setItems((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, status: 'error', error: errMsg }
            : p
        )
      );
    };

    const ffmpegLoadingChange = (loading: boolean) => {
      setFfmpegLoading(loading);
      if (!loading) setFfmpegLoaded(isFFmpegLoaded());
    };

    // ── Convert images (parallel, up to 6 at a time) ──
    const convertImageBatch = async () => {
      let activeIndex = 0;
      const CONCURRENCY = 6;

      const worker = async () => {
        while (!abortRef.current) {
          const idx = activeIndex++;
          if (idx >= imageItems.length) break;
          const item = imageItems[idx];

          markConverting(item.id);
          try {
            const { blob, url } = await convertImage(
              item.file,
              imageSettings,
              (pct) => updateProgress(item.id, pct)
            );
            markSuccess(item.id, blob, url, item.convertedUrl);
          } catch (err: any) {
            markError(item.id, err?.message || 'Ошибка конвертации изображения.');
          }
        }
      };

      const workerCount = Math.min(CONCURRENCY, imageItems.length);
      await Promise.all(Array.from({ length: workerCount }, worker));
    };

    // ── Convert video/audio (sequential — FFmpeg is single-threaded) ──
    const convertMediaSequential = async () => {
      for (const item of mediaItems) {
        if (abortRef.current) break;

        markConverting(item.id);
        try {
          let result: { blob: Blob; url: string };
          if (item.mediaType === 'video') {
            result = await convertVideo(
              item.file,
              videoSettings,
              (pct) => updateProgress(item.id, pct),
              ffmpegLoadingChange
            );
          } else {
            result = await convertAudio(
              item.file,
              audioSettings,
              (pct) => updateProgress(item.id, pct),
              ffmpegLoadingChange
            );
          }
          markSuccess(item.id, result.blob, result.url, item.convertedUrl);
        } catch (err: any) {
          markError(item.id, err?.message || 'Ошибка конвертации.');
        }
      }
    };

    // Run images and media concurrently (images batch + media sequential)
    await Promise.all([convertImageBatch(), convertMediaSequential()]);
    setIsConverting(false);
  }, [items, imageSettings, videoSettings, audioSettings]);

  // ─── Download ZIP ────────────────────────────────────────────

  const downloadAllZip = useCallback(async () => {
    const successItems = items.filter((item) => item.status === 'success' && item.convertedBlob);
    if (successItems.length === 0) {
      setError('Нет успешно сконвертированных файлов для скачивания.');
      return;
    }

    setError(null);
    const zip = new JSZip();
    const usedFilenames = new Set<string>();

    successItems.forEach((item) => {
      if (item.convertedBlob) {
        const originalIndex = items.findIndex((p) => p.id === item.id);

        // Determine the output format based on media type
        let format: OutputFormat;
        if (item.mediaType === 'image') format = imageSettings.format;
        else if (item.mediaType === 'video') format = videoSettings.format;
        else format = audioSettings.format;

        let filename = getConvertedFilename(
          item.file.name,
          format,
          namingType,
          customPrefix,
          customSuffix,
          originalIndex
        );

        // De-duplicate filename
        if (usedFilenames.has(filename)) {
          const lastDotIndex = filename.lastIndexOf('.');
          const baseName = lastDotIndex !== -1 ? filename.substring(0, lastDotIndex) : filename;
          const ext = lastDotIndex !== -1 ? filename.substring(lastDotIndex + 1) : String(format);

          let counter = 1;
          let newFilename = `${baseName} (${counter}).${ext}`;
          while (usedFilenames.has(newFilename)) {
            counter++;
            newFilename = `${baseName} (${counter}).${ext}`;
          }
          filename = newFilename;
        }

        usedFilenames.add(filename);
        zip.file(filename, item.convertedBlob);
      }
    });

    try {
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipUrl = URL.createObjectURL(zipBlob);

      const link = document.createElement('a');
      link.href = zipUrl;
      link.download = `converted_media_${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(zipUrl), 100);
    } catch {
      setError('Не удалось создать ZIP-архив.');
    }
  }, [items, imageSettings.format, videoSettings.format, audioSettings.format, namingType, customPrefix, customSuffix]);

  // ─── Return ──────────────────────────────────────────────────

  return {
    items,
    imageSettings,
    videoSettings,
    audioSettings,
    isConverting,
    error,
    namingType,
    customPrefix,
    customSuffix,
    ffmpegLoaded,
    ffmpegLoading,

    handleFilesAdd,
    removeFile,
    clearFiles,

    setImageSettings,
    setVideoSettings,
    setAudioSettings,
    setNamingType,
    setCustomPrefix,
    setCustomSuffix,

    convertAll,
    downloadAllZip,
  };
}
