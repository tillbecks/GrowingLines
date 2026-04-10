import * as POINTACTIONS from "../tree/joinStartPointActions.js";
import * as TCPRESETS from "../config/treeConfigPresets.js";

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
        const canvas = document.getElementById("canvas");
        this.dom = {
            pureCanvas: canvas,
            canvas: new handwriting.Canvas(canvas),
            canvasContext: canvas.getContext("2d"),
            buttons: {
                resetButton: document.getElementById("resetButton"),
                growButton: document.getElementById("growButton"),
                resetGrow: document.getElementById("resetGrow"),
                stopGrow: document.getElementById("stopGrow"),
                editMode: document.getElementById("editModeButton"),
                startPoint: document.getElementById("startPointButton"),
                joinPoint: document.getElementById("joinPointButton"),
                download: document.getElementById("downloadButton")
            }
        };
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
    }

    setPlay(value=!this.growState.play){
        this.growState.play = value;
        this.dom.buttons.stopGrow.value = !this.growState.play ? "▶" : "⏸";
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
        if(this.editModeState.joinPointMode){
            this.dom.buttons.joinPoint.style.color = "white";
            this.dom.buttons.joinPoint.style.backgroundColor = "blue";
        }else{
            this.dom.buttons.joinPoint.style.color = "blue";
            this.dom.buttons.joinPoint.style.backgroundColor = "white";
        }
    
        if(this.editModeState.startPointMode){
            this.dom.buttons.startPoint.style.color = "white";
            this.dom.buttons.startPoint.style.backgroundColor = "red";
        }else{
            this.dom.buttons.startPoint.style.color = "red";
            this.dom.buttons.startPoint.style.backgroundColor = "white";
        }
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
            this.editModeState = newState.editModeState;
            this.dom.canvas.erase();
        };
    
        const resets = {
            "all": () => {
                resetCore();
                this.treeConfig = TCPRESETS.treeConfigs[TCPRESETS.defaultTreeConfigIndex];
            },
            "canvas": () => resetCore(),
            "grow": () => {
                this.strokeState.structs = [];
            }
        };
    
        resets[level]?.();
    }
    
}

export default new State();