export function redrawAndDownloadCanvasAsImage(canvas, structs){
    const width = canvas.width;
    const height = canvas.height;
    
    // Temporärer Canvas nur mit schwarzen Linien
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    
    
    // NUR die schwarzen Baum-Linien zeichnen (keine User-Strokes!)
    if (structs.length > 0) {
        // Structs zeichnen
        for (let node of structs) {
            node.draw(tempCtx);
        }
    }
    
    // Download
    const link = document.createElement('a');
    link.href = tempCanvas.toDataURL('image/png');
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    link.download = `canvas_${timestamp}.png`;
    link.click();
}