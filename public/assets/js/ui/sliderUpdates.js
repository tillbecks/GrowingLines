import state from "../state/state.js";
import { TREECONFIGVARIABLES } from "../config/sliderConfig.js";
import * as SLIDERNAMING from "../config/sliderNaming.js";
import { setCustomValue } from "./presetLoader.js";
import dom from "../state/domState.js";

let ignoreSync = false;

export function bindSliderToConfig(sliderId, valueId, configKey, conversionFunc = x=>x){
    dom.getElementById(sliderId).addEventListener("input", (event)=>{
        dom.getElementById(valueId).textContent = event.target.value;
        state.treeConfig[configKey] = conversionFunc(parseFloat(event.target.value));
        if(!ignoreSync){
            setCustomValue();
        }
    });
}

/**
 * Binds a button to a slider for incrementing or decrementing the slider value while holding the button down.
 * @param {string} buttonId 
 * @param {string} sliderId 
 * @param {number} increment 
 */
export function bindButtonToSlider(buttonId, sliderId, increment=1){
    const button = dom.getElementById(buttonId);
    let intervalId = null;

    // Helper function to count the number of decimal places in the slider step value.
    function countDecimals(num) {
        const numStr = num.toString();
        if (numStr.includes('.')) {
            return numStr.split('.')[1].length;
        }
        return 0;
    }

    // Function to perform a single step increment/decrement and update the slider value.
    function step() {
        const slider = dom.getElementById(sliderId);
        const step = parseFloat(slider.step);
        let newValue = parseFloat(slider.value) + step * increment;
        newValue = newValue.toFixed(countDecimals(step));

        slider.value = newValue;
        slider.dispatchEvent(new Event('input'));
    }

    function startHold() {
        step(); // Sofortiger erster Schritt
        intervalId = setInterval(step, 80);
    }

    function stopHold() {
        if (intervalId !== null) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    button.addEventListener('mousedown', startHold);
    button.addEventListener('mouseup', stopHold);
    button.addEventListener('mouseleave', stopHold);

    // Touch-Support
    button.addEventListener('touchstart', (e) => { e.preventDefault(); startHold(); });
    button.addEventListener('touchend', stopHold);
    button.addEventListener('touchcancel', stopHold);
}

/**
 * Binds a checkbox to synchronize the values of two input elements.
 * @param {string} checkboxId 
 * @param {string} mainId 
 * @param {string} secondaryId 
 */
export function bindSynchronizer(checkboxId, mainId, secondaryId){
    const checkbox = dom.getElementById(checkboxId);
    const mainElement = dom.getElementById(mainId);
    const secondaryElement = dom.getElementById(secondaryId);

    checkbox.addEventListener('change', () => {
        if (checkbox.checked && !ignoreSync) {
            secondaryElement.value = mainElement.value;
            secondaryElement.dispatchEvent(new Event('input'));
        }
    });

    mainElement.addEventListener('input', () => {
        if (checkbox.checked && mainElement.value !== secondaryElement.value && !ignoreSync) {
            secondaryElement.value = mainElement.value;
            secondaryElement.dispatchEvent(new Event('input'));
        }
    });

    secondaryElement.addEventListener('input', () => {
        if (checkbox.checked && mainElement.value !== secondaryElement.value && !ignoreSync) {
            mainElement.value = secondaryElement.value;
            mainElement.dispatchEvent(new Event('input'));
        }
    });
}

/**
 * Updates the values of sliders based on a configuration object.
 * @param {Object} config 
 */
export function updateSlidersFromConfig(config){
    ignoreSync = true;
    for(let configKey in TREECONFIGVARIABLES){
        const sliderId = SLIDERNAMING.sliderName(configKey);
        if(Object.hasOwn(config, configKey)){
            const slider = dom.getElementById(sliderId);
            let value = config[configKey];

            value = TREECONFIGVARIABLES[configKey].inverseFunc(value);

            slider.value = value;
            slider.dispatchEvent(new Event('input'));
        }
    }
    ignoreSync = false; 
}