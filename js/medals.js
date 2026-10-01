// PIXEL QUEST - MEDALS & REWARDS
// Пул медалек и разблокируемых фонов

window.MEDALS = {
    // МЯГКИЕ — обидные, но с юмором
    soft: [
        { emoji: '🦥', name: 'Ленивая жопа',            desc: 'Опять ничего не сделал?' },
        { emoji: '😴', name: 'Соня-засоня',             desc: 'Проспал весь день' },
        { emoji: '📱', name: 'Мастер прокрастинации',   desc: 'Залипал в телефоне 6 часов' },
        { emoji: '🛋️', name: 'Диванный воин',           desc: 'Телом тут, душой в телевизоре' },
        { emoji: '🍕', name: 'Пожиратель пельменей',    desc: 'Съел больше, чем сделал' },
        { emoji: '🎮', name: 'Геймер-бездельник',       desc: 'Один матч — и всё, вечер кончился' },
        { emoji: '🐌', name: 'Улиточный темп',          desc: 'Делаешь всё в час по чайной ложке' },
        { emoji: '☕️', name: 'Кофе-зависимый',          desc: 'Пятая чашка, а дела стоят' },
        { emoji: '🧟', name: 'Восставший из пледа',     desc: 'Вышел из зоны комфорта на 2 минуты' },
        { emoji: '🌙', name: 'Ночной житель',           desc: 'Спит днём, живёт ночью' }
    ],
    
    // СРЕДНИЕ — жёстче, но без мата
    medium: [
        { emoji: '💀', name: 'Сын лени',                desc: 'Родственник дивана' },
        { emoji: '🏚️', name: 'Позор рода',              desc: 'Бабуля бы расстроилась' },
        { emoji: '😢', name: 'Разочарование мамы',      desc: 'Она так надеялась...' },
        { emoji: '🐗', name: 'Диванный кабан',          desc: 'Хрюкаешь, но не двигаешься' },
        { emoji: '🕳️', name: 'Чёрная дыра продуктивности', desc: 'Всё засасывает, ничего не выходит' },
        { emoji: '🧠', name: 'Мозг на пенсии',          desc: 'Работает 5 минут в день' },
        { emoji: '⚰️', name: 'Похоронен под одеялом',   desc: 'R.I.P. твои планы' },
        { emoji: '🎭', name: 'Мастер отговорок',        desc: 'Найдёт причину для всего' }
    ]
};

// ФОНЫ: разблокируемые из сундуков
// Стартовые 2 (forest, mountains) доступны сразу
// Остальные дропаются из сундуков по 1 за раз
//
// ВАЖНО: чтобы добавить новые фоны — просто докинь
// PNG в assets/backgrounds/ и допиши запись сюда

window.LOCATIONS = [
    // ===== СТАРТОВЫЕ (всегда открыты) =====
    { id: 'forest',     name: 'ЛЕС',       file: 'assets/backgrounds/forest.png',     fallback: 'linear-gradient(180deg,#0a1a0a,#050a05)',       unlockable: false },
    { id: 'mountains',  name: 'ГОРЫ',      file: 'assets/backgrounds/mountains.png',  fallback: 'linear-gradient(180deg,#0a1a3e,#1a3a5e,#05050f)', unlockable: false },
    
    // ===== ИЗ СУНДУКОВ =====
    { id: 'stars',      name: 'ЗВЁЗДЫ',    file: 'assets/backgrounds/stars.png',      fallback: 'linear-gradient(180deg,#1a0a3e,#3e1a5e,#0a0a1e)', unlockable: true },
    { id: 'wasteland',  name: 'ПУСТОШЬ',   file: 'assets/backgrounds/wasteland.png',  fallback: 'linear-gradient(180deg,#1a0a2a,#3e1a4e,#0a0a1e)', unlockable: true },
    { id: 'lake',       name: 'ОЗЕРО',     file: 'assets/backgrounds/lake.png',       fallback: 'linear-gradient(180deg,#1a2a4e,#3e5e8e,#05050f)', unlockable: true }
    
    // ===== ДОБАВЛЯЙ СЮДА НОВЫЕ ФОНЫ =====
    // { id: 'newbg1', name: 'НАЗВАНИЕ', file: 'assets/backgrounds/newbg1.png', fallback: 'linear-gradient(180deg,#000,#111)', unlockable: true },
];

// РЕДКОСТЬ МЕДАЛЕК
window.MEDAL_RARITY = {
    soft:   { weight: 65, color: '#9b9b9b' },   // 65% — обычные
    medium: { weight: 35, color: '#ffd700' }    // 35% — редкие
};
