import * as CD from "../canvas/canvasDrawing.js";
import * as AGECOUNTER from "../ui/ageCounter.js";
import * as DRAWING from "../canvas/canvasDrawing.js";
import dom from "../state/domState.js";
import {DEBUGMODE} from "../config/appConfig.js";

/**
 * Aborts the growing process for the given state. Sets the abort flag and waits until the growing process has fully stopped before resolving.
 * @param {*} state - The application state.
 */
export async function abordGrowing(state){
    if(state.growState.isGrowing){
        state.growState.abordGrow = true;
        await waitUntil(() => !state.growState.play && !state.growState.abordGrow && !state.growState.isGrowing);
    }
}

/**
 * Grows the structures in the given state.
 * @param {*} state - The application state.
 */
export async function growStructs(state){
    if(state.strokeState.structs.length != 0){
        //Here three variables of the state are manipulated to control the growing process. 
        // The isGrowing variable indicates whether the growing process is currently running. It is necessary to ensure that the growing process has fully stopped.
        // The abordGrow variable is a flag that can be set to request an abortion of the growing process.
        // The play variable is used to pause and resume the growing process.

        //Prepare variables and UI elements for main growing loop
        dom.buttons.stopGrow.disabled = false;
        dom.canvas.deactivate();
        let oneStillGrowing = true;
        state.growState.isGrowing = true;
        state.setPlay(true);
        
        //Main growing loop, runs until all nodes have reached their maximum age or the process is aborted
        while(oneStillGrowing && !state.growState.abordGrow){
            oneStillGrowing = false;
            const structs = state.strokeState.structs;

            CD.redrawStrokes(dom.canvas.trace, dom.canvasContext);
            dom.resetBackgroundCanvas();
            
            // Calculate forcefields for all structs
            const forceFields = [];
            for(let node of structs){
                forceFields.push(node.calculateForcePoints());
            }

            // If in debug mode, draw the force fields and COMs for all structs
            if(DEBUGMODE == true){DRAWING.drawDebugInfo(dom.canvasContext, structs, state.treeConfig.crowdingMinDist, forceFields);}
            
            // Grow and draw all structs, passing the force fields of the other structs to each struct to allow them to react to each other
            for(let i = 0; i < structs.length; i++){
                const otherForceFields = [];
                for(let j = 0; j < structs.length; j++){
                    if(i !== j){
                        otherForceFields.push(forceFields[j]);
                    }               
                }
                oneStillGrowing = structs[i].grow(otherForceFields) || oneStillGrowing;
                structs[i].draw(dom.pureCanvas, dom.backgroundCanvas);
            }

            //Update age counter display
            AGECOUNTER.updateAgeCounter(structs[0].age, state.treeConfig.maxAge);

            await nextFrame(state);
        }

        //Reset grow state and UI elements after growing process has finished or been aborted
        state.growState.abordGrow = false;
        state.setPlay(false);
        state.growState.isGrowing = false;
        dom.buttons.stopGrow.disabled = true;
        dom.canvas.activate();
    }
}

/**
 * If the growing process is paused and the growing process isn't aborted, waits until it is resumed before resolving. 
 * @param {*} state 
 * @returns 
 */
function nextFrame(state){
    return new Promise(resolve => {
        function frame(){
            if(!state.growState.play && !state.growState.abordGrow){
                requestAnimationFrame(frame);
            }
            else{
                resolve();
            }
        }
        requestAnimationFrame(frame);
    });
}

/**
 * Waits until the given condition is true.
 * @param {*} condition 
 * @param {*} interval 
 * @returns 
 */
function waitUntil(condition, interval = 16){
    return new Promise(resolve => {
        function check(){
            if(condition()){
                resolve();
            }
            else{
                setTimeout(check, interval);
            }
        }
        check();
    });
}