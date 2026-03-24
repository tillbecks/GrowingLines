import * as TREE from "./tree.js";
import * as UTILS from "./utils.js";

var strokes = [];
var strokeStarts = [];
var strokeStartsCache = [];
var structs = [];

var abordGrow = false;
var play = false;
//thisStartPoint is a struct of {strokeIndex: , pointIndex: }
var editMode = false;
var startPointMode = false;
var joinPointMode = false;

var potentialJoinPoints = [];
var joinPoints = [];

var thisJoinPoint = null;
var thisStartPoint = null;

var debug = false;

let actionQueue = Promise.resolve();

function enqueueAction(action){
    actionQueue = actionQueue.then(action);
}

const canvas = new handwriting.Canvas(document.getElementById('canvas'));
const pureCanvas = document.getElementById('canvas');
const canvasContext =  pureCanvas.getContext("2d");

const resetButton = document.getElementById('resetButton');
resetButton.addEventListener("click", ()=>{enqueueAction(totalReset);});
const growButton = document.getElementById('growButton');
growButton.addEventListener("click", ()=>{enqueueAction(grow);});
const resetGrowButton = document.getElementById('resetGrow');
resetGrowButton.addEventListener("click", ()=>{enqueueAction(growReset);});
const stopGrowButton = document.getElementById('stopGrow');
stopGrowButton.addEventListener("click", ()=>{setPlay();});
const editModeButton = document.getElementById('editModeButton');
editModeButton.addEventListener("click", setEditMode);
const startPointButton = document.getElementById('startPointButton');
startPointButton.addEventListener("click", setStartPointModus);
const joinPointButton = document.getElementById('joinPointButton');
joinPointButton.addEventListener("click", setJoinPointModus);
const downloadButton = document.getElementById('downloadButton');
downloadButton.addEventListener("click", downloadCanvasAsImage);

document.onmousemove = handleMouseMove;
document.onmousedown = handleMouseDown;

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

async function totalReset(){
    await abordGrowing();
    structs = [];
    canvas.erase();
    strokes = [];
    strokeStarts = [];
    strokeStartsCache = [];
    joinPoints = [];
}

async function growReset(){
    await abordGrowing();
    redrawStrokes(canvas.trace, canvasContext);
    structs = [];
}

async function abordGrowing(){
    if(getPlay()){
        setAbordGrow(true);
        await waitUntil(() => !getPlay());
    }
}

async function grow(){
    await abordGrowing();

    if(canvas.hasChanged){
        strokes = strokeTransformation(canvas.getTrace());
        checkStrokeStarts();
    }

    structs = createStructRootsFromStrokes(strokes, strokeStarts, joinPoints);
     
    growStructs(()=>structs, canvasContext, getAbordGrow, setAbordGrow, getPlay, setPlay);
}

function checkStrokeStarts(){
    if(strokeStarts.length > strokes.length){
        strokeStarts = strokeStarts.slice(0, strokes.length);
    }
    for(let i=0; i<strokes.length; i++){
        if(!hasStartPoint(i)){
            if(strokeStartsCache[i] && strokeStartsCache[i] < strokes[i].length){
                strokeStarts[i] = strokeStartsCache[i];
            }
            else{
                strokeStarts[i] = Math.floor(strokes[i].length/2);
                strokeStartsCache[i] = strokeStarts[i];
            }
        }
    }
}

function getAbordGrow(){
    return abordGrow;
}

function setAbordGrow(abordGrowValue){
    abordGrow = abordGrowValue;
}

function setPlay(value=!play){
    
    play = value;
    stopGrowButton.value = !play ? "▶" : "⏸";
}

function getPlay(){
    return play;
}

