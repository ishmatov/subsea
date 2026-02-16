# Subsea Atlas

Интерактивный образовательный сайт о подводной добыче нефти и газа.

## Технологии

- React 18+ / TypeScript
- Vite
- React Router
- React-Leaflet + OpenStreetMap
- Recharts
- Tailwind CSS

## Запуск

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
```

Результат в папке `dist/`. Файл `404.html` создаётся автоматически для поддержки SPA-маршрутизации на GitHub Pages.

## Деплой на GitHub Pages

1. Создайте репозиторий (например, `subsea_project`)
2. Выполните:
```bash
npm run deploy
```
Скрипт соберёт проект с `base: '/subsea_project/'` и загрузит в ветку `gh-pages`.

3. В настройках репозитория: Settings → Pages → Source: Deploy from a branch → Branch: gh-pages, folder: / (root)

Сайт будет доступен по адресу: `https://<username>.github.io/subsea_project/`

## Структура данных

- `public/data/fields.geojson` — точки месторождений для карты
- `public/data/production_timeseries.json` — данные для графиков
- `public/data/sources.json` — реестр источников
- `public/data/glossary.json` — термины технологий

Данные статические, без внешних API. Обновление — вручную через коммиты.

## Разделы сайта

- **Главная** — введение в Subsea, навигация, факты
- **Карта** — интерактивная карта объектов с фильтрами
- **Графики** — добыча по годам, регионам, типам и статусам
- **Технологии** — справочник терминов
- **Источники** — таблица источников, методика
- **Перспективы** — тренды и ограничения
