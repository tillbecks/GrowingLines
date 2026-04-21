import {IMAGEPOSITION, INFORMATIONCONTENT } from "../config/infoContentConfig.js";
import dom from "../state/domState.js";

/**
 * Binds an object to the info box for displaying information.
 * @param {*} objectId 
 * @param {*} contentObjectKey 
 */
export function bindObjectToInfoBox(objectId, contentObjectKey){
    const element = dom.getElementById(objectId);
    if(INFORMATIONCONTENT[contentObjectKey]){
        element.addEventListener("click", () => {
            setInfoBoxContent(INFORMATIONCONTENT[contentObjectKey]);
        });
    }
}

function setInfoBoxContent(contentObject){
    const infoBox = dom.getElementById("infoBox");
    const title = dom.getElementById("infoBoxTitle");
    const text = dom.getElementById("infoBoxText");
    const imageContainer = dom.getElementById("infoBoxImageContainer");

    title.textContent = contentObject.title;
    text.textContent = contentObject.text;

    imageContainer.classList.toggle("gallery", contentObject.imagePosition === IMAGEPOSITION.GALERY);
    infoBox.classList.toggle("gallery", contentObject.imagePosition === IMAGEPOSITION.GALERY);
    
    while(imageContainer.firstChild){
        imageContainer.removeChild(imageContainer.firstChild);
    }

    for(const image of contentObject.images){
        imageContainer.appendChild(createImageDescription(image.src, image.alt, image.description));
    }
}

function createImageDescription(src, alt="", description){
    const container = document.createElement("div");
    container.classList.add("image-description-container");

    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.classList.add("info-img");

    const desc = document.createElement("p");
    desc.textContent = description;
    desc.classList.add("img-desc");

    container.appendChild(img);
    container.appendChild(desc);

    return container;
}

/**
 * Sets the dimension of the info box container, so it can contain the absolute positioned hide button when the info box is collapsed.
 */
function updateButtonDimensions(){
    const width = dom.buttons.infoBoxHideButton.offsetWidth;
    const height = dom.buttons.infoBoxHideButton.offsetHeight;
    dom.infoBoxContainer.style.setProperty('--info-box-button-width', `${width}px`);
    dom.infoBoxContainer.style.setProperty('--info-box-button-height', `${height}px`);
}

function toggleInfoBox(show = null){
    if(show == true || dom.infoSection.classList.contains("collapsed")){
        dom.infoSection.classList.remove("collapsed");
        dom.buttons.infoBoxHideButton.value = "Hide Info Box";
    } else {
        dom.infoSection.classList.add("collapsed");
        dom.buttons.infoBoxHideButton.value = "Show Info Box";
        updateButtonDimensions();
    }
}

dom.buttons.infoBoxHideButton.addEventListener("click", toggleInfoBox);

// Beim initialen Laden die Größe setzen
window.addEventListener("DOMContentLoaded", updateButtonDimensions);
window.addEventListener("resize", updateButtonDimensions);

export function addBindingsToInfoBox(){
    bindObjectToInfoBox("growLogo", "growProject");
    bindObjectToInfoBox("editModeButton", "editMode");
    bindObjectToInfoBox("startPointButton", "startPointMode");
    bindObjectToInfoBox("joinPointButton", "joinPointMode");
    bindObjectToInfoBox("advancedSettingsToggle", "advancedSettings");
    bindObjectToInfoBox("controlsHeading", "controls");
    bindObjectToInfoBox("presetsHeading", "growthPresets");
}