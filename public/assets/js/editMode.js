import * as JSPA from "./joinStartPointActions.js";
import * as canvasDrawing from "./canvasDrawing.js";
import * as UTILS from "./utils.js";

export function setEditMode(state){
    if(!state.editModeState.editMode){
        state.setEditMode(true);
        state.dom.canvas.deactivate();
        if(state.dom.canvas.hasChanged){
            state.strokeState.strokes = UTILS.strokePreprocessing(state.dom.canvas.getTrace(), state.treeConfig.sproutingLength);
            state.checkStrokeStarts();
        }
        state.dom.buttons.startPoint.style.visibility = "visible";
        state.dom.buttons.joinPoint.style.visibility = "visible";
        state.dom.pureCanvas.style.cursor = "not-allowed";
        state.dom.buttons.editMode.value = "Exit Edit Mode"; 

        canvasDrawing.drawEditMode(state.dom.canvasContext, state.strokeState.strokes, state.strokeState.strokeStarts, state.strokeState.joinPoints, state.dom.canvas.trace);
        state.dom.buttons.resetButton.disabled = true;
        state.dom.buttons.growButton.disabled = true;
        state.dom.buttons.resetGrow.disabled = true;

        const potentialJoinPoints = JSPA.calculateJoinPoints(state.strokeState.strokes, state.strokeState.strokeStarts);
        state.editModeState.potentialJoinPoints = potentialJoinPoints;
    }

    else{
        state.setEditMode(false);
        state.dom.buttons.startPoint.style.visibility = "hidden";
        state.dom.buttons.joinPoint.style.visibility = "hidden";
        state.dom.pureCanvas.style.cursor = "crosshair";
        state.dom.buttons.editMode.value = "Edit Mode"; 


        state.dom.canvas.activate();

        canvasDrawing.drawStructs(state.dom.canvas.trace, state.strokeState.structs, state.dom.canvasContext);
        
        state.dom.buttons.resetButton.disabled = false;
        state.dom.buttons.growButton.disabled = false;
        state.dom.buttons.resetGrow.disabled = false;
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

function mouseMoveStartPoint(event, state){
    if(state.editModeState.startPointMode && state.dom.pureCanvas.matches(':hover')){
        let newStartPoint = null;
        let onStruct = false;
        if(state.strokeState.strokes.length > 0){
            for(let i = 0; i < state.strokeState.strokes.length; i++){
                let stroke = state.strokeState.strokes[i];
                for(let j = 0; j < stroke.length; j++){
                    let point = stroke[j];
                    if(UTILS.calcDistance(point, [event.offsetX, event.offsetY]) < 6){
                        onStruct = true;
                        newStartPoint = {strokeIndex: i, pointIndex: j};
                        break;
                    }
                }
            }
        }
        state.dom.pureCanvas.style.cursor = onStruct ? "crosshair" : "not-allowed";
        state.editModeState.thisStartPoint = newStartPoint;
    }
}

function mouseMoveJoinPoint(event, state){
    if(state.editModeState.joinPointMode && state.dom.pureCanvas.matches(':hover')){
        let newJoinPoint = null;
        let onJoinPoint = false;
        for(let joinPoint of state.editModeState.potentialJoinPoints){

            if(UTILS.calcDistance(joinPoint.intersection, [event.offsetX, event.offsetY]) < 10 ){
                onJoinPoint = true;
                newJoinPoint = joinPoint;
                break;
            }
        }
        state.dom.pureCanvas.style.cursor = onJoinPoint ? "crosshair" : "not-allowed";
        state.editModeState.thisJoinPoint = newJoinPoint;
    }
}

export function handleMouseDown(event, state) {
    if(state.editModeState.startPointMode){
        mouseDownStartPoint(state);
    }
    else if(state.editModeState.joinPointMode){
        mouseDownJoinPoint( state);
    }
}

function mouseDownStartPoint(state){
    if(state.editModeState.startPointMode && state.editModeState.thisStartPoint){
        JSPA.addStartPoint(state.strokeState.joinPoints, state.strokeState.strokeStarts, state.strokeState.strokeStartsCache, state.editModeState.thisStartPoint.pointIndex, state.editModeState.thisStartPoint.strokeIndex);
        canvasDrawing.drawEditMode(state.dom.canvasContext, state.strokeState.strokes, state.strokeState.strokeStarts, state.strokeState.joinPoints, state.dom.canvas.trace);
    }
}

function mouseDownJoinPoint(state){
    if(state.editModeState.joinPointMode && state.editModeState.thisJoinPoint){
        let index = JSPA.findUsedJoinPointIndex(state.strokeState.joinPoints, state.editModeState.thisJoinPoint);
        if(index === -1){
            JSPA.addJoinPoint(state.strokeState.joinPoints, state.strokeState.strokeStarts, state.strokeState.strokeStartsCache, state.editModeState.thisJoinPoint);
        }
        else{
            JSPA.removeJoinPoint(state.strokeState.joinPoints, state.strokeState.strokes, state.strokeState.strokeStarts, state.strokeState.strokeStartsCache, state.editModeState.thisJoinPoint);
            state.checkStrokeStarts();
        }
        canvasDrawing.drawEditMode(state.dom.canvasContext, state.strokeState.strokes, state.strokeState.strokeStarts, state.strokeState.joinPoints, state.dom.canvas.trace);
    }
}
