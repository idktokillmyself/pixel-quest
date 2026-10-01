// ============================================
// PIXEL QUEST - АНИМАЦИИ И ЭФФЕКТЫ
// ============================================

class Animations {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        this.ctx = this.canvas?.getContext('2d');
        this.particles = [];
        this.animationId = null;
        
        if (this.canvas) {
            this.resizeCanvas();
            window.addEventListener('resize', () => this.resizeCanvas());
        }
    }
    
    resizeCanvas() {
        if (!this.canvas) return;
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }
    
    // ЗАПУСТИТЬ ЧАСТИЦЫ РАДОСТИ
    burstParticles(x, y, color = '#FFD700') {
        if (!window.dataManager?.settings.showParticles) return;
        
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                x: x || this.canvas.width / 2,
                y: y || this.canvas.height - 100,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10 - 5,
                life: 1,
                decay: Math.random() * 0.02 + 0.02,
                size: Math.random() * 4 + 2,
                color: color
            });
        }
        
        if (!this.animationId) {
            this.animate();
        }
    }
    
    // АНИМАЦИЯ ЧАСТИЦ
    animate() {
        if (!this.ctx || !this.canvas) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles = this.particles.filter(p => p.life > 0);
        
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2; // Гравитация
            p.life -= p.decay;
            
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.life;
            this.ctx.fillRect(p.x, p.y, p.size, p.size);
        });
        
        this.ctx.globalAlpha = 1;
        
        if (this.particles.length > 0) {
            this.animationId = requestAnimationFrame(() => this.animate());
        } else {
            this.animationId = null;
        }
    }
    
    // ТРЯСКА ЭКРАНА
    shakeScreen(duration = 200) {
        const app = document.getElementById('app');
        if (!app) return;
        
        const originalTransform = app.style.transform;
        const startTime = Date.now();
        
        const shake = () => {
            const elapsed = Date.now() - startTime;
            if (elapsed > duration) {
                app.style.transform = originalTransform;
                return;
            }
            
            const intensity = 1 - elapsed / duration;
            const x = (Math.random() - 0.5) * 10 * intensity;
            const y = (Math.random() - 0.5) * 10 * intensity;
            
            app.style.transform = `translate(${x}px, ${y}px)`;
            requestAnimationFrame(shake);
        };
        
        shake();
    }
    
    // ПРОКРУТКА ТЕКСТА (для диалогов)
    typewriterEffect(element, text, speed = 50) {
        let index = 0;
        element.textContent = '';
        
        return new Promise(resolve => {
            const type = () => {
                if (index < text.length) {
                    element.textContent += text.charAt(index);
                    index++;
                    setTimeout(type, speed);
                } else {
                    resolve();
                }
            };
            type();
        });
    }
    
    // ПИКСЕЛЬНЫЙ ПЕРЕХОД
    pixelTransition(callback) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: #000;
            z-index: 9999;
            animation: pixelFade 0.5s ease-in-out;
            pointer-events: none;
        `;
        
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.remove();
            if (callback) callback();
        }, 500);
    }
}

// Глобальный экземпляр
window.animations = new Animations();
