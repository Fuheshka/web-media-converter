<div align="center">

# 🖼️ Web Image Converter

**Пакетная конвертация изображений прямо в браузере — быстро, безопасно и без загрузки на сервер.**

[![Deploy to GitHub Pages](https://github.com/Fuheshka/web-image-converter/actions/workflows/deploy.yml/badge.svg)](https://github.com/Fuheshka/web-image-converter/actions/workflows/deploy.yml)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

<br />

[**🚀 Открыть приложение**](https://fuheshka.github.io/web-image-converter/) · [Сообщить о баге](https://github.com/Fuheshka/web-image-converter/issues) · [Предложить идею](https://github.com/Fuheshka/web-image-converter/issues)

</div>

<br />

## 📋 О проекте

Web Image Converter — это одностраничное веб-приложение для пакетной конвертации изображений. Все вычисления выполняются **локально в браузере** через Canvas API — файлы никогда не покидают ваш компьютер.

Интерфейс выполнен в стиле **Frutiger Aero** — яркие градиенты неба и травы, глянцевые кнопки, полупрозрачные окна с эффектом стекла и парящие пузырьки.

<br />

## ✨ Возможности

<table>
<tr>
<td width="50%">

### 🔄 Конвертация
- Форматы: **JPG · JPEG · PNG · WebP**
- Настраиваемое качество сжатия
- Пропорциональный ресайз (800–2560 px)
- Автозамена прозрачности на белый фон для JPEG

</td>
<td width="50%">

### 📦 Пакетная обработка
- Загрузка сотен файлов одновременно
- Параллельная конвертация (до 6 потоков)
- Скачивание результата одним **ZIP-архивом**
- Дедупликация имён файлов в архиве

</td>
</tr>
<tr>
<td width="50%">

### 📊 Аналитика
- Индивидуальная статистика «До → После»
- Суммарная экономия / изменение размера
- Цветовая индикация: 🟢 уменьшение · 🟡 увеличение
- Обработка крайних случаев (0 байт, повреждённые файлы)

</td>
<td width="50%">

### 🎛️ Управление
- **Drag & Drop** загрузка файлов
- **Ctrl+V** — вставка из буфера обмена
- Поиск по имени в очереди
- Фильтрация по статусу обработки
- Гибкая настройка имён файлов

</td>
</tr>
</table>

<br />

## 🏗️ Архитектура

```
src/
├── App.tsx                     # Корневой компонент, layout, clipboard paste
├── main.tsx                    # Точка входа
├── index.css                   # Дизайн-система (Aero Glass, кнопки, анимации)
├── components/
│   ├── ConverterCard.tsx       # Aero Glass обёртка-карточка
│   ├── DropZone.tsx            # Зона Drag & Drop загрузки
│   ├── FileList.tsx            # Очередь файлов с поиском и фильтрами
│   ├── Controls.tsx            # Настройки формата, качества, ресайза
│   └── ResultArea.tsx          # Результат конвертации (одиночный режим)
└── hooks/
    └── useImageConverter.ts    # Ядро: Worker Pool, Canvas API, JSZip
```

**Ключевые решения:**
- **Worker Pool** — параллельная конвертация с лимитом в 6 потоков предотвращает переполнение памяти при обработке сотен файлов
- **Canvas API** — все трансформации изображений выполняются через HTML5 Canvas без внешних зависимостей
- **GPU-ускоренные анимации** — `will-change: transform` и `translate3d` для плавных пузырьков без лагов при скролле

<br />

## 🛠️ Стек технологий

| Технология | Назначение |
|:---|:---|
| [React 19](https://react.dev) | UI-фреймворк |
| [TypeScript 6](https://www.typescriptlang.org) | Статическая типизация |
| [Vite 8](https://vite.dev) | Сборщик и dev-сервер |
| [Tailwind CSS 4](https://tailwindcss.com) | Утилитарные стили |
| [JSZip](https://stuk.github.io/jszip/) | Упаковка в ZIP-архив |
| [Lucide React](https://lucide.dev) | Иконки |
| [GitHub Pages](https://pages.github.com) | Хостинг |

<br />

## 🚀 Быстрый старт

### Требования

- **Node.js** ≥ 20
- **npm** ≥ 10

### Установка и запуск

```bash
# Клонировать репозиторий
git clone https://github.com/Fuheshka/web-image-converter.git
cd web-image-converter

# Установить зависимости
npm install

# Запустить dev-сервер
npm run dev
```

Приложение будет доступно по адресу **http://localhost:5173**

### Сборка для продакшена

```bash
npm run build
```

Результат сборки появится в `dist/` с относительными путями — готов к деплою на любой статический хостинг.

<br />

## 🌐 Деплой

Проект автоматически разворачивается на **GitHub Pages** при каждом пуше в ветку `main` через GitHub Actions.

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]
```

<br />

## 📁 Структура проекта

```
web-image-converter/
├── .github/workflows/       # CI/CD (GitHub Pages)
├── public/                  # Статические ресурсы
├── src/                     # Исходный код
│   ├── components/          # React-компоненты
│   ├── hooks/               # Пользовательские хуки
│   └── ...
├── index.html               # Входной HTML (SEO-метатеги)
├── vite.config.ts           # Конфигурация Vite
├── tsconfig.json            # Конфигурация TypeScript
└── package.json             # Зависимости и скрипты
```

<br />

## 🔒 Приватность

Все файлы обрабатываются **исключительно в вашем браузере**. Ни одно изображение не отправляется на сервер. Конвертация выполняется через нативный Canvas API браузера.

<br />

## 📜 Лицензия

Распространяется под лицензией **MIT**. Подробнее — в файле [LICENSE](LICENSE).

<br />

<div align="center">

---

**[⬆ Вернуться наверх](#-web-image-converter)**

</div>
