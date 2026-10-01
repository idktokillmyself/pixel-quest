# ⚔️ Pixel Quest

RPG-трекер задач в стиле 16-битных игр.

**Демо:** https://idktokillmyself.github.io/pixel-quest/

## О проекте

Pixel Quest — это трекер задач, стилизованный под классические RPG. 
Выполняешь задачи — получаешь опыт, растишь уровень, открываешь сундуки 
с наградами. За каждые 10 выполненных квестов выпадает сундук: 
медалька или новый фон локации.

## Возможности

- Система опыта и уровней
- Сундуки с наградами каждые 10 квестов
- Коллекция медалек (обычные и редкие)
- 5 локаций, разблокируемых из сундуков
- Кастомизация маскота (загрузка своего PNG)
- Своя аватарка в шапке профиля
- 8-битные звуки через Web Audio API
- PWA — устанавливается на iPhone и работает оффлайн
- Адаптивная вёрстка под все устройства

## Технологии

- HTML5 + CSS3 (vanilla, без фреймворков)
- Vanilla JavaScript (ES6+)
- Web Audio API (синтез звуков)
- Canvas API (анимация частиц)
- Service Worker (оффлайн-режим)
- LocalStorage (хранение данных)

## Как запустить локально

```bash
git clone https://github.com/idktokillmyself/pixel-quest.git
cd pixel-quest
python3 -m http.server 8080
```
## Как установить на iPhone

Открой https://idktokillmyself.github.io/pixel-quest/ в Safari

Нажми Поделиться → На экран «Домой»

Открой с иконки — приложение работает оффлайн

Структура проекта
```
pixel-quest/
├── index.html          — главная страница
├── manifest.json       — PWA-манифест
├── sw.js               — Service Worker
├── css/
│   └── pixel-quest.css — стили
├── js/
│   ├── app.js          — логика приложения
│   ├── dataManager.js  — сохранение данных
│   ├── mascot.js       — рендер маскота
│   ├── soundEngine.js  — 8-битные звуки
│   ├── animations.js   — анимации и частицы
│   └── medals.js       — пул наград
└── assets/
    ├── mascot/         — PNG маскота
    └── backgrounds/    — фоны локаций
