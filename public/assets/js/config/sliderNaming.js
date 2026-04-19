// This module provides utility functions for generating consistent element IDs for sliders and their associated labels, values, and buttons.  

export function sliderName(id){
    return `${id}Slider`;
}

export function labelName(id){
    return `${id}Label`;
}

export function valueName(id){
    return `${id}Value`;
}

export function decrButtonName(id){
    return `${id}DecrButton`;
}

export function incrButtonName(id){
    return `${id}IncrButton`;
}

export function synchronizerLabelName(mainId, secondaryId){
    return `sync${mainId}${secondaryId}Label`;
}

export function synchronizerCheckboxName(mainId, secondaryId){
    return `sync${mainId}${secondaryId}Check`;
}