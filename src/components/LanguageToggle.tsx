import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function LanguageToggle() {
  const { lang, toggleLang } = useLanguage();

  return (
    <button
      onClick={toggleLang}
      className="px-3 py-2 rounded-full bg-white/40 dark:bg-black/30 border border-white/60 dark:border-white/10 backdrop-blur-md text-sky-700 dark:text-sky-300 hover:bg-white/60 dark:hover:bg-black/50 shadow-sm cursor-pointer transition-all duration-200 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
      title={lang === 'ru' ? 'Switch to English' : 'Переключить на русский'}
    >
      <Globe className="w-4 h-4 text-sky-500" />
      <span>{lang === 'ru' ? 'EN' : 'RU'}</span>
    </button>
  );
}
