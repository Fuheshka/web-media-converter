import { Film, Settings, Scissors } from 'lucide-react';
import type { VideoSettings as VideoSettingsType } from '../types/media';
import { VIDEO_FORMATS, VIDEO_CODECS, VIDEO_RESOLUTIONS, VIDEO_FPS_OPTIONS } from '../types/media';

interface VideoSettingsProps {
  settings: VideoSettingsType;
  onChange: (patch: Partial<VideoSettingsType>) => void;
  disabled: boolean;
}

export function VideoSettings({ settings, onChange, disabled }: VideoSettingsProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Format */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
          <Film className="w-4 h-4 text-purple-500" />
          Формат видео
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {VIDEO_FORMATS.map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => onChange({ format: fmt })}
              disabled={disabled}
              className={`py-2 rounded-2xl border text-sm font-bold transition-all duration-200 cursor-pointer ${
                settings.format === fmt
                  ? 'aero-btn-blue border-transparent'
                  : 'aero-btn-glass border-transparent bg-white/20 hover:bg-white/40'
              }`}
            >
              {fmt.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Codec */}
      {settings.format !== 'gif' && (
        <div className="flex flex-col gap-2 p-3 rounded-2xl bg-white/20 border border-white/40">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
            <Settings className="w-4 h-4 text-purple-500" />
            Кодек
          </label>
          <div className="grid grid-cols-2 gap-1">
            {VIDEO_CODECS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => onChange({ codec: c.value as VideoSettingsType['codec'] })}
                disabled={disabled}
                className={`py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  settings.codec === c.value
                    ? 'aero-btn-blue border-transparent'
                    : 'aero-btn-glass border-transparent bg-white/15 hover:bg-white/30'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Resolution & FPS */}
      {settings.codec !== 'copy' && (
        <div className="flex flex-col gap-3 p-3 rounded-2xl bg-white/20 border border-white/40">
          {/* Resolution */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Разрешение</span>
            <div className="grid grid-cols-3 gap-1">
              {VIDEO_RESOLUTIONS.map((r) => (
                <button
                  key={r.label}
                  type="button"
                  onClick={() => onChange({ resolution: r.value })}
                  disabled={disabled}
                  className={`py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    settings.resolution === r.value
                      ? 'aero-btn-blue border-transparent'
                      : 'aero-btn-glass border-transparent bg-white/15 hover:bg-white/30'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* FPS */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Частота кадров</span>
            <div className="grid grid-cols-4 gap-1">
              {VIDEO_FPS_OPTIONS.map((f) => (
                <button
                  key={f.label}
                  type="button"
                  onClick={() => onChange({ fps: f.value })}
                  disabled={disabled}
                  className={`py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    settings.fps === f.value
                      ? 'aero-btn-blue border-transparent'
                      : 'aero-btn-glass border-transparent bg-white/15 hover:bg-white/30'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trim */}
      <div className="flex flex-col gap-2 p-3 rounded-2xl bg-white/20 border border-white/40">
        <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
          <Scissors className="w-4 h-4 text-purple-500" />
          Обрезка
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-slate-500">Начало (сек)</span>
            <input
              type="number"
              min="0"
              step="0.1"
              value={settings.trimStart ?? ''}
              onChange={(e) => onChange({ trimStart: e.target.value ? parseFloat(e.target.value) : null })}
              disabled={disabled}
              placeholder="0"
              className="aero-input px-3 py-1.5 rounded-xl text-xs"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-slate-500">Конец (сек)</span>
            <input
              type="number"
              min="0"
              step="0.1"
              value={settings.trimEnd ?? ''}
              onChange={(e) => onChange({ trimEnd: e.target.value ? parseFloat(e.target.value) : null })}
              disabled={disabled}
              placeholder="до конца"
              className="aero-input px-3 py-1.5 rounded-xl text-xs"
            />
          </div>
        </div>
        <span className="text-[9px] text-slate-500 font-medium">
          Оставьте пустым, чтобы не обрезать.
        </span>
      </div>
    </div>
  );
}
