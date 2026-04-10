import * as TCPRESETS from "../config/treeConfigPresets.js";
import * as sliderUpdates from "./sliderUpdates.js";

const presetSelector = document.getElementById("presetSelector");
const presetLoadButton = document.getElementById("loadPreset");

export function configurePresetSelector(){
    for (let i = 0; i < TCPRESETS.treeConfigs.length; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = TCPRESETS.treeConfigs[i].name;
        presetSelector.appendChild(option);
    }
    presetSelector.value = TCPRESETS.defaultTreeConfigIndex;
}

presetLoadButton.addEventListener("click", () => {
    const presetIndex = presetSelector.value;
    loadPreset(presetIndex);
});

function loadPreset(presetIndex){
    let config = TCPRESETS.treeConfigs[presetIndex];    
    // Slider synchronization -> triggers state update automatically
    sliderUpdates.updateSlidersFromConfig(config);
}

