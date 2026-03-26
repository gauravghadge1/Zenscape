import { AudioEngine, DEFAULT_SOUNDS } from './audio-engine.js';

const engine = new AudioEngine();
let engineReady = false;

document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('mixer-overlay');
    const startBtn = document.getElementById('start-engine-btn');
    const cards = document.querySelectorAll('.sound-card');

    // SVGs for icons
    const playIcon = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
    const pauseIcon = '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';

    if(startBtn) {
        startBtn.addEventListener('click', async () => {
            startBtn.textContent = 'Loading...';
            engine.init();
            
            // Load sounds
            const loadPromises = DEFAULT_SOUNDS.map(sound =>
                engine.loadSound(sound.name, sound.url)
            );
            
            await Promise.all(loadPromises);
            engineReady = true;
            
            overlay.classList.add('hidden');
            setTimeout(() => overlay.remove(), 500);
        });
    }

    cards.forEach(card => {
        const soundName = card.dataset.sound;
        const playBtn = card.querySelector('.play-toggle');
        const slider = card.querySelector('.volume-slider');

        playBtn.addEventListener('click', () => {
            if (!engineReady) return;

            const isPlaying = engine.isSoundPlaying(soundName);
            if (isPlaying) {
                engine.stopSound(soundName);
                card.classList.remove('active');
                playBtn.innerHTML = playIcon;
                document.body.classList.remove(`theme-${soundName}`);
            } else {
                const vol = parseFloat(slider.value);
                engine.playSound(soundName, vol);
                card.classList.add('active');
                playBtn.innerHTML = pauseIcon;
                document.body.classList.add(`theme-${soundName}`);
            }
        });

        slider.addEventListener('input', (e) => {
            if (engineReady && engine.isSoundPlaying(soundName)) {
                engine.setVolume(soundName, parseFloat(e.target.value));
            }
        });
    });
});