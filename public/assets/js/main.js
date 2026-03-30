import * as TREE from "./tree.js";
import * as UTILS from "./utils.js";
import * as GROWING from "./growing.js";
import * as structBuilder from "./structBuilder.js";
import * as canvasDrawing from "./canvasDrawing.js";
import * as editMode from "./editMode.js";
import State from "./state.js";

const debug = false;
const state = new State();

let actionQueue = Promise.resolve();

function enqueueAction(action){
    actionQueue = actionQueue.then(action);
}

state.dom.buttons.resetButton.addEventListener("click", ()=>{enqueueAction(totalReset);});
state.dom.buttons.growButton.addEventListener("click", ()=>{enqueueAction(grow);});
state.dom.buttons.resetGrow.addEventListener("click", ()=>{enqueueAction(growReset);});
state.dom.buttons.stopGrow.addEventListener("click", ()=>{state.setPlay();});
state.dom.buttons.editMode.addEventListener("click", ()=>{editMode.setEditMode(state);});
state.dom.buttons.startPoint.addEventListener("click", ()=>{state.setStartPointModus();});
state.dom.buttons.joinPoint.addEventListener("click", ()=>{state.setJoinPointModus();});
state.dom.buttons.download.addEventListener("click", downloadCanvasAsImage);

document.onmousemove = handleMouseMove;
document.onmousedown = handleMouseDown;

function handleMouseDown(event){
    if(state.editModeState.editMode){
        editMode.handleMouseDown(event, state);
    }
}

function handleMouseMove(event){
    if(state.editModeState.editMode){
        editMode.handleMouseMove(event, state);
    }
}

async function totalReset(){
    await GROWING.abordGrowing(state);
    state.reset("canvas");
    state.dom.canvas.erase();
}

async function growReset(){
    await GROWING.abordGrowing(state);
    canvasDrawing.redrawStrokes(state.dom.canvas.trace, state.dom.canvasContext);
    state.reset("grow");
}

async function grow(){
    await GROWING.abordGrowing(state);

    if(state.dom.canvas.hasChanged){
        state.strokeState.strokes = UTILS.strokePreprocessing(state.dom.canvas.getTrace(), state.treeConfig.sproutingLength);
        state.checkStrokeStarts();
    }

    state.strokeState.structs = structBuilder.createStructRootsFromStrokes(state.strokeState.strokes, state.strokeState.strokeStarts, state.strokeState.joinPoints, state.treeConfig);
     
    GROWING.growStructs(state, debug);
}

function downloadCanvasAsImage(){
    const link = document.createElement('a');
    link.href = state.dom.pureCanvas.toDataURL('image/png');
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    link.download = `canvas_${timestamp}.png`;
    link.click();
}