import {HIDEADVANCEDSETTINGSONINIT} from '../config/appConfig.js';
import dom from '../state/domState.js';

//Toggle Advanced Settings visibility

export function init(){
    if(HIDEADVANCEDSETTINGSONINIT){
        dom.advancedSettingsContainer.classList.add('hidden');
    }
    setSettingsArrows();
}

dom.advancedSettingsToggle.addEventListener('click', () => {
    const isHidden = dom.advancedSettingsContainer.classList.contains('hidden');
    if (isHidden) {
        dom.advancedSettingsContainer.classList.remove('hidden');
    } else {
        dom.advancedSettingsContainer.classList.add('hidden');
    }
    setSettingsArrows();
});

function setSettingsArrows(){
    const isHidden = dom.advancedSettingsContainer.classList.contains('hidden');
    dom.settingsArrow.textContent = isHidden ? '\u25BC' : '\u25B2';
}