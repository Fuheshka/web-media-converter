import { useEffect } from 'react';
import { useMediaConverter } from './hooks/useMediaConverter';
import { ConverterCard } from './components/ConverterCard';
import { DropZone } from './components/DropZone';
import { FileList } from './components/FileList';
import { Controls } from './components/Controls';
import { Sparkles } from 'lucide-react';

function App() {
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
  } = useMediaConverter();

  const successCount = items.filter((item) => item.status === 'success').length;

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


  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between py-12 px-4 md:px-8 select-none overflow-hidden z-10">
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
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/40 border border-white/60 text-xs font-bold text-sky-700 tracking-wider uppercase backdrop-blur-md shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
          <span>Конвертация в браузере</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-900 via-sky-700 to-emerald-800 drop-shadow-sm py-2">
          Web Media Converter
        </h1>
        <p className="text-sm md:text-base font-semibold text-sky-900/80 max-w-md">
          Конвертируйте изображения, видео и аудио прямо в браузере. Быстро, безопасно, без загрузки на сервер.
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
                />
                <DropZone onFileSelect={handleFilesAdd} compact />
              </div>
              
              {/* Vertical Divider (Desktop) */}
              <div className="hidden md:block w-px bg-white/50 self-stretch my-1 col-span-1 justify-self-center"></div>

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
      <footer className="relative z-10 w-full text-center text-xs text-sky-900/60 font-semibold mt-8">
        <p>
          &copy; {new Date().getFullYear()} Web Media Converter.
        </p>
        <p className="mt-1">
          Изображения обрабатываются через Canvas API, видео и аудио — через FFmpeg WebAssembly. Все вычисления локальны.
        </p>
      </footer>
    </div>
  );
}

export default App;
