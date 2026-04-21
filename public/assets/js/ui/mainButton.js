import state from "../state/state.js";
import dom from "../state/domState.js";
import * as EDITMODE from "../canvas/editMode.js";
import * as CD from "../canvas/canvasDrawing.js";
import * as GROWING from "../tree/growing.js";
import * as SB from "../tree/structBuilder.js";
import * as AGECOUNTER from "./ageCounter.js";
import {redrawAndDownloadCanvasAsImage} from "./downloadCanvas.js";
import * as CANVASDRAWING from "../canvas/canvasDrawing.js";

let actionQueue = Promise.resolve();

function enqueueAction(action){
    actionQueue = actionQueue.then(action);
}

export function bindMainButtons(){
    dom.buttons.resetButton.addEventListener("click", ()=>{enqueueAction(totalReset);});
    dom.buttons.growButton.addEventListener("click", ()=>{enqueueAction(grow);});
    dom.buttons.resetGrow.addEventListener("click", ()=>{enqueueAction(growReset);});
    dom.buttons.editMode.addEventListener("click", ()=>{enqueueAction(setEditMode);});

    dom.buttons.stopGrow.addEventListener("click", ()=>{state.setPlay();});
    dom.buttons.startPoint.addEventListener("click", ()=>{state.setStartPointModus();});
    dom.buttons.joinPoint.addEventListener("click", ()=>{state.setJoinPointModus();});
    dom.buttons.download.addEventListener("click", ()=>{redrawAndDownloadCanvasAsImage(state.strokeState.structs);});
}

/**
 * Resets the entire application state corresponding to the drawing and struct generation process.
 */
async function totalReset(){
    if(state.editModeState.editMode){
        EDITMODE.setEditMode(state);
    }
    await GROWING.abordGrowing(state);
    state.reset("canvas");
    AGECOUNTER.updateAgeCounter(0, state.treeConfig.maxAge);
}


/**
 * Resets the state related to the growth process, but keeps the current strokes and their struct representation intact. 
 */
async function growReset(){
    if(state.editModeState.editMode){
        EDITMODE.setEditMode(state);
    }
    await GROWING.abordGrowing(state);
    CD.redrawStrokes(dom.canvas.trace, dom.canvasContext);
    state.reset("grow");
    AGECOUNTER.updateAgeCounter(0, state.treeConfig.maxAge);
}

export function callGrow(){
    enqueueAction(grow);
}

/**
 * Initiates the growth process
 */
async function grow(){
    if(state.editModeState.editMode){
        EDITMODE.setEditMode(state);
    }
    await GROWING.abordGrowing(state);
    state.reset("grow");
    
    state.cleanUpStartAndJoinPoints();
    state.checkStrokeStart();    

    state.strokeState.structs = SB.createStructRootsFromStrokes(state.strokeState.strokes, state.strokeState.strokeStarts, state.strokeState.joinPoints, state.treeConfig);
     
    AGECOUNTER.updateAgeCounter(0, state.treeConfig.maxAge);
    GROWING.growStructs(state);
}

/**
 * Handles the enabling and disabling of edit mode, as well as the visualization and interaction of start and join point placement
 * @param {Object} state 
 * @returns {void}
 */
export async function setEditMode(){
    //Activation of edit mode
    if(!state.editModeState.editMode){
        await GROWING.abordGrowing(state);
        
        //Update associated states and UI elements 
        state.setEditMode(true);

        //Draw edit mode visualization
        CANVASDRAWING.drawEditMode(dom.canvasContext, state.strokeState.strokes, state.strokeState.strokeStarts, state.strokeState.joinPoints, dom.canvas.trace);

    }
    else{
        //Update associated state and UI elements
        state.setEditMode(false);

        //Redraw canvas with current strokes and structs
        CANVASDRAWING.drawStructs(dom.canvas.trace, state.strokeState.structs, dom.pureCanvas, dom.backgroundCanvas);
    }
}
