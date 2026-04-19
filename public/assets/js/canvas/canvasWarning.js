import { WARNINGDISPLAYTIME, WARNINGREMOVETIME } from "../config/appConfig.js";

/**
 * Spawns a temporary warning message on the canvas that 
 * @param {string} warningMessage - The warning message text to display
 * @returns {void}
 */
export default function spawnWarning(warningMessage){
    const canvasSection = document.getElementById("canvasAgeContainer");

    const warningBox = document.createElement("div");
    warningBox.classList.add('warningBox');
    warningBox.textContent = warningMessage;

    canvasSection.appendChild(warningBox);

    // Automatically make the warning box fade out and remove it after a certain time
    setTimeout(() => {
        warningBox.classList.add('fade-out');

        setTimeout(() => {
            canvasSection.removeChild(warningBox);
        }, WARNINGREMOVETIME); // Match this duration with the CSS fade-out transition
    }, WARNINGDISPLAYTIME);
}