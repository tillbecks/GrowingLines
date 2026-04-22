import * as AC from "../config/appConfig.js";
import * as DRAWING from "../canvas/canvasDrawing.js";

class domState{
    constructor(){
        this.body = document.body;

        const canvas = this.initCanvas();

        this.pureCanvas = canvas;
        this.canvasContext = canvas.getContext("2d");
        this.canvas = new handwriting.Canvas(canvas, AC.USERSTROKEWIDTH);
        this.backgroundCanvas = document.getElementById("backgroundCanvas");
        this.backgroundCanvasContext = this.backgroundCanvas.getContext("2d");
        this.buttons = {
            resetButton: document.getElementById("resetButton"),
            growButton: document.getElementById("growButton"),
            resetGrow: document.getElementById("resetGrow"),
            stopGrow: document.getElementById("stopGrow"),
            editMode: document.getElementById("editModeButton"),
            startPoint: document.getElementById("startPointButton"),
            joinPoint: document.getElementById("joinPointButton"),
            download: document.getElementById("downloadButton"),
            loadPreset: document.getElementById("loadPreset"),
            infoBoxHideButton: document.getElementById("infoBoxHideButton")
        };
        this.editModeButtonsContainer = document.getElementById("editModeButtonsContainer");

        this.canvasAgeSection = document.getElementById("canvasAgeContainer");
        this.canvasScrollContainer = document.getElementById('canvasScrollContainer');
            
        this.infoSection = document.getElementById("infoSection");
        this.infoBoxContainer = document.querySelector(".info-box-container");


        this.popup = document.getElementById("popup");
        this.popupContent = document.getElementById("popupContent");

        this.presetSelector = document.getElementById("presetSelector");

        this.advancedSettingsToggle = document.getElementById('advancedSettingsToggle');
        this.advancedSettingsContainer = document.getElementById('advancedSettingsContainer');
        this.settingsArrow = document.getElementById('settingsArrow');
    }

    initCanvas(){
        const canvas = document.getElementById("canvas");
        //Set canvas drawing color and width
        canvas.getContext("2d").strokeStyle = AC.USERSTROKECOLOR;
        canvas.getContext("2d").lineWidth = AC.USERSTROKEWIDTH;
        canvas.getContext("2d").globalAlpha = 1;
        canvas.getContext("2d").globalCompositeOperation = "source-over";

        return canvas;
    }

    resetBackgroundCanvas = () => {
        DRAWING.clearCanvas(this.backgroundCanvas.getContext("2d"), AC.SECONDARYCOLOR);
    }
    
    resetForegroundCanvas = () => {
        this.canvas.erase();
        DRAWING.clearCanvas(this.pureCanvas.getContext("2d"), AC.PRIMARYCOLOR);
    }

    /**
     * Updates the styling of the edit mode buttons based on the current state of edit mode, start point mode, and join point mode. 
     */
    updateStyleModeButtons(editModeState, startPointMode, joinPointMode){
        this.editModeButtonsContainer.classList.toggle("editModeActive", editModeState);
        this.editModeButtonsContainer.classList.toggle("startMode", startPointMode);
        this.editModeButtonsContainer.classList.toggle("joinMode", joinPointMode);
    }

    updatePlayButton(play){
        this.buttons.stopGrow.value = !play ? "\u25B6" : "\u23F8";
    }

    getElementById(id){
        return document.getElementById(id);
    }

    createElement(type, classList = [], id = null, attributes = {}){
        const element = document.createElement(type);
        classList.forEach(cls => element.classList.add(cls));
        if(id) element.id = id;
        // Set additional attributes like width, height for canvas elements
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
        return element;
    }

    getCanvasContainerDimensions(){
        const container = this.canvasScrollContainer;
        return {
            width: container.clientWidth,
            height: container.clientHeight
        };
    }
}

export default new domState();