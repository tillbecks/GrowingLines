<!DOCTYPE html>
<html>
    <head>
        <title>Growth Project</title>
        <link rel="stylesheet" href="assets/css/style.css">
        <link rel="icon" type="image/x-icon" href="./assets/img/icon.png">
    </head>
    <body>
        <!--input id="printConfigButton" value="Print Config" autocomplete="off" class="button" style="position: fixed; top: 0; left: 0; z-index: 1;"-->
        <!--div style="height: 100%; width: min(1500px, 100%); display:flex; flex-direction: column; gap: 20px; padding: 20px; min-height: 0; ">-->
        <div class="main-container highlight-red">
            
            <div class="flex-row flex-srink-20-fill highlight-blue">
                <img id="growLogo" src="assets/img/GrowLogo.png" alt="Grow Logo" style="max-height: 100%; min-height: 0; cursor: pointer;">
            </div>

            <div class="canvas-settings-container highlight-green">
                    <div id="canvasSection" class="canvas-section">
                        <div id="canvasScrollContainer" class="canvas-scroll-container">
                            <div id = "canvasContainer" class="canvas-wrapper">
                                <canvas id="canvas" width="800" height="600" ></canvas>
                            </div>
                        </div>
                        <div class="canvas-buttons-section">
                            <div class="edit-mode-buttons">
                                <input id="editModeButton" type="button" value="Edit Mode" autocomplete="off" class="button" style=" width: 250px; ">
                                <input id="startPointButton" type="button" value="⦿" autocomplete="off" class="button" style="color: red; visibility: hidden;" title="Click to set new Start Points">
                                <input id="joinPointButton" type="button" value="⦿" autocomplete="off" class="button" style="color: blue; visibility: hidden;" title="Click to join Lines">
                            </div>
                            <div class="flex-no-shrink-fill of-auto">
                                <input id="downloadButton" type="button" value="⭳" autocomplete="off" class="button" title="Download canvas as PNG">
                            </div>
                        </div>
                    </div>
                    <div class="settings-panel">
                        <p style="text-decoration: underline; color: white; font-size: 1.5em;">Controls</p>
                        <div class="grid-2 flex-no-shrink-fill">
                            <input id="resetButton" type="button" value="Reset" autocomplete="off" class="button">
                            <input id="growButton" type="button" value="Grow" autocomplete="off" class="button">
                            <input id="resetGrow" type="button" value="ResetGrow"  autocomplete="off" class="button">
                            <input id="stopGrow" type="button" value="▶" autocomplete="off" disabled="true" class="button">
                        </div>
                        <p style="text-decoration: underline; color: white; font-size: 1.5em;">Presets</p>
                        <div class="flex-row flex-wrap items-start justify-start">
                            <select name="treeConfig" id="presetSelector">
                                <!-- Options will be populated by JavaScript -->
                            </select>
                            <input id="loadPreset" type="button" value="Load Preset" autocomplete="off" class="button">
                        </div>
                        <p id="advancedSettingsToggle" style="color: white; font-size: 1.5em; cursor: pointer;"> <span style="text-decoration: underline; ">Advanced Settings</span><span id="settingsArrow"> ⌄</span></p>
                        <div id="advancedSettingsContainer" class="slider-container" style="flex: 1 1 auto; display:none; flex-direction:column; gap: 20px; min-width: 0; min-height: 0; max-width: 100%; overflow-x: auto; overflow-y: auto; width: fit-content; padding: 10px; box-sizing: border-box; justify-items: flex-start;">
                            <!-- Sliders will be populated by JavaScript -->
                        </div>
                    </div>
            </div>
            
            <div class="info-section highlight-blue">
                <!--div "border: 2px solid white; padding: 10px; height: fit-content; width: fit-content; min-height: 0; overflow: auto; position:relative; color:white;-->
                <div id="infoBoxContainer"class="info-box-container">
                    <input id="infoBoxHideButton" type="button" value="hide InfoBox" autocomplete="off" class="button info-box-hide-button">
                    <div id="infoBoxContent" class="info-box-content">
                        <h1 id = "infoBoxTitle" class="info-box-title">Information</h1>
                        <div id="infoBox" class="info-box">
                            <p id="infoBoxText" class="info-box-text">Click on the logo or any label to get more information on it.</p>
                            <div id="infoBoxImageContainer" class="info-box-image-container">
                            </div>
                        </div>
                    </div>
                </div>                
            </div>
        </div>

        <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
        <script type="text/javascript" src="assets/js/libs/handwriting.js/handwriting.canvas.js"></script>
        <script type="module" src="assets/js/main.js"></script>
        <script type="module">
            import state from "./assets/js/state.js";
            
            document.addEventListener('DOMContentLoaded', () => {
                const printConfigButton = document.getElementById('printConfigButton');
                if (printConfigButton) {
                    printConfigButton.addEventListener('click', () => {
                        console.log("Current Config:", state.treeConfig);
                    });
                }
            });
        </script>

    </body>
</html>