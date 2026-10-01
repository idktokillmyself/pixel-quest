document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initApp, 2300);
});

let DM;

function initApp() {
    DM = new DataManager();
    window.dataManager = DM;
    
    document.getElementById('splash-screen').style.display = 'none';
    document.getElementById('main-interface').style.display = 'flex';
    
    setupTabs();
    setupQuestModal();
    setupCustomization();
    setupLevelUp();
    setupChestModal();
    setupHeroTab();
    setupAvatarPicker();
    
    renderMascot();
    renderQuests();
    renderHeroQuests();
    updateUI();
}

// МАСКОТ
function renderMascot(state = null) {
    if (state) window.mascot.setState(state);
    const img = document.getElementById('mascot-img');
    const fallback = document.getElementById('mascot-fallback');
    const src = DM.settings.customMascot || window.mascot.getSprite();
    
    img.onerror = () => { img.style.display = 'none'; fallback.style.display = 'flex'; };
    img.onload = () => { img.style.display = 'block'; fallback.style.display = 'none'; };
    img.src = src;
    
    // Аватарка: приоритет customAvatar → customMascot → avatar.png → эмодзи
    const avatarImg = document.getElementById('hero-avatar-img');
    const avatarFallback = document.querySelector('.fallback-avatar');
    const avatarSrc = DM.settings.customAvatar 
                    || DM.settings.customMascot 
                    || window.mascot.sprites.avatar;
    avatarImg.onerror = () => { avatarImg.style.display = 'none'; avatarFallback.style.display = 'flex'; };
    avatarImg.onload = () => { avatarImg.style.display = 'block'; avatarFallback.style.display = 'none'; };
    avatarImg.src = avatarSrc;
}

// АВАТАРКА В ШАПКЕ
function setupAvatarPicker() {
    const avatarEl = document.getElementById('hero-avatar');
    const fileInput = document.getElementById('avatar-upload');
    if (!avatarEl || !fileInput) return;
    
    let lastTap = 0;
    
    avatarEl.addEventListener('click', (e) => {
        e.stopPropagation();
        const now = Date.now();
        
        // Двойной тап = удалить аватарку (если она своя)
        if (now - lastTap < 350) {
            if (DM.settings.customAvatar) {
                if (confirm('Убрать свою аватарку?')) {
                    DM.settings.customAvatar = null;
                    DM.save();
                    renderMascot();
                    window.sound.questDelete();
                }
            }
            lastTap = 0;
            return;
        }
        lastTap = now;
        
        // Одинарный тап = открыть выбор файла (с небольшой задержкой на детект двойного)
        setTimeout(() => {
            if (lastTap === now) {
                window.sound.click();
                fileInput.click();
            }
        }, 360);
    });
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        if (file.size > 2 * 1024 * 1024) {
            alert('Файл больше 2 МБ. Выбери поменьше.');
            window.sound.error();
            fileInput.value = '';
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (ev) => {
            DM.settings.customAvatar = ev.target.result;
            DM.save();
            renderMascot();
            window.sound.customize();
            window.sound.vibrate([20, 30, 20]);
            
            // Визуальный отклик
            avatarEl.style.transform = 'scale(1.15)';
            setTimeout(() => avatarEl.style.transform = '', 200);
        };
        reader.readAsDataURL(file);
        fileInput.value = '';
    });
}

// НАВИГАЦИЯ
function setupTabs() {
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.addEventListener('click', () => {
            window.sound.click();
            const name = btn.dataset.tab;
            document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            document.getElementById(`tab-${name}`).classList.add('active');
            if (name === 'quests') renderQuests();
            if (name === 'customize') { updateCustomizationUI(); renderMedals(); }
            if (name === 'hero') { renderHeroQuests(); renderMascot(); }
        });
    });
}

function setupHeroTab() {
    document.getElementById('hero-quick-add').addEventListener('click', () => {
        window.sound.modalOpen();
        openQuestModal();
    });
}

