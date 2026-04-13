import { SECONDARYCOLOR } from "../config/appConfig.js";
import state from "../state/state.js";

const backgroundCanvas = document.getElementById('backgroundCanvas');
const backgroundCtx = backgroundCanvas.getContext('2d');
const canvasScrollContainer = document.getElementById('canvasScrollContainer');

//on window resize, adjust canvas size and redraw background
window.addEventListener('resize', () => {
    backgroundCanvas.width = window.innerWidth;
    backgroundCanvas.height = window.innerHeight;

    redrawCanvas();
});

canvasScrollContainer.addEventListener('scroll', () => {
    redrawCanvas();
});

function redrawCanvas(){
    if(!state.editModeState.editMode){
        backgroundCtx.fillStyle = SECONDARYCOLOR;
        backgroundCtx.fillRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

        for(let node of state.strokeState.structs){
            node.draw(state.dom.pureCanvas, state.dom.backgroundCanvas);
        }
    }
}   

export function initCanvas(){
    backgroundCanvas.width = window.innerWidth;
    backgroundCanvas.height = window.innerHeight;

    backgroundCtx.fillStyle = SECONDARYCOLOR;
    backgroundCtx.fillRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

    backgroundCanvas.classList.add("initialized");
}