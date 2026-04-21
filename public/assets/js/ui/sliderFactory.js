import * as INFOBOX from "./infoBox.js";
import * as SLIDERUPDATES from "./sliderUpdates.js";
import { TREECONFIGVARIABLES, SLIDERSECTIONS } from "../config/sliderConfig.js";
import * as SLIDERNAMING from "../config/sliderNaming.js";
import dom from "../state/domState.js";

function createSlider(id, config, container) {
    const { label, min, max, defaultValue, step, description, func,} = config;

    // Label
    const labelEl = dom.createElement("p");
    labelEl.id = SLIDERNAMING.labelName(id);
    labelEl.className = "slider-label";
    labelEl.textContent = label;
    container.appendChild(labelEl);
    INFOBOX.bindObjectToInfoBox(labelEl.id, description);
    
    // Decrement Button
    const decrBtn = dom.createElement("input");
    decrBtn.type = "button";
    decrBtn.id = SLIDERNAMING.decrButtonName(id);
    decrBtn.className = "button font-bold";
    decrBtn.value = "\u25C0";
    container.appendChild(decrBtn);
    
    // Slider
    const slider = dom.createElement("input");
    slider.type = "range";
    slider.id = SLIDERNAMING.sliderName(id);
    slider.min = min;
    slider.max = max;
    slider.value = defaultValue;
    slider.step = step;
    slider.className = "slider";
    slider.autocomplete = "off";
    container.appendChild(slider);
    
    // Increment Button
    const incrBtn = dom.createElement("input");
    incrBtn.type = "button";
    incrBtn.id = SLIDERNAMING.incrButtonName(id);
    incrBtn.className = "button font-bold";
    incrBtn.value = "\u25B6";
    container.appendChild(incrBtn);
    
    // Value Display
    const valueSpan = dom.createElement("span");
    valueSpan.id = SLIDERNAMING.valueName(id);
    valueSpan.className = "font-bold";
    valueSpan.textContent = defaultValue;
    container.appendChild(valueSpan);

    SLIDERUPDATES.bindSliderToConfig(slider.id, valueSpan.id, id, func);
    SLIDERUPDATES.bindButtonToSlider(decrBtn.id, slider.id, -1);
    SLIDERUPDATES.bindButtonToSlider(incrBtn.id, slider.id, 1);
}

function createSynchronizer(config, container){
    const { label, main, secondary, description } = config;

    const labelSync = dom.createElement("p");
    labelSync.id = SLIDERNAMING.synchronizerLabelName(main, secondary);
    labelSync.className = "slider-label";
    labelSync.textContent = label;
    container.appendChild(labelSync);
    INFOBOX.bindObjectToInfoBox(labelSync.id, description);

    const checkbox = dom.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = SLIDERNAMING.synchronizerCheckboxName(main, secondary);
    checkbox.className = "sync-checkbox";
    checkbox.checked = true;
    checkbox.autocomplete = "off";
    container.appendChild(checkbox);

    for(let i = 0; i < 3; i++){
        const emptyDiv = dom.createElement("div");
        container.appendChild(emptyDiv);
    }
}

export function createSliderSection(){
    const advSettingsContainer = dom.getElementById("advancedSettingsContainer");

    for(const section in SLIDERSECTIONS){

        const title = dom.createElement("h1");
        title.className = "slider-section-header";
        title.textContent = SLIDERSECTIONS[section].title;
        advSettingsContainer.appendChild(title);

        const sectionContainer = dom.createElement("div");
        sectionContainer.className = "grid-5-no-pad";
        advSettingsContainer.appendChild(sectionContainer);

        for(const variable of SLIDERSECTIONS[section].variables){
            for(const synchronizer of SLIDERSECTIONS[section].synchronizer){
                if(synchronizer.main === variable){
                    createSynchronizer(synchronizer, sectionContainer);
                }
            }
            createSlider(variable, TREECONFIGVARIABLES[variable], sectionContainer);
        }

        for(const synchronizer of SLIDERSECTIONS[section].synchronizer){
            SLIDERUPDATES.bindSynchronizer(SLIDERNAMING.synchronizerCheckboxName(synchronizer.main, synchronizer.secondary), SLIDERNAMING.sliderName(synchronizer.main), SLIDERNAMING.sliderName(synchronizer.secondary));
        }
    }
}