function renderHeroQuests() {
    const container = document.getElementById('hero-active-quests');
    const active = DM.quests.filter(q => !q.completed).slice(0, 3);
    if (active.length === 0) {
        container.innerHTML = `<p class="pixel-text-small" style="text-align:center;color:#888;padding:20px;">✨ Все квесты выполнены!</p>`;
        return;
    }
    container.innerHTML = active.map(q => questCardHTML(q)).join('');
    attachQuestHandlers(container);
}

// МОДАЛКА КВЕСТА
function setupQuestModal() {
    const modal = document.getElementById('add-quest-modal');
    const xpSlider = document.getElementById('modal-quest-xp');
    const xpValue = document.getElementById('modal-xp-value');
    const titleInput = document.getElementById('modal-quest-title');
    
    document.getElementById('quest-add-btn').addEventListener('click', () => {
        window.sound.modalOpen();
        openQuestModal();
    });
    
    xpSlider.addEventListener('input', () => { xpValue.textContent = xpSlider.value; });
    
    document.getElementById('modal-cancel').addEventListener('click', () => {
        window.sound.click();
        modal.style.display = 'none';
    });
    
    document.getElementById('modal-confirm').addEventListener('click', () => {
        const title = titleInput.value.trim();
        const exp = parseInt(xpSlider.value);
        if (!title) {
            window.sound.error();
            titleInput.style.borderColor = '#ff4444';
            setTimeout(() => titleInput.style.borderColor = '', 500);
            return;
        }
        DM.addQuest(title, exp);
        window.sound.questAdd();
        window.sound.vibrate(30);
        titleInput.value = '';
        xpSlider.value = 20;
        xpValue.textContent = '20';
        modal.style.display = 'none';
        renderQuests();
        renderHeroQuests();
        updateUI();
        renderMascot('excited');
        setTimeout(() => renderMascot('idle'), 1200);
    });
    
    titleInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') document.getElementById('modal-confirm').click();
    });
    
    modal.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });
}

function openQuestModal() {
    document.getElementById('add-quest-modal').style.display = 'flex';
    setTimeout(() => document.getElementById('modal-quest-title').focus(), 100);
}

// СПИСОК КВЕСТОВ
function questCardHTML(q) {
    return `
        <div class="quest-card ${q.completed ? 'completed' : ''}" data-id="${q.id}">
            <div class="quest-card-header">
                <div class="quest-checkbox"></div>
                <span class="quest-title pixel-text-small">${escapeHTML(q.title)}</span>
                <span class="quest-exp">+${q.exp} XP</span>
            </div>
            <div class="quest-time pixel-text-tiny">
                ${q.completed 
                    ? '✓ ' + new Date(q.completedAt).toLocaleString('ru')
                    : '○ ' + new Date(q.createdAt).toLocaleString('ru')}
            </div>
        </div>
    `;
}

function renderQuests(filter = 'all') {
    const container = document.getElementById('quests-list');
    const clearBtn = document.getElementById('clear-completed-btn');
    let list = DM.quests;
    if (filter === 'active') list = list.filter(q => !q.completed);
    if (filter === 'completed') list = list.filter(q => q.completed);
    
    if (list.length === 0) {
        container.innerHTML = `<p class="pixel-text-small" style="text-align:center;color:#888;padding:30px 10px;">
            ${filter === 'all' ? 'Нет квестов. Создай первый!' : 'Тут пусто...'}
        </p>`;
    } else {
        container.innerHTML = list.map(questCardHTML).join('');
    }
    clearBtn.style.display = DM.quests.some(q => q.completed) ? 'block' : 'none';
    attachQuestHandlers(container);
}

function attachQuestHandlers(container) {
    container.querySelectorAll('.quest-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = parseFloat(card.dataset.id);
            const result = DM.toggleQuest(id);
            if (!result) return;
            
            const quest = result.quest;
            
            if (quest.completed) {
                window.sound.questComplete();
                window.sound.vibrate([20, 30, 20]);
                renderMascot('excited');
                setTimeout(() => renderMascot('idle'), 1500);
                const rect = card.getBoundingClientRect();
                window.animations.burstParticles(rect.left + rect.width/2, rect.top, '#FFD700');
                
                // СУНДУК!
                if (result.chest) {
                    setTimeout(() => openChestModal(), 700);
                }
            } else {
                window.sound.questUndo();
                renderMascot('sad');
                setTimeout(() => renderMascot('idle'), 1000);
            }
            
            const curFilter = document.querySelector('.pixel-button-small.active[data-filter]')?.dataset.filter || 'all';
            renderQuests(curFilter);
            renderHeroQuests();
            updateUI();
        });
    });
}

document.addEventListener('click', e => {
    if (e.target.matches('.pixel-button-small[data-filter]')) {
        window.sound.click();
        document.querySelectorAll('.pixel-button-small[data-filter]').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        renderQuests(e.target.dataset.filter);
    }
});

document.getElementById('clear-completed-btn')?.addEventListener('click', () => {
    window.sound.questDelete();
    DM.clearCompleted();
    renderQuests();
    renderHeroQuests();
    updateUI();
});

// СУНДУК
function setupChestModal() {
    document.getElementById('chest-open-btn').addEventListener('click', () => {
        // Закрываем сундук, показываем награду
        document.getElementById('chest-stage').style.display = 'none';
        document.getElementById('reward-stage').style.display = 'block';
        
        const reward = DM.openChest();
        window.sound.levelUp();
        window.sound.vibrate([100, 50, 100, 50, 200]);
        
        const container = document.getElementById('reward-content');
        
        if (reward.type === 'medal') {
            const rarityLabel = reward.medal.rarity === 'medium' ? '⭐ РЕДКАЯ' : '▫️ ОБЫЧНАЯ';
            const rarityColor = window.MEDAL_RARITY[reward.medal.rarity].color;
            container.innerHTML = `
                <p class="pixel-text-tiny" style="color:${rarityColor};margin-bottom:10px;">${rarityLabel}</p>
                <div style="font-size:60px;margin:10px 0;">${reward.medal.emoji}</div>
                <h3 class="pixel-text-medium" style="color:#ffd700;margin-bottom:10px;">${reward.medal.name}</h3>
                <p class="pixel-text-small" style="color:#aaa;margin-bottom:15px;">"${reward.medal.desc}"</p>
                <p class="pixel-text-tiny" style="color:#666;">Медалька добавлена в коллекцию 🏆</p>
            `;
        } else {
            container.innerHTML = `
                <p class="pixel-text-tiny" style="color:#00ff88;margin-bottom:10px;">✨ НОВЫЙ ФОН</p>
                <div style="font-size:60px;margin:10px 0;">🏞️</div>
                <h3 class="pixel-text-medium" style="color:#ffd700;margin-bottom:10px;">${reward.location.name}</h3>
                <p class="pixel-text-small" style="color:#aaa;margin-bottom:15px;">Разблокирована новая локация!</p>
                <p class="pixel-text-tiny" style="color:#666;">Доступна в разделе СТИЛЬ → ЛОКАЦИЯ</p>
            `;
        }
        
        window.animations.burstParticles(window.innerWidth/2, window.innerHeight/2, '#FFD700');
        window.animations.burstParticles(window.innerWidth/2 - 50, window.innerHeight/2 + 50, '#FF9EC4');
    });
    
    document.getElementById('reward-close-btn').addEventListener('click', () => {
        window.sound.click();
        document.getElementById('chest-modal').style.display = 'none';
        document.getElementById('chest-stage').style.display = 'block';
        document.getElementById('reward-stage').style.display = 'none';
        renderMedals();
        updateCustomizationUI();
    });
    
    document.getElementById('chest-modal').addEventListener('click', e => {
        if (e.target === document.getElementById('chest-modal')) {
            document.getElementById('chest-modal').style.display = 'none';
            document.getElementById('chest-stage').style.display = 'block';
            document.getElementById('reward-stage').style.display = 'none';
        }
    });
}

function openChestModal() {
    document.getElementById('chest-modal').style.display = 'flex';
    document.getElementById('chest-stage').style.display = 'block';
    document.getElementById('reward-stage').style.display = 'none';
    window.sound.modalOpen();
    // Трясём сундук
    const chest = document.querySelector('.chest-sprite');
    if (chest) chest.classList.add('chest-shake');
}

// КАСТОМИЗАЦИЯ
function setupCustomization() {
    document.getElementById('hero-name-input').addEventListener('input', e => {
        DM.settings.heroName = e.target.value.toUpperCase() || '2B';
        DM.save();
        document.getElementById('hero-name').textContent = DM.settings.heroName;
    });
    
    // Свой маскот
    const fileInput = document.getElementById('custom-mascot-upload');
    document.getElementById('upload-mascot-btn').addEventListener('click', () => {
        window.sound.click();
        fileInput.click();
    });
    
    fileInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            alert('Файл больше 2 МБ');
            window.sound.error();
            return;
        }
        const reader = new FileReader();
        reader.onload = ev => {
            DM.settings.customMascot = ev.target.result;
            DM.save();
            renderMascot();
            updateCustomizationUI();
            window.sound.customize();
        };
        reader.readAsDataURL(file);
    });
    
    document.getElementById('remove-custom-mascot-btn').addEventListener('click', () => {
        DM.settings.customMascot = null;
        DM.save();
        renderMascot();
        updateCustomizationUI();
        window.sound.click();
    });
    
    // Звук
    const soundToggle = document.getElementById('sound-toggle');
    soundToggle.checked = DM.settings.soundEnabled !== false;
    window.sound.enabled = soundToggle.checked;
    soundToggle.addEventListener('change', () => {
        DM.settings.soundEnabled = soundToggle.checked;
        window.sound.enabled = soundToggle.checked;
        DM.save();
        if (soundToggle.checked) window.sound.customize();
    });
    
    document.getElementById('test-sound-btn').addEventListener('click', () => {
        window.sound.questComplete();
    });
    
    document.getElementById('reset-btn').addEventListener('click', () => {
        if (confirm('Удалить все данные и начать заново?')) DM.reset();
    });
    
    buildLocationGrid();
    updateCustomizationUI();
    renderMedals();
}

function buildLocationGrid() {
    const grid = document.getElementById('location-grid');
    grid.innerHTML = window.LOCATIONS.map(loc => {
        const unlocked = DM.isBackgroundUnlocked(loc.id);
        return `
            <div class="location-card ${unlocked ? '' : 'locked'}" data-location="${loc.id}" data-unlocked="${unlocked}">
                <div class="location-preview" style="background:${loc.fallback};${unlocked ? `background-image:url('${loc.file}');` : ''}">
                    ${unlocked ? '' : '<span class="lock-icon">🔒</span>'}
                </div>
                <p class="pixel-text-tiny">${loc.name}</p>
            </div>
        `;
    }).join('');
    
    grid.querySelectorAll('.location-card').forEach(card => {
        card.addEventListener('click', () => {
            if (card.dataset.unlocked !== 'true') {
                window.sound.error();
                return;
            }
            DM.settings.location = card.dataset.location;
            DM.save();
            applyLocation();
            updateCustomizationUI();
            window.sound.customize();
        });
    });
}

