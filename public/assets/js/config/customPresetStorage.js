const CUSTOM_PRESETS_KEY = 'customPresets';

/**
 * Saves a custom preset to localStorage
 * @param {string} presetName - Name of the preset
 * @param {object} config - The configuration object to save
 * @returns {boolean} true if saved successfully, false if no space or error
 */
export function saveCustomPreset(presetName, config) {
    try {
        const customPresets = JSON.parse(localStorage.getItem(CUSTOM_PRESETS_KEY) || '{}');
        customPresets[presetName] = {
            config: config,
            savedAt: new Date().toISOString()
        };
        localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(customPresets));
        return true;
    } catch (e) {
        if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            console.warn('localStorage quota exceeded');
            return false;
        }
        console.error('Error saving custom preset:', e);
        return false;
    }
}

/**
 * Loads a custom preset from localStorage
 * @param {string} presetName - Name of the preset to load
 * @returns {object|null} The configuration object or null if not found
 */
export function loadCustomPreset(presetName) {
    try {
        const customPresets = JSON.parse(localStorage.getItem(CUSTOM_PRESETS_KEY) || '{}');
        if (customPresets[presetName]) {
            return customPresets[presetName].config;
        }
        return null;
    } catch (e) {
        console.error('Error loading custom preset:', e);
        return null;
    }
}

/**
 * Gets all custom presets from localStorage
 * @returns {object} Object with preset names as keys and config objects as values
 */
export function getCustomPresets() {
    try {
        const customPresets = JSON.parse(localStorage.getItem(CUSTOM_PRESETS_KEY) || '{}');
        const result = {};
        for (const key in customPresets) {
            result[key] = customPresets[key].config;
        }
        return result;
    } catch (e) {
        console.error('Error getting custom presets:', e);
        return {};
    }
}

/**
 * Gets all custom preset names
 * @returns {string[]} Array of preset names
 */
export function getCustomPresetNames() {
    try {
        const customPresets = JSON.parse(localStorage.getItem(CUSTOM_PRESETS_KEY) || '{}');
        return Object.keys(customPresets);
    } catch (e) {
        console.error('Error getting custom preset names:', e);
        return [];
    }
}

/**
 * Deletes a custom preset from localStorage
 * @param {string} presetName - Name of the preset to delete
 * @returns {boolean} true if deleted successfully, false if not found or error
 */
export function deleteCustomPreset(presetName) {
    try {
        const customPresets = JSON.parse(localStorage.getItem(CUSTOM_PRESETS_KEY) || '{}');
        if (customPresets[presetName]) {
            delete customPresets[presetName];
            localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(customPresets));
            return true;
        }
        return false;
    } catch (e) {
        console.error('Error deleting custom preset:', e);
        return false;
    }
}

/**
 * Checks if a preset exists
 * @param {string} presetName - Name of the preset
 * @returns {boolean} true if preset exists
 */
export function presetExists(presetName) {
    try {
        const customPresets = JSON.parse(localStorage.getItem(CUSTOM_PRESETS_KEY) || '{}');
        return presetName in customPresets;
    } catch (e) {
        console.error('Error checking if preset exists:', e);
        return false;
    }
}

/**
 * Clears all custom presets
 * @returns {boolean} true if cleared successfully
 */
export function clearAllCustomPresets() {
    try {
        localStorage.removeItem(CUSTOM_PRESETS_KEY);
        return true;
    } catch (e) {
        console.error('Error clearing custom presets:', e);
        return false;
    }
}
