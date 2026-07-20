import { X, Trash2, FileImage, Film, Music, Check, HardDrive } from 'lucide-react';
import { formatSize } from '../utils/formatHelpers';
import type { HistoryRecord, ConversionStats } from '../hooks/useConversionHistory';
import { useLanguage } from '../context/LanguageContext';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryRecord[];
  stats: ConversionStats;
  onClear: () => void;
  onRemoveRecord: (id: string) => void;
}

export function HistoryDrawer({
  isOpen,
  onClose,
  history,
  stats,
  onClear,
  onRemoveRecord,
}: HistoryDrawerProps) {
  const { t, lang } = useLanguage();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <FileImage className="w-4 h-4 text-sky-500" />;
      case 'video':
        return <Film className="w-4 h-4 text-purple-500" />;
      case 'audio':
        return <Music className="w-4 h-4 text-amber-500" />;
      default:
        return null;
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-xs z-40 transition-opacity"
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md z-50 flex flex-col aero-window border-l border-white/30 dark:border-white/10 shadow-2xl animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/20 dark:border-white/10">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{t.historyTitle}</h2>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{t.historySubtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-white/20 dark:hover:bg-white/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats card */}
        {history.length > 0 && (
          <div className="p-4 m-4 rounded-2xl bg-white/20 dark:bg-black/25 border border-white/40 dark:border-white/5 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
              <HardDrive className="w-4 h-4 text-sky-500" />
              <span className="text-xs font-bold uppercase tracking-wider">{t.totalCompressed}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="flex flex-col">
                <span className="text-xl font-black text-slate-900 dark:text-slate-100">{stats.totalFiles}</span>
                <span className="text-[9px] font-bold text-slate-700 dark:text-slate-300 uppercase">{t.filesCount}</span>
              </div>
              <div className="flex flex-col border-x border-slate-300/40 dark:border-slate-700/40">
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  {stats.totalSaved > 0 ? `-${stats.totalSavedPercent}%` : '0%'}
                </span>
                <span className="text-[9px] font-bold text-slate-700 dark:text-slate-300 uppercase">{t.compressionPct}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-sky-600 dark:text-sky-400 truncate px-1">
                  {formatSize(stats.totalSaved)}
                </span>
                <span className="text-[9px] font-bold text-slate-700 dark:text-slate-300 uppercase">{t.totalSaved}</span>
              </div>
            </div>
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-2">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-3 py-12">
              <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800/50 text-slate-400">
                <Check className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{t.historyEmpty}</p>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1 max-w-[200px]">
                  {t.historyEmptySub}
                </p>
              </div>
            </div>
          ) : (
            history.map((record) => {
              const diff = record.originalSize - record.convertedSize;
              const savedPct = record.originalSize > 0 ? Math.round((diff / record.originalSize) * 100) : 0;
              const isSmaller = diff > 0;

              return (
                <div
                  key={record.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/30 dark:bg-black/15 border border-white/30 dark:border-white/5 hover:bg-white/40 dark:hover:bg-black/20 transition-all duration-150 group"
                >
                  <div className="p-2 rounded-lg bg-white/60 dark:bg-slate-800/80 border border-white/50 dark:border-white/5 flex-shrink-0">
                    {getIcon(record.mediaType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate" title={record.outputName}>
                      {record.outputName}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-700 dark:text-slate-300 font-semibold tabular-nums">
                      <span>{formatSize(record.originalSize)}</span>
                      <span>&rarr;</span>
                      <span className="font-bold text-sky-600 dark:text-sky-400">{formatSize(record.convertedSize)}</span>
                      {savedPct > 0 && isSmaller && (
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">(-{savedPct}%)</span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium mt-1">{formatDate(record.timestamp)}</p>
                  </div>
                  <button
                    onClick={() => onRemoveRecord(record.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer"
                    title={t.deleteFromHistory}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-4 border-t border-white/20 dark:border-white/10 flex gap-3">
            <button
              onClick={onClear}
              className="w-full py-2.5 rounded-xl aero-btn-glass text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-rose-500" />
              <span>{t.clearAll}</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
