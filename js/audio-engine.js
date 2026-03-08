/**
 * Core Audio Engine using Web Audio API for Zenscape.
 * Manages loading, playing, stopping, and looping ambient audio files.
 */
export class AudioEngine {
    constructor() {
        // AudioContext is initialized lazily based on user interaction due to browser autoplay policies
        this.context = null;

        // Store decoded AudioBuffer objects
        this.buffers = new Map();

        // Store active AudioBufferSourceNode objects
        this.activeSources = new Map();

        // Master gain (volume) node
        this.masterGain = null;
    }

    /**
     * Initializes the AudioContext. Must be called after a user gesture (e.g., click).
     */
    init() {
        if (!this.context) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContextClass();

            // Create a master volume control
            this.masterGain = this.context.createGain();
            this.masterGain.connect(this.context.destination);

            console.log("AudioEngine: AudioContext initialized.", this.context.state);
        } else if (this.context.state === 'suspended') {
            this.context.resume();
            console.log("AudioEngine: AudioContext resumed.");
        }
    }

    /**
     * Fetches and decodes an audio file.
     * @param {string} name - Identifier for the sound (e.g., 'rain').
     * @param {string} url - The URL or local path to the audio file.
     * @returns {Promise<void>}
     */
    async loadSound(name, url) {
        if (!this.context) {
            console.warn("AudioEngine: AudioContext not initialized. Call init() first.");
            // We can still initialize it here if the user hasn't clicked yet, but context might remain suspended.
            this.init();
        }

        try {
            console.log(`AudioEngine: Loading sound '${name}' from ${url}...`);
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.context.decodeAudioData(arrayBuffer);

            this.buffers.set(name, audioBuffer);
            console.log(`AudioEngine: Successfully loaded and decoded '${name}'.`);
        } catch (error) {
            console.error(`AudioEngine: Failed to load sound '${name}' from ${url}:`, error);
        }
    }

    /**
     * Plays a previously loaded sound.
     * @param {string} name - Identifier for the sound.
     * @param {number} volume - Initial volume level (0.0 to 1.0). Default is 1.0.
     */
    playSound(name, volume = 1.0) {
        if (!this.context) {
            console.error("AudioEngine: AudioContext not initialized.");
            return;
        }

        if (!this.buffers.has(name)) {
            console.error(`AudioEngine: Sound '${name}' not found. Load it first.`);
            return;
        }

        // Check if it's already playing to avoid overlapping identical tracks
        if (this.activeSources.has(name)) {
            console.warn(`AudioEngine: Sound '${name}' is already playing.`);
            return;
        }

        // Create the source node from the decoded buffer
        const source = this.context.createBufferSource();
        source.buffer = this.buffers.get(name);
        source.loop = true; // Ambient sounds should loop seamlessly

        // Create an individual gain node for this specific sound's volume control
        const gainNode = this.context.createGain();
        gainNode.gain.value = volume;

        // Connect: Source -> Individual Gain -> Master Gain -> Destination (Speakers)
        source.connect(gainNode);
        gainNode.connect(this.masterGain);

        // Start playback
        source.start(0);

        // Store references so we can stop/adjust it later
        this.activeSources.set(name, {
            source: source,
            gainNode: gainNode
        });

        console.log(`AudioEngine: Playing '${name}' at volume ${volume}.`);
    }

    /**
     * Stops a currently playing sound.
     * @param {string} name - Identifier for the sound.
     */
    stopSound(name) {
        if (this.activeSources.has(name)) {
            const { source, gainNode } = this.activeSources.get(name);

            try {
                // Optional: add a slight fade out here by ramping gain to 0 before stopping
                gainNode.gain.setValueAtTime(gainNode.gain.value, this.context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.5);

                source.stop(this.context.currentTime + 0.5);
            } catch (e) {
                source.stop(); // Fallback to immediate stop
            }

            // Clean up
            source.disconnect();
            gainNode.disconnect();
            this.activeSources.delete(name);

            console.log(`AudioEngine: Stopped '${name}'.`);
        } else {
            console.warn(`AudioEngine: Cannot stop '${name}' (not playing).`);
        }
    }

    /**
     * Adjusts the volume of a currently playing sound.
     * @param {string} name - Identifier for the sound.
     * @param {number} volume - Volume level (0.0 to 1.0).
     */
    setVolume(name, volume) {
        if (this.activeSources.has(name)) {
            const { gainNode } = this.activeSources.get(name);

            // Avoid popping noises by resolving value over a tiny timeframe
            const safeVolume = Math.max(0.0001, Math.min(1.0, volume));
            gainNode.gain.setTargetAtTime(safeVolume, this.context.currentTime, 0.05);
        }
    }

    /**
     * Set the global master volume for all playing sounds.
     * @param {number} volume - Volume level (0.0 to 1.0).
     */
    setMasterVolume(volume) {
        if (this.masterGain) {
            const safeVolume = Math.max(0.0001, Math.min(1.0, volume));
            this.masterGain.gain.setTargetAtTime(safeVolume, this.context.currentTime, 0.05);
            console.log(`AudioEngine: Master volume set to ${safeVolume}.`);
        } else {
            console.warn("AudioEngine: Master gain node not initialized.");
        }
    }

    /**
     * Checks if a specific sound is currently playing.
     * @param {string} name - Identifier for the sound.
     * @returns {boolean} - true if currently playing, false otherwise.
     */
    isSoundPlaying(name) {
        return this.activeSources.has(name);
    }

    /**
     * Toggles a sound between playing and stopped states.
     * @param {string} name - Identifier for the sound.
     * @param {number} volume - Initial volume if it starts playing. Defaults to 1.0.
     */
    toggleSound(name, volume = 1.0) {
        if (this.isSoundPlaying(name)) {
            this.stopSound(name);
        } else {
            this.playSound(name, volume);
        }
    }
}

