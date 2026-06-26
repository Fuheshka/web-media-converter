import React, { useRef, useState } from 'react';
import { Upload, Plus } from 'lucide-react';

interface DropZoneProps {
  onFileSelect: (files: File[]) => void;
  compact?: boolean;
}

export function DropZone({ onFileSelect, compact = false }: DropZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const filesArray = Array.from(fileList).filter((file) =>
      file.type.startsWith('image/')
    );
    if (filesArray.length > 0) {
      onFileSelect(filesArray);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
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
        className={`w-full py-4 px-6 border border-dashed rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center gap-3 ${
          isDragActive
            ? 'border-cyan-400 bg-cyan-500/5 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
            : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
        }`}
      >
        <Plus className={`w-5 h-5 ${isDragActive ? 'text-cyan-400' : 'text-slate-400'}`} />
        <span className="text-sm font-medium text-slate-300">
          {isDragActive ? 'Отпустите для загрузки' : 'Добавить еще изображения'}
        </span>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
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
      className={`relative w-full aspect-[16/10] md:aspect-[16/9] flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 group overflow-hidden ${
        isDragActive
          ? 'border-cyan-400 bg-cyan-500/5 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
          : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
      }`}
    >
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none"></div>
      
      <div className="flex flex-col items-center gap-4 text-center px-4 relative z-10">
        <div className={`p-4 rounded-full border border-white/10 transition-all duration-300 ${
          isDragActive 
            ? 'bg-cyan-500/20 text-cyan-400 border-cyan-400/30 scale-110' 
            : 'bg-white/5 text-slate-300 group-hover:text-white group-hover:scale-105 group-hover:border-white/20'
        }`}>
          <Upload className="w-8 h-8" />
        </div>
        <div>
          <p className="text-lg font-medium text-slate-200 group-hover:text-white transition-colors duration-200">
            Перетащите изображения сюда
          </p>
          <p className="text-sm text-slate-400 mt-1">
            или кликните для выбора на устройстве
          </p>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Поддерживается загрузка нескольких файлов (PNG, JPEG, WEBP, GIF и др.)
        </p>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden"
      />
    </div>
  );
}
