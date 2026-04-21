import * as AGECOUNTER from "./ui/ageCounter.js";
import * as SLIDERFACTORY from "./ui/sliderFactory.js";
import * as INFOBOX from "./ui/infoBox.js";
import * as PRESETLOADER from "./ui/presetLoader.js";
import * as TOGGLEADVANCEDSETTINGS from "./ui/toggleAdvancedSettings.js";
import * as APPCONFIG from "./config/appConfig.js";
import { initialDrawingData } from "./config/initDrawingData.js";
import state from "./state/state.js";
import * as BACKGROUNDCANVAS from "./ui/backgroundCanvas.js";
import * as MAINBUT from "./ui/mainButton.js";
import { bindMouseHandlers } from "./ui/mouseHandle.js";
import { resizeTraceToCanvas } from "./config/utils.js";
import dom from "./state/domState.js";

// Critical path - synchronous initialization
SLIDERFACTORY.createSliderSection();
PRESETLOADER.configurePresetSelector();
PRESETLOADER.loadDefaultPreset();
BACKGROUNDCANVAS.initCanvas();
MAINBUT.bindMainButtons();
bindMouseHandlers();

// Deferred initialization - non-critical features load after page is interactive
window.addEventListener("load", () => {
    INFOBOX.addBindingsToInfoBox();
    TOGGLEADVANCEDSETTINGS.init();
    AGECOUNTER.spawnCounter(state.treeConfig.maxAge);
    
    // If the app is configured to start with an initial drawing, load it and start the growth process immediately
    if(APPCONFIG.INITDRAWING){
        const thisCanvasSize = dom.getCanvasContainerDimensions();
        const resizedTraces = resizeTraceToCanvas(initialDrawingData.trace, APPCONFIG.CANVASSTANDWIDTH, APPCONFIG.CANVASSTANDHEIGHT, thisCanvasSize.width, thisCanvasSize.height,);
        state.insertTraceAndStrokeState(resizedTraces);
        MAINBUT.callGrow();
    }
});
