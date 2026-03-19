import * as TREE from "./tree.js";
import * as UTILS from "./utils.js";

var strokes = [];
//Eine StrokeConstruction beinhaltet
//- Ein Array von Strokes
//- Ein Array von JoinPoints
//- Einen Startpunktindex
var strokeConstructions = [];

var strokeConstructionsStarts = [];
var structs = [];

var abordGrow = false;
var play = false;
//thisStartPoint is a struct of {strokeIndex: , pointIndex: }
var editMode = false;
var startPointMode = false;
var joinPointMode = false;

var potentialJoinPoints = [];
var usedJoinPoints = [];

var thisJoinPoint = null;

var setStartPoint = false;
var thisStartPoint = null;

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
    strokeConstructionsStarts = [];
}

async function growReset(){
    await abordGrowing();
    redrawStrokes(canvas.trace, canvasContext);
    structs = [];
}

async function abordGrowing(){ //If 
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

    structs = createStructsFromStrokes(strokes, strokeConstructionsStarts);
     
    setPlay(true);
    growStructs(()=>structs, canvasContext, getAbordGrow, setAbordGrow, getPlay);
}

function checkStrokeStarts(){
    if(strokeConstructionsStarts.length > strokes.length){
        strokeConstructionsStarts = strokeConstructionsStarts.slice(0, strokes.length);
    }
    for(let i=0; i<strokes.length; i++){
        if(i >= strokeConstructionsStarts.length || strokeConstructionsStarts[i] >= strokes[i].length){ 
            strokeConstructionsStarts[i] = Math.floor(strokes[i].length/2);
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
            strokeConstructionsStarts = setStrokeStarts(strokes);
        }
        startPointButton.style.visibility = "visible";
        joinPointButton.style.visibility = "visible";
        pureCanvas.style.cursor = "not-allowed";
        editModeButton.value = "Exit Edit Mode"; 

        drawEditMode(canvasContext, strokes, strokeConstructionsStarts);
        resetButton.disabled = true;
        growButton.disabled = true;
        resetGrowButton.disabled = true;
        stopGrowButton.disabled = true;

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
        stopGrowButton.disabled = false;
    }
}

function setStartPointModus(){
    joinPointMode = startPointMode;
    startPointMode = !startPointMode;
}

function setJoinPointModus(){
    startPointMode = joinPointMode;
    joinPointMode = !joinPointMode;
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
                            if(strokeConstructionsStarts[i] > k) strokeConstructionsStarts[i]++;
                            if(strokeConstructionsStarts[j] > l) strokeConstructionsStarts[j]++;
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
        strokeConstructionsStarts[thisStartPoint.strokeIndex] = thisStartPoint.pointIndex;
        drawEditMode(canvasContext, strokes, strokeConstructionsStarts);
    }
}

function mouseDownJoinPoint(event){
    if(joinPointMode && thisJoinPoint){
        let index = findUsedJoinPointIndex(thisJoinPoint);
        if(index === -1){
            usedJoinPoints.push(thisJoinPoint);
        }
        else{
            usedJoinPoints.splice(index, 1);
        }
        drawEditMode(canvasContext, strokes, strokeConstructionsStarts);
    }
}

function findUsedJoinPointIndex(joinPoint){
    for(let i = 0; i < usedJoinPoints.length; i++){
        if(UTILS.calcDistance(usedJoinPoints[i].intersection, joinPoint.intersection) < 1){
            return i;
        }
    }
    return -1;
}

/**
 * @param {*} strokes This parameter is a 2D array containing x and y coordinates of all strokes
 * @param {*} startPointPosition This parameter is a tuple of x and y coordinates, that should be contained in strokes
 */
function createStructsFromStrokes(strokes, startPointPosition){

    let strokeStructs = [];

    for(let i=0; i<strokes.length;i++){
        let com = UTILS.calcCOMFromPoints(strokes[i]);
        let stroke = strokes[i];
        let start = startPointPosition[i];
    
        let strokeRoot = new TREE.Node(stroke[start], null, [], [], com);
        let lastNode = strokeRoot;
        let thisNode;
    
        for(let j=start-1; j>=0;j--){
            thisNode = new TREE.Node(stroke[j], lastNode, [], [], com);
            lastNode.descendants.push(thisNode);
            lastNode = thisNode;
        }
    
        lastNode = strokeRoot;
        for(let j=start+1; j<stroke.length; j++){
            thisNode = new TREE.Node(stroke[j], lastNode, [], [], com);
            lastNode.descendants.push(thisNode);
            lastNode = thisNode;
        }

        strokeStructs.push(strokeRoot);
    }

    return strokeStructs;
}

function strokeTransformation(strokes){
    strokes = strokes.map(stroke => UTILS.transformStrokeToTuples(stroke));
    return strokes.map(stroke => UTILS.fillInDistantStrokePoints(stroke, TREE.TREE_CONFIG.sproutingLength)); 
}

function setStrokeStarts(strokes){
    let strokeStarts = [];
    for(let stroke of strokes){
        strokeStarts.push(Math.floor(stroke.length/2));
    }
    return strokeStarts;
}

async function growStructs(getStructs, context, abordGrow, setAbordGrow, getPlay){
    let oneStillGrowing = true;
    
    while(oneStillGrowing && !abordGrow()){
        console.log("abordGrow: " + abordGrow());
        console.log("play: " + getPlay());
        oneStillGrowing = false;
        const structs = getStructs();

        redrawStrokes(canvas.trace, context);
        
        // Calculate forcefields for all nodes
        const forceFields = [];
        for(let node of structs){
            forceFields.push(node.calculateForcePoints());
        }

        /*for(let points of forceFields){
            for(let point of points){
                //Mal einen Kreis in Rot der Durchlässig ist und mit dem Radius von TREE_CONFIG.cripplingMinDist um die Kraftpunkte
                context.beginPath();
                context.arc(point[0], point[1], TREE.TREE_CONFIG.cripplingMinDist, 0, 2 * Math.PI);
                context.fillStyle = "rgba(255, 0, 0, 0.5)";
                context.fill();
            }
        }*/
        
        for(let i = 0; i < structs.length; i++){
            const otherForceFields = [];
            for(let j = 0; j < structs.length; j++){
                if(i !== j){
                    otherForceFields.push(forceFields[j]);
                }               
            }
            structs[i].setForceFields(otherForceFields);
        }
        
        for(let node of structs){   
            oneStillGrowing = node.grow() || oneStillGrowing;
            node.draw(context);
        }
        

        await nextFrame(getPlay, abordGrow);
    }

    setAbordGrow(false);
    setPlay(false);

    canvasContext.strokeStyle="#8E977D";
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
        context.beginPath();
        context.arc(strokes[i][strokeStart][0], strokes[i][strokeStart][1], 5, 0, 2 * Math.PI);
        context.fillStyle = "rgba(255, 0, 0, 0.5)";
        context.fill();
    }
    for(let joinPoint of usedJoinPoints){
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