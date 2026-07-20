import { useState } from 'react';
import { Trash2, Loader2, Check, AlertCircle, Download, Search, X, FileImage, Film, Music } from 'lucide-react';
import { getConvertedFilename, formatSize, formatDuration } from '../utils/formatHelpers';
import { ProgressBar } from './ProgressBar';
import { MediaPreview } from './MediaPreview';
import type { MediaItem, NamingType, ImageSettings, VideoSettings, AudioSettings, OutputFormat } from '../types/media';
import { useLanguage } from '../context/LanguageContext';

interface FileListProps {
  items: MediaItem[];
  imageSettings: ImageSettings;
  videoSettings: VideoSettings;
  audioSettings: AudioSettings;
  namingType: NamingType;
  customPrefix: string;
  customSuffix: string;
  onRemove: (id: string) => void;
}

function getMediaTypeIcon(mediaType: string) {
  switch (mediaType) {
    case 'image': return <FileImage className="w-3 h-3" />;
    case 'video': return <Film className="w-3 h-3" />;
    case 'audio': return <Music className="w-3 h-3" />;
    default: return null;
  }
}

function getMediaTypeColor(mediaType: string) {
  switch (mediaType) {
    case 'image': return 'text-sky-600 bg-sky-100 border-sky-200/50';
    case 'video': return 'text-purple-600 bg-purple-100 border-purple-200/50';
    case 'audio': return 'text-amber-600 bg-amber-100 border-amber-200/50';
    default: return 'text-slate-600 bg-slate-100 border-slate-200/50';
  }
}

