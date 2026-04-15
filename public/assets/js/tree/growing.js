import * as CD from "../canvas/canvasDrawing.js";
import * as AGECOUNTER from "../ui/ageCounter.js";
import * as DRAWING from "../canvas/canvasDrawing.js";
import {DEBUGMODE} from "../config/appConfig.js";
import { PRIMARYCOLOR, SECONDARYCOLOR } from "../config/appConfig.js";

export async function abordGrowing(state){
    if(state.growState.isGrowing){
        state.growState.abordGrow = true;
        await waitUntil(() => !state.growState.play && !state.growState.abordGrow && !state.growState.isGrowing);
    }
    console.assert(!state.growState.abordGrow);
}

export async function growStructs(state){
    if(state.strokeState.structs.length != 0){
        state.dom.buttons.stopGrow.disabled = false;
        state.dom.canvas.deactivate();
        let oneStillGrowing = true;
        state.growState.isGrowing = true;
        state.setPlay(true);
        
        while(oneStillGrowing && !state.growState.abordGrow){
            oneStillGrowing = false;
            const structs = state.strokeState.structs;

            CD.redrawStrokes(state.dom.canvas.trace, state.dom.canvasContext);
            CD.clearCanvas(state.dom.backgroundCanvas.getContext("2d"), SECONDARYCOLOR);

            
            // Calculate forcefields for all nodes
            const forceFields = [];
            for(let node of structs){
                forceFields.push(node.calculateForcePoints());
            }

            if(DEBUGMODE == true){DRAWING.drawDebugInfo(state.dom.canvasContext, structs, state.treeConfig.crowdingMinDist, forceFields);}
            
            for(let i = 0; i < structs.length; i++){
                const otherForceFields = [];
                for(let j = 0; j < structs.length; j++){
                    if(i !== j){
                        otherForceFields.push(forceFields[j]);
                    }               
                }
                oneStillGrowing = structs[i].grow(otherForceFields) || oneStillGrowing;
                structs[i].draw(state.dom.pureCanvas, state.dom.backgroundCanvas);
            }

            AGECOUNTER.updateAgeCounter(structs[0].age, state.treeConfig.maxAge);

            await nextFrame(state);
        }

        state.growState.abordGrow = false;
        state.setPlay(false);
        state.growState.isGrowing = false;
        state.dom.buttons.stopGrow.disabled = true;
        state.dom.canvas.activate();
    }
}

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