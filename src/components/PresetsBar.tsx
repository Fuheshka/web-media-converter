import { Zap, Globe, User, Video, Film, Music } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { ImageSettings, VideoSettings, AudioSettings } from '../types/media';

interface PresetsBarProps {
  setImageSettings: (patch: Partial<ImageSettings>) => void;
  setVideoSettings: (patch: Partial<VideoSettings>) => void;
  setAudioSettings: (patch: Partial<AudioSettings>) => void;
  disabled?: boolean;
}

export function PresetsBar({
  setImageSettings,
  setVideoSettings,
  setAudioSettings,
  disabled = false,
}: PresetsBarProps) {
  const { t } = useLanguage();

  const presets = [
    {
      id: 'web',
      label: t.presetWeb,
      icon: <Globe className="w-3.5 h-3.5 text-sky-500" />,
      apply: () => setImageSettings({ format: 'webp', quality: 0.8, resizeMax: 1920 }),
    },
    {
      id: 'avatar',
      label: t.presetAvatar,
      icon: <User className="w-3.5 h-3.5 text-emerald-500" />,
      apply: () => setImageSettings({ format: 'png', resizeMax: 512 }),
    },
    {
      id: 'reels',
      label: t.presetReels,
      icon: <Video className="w-3.5 h-3.5 text-purple-500" />,
      apply: () => setVideoSettings({ format: 'mp4', codec: 'h264', resolution: 1080, fps: 30 }),
    },
    {
      id: 'gif',
      label: t.presetGif,
      icon: <Film className="w-3.5 h-3.5 text-pink-500" />,
      apply: () => setVideoSettings({ format: 'gif', resolution: 480, fps: 15 }),
    },
    {
      id: 'audio',
      label: t.presetAudio,
      icon: <Music className="w-3.5 h-3.5 text-amber-500" />,
      apply: () => setAudioSettings({ format: 'mp3', bitrate: '128k', sampleRate: 44100 }),
    },
  ];

  return (
    <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/10">
      <div className="flex items-center gap-1.5 px-0.5">
        <Zap className="w-4 h-4 text-amber-500" />
        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
          {t.presetsTitle}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={preset.apply}
            disabled={disabled}
            className="px-2.5 py-1.5 rounded-xl bg-white/40 dark:bg-white/10 hover:bg-white/60 dark:hover:bg-white/20 border border-white/50 dark:border-white/5 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer transition-all duration-150 flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
          >
            {preset.icon}
            <span>{preset.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
