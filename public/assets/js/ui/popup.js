import dom from "../state/domState.js";

export function setPopupContent(content){
    while(dom.popupContent.firstChild){
        dom.popupContent.removeChild(dom.popupContent.firstChild);
    }

    dom.popupContent.appendChild(content);

    dom.popup.classList.toggle("active", true);
}

export function hidePopup(){
    const popup = document.getElementById("popup");

    popup.classList.toggle("active", false);
}


