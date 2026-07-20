<div align="center">

# 🖼️🎬🎵 Web Media Converter

**Универсальный пакетный медиаконвертер прямо в браузере — быстро, безопасно и без загрузки на сервер.**

🌐 **[English Version](README.md)** | **[Русская версия](README.ru.md)**

[![Deploy to GitHub Pages](https://github.com/Fuheshka/web-media-converter/actions/workflows/deploy.yml/badge.svg)](https://github.com/Fuheshka/web-media-converter/actions/workflows/deploy.yml)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![FFmpeg WASM](https://img.shields.io/badge/FFmpeg-WASM-black?logo=ffmpeg&logoColor=white)
![i18n](https://img.shields.io/badge/i18n-RU%20%7C%20EN-blue)
![License](https://img.shields.io/badge/License-MIT-green)

<br />

[**🚀 Открыть приложение**](https://fuheshka.github.io/web-media-converter/) · [Сообщить о баге](https://github.com/Fuheshka/web-media-converter/issues) · [Предложить идею](https://github.com/Fuheshka/web-media-converter/issues)

</div>

<br />

## 📋 О проекте

Web Media Converter — это клиентское веб-приложение для пакетной конвертации изображений, видео и аудио файлов. Все вычисления выполняются **локально в браузере** (изображения — через Canvas API, видео и аудио — через WebAssembly-порт FFmpeg). Файлы никогда не отправляются на сервер, обеспечивая полную конфиденциальность.

Интерфейс выполнен в премиальном стиле **Frutiger Aero** (стеклянный эффект Aero Glass, глянцевые кнопки, парящие пузыри) с полной поддержкой **двух языков (RU / EN)**, **тёмной темы** и **локальной истории конвертаций**.

<br />

## ✨ Возможности

<table>
<tr>
<td width="50%">

### 🖼️ Изображения
- Форматы: **JPG · PNG · WebP · AVIF · BMP · GIF · ICO · TIFF**
- Качество сжатия и ресайз с сохранением пропорций
- Автозамена прозрачности на белый фон для JPEG

</td>
<td width="50%">

### 🎬 Видео
- Форматы: **MP4 · WEBM · AVI · MOV · MKV · GIF**
- Выбор кодека: H.264, VP9, H.265 или без перекодирования
- Изменение разрешения (до 4K) и FPS (24–60)
- Обрезка видео (Trim) по секундам

</td>
</tr>
<tr>
<td width="50%">

### 🎵 Аудио
- Форматы: **MP3 · WAV · OGG · AAC · FLAC · M4A**
- Настройка битрейта (96–320 kbps) и дискретизации (22–48 kHz)
- Обрезка аудио (Trim) по секундам

</td>
<td width="50%">

### 🎛️ Пакетная обработка и UX
- **Drag & Drop** и вставка из буфера обмена (**Ctrl+V**)
- **Мультиязычный интерфейс (RU / EN)** с автоопределением
- Параллельный процессинг изображений (до 6 потоков)
- Скачивание результата одним **ZIP-архивом**
- **Тёмная тема** и автодетект параметров файлов

</td>
</tr>
<tr>
<td colspan="2">

### 📊 История и статистика
- Встроенный **История-Drawer** (хранится локально в `localStorage`)
- Отображение списка выполненных конвертаций и индивидуального сжатия
- Виджет глобальной статистики сэкономленного места за всё время

</td>
</tr>
</table>

<br />

## 🏗️ Архитектура

```
src/
├── types/
│   └── media.ts                # Единые интерфейсы настроек и MediaItem
├── utils/
│   └── formatHelpers.ts        # Общие хелперы (формат байт, длительности, автодетект)
├── i18n/
│   └── translations.ts         # Словарь переводов (RU / EN)
├── context/
│   └── LanguageContext.tsx     # Провайдер языка и хук useLanguage
├── hooks/
│   ├── useMediaConverter.ts    # Главный оркестратор (очередь, параллельный пулинг, ZIP)
│   ├── useImageEngine.ts       # Canvas API обработчик изображений
│   ├── useFFmpegEngine.ts      # FFmpeg WASM обработчик видео/аудио
│   └── useConversionHistory.ts # Локальное логирование истории в localStorage
├── components/
│   ├── Controls.tsx            # Настройки по категориям (Images/Video/Audio)
│   ├── FileList.tsx            # Очередь файлов с Aero прогресс-баром
│   ├── HistoryDrawer.tsx       # Выдвижная панель истории конвертаций
│   ├── LanguageToggle.tsx      # Переключатель языков RU / EN
│   └── ...
```

<br />

## 🛠️ Стек технологий

| Технология | Назначение |
|:---|:---|
| [React 19](https://react.dev) | UI-фреймворк |
| [TypeScript 6](https://www.typescriptlang.org) | Статическая типизация |
| [Vite 8](https://vite.dev) | Сборщик и dev-сервер |
| [Tailwind CSS 4](https://tailwindcss.com) | Стилизация |
| [FFmpeg.wasm](https://ffmpeg.org) | Декодирование и кодирование видео/аудио через WebAssembly |
| [JSZip](https://stuk.github.io/jszip/) | Упаковка пакета в ZIP-архив |
| [Lucide React](https://lucide.dev) | Набор иконок |

<br />

## 🚀 Быстрый старт

### Требования
- **Node.js** ≥ 20
- **npm** ≥ 10

### Установка и запуск
```bash
# Клонировать репозиторий
git clone https://github.com/Fuheshka/web-media-converter.git
cd web-media-converter

# Установить зависимости
npm install

# Запустить dev-сервер
npm run dev
```

Приложение будет запущено по адресу **http://localhost:5173**

> [!IMPORTANT]
> Для работы `ffmpeg.wasm` требуются HTTP-заголовки безопасности **COOP (Cross-Origin-Opener-Policy)** и **COEP (Cross-Origin-Embedder-Policy)**. Они уже настроены в `vite.config.ts` для локального dev-сервера. При деплое на продакшен-хостинг убедитесь, что ваш веб-сервер отдаёт эти заголовки, иначе FFmpeg не загрузится.

<br />

## 🔒 Приватность и Безопасность

Все файлы конвертируются локально. Мы не собираем и не загружаем файлы на внешние серверы. Использование Canvas API и FFmpeg WebAssembly даёт полную безопасность для конфиденциальных данных.

<br />

## 📜 Лицензия

Проект распространяется под лицензией **MIT**. Подробнее — в файле [LICENSE](LICENSE).

<br />

<div align="center">

---

**[⬆ Вернуться наверх](#️-web-media-converter)**

</div>
