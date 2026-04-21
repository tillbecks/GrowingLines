import { drawTreeNode } from "../canvas/canvasDrawing.js";
import { DOWNLOADPADDING } from "../config/appConfig.js";
import dom from "../state/domState.js";

/**
 * Redraws the tree structures on a temporary canvas and triggers a download of the canvas content as an image file.
 * @param {*} structs 
 */
export function redrawAndDownloadCanvasAsImage(structs){

    // Calculate the boundaries of the tree to determine the size of the temporary canvas
    const boundaries = getTreeBoundaries(structs);

    const width = boundaries.maxX - boundaries.minX + 2 * DOWNLOADPADDING;
    const height = boundaries.maxY - boundaries.minY + 2 * DOWNLOADPADDING;

    const offsetX = -boundaries.minX + DOWNLOADPADDING;
    const offsetY = -boundaries.minY + DOWNLOADPADDING;
    
    // Create a temporary canvas to draw the tree structures
    const tempCanvas = dom.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const context = tempCanvas.getContext('2d');
    context.lineCap = "round";
    context.lineJoin = "round";
    
    if (structs.length > 0) {
        //Draw tree structures on the temporary canvas, applying the calculated offsets to position them correctly
        for (let node of structs) {
            node.foldTree(function() {
                if(this.ancestor != null && this.age > 0){
                    drawTreeNode(tempCanvas, null, 
                        [this.position[0] + offsetX, this.position[1] + offsetY],
                        [this.ancestor.position[0] + offsetX, this.ancestor.position[1] + offsetY],
                        this.thickness
                    );
                }
            }, null);
        }
    }
    
    // Download
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `canvas_${timestamp}.png`;
    
    // toBlob is mobile friendly
    tempCanvas.toBlob(function(blob) {
        if (!blob) {
            console.error('Failed to create blob from canvas. Canvas might be too large.');
            return;
        }
        const url = URL.createObjectURL(blob);
        const link = dom.createElement('a');
        link.href = url;
        link.download = filename;
        dom.body.appendChild(link);
        link.click();
        dom.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, 'image/png');
}

/**
 * Calculates the boundaries of the tree structures to determine the size of the temporary canvas for downloading.
 * @param {*} structs 
 * @returns 
 */
export function getTreeBoundaries(structs){
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    // Iterates through all nodes in the tree structures and calculates the minimum and maximum x and y coordinates.
    for (let node of structs) {
        const boundaries = node.foldTree(function(acc) {
            const x = this.position[0];
            const y = this.position[1];
            return {
                minX: Math.min(acc.minX, x - this.thickness / 2),
                minY: Math.min(acc.minY, y - this.thickness / 2),
                maxX: Math.max(acc.maxX, x + this.thickness / 2),
                maxY: Math.max(acc.maxY, y + this.thickness / 2)
            };
        }, {minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity});
        
        
        minX = Math.min(minX, boundaries.minX);
        minY = Math.min(minY, boundaries.minY);
        maxX = Math.max(maxX, boundaries.maxX);
        maxY = Math.max(maxY, boundaries.maxY);
    }
    
    return {minX, minY, maxX, maxY};
}