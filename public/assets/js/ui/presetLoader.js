import * as TCPRESETS from "../config/treeConfigPresets.js";
import * as sliderUpdates from "./sliderUpdates.js";
import { activateSaveButton, deactivateSaveButton } from "./presetPopup.js";
import { CUSTOMNAME } from "../config/appConfig.js";
import * as PSTORAGE from "../config/customPresetStorage.js";
import dom from "../state/domState.js";

//The presets are devided into default presets, which are defined in the TCPRESETS file, and custom presets, which can be created by the user and are stored in the local storage. 
let lastPresetIndex = -1;
let customPresetList = [];

/**
 * Configures the preset selector with default options and custom presets.
 */
export function configurePresetSelector(){
    reloadPresetSelector();
    
    dom.presetSelector.value = TCPRESETS.defaultTreeConfigIndex;
}

/**
 * Reloads the preset selector options, including default and custom presets.
 */
export function reloadPresetSelector(){
    while(dom.presetSelector.firstChild){
        dom.presetSelector.removeChild(dom.presetSelector.firstChild);
    }

    const customOption = dom.createElement("option");
    customOption.value = CUSTOMNAME;
    customOption.textContent = CUSTOMNAME;
    dom.presetSelector.appendChild(customOption);
    
    //Create options for default presets
    for (let i = 0; i < TCPRESETS.treeConfigs.length; i++) {
        const option = dom.createElement("option");
        option.value = i;
        option.textContent = TCPRESETS.treeConfigs[i].name;
        dom.presetSelector.appendChild(option);
    }

    loadCustomPresets();
    
    // Use change event instead of click for better mobile compatibility
    dom.presetSelector.addEventListener("change", () => {
        handlePresetChange(dom.presetSelector.value);
    });
}

//Loads custom presets from local storage and adds them to the preset selector.
function loadCustomPresets(){
    customPresetList = PSTORAGE.getCustomPresetNames();
    for(let i = 0; i < customPresetList.length; i++){
        const name = customPresetList[i];
        const option = dom.createElement("option");
        option.value = i + TCPRESETS.treeConfigs.length; // Custom presets start after default presets
        option.textContent = name;
        dom.presetSelector.appendChild(option);
    }
}

/**
 * Handles changes in the preset selector, loading the selected preset or activating custom mode.
 * @param {string} value 
 */
function handlePresetChange(value) {
    if (value === CUSTOMNAME) {
        setCustomValue();
    } else {
        loadPreset(parseInt(value));
    }
}

/**
 * Loads a preset based on its index.
 * @param {number} presetIndex 
 */
function loadPreset(presetIndex){
    if(presetIndex != lastPresetIndex){
        //Variable to avoid multiple loading
        lastPresetIndex = presetIndex;
        //If the preset index is out of bounds, we set it to custom value
        if(presetIndex < 0 || presetIndex >= TCPRESETS.treeConfigs.length + customPresetList.length){
            setCustomValue();
        }
        else{
            //Either load presets from TCPRESETS or from local storage, depending on the index
            let config = presetIndex >= TCPRESETS.treeConfigs.length ? PSTORAGE.loadCustomPreset(customPresetList[presetIndex - TCPRESETS.treeConfigs.length]) : TCPRESETS.treeConfigs[presetIndex];
            
            sliderUpdates.updateSlidersFromConfig(config);
            deactivateSaveButton();
        }
    }
}

export function setLatestValue(){
    const lastIndex = TCPRESETS.treeConfigs.length + customPresetList.length - 1;
    dom.presetSelector.value = lastIndex;
    handlePresetChange(lastIndex);
}

/**
 * Sets the preset selector to the custom value and activates the save button for saving a new custom preset.
 */
export function setCustomValue(){
    dom.presetSelector.value = CUSTOMNAME;
    activateSaveButton();
}

export function loadDefaultPreset(){
    loadPreset(TCPRESETS.defaultTreeConfigIndex);
}

