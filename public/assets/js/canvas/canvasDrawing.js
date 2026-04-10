export function drawStructs(trace, structs, context){
    redrawStrokes(trace, context);
    for(let node of structs){
        node.draw(context);
    }
}

export function drawEditMode(context, strokes, strokeStarts, joinPoints, trace){
    redrawStrokes(trace, context);
    for(let i = 0; i < strokeStarts.length; i++){
        const strokeStart = strokeStarts[i];
        if(strokeStart != null){
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

export function redrawStrokes(strokes, context){

    context.strokeStyle="#8E977D";
    context.lineWidth = 2;

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    for(let stroke of strokes){
        context.beginPath();
        context.moveTo(stroke[0][0], stroke[1][0]);
        for(let i=1; i<stroke[0].length; i++){
            context.lineTo(stroke[0][i], stroke[1][i]);
        }
        context.stroke();
    }
}