<!DOCTYPE html>
<html>
    <head>
        <title>Growth Project</title>
        <link rel="stylesheet" href="assets/css/style.css">
    </head>
    <body>
        <div style="display:flex; gap: 20px; height:100%; width: 100%; align-items:center; padding: 20px;">
            <div style="flex: 0 0 50%; height: 100%; overflow: auto;">  
                <div style="min-height: fit-content; height: 100%; min-width: fit-content; width: 100%; display:flex;  justify-content: flex-end; align-items: center;">                  
                    <canvas id="canvas" width="800" height="600" ></canvas>
                    <div style="display:flex; flex-direction:column; gap: 20px; ">
                        <input id="editModeButton" type="button" value="Edit Mode" autocomplete="off" class="button" style="font-size: 24px; ">
                        <input id="startPointButton" type="button" value="⦿" autocomplete="off" class="button" style="color: red; font-size: 24px; visibility: hidden;" title="Click to set new Start Points">
                        <input id="joinPointButton" type="button" value="⦿" autocomplete="off" class="button" style="color: blue; font-size: 24px; visibility: hidden;" title="Click to join Lines">
                    </div>
                </div>  
            </div>
            <div style="flex: 50%; display:flex; flex-direction:column; gap: 20px; height: 100%; max-height: 800px; max-width: 600px; flex-shrink: 0;">
                <div class="" style="display:grid; grid-template-columns: repeat(2, auto); gap: 20px; justify-content: center; flex-shrink: 0;">
                    <input id="resetButton" type="button" value="Reset" autocomplete="off" class="button">
                    <input id="growButton" type="button" value="Grow" autocomplete="off" class="button">
                    <input id="resetGrow" type="button" value="ResetGrow"  autocomplete="off" class="button">
                    <input id="stopGrow" type="button" value="⏸" autocomplete="off" class="button">
                </div>
                <div class="slider-container" style="display:flex; flex-direction:column; gap: 20px; flex: 1; overflow-y: auto; gap:20px; min-width: 400px; min-height: 30px;">
                    <h1 style="font-size: 1.5em;">Basic-Settings</h1>
                    <div style="display:grid; grid-template-columns: repeat(5, auto); gap: 20px; justify-content: center; width: 100%;">
                        <label for="initThicknessSlider" class="slider-label" title="Click to get more information">Initial Thickness</label>
                        <input id="initThicknessDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                        <input id="initThicknessSlider" type = "range" min = "1" max = "10" value = "1" class = "slider" step = "1" autocomplete="off">
                        <input id="initThicknessIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                        <span id="initThicknessValue" class="font-bold">1</span>

                        <label for="growthRateSlider" class="slider-label" title="Click to get more information">Growth Rate</label>
                        <input id="growthRateDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                        <input id="growthRateSlider" type = "range" min = "0.1" max = "5" value = "0.2" class = "slider" step = "0.1" autocomplete="off">
                        <input id="growthRateIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                        <span id="growthRateValue" class="font-bold">0.2</span>

                        <label for="maxThicknessSlider" class="slider-label" title="Click to get more information">Max Thickness</label>
                        <input id="maxThicknessDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                        <input id="maxThicknessSlider" type = "range" min = "1" max = "30" value = "20" class = "slider" step = "1" autocomplete="off">
                        <input id="maxThicknessIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                        <span id="maxThicknessValue" class="font-bold">20</span>

                        <label for="maxAgeSlider" class="slider-label" title="Click to get more information">Max Age</label>
                        <input id="maxAgeDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                        <input id="maxAgeSlider" type = "range" min = "10" max = "1000" value = "70" class = "slider" step = "1" autocomplete="off">
                        <input id="maxAgeIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                        <span id="maxAgeValue" class="font-bold">70</span>
                    </div>
                    
                    <h1 style="font-size: 1.5em;">Sprouting-Settings</h1>
                    <div style="display:grid; grid-template-columns: repeat(5, auto); gap: 20px; justify-content: center; width: 100%;">
                        <label for="minSproutingAgeSlider" class="slider-label" title="Click to get more information">Min Sprouting Age</label>
                        <input id="minSproutingAgeDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                        <input id="minSproutingAgeSlider" type = "range" min = "0" max = "1000" value = "5" class = "slider" step = "1" autocomplete="off">
                        <input id="minSproutingAgeIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                        <span id="minSproutingAgeValue" class="font-bold">5</span>

                        <label for="sproutingRateSlider" class="slider-label" title="Click to get more information">Sprouting Rate</label>
                        <input id="sproutingRateDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                        <input id="sproutingRateSlider" type = "range" min = "0" max = "0.05" value = "0.005" class = "slider" step = "0.0001" autocomplete="off">
                        <input id="sproutingRateIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                        <span id="sproutingRateValue" class="font-bold">0.005</span>

                        <label for="sproutingLengthSlider" class="slider-label" title="Click to get more information">Sprouting Length</label>
                        <input id="sproutingLengthDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                        <input id="sproutingLengthSlider" type = "range" min = "1" max = "20" value = "4" class = "slider" step = "1" autocomplete="off">
                        <input id="sproutingLengthIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                        <span id="sproutingLengthValue" class="font-bold">4</span>

                        <label for="sproutingGrowProbSlider" class="slider-label" title="Click to get more information">Sprouting Growth Probability</label>
                        <input id="sproutingGrowProbDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                        <input id="sproutingGrowProbSlider" type = "range" min = "0" max = "1" value = "0.5" class = "slider" step = "0.01" autocomplete="off">
                        <input id="sproutingGrowProbIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                        <span id="sproutingGrowProbValue" class="font-bold">0.5</span>

                        <label for="breakingOffProbSlider" class="slider-label" title="Click to get more information">Breaking Off Probability</label>
                        <input id="breakingOffProbDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                        <input id="breakingOffProbSlider" type = "range" min = "0" max = "0.1" value = "0.0001" class = "slider" step = "0.0001" autocomplete="off">
                        <input id="breakingOffProbIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                        <span id="breakingOffProbValue" class="font-bold">0.0001</span>
                    </div>

                    <h1 style="font-size: 1.5em;">Sprouting-Direction-Settings</h1>
                    <div style="display:grid; grid-template-columns: repeat(5, auto); gap: 20px; justify-content: center; width: 100%;">
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
                        <input id="influenceVectorSlider" type = "range" min = "0" max = "2" value = "0.2" class = "slider" step = "0.01" autocomplete="off">
                        <input id="influenceVectorIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                        <span id="influenceVectorValue" class="font-bold">0.2</span>
                    </div>

                    <h1 style="font-size: 1.5em;">Extra-Settings</h1>
                    <div style="display:grid; grid-template-columns: repeat(5, auto); gap: 20px; justify-content: center; width: 100%;">
                        <label for="cripplingMinDistSlider" class="slider-label" title="Click to get more information">Crippling Min Dist</label>
                        <input id="cripplingMinDistDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                        <input id="cripplingMinDistSlider" type = "range" min = "0" max = "200" value = "20" class = "slider" step = "1" autocomplete="off">
                        <input id="cripplingMinDistIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                        <span id="cripplingMinDistValue" class="font-bold">20</span>

                        <label for="cripplingFactorSlider" class="slider-label" title="Click to get more information">Crippling Factor</label>
                        <input id="cripplingFactorDecrButton" type="button" class="button font-bold" value="🢐" autocomplete="off">
                        <input id="cripplingFactorSlider" type = "range" min = "0" max = "1" value = "0.2" class = "slider" step = "0.01" autocomplete="off">
                        <input id="cripplingFactorIncrButton" type="button" class="button font-bold" value="🢒" autocomplete="off">
                        <span id="cripplingFactorValue" class="font-bold">0.2</span>
                    </div>
                </div>
            </div>
                
        </div>
        <!--
        <div id="element_c">
            <canvas id="copyCanvas" width="800" height="600"></canvas>
        </div>
        -->

        <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
        <script type="text/javascript" src="assets/js/libs/handwriting.js/handwriting.canvas.js"></script>
        <script type="module" src="assets/js/main.js"></script>
        <script type="module" src="assets/js/sliderUpdates.js"></script>

    </body>
</html>