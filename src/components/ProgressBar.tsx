interface ProgressBarProps {
  progress: number; // 0–100
  className?: string;
}

export function ProgressBar({ progress, className = '' }: ProgressBarProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={`w-full h-2 rounded-full overflow-hidden bg-white/20 border border-white/30 ${className}`}>
      <div
        className="h-full rounded-full transition-all duration-300 ease-out"
        style={{
          width: `${clampedProgress}%`,
          background: 'linear-gradient(to right, #38bdf8, #0ea5e9, #0284c7)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 0 6px rgba(14,165,233,0.3)',
        }}
      />
    </div>
  );
}
