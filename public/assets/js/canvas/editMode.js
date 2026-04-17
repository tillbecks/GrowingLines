import * as JSPA from "../tree/joinStartPointActions.js";
import * as CANVASDRAWING from "./canvasDrawing.js";
import * as UTILS from "../config/utils.js";
import * as AGECOUNTER from "../ui/ageCounter.js";
import * as GROWING from "../tree/growing.js";

export async function setEditMode(state){
    if(!state.editModeState.editMode){
        await GROWING.abordGrowing(state);
        
        state.setEditMode(true);
        state.reset("editMode");
        
        state.dom.canvas.deactivate();
        if(state.dom.canvas.hasChanged){
            state.strokeState.strokes = UTILS.strokePreprocessing(state.dom.canvas.getTrace(), state.treeConfig.sproutingLength);
            state.checkStrokeStarts();
        }

        state.dom.pureCanvas.classList.add("not-allowed-cursor");
        state.dom.buttons.editMode.value = "Exit Edit Mode"; 

        CANVASDRAWING.drawEditMode(state.dom.canvasContext, state.strokeState.strokes, state.strokeState.strokeStarts, state.strokeState.joinPoints, state.dom.canvas.trace);
        state.dom.buttons.resetButton.disabled = true;
        state.dom.buttons.growButton.disabled = true;
        state.dom.buttons.resetGrow.disabled = true;
        state.dom.buttons.download.disabled = true;

        const potentialJoinPoints = JSPA.calculateJoinPoints(state.strokeState.strokes, state.strokeState.strokeStarts);
        state.editModeState.potentialJoinPoints = potentialJoinPoints;
        AGECOUNTER.hideAgeCounter();
    }
    else{
        state.setEditMode(false);
        state.dom.pureCanvas.classList.remove("not-allowed-cursor");
        state.dom.buttons.editMode.value = "Edit Mode"; 

        state.dom.canvas.activate();

        CANVASDRAWING.drawStructs(state.dom.canvas.trace, state.strokeState.structs, state.dom.pureCanvas, state.dom.backgroundCanvas);
        
        state.dom.buttons.resetButton.disabled = false;
        state.dom.buttons.growButton.disabled = false;
        state.dom.buttons.resetGrow.disabled = false;
        state.dom.buttons.download.disabled = false;
        AGECOUNTER.reviveAgeCounter();
    }
    state.updateStyleModeButtons();
}

export function handleMouseMove(event, state) {
    if(state.editModeState.startPointMode){
        mouseMoveStartPoint(event, state);
    }
    else if(state.editModeState.joinPointMode){
        mouseMoveJoinPoint(event, state);
    }
}

// Berechnet den nächsten StartPoint unter der Maus
function getStartPointAtPosition(position, state){
    if(state.strokeState.strokes.length > 0){
        for(let i = 0; i < state.strokeState.strokes.length; i++){
            let stroke = state.strokeState.strokes[i];
            for(let j = 0; j < stroke.length; j++){
                let point = stroke[j];
                if(UTILS.calcDistance(point, position) < 6){
                    return {strokeIndex: i, pointIndex: j};
                }
            }
        }
    }
    return null;
}

// Berechnet den nächsten JoinPoint unter der Maus
function getJoinPointAtPosition(position, state){
    for(let joinPoint of state.editModeState.potentialJoinPoints){
        if(UTILS.calcDistance(joinPoint.intersection, position) < 10){
            return joinPoint;
        }
    }
    return null;
}

function mouseMoveStartPoint(event, state){
    if(state.editModeState.startPointMode && state.dom.pureCanvas.matches(':hover')){
        const clickedPoint = getStartPointAtPosition([event.offsetX, event.offsetY], state);
        state.editModeState.thisStartPoint = clickedPoint;
        state.dom.pureCanvas.classList.toggle("not-allowed-cursor", !clickedPoint);
    }
}

function mouseMoveJoinPoint(event, state){
    if(state.editModeState.joinPointMode && state.dom.pureCanvas.matches(':hover')){
        const clickedJoinPoint = getJoinPointAtPosition([event.offsetX, event.offsetY], state);
        state.editModeState.thisJoinPoint = clickedJoinPoint;
        state.dom.pureCanvas.classList.toggle("not-allowed-cursor", !clickedJoinPoint);
    }
}

export function handleMouseDown(event, state) {
    if(state.editModeState.startPointMode){
        mouseDownStartPoint(event, state);
    }
    else if(state.editModeState.joinPointMode){
        mouseDownJoinPoint(event, state);
    }
}

function mouseDownStartPoint(event, state){
    if(state.editModeState.startPointMode){
        const clickedPoint = getStartPointAtPosition([event.offsetX, event.offsetY], state);
        
        if(clickedPoint){
            JSPA.addStartPoint(state.strokeState.joinPoints, state.strokeState.strokeStarts, state.strokeState.strokeStartsCache, clickedPoint.pointIndex, clickedPoint.strokeIndex);
            CANVASDRAWING.drawEditMode(state.dom.canvasContext, state.strokeState.strokes, state.strokeState.strokeStarts, state.strokeState.joinPoints, state.dom.canvas.trace);
        }
    }
}

function mouseDownJoinPoint(event, state){
    if(state.editModeState.joinPointMode){
        const clickedJoinPoint = getJoinPointAtPosition([event.offsetX, event.offsetY], state);
        
        if(clickedJoinPoint){
            let index = JSPA.findUsedJoinPointIndex(state.strokeState.joinPoints, clickedJoinPoint);
            if(index === -1){
                JSPA.addJoinPoint(state.strokeState.joinPoints, state.strokeState.strokeStarts, state.strokeState.strokeStartsCache, clickedJoinPoint);
            }
            else{
                JSPA.removeJoinPoint(state.strokeState.joinPoints, state.strokeState.strokes, state.strokeState.strokeStarts, state.strokeState.strokeStartsCache, clickedJoinPoint);
                state.checkStrokeStarts();
            }
            CANVASDRAWING.drawEditMode(state.dom.canvasContext, state.strokeState.strokes, state.strokeState.strokeStarts, state.strokeState.joinPoints, state.dom.canvas.trace);
        }
    }
}
