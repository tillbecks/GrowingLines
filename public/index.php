<!DOCTYPE html>
<html>
    <head>
        <title>Growth Project</title>
        <link rel="stylesheet" href="assets/css/style.css">
    </head>
    <body>
        <div style="height: 100%; width: min(2000px, 100%); display:flex; flex-direction: column; gap: 20px; padding: 20px; min-height: 0;">
            <div style="flex: 0 2 20%; display:flex; justify-content: center; align-items: center; overflow: hidden; min-height: 0;">
                <img src="assets/img/GrowLogo.png" alt="Grow Logo" style="max-height: 100%; min-height: 0;">
            </div>
            <div style="flex: 1 1 auto; min-height: 0; min-width: 0; max-width: 100%;display:flex; gap: 20px; align-items: center; justify-content: center;">
                <div style="width: 100%; height: 100%; max-height: 820px; display:flex; gap: 20px; align-items: flex-start; border: 2px solid">
                    <div style="flex: 1 1 50%; box-sizing: border-box; height: 100%; max-height: 100%; max-width: 50%; min-width: 0; min-height: 0; display:flex; flex-direction:column; gap: 20px; padding: 10px; justify-content: flex-start; align-items: flex-end;">
                        <div style="flex: 1 1 auto; min-height: 0; min-width: 0; max-height: 605px; overflow: auto; width: 100%; max-width: 805px; box-sizing: border-box; ">
                            <div style="width: 100%; min-height: fit-content; height: fit-content; min-width: fit-content; display:flex; justify-content: center; align-items: center;">
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
                    <div style="flex: 1 1 50%; max-width: 50%; width: fit-content; min-width: 0; min-height: 0; max-height: 100%; height: 100%; display:flex; flex-direction:column; gap: 20px; padding: 10px; ">
                        <div style="flex: 0 0 auto; display:grid; grid-template-columns: repeat(2, auto); gap: 20px; justify-content: flex-start; padding: 10px; box-sizing: border-box; ">
                            <input id="resetButton" type="button" value="Reset" autocomplete="off" class="button">
                            <input id="growButton" type="button" value="Grow" autocomplete="off" class="button">
                            <input id="resetGrow" type="button" value="ResetGrow"  autocomplete="off" class="button">
                            <input id="stopGrow" type="button" value="▶" autocomplete="off" disabled="true" class="button">
                        </div>
                        <div class="slider-container" style="flex: 1 1 auto; display:flex; flex-direction:column; gap: 20px; min-width: 0; min-height: 0; max-width: 100%; overflow-x: auto; overflow-y: auto; width: fit-content; padding: 10px; box-sizing: border-box; justify-items: flex-start;">
                            <h1 style="font-size: 1.5em;">Basic-Settings</h1>
                            <div style="display:grid; grid-template-columns: repeat(5, auto); gap: 20px; justify-content: flex-start; width: 100%;">
                                <label for="initThicknessSlider" class="slider-label" title="Click to get more information">Initial Thickness</label>
                                <input id="initThicknessDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                                <input id="initThicknessSlider" type = "range" min = "1" max = "10" value = "1" class = "slider" step = "1" autocomplete="off">
                                <input id="initThicknessIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                                <span id="initThicknessValue" class="font-bold">1</span>

                                <label for="growthRateSlider" class="slider-label" title="Click to get more information">Growth Rate</label>
                                <input id="growthRateDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                                <input id="growthRateSlider" type = "range" min = "0.01" max = "1" value = "0.05" class = "slider" step = "0.01" autocomplete="off">
                                <input id="growthRateIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                                <span id="growthRateValue" class="font-bold">0.05</span>

                                <label for="maxThicknessSlider" class="slider-label" title="Click to get more information">Max Thickness</label>
                                <input id="maxThicknessDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                                <input id="maxThicknessSlider" type = "range" min = "1" max = "30" value = "5" class = "slider" step = "1" autocomplete="off">
                                <input id="maxThicknessIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                                <span id="maxThicknessValue" class="font-bold">5</span>

                                <label for="maxAgeSlider" class="slider-label" title="Click to get more information">Max Age</label>
                                <input id="maxAgeDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                                <input id="maxAgeSlider" type = "range" min = "10" max = "1000" value = "150" class = "slider" step = "1" autocomplete="off">
                                <input id="maxAgeIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                                <span id="maxAgeValue" class="font-bold">150</span>
                            </div>
                            
                            <h1 style="font-size: 1.5em;">Sprouting-Settings</h1>
                            <div style="display:grid; grid-template-columns: repeat(5, auto); gap: 20px; justify-content: flex-start; width: 100%;">
                                <label for="minSproutingAgeSlider" class="slider-label" title="Click to get more information">Min Sprouting Age</label>
                                <input id="minSproutingAgeDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                                <input id="minSproutingAgeSlider" type = "range" min = "0" max = "1000" value = "25" class = "slider" step = "1" autocomplete="off">
                                <input id="minSproutingAgeIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                                <span id="minSproutingAgeValue" class="font-bold">25</span>

                                <label for="sproutingRateSlider" class="slider-label" title="Click to get more information">Sprouting Rate</label>
                                <input id="sproutingRateDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                                <input id="sproutingRateSlider" type = "range" min = "0" max = "0.05" value = "0.002" class = "slider" step = "0.0001" autocomplete="off">
                                <input id="sproutingRateIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                                <span id="sproutingRateValue" class="font-bold">0.002</span>

                                <label for="sproutingLengthSlider" class="slider-label" title="Click to get more information">Sprouting Length</label>
                                <input id="sproutingLengthDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                                <input id="sproutingLengthSlider" type = "range" min = "1" max = "20" value = "5" class = "slider" step = "1" autocomplete="off">
                                <input id="sproutingLengthIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                                <span id="sproutingLengthValue" class="font-bold">5</span>

                                <label for="sproutingGrowProbSlider" class="slider-label" title="Click to get more information">Sprouting Growth Probability</label>
                                <input id="sproutingGrowProbDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                                <input id="sproutingGrowProbSlider" type = "range" min = "0" max = "1" value = "0.2" class = "slider" step = "0.01" autocomplete="off">
                                <input id="sproutingGrowProbIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                                <span id="sproutingGrowProbValue" class="font-bold">0.2</span>

                                <label for="breakingOffProbSlider" class="slider-label" title="Click to get more information">Breaking Off Probability</label>
                                <input id="breakingOffProbDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                                <input id="breakingOffProbSlider" type = "range" min = "0" max = "0.1" value = "0.001" class = "slider" step = "0.0001" autocomplete="off">
                                <input id="breakingOffProbIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                                <span id="breakingOffProbValue" class="font-bold">0.001</span>
                            </div>

                            <h1 style="font-size: 1.5em;">Sprouting-Direction-Settings</h1>
                            <div style="display:grid; grid-template-columns: repeat(5, auto); gap: 20px; justify-content: flex-start; width: 100%;">
                                <label for="maxRandomRotationTipSlider" class="slider-label" title="Click to get more information">Max Random Rotation Tip</label>
                                <input id="maxRandomRotationTipDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                                <input id="maxRandomRotationTipSlider" type = "range" min = "0" max = "90" value = "18" class = "slider" step = "1" autocomplete="off">
                                <input id="maxRandomRotationTipIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                                <span id="maxRandomRotationTipValue" class="font-bold">18</span>

                                <label for="awayFromCOMInfluenceSlider" class="slider-label" title="Click to get more information">Away From COM Influence</label>
                                <input id="awayFromCOMInfluenceDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                                <input id="awayFromCOMInfluenceSlider" type = "range" min = "0" max = "2" value = "0.5" class = "slider" step = "0.01" autocomplete="off">
                                <input id="awayFromCOMInfluenceIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                                <span id="awayFromCOMInfluenceValue" class="font-bold">0.5</span>

                                <label for="influenceVectorSlider" class="slider-label" title="Click to get more information">Influence Vector Strength</label>
                                <input id="influenceVectorDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                                <input id="influenceVectorSlider" type = "range" min = "0" max = "2" value = "0" class = "slider" step = "0.01" autocomplete="off">
                                <input id="influenceVectorIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                                <span id="influenceVectorValue" class="font-bold">0</span>

                                <label for="standardSproutAngleSlider" class="slider-label" title="Click to get more information">Standard Sprout Angle</label>
                                <input id="standardSproutAngleDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                                <input id="standardSproutAngleSlider" type = "range" min = "0" max = "180" value = "90" class = "slider" step = "1" autocomplete="off">
                                <input id="standardSproutAngleIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                                <span id="standardSproutAngleValue" class="font-bold">90</span>
                            </div>

                            <h1 style="font-size: 1.5em;">Extra-Settings</h1>
                            <div style="display:grid; grid-template-columns: repeat(5, auto); gap: 20px; justify-content: flex-start; width: 100%;">
                                <label for="crowdingMinDistSlider" class="slider-label" title="Click to get more information">Crowding Min Dist</label>
                                <input id="crowdingMinDistDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                                <input id="crowdingMinDistSlider" type = "range" min = "0" max = "200" value = "30" class = "slider" step = "1" autocomplete="off">
                                <input id="crowdingMinDistIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                                <span id="crowdingMinDistValue" class="font-bold">30</span>

                                <label for="crowdingFactorSlider" class="slider-label" title="Click to get more information">Crowding Factor</label>
                                <input id="crowdingFactorDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                                <input id="crowdingFactorSlider" type = "range" min = "0" max = "1" value = "0.9" class = "slider" step = "0.01" autocomplete="off">
                                <input id="crowdingFactorIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                                <span id="crowdingFactorValue" class="font-bold">0.9</span>
                            </div>
                        </div>
                    </div>
                        
                </div>
            </div>
            <div style="flex: 0 1 20%; display:flex; justify-content: center; align-items: center; overflow: hidden; min-height: 0;">
                <div style="border: 2px solid white; padding: 10px; height: 100%; max-height: 100%; min-height: 0; overflow: auto; width: 100%; ">
                    HIER STEHT EIN TEST TETETETETETTE 
                </div>                
            </div>
        </div>

        <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
        <script type="text/javascript" src="assets/js/libs/handwriting.js/handwriting.canvas.js"></script>
        <script type="module" src="assets/js/main.js"></script>
        <script type="module" src="assets/js/sliderUpdates.js"></script>

    </body>
</html>