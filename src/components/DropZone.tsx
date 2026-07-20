import React, { useRef, useState } from 'react';
import { Upload, Plus } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface DropZoneProps {
  onFileSelect: (files: File[]) => void;
  compact?: boolean;
}

export function DropZone({ onFileSelect, compact = false }: DropZoneProps) {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const filesArray = Array.from(fileList);
    if (filesArray.length > 0) {
      onFileSelect(filesArray);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Reset input so re-selecting the same file works
    if (e.target) e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  if (compact) {
    return (
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`w-full py-4 px-6 border border-dashed rounded-2xl cursor-pointer transition-all duration-200 flex items-center justify-center gap-3 ${
          isDragActive
            ? 'border-sky-500 bg-sky-500/10 shadow-[0_0_15px_rgba(14,165,233,0.2)]'
            : 'border-sky-300/60 bg-white/30 hover:border-sky-400 hover:bg-white/50'
        }`}
      >
        <Plus className={`w-5 h-5 ${isDragActive ? 'text-sky-600' : 'text-sky-500'}`} />
        <span className="text-sm font-semibold text-slate-700">
          {isDragActive ? t.dragActive : t.addMoreFiles}
        </span>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,video/*,audio/*"
          multiple
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`relative w-full aspect-[16/10] md:aspect-[16/9] flex flex-col items-center justify-center border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 group overflow-hidden ${
        isDragActive
          ? 'border-sky-500 bg-sky-500/10 shadow-[0_0_20px_rgba(14,165,233,0.25)]'
          : 'border-sky-300/50 bg-white/30 hover:border-sky-400/80 hover:bg-white/50'
      }`}
    >
      <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left px-6 relative z-10">
        <div className={`p-4 rounded-2xl border transition-all duration-300 flex-shrink-0 ${
          isDragActive 
            ? 'bg-sky-500 text-white border-sky-400 scale-110 shadow-lg' 
            : 'bg-gradient-to-b from-sky-400 to-sky-600 text-white border-sky-300 dark:bg-slate-800 dark:border-white/10 group-hover:scale-105 shadow-md'
        }`}>
          <Upload className="w-8 h-8" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-lg font-black text-sky-950 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-200">
            {t.dropFilesHere}
          </p>
          <p className="text-sm font-bold text-sky-900/90 dark:text-slate-300">
            {t.clickToSelect}
          </p>
          <div className="mt-1">
            <span className="inline-block text-xs font-extrabold text-sky-950 dark:text-sky-200 bg-white/80 dark:bg-sky-950/80 px-3 py-1 rounded-full border border-sky-300/80 dark:border-sky-800/80 shadow-2xs">
              {t.supportedFormats}
            </span>
          </div>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,video/*,audio/*"
        multiple
        className="hidden"
      />
    </div>
  );
}
