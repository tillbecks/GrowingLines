import * as UTILS from "./config/utils.js";
import * as GROWING from "./tree/growing.js";
import * as SB from "./tree/structBuilder.js";
import * as CD from "./canvas/canvasDrawing.js";
import * as EDITMODE from "./canvas/editMode.js";
import * as AGECOUNTER from "./ui/ageCounter.js";
import * as SLIDERFACTORY from "./ui/sliderFactory.js";
import * as INFOBOX from "./ui/infoBox.js";
import * as PRESETLOADER from "./ui/presetLoader.js";
import * as TOGGLEADVANCEDSETTINGS from "./ui/toggleAdvancedSettings.js";
import * as APPCONFIG from "./config/appConfig.js";
import { initialDrawingData } from "./config/initDrawingData.js";
import state from "./state/state.js";
import { redrawAndDownloadCanvasAsImage } from "./ui/downloadCanvas.js";
import * as BACKGROUNDCANVAS from "./ui/backgroundCanvas.js";

SLIDERFACTORY.createSliderSection();
INFOBOX.addBindingsToInfoBox();
PRESETLOADER.configurePresetSelector();
PRESETLOADER.loadDefaultPreset();
TOGGLEADVANCEDSETTINGS.init();
AGECOUNTER.spawnCounter(state.treeConfig.maxAge);
BACKGROUNDCANVAS.initCanvas();

let actionQueue = Promise.resolve();

function enqueueAction(action){
    actionQueue = actionQueue.then(action);
}

state.dom.buttons.resetButton.addEventListener("click", ()=>{enqueueAction(totalReset);});
state.dom.buttons.growButton.addEventListener("click", ()=>{enqueueAction(grow);});
state.dom.buttons.resetGrow.addEventListener("click", ()=>{enqueueAction(growReset);});
state.dom.buttons.stopGrow.addEventListener("click", ()=>{state.setPlay();});
state.dom.buttons.editMode.addEventListener("click", ()=>{EDITMODE.setEditMode(state);});
state.dom.buttons.startPoint.addEventListener("click", ()=>{state.setStartPointModus();});
state.dom.buttons.joinPoint.addEventListener("click", ()=>{state.setJoinPointModus();});
state.dom.buttons.download.addEventListener("click", ()=>{redrawAndDownloadCanvasAsImage(state.dom.pureCanvas, state.strokeState.structs);});

document.onmousemove = handleMouseMove;
document.onmousedown = handleMouseDown;

if(APPCONFIG.INITDRAWING){
    state.insertTraceAndStrokeState(initialDrawingData.trace, initialDrawingData.strokeState);
    grow();
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
    
    // Hide counter when drawing on canvas
    if((AGECOUNTER.nearAgeCounter(event.clientX, event.clientY))){
        AGECOUNTER.softHideAgeCounter();
    }else{
        AGECOUNTER.softReviveAgeCounter();
    }
}

async function totalReset(){
    await GROWING.abordGrowing(state);
    state.reset("canvas");
    AGECOUNTER.updateAgeCounter(0, state.treeConfig.maxAge);
}

async function growReset(){
    await GROWING.abordGrowing(state);
    CD.redrawStrokes(state.dom.canvas.trace, state.dom.canvasContext);
    state.reset("grow");
    AGECOUNTER.updateAgeCounter(0, state.treeConfig.maxAge);
}

async function grow(){
    await GROWING.abordGrowing(state);
    state.reset("grow");

    if(state.dom.canvas.hasChanged){
        state.strokeState.strokes = UTILS.strokePreprocessing(state.dom.canvas.getTrace(), state.treeConfig.sproutingLength);
        state.checkStrokeStarts();
    }

    state.strokeState.structs = SB.createStructRootsFromStrokes(state.strokeState.strokes, state.strokeState.strokeStarts, state.strokeState.joinPoints, state.treeConfig);
     
    AGECOUNTER.updateAgeCounter(0, state.treeConfig.maxAge);
    GROWING.growStructs(state);
}