function setEditMode(){
    if(!editMode){
        editMode = true;
        canvas.deactivate();
        if(canvas.hasChanged){
            strokes = strokeTransformation(canvas.getTrace());
            checkStrokeStarts();
        }
        startPointButton.style.visibility = "visible";
        joinPointButton.style.visibility = "visible";
        pureCanvas.style.cursor = "not-allowed";
        editModeButton.value = "Exit Edit Mode"; 

        drawEditMode(canvasContext, strokes, strokeStarts);
        resetButton.disabled = true;
        growButton.disabled = true;
        resetGrowButton.disabled = true;

        calculateJoinPoints();
    }
    else{
        editMode = false;
        startPointMode = false;
        joinPointMode = false;
        canvas.activate();

        startPointButton.style.visibility = "hidden";
        joinPointButton.style.visibility = "hidden";
        pureCanvas.style.cursor = "crosshair";
        editModeButton.value = "Edit Mode"; 

        drawStructs(canvas.trace, structs, canvasContext);
        resetButton.disabled = false;
        growButton.disabled = false;
        resetGrowButton.disabled = false;
    }
    updateStyleModeButtons();
}

function setStartPointModus(){
    if(!startPointMode){
        if(joinPointMode){
            joinPointMode = false;
        }
        startPointMode = true;
    }
    else{
        startPointMode = false;
    }

    updateStyleModeButtons();
}



function setJoinPointModus(){
    if(!joinPointMode){
        if(startPointMode){
            startPointMode = false;
        }
        joinPointMode = true;
    }
    else{
        joinPointMode = false;
    }
    
    updateStyleModeButtons();
}

function updateStyleModeButtons(){
    if(joinPointMode){
        joinPointButton.style.color = "white";
        joinPointButton.style.backgroundColor = "blue";
    }else{
        joinPointButton.style.color = "blue";
        joinPointButton.style.backgroundColor = "white";
    }

    if(startPointMode){
        startPointButton.style.color = "white";
        startPointButton.style.backgroundColor = "red";
    }else{
        startPointButton.style.color = "red";
        startPointButton.style.backgroundColor = "white";
    }
}

function calculateJoinPoints(){
    potentialJoinPoints = [];

    for(let i = 0; i < strokes.length; i++){
        for(let j = i+1; j < strokes.length; j++){
            let strokeA = strokes[i];
            let strokeB = strokes[j];
            for(let k = 0; k < strokeA.length -1; k++){
                for(let l = 0; l < strokeB.length -1; l++){
                    if(UTILS.calcDistance(strokeA[k], strokeB[l]) < 1){ 
                        potentialJoinPoints.push({strokeA: i, pointAIndex: k, strokeB: j, pointBIndex: l, intersection: strokeA[k]});
                    }
                    else{
                        let intersec = UTILS.linesIntersection(strokeA[k], strokeA[k+1], strokeB[l], strokeB[l+1]);
                        if(intersec){
                            strokeA.splice(k+1, 0, intersec);
                            strokeB.splice(l+1, 0, intersec);
                            potentialJoinPoints.push({strokeA: i, pointAIndex: k+1, strokeB: j, pointBIndex: l+1, intersection: intersec});
                            k++;
                            l++;
                            if(strokeStarts[i] > k) strokeStarts[i]++;
                            if(strokeStarts[j] > l) strokeStarts[j]++;
                        }
                    }
                }
            }
        }
    }
}

function handleMouseMove(event) {
    if(editMode){
        if(startPointMode){
            mouseMoveStartPoint(event);
        }
        else if(joinPointMode){
            mouseMoveJoinPoint(event);
        }
    }
}

function mouseMoveStartPoint(event){
    if(startPointMode && pureCanvas.matches(':hover')){
        let newStartPoint = null;
        let onStruct = false;
        if(strokes.length > 0){
            for(let i = 0; i < strokes.length; i++){
                let stroke = strokes[i];
                for(let j = 0; j < stroke.length; j++){
                    let point = stroke[j];
                    if(UTILS.calcDistance(point, [event.offsetX, event.offsetY]) < 4){
                        onStruct = true;
                        newStartPoint = {strokeIndex: i, pointIndex: j};
                        break;
                    }
                }
            }
        }
        pureCanvas.style.cursor = onStruct ? "crosshair" : "not-allowed";
        thisStartPoint = newStartPoint;
    }
}

