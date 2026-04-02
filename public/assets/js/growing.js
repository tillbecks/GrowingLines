import * as CD from "./canvasDrawing.js";
import * as AGECOUNTER from "./ageCounter.js";

export async function abordGrowing(state){
    if(state.growState.isGrowing){
        state.growState.abordGrow = true;
        await waitUntil(() => !state.growState.play && !state.growState.abordGrow && !state.growState.isGrowing);
    }
    console.assert(!state.growState.abordGrow);
}

export async function growStructs(state, debug){
    state.dom.buttons.stopGrow.disabled = false;
    state.dom.canvas.deactivate();
    let oneStillGrowing = true;
    state.growState.play = true;
    state.growState.isGrowing = true;
    
    while(oneStillGrowing && !state.growState.abordGrow){
        oneStillGrowing = false;
        const structs = state.strokeState.structs;

        CD.redrawStrokes(state.dom.canvas.trace, state.dom.canvasContext);

        
        // Calculate forcefields for all nodes
        const forceFields = [];
        for(let node of structs){
            forceFields.push(node.calculateForcePoints());
        }

        if(debug == true){
            for(let points of forceFields){
                for(let point of points){
                    //Mal einen Kreis in Rot der Durchlässig ist und mit dem Radius von TREE_CONFIG.crowdingMinDist um die Kraftpunkte
                    state.dom.canvasContext.beginPath();
                    state.dom.canvasContext.arc(point[0], point[1], state.treeConfig.crowdingMinDist, 0, 2 * Math.PI);
                    state.dom.canvasContext.fillStyle = "rgba(255, 0, 0, 0.5)";
                    state.dom.canvasContext.fill();
                }
            }

            for(let node of structs){
                state.dom.canvasContext.beginPath();
                state.dom.canvasContext.arc(node.centerOfMass[0], node.centerOfMass[1], 15, 0, 2 * Math.PI);
                state.dom.canvasContext.fillStyle = "rgba(0, 255, 0, 0.5)";
                state.dom.canvasContext.fill();
            }
        }
        
        for(let i = 0; i < structs.length; i++){
            const otherForceFields = [];
            for(let j = 0; j < structs.length; j++){
                if(i !== j){
                    otherForceFields.push(forceFields[j]);
                }               
            }
            oneStillGrowing = structs[i].grow(otherForceFields) || oneStillGrowing;
            structs[i].draw(state.dom.canvasContext);
        }

        AGECOUNTER.updateAgeCounter(structs[0].age, state.treeConfig.maxAge);

        await nextFrame(state);
    }



    state.growState.abordGrow = false;
    state.growState.play = false;
    state.growState.isGrowing = false;
    state.dom.buttons.stopGrow.disabled = true;
    state.dom.canvas.activate();

    state.dom.canvasContext.strokeStyle="black";
    
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