function FileRow({
  item,
  format,
  namingType,
  customPrefix,
  customSuffix,
  index,
  onRemove,
}: {
  item: MediaItem;
  format: OutputFormat;
  namingType: NamingType;
  customPrefix: string;
  customSuffix: string;
  index: number;
  onRemove: () => void;
}) {
  const { t } = useLanguage();
  const originalSizeStr = formatSize(item.file.size);
  const convertedSizeStr = item.convertedSize ? formatSize(item.convertedSize) : '';

  const downloadName = getConvertedFilename(
    item.file.name,
    format,
    namingType,
    customPrefix,
    customSuffix,
    index
  );

  // Programmatic download — avoids Chrome blocking blob: URL anchors under COEP headers
  const handleDownload = () => {
    if (!item.convertedBlob) return;
    const url = URL.createObjectURL(item.convertedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  // Calculate savings
  let savingsText = '';
  let isSmaller = false;
  let isBigger = false;

  if (item.status === 'success' && item.convertedSize !== null) {
    const diff = item.file.size - item.convertedSize;
    isSmaller = diff > 0;
    isBigger = diff < 0;

    if (item.file.size > 0) {
      const pct = Math.round((diff / item.file.size) * 100);
      if (diff === 0) {
        savingsText = '0%';
      } else {
        savingsText = pct > 0 ? `-${pct}%` : `+${Math.abs(pct)}%`;
      }
    }
  }

  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/40 border border-white/50 hover:bg-white/60 transition-all duration-150 shadow-sm">
      {/* Mini-preview */}
      <MediaPreview file={item.file} mediaType={item.mediaType} className="w-12 h-12" />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-bold text-slate-800 truncate" title={downloadName}>
            {downloadName}
          </p>
          <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold border ${getMediaTypeColor(item.mediaType)}`}>
            {getMediaTypeIcon(item.mediaType)}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 flex-wrap">
          <span className="truncate max-w-[120px]" title={item.file.name}>
            {item.file.name}
          </span>
          <span>({originalSizeStr})</span>
          {/* Duration for video/audio */}
          {item.duration != null && item.duration > 0 && (
            <span className="text-slate-400">{formatDuration(item.duration)}</span>
          )}
          {/* Resolution for image/video */}
          {item.width != null && item.height != null && item.mediaType !== 'audio' && (
            <span className="text-slate-400">{item.width}×{item.height}</span>
          )}
          {item.status === 'success' && (
            <>
              <span>&rarr;</span>
              <span className="text-sky-600 font-bold">{convertedSizeStr}</span>
              {savingsText && (
                <span className={`font-bold px-1.5 py-0.5 rounded-md text-[10px] ${
                  isSmaller
                    ? 'text-emerald-700 bg-emerald-100 border border-emerald-200/50'
                    : isBigger
                      ? 'text-amber-700 bg-amber-100 border border-amber-200/50'
                      : 'text-slate-700 bg-slate-100 border border-slate-200/50'
                }`}>
                  {savingsText}
                </span>
              )}
            </>
          )}
        </div>

        {/* Progress bar for converting items */}
        {item.status === 'converting' && item.progress > 0 && item.progress < 100 && (
          <div className="mt-1.5 flex items-center gap-2">
            <ProgressBar progress={item.progress} className="flex-1" />
            <span className="text-[10px] font-bold text-sky-600 min-w-[32px] text-right">{item.progress}%</span>
          </div>
        )}
      </div>

      {/* Status & Actions */}
      <div className="flex items-center gap-2">
        {item.status === 'converting' && (
          <Loader2 className="w-5 h-5 text-sky-500 animate-spin" />
        )}

        {item.status === 'success' && item.convertedBlob && (
          <>
            <div className="text-emerald-600 bg-emerald-100 border border-emerald-200 p-0.5 rounded-full">
              <Check className="w-4 h-4" />
            </div>
            <button
              type="button"
              onClick={handleDownload}
              title={t.downloadThisFile}
              className="p-2 rounded-xl text-slate-500 hover:text-sky-600 hover:bg-white/80 transition-colors border border-transparent hover:border-white/40 shadow-none hover:shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>
          </>
        )}

        {item.status === 'error' && (
          <div className="text-rose-600 bg-rose-100 border border-rose-200 p-0.5 rounded-full" title={item.error || 'Error'}>
            <AlertCircle className="w-4 h-4" />
          </div>
        )}

        {item.status === 'idle' && (
          <div className="w-2.5 h-2.5 rounded-full bg-slate-400 mr-1"></div>
        )}

        <button
          onClick={onRemove}
          disabled={item.status === 'converting'}
          title={t.deleteFile}
          className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed border border-transparent hover:border-rose-200/25"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function FileList({
  items,
  imageSettings,
  videoSettings,
  audioSettings,
  namingType,
  customPrefix,
  customSuffix,
  onRemove,
}: FileListProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'idle' | 'converting' | 'success' | 'error'>('all');

  const getFormatForItem = (item: MediaItem): OutputFormat => {
    switch (item.mediaType) {
      case 'image': return imageSettings.format;
      case 'video': return videoSettings.format;
      case 'audio': return audioSettings.format;
    }
  };

  const filteredItems = items.filter((item, index) => {
    const format = getFormatForItem(item);
    const targetName = getConvertedFilename(
      item.file.name,
      format,
      namingType,
      customPrefix,
      customSuffix,
      index
    );

    const matchesSearch =
      item.file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      targetName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Count by type
  const imageCount = items.filter((i) => i.mediaType === 'image').length;
  const videoCount = items.filter((i) => i.mediaType === 'video').length;
  const audioCount = items.filter((i) => i.mediaType === 'audio').length;

  return (
    <div className="flex flex-col gap-4">
      {/* Search & Filter Header */}
      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {t.fileQueue} ({items.length})
          </span>
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
            {imageCount > 0 && (
              <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-sky-50 text-sky-600">
                <FileImage className="w-3 h-3" /> {imageCount}
              </span>
            )}
            {videoCount > 0 && (
              <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-600">
                <Film className="w-3 h-3" /> {videoCount}
              </span>
            )}
            {audioCount > 0 && (
              <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-600">
                <Music className="w-3 h-3" /> {audioCount}
              </span>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="aero-input pl-9 pr-8 py-2 w-full rounded-2xl text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap gap-1 px-1">
          {([
            { key: 'all', label: t.filterAll },
            { key: 'idle', label: t.filterIdle },
            { key: 'converting', label: t.filterConverting },
            { key: 'success', label: t.filterSuccess },
            { key: 'error', label: t.filterError },
          ] as { key: typeof statusFilter; label: string }[]).map((pill) => {
            const count = pill.key === 'all'
              ? items.length
              : items.filter((item) => item.status === pill.key).length;

            const isActive = statusFilter === pill.key;

            return (
              <button
                key={pill.key}
                type="button"
                onClick={() => setStatusFilter(pill.key)}
                className={`px-3 py-1 rounded-xl text-[10px] font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'aero-btn-blue text-[10px] py-1 px-3 shadow-sm'
                    : 'aero-btn-glass text-[10px] py-1 px-3 border-transparent bg-white/20 hover:bg-white/40'
                }`}
              >
                {pill.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Files List Container */}
      <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-1">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-sm font-semibold text-slate-400 border border-dashed border-sky-300/40 rounded-2xl bg-white/10">
            {t.noFilesFound}
          </div>
        ) : (
          filteredItems.map((item) => {
            const originalIndex = items.findIndex((p) => p.id === item.id);
            return (
              <FileRow
                key={item.id}
                item={item}
                format={getFormatForItem(item)}
                namingType={namingType}
                customPrefix={customPrefix}
                customSuffix={customSuffix}
                index={originalIndex}
                onRemove={() => onRemove(item.id)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
