import * as TCPRESETS from "../config/treeConfigPresets.js";
import * as sliderUpdates from "./sliderUpdates.js";
import { activateSaveButton, deactivateSaveButton } from "./presetPopup.js";
import { CUSTOMNAME } from "../config/appConfig.js";
import * as PSTORAGE from "../config/customPresetStorage.js";

const presetSelector = document.getElementById("presetSelector");
let lastPresetIndex = -1;
let customPresetList = [];

export function configurePresetSelector(){
    reloadPresetSelector();
    
    presetSelector.value = TCPRESETS.defaultTreeConfigIndex;
}

export function reloadPresetSelector(){
    while(presetSelector.firstChild){
        presetSelector.removeChild(presetSelector.firstChild);
    }

    const customOption = document.createElement("option");
    customOption.value = CUSTOMNAME;
    customOption.textContent = CUSTOMNAME;
    presetSelector.appendChild(customOption);
    
    for (let i = 0; i < TCPRESETS.treeConfigs.length; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = TCPRESETS.treeConfigs[i].name;
        option.addEventListener("click", () => {
            loadPreset(option.value);
            deactivateSaveButton();
        });
        presetSelector.appendChild(option);
    }

    loadCustomPresets();
}

function loadCustomPresets(){
    customPresetList = PSTORAGE.getCustomPresetNames();
    for(let i = 0; i < customPresetList.length; i++){
        const name = customPresetList[i];
        const option = document.createElement("option");
        option.value = i + TCPRESETS.treeConfigs.length; // Custom presets start after default presets
        option.textContent = name;
        option.addEventListener("click", () => {
            loadPreset(option.value);
            deactivateSaveButton();
        });
        presetSelector.appendChild(option);
    }
}

function loadPreset(presetIndex){
    if(presetIndex != lastPresetIndex){
        lastPresetIndex = presetIndex;
        if(presetIndex < 0 || presetIndex >= TCPRESETS.treeConfigs.length + customPresetList.length){
            setCustomValue();
        }else if(presetIndex >= TCPRESETS.treeConfigs.length){
            let config = PSTORAGE.loadCustomPreset(customPresetList[presetIndex - TCPRESETS.treeConfigs.length]);
            // Slider synchronization -> triggers state update automatically
            sliderUpdates.updateSlidersFromConfig(config);
            deactivateSaveButton();
        }
        else{
            let config = TCPRESETS.treeConfigs[presetIndex];
            
            sliderUpdates.updateSlidersFromConfig(config);
            deactivateSaveButton();
        }
    }
}

export function setCustomValue(){
    presetSelector.value = CUSTOMNAME;
    activateSaveButton();
}

export function loadDefaultPreset(){
    loadPreset(TCPRESETS.defaultTreeConfigIndex);
}

