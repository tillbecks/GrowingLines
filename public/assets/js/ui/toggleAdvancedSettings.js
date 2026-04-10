//Toggle Advanced Settings visibility
const advancedSettingsToggle = document.getElementById('advancedSettingsToggle');
const advancedSettingsContainer = document.getElementById('advancedSettingsContainer');
const settingsArrow = document.getElementById('settingsArrow');

export function init(){
    advancedSettingsContainer.style.display = 'none';
}

advancedSettingsToggle.addEventListener('click', () => {
const isHidden = advancedSettingsContainer.style.display === 'none';
advancedSettingsContainer.style.display = isHidden ? 'flex' : 'none';
settingsArrow.textContent = isHidden ? '⌃' : '⌄';
});