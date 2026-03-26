// Import the AudioEngine exposed on the window for debug/testing Console
import { AudioEngine } from './audio-engine.js';
import { loadPreset } from './presets.js';

console.log("Zenscape Main App Loaded");
console.log("Run `window.initAudioEngineForTesting()` in the console to test the audio module.");

document.addEventListener('DOMContentLoaded', () => {
    // Automatically load Preset configurations when entering home page UI
    const urlParams = new URLSearchParams(window.location.search);
    const targetPreset = urlParams.get('preset');

    if (targetPreset) {
        console.log(`Zenscape: Preparing to load preset '${targetPreset}' from URL parameters...`);
        
        let attempts = 0;
        const interval = setInterval(() => {
            attempts++;
            // Check for explicit init AudioEngine context exposure
            if (window.zenAudio && window.zenAudio.context && window.zenAudio.context.state === 'running') {
                loadPreset(targetPreset, window.zenAudio);
                clearInterval(interval);
            }
            
            // Release interval timeout after 30 seconds
            if (attempts > 120) {
                console.warn(`Zenscape: Preset autoload timed out for '${targetPreset}'.`);
                clearInterval(interval);
            }
        }, 250);
    }
});