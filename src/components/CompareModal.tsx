import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Download, SlidersHorizontal, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { formatSize } from '../utils/formatHelpers';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalFile: File | null;
  convertedBlob: Blob | null;
  outputName: string;
}

export function CompareModal({
  isOpen,
  onClose,
  originalFile,
  convertedBlob,
  outputName,
}: CompareModalProps) {
  const { t } = useLanguage();
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0..100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !originalFile || !convertedBlob) {
      setOriginalUrl(null);
      setConvertedUrl(null);
      return;
    }

    const origUrl = URL.createObjectURL(originalFile);
    const convUrl = URL.createObjectURL(convertedBlob);
    setOriginalUrl(origUrl);
    setConvertedUrl(convUrl);

    return () => {
      URL.revokeObjectURL(origUrl);
      URL.revokeObjectURL(convUrl);
    };
  }, [isOpen, originalFile, convertedBlob]);

  const updateSliderPosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateSliderPosition(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    updateSliderPosition(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      updateSliderPosition(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      updateSliderPosition(e.touches[0].clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, updateSliderPosition]);

  const handleDownload = () => {
    if (!convertedBlob || !convertedUrl) return;
    const a = document.createElement('a');
    a.href = convertedUrl;
    a.download = outputName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!isOpen || !originalFile || !convertedBlob || !originalUrl || !convertedUrl) {
    return null;
  }

  const origSize = originalFile.size;
  const convSize = convertedBlob.size;
  const diff = origSize - convSize;
  const pctSaved = origSize > 0 ? Math.round((diff / origSize) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[85vh] flex flex-col rounded-3xl aero-window overflow-hidden border border-white/40 dark:border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/30 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-600 dark:text-sky-400">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-slate-100">
                {t.compareTitle}
              </h2>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400 truncate max-w-xs sm:max-w-md">
                {originalFile.name} &rarr; {outputName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-white/50 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Compare Canvas Area */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className="relative flex-1 w-full bg-slate-900 overflow-hidden select-none cursor-ew-resize"
        >
          {/* Left / Base Image (Original) */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <img
              src={originalUrl}
              alt={t.compareOriginal}
              className="max-w-full max-h-full object-contain pointer-events-none"
            />
          </div>

          {/* Right Image (Converted) Clipped */}
          <div
            className="absolute inset-0 flex items-center justify-center p-4 overflow-hidden"
            style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
          >
            <img
              src={convertedUrl}
              alt={t.compareConverted}
              className="max-w-full max-h-full object-contain pointer-events-none"
            />
          </div>

          {/* Divider Line & Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white text-sky-600 shadow-xl border-2 border-sky-400 flex items-center justify-center text-xs font-black">
              &lsaquo;&rsaquo;
            </div>
          </div>

          {/* Floating Label Overlays */}
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-black/60 text-white backdrop-blur-md text-xs font-bold pointer-events-none">
            {t.compareOriginal}: {formatSize(origSize)}
          </div>
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-sky-600/90 text-white backdrop-blur-md text-xs font-bold pointer-events-none">
            {t.compareConverted}: {formatSize(convSize)} {pctSaved > 0 && `(-${pctSaved}%)`}
          </div>
        </div>

        {/* Footer Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3.5 border-t border-white/30 dark:border-white/10 bg-white/50 dark:bg-black/40 backdrop-blur-md">
          <div className="flex items-center gap-3 text-xs font-bold text-slate-800 dark:text-slate-200">
            <span className="flex items-center gap-1">
              <ImageIcon className="w-4 h-4 text-sky-500" />
              {t.totalSaved}:
            </span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
              pctSaved > 0
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                : 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
            }`}>
              {pctSaved > 0 ? `-${pctSaved}% (${formatSize(diff)})` : '0%'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white/40 hover:bg-white/60 dark:bg-white/10 transition-colors cursor-pointer"
            >
              Закрыть
            </button>
            <button
              onClick={handleDownload}
              className="aero-btn-blue px-5 py-2 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Download className="w-4 h-4" />
              {t.downloadThisFile}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
