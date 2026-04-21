import * as EDITMODE from "../canvas/editMode.js";
import state from "../state/state.js";
import * as AGECOUNTER from "./ageCounter.js";

export function bindMouseHandlers(){
    document.onmousemove = handleMouseMove;
    document.onmousedown = handleMouseDown;
}

function handleMouseDown(event){
    if(state.editModeState.editMode){
        EDITMODE.handleMouseDown(event, state);
    }
}

function handleMouseMove(event){
    if(state.editModeState.editMode){
        EDITMODE.handleMouseMove(event, state);
    }
    
    AGECOUNTER.handleMouseMove(event);
}