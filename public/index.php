<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Growth Project</title>
        <link rel="stylesheet" href="assets/css/style.css">
        <link rel="icon" type="image/x-icon" href="./assets/img/icon.png">
    </head>
    <body>
        <canvas id="backgroundCanvas"></canvas>
        <div class="main-container">
            <div class="flex-row flex-srink-20-fill">
                <img id="growLogo" src="assets/img/GrowLogo.png" alt="Grow Logo" class="clickable">
            </div>

            <div id="canvasSettingsContainer" class="canvas-settings-container">
                    <div id="canvasSection" class="canvas-section">
                        <div id ="canvasAgeContainer" class="canvas-age-container">
                            <div id="canvasScrollContainer" class="canvas-scroll-container">
                                <div id = "canvasContainer" class="canvas-wrapper">
                                    <canvas id="canvas" width="800" height="600" ></canvas>
                                </div>
                            </div>
                        </div>
                        <div class="canvas-buttons-section">
                            <div id="editModeButtonsContainer" class="edit-mode-buttons">
                                <input id="editModeButton" type="button" value="Edit Mode" autocomplete="off" class="button">
                                <input id="startPointButton" type="button" value="&#9679;" autocomplete="off" class="button mode-button" title="Click to set new Start Points">
                                <input id="joinPointButton" type="button" value="&#9679;" autocomplete="off" class="button mode-button" title="Click to join Lines">
                            </div>
                            <div class="flex-no-shrink-fill of-auto">
                                <input id="downloadButton" type="button" value="&#x2913;" autocomplete="off" class="button" title="Download canvas as PNG">
                            </div>
                        </div>
                    </div>
                    <div class="settings-panel">
                        <h1>Controls</h1>
                        <div class="grid-2 flex-no-shrink-fill">
                            <input id="resetButton" type="button" value="Reset" autocomplete="off" class="button">
                            <input id="growButton" type="button" value="Grow" autocomplete="off" class="button">
                            <input id="resetGrow" type="button" value="ResetGrow"  autocomplete="off" class="button">
                            <input id="stopGrow" type="button" value="&#9654;" autocomplete="off" disabled="true" class="button">
                        </div>
                        <h1>Presets</h1>
                        <div class="flex-row flex-wrap items-start justify-start">
                            <select class="presetDropdown" name="treeConfig" id="presetSelector">
                                <!-- Options will be populated by JavaScript -->
                            </select>
                            <input id="loadPreset" type="button" value="Load Preset" autocomplete="off" class="button">
                        </div>
                        <div id="advancedSettingsToggle" class="flex-row"> <h1 class="clickable">Advanced Settings</h1><span id="settingsArrow">⌄</span></div>
                        <div id="advancedSettingsContainer" class="slider-container hidden" style="">
                            <!-- Sliders will be populated by JavaScript -->
                        </div>
                    </div>
            </div>
            
            <div id="infoSection" class="info-section">
                <!--div "border: 2px solid white; padding: 10px; height: fit-content; width: fit-content; min-height: 0; overflow: auto; position:relative; color:white;-->
                <div id="infoBoxContainer" class="info-box-container">
                    <input id="infoBoxHideButton" type="button" value="hide InfoBox" autocomplete="off" class="button info-box-hide-button">
                    <div id="infoBoxContent" class="info-box-content">
                        <h1 id = "infoBoxTitle" class="info-box-title">Information</h1>
                        <div id="infoBox" class="info-box">
                            <p id="infoBoxText" class="info-box-text">Click on the logo or any label to get more information on it.</p>
                            <div id="infoBoxImageContainer" class="info-box-image-container">
                                <!-- Images with descriptions will be added here dynamically -->
                            </div>
                        </div>
                    </div>
                </div>                
            </div>
        </div>

        <script type="text/javascript" src="assets/js/libs/handwriting/handwriting.js"></script>
        <script type="text/javascript" src="assets/js/libs/handwriting/handwriting.canvas.js"></script>
        <script type="module" src="assets/js/main.js"></script>
    </body>
</html>