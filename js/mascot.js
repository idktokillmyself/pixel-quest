// ============================================
// PIXEL QUEST v3 - MASCOT (PNG RENDERER)
// ============================================

class Mascot {
    constructor() {
        this.state = 'idle';
        this.sprites = {
            idle: 'assets/mascot/idle.png',
            avatar: 'assets/mascot/avatar.png',
            excited: 'assets/mascot/excited.png',
            sad: 'assets/mascot/sad.png'
        };
    }
    
    setState(state) {
        if (this.sprites[state]) this.state = state;
    }
    
    getSprite(state = null) {
        return this.sprites[state || this.state];
    }
    
    // Применяет CSS-фильтр (hue-rotate, saturate, brightness)
    applyFilter(el, settings) {
        if (!el) return;
        const hue = settings.hue || 0;
        const sat = settings.saturation ?? 100;
        const bright = settings.brightness ?? 100;
        el.style.filter = `hue-rotate(${hue}deg) saturate(${sat}%) brightness(${bright}%) drop-shadow(0 4px 10px rgba(0,0,0,0.6))`;
    }
}

window.mascot = new Mascot();