function mouseMoveJoinPoint(event){
    if(joinPointMode && pureCanvas.matches(':hover')){
        let newJoinPoint = null;
        let onJoinPoint = false;
        for(let joinPoint of potentialJoinPoints){

            if(UTILS.calcDistance(joinPoint.intersection, [event.offsetX, event.offsetY]) < 10 ){
                onJoinPoint = true;
                newJoinPoint = joinPoint;
                break;
            }
        }
        pureCanvas.style.cursor = onJoinPoint ? "crosshair" : "not-allowed";
        thisJoinPoint = newJoinPoint;
    }
}

function handleMouseDown(event) {
    if(editMode){
        if(startPointMode){
            mouseDownStartPoint(event);
        }
        else if(joinPointMode){
            mouseDownJoinPoint(event);
        }
    }
}

function mouseDownStartPoint(event){
    if(startPointMode && thisStartPoint){
        addStartPoint(thisStartPoint.pointIndex, thisStartPoint.strokeIndex);
        drawEditMode(canvasContext, strokes, strokeStarts);
    }
}

function mouseDownJoinPoint(event){
    if(joinPointMode && thisJoinPoint){
        let index = findUsedJoinPointIndex(thisJoinPoint);
        if(index === -1){
            addJoinPoint(thisJoinPoint);
        }
        else{
            removeJoinPoint(thisJoinPoint);
        }
        drawEditMode(canvasContext, strokes, strokeStarts);
    }
}

function findUsedJoinPointIndex(joinPoint){
    for(let i = 0; i < joinPoints.length; i++){
        if(UTILS.calcDistance(joinPoints[i].intersection, joinPoint.intersection) < 1){
            return i;
        }
    }
    return -1;
}

function detectJoinPointCycle(newJoinPoint){
    if (crawlApply(newJoinPoint.strokeA, [], (indice, beforeIndice) => {
        if(indice === newJoinPoint.strokeB){
            return true;
        }
    })) return true;
    if (crawlApply(newJoinPoint.strokeB, [], (indice, beforeIndice) => {
        if(indice === newJoinPoint.strokeA){
            return true;
        }
    })) return true;
    return false;
}

function removeJoinPoint(joinPoint){
    let index = findUsedJoinPointIndex(joinPoint);
    if(index !== -1){
        joinPoints.splice(index, 1);

        //Sollte funktionieren, da er alle Strokes durchgeht und fehlende Startpunkte ergänzt
        checkStrokeStarts();
    }
}

function addJoinPoint(joinPoint){
    if(detectJoinPointCycle(joinPoint)){
        alert("Joining these points would create a cycle. Operation cancelled.");
    }
    else{
        if(strokeStarts[joinPoint.strokeA] != null ){
            strokeStartsCache[joinPoint.strokeA] = strokeStarts[joinPoint.strokeA];
            strokeStarts[joinPoint.strokeA] = null;
        }
        else{
            crawlApply(joinPoint.strokeA, [], (indice, beforeIndice) => {
                if(strokeStarts[indice] != null){
                    strokeStartsCache[indice] = strokeStarts[indice];
                    strokeStarts[indice] = null;
                    return true;
                }
                else{
                    return false;
                }
            })
        }
        joinPoints.push(joinPoint);
    }
}

function hasStartPoint(strokeIndex){
    if (strokeStarts[strokeIndex] != null) return true;
    if (crawlApply(strokeIndex, [strokeIndex], (indice, beforeIndice) => {
        if(strokeStarts[indice] != null){
            return true;
        }
    })) return true;
    return false;
}

function addStartPoint(startPointIndex, strokeIndex){
    strokeStarts[strokeIndex] = startPointIndex;
    crawlApply(strokeIndex, [strokeIndex], (indice, beforeIndice) => {
        if(strokeStarts[indice] != null){
            strokeStartsCache[indice] = strokeStarts[indice];
            strokeStarts[indice] = null;
        }
        return false;
    });
}

function crawlApply(thisIndice, visitedIndices, apply){
    for(let joinPoint of joinPoints){
        if(joinPoint.strokeA === thisIndice && !visitedIndices.includes(joinPoint.strokeB)){
            visitedIndices.push(joinPoint.strokeB);
            if(apply(joinPoint.strokeB, thisIndice)) return true;
            if(crawlApply(joinPoint.strokeB, visitedIndices, apply)) return true;
        }
        else if(joinPoint.strokeB === thisIndice && !visitedIndices.includes(joinPoint.strokeA)){
            visitedIndices.push(joinPoint.strokeA);
            if(apply(joinPoint.strokeA, thisIndice)) return true;
            if(crawlApply(joinPoint.strokeA, visitedIndices, apply)) return true;
        }
    }
    return false;
}


function createStructRootsFromStrokes(strokes, strokeStarts, joinPoints){
    let strokeStructs = [];

    for(let i=0; i<strokes.length;i++){
        if(strokeStarts[i] != null){
            let newStruct = createStructsFromStrokes(strokes, i, strokeStarts[i], joinPoints);
            let com = newStruct.calculateCOM();
            newStruct.distributeVariable("centerOfMass", [com[1]/com[0], com[2]/com[0]]);
            strokeStructs.push(newStruct);
        }
    }

    return strokeStructs;
}

function createStructsFromStrokes(strokes, strokeIndex, startPointPosition, joinPoints, direction = 0){ //Direction: 0 = both, 1 = left/down 2 = right/up
        let com = 0;
        let start = startPointPosition;
        let stroke = strokes[strokeIndex];
        let strokeRoot = new TREE.Node(stroke[start], null, [], []);

        //All joins, that contain this stroke
        let joinedPoints = joinPoints.filter(joinPoint => joinPoint.strokeA === strokeIndex || joinPoint.strokeB === strokeIndex);
        //Indices of joins in this stroke
        let joinedIndices = joinedPoints.map(jp => jp.strokeA === strokeIndex ? jp.pointAIndex : jp.pointBIndex);

        //Filtering out all used joins for further recursion
        joinPoints = joinPoints.filter(jp => joinedPoints.indexOf(jp) === -1);

        //Creating a struct that contain the relevant Information
        joinedPoints = joinedPoints.map(jp => {
            if(jp.strokeA === strokeIndex){
                return{ownPointIndex: jp.pointAIndex, otherStrokeIndex: jp.strokeB, otherPointIndex: jp.pointBIndex};
            }
            else{
                return{ownPointIndex: jp.pointBIndex, otherStrokeIndex: jp.strokeA, otherPointIndex: jp.pointAIndex};
            }
        });


        let lastNode = strokeRoot;
        let thisNode;
    
        if(direction !== 2){
            for(let i=start; i>=0;i--){
                if(i!== start){
                    thisNode = new TREE.Node(stroke[i], lastNode, [], [], com);
                    lastNode.descendants.push(thisNode);
                    lastNode = thisNode;
                }
                let joinPointIndex = joinedIndices.indexOf(i);
                if(joinPointIndex !== -1){
                    let descendantA = createStructsFromStrokes(strokes, joinedPoints[joinPointIndex].otherStrokeIndex, joinedPoints[joinPointIndex].otherPointIndex-1, joinPoints, 1);
                    let descendantB = createStructsFromStrokes(strokes, joinedPoints[joinPointIndex].otherStrokeIndex, joinedPoints[joinPointIndex].otherPointIndex+1, joinPoints, 2);
                    lastNode.descendants.push(descendantA);
                    lastNode.descendants.push(descendantB);
                }
            }
        }
        if (direction !== 1){
            lastNode = strokeRoot;
            for(let i=start; i<stroke.length; i++){
                if(i!== start){
                    thisNode = new TREE.Node(stroke[i], lastNode, [], [], com);
                    lastNode.descendants.push(thisNode);
                    lastNode = thisNode;
                }
                let joinPointIndex = joinedIndices.indexOf(i);
                if(joinPointIndex !== -1){
                    let descendantA = createStructsFromStrokes(strokes, joinedPoints[joinPointIndex].otherStrokeIndex, joinedPoints[joinPointIndex].otherPointIndex-1, joinPoints, 1);
                    let descendantB = createStructsFromStrokes(strokes, joinedPoints[joinPointIndex].otherStrokeIndex, joinedPoints[joinPointIndex].otherPointIndex+1, joinPoints, 2);
                    lastNode.descendants.push(descendantA);
                    lastNode.descendants.push(descendantB);
                }
            }
        }

        return strokeRoot;
}



function strokeTransformation(strokes){
    strokes = strokes.map(stroke => UTILS.transformStrokeToTuples(stroke));
    return strokes.map(stroke => UTILS.fillInDistantStrokePoints(stroke, TREE.TREE_CONFIG.sproutingLength)); 
}

async function growStructs(getStructs, context, abordGrow, setAbordGrow, getPlay, setPlay){
    stopGrowButton.disabled = false;
    let oneStillGrowing = true;
    setPlay(true);
    
    while(oneStillGrowing && !abordGrow()){
        oneStillGrowing = false;
        const structs = getStructs();

        redrawStrokes(canvas.trace, context);
        
        // Calculate forcefields for all nodes
        const forceFields = [];
        for(let node of structs){
            forceFields.push(node.calculateForcePoints());
        }

        if(debug == true){
            for(let points of forceFields){
                for(let point of points){
                    //Mal einen Kreis in Rot der Durchlässig ist und mit dem Radius von TREE_CONFIG.crowdingMinDist um die Kraftpunkte
                    context.beginPath();
                    context.arc(point[0], point[1], TREE.TREE_CONFIG.crowdingMinDist, 0, 2 * Math.PI);
                    context.fillStyle = "rgba(255, 0, 0, 0.5)";
                    context.fill();
                }
            }

            for(let node of structs){
                context.beginPath();
                context.arc(node.centerOfMass[0], node.centerOfMass[1], 15, 0, 2 * Math.PI);
                context.fillStyle = "rgba(0, 255, 0, 0.5)";
                context.fill();
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
            structs[i].draw(context);
        }

        await nextFrame(getPlay, abordGrow);
    }

    setAbordGrow(false);
    setPlay(false);

    stopGrowButton.disabled = true;

    canvasContext.strokeStyle="black";
    
}

function drawStructs(strokes, structs, context){
    redrawStrokes(strokes, context);
    for(let node of structs){
        node.draw(context);
    }
}

function drawEditMode(context, strokes, strokeStarts){
    redrawStrokes(canvas.trace, context);
    for(let i = 0; i < strokeStarts.length; i++){
        const strokeStart = strokeStarts[i];
        if(strokeStart){
            context.beginPath();
            context.arc(strokes[i][strokeStart][0], strokes[i][strokeStart][1], 5, 0, 2 * Math.PI);
            context.fillStyle = "rgba(255, 0, 0, 0.5)";
            context.fill();
        }
    }
    for(let joinPoint of joinPoints){
        context.beginPath();
        context.arc(joinPoint.intersection[0], joinPoint.intersection[1], 5, 0, 2 * Math.PI);
        context.fillStyle = "rgba(0, 0, 255, 0.5)";
        context.fill();
    }
}

function nextFrame(getPlay, getAbordGrow){
    return new Promise(resolve => {
        function frame(){
            if(!getPlay() && !getAbordGrow()){
                requestAnimationFrame(frame);
            }
            else{
                resolve();
            }
        }
        requestAnimationFrame(frame);
    });
}


function redrawStrokes(strokes, context){

    context.strokeStyle="#8E977D";
    context.lineWidth = 2;

    context.clearRect(0, 0, canvas.width, canvas.height);
    for(let stroke of strokes){
        context.beginPath();
        context.moveTo(stroke[0][0], stroke[1][0]);
        for(let i=1; i<stroke[0].length; i++){
            context.lineTo(stroke[0][i], stroke[1][i]);
        }
        context.stroke();
    }
}

function downloadCanvasAsImage(){
    const link = document.createElement('a');
    link.href = pureCanvas.toDataURL('image/png');
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    link.download = `canvas_${timestamp}.png`;
    link.click();
}