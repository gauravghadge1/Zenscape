export const PRESETS = {
    'Focus': {
        name: 'Focus',
        description: 'Deep concentration and productivity',
        icon: '🧠',
        sounds: {
            'rain': 0.3,
            'cafe': 0.5
        }
    },
    'Relax': {
        name: 'Relax',
        description: 'Unwind and de-stress',
        icon: '🧘',
        sounds: {
            'waves': 0.5,
            'wind': 0.2
        }
    },
    'Sleep': {
        name: 'Sleep',
        description: 'Drift off to peaceful slumber',
        icon: '😴',
        sounds: {
            'rain': 0.6,
            'fire': 0.1
        }
    },
    'Nature': {
        name: 'Nature',
        description: 'Immersive outdoor environment',
        icon: '🌳',
        sounds: {
            'birds': 0.6,
            'wind': 0.3,
            'waves': 0.2
        }
    }
};

/**
 * Returns the list of all available presets
 * @returns {Array<Object>} List of preset definitions
 */
export function getPresets() {
    return Object.values(PRESETS);
}

/**
 * Loads a specific preset by name, stopping all current sounds and starting the preset's sounds.
 * @param {string} presetName - The name of the preset to load
 * @param {AudioEngine} [engine] - Optional AudioEngine instance. Defaults to window.zenAudio
 */
export function loadPreset(presetName, engine = window.zenAudio) {
    if (!engine) {
        console.error("Presets: AudioEngine instance is required. Call from browser console after initAudioEngineForTesting().");
        return;
    }

    const preset = PRESETS[presetName];
    if (!preset) {
        console.error(`Presets: Preset '${presetName}' not found. Available presets: ${Object.keys(PRESETS).join(', ')}`);
        return;
    }

    console.log(`Presets: Loading preset '${preset.name}' ${preset.icon} - ${preset.description}`);

    // Stop all currently playing sounds
    const activeSoundNames = Array.from(engine.activeSources.keys());
    activeSoundNames.forEach(soundName => {
        engine.stopSound(soundName);
    });

    // Start preset sounds
    for (const [soundName, volume] of Object.entries(preset.sounds)) {
        // Only attempt to play if the sound is loaded in the buffers
        if (engine.buffers.has(soundName)) {
            engine.playSound(soundName, volume);
        } else {
            console.warn(`Presets: Sound '${soundName}' is not loaded in the audio engine.`);
        }
    }
    
    console.log(`Presets: Preset '${presetName}' loaded successfully.`);
}

// Expose to window for testing as required by acceptance criteria
if (typeof window !== 'undefined') {
    window.getPresets = getPresets;
    window.loadPreset = loadPreset;
}
