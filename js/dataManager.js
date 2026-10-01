class DataManager {
    constructor() {
        this.quests = [];
        this.settings = {
            heroName: '2B',
            location: 'forest',
            soundEnabled: true,
            customMascot: null,
            customAvatar: null
        };
        this.level = 1;
        this.experience = 0;
        this.experienceToNext = 100;
        
        // Прогресс наград
        this.totalCompleted = 0;           // всего выполнено за всё время
        this.unlockedBackgrounds = ['forest', 'mountains'];  // стартовые
        this.earnedMedals = [];            // массив id медалек
        
        this.load();
        if (this.quests.length === 0) this.createDemoQuests();
    }
    
    createDemoQuests() {
        [
            { title: '🏋️ Тренировка в подземелье', exp: 30 },
            { title: '☕️ Приготовить зелье бодрости', exp: 15 },
            { title: '📚 Изучить древний манускрипт', exp: 25 }
        ].forEach(d => this.quests.push({
            id: Date.now() + Math.random(),
            title: d.title,
            completed: false,
            exp: d.exp,
            createdAt: new Date().toISOString(),
            completedAt: null
        }));
        this.save();
    }
    
    addQuest(title, exp = 20) {
        const q = {
            id: Date.now(),
            title,
            completed: false,
            exp: Math.max(5, Math.min(100, exp)),
            createdAt: new Date().toISOString(),
            completedAt: null
        };
        this.quests.unshift(q);
        this.save();
        return q;
    }
    
    toggleQuest(id) {
        const q = this.quests.find(x => x.id === id);
        if (!q) return null;
        
        q.completed = !q.completed;
        q.completedAt = q.completed ? new Date().toISOString() : null;
        
        if (q.completed) {
            this.addExperience(q.exp);
            this.totalCompleted++;
        } else {
            this.experience = Math.max(0, this.experience - q.exp);
            this.totalCompleted = Math.max(0, this.totalCompleted - 1);
        }
        
        this.save();
        
        // Проверяем: 10-й, 20-й, 30-й... квест?
        if (q.completed && this.totalCompleted % 10 === 0) {
            return { quest: q, chest: true, count: this.totalCompleted };
        }
        
        return { quest: q, chest: false };
    }
    
    deleteQuest(id) {
        this.quests = this.quests.filter(q => q.id !== id);
        this.save();
    }
    
    clearCompleted() {
        this.quests = this.quests.filter(q => !q.completed);
        this.save();
    }
    
    addExperience(amount) {
        this.experience += amount;
        while (this.experience >= this.experienceToNext) {
            this.experience -= this.experienceToNext;
            this.level++;
            this.experienceToNext = Math.floor(this.experienceToNext * 1.5);
            if (window.onLevelUp) window.onLevelUp(this.level);
        }
    }
    
    // НАГРАДЫ
    
    // Открыть сундук: возвращает объект награды
    openChest() {
        // Считаем какие фоны ещё не открыты
        const lockedBackgrounds = window.LOCATIONS.filter(
            loc => loc.unlockable && !this.unlockedBackgrounds.includes(loc.id)
        );
        
        // Шанс: если есть незалоченные фоны — 40% шанс что выпадет фон
        // иначе всегда медалька
        const giveBackground = lockedBackgrounds.length > 0 && Math.random() < 0.4;
        
        if (giveBackground) {
            // Рандомный фон из незалоченных
            const bg = lockedBackgrounds[Math.floor(Math.random() * lockedBackgrounds.length)];
            this.unlockedBackgrounds.push(bg.id);
            this.save();
            return {
                type: 'background',
                location: bg
            };
        }
        
        // Медалька: рандом soft/medium с весами
        const rarity = Math.random() * 100 < window.MEDAL_RARITY.soft.weight ? 'soft' : 'medium';
        const pool = window.MEDALS[rarity];
        const medal = pool[Math.floor(Math.random() * pool.length)];
        
        const medalEntry = {
            id: Date.now() + Math.random(),
            rarity,
            emoji: medal.emoji,
            name: medal.name,
            desc: medal.desc,
            earnedAt: new Date().toISOString()
        };
        
        this.earnedMedals.push(medalEntry);
        this.save();
        
        return {
            type: 'medal',
            medal: medalEntry
        };
    }
    
    isBackgroundUnlocked(id) {
        return this.unlockedBackgrounds.includes(id);
    }
    
    
    getProgress() {
        if (this.quests.length === 0) return 0;
        return Math.round(this.quests.filter(q => q.completed).length / this.quests.length * 100);
    }
    
    save() {
        try {
            localStorage.setItem('pixelQuest_v5', JSON.stringify({
                quests: this.quests,
                settings: this.settings,
                level: this.level,
                experience: this.experience,
                experienceToNext: this.experienceToNext,
                totalCompleted: this.totalCompleted,
                unlockedBackgrounds: this.unlockedBackgrounds,
                earnedMedals: this.earnedMedals
            }));
        } catch(e) {
            console.warn('localStorage переполнен', e);
        }
    }
    
    load() {
        const saved = localStorage.getItem('pixelQuest_v5');
        if (!saved) return;
        try {
            const d = JSON.parse(saved);
            this.quests = d.quests || [];
            this.settings = { ...this.settings, ...(d.settings || {}) };
            this.level = d.level || 1;
            this.experience = d.experience || 0;
            this.experienceToNext = d.experienceToNext || 100;
            this.totalCompleted = d.totalCompleted || 0;
            this.unlockedBackgrounds = d.unlockedBackgrounds || ['forest', 'mountains'];
            this.earnedMedals = d.earnedMedals || [];
        } catch(e) { console.error(e); }
    }
    
    reset() {
        localStorage.removeItem('pixelQuest_v5');
        location.reload();
    }
}

window.DataManager = DataManager;
