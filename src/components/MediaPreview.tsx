import { useEffect, useState } from 'react';
import { FileImage, Film, Music } from 'lucide-react';
import type { MediaType } from '../types/media';

interface MediaPreviewProps {
  file: File;
  mediaType: MediaType;
  className?: string;
}

export function MediaPreview({ file, mediaType, className = '' }: MediaPreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const iconFallback = () => {
    switch (mediaType) {
      case 'image':
        return <FileImage className="w-5 h-5 text-sky-400" />;
      case 'video':
        return <Film className="w-5 h-5 text-purple-400" />;
      case 'audio':
        return <Music className="w-5 h-5 text-amber-400" />;
    }
  };

  if (mediaType === 'image' && previewUrl) {
    return (
      <div className={`rounded-xl overflow-hidden border border-white/80 flex-shrink-0 bg-slate-200 ${className}`}>
        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
      </div>
    );
  }

  if (mediaType === 'video' && previewUrl) {
    return (
      <div className={`rounded-xl overflow-hidden border border-white/80 flex-shrink-0 bg-slate-900 ${className}`}>
        <video
          src={previewUrl}
          className="w-full h-full object-cover"
          muted
          preload="metadata"
          onLoadedData={(e) => {
            // Show first frame
            (e.target as HTMLVideoElement).currentTime = 0.1;
          }}
        />
      </div>
    );
  }

  // Audio or fallback
  return (
    <div className={`rounded-xl border border-white/80 flex-shrink-0 flex items-center justify-center ${
      mediaType === 'audio' ? 'bg-amber-50' : 'bg-slate-200'
    } ${className}`}>
      {iconFallback()}
    </div>
  );
}
