import { useEffect, useState } from 'react';
import { useMediaConverter } from './hooks/useMediaConverter';
import { useConversionHistory } from './hooks/useConversionHistory';
import { ConverterCard } from './components/ConverterCard';
import { DropZone } from './components/DropZone';
import { FileList } from './components/FileList';
import { Controls } from './components/Controls';
import { HistoryDrawer } from './components/HistoryDrawer';
import { LanguageToggle } from './components/LanguageToggle';
import { useLanguage } from './context/LanguageContext';
import { CompareModal } from './components/CompareModal';
import { Sparkles, Sun, Moon, History } from 'lucide-react';

function App() {
  const { t } = useLanguage();

  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    // System preferences fallback
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // History Drawer state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [compareItem, setCompareItem] = useState<{ originalFile: File; convertedBlob: Blob; name: string } | null>(null);

  // Load history hook
  const { history, stats, addRecord, clearHistory, removeRecord } = useConversionHistory();

  // Load media converter hook, passing addRecord as callback
  const {
    items,
    imageSettings,
    videoSettings,
    audioSettings,
    isConverting,
    error,
    namingType,
    customPrefix,
    customSuffix,
    ffmpegLoaded,
    ffmpegLoading,
    handleFilesAdd,
    removeFile,
    clearFiles,
    setImageSettings,
    setVideoSettings,
    setAudioSettings,
    setNamingType,
    setCustomPrefix,
    setCustomSuffix,
    convertAll,
    downloadAllZip,
  } = useMediaConverter(addRecord);

  const handleOpenCompare = (item: any, outputName: string) => {
    if (item.convertedBlob) {
      setCompareItem({
        originalFile: item.file,
        convertedBlob: item.convertedBlob,
        name: outputName,
      });
    }
  };

  const successCount = items.filter((item) => item.status === 'success').length;

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Support pasting files from clipboard (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const clipboardItems = e.clipboardData?.items;
      if (!clipboardItems) return;

      const pastedFiles: File[] = [];
      for (let i = 0; i < clipboardItems.length; i++) {
        const item = clipboardItems[i];
        if (item.type.startsWith('image/') || item.type.startsWith('video/') || item.type.startsWith('audio/')) {
          const file = item.getAsFile();
          if (file) {
            pastedFiles.push(file);
          }
        }
      }

      if (pastedFiles.length > 0) {
        handleFilesAdd(pastedFiles);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [handleFilesAdd]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between py-12 px-4 md:px-8 select-none overflow-hidden z-10 transition-colors duration-300">
      {/* Quick Controls (Language, Theme & History) */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-20 flex items-center gap-2">
        <LanguageToggle />
        <button
          onClick={() => setIsHistoryOpen(true)}
          className="p-3 rounded-full bg-white/40 dark:bg-black/30 border border-white/60 dark:border-white/10 backdrop-blur-md text-sky-700 dark:text-sky-300 hover:bg-white/60 dark:hover:bg-black/50 shadow-sm cursor-pointer transition-all duration-200"
          title={t.historyTitle}
        >
          <History className="w-5 h-5" />
        </button>
        <button
          onClick={toggleTheme}
          className="p-3 rounded-full bg-white/40 dark:bg-black/30 border border-white/60 dark:border-white/10 backdrop-blur-md text-sky-700 dark:text-sky-300 hover:bg-white/60 dark:hover:bg-black/50 shadow-sm cursor-pointer transition-all duration-200"
          title={t.toggleTheme}
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </div>

      {/* Floating Aero bubbles (Skeuomorphic organic elements) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-24 h-24 aero-bubble animate-float-slow left-[8%] top-[100%]"></div>
        <div className="absolute w-16 h-16 aero-bubble animate-float-medium left-[25%] top-[100%] [animation-delay:4s]"></div>
        <div className="absolute w-32 h-32 aero-bubble animate-float-slow left-[45%] top-[100%] [animation-delay:8s]"></div>
        <div className="absolute w-14 h-14 aero-bubble animate-float-fast left-[62%] top-[100%] [animation-delay:2s]"></div>
        <div className="absolute w-20 h-20 aero-bubble animate-float-medium left-[75%] top-[100%] [animation-delay:6s]"></div>
        <div className="absolute w-28 h-28 aero-bubble animate-float-slow left-[90%] top-[100%] [animation-delay:11s]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 w-full max-w-2xl mx-auto text-center mb-8 flex flex-col items-center gap-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-black/40 border border-white/80 dark:border-white/10 text-xs font-black text-sky-950 dark:text-sky-300 tracking-wider uppercase backdrop-blur-md shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span>{t.headerBadge}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-950 dark:text-slate-100 drop-shadow-sm py-1">
          {t.headerTitle}
        </h1>
        <p className="text-sm md:text-base font-extrabold text-slate-900 dark:text-sky-200 max-w-md">
          {t.headerSub}
        </p>
      </header>

      {/* Main Container */}
      <main className="relative z-10 w-full flex-1 flex items-center justify-center my-4">
        {items.length === 0 ? (
          <ConverterCard className="max-w-2xl mx-auto">
            <DropZone onFileSelect={handleFilesAdd} />
          </ConverterCard>
        ) : (
          <ConverterCard className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
              {/* Left pane: File List & Compact Uploader */}
              <div className="md:col-span-7 flex flex-col gap-6">
                <FileList
                  items={items}
                  imageSettings={imageSettings}
                  videoSettings={videoSettings}
                  audioSettings={audioSettings}
                  namingType={namingType}
                  customPrefix={customPrefix}
                  customSuffix={customSuffix}
                  onRemove={removeFile}
                  onCompare={handleOpenCompare}
                />
                <DropZone onFileSelect={handleFilesAdd} compact />
              </div>
              
              {/* Vertical Divider (Desktop) */}
              <div className="hidden md:block w-px bg-white/50 dark:bg-white/10 self-stretch my-1 col-span-1 justify-self-center"></div>

              {/* Right pane: Controls & Summary */}
              <div className="md:col-span-4 flex flex-col justify-between">
                <Controls
                  items={items}
                  totalCount={items.length}
                  successCount={successCount}
                  imageSettings={imageSettings}
                  videoSettings={videoSettings}
                  audioSettings={audioSettings}
                  isConverting={isConverting}
                  error={error}
                  namingType={namingType}
                  customPrefix={customPrefix}
                  customSuffix={customSuffix}
                  ffmpegLoaded={ffmpegLoaded}
                  ffmpegLoading={ffmpegLoading}
                  setImageSettings={setImageSettings}
                  setVideoSettings={setVideoSettings}
                  setAudioSettings={setAudioSettings}
                  setNamingType={setNamingType}
                  setCustomPrefix={setCustomPrefix}
                  setCustomSuffix={setCustomSuffix}
                  onConvert={convertAll}
                  onDownloadZip={downloadAllZip}
                  onClear={clearFiles}
                />
              </div>
            </div>
          </ConverterCard>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-xl mx-auto text-center text-xs text-slate-900 dark:text-slate-100 font-extrabold mt-8 px-4 py-2.5 rounded-2xl bg-white/40 dark:bg-black/30 border border-white/60 dark:border-white/10 backdrop-blur-md shadow-xs">
        <p>
          &copy; {new Date().getFullYear()} {t.footerCopy}
        </p>
        <p className="mt-1 opacity-90">
          {t.footerNote}
        </p>
      </footer>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        stats={stats}
        onClear={clearHistory}
        onRemoveRecord={removeRecord}
      />

      {/* Compare Modal */}
      <CompareModal
        isOpen={compareItem !== null}
        onClose={() => setCompareItem(null)}
        originalFile={compareItem?.originalFile || null}
        convertedBlob={compareItem?.convertedBlob || null}
        outputName={compareItem?.name || ''}
      />
    </div>
  );
}

export default App;
