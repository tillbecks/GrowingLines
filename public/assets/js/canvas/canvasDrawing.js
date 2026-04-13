import * as AC from "../config/appConfig.js";

export function drawStructs(trace, structs, primaryCanvas, secondaryCanvas){
    redrawStrokes(trace, primaryCanvas.getContext("2d"));
    for(let node of structs){
        node.draw(primaryCanvas, secondaryCanvas);
    }
}

export function drawEditMode(context, strokes, strokeStarts, joinPoints, trace){
    redrawStrokes(trace, context);
    for(let i = 0; i < strokeStarts.length; i++){
        const strokeStart = strokeStarts[i];
        if(strokeStart != null){
            context.beginPath();
            context.arc(strokes[i][strokeStart][0], strokes[i][strokeStart][1], AC.POINTRADIUS, 0, 2 * Math.PI);
            context.fillStyle = AC.STARTPOINTCOLOR;
            context.fill();
        }
    }
    for(let joinPoint of joinPoints){
        context.beginPath();
        context.arc(joinPoint.intersection[0], joinPoint.intersection[1], AC.POINTRADIUS, 0, 2 * Math.PI);
        context.fillStyle = AC.JOINPOINTCOLOR;
        context.fill();
    }
    resetColor(context);
}

export function redrawStrokes(strokes, context){

    context.strokeStyle = AC.USERSTROKECOLOR;
    context.lineWidth = AC.USERSTROKEWIDTH;

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    for(let stroke of strokes){
        context.beginPath();
        context.moveTo(stroke[0][0], stroke[1][0]);
        for(let i=1; i<stroke[0].length; i++){
            context.lineTo(stroke[0][i], stroke[1][i]);
        }
        context.stroke();
    }
    resetColor(context);
}

export function drawDebugInfo(context, structs, crowdingMinDist, forceFields){
    for(let points of forceFields){
        for(let point of points){
            //Mal einen Kreis in Rot der Durchlässig ist und mit dem Radius von TREE_CONFIG.crowdingMinDist um die Kraftpunkte
            context.beginPath();
            context.arc(point[0], point[1], crowdingMinDist, 0, 2 * Math.PI);
            context.fillStyle = AC.FORCEFIELDCOLOR;
            context.fill();
        }
    }

    for(let node of structs){
        context.beginPath();
        context.arc(node.centerOfMass[0], node.centerOfMass[1], AC.COMRADIUS, 0, 2 * Math.PI);
        context.fillStyle = AC.COMCOLOR;
        context.fill();
    }
    resetColor(context);
}

export function drawTreeNode(primaryCanvas, secondaryCanvas, position, ancestorPosition, thickness){
    const context = primaryCanvas.getContext("2d");

    context.lineWidth = (thickness);// + this.ancestor.thickness)/2;
    context.strokeStyle = AC.GROWINGSTROKECOLOR; //Maybe later gradient depending on age or thickness
    context.beginPath();
    context.moveTo(position[0], position[1]);
    context.lineTo(ancestorPosition[0], ancestorPosition[1]);
    context.stroke();
    resetColor(context);

    const offsetX = primaryCanvas.getBoundingClientRect().left;
    const offsetY = primaryCanvas.getBoundingClientRect().top;
    const secondaryContext = secondaryCanvas.getContext("2d");
    secondaryContext.lineWidth = (thickness);// + this.ancestor.thickness)/2;
    secondaryContext.strokeStyle = AC.PRIMARYCOLOR; //Maybe later gradient depending on age or thickness
    secondaryContext.beginPath();
    secondaryContext.moveTo(position[0] + offsetX, position[1] + offsetY);
    secondaryContext.lineTo(ancestorPosition[0] + offsetX, ancestorPosition[1] + offsetY);
    secondaryContext.stroke();
    resetColor(secondaryContext);
}

export function copyInvertCanvas(sourceCanvas, targetCanvas){
    const offsetX = sourceCanvas.getBoundingClientRect().left;
    const offsetY = sourceCanvas.getBoundingClientRect().top;

    const targetContext = targetCanvas.getContext('2d');
    targetContext.fillStyle = AC.SECONDARYCOLOR;
    targetContext.fillRect(0, 0, targetCanvas.width, targetCanvas.height);
    targetContext.filter = "invert(1)";
    targetContext.drawImage(sourceCanvas, offsetX, offsetY);
    targetContext.filter = "none";
}

function resetColor(context){
    context.strokeStyle = AC.USERSTROKECOLOR;
    context.lineWidth = AC.USERSTROKEWIDTH;
}