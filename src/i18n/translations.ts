export type Language = 'ru' | 'en';

export interface TranslationSchema {
  // Header & Quick Controls
  headerBadge: string;
  headerTitle: string;
  headerSub: string;
  historyTitle: string;
  toggleTheme: string;

  // DropZone
  dragActive: string;
  addMoreFiles: string;
  dropFilesHere: string;
  clickToSelect: string;
  supportedFormats: string;

  // FFmpeg status
  ffmpegLoading: string;
  ffmpegReady: string;

  // Accordion Titles & Badges
  imagesSection: string;
  videoSection: string;
  audioSection: string;

  // Presets
  presetsTitle: string;
  presetWeb: string;
  presetAvatar: string;
  presetReels: string;
  presetGif: string;
  presetAudio: string;

  // Settings - Common
  format: string;
  resize: string;
  quality: string;
  smallerSize: string;
  betterQuality: string;
  codec: string;
  resolution: string;
  fps: string;
  trim: string;
  trimStart: string;
  trimEnd: string;
  trimUntilEnd: string;
  trimHint: string;
  bitrate: string;
  sampleRate: string;

  // Naming Options
  namingTitle: string;
  namingOriginal: string;
  namingSuffix: string;
  namingCustom: string;
  addToName: string;
  namePrefix: string;
  example: string;

  // Summary & Actions
  totalSavings: string;
  sizeChange: string;
  sizeUnchanged: string;
  downloadZip: string;
  converting: string;
  convertAll: string;
  clearAll: string;

  // File List
  fileQueue: string;
  searchPlaceholder: string;
  filterAll: string;
  filterIdle: string;
  filterConverting: string;
  filterSuccess: string;
  filterError: string;
  noFilesFound: string;
  downloadThisFile: string;
  deleteFile: string;

  // History Drawer
  historySubtitle: string;
  totalCompressed: string;
  filesCount: string;
  compressionPct: string;
  totalSaved: string;
  historyEmpty: string;
  historyEmptySub: string;
  deleteFromHistory: string;

  // Compare & Target Size
  compareTitle: string;
  compareOriginal: string;
  compareConverted: string;
  openCompare: string;
  targetSizeLabel: string;
  targetSizeHint: string;
  presetDiscord8: string;
  presetDiscord25: string;
  presetEmail10: string;

  // Footer
  footerCopy: string;
  footerNote: string;
}

export const translations: Record<Language, TranslationSchema> = {
  ru: {
    // Header & Quick Controls
    headerBadge: 'Конвертация в браузере',
    headerTitle: 'Web Media Converter',
    headerSub: 'Конвертируйте изображения, видео и аудио прямо в браузере. Быстро, безопасно, без загрузки на сервер.',
    historyTitle: 'История конвертаций',
    toggleTheme: 'Сменить тему',

    // DropZone
    dragActive: 'Отпустите для загрузки',
    addMoreFiles: 'Добавить ещё файлы',
    dropFilesHere: 'Перетащите файлы сюда',
    clickToSelect: 'или кликните для выбора на устройстве',
    supportedFormats: 'Изображения, видео и аудио — PNG, JPG, WEBP, MP4, MP3, WAV и др.',

    // FFmpeg status
    ffmpegLoading: 'Загрузка FFmpeg…',
    ffmpegReady: 'FFmpeg готов',

    // Accordion Titles & Badges
    imagesSection: 'Изображения',
    videoSection: 'Видео',
    audioSection: 'Аудио',

    // Presets
    presetsTitle: 'Быстрые пресеты',
    presetWeb: 'Для веб-сайта (WebP 80%)',
    presetAvatar: 'Аватарка (512px PNG)',
    presetReels: 'Reels/Shorts (1080p MP4)',
    presetGif: 'Быстрый GIF (480p)',
    presetAudio: 'Аудио 128k MP3',

    // Settings - Common
    format: 'Формат',
    resize: 'Ресайз',
    quality: 'Качество',
    smallerSize: 'Меньший размер',
    betterQuality: 'Лучшее качество',
    codec: 'Кодек',
    resolution: 'Разрешение',
    fps: 'Частота кадров',
    trim: 'Обрезка',
    trimStart: 'Начало (сек)',
    trimEnd: 'Конец (сек)',
    trimUntilEnd: 'до конца',
    trimHint: 'Оставьте пустым, чтобы не обрезать.',
    bitrate: 'Битрейт',
    sampleRate: 'Частота дискретизации',

    // Naming Options
    namingTitle: 'Имена файлов',
    namingOriginal: 'Оригинал',
    namingSuffix: 'Суффикс',
    namingCustom: 'Своё имя',
    addToName: 'Добавить к имени:',
    namePrefix: 'Префикс названия:',
    example: 'Пример',

    // Summary & Actions
    totalSavings: 'Суммарная экономия',
    sizeChange: 'Изменение размера',
    sizeUnchanged: 'Размер не изменился',
    downloadZip: 'Скачать архив ZIP',
    converting: 'Обработка…',
    convertAll: 'Конвертировать всё',
    clearAll: 'Очистить всё',

    // File List
    fileQueue: 'Очередь файлов',
    searchPlaceholder: 'Поиск по названию…',
    filterAll: 'Все',
    filterIdle: 'Ожидают',
    filterConverting: 'В процессе',
    filterSuccess: 'Готово',
    filterError: 'Ошибки',
    noFilesFound: 'Файлы не найдены',
    downloadThisFile: 'Скачать этот файл',
    deleteFile: 'Удалить',

    // History Drawer
    historySubtitle: 'Локальные записи о сжатии',
    totalCompressed: 'Всего сжато',
    filesCount: 'Файлов',
    compressionPct: 'Сжатие',
    totalSaved: 'Сэкономлено',
    historyEmpty: 'История пуста',
    historyEmptySub: 'Здесь будут отображаться ваши сконвертированные файлы.',
    deleteFromHistory: 'Удалить из истории',

    // Compare & Target Size
    compareTitle: 'Сравнение «До / После»',
    compareOriginal: 'Оригинал',
    compareConverted: 'Результат',
    openCompare: 'Сравнить качество',
    targetSizeLabel: 'Целевой размер (МБ)',
    targetSizeHint: 'Авто-подбор качества под лимит',
    presetDiscord8: 'Discord (8 МБ)',
    presetDiscord25: 'Discord (25 МБ)',
    presetEmail10: 'Email (10 МБ)',

    // Footer
    footerCopy: 'Web Media Converter.',
    footerNote: 'Изображения обрабатываются через Canvas API, видео и аудио — через FFmpeg WebAssembly. Все вычисления локальны.',
  },
  en: {
    // Header & Quick Controls
    headerBadge: 'In-Browser Conversion',
    headerTitle: 'Web Media Converter',
    headerSub: 'Convert images, videos, and audio directly in your browser. Fast, secure, and 100% serverless.',
    historyTitle: 'Conversion History',
    toggleTheme: 'Toggle Theme',

    // DropZone
    dragActive: 'Drop files to upload',
    addMoreFiles: 'Add more files',
    dropFilesHere: 'Drag & drop files here',
    clickToSelect: 'or click to browse from device',
    supportedFormats: 'Images, videos & audio — PNG, JPG, WEBP, MP4, MP3, WAV, etc.',

    // FFmpeg status
    ffmpegLoading: 'Loading FFmpeg…',
    ffmpegReady: 'FFmpeg Ready',

    // Accordion Titles & Badges
    imagesSection: 'Images',
    videoSection: 'Video',
    audioSection: 'Audio',

    // Presets
    presetsTitle: 'Quick Presets',
    presetWeb: 'Web Optimized (WebP 80%)',
    presetAvatar: 'Avatar (512px PNG)',
    presetReels: 'Reels/Shorts (1080p MP4)',
    presetGif: 'Fast GIF (480p)',
    presetAudio: 'Audio 128k MP3',

    // Settings - Common
    format: 'Format',
    resize: 'Resize',
    quality: 'Quality',
    smallerSize: 'Smaller size',
    betterQuality: 'Best quality',
    codec: 'Codec',
    resolution: 'Resolution',
    fps: 'Frame Rate',
    trim: 'Trim',
    trimStart: 'Start (sec)',
    trimEnd: 'End (sec)',
    trimUntilEnd: 'until end',
    trimHint: 'Leave empty to keep full length.',
    bitrate: 'Bitrate',
    sampleRate: 'Sample Rate',

    // Naming Options
    namingTitle: 'Output File Names',
    namingOriginal: 'Original',
    namingSuffix: 'Suffix',
    namingCustom: 'Custom Name',
    addToName: 'Add to name:',
    namePrefix: 'Name prefix:',
    example: 'Example',

    // Summary & Actions
    totalSavings: 'Total Savings',
    sizeChange: 'Size Change',
    sizeUnchanged: 'Size Unchanged',
    downloadZip: 'Download ZIP Archive',
    converting: 'Processing...',
    convertAll: 'Convert All',
    clearAll: 'Clear All',

    // File List
    fileQueue: 'File Queue',
    searchPlaceholder: 'Search by filename...',
    filterAll: 'All',
    filterIdle: 'Pending',
    filterConverting: 'Converting',
    filterSuccess: 'Completed',
    filterError: 'Errors',
    noFilesFound: 'No files found',
    downloadThisFile: 'Download this file',
    deleteFile: 'Remove',

    // History Drawer
    historySubtitle: 'Local compression logs',
    totalCompressed: 'Total Compressed',
    filesCount: 'Files',
    compressionPct: 'Savings',
    totalSaved: 'Space Saved',
    historyEmpty: 'History is empty',
    historyEmptySub: 'Your converted files will appear here.',
    deleteFromHistory: 'Remove from history',

    // Compare & Target Size
    compareTitle: 'Before / After Comparison',
    compareOriginal: 'Original',
    compareConverted: 'Converted',
    openCompare: 'Compare Quality',
    targetSizeLabel: 'Target Size (MB)',
    targetSizeHint: 'Auto-fit quality to size limit',
    presetDiscord8: 'Discord (8 MB)',
    presetDiscord25: 'Discord (25 MB)',
    presetEmail10: 'Email (10 MB)',

    // Footer
    footerCopy: 'Web Media Converter.',
    footerNote: 'Images are processed via Canvas API, videos and audio via FFmpeg WebAssembly. All computations stay local.',
  },
};
