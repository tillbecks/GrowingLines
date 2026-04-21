import { SECONDARYCOLOR } from "../config/appConfig.js";
import state from "../state/state.js";
import dom from "../state/domState.js";


const resizeObserver = new ResizeObserver(() => {
    redrawCanvas();
});

//Observe the info section for size changes to adjust the canvas size accordingly
resizeObserver.observe(dom.infoSection);

//on window resize, adjust canvas size and redraw background
window.addEventListener('resize', () => {
    dom.backgroundCanvas.width = window.innerWidth;
    dom.backgroundCanvas.height = window.innerHeight;
    
    // Reset context properties (they get reset when canvas size changes)

    redrawCanvas();
});

dom.canvasScrollContainer.addEventListener('scroll', () => {
    redrawCanvas();
});

function redrawCanvas(){
    if(!state.editModeState.editMode){
        dom.backgroundCanvasContext.lineCap = "round";
        dom.backgroundCanvasContext.lineJoin = "round";
        dom.backgroundCanvasContext.fillStyle = SECONDARYCOLOR;
        dom.backgroundCanvasContext.fillRect(0, 0, dom.backgroundCanvas.width, dom.backgroundCanvas.height);

        for(let node of state.strokeState.structs){
            node.draw(dom.pureCanvas, dom.backgroundCanvas);
        }
    }
}   

export function initCanvas(){
    dom.backgroundCanvas.width = window.innerWidth;
    dom.backgroundCanvas.height = window.innerHeight;
    
    dom.backgroundCanvasContext.lineCap = "round";
    dom.backgroundCanvasContext.lineJoin = "round";
    dom.backgroundCanvasContext.fillStyle = SECONDARYCOLOR;
    dom.backgroundCanvasContext.fillRect(0, 0, dom.backgroundCanvas.width, dom.backgroundCanvas.height);

    dom.backgroundCanvas.classList.add("initialized");
}