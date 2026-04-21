import { saveCustomPreset, getCustomPresetNames, deleteCustomPreset, isLocalStorageAvailable } from "../config/customPresetStorage.js";
import * as POPUP from "./popup.js";
import { highlightTemporary } from "../config/utils.js";
import state from "../state/state.js";
import { reloadPresetSelector, setLatestValue } from "./presetLoader.js";
import dom from "../state/domState.js";

function getSetNameContent(){
    const title = dom.createElement("p");
    title.textContent = "Give your preset a name";
    title.classList.add("popup-title");

    const nameInput = dom.createElement("input");
    nameInput.type = "text";
    nameInput.placeholder = "Enter preset name";
    nameInput.classList.add("text-input");

    const buttonDiv = dom.createElement("div");
    buttonDiv.classList.add("popup-button-div");

    const submitButton = dom.createElement("button");
    submitButton.textContent = "Save";
    submitButton.classList.add("button");
    submitButton.addEventListener("click", () => {
        submitFunction(nameInput);
    });

    const cancelButton = dom.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.classList.add("button");
    cancelButton.addEventListener("click", () => {
        POPUP.hidePopup();
    });

    buttonDiv.appendChild(submitButton);
    buttonDiv.appendChild(cancelButton);

    const container = dom.createElement("div");
    container.classList.add("popup-content-div");
    container.appendChild(title);
    container.appendChild(nameInput);
    container.appendChild(buttonDiv);
    return container;
}

function submitFunction(input){
    const name = input.value.trim();
    if(name.length <= 0 || name === "Custom"){
        highlightTemporary(input);
        return;
    }
    else{
        if(getCustomPresetNames().includes(name)){
            POPUP.setPopupContent(getReplaceNameContent(name));
        }else{
            savePresetWithName(name);
        }
    }
}

function savePresetWithName(name){
    const success = saveCustomPreset(name, state.treeConfig);
    if(success){
        POPUP.setPopupContent(getSuccesfulSaveContent());
    }else{
        POPUP.setPopupContent(getReplacePresetContent(name, true));
    }
}

function getSuccesfulSaveContent(){
    const title = dom.createElement("p");
    title.textContent = "Preset saved successfully!";
    title.classList.add("popup-title");

    const okButton = dom.createElement("button");
    okButton.textContent = "OK";
    okButton.classList.add("button");
    okButton.addEventListener("click", () => {
        POPUP.hidePopup();
        reloadPresetSelector();
        setLatestValue();
    });

    const container = dom.createElement("div");
    container.classList.add("popup-content-div");
    container.appendChild(title);
    container.appendChild(okButton);

    return container;
}

function getErrorContent(errorMessage){
    const title = dom.createElement("p");
    title.textContent = "Error";
    title.classList.add("popup-title");

    const message = dom.createElement("p");
    message.textContent = "Error: " + errorMessage;

    const okButton = dom.createElement("button");
    okButton.textContent = "OK";
    okButton.classList.add("button");
    okButton.addEventListener("click", () => {
        POPUP.hidePopup();
    });

    const container = dom.createElement("div");
    container.classList.add("popup-content-div");
    container.appendChild(title);
    container.appendChild(message);
    container.appendChild(okButton);

    return container;
}

function getReplaceNameContent(presetName){
    const title = dom.createElement("p");
    title.textContent = "Preset name already exists";
    title.classList.add("popup-title");

    const message = dom.createElement("p");
    message.append(
            "A preset with the name " + presetName + " already exists.",
            dom.createElement("br"),
            "Do you want to replace it or choose a different name?"
    );
    const buttonDiv = dom.createElement("div");
    buttonDiv.classList.add("popup-button-div");

    const replaceButton = dom.createElement("button");
    replaceButton.textContent = "Replace";
    replaceButton.classList.add("button");
    replaceButton.addEventListener("click", () => {
        savePresetWithName(presetName);
    });

    const renameNameButton = dom.createElement("button");
    renameNameButton.textContent = "Rename";
    renameNameButton.classList.add("button");
    renameNameButton.addEventListener("click", () => {
        POPUP.setPopupContent(getSetNameContent());
    });

    const cancelButton = dom.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.classList.add("button");
    cancelButton.addEventListener("click", () => {
        POPUP.hidePopup();
    });

    buttonDiv.appendChild(replaceButton);
    buttonDiv.appendChild(renameNameButton);
    buttonDiv.appendChild(cancelButton);

    const container = dom.createElement("div");
    container.classList.add("popup-content-div");
    container.appendChild(title);
    container.appendChild(message);
    container.appendChild(buttonDiv);

    return container;
}

function getReplacePresetContent(presetName, secondReplaceAttempt = false){
    const title = dom.createElement("p");
    title.textContent = "No space left save";
    title.classList.add("popup-title");

    const message = dom.createElement("p");
    if(secondReplaceAttempt){
        message.append(
            "Still no space left to save the preset.",
            dom.createElement("br"),
            "You can choose an existing preset to replace:"
        );
    }
    else{
        message.append(
            "No space left to save the preset.",
            dom.createElement("br"),
            "You can choose an existing preset to replace:"
        );
    } 

    const presetNames = getCustomPresetNames();

    const presetDropdown = dom.createElement("select");
    presetDropdown.classList.add("preset-dropdown");
    for(const name of presetNames){
        const option = dom.createElement("option");
        option.value = name;
        option.textContent = name;
        presetDropdown.appendChild(option);
    }

    const buttonDiv = dom.createElement("div");
    buttonDiv.classList.add("popup-button-div");

    const replaceButton = dom.createElement("button");
    replaceButton.textContent = "Replace";
    replaceButton.classList.add("button");
    replaceButton.addEventListener("click", () => {
        const selectedPreset = presetDropdown.value;
        deleteCustomPreset(selectedPreset);
        const success = saveCustomPreset(presetName, state.treeConfig);
        if(success){
            POPUP.setPopupContent(getSuccesfulSaveContent());
        }else{
            POPUP.setPopupContent(getErrorContent("An error occurred while replacing the preset."));
        }
    });

    const cancelButton = dom.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.classList.add("button");
    cancelButton.addEventListener("click", () => {
        POPUP.hidePopup();
    });

    buttonDiv.appendChild(replaceButton);
    buttonDiv.appendChild(cancelButton);

    const container = dom.createElement("div");
    container.classList.add("popup-content-div");

    container.appendChild(title);
    container.appendChild(message);
    container.appendChild(presetDropdown);
    container.appendChild(buttonDiv);

    return container;
}

export function activateSaveButton(){
    const saveButton = dom.getElementById("savePreset");
    if (!isLocalStorageAvailable()) {
        saveButton.style.display = "none";
        return;
    }
    saveButton.style.display = "";
    saveButton.disabled = false;
    saveButton.addEventListener("click", () => {
        POPUP.setPopupContent(getSetNameContent());
    });
}

export function deactivateSaveButton(){
    const saveButton = dom.getElementById("savePreset");
    saveButton.disabled = true;
}

