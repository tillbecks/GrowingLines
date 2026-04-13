import {IMAGEPOSITION, INFORMATIONCONTENT } from "../config/infoContentConfig.js";

export function bindObjectToInfoBox(objectId, contentObjectKey){
    const element = document.getElementById(objectId);
    if(INFORMATIONCONTENT[contentObjectKey]){
        element.addEventListener("click", () => {
            setInfoBoxContent(INFORMATIONCONTENT[contentObjectKey]);
            //toggleInfoBox(true);
        });
    }
}

function setInfoBoxContent(contentObject){
    const infoBox = document.getElementById("infoBox");
    const title = document.getElementById("infoBoxTitle");
    const text = document.getElementById("infoBoxText");
    const imageContainer = document.getElementById("infoBoxImageContainer");

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

const infoSection = document.getElementById("infoSection");
const infoBoxHideButton = document.getElementById("infoBoxHideButton");

function toggleInfoBox(show = null){
    if(show == true || infoSection.classList.contains("collapsed")){
        infoSection.classList.remove("collapsed");
        infoBoxHideButton.value = "hide InfoBox";
    } else {
        infoSection.classList.add("collapsed");
        infoBoxHideButton.value = "show InfoBox";
    }
}

document.getElementById("infoBoxHideButton").addEventListener("click", toggleInfoBox);

export function addBindingsToInfoBox(){
    bindObjectToInfoBox("growLogo", "growProject");
    bindObjectToInfoBox("editModeButton", "editMode");
    bindObjectToInfoBox("startPointButton", "startPointMode");
    bindObjectToInfoBox("joinPointButton", "joinPointMode");
}