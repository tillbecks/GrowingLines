import * as JSPA from "../tree/joinStartPointActions.js";
import * as CANVASDRAWING from "./canvasDrawing.js";
import * as UTILS from "../config/utils.js";
import * as GROWING from "../tree/growing.js";
import { MINIMUMDISTANCEMOUSETOPOINT } from "../config/appConfig.js";

/**
 * Handles the enabling and disabling of edit mode, as well as the visualization and interaction of start and join point placement
 * @param {Object} state 
 * @returns {void}
 */
export async function setEditMode(state){
    //Activation of edit mode
    if(!state.editModeState.editMode){
        await GROWING.abordGrowing(state);
        
        //Update associated states and UI elements 
        state.setEditMode(true);

        //Check if existing start points and join points are still valid after potential setting changes (e.g. branch length) and clean up if necessary
        state.cleanUpStartAndJoinPoints();
        state.checkStrokeStart();    

        //Draw edit mode visualization
        CANVASDRAWING.drawEditMode(state.dom.canvasContext, state.strokeState.strokes, state.strokeState.strokeStarts, state.strokeState.joinPoints, state.dom.canvas.trace);

    }
    else{
        //Update associated state and UI elements
        state.setEditMode(false);

        //Redraw canvas with current strokes and structs
        CANVASDRAWING.drawStructs(state.dom.canvas.trace, state.strokeState.structs, state.dom.pureCanvas, state.dom.backgroundCanvas);
    }
}

/**
 * Handles mouse move events in edit mode
 * @param {Object} event 
 * @param {Object} state 
 */
export function handleMouseMove(event, state) {
    if(state.editModeState.startPointMode){
        mouseMoveStartPoint(event, state);
    }
    else if(state.editModeState.joinPointMode){
        mouseMoveJoinPoint(event, state);
    }
}

/**
 * Calculates the nearest start point to the mouse position
 * @param {Array} position 
 * @param {Object} state 
 * @returns 
 */
function getStartPointAtPosition(position, state){
    if(state.strokeState.strokes.length > 0){
        for(let i = 0; i < state.strokeState.strokes.length; i++){
            let stroke = state.strokeState.strokes[i];
            for(let j = 0; j < stroke.length; j++){
                let point = stroke[j];
                if(UTILS.calcDistance(point, position) < MINIMUMDISTANCEMOUSETOPOINT){
                    return {strokeIndex: i, pointIndex: j};
                }
            }
        }
    }
    return null;
}

/**
 * Calculates the nearest join point to the mouse position
 * @param {Array} position 
 * @param {Object} state 
 * @returns 
 */
function getJoinPointAtPosition(position, state){
    for(let joinPoint of state.editModeState.potentialJoinPoints){
        if(UTILS.calcDistance(joinPoint.intersection, position) < MINIMUMDISTANCEMOUSETOPOINT){
            return joinPoint;
        }
    }
    return null;
}

/**
 * Handles mouse move events for start point mode, updating the cursor style if the mouse is hovering over a valid start point
 * @param {*} event 
 * @param {*} state 
 */
function mouseMoveStartPoint(event, state){
    if(state.editModeState.startPointMode && state.dom.pureCanvas.matches(':hover')){
        const clickedPoint = getStartPointAtPosition([event.offsetX, event.offsetY], state);
        state.editModeState.thisStartPoint = clickedPoint;
        state.dom.pureCanvas.classList.toggle("not-allowed-cursor", !clickedPoint);
    }
}

/**
 * Handles mouse move events for join point mode, updating the cursor style if the mouse is hovering over a valid join point
 * @param {*} event 
 * @param {*} state 
 */
function mouseMoveJoinPoint(event, state){
    if(state.editModeState.joinPointMode && state.dom.pureCanvas.matches(':hover')){
        const clickedJoinPoint = getJoinPointAtPosition([event.offsetX, event.offsetY], state);
        state.editModeState.thisJoinPoint = clickedJoinPoint;
        state.dom.pureCanvas.classList.toggle("not-allowed-cursor", !clickedJoinPoint);
    }
}

/**
 * Handles mouse down events in edit mode
 * @param {Object} event 
 * @param {Object} state 
 */
export function handleMouseDown(event, state) {
    if(state.editModeState.startPointMode){
        mouseDownStartPoint(event, state);
    }
    else if(state.editModeState.joinPointMode){
        mouseDownJoinPoint(event, state);
    }
}

/**
 * Handles mouse down events for start point mode by adding start points to the clicked stroke, updating the stroke starts and redrawing the edit mode visualization
 * @param {Object} event 
 * @param {Object} state 
 */
function mouseDownStartPoint(event, state){
    if(state.editModeState.startPointMode){
        //Checks if a valid start point was clicked and returns it
        const clickedPoint = getStartPointAtPosition([event.offsetX, event.offsetY], state);
        
        if(clickedPoint){
            //Add start point to the clicked stroke and redraw edit mode visualization
            JSPA.addStartPoint(state.strokeState.joinPoints, state.strokeState.strokeStarts, state.strokeState.strokeStartsCache, clickedPoint.pointIndex, clickedPoint.strokeIndex);
            CANVASDRAWING.drawEditMode(state.dom.canvasContext, state.strokeState.strokes, state.strokeState.strokeStarts, state.strokeState.joinPoints, state.dom.canvas.trace);
        }
    }
}

/**
 * Handles mouse down events for join point mode by adding or removing join points and redrawing the edit mode visualization
 * @param {Object} event 
 * @param {Object} state 
 */
function mouseDownJoinPoint(event, state){
    if(state.editModeState.joinPointMode){
        //Checks if a valid join point was clicked and returns it
        const clickedJoinPoint = getJoinPointAtPosition([event.offsetX, event.offsetY], state);
        
        if(clickedJoinPoint){
            //Checks whether the clicked join point was already set and adds or removes it accordingly, then redraws the edit mode visualization
            let index = JSPA.findUsedJoinPointIndex(state.strokeState.joinPoints, clickedJoinPoint);
            if(index === -1){
                JSPA.addJoinPoint(state.strokeState.joinPoints, state.strokeState.strokeStarts, state.strokeState.strokeStartsCache, clickedJoinPoint);
            }
            else{
                JSPA.removeJoinPoint(state.strokeState.joinPoints, state.strokeState.strokes, state.strokeState.strokeStarts, state.strokeState.strokeStartsCache, clickedJoinPoint);
                //After removing a join point, some strokes may not have start points as multiple strokes share a start point when joined. Therefore we need to check if all strokes have valid start points
                state.checkStrokeStart();
            }
            CANVASDRAWING.drawEditMode(state.dom.canvasContext, state.strokeState.strokes, state.strokeState.strokeStarts, state.strokeState.joinPoints, state.dom.canvas.trace);
        }
    }
}