// ---------------------------------------------------------------------
// Setup Default Configuration and Expose to Window for testing
// ---------------------------------------------------------------------

// Recommended Placeholder Audio Sources (Royalty Free public accessible URLs for initial testing)
export const DEFAULT_SOUNDS = [
    { name: 'rain', url: 'https://freesound.org/data/previews/189/189326_3423727-lq.mp3' },
    { name: 'fire', url: 'https://freesound.org/data/previews/415/415209_5121236-lq.mp3' },
    { name: 'wind', url: 'https://freesound.org/data/previews/162/162057_2846830-lq.mp3' },
    { name: 'waves', url: 'https://freesound.org/data/previews/400/400632_5121236-lq.mp3' },
    { name: 'birds', url: 'https://freesound.org/data/previews/416/416529_5121236-lq.mp3' },
    { name: 'cafe', url: 'https://freesound.org/data/previews/209/209355_3770387-lq.mp3' }
];

import { getPresets, loadPreset } from './presets.js';

// Provide global access for browser console testing as requested in Acceptance Criteria
window.initAudioEngineForTesting = async () => {
    console.log("Initializing Audio Engine Testing Sandbox...");

    window.zenAudio = new AudioEngine();
    window.zenAudio.init(); // Note: must be called as response to user action usually, but testing is fine.

    console.log("Loading placeholder sounds. Please wait...");
    const loadPromises = DEFAULT_SOUNDS.map(sound =>
        window.zenAudio.loadSound(sound.name, sound.url)
    );

    await Promise.all(loadPromises);

    console.log("-----------------------------------------");
    console.log("✅ AudioEngine Test Sandbox Ready!");
    console.log("-----------------------------------------");
    console.log("Commands available:");
    console.log("  zenAudio.playSound('rain')");
    console.log("  zenAudio.playSound('fire', 0.5)");
    console.log("  zenAudio.setVolume('rain', 0.2)");
    console.log("  zenAudio.setMasterVolume(0.5)");
    console.log("  zenAudio.toggleSound('fire')");
    console.log("  zenAudio.stopSound('rain')");
    console.log("Presets commands available:");
    console.log("  loadPreset('Focus')");
    console.log("  getPresets()");
};
