// ============================================
// PIXEL QUEST - 8-BIT SOUND ENGINE
// Генерирует ретро-звуки через Web Audio API
// ============================================

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.masterVolume = 0.15;
        this._initOnUserGesture();
    }
    
    _initOnUserGesture() {
        const init = () => {
            if (!this.ctx) {
                try {
                    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
                } catch(e) {
                    console.warn('AudioContext недоступен', e);
                }
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        };
        document.addEventListener('click', init, { once: false });
        document.addEventListener('touchstart', init, { once: false });
    }
    
    _playTone(freq, duration, type = 'square', startTime = 0, gainVal = 0.5) {
        if (!this.enabled || !this.ctx) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);
        
        gain.gain.setValueAtTime(0, this.ctx.currentTime + startTime);
        gain.gain.linearRampToValueAtTime(gainVal * this.masterVolume, this.ctx.currentTime + startTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + startTime + duration);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(this.ctx.currentTime + startTime);
        osc.stop(this.ctx.currentTime + startTime + duration);
    }
    
    _playNoise(duration, startTime = 0, gainVal = 0.3) {
        if (!this.enabled || !this.ctx) return;
        
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(gainVal * this.masterVolume, this.ctx.currentTime + startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + startTime + duration);
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 1000;
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        
        noise.start(this.ctx.currentTime + startTime);
    }
    
    // === ЗВУКИ ===
    
    // Клик по кнопке / таб
    click() {
        this._playTone(880, 0.05, 'square', 0, 0.4);
    }
    
    // Отметка квеста выполненным (победная мелодия)
    questComplete() {
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5 E5 G5 C6
        notes.forEach((freq, i) => {
            this._playTone(freq, 0.12, 'square', i * 0.06, 0.5);
        });
    }
    
    // Отмена выполнения квеста
    questUndo() {
        this._playTone(400, 0.1, 'square', 0, 0.4);
        this._playTone(300, 0.15, 'square', 0.08, 0.4);
    }
    
    // Создание нового квеста
    questAdd() {
        this._playTone(660, 0.08, 'square', 0, 0.4);
        this._playTone(880, 0.1, 'square', 0.07, 0.4);
    }
    
    // Удаление квеста
    questDelete() {
        this._playTone(300, 0.08, 'sawtooth', 0, 0.4);
        this._playTone(200, 0.12, 'sawtooth', 0.06, 0.4);
        this._playNoise(0.15, 0, 0.2);
    }
    
    // Левел-ап! Большая фанфара
    levelUp() {
        const melody = [
            { f: 523.25, t: 0,    d: 0.15 },
            { f: 659.25, t: 0.15, d: 0.15 },
            { f: 783.99, t: 0.30, d: 0.15 },
            { f: 1046.50, t: 0.45, d: 0.30 },
            { f: 783.99, t: 0.75, d: 0.12 },
            { f: 1046.50, t: 0.87, d: 0.50 }
        ];
        melody.forEach(n => this._playTone(n.f, n.d, 'square', n.t, 0.6));
        // Подклад басовой линии
        this._playTone(130.81, 1.2, 'triangle', 0.45, 0.4);
    }
    
    // Переключение таба
    tabSwitch() {
        this._playTone(700, 0.04, 'triangle', 0, 0.3);
    }
    
    // Изменение цвета / кастомизация
    customize() {
        this._playTone(1046.50, 0.05, 'sine', 0, 0.3);
        this._playTone(1318.51, 0.06, 'sine', 0.04, 0.25);
    }
    
    // Ошибка / пустой ввод
    error() {
        this._playTone(180, 0.15, 'sawtooth', 0, 0.5);
        this._playTone(140, 0.2, 'sawtooth', 0.1, 0.5);
    }
    
    // Открытие модалки
    modalOpen() {
        this._playTone(600, 0.06, 'square', 0, 0.3);
        this._playTone(900, 0.08, 'square', 0.05, 0.3);
    }
    
    // Вибрация (если поддерживается)
    vibrate(pattern = 30) {
        if (navigator.vibrate && this.enabled) {
            navigator.vibrate(pattern);
        }
    }
}

window.sound = new SoundEngine();
