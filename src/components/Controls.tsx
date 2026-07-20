import { Loader2, ArrowRight, Download, RefreshCw, Type, Maximize2, FileImage, Film, Music, ChevronDown, Zap } from 'lucide-react';
import type { MediaItem, ImageSettings, VideoSettings as VideoSettingsType, AudioSettings as AudioSettingsType, NamingType } from '../types/media';
import { IMAGE_FORMATS } from '../types/media';
import { formatSize } from '../utils/formatHelpers';
import { VideoSettings } from './VideoSettings';
import { AudioSettings } from './AudioSettings';
import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface ControlsProps {
  items: MediaItem[];
  totalCount: number;
  successCount: number;
  imageSettings: ImageSettings;
  videoSettings: VideoSettingsType;
  audioSettings: AudioSettingsType;
  isConverting: boolean;
  error: string | null;
  namingType: NamingType;
  customPrefix: string;
  customSuffix: string;
  ffmpegLoaded: boolean;
  ffmpegLoading: boolean;
  setImageSettings: (patch: Partial<ImageSettings>) => void;
  setVideoSettings: (patch: Partial<VideoSettingsType>) => void;
  setAudioSettings: (patch: Partial<AudioSettingsType>) => void;
  setNamingType: (type: NamingType) => void;
  setCustomPrefix: (prefix: string) => void;
  setCustomSuffix: (suffix: string) => void;
  onConvert: () => void;
  onDownloadZip: () => void;
  onClear: () => void;
}

function SectionAccordion({
  title,
  icon,
  defaultOpen = true,
  badge,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl bg-white/15 border border-white/30 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 cursor-pointer hover:bg-white/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-bold text-slate-700">{title}</span>
          {badge}
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-3 pb-3">
          {children}
        </div>
      )}
    </div>
  );
}

