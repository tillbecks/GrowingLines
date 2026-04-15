import * as POINTACTIONS from "../tree/joinStartPointActions.js";
import * as TCPRESETS from "../config/treeConfigPresets.js";
import * as AC from "../config/appConfig.js";
import * as DRAWING from "../canvas/canvasDrawing.js";

class State{
    constructor(){
        this.strokeState = {
            strokes : [],
            strokeStarts: [],
            strokeStartsCache: [],
            joinPoints: [],
            structs: [],
        };

        this.growState = {
            abordGrow: false,
            play: false,
            isGrowing: false,
        };

        this.editModeState = {
            editMode: false,
            startPointMode: false,
            joinPointMode: false,
            potentialJoinPoints: [],
            thisJoinPoint: null,
            thisStartPoint: null,
        }
        
        this.dom = null;
        this.initDom();

        this.treeConfig = structuredClone(TCPRESETS.treeConfigs[TCPRESETS.defaultTreeConfigIndex]);
    }

    initDom(){
        const canvas = this.initCanvas();
        this.dom = {
            pureCanvas: canvas,
            canvasContext: canvas.getContext("2d"),
            canvas: new handwriting.Canvas(canvas, AC.USERSTROKEWIDTH),
            backgroundCanvas: document.getElementById("backgroundCanvas"),
            buttons: {
                resetButton: document.getElementById("resetButton"),
                growButton: document.getElementById("growButton"),
                resetGrow: document.getElementById("resetGrow"),
                stopGrow: document.getElementById("stopGrow"),
                editMode: document.getElementById("editModeButton"),
                startPoint: document.getElementById("startPointButton"),
                joinPoint: document.getElementById("joinPointButton"),
                download: document.getElementById("downloadButton"),
                loadPreset: document.getElementById("loadPreset"),
            },
            editModeButtonsContainer: document.getElementById("editModeButtonsContainer"),
        };
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

    setEditMode(mode){
        if(mode){
            this.editModeState.editMode = true;
        }
        else{
            this.editModeState.editMode = false;
            this.editModeState.startPointMode = false;
            this.editModeState.joinPointMode = false;
            this.editModeState.potentialJoinPoints = [];
            this.editModeState.thisJoinPoint = null;
            this.editModeState.thisStartPoint = null;
        }
        this.updateStyleModeButtons();
    }

    setPlay(value=!this.growState.play){
        this.growState.play = value;
        this.dom.buttons.stopGrow.value = !this.growState.play ? "\u25B6" : "\u23F8";
    }

    setStartPointModus(){
        if(!this.editModeState.startPointMode){
            if(this.editModeState.joinPointMode){
                this.editModeState.joinPointMode = false;
            }
            this.editModeState.startPointMode = true;
        }
        else{
            this.editModeState.startPointMode = false;
        }
    
        this.updateStyleModeButtons();
    }
    
    setJoinPointModus(){
        if(!this.editModeState.joinPointMode){
            if(this.editModeState.startPointMode){
                this.editModeState.startPointMode = false;
            }
            this.editModeState.joinPointMode = true;
        }
        else{
            this.editModeState.joinPointMode = false;
        }
        
        this.updateStyleModeButtons();
    }
    
    updateStyleModeButtons(){
        this.dom.editModeButtonsContainer.classList.toggle("editModeActive", this.editModeState.editMode);
        this.dom.editModeButtonsContainer.classList.toggle("startMode", this.editModeState.startPointMode);
        this.dom.editModeButtonsContainer.classList.toggle("joinMode", this.editModeState.joinPointMode);
    }

    checkStrokeStarts(){
        if(this.strokeState.strokeStarts.length > this.strokeState.strokes.length){
            this.strokeState.strokeStarts = this.strokeState.strokeStarts.slice(0, this.strokeState.strokes.length);
        }
        for(let i=0; i<this.strokeState.strokes.length; i++){
            if(!POINTACTIONS.hasStartPoint(this.strokeState.strokeStarts, this.strokeState.joinPoints, i)){
                if(this.strokeState.strokeStartsCache[i] && this.strokeState.strokeStartsCache[i] < this.strokeState.strokes[i].length){
                    this.strokeState.strokeStarts[i] = this.strokeState.strokeStartsCache[i];
                }
                else{
                    this.strokeState.strokeStarts[i] = Math.floor(this.strokeState.strokes[i].length/2);
                    this.strokeState.strokeStartsCache[i] = this.strokeState.strokeStarts[i];
                }
            }
        }
    }

    reset(level = "canvas") {
        const resetCore = () => {
            const newState = new State();
            this.strokeState = newState.strokeState;
            this.growState = newState.growState;
            this.editModeState = newState.editModeState
            resetForegroundCanvas();
            resetBackgroundCanvas();
        };

        const resetBackgroundCanvas = () => {
            DRAWING.clearCanvas(this.dom.backgroundCanvas.getContext("2d"), AC.SECONDARYCOLOR);
        }

        const resetForegroundCanvas = () => {
            this.dom.canvas.erase();
            DRAWING.clearCanvas(this.dom.pureCanvas.getContext("2d"), AC.PRIMARYCOLOR);
        }
    
        const resets = {
            "all": () => {
                resetCore();
                this.treeConfig = TCPRESETS.treeConfigs[TCPRESETS.defaultTreeConfigIndex];
            },
            "canvas": () => {
                resetCore();
            },
            "grow": () => {
                this.strokeState.structs = [];
                resetBackgroundCanvas();
            },
            "editMode": () => {
                resetBackgroundCanvas();
            }
        };
    
        resets[level]?.();
    }

    insertTraceAndStrokeState(trace, strokeState){
        this.dom.canvas.injectTrace(trace, false);
        this.strokeState = strokeState;
    }
    
}

export default new State();