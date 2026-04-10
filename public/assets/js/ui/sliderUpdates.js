import state from "../state/state.js";
import { TREECONFIGVARIABLES } from "../config/sliderConfig.js";
import * as SLIDERNAMING from "../config/sliderNaming.js";

export function bindSliderToConfig(sliderId, valueId, configKey, conversionFunc = x=>x){
    document.getElementById(sliderId).addEventListener("input", (event)=>{
        document.getElementById(valueId).textContent = event.target.value;
        state.treeConfig[configKey] = conversionFunc(parseFloat(event.target.value));
    });
}

export function bindButtonToSlider(buttonId, sliderId, increment=1){
    const button = document.getElementById(buttonId);
    let intervalId = null;

    function countDecimals(num) {
        const numStr = num.toString();
        if (numStr.includes('.')) {
            return numStr.split('.')[1].length;
        }
        return 0;
    }

    function step() {
        const slider = document.getElementById(sliderId);
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

let ignoreSync = false;
export function bindSynchronizer(checkboxId, mainId, secondaryId){
    const checkbox = document.getElementById(checkboxId);
    const mainElement = document.getElementById(mainId);
    const secondaryElement = document.getElementById(secondaryId);

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

export function updateSlidersFromConfig(config){
    ignoreSync = true;
    for(let configKey in TREECONFIGVARIABLES){
        const sliderId = SLIDERNAMING.sliderName(configKey);
        if(Object.hasOwn(config, configKey)){
            const slider = document.getElementById(sliderId);
            let value = config[configKey];

            value = TREECONFIGVARIABLES[configKey].inverseFunc(value);

            slider.value = value;
            slider.dispatchEvent(new Event('input'));
        }
    }
    ignoreSync = false; 
}