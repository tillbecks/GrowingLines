<!DOCTYPE html>
<html>
    <head>
        <title>Growth Project</title>
        <link rel="stylesheet" href="assets/css/style.css">
        <link rel="icon" type="image/x-icon" href="./assets/img/icon.png">
    </head>
    <body>
        <input id="printConfigButton" value="Print Config" autocomplete="off" class="button" style="position: fixed; top: 0; left: 0; z-index: 1;">
        <div style="height: 100%; width: min(2000px, 100%); display:flex; flex-direction: column; gap: 20px; padding: 20px; min-height: 0;">
            <div style="flex: 0 2 20%; display:flex; justify-content: center; align-items: center; overflow: hidden; min-height: 0;">
                <img id="growLogo" src="assets/img/GrowLogo.png" alt="Grow Logo" style="max-height: 100%; min-height: 0; cursor: pointer;">
            </div>
            <div style="flex: 1 1 auto; min-height: 0; min-width: 0; max-width: 100%;display:flex; gap: 20px; align-items: center; justify-content: center;">
                <div style="width: 100%; height: 100%; max-height: 820px; display:flex; gap: 20px; align-items: flex-start; border: 2px solid">
                    <div id="canvasSection"style="flex: 1 1 60%; box-sizing: border-box; height: 100%; max-height: 100%; max-width: 60%; min-width: 0; min-height: 0; display:flex; flex-direction:column; gap: 20px; padding: 10px; justify-content: flex-start; align-items: flex-end; position: relative;">
                        <div id="canvasScrollContainer" style="flex: 1 1 auto; min-height: 0; min-width: 0; height:610px; overflow: auto; width: 100%; max-width: 805px; box-sizing: border-box; ">
                            <div id = "canvasContainer" style="width: fit-ccontent; min-height: fit-content; height: fit-content; min-width: fit-content; display:flex; justify-content: center; align-items: center;">
                                <canvas id="canvas" width="800" height="600" ></canvas>
                            </div>
                        </div>
                        <div style="flex: 0 0 auto; display:flex; gap: 2px; justify-content: space-between; align-items: center; max-width: 805px; box-sizing: border-box; width: 100%;">
                            <div style="display:flex; gap: 2px; overflow:auto; min-width: 0;">
                                <input id="editModeButton" type="button" value="Edit Mode" autocomplete="off" class="button" style=" width: 250px; ">
                                <input id="startPointButton" type="button" value="⦿" autocomplete="off" class="button" style="color: red; visibility: hidden;" title="Click to set new Start Points">
                                <input id="joinPointButton" type="button" value="⦿" autocomplete="off" class="button" style="color: blue; visibility: hidden;" title="Click to join Lines">
                            </div>
                            <div style="flex-shrink: 0; overflow:auto;">
                                <input id="downloadButton" type="button" value="⭳" autocomplete="off" class="button" title="Download canvas as PNG">
                            </div>
                        </div>
                    </div>
                    <div style="flex: 1 1 40%; max-width: 40%; width: fit-content; min-width: 0; min-height: 0; max-height: 100%; height: 100%; display:flex; flex-direction:column; gap: 20px; padding: 10px; ">
                        <p style="text-decoration: underline; color: white; font-size: 1.5em;">Controls</p>
                        <div style="flex: 0 0 auto; display:grid; grid-template-columns: repeat(2, auto); gap: 20px; justify-content: flex-start; padding: 10px; box-sizing: border-box; ">
                            <input id="resetButton" type="button" value="Reset" autocomplete="off" class="button">
                            <input id="growButton" type="button" value="Grow" autocomplete="off" class="button">
                            <input id="resetGrow" type="button" value="ResetGrow"  autocomplete="off" class="button">
                            <input id="stopGrow" type="button" value="▶" autocomplete="off" disabled="true" class="button">
                        </div>
                        <p style="text-decoration: underline; color: white; font-size: 1.5em;">Presets</p>
                        <div style="flex: 0 0 auto; display:grid; grid-template-columns: repeat(2, auto); gap: 20px; justify-content: flex-start; padding: 10px; box-sizing: border-box; ">
                            <select name="treeConfig" id="presetSelector">
                                <!-- Options will be populated by JavaScript -->
                            </select>
                            <input id="loadPreset" type="button" value="Load Preset" autocomplete="off" class="button">
                        </div>
                        <p id="advancedSettingsToggle" style="text-decoration: underline; color: white; font-size: 1.5em; cursor: pointer;">Advanced Settings <span style="text-decoration: none; display: inline;" id="settingsArrow">⌄</span></p>
                        <div id="advancedSettingsContainer" class="slider-container" style="flex: 1 1 auto; display:none; flex-direction:column; gap: 20px; min-width: 0; min-height: 0; max-width: 100%; overflow-x: auto; overflow-y: auto; width: fit-content; padding: 10px; box-sizing: border-box; justify-items: flex-start;">
                            <h1 style="font-size: 1.5em;">Basic-Settings</h1>
                            <div style="display:grid; grid-template-columns: repeat(5, auto); gap: 20px; justify-content: flex-start; align-items: center; width: 100%;">
                                <p class="slider-label" title="Click to get more information">Initial Thickness</p>
                                <input id="initThicknessDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                                <input id="initThicknessSlider" type = "range" min = "1" max = "10" value = "1" class = "slider" step = "1" autocomplete="off">
                                <input id="initThicknessIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                                <span id="initThicknessValue" class="font-bold">1</span>

                                <p class="slider-label" title="Click to get more information">Thickness Grow Rate</p>
                                <input id="growthRateDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                                <input id="growthRateSlider" type = "range" min = "0" max = "1" value = "0.05" class = "slider" step = "0.01" autocomplete="off">
                                <input id="growthRateIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                                <span id="growthRateValue" class="font-bold">0.05</span>

                                <p class="slider-label" title="Click to get more information">Maximum Thickness</p>
                                <input id="maxThicknessDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                                <input id="maxThicknessSlider" type = "range" min = "1" max = "30" value = "5" class = "slider" step = "1" autocomplete="off">
                                <input id="maxThicknessIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                                <span id="maxThicknessValue" class="font-bold">5</span>

                                <p class="slider-label" title="Click to get more information">Maximum Age</p>
                                <input id="maxAgeDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                                <input id="maxAgeSlider" type = "range" min = "1" max = "1000" value = "150" class = "slider" step = "1" autocomplete="off">
                                <input id="maxAgeIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                                <span id="maxAgeValue" class="font-bold">150</span>
                            </div>
                            
                            <h1 style="font-size: 1.5em;">Sprouting-Settings</h1>
                            <div style="display:grid; grid-template-columns: repeat(5, auto); gap: 20px; justify-content: flex-start; align-items: center; width: 100%;">
                                <p class="slider-label" title="Click to get more information">Minimum Sprouting Age</p>
                                <input id="minSproutingAgeDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                                <input id="minSproutingAgeSlider" type = "range" min = "0" max = "1000" value = "25" class = "slider" step = "1" autocomplete="off">
                                <input id="minSproutingAgeIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                                <span id="minSproutingAgeValue" class="font-bold">25</span>

                                <p class="slider-label" title="Click to get more information">Tip Sprouting Probability</p>
                                <input id="sproutingGrowProbDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                                <input id="sproutingGrowProbSlider" type = "range" min = "0" max = "1" value = "0.2" class = "slider" step = "0.01" autocomplete="off">
                                <input id="sproutingGrowProbIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                                <span id="sproutingGrowProbValue" class="font-bold">0.2</span>

                                <p class="slider-label" title="Click to get more information">Synchronize Lateral Sprouting Probabilities</p>
                                <input id="syncSproutingRateCheck" type ="checkbox" autocomplete="off" value="syncSr" checked="true">
                                <div></div>
                                <div></div>
                                <div></div>

                                <p class="slider-label" title="Click to get more information">Lateral Main Sprouting Probability</p>
                                <input id="mainSproutingRateDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                                <input id="mainSproutingRateSlider" type = "range" min = "0" max = "0.05" value = "0.002" class = "slider" step = "0.0001" autocomplete="off">
                                <input id="mainSproutingRateIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                                <span id="mainSproutingRateValue" class="font-bold">0.002</span>

                                <p class="slider-label" title="Click to get more information">Lateral Secondary Sprouting Probability</p>
                                <input id="sproutingRateDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                                <input id="sproutingRateSlider" type = "range" min = "0" max = "0.05" value = "0.002" class = "slider" step = "0.0001" autocomplete="off">
                                <input id="sproutingRateIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                                <span id="sproutingRateValue" class="font-bold">0.002</span>

                                <p class="slider-label" title="Click to get more information">Sprout Length</p>
                                <input id="sproutingLengthDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                                <input id="sproutingLengthSlider" type = "range" min = "1" max = "20" value = "5" class = "slider" step = "1" autocomplete="off">
                                <input id="sproutingLengthIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                                <span id="sproutingLengthValue" class="font-bold">5</span>

                                <p class="slider-label" title="Click to get more information">Breaking Off Probability</p>
                                <input id="breakingOffProbDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                                <input id="breakingOffProbSlider" type = "range" min = "0" max = "0.01" value = "0.0010" class = "slider" step = "0.0001" autocomplete="off">
                                <input id="breakingOffProbIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                                <span id="breakingOffProbValue" class="font-bold">0.001</span>
                            </div>

                            <h1 style="font-size: 1.5em;">Sprouting-Direction-Settings</h1>
                            <div style="display:grid; grid-template-columns: repeat(5, auto); gap: 20px; justify-content: flex-start; align-items: center; width: 100%;">
                                <p class="slider-label" title="Click to get more information">Standard Lateral Sprouting Angle</p>
                                <input id="standardSproutAngleDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                                <input id="standardSproutAngleSlider" type = "range" min = "0" max = "180" value = "90" class = "slider" step = "1" autocomplete="off">
                                <input id="standardSproutAngleIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                                <span id="standardSproutAngleValue" class="font-bold">90</span>

                                <p class="slider-label" title="Click to get more information">Maximum Random Angle Offset</p>
                                <input id="maxRandomRotationTipDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                                <input id="maxRandomRotationTipSlider" type = "range" min = "0" max = "90" value = "18" class = "slider" step = "1" autocomplete="off">
                                <input id="maxRandomRotationTipIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                                <span id="maxRandomRotationTipValue" class="font-bold">18</span>

                                <p class="slider-label" title="Click to get more information">Away From COM Influence</p>
                                <input id="awayFromCOMInfluenceDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                                <input id="awayFromCOMInfluenceSlider" type = "range" min = "0" max = "2" value = "0.5" class = "slider" step = "0.01" autocomplete="off">
                                <input id="awayFromCOMInfluenceIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                                <span id="awayFromCOMInfluenceValue" class="font-bold">0.5</span>

                                <p class="slider-label" title="Click to get more information">Ancestor Direction Influence</p>
                                <input id="influenceVectorDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                                <input id="influenceVectorSlider" type = "range" min = "0" max = "2" value = "0" class = "slider" step = "0.01" autocomplete="off">
                                <input id="influenceVectorIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                                <span id="influenceVectorValue" class="font-bold">0</span>
                            </div>

                            <h1 style="font-size: 1.5em;">Extra-Settings</h1>
                            <div style="display:grid; grid-template-columns: repeat(5, auto); gap: 20px; justify-content: flex-start; align-items: center; width: 100%;">
                                <p class="slider-label" title="Click to get more information">Crowding Minimum Distance</p>
                                <input id="crowdingMinDistDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                                <input id="crowdingMinDistSlider" type = "range" min = "0" max = "200" value = "30" class = "slider" step = "1" autocomplete="off">
                                <input id="crowdingMinDistIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                                <span id="crowdingMinDistValue" class="font-bold">30</span>

                                <p class="slider-label" title="Click to get more information">Crowding Factor</p>
                                <input id="crowdingFactorDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                                <input id="crowdingFactorSlider" type = "range" min = "0" max = "1" value = "0.9" class = "slider" step = "0.01" autocomplete="off">
                                <input id="crowdingFactorIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                                <span id="crowdingFactorValue" class="font-bold">0.9</span>
                            </div>
                        </div>
                    </div>
                        
                </div>
            </div>
            <div style="flex: 0 0 auto; max-height: 20%; display:flex; justify-content: center; align-items: center; overflow: hidden; min-height: 0; color: white; width: 100%;">
                <div style="border: 2px solid white; padding: 10px; height: auto; max-height: 100%; min-height: 0; overflow: auto; width: 100%; position:relative;">
                    <input id="infoBoxHideButton" type="button" value="hide InfoBox" autocomplete="off" class="button" style="position: absolute; top: 10px; right: 10px; z-index: 1;">
                    <div id="infoBoxContent" style="display:flex; flex-direction: column; gap: 10px; justify-content: flex-start; align-items: center; width: 100%; height: fit-content; min-height: 0; max-height: 100%;">
                        <h1 id = "infoBoxTitle" style="font-size: 1.5em; text-align: left; width: 100%;">Information</h1>
                        <div id="infoBox" style="display:flex; gap: 10px; width: 100%; align-items: flex-start;">
                            <p id="infoBoxText" style="font-size: 1.2em; font-weight: bold; flex: 1 1 auto;">Click on the logo or any label to get more information on it.</p>
                            <div id="infoBoxImageContainer" style="display:flex; flex-direction: column; gap: 10px; justify-content: center; align-items: center; flex: 0 0 10%; height: fit-content; min-width: 0;">
                            </div>
                        </div>
                    </div>
                </div>                
            </div>
        </div>

        <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
        <script type="text/javascript" src="assets/js/libs/handwriting.js/handwriting.canvas.js"></script>
        <script type="module" src="assets/js/main.js"></script>
        <script type="module" src="assets/js/sliderUpdates.js"></script>
        <script type="module" src="assets/js/infoBox.js"></script>
        <script type="module" src="assets/js/presetLoader.js"></script>
        <script type="module" src="assets/js/toggleAdvancedSettings.js"></script>
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