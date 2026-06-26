import React from 'react';

interface ConverterCardProps {
  children: React.ReactNode;
  className?: string;
}

export function ConverterCard({ children, className = '' }: ConverterCardProps) {
  return (
    <div className={`w-full glass-panel rounded-2xl shadow-2xl p-6 md:p-8 animate-glow relative overflow-hidden ${className}`}>

      {/* Decorative background glow circles inside the card */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col gap-6">
        {children}
      </div>
    </div>
  );
}