export function Controls({
  items,
  totalCount,
  successCount,
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
  setImageSettings,
  setVideoSettings,
  setAudioSettings,
  setNamingType,
  setCustomPrefix,
  setCustomSuffix,
  onConvert,
  onDownloadZip,
  onClear,
}: ControlsProps) {
  const { t } = useLanguage();
  const showQualitySlider = imageSettings.format === 'jpg' || imageSettings.format === 'jpeg' || imageSettings.format === 'webp';
  const allConverted = successCount === totalCount && totalCount > 0;

  // Count by type
  const hasImages = items.some((i) => i.mediaType === 'image');
  const hasVideo = items.some((i) => i.mediaType === 'video');
  const hasAudio = items.some((i) => i.mediaType === 'audio');
  const imageCount = items.filter((i) => i.mediaType === 'image').length;
  const videoCount = items.filter((i) => i.mediaType === 'video').length;
  const audioCount = items.filter((i) => i.mediaType === 'audio').length;

  // Calculate total savings
  const successItems = items.filter((item) => item.status === 'success');
  const totalOriginal = successItems.reduce((acc, item) => acc + item.file.size, 0);
  const totalConverted = successItems.reduce((acc, item) => acc + (item.convertedSize || 0), 0);
  const totalSaved = totalOriginal - totalConverted;
  const totalSavedPercent = totalOriginal > 0 ? Math.round((totalSaved / totalOriginal) * 100) : 0;
  const isSmaller = totalSaved > 0;
  const isBigger = totalSaved < 0;

  return (
    <div className="flex flex-col gap-4">
      {/* FFmpeg Loading Status */}
      {ffmpegLoading && (
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-purple-50 border border-purple-200/50 text-sm">
          <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />
          <span className="text-purple-700 font-semibold text-xs">{t.ffmpegLoading}</span>
        </div>
      )}

      {(hasVideo || hasAudio) && ffmpegLoaded && !ffmpegLoading && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/50">
          <Zap className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-emerald-700 font-semibold text-[10px]">{t.ffmpegReady}</span>
        </div>
      )}

      {/* ─── Image Settings ─── */}
      {hasImages && (
        <SectionAccordion
          title={t.imagesSection}
          icon={<FileImage className="w-4 h-4 text-sky-500" />}
          badge={<span className="text-[10px] font-bold text-sky-600 bg-sky-100 px-1.5 py-0.5 rounded-md">{imageCount}</span>}
        >
          <div className="flex flex-col gap-4">
            {/* Format */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                {t.format}
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {IMAGE_FORMATS.filter((f) => f !== 'jpeg').map((format) => (
                  <button
                    key={format}
                    type="button"
                    onClick={() => setImageSettings({ format })}
                    disabled={isConverting}
                    className={`py-2 rounded-2xl border text-xs font-bold transition-all duration-200 cursor-pointer ${
                      imageSettings.format === format
                        ? 'aero-btn-blue border-transparent'
                        : 'aero-btn-glass border-transparent bg-white/20 hover:bg-white/40'
                    }`}
                  >
                    {format.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Resize */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-semibold text-slate-500 flex items-center gap-1.5 cursor-pointer select-none uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={imageSettings.resizeMax !== null}
                  onChange={(e) => setImageSettings({ resizeMax: e.target.checked ? 1920 : null })}
                  disabled={isConverting}
                  className="w-3.5 h-3.5 rounded text-sky-600 bg-white/40 border-sky-300 accent-sky-500 cursor-pointer"
                />
                <Maximize2 className="w-3.5 h-3.5 text-sky-500" />
                {t.resize}
              </label>
              {imageSettings.resizeMax !== null && (
                <div className="grid grid-cols-4 gap-1">
                  {([800, 1200, 1920, 2560] as number[]).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setImageSettings({ resizeMax: size })}
                      disabled={isConverting}
                      className={`py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                        imageSettings.resizeMax === size
                          ? 'aero-btn-blue border-transparent'
                          : 'aero-btn-glass border-transparent bg-white/15 hover:bg-white/30'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quality */}
            {showQualitySlider && (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{t.quality}</span>
                  <span className="text-sky-600 font-extrabold text-sm">{Math.round(imageSettings.quality * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={imageSettings.quality}
                  onChange={(e) => setImageSettings({ quality: parseFloat(e.target.value) })}
                  disabled={isConverting}
                  className="w-full h-1 my-1"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-semibold">
                  <span>{t.smallerSize}</span>
                  <span>{t.betterQuality}</span>
                </div>
              </div>
            )}
          </div>
        </SectionAccordion>
      )}

      {/* ─── Video Settings ─── */}
      {hasVideo && (
        <SectionAccordion
          title={t.videoSection}
          icon={<Film className="w-4 h-4 text-purple-500" />}
          badge={<span className="text-[10px] font-bold text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded-md">{videoCount}</span>}
        >
          <VideoSettings settings={videoSettings} onChange={setVideoSettings} disabled={isConverting} />
        </SectionAccordion>
      )}

      {/* ─── Audio Settings ─── */}
      {hasAudio && (
        <SectionAccordion
          title={t.audioSection}
          icon={<Music className="w-4 h-4 text-amber-500" />}
          badge={<span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-md">{audioCount}</span>}
        >
          <AudioSettings settings={audioSettings} onChange={setAudioSettings} disabled={isConverting} />
        </SectionAccordion>
      )}

      {/* ─── Naming Options ─── */}
      <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white/20 border border-white/40">
        <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5 mb-1">
          <Type className="w-4 h-4 text-sky-500" />
          {t.namingTitle}
        </label>
        <div className="grid grid-cols-3 gap-1 mb-2">
          {([
            { key: 'original', label: t.namingOriginal },
            { key: 'suffix', label: t.namingSuffix },
            { key: 'custom', label: t.namingCustom },
          ] as { key: NamingType; label: string }[]).map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setNamingType(opt.key)}
              disabled={isConverting}
              className={`py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                namingType === opt.key
                  ? 'aero-btn-blue border-transparent'
                  : 'aero-btn-glass border-transparent bg-white/15 hover:bg-white/30'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {namingType === 'suffix' && (
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-slate-500">{t.addToName}</span>
            <input
              type="text"
              value={customSuffix}
              onChange={(e) => setCustomSuffix(e.target.value)}
              disabled={isConverting}
              placeholder="_converted"
              className="aero-input px-3 py-1.5 rounded-xl text-xs"
            />
          </div>
        )}

        {namingType === 'custom' && (
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-slate-500">{t.namePrefix}</span>
            <input
              type="text"
              value={customPrefix}
              onChange={(e) => setCustomPrefix(e.target.value)}
              disabled={isConverting}
              placeholder="file"
              className="aero-input px-3 py-1.5 rounded-xl text-xs"
            />
          </div>
        )}

        <div className="text-[10px] text-slate-500 mt-1 italic">
          {t.example}: {namingType === 'original' && `photo.jpg`}
          {namingType === 'suffix' && `photo${customSuffix || '_converted'}.jpg`}
          {namingType === 'custom' && `${customPrefix || 'file'}_001.mp4`}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-sm font-semibold text-rose-700 bg-rose-100 border border-rose-200 px-4 py-2.5 rounded-2xl">
          {error}
        </div>
      )}

      {/* Total Savings Summary */}
      {successCount > 0 && totalOriginal > 0 && (
        <div className={`p-4 rounded-2xl flex flex-col gap-1 text-center shadow-sm border ${
          isSmaller
            ? 'border-emerald-500/35 bg-emerald-500/10'
            : isBigger
              ? 'border-amber-500/35 bg-amber-500/10'
              : 'border-slate-500/20 bg-slate-500/5'
        }`}>
          <span className={`text-xs uppercase tracking-wider font-bold ${
            isSmaller
              ? 'text-emerald-800'
              : isBigger
                ? 'text-amber-800'
                : 'text-slate-700'
          }`}>
            {isSmaller
              ? t.totalSavings
              : isBigger
                ? t.sizeChange
                : t.sizeUnchanged}
          </span>
          <div className="flex justify-center items-baseline gap-2 mt-1">
            <span className={`text-2xl font-black ${
              isSmaller
                ? 'text-emerald-600'
                : isBigger
                  ? 'text-amber-600'
                  : 'text-slate-600'
            }`}>
              {isSmaller
                ? `-${totalSavedPercent}%`
                : isBigger
                  ? `+${Math.abs(totalSavedPercent)}%`
                  : '0%'}
            </span>
            {totalSaved !== 0 && (
              <span className="text-sm font-semibold text-slate-600">
                ({formatSize(Math.abs(totalSaved))})
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">
            {isSmaller
              ? `${formatSize(totalOriginal)} → ${formatSize(totalConverted)}`
              : isBigger
                ? `${formatSize(totalOriginal)} → ${formatSize(totalConverted)}`
                : `${formatSize(totalOriginal)}`
            }
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        {/* Download ZIP */}
        {successCount > 0 && (
          <button
            type="button"
            onClick={onDownloadZip}
            disabled={isConverting}
            className="w-full py-3.5 rounded-2xl aero-btn-green flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            <span>{t.downloadZip} ({successCount})</span>
          </button>
        )}

        {/* Convert All */}
        {(!allConverted || isConverting) && (
          <button
            type="button"
            onClick={onConvert}
            disabled={isConverting || totalCount === 0}
            className="w-full py-3.5 rounded-2xl aero-btn-blue flex items-center justify-center gap-2 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isConverting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t.converting}</span>
              </>
            ) : (
              <>
                <span>{t.convertAll} ({totalCount})</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        )}

        {/* Clear */}
        <button
          type="button"
          onClick={onClear}
          disabled={isConverting}
          className="w-full py-3 rounded-2xl aero-btn-glass flex items-center justify-center gap-2 cursor-pointer disabled:opacity-30"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{t.clearAll}</span>
        </button>
      </div>
    </div>
  );
}