function applyLocation() {
    const loc = window.LOCATIONS.find(l => l.id === DM.settings.location) || window.LOCATIONS[0];
    // Фон на body — на всю страницу
    document.body.style.background = loc.fallback;
    const img = new Image();
    img.onload = () => {
        document.body.style.backgroundImage = `url('${loc.file}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
    };
    img.onerror = () => { document.body.style.backgroundImage = 'none'; };
    img.src = loc.file;
}

function renderMedals() {
    const container = document.getElementById('medals-grid');
    const count = document.getElementById('medals-count');
    if (!container) return;
    
    count.textContent = DM.earnedMedals.length;
    
    if (DM.earnedMedals.length === 0) {
        container.innerHTML = `<p class="pixel-text-tiny" style="color:#666;text-align:center;grid-column:span 3;padding:15px;">
            Пока пусто. Выполняй квесты — за каждые 10 получишь медальку!
        </p>`;
        return;
    }
    
    container.innerHTML = DM.earnedMedals.slice().reverse().map(m => {
        const color = window.MEDAL_RARITY[m.rarity].color;
        return `
            <div class="medal-card" style="border-color:${color};" title="${m.desc}">
                <div class="medal-emoji">${m.emoji}</div>
                <div class="medal-name pixel-text-tiny" style="color:${color};">${m.name}</div>
            </div>
        `;
    }).join('');
}

function updateCustomizationUI() {
    document.getElementById('hero-name-input').value = DM.settings.heroName;
    
    document.querySelectorAll('.location-card').forEach(c => {
        const unlocked = DM.isBackgroundUnlocked(c.dataset.location);
        c.classList.toggle('locked', !unlocked);
        c.classList.toggle('selected', unlocked && c.dataset.location === DM.settings.location);
        c.dataset.unlocked = unlocked;
        
        // Обновляем превью если разблокировалось
        const preview = c.querySelector('.location-preview');
        const loc = window.LOCATIONS.find(l => l.id === c.dataset.location);
        if (unlocked && loc) {
            preview.style.background = loc.fallback;
            preview.style.backgroundImage = `url('${loc.file}')`;
            preview.innerHTML = '';
        }
    });
    
    const rmBtn = document.getElementById('remove-custom-mascot-btn');
    rmBtn.style.display = DM.settings.customMascot ? 'block' : 'none';
}

// UI
function updateUI() {
    document.getElementById('hero-level').textContent = DM.level;
    document.getElementById('hero-name').textContent = DM.settings.heroName;
    document.getElementById('exp-fill').style.width = (DM.experience / DM.experienceToNext * 100) + '%';
    document.getElementById('exp-text').textContent = `${DM.experience}/${DM.experienceToNext} EXP`;
    document.getElementById('quests-completed').textContent = 
        `${DM.quests.filter(q => q.completed).length}/${DM.quests.length}`;
    document.getElementById('progress-percent').textContent = DM.getProgress() + '%';
    document.getElementById('total-exp').textContent = DM.experience;
    updateSpeech();
    applyLocation();
    renderMascot();
}

function updateSpeech(custom = null) {
    const speech = document.getElementById('speech-text');
    if (custom) { speech.textContent = custom; return; }
    const p = DM.getProgress();
    let msg = 'Добавь первый квест!';
    if (DM.quests.length > 0) {
        if (p === 100) msg = 'Все квесты выполнены! 🎉';
        else if (p >= 76) msg = 'Осталось чуть-чуть!';
        else if (p >= 51) msg = 'Ты на верном пути!';
        else if (p >= 26) msg = 'Хорошее начало!';
        else msg = 'Пора за дело!';
    }
    speech.textContent = msg;
}

// LEVEL UP
function setupLevelUp() {
    window.onLevelUp = () => {
        document.getElementById('levelup-modal').style.display = 'flex';
        window.sound.levelUp();
        window.sound.vibrate([100, 50, 100, 50, 200]);
        renderMascot('excited');
        window.animations.burstParticles(window.innerWidth/2, window.innerHeight/2, '#FFD700');
        setTimeout(() => {
            const m = document.getElementById('levelup-modal');
            if (m.style.display === 'flex') m.style.display = 'none';
            renderMascot('idle');
        }, 5000);
    };
    document.getElementById('levelup-close').addEventListener('click', () => {
        window.sound.click();
        document.getElementById('levelup-modal').style.display = 'none';
        renderMascot('excited');
        setTimeout(() => renderMascot('idle'), 1200);
    });
}

function escapeHTML(s) {
    return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
