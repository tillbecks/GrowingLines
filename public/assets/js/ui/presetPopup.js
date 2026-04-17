import { saveCustomPreset, getCustomPresetNames, deleteCustomPreset } from "../config/customPresetStorage.js";
import * as POPUP from "./popup.js";
import { highlightTemporary } from "../config/utils.js";
import state from "../state/state.js";
import { reloadPresetSelector } from "./presetLoader.js";

function getSetNameContent(){
    const title = document.createElement("p");
    title.textContent = "Give your preset a name";
    title.classList.add("popup-title");

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.placeholder = "Enter preset name";
    nameInput.classList.add("text-input");

    const buttonDiv = document.createElement("div");
    buttonDiv.classList.add("popup-button-div");

    const submitButton = document.createElement("button");
    submitButton.textContent = "Save";
    submitButton.classList.add("button");
    submitButton.addEventListener("click", () => {
        submitFunction(nameInput);
    });

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.classList.add("button");
    cancelButton.addEventListener("click", () => {
        POPUP.hidePopup();
    });

    buttonDiv.appendChild(submitButton);
    buttonDiv.appendChild(cancelButton);

    const container = document.createElement("div");
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
        const success = saveCustomPreset(name, state.treeConfig);
        if(success){
            POPUP.setPopupContent(getSuccesfulSaveContent());
        }else{
            POPUP.setPopupContent(getReplacePresetContent(name));
        }
    }
}

function getSuccesfulSaveContent(){
    const title = document.createElement("p");
    title.textContent = "Preset saved successfully!";
    title.classList.add("popup-title");

    const okButton = document.createElement("button");
    okButton.textContent = "OK";
    okButton.classList.add("button");
    okButton.addEventListener("click", () => {
        POPUP.hidePopup();
        reloadPresetSelector();
    });

    const container = document.createElement("div");
    container.classList.add("popup-content-div");
    container.appendChild(title);
    container.appendChild(okButton);

    return container;
}

function getErrorContent(errorMessage){
    const title = document.createElement("p");
    title.textContent = "Error";
    title.classList.add("popup-title");

    const message = document.createElement("p");
    message.textContent = "Error: " + errorMessage;

    const okButton = document.createElement("button");
    okButton.textContent = "OK";
    okButton.classList.add("button");
    okButton.addEventListener("click", () => {
        POPUP.hidePopup();
    });

    const container = document.createElement("div");
    container.classList.add("popup-content-div");
    container.appendChild(title);
    container.appendChild(message);
    container.appendChild(okButton);

    return container;
}

function getReplacePresetContent(presetName){
    const title = document.createElement("p");
    title.textContent = "No space left save";
    title.classList.add("popup-title");

    const message = document.createElement("p");
    message.append(
        "No space left to save the preset.",
        document.createElement("br"),
        "You can choose an existing preset to replace:"
    );

    const presetNames = getCustomPresetNames();

    const presetDropdown = document.createElement("select");
    presetDropdown.classList.add("preset-dropdown");
    for(const name of presetNames){
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        presetDropdown.appendChild(option);
    }

    const buttonDiv = document.createElement("div");
    buttonDiv.classList.add("popup-button-div");

    const replaceButton = document.createElement("button");
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

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.classList.add("button");
    cancelButton.addEventListener("click", () => {
        POPUP.hidePopup();
    });

    buttonDiv.appendChild(replaceButton);
    buttonDiv.appendChild(cancelButton);

    const container = document.createElement("div");
    container.classList.add("popup-content-div");

    container.appendChild(title);
    container.appendChild(message);
    container.appendChild(presetDropdown);
    container.appendChild(buttonDiv);

    return container;
}

export function activateSaveButton(){
    const saveButton = document.getElementById("savePreset");
    saveButton.disabled = false;
    saveButton.addEventListener("click", () => {
        POPUP.setPopupContent(getSetNameContent());
    });
}

export function deactivateSaveButton(){
    const saveButton = document.getElementById("savePreset");
    saveButton.disabled = true;
}

