export function setPopupContent(content){
    const popup = document.getElementById("popup");
    const popupContent = document.getElementById("popupContent");

    while(popupContent.firstChild){
        popupContent.removeChild(popupContent.firstChild);
    }

    popupContent.appendChild(content);

    popup.classList.toggle("active", true);
}

export function hidePopup(){
    const popup = document.getElementById("popup");

    popup.classList.toggle("active", false);
}


