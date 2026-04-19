import * as AC from "../config/appConfig.js";

/**
 * Draws the user strokes and the trees on the canvases
 * @param {Array} trace - Array of stroke data to redraw
 * @param {Array} structs - Array of tree node structures to draw
 * @param {HTMLCanvasElement} primaryCanvas - Primary canvas element to draw on
 * @param {HTMLCanvasElement} secondaryCanvas - Secondary canvas element for background drawing
 * @returns {void}
 */
export function drawStructs(trace, structs, primaryCanvas, secondaryCanvas){
    //Draw user strokes as background
    redrawStrokes(trace, primaryCanvas.getContext("2d"));

    //Draw tree structs
    for(let node of structs){
        node.draw(primaryCanvas, secondaryCanvas);
    }
}

/**
 * Draws edit mode visualization with start points and join points
 * @param {CanvasRenderingContext2D} context - Canvas context to draw on
 * @param {Array} strokes - Array of strokes with their points
 * @param {Array} strokeStarts - Array of start point indices for each stroke
 * @param {Array} joinPoints - Array of join point objects
 * @param {Array} trace - Array of stroke data to redraw as background
 * @returns {void}
 */
export function drawEditMode(context, strokes, strokeStarts, joinPoints, trace){
    //Draw user strokes as background
    redrawStrokes(trace, context);

    //Draw start points
    for(let i = 0; i < strokeStarts.length; i++){
        const strokeStart = strokeStarts[i];
        if(strokeStart != null){
            context.beginPath();
            context.arc(strokes[i][strokeStart][0], strokes[i][strokeStart][1], AC.POINTRADIUS, 0, 2 * Math.PI);
            context.fillStyle = AC.STARTPOINTCOLOR;
            context.fill();
        }
    }

    //Draw join points
    for(let joinPoint of joinPoints){
        context.beginPath();
        context.arc(joinPoint.intersection[0], joinPoint.intersection[1], AC.POINTRADIUS, 0, 2 * Math.PI);
        context.fillStyle = AC.JOINPOINTCOLOR;
        context.fill();
    }
    resetColor(context);
}

/**
 * Redraws all user-drawn strokes on the canvas
 * @param {Array} strokes - Array of strokes, each containing x and y coordinate arrays
 * @param {CanvasRenderingContext2D} context - Canvas context to draw on
 * @returns {void}
 */
export function redrawStrokes(strokes, context){

    context.strokeStyle = AC.USERSTROKECOLOR;
    context.lineWidth = AC.USERSTROKEWIDTH;

    clearCanvas(context, AC.PRIMARYCOLOR);

    //Draw user strokes as background
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

/**
 * Draws debug information including force fields and center of mass points
 * @param {CanvasRenderingContext2D} context - Canvas context to draw on
 * @param {Array} structs - Array of tree node structures
 * @param {number} crowdingMinDist - Minimum crowding distance for visualization
 * @param {Array} forceFields - Array of force field points to visualize
 * @returns {void}
 */
export function drawDebugInfo(context, structs, crowdingMinDist, forceFields){

    //Draw force fields
    for(let points of forceFields){
        for(let point of points){
            //Mal einen Kreis in Rot der Durchlässig ist und mit dem Radius von TREE_CONFIG.crowdingMinDist um die Kraftpunkte
            context.beginPath();
            context.arc(point[0], point[1], crowdingMinDist, 0, 2 * Math.PI);
            context.fillStyle = AC.FORCEFIELDCOLOR;
            context.fill();
        }
    }

    //Draw center of mass points
    for(let node of structs){
        context.beginPath();
        context.arc(node.centerOfMass[0], node.centerOfMass[1], AC.COMRADIUS, 0, 2 * Math.PI);
        context.fillStyle = AC.COMCOLOR;
        context.fill();
    }
    resetColor(context);
}

/**
 * Draws a single tree node connection (branch) on two canvases, where the first canvas determines the offset
 * @param {HTMLCanvasElement} primaryCanvas - Primary canvas to draw on
 * @param {HTMLCanvasElement|null} [secondaryCanvas=null] - Optional secondary canvas for background
 * @param {Array} position - [x, y] coordinates of the current node
 * @param {Array} ancestorPosition - [x, y] coordinates of the ancestor node
 * @param {number} thickness - Line thickness for the branch
 * @returns {void}
 */
export function drawTreeNode(primaryCanvas, secondaryCanvas=null, position, ancestorPosition, thickness){
    //Draw branch on primary canvas with growing stroke color
    const context = primaryCanvas.getContext("2d");

    context.lineWidth = (thickness);
    context.strokeStyle = AC.GROWINGSTROKECOLOR; 
    context.beginPath();
    context.moveTo(position[0], position[1]);
    context.lineTo(ancestorPosition[0], ancestorPosition[1]);
    context.stroke();
    resetColor(context);
    
    //If secondary canvas is provided, draw the same branch on it with primary color and offset to align with primary canvas
    if(secondaryCanvas){
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
}

/**
 * Resets canvas context color and line width to default values
 * @param {CanvasRenderingContext2D} context - Canvas context to reset
 * @returns {void}
 * @private
 */
function resetColor(context){
    context.strokeStyle = AC.USERSTROKECOLOR;
    context.lineWidth = AC.USERSTROKEWIDTH;
}

/**
 * Clears the entire canvas with a solid color
 * @param {CanvasRenderingContext2D} context - Canvas context to clear
 * @param {string} color - Fill color (CSS color string or hex)
 * @returns {void}
 */
export function clearCanvas(context, color){
    context.fillStyle = color;
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
}