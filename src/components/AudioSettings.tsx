import { Music, Scissors } from 'lucide-react';
import type { AudioSettings as AudioSettingsType } from '../types/media';
import { AUDIO_FORMATS, AUDIO_BITRATES, AUDIO_SAMPLE_RATES } from '../types/media';

interface AudioSettingsProps {
  settings: AudioSettingsType;
  onChange: (patch: Partial<AudioSettingsType>) => void;
  disabled: boolean;
}

export function AudioSettings({ settings, onChange, disabled }: AudioSettingsProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Format */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
          <Music className="w-4 h-4 text-amber-500" />
          Формат аудио
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {AUDIO_FORMATS.map((fmt) => (
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

      {/* Bitrate */}
      {settings.format !== 'wav' && settings.format !== 'flac' && (
        <div className="flex flex-col gap-2 p-3 rounded-2xl bg-white/20 border border-white/40">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Битрейт</span>
          <div className="grid grid-cols-3 gap-1">
            {AUDIO_BITRATES.map((b) => (
              <button
                key={b.value}
                type="button"
                onClick={() => onChange({ bitrate: b.value })}
                disabled={disabled}
                className={`py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  settings.bitrate === b.value
                    ? 'aero-btn-blue border-transparent'
                    : 'aero-btn-glass border-transparent bg-white/15 hover:bg-white/30'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sample Rate */}
      <div className="flex flex-col gap-2 p-3 rounded-2xl bg-white/20 border border-white/40">
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Частота дискретизации</span>
        <div className="grid grid-cols-2 gap-1">
          {AUDIO_SAMPLE_RATES.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => onChange({ sampleRate: s.value })}
              disabled={disabled}
              className={`py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                settings.sampleRate === s.value
                  ? 'aero-btn-blue border-transparent'
                  : 'aero-btn-glass border-transparent bg-white/15 hover:bg-white/30'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trim */}
      <div className="flex flex-col gap-2 p-3 rounded-2xl bg-white/20 border border-white/40">
        <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
          <Scissors className="w-4 h-4 text-amber-500" />
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
