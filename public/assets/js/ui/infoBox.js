import { INFORMATIONCONTENT } from "./config/infoContentConfig.js";

export function bindObjectToInfoBox(objectId, contentObjectKey){
    const element = document.getElementById(objectId);
    if(INFORMATIONCONTENT[contentObjectKey]){
        element.addEventListener("click", () => {
            setInfoBoxContent(INFORMATIONCONTENT[contentObjectKey]);
            toggleInfoBox(true);
        });
    }
}

function setInfoBoxContent(contentObject){
    const title = document.getElementById("infoBoxTitle");
    const text = document.getElementById("infoBoxText");
    const imageContainer = document.getElementById("infoBoxImageContainer");

    title.textContent = contentObject.title;
    text.textContent = contentObject.text;
    
    imageContainer.innerHTML = "";
    for(const image of contentObject.images){
        imageContainer.appendChild(createImageDescription(image.src, image.alt, image.description));
    }
}

function createImageDescription(src, alt="", description){
    const container = document.createElement("div");
    container.style = "image-desription-container"

    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.style = "info-img";

    const desc = document.createElement("p");
    desc.textContent = description;
    desc.style = "img-desc";

    container.appendChild(img);
    container.appendChild(desc);

    return container;
}

const infoBoxContainer = document.getElementById("infoBoxContainer");
const infoBoxHideButton = document.getElementById("infoBoxHideButton");

function toggleInfoBox(show = null){
    if(show == true || infoBoxContainer.classList.contains("collapsed")){
        infoBoxContainer.classList.remove("collapsed");
        infoBoxHideButton.value = "hide InfoBox";
    } else {
        infoBoxContainer.classList.add("collapsed");
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