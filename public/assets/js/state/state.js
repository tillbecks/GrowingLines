import * as POINTACTIONS from "../tree/joinStartPointActions.js";
import * as TCPRESETS from "../config/treeConfigPresets.js";
import * as UTILS from "../config/utils.js";
import * as AGECOUNTER from "../ui/ageCounter.js";
import dom from "./domState.js";

//Central state management for the application, containing all relevant states and functions to manipulate them
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
        }

        this.treeConfig = structuredClone(TCPRESETS.treeConfigs[TCPRESETS.defaultTreeConfigIndex]);
    }

    /**
     * Toggles edit mode on or off, resetting relevant states and updating UI elements accordingly
     * @param {boolean} mode - True to activate edit mode, false to deactivate
     */
    setEditMode(mode){
        if(mode){

            this.reset("editMode");
            this.editModeState.editMode = true;

            dom.pureCanvas.classList.add("not-allowed-cursor");
            dom.buttons.editMode.value = "Exit Edit Mode"; 

            //Deactivate canvas drawing and interactions
            dom.canvas.deactivate();

            dom.buttons.download.disabled = true;
            AGECOUNTER.hideAgeCounter();

            ////Check if existing start points and join points are still valid after potential setting changes (e.g. branch length) and clean up if necessary
            this.cleanUpStartAndJoinPoints();
            this.checkStrokeStart();               
        }
        else{
            this.editModeState.editMode = false;
            this.editModeState.startPointMode = false;
            this.editModeState.joinPointMode = false;
            this.editModeState.potentialJoinPoints = [];

            dom.pureCanvas.classList.remove("not-allowed-cursor");
            dom.buttons.editMode.value = "Edit Mode"; 
    
            dom.canvas.activate();

            dom.buttons.download.disabled = false;
            AGECOUNTER.reviveAgeCounter();
        }
        dom.updateStyleModeButtons(this.editModeState.editMode, this.editModeState.startPointMode, this.editModeState.joinPointMode);
    }

    /**
     * Sets the play state of the application and updates the play button text accordingly
     * @param {boolean} value - True to play, false to pause
     */
    setPlay(value=!this.growState.play){
        this.growState.play = value;
        dom.updatePlayButton(this.growState.play);
    }

    /**
     * Toggles start point mode on or off, ensuring that join point mode is deactivated when start point mode is activated.
     */
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
    
        dom.updateStyleModeButtons(this.editModeState.editMode, this.editModeState.startPointMode, this.editModeState.joinPointMode);
    }
    
    /**
     * Toggles join point mode on or off, ensuring that start point mode is deactivated when join point mode is activated.
     */
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
        
        dom.updateStyleModeButtons(this.editModeState.editMode, this.editModeState.startPointMode, this.editModeState.joinPointMode);
    }
    

    /**
     * Cleans up the stroke starts and join points to ensure they are consistent with the current strokes, especially after changes in branch length that may affect the validity of existing start and join points. 
     */
    cleanUpStartAndJoinPoints(){
        const oldStrokes = this.strokeState.strokes;

        this.strokeState.strokes = UTILS.strokePreprocessing(dom.canvas.getTrace(), this.treeConfig.sproutingLength);
        this.strokeState.strokeStarts = POINTACTIONS.mapStartPointsNewLength(oldStrokes, this.strokeState.strokes, this.strokeState.strokeStarts);
        this.strokeState.strokeStartsCache = POINTACTIONS.mapStartPointsNewLength(oldStrokes, this.strokeState.strokes, this.strokeState.strokeStartsCache);

        this.strokeState.potentialJoinPoints = POINTACTIONS.calculateJoinPoints(this.strokeState.strokes, this.strokeState.strokeStarts);
        this.strokeState.joinPoints = POINTACTIONS.mapJoinPointsNewLength(oldStrokes, this.strokeState.strokes, this.strokeState.joinPoints);
    }

    /**
     * Checks the validity of stroke start points and updates them if they are no longer valid, either by retrieving valid start points from the cache or by recalculating them based on the current stroke lengths. 
     */
    checkStrokeStart(){
        if(this.strokeState.strokeStarts.length > this.strokeState.strokes.length){
            this.strokeState.strokeStarts = this.strokeState.strokeStarts.slice(0, this.strokeState.strokes.length);
        }
        for(let i=0; i<this.strokeState.strokes.length; i++){
            if(!POINTACTIONS.hasStartPoint(this.strokeState.strokeStarts, this.strokeState.joinPoints, i)){
                if(this.strokeState.strokeStartsCache[i] && this.strokeState.strokeStartsCache[i] < this.strokeState.strokes[i].length){
                    this.strokeState.strokeStarts[i] = this.strokeState.strokeStartsCache[i];
                    // Wenn der aus dem Cache genommen wird muss der auch noch gecheckt werden.
                }
                else{
                    this.strokeState.strokeStarts[i] = Math.floor(this.strokeState.strokes[i].length/2);
                    this.strokeState.strokeStartsCache[i] = this.strokeState.strokeStarts[i];
                }
            }
        }
    }

    /**
     * Resets the application state to its initial values.
     * @param {string} level - The level of reset to perform. Options are "all" to reset everything including tree configuration, "canvas" to reset only the canvas and related states, "grow" to reset only the growth-related states and canvas, and "editMode" to reset only the edit mode related states and canvas.
     */
    reset(level = "canvas") {
        const resetCore = () => {
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
                //thisJoinPoint: null,
                //thisStartPoint: null,
            }
            dom.resetForegroundCanvas();
            dom.resetBackgroundCanvas();
        };
    
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
                dom.resetBackgroundCanvas();
            },
            "editMode": () => {
                dom.resetBackgroundCanvas();
            }
        };
    
        resets[level]?.();
    }

    /**
     * Inserts a trace and its corresponding stroke state into the application.
     * @param {*} trace - The trace to insert.
     * @param {*} strokeState - The stroke state to associate with the trace.
     */
    insertTraceAndStrokeState(trace, strokeState=null){
        dom.canvas.injectTrace(trace);
        if(strokeState){
            this.strokeState = strokeState;
        }
    }
    
}

export default new State();