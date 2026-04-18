import { drawTreeNode } from "../canvas/canvasDrawing.js";
import { DOWNLOADPADDING } from "../config/appConfig.js";

export function redrawAndDownloadCanvasAsImage(canvas, structs){
    const boundaries = getTreeBoundaries(structs);

    const width = boundaries.maxX - boundaries.minX + 2 * DOWNLOADPADDING;
    const height = boundaries.maxY - boundaries.minY + 2 * DOWNLOADPADDING;

    // Offsets berechnen um Baum oben links zu positionieren
    const offsetX = -boundaries.minX + DOWNLOADPADDING;
    const offsetY = -boundaries.minY + DOWNLOADPADDING;
    
    // Temporärer Canvas nur mit schwarzen Linien
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const context = tempCanvas.getContext('2d');
    context.lineCap = "round";
    context.lineJoin = "round";
    
    // NUR die schwarzen Baum-Linien zeichnen (keine User-Strokes!)
    if (structs.length > 0) {
        // Structs zeichnen mit Offsets
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
    
    // Für mobile Geräte: toBlob verwenden
    tempCanvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, 'image/png');
}

export function getTreeBoundaries(structs){
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
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