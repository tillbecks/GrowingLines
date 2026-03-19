import { TREE_CONFIG } from "./tree.js";

function bindSliderToConfig(sliderId, valueId, configKey, conversionFunc = x=>x){
    document.getElementById(sliderId).addEventListener("input", (event)=>{
        document.getElementById(valueId).textContent = event.target.value;
        TREE_CONFIG[configKey] = conversionFunc(parseFloat(event.target.value));
    });
}

function bindButtonToSlider(buttonId, sliderId, increment=1){
    document.getElementById(buttonId).addEventListener("click", ()=>{
        const slider = document.getElementById(sliderId);
        slider.value = parseFloat(slider.value) + slider.step*increment;
        slider.dispatchEvent(new Event('input'));
    });
}

bindSliderToConfig('initThicknessSlider', 'initThicknessValue', 'initThickness');
bindSliderToConfig('growthRateSlider', 'growthRateValue', 'growthRate');
bindSliderToConfig('maxThicknessSlider', 'maxThicknessValue', 'maxThickness');
bindSliderToConfig('maxAgeSlider', 'maxAgeValue', 'maxAge');
bindSliderToConfig('sproutingRateSlider', 'sproutingRateValue', 'sproutingRate');
bindSliderToConfig('sproutingLengthSlider', 'sproutingLengthValue', 'sproutingLength');
bindSliderToConfig('sproutingGrowProbSlider', 'sproutingGrowProbValue', 'sproutingGrowProb');
bindSliderToConfig('influenceVectorSlider', 'influenceVectorValue', 'influenceVectorInfluence');
bindSliderToConfig('maxRandomRotationTipSlider', 'maxRandomRotationTipValue', 'maxRandomRotationTip', x=>x*Math.PI/180);
bindSliderToConfig('breakingOffProbSlider', 'breakingOffProbValue', 'breakingOffProb');
bindSliderToConfig('awayFromCOMInfluenceSlider', 'awayFromCOMInfluenceValue', 'awayFromCOMInfluence');
bindSliderToConfig('cripplingMinDistSlider', 'cripplingMinDistValue', 'cripplingMinDist');
bindSliderToConfig('cripplingFactorSlider', 'cripplingFactorValue', 'cripplingFactor');
bindSliderToConfig('minSproutingAgeSlider', 'minSproutingAgeValue', 'minSproutingAge');

bindButtonToSlider('initThicknessDecrButton', 'initThicknessSlider', -1);
bindButtonToSlider('initThicknessIncrButton', 'initThicknessSlider', 1);
bindButtonToSlider('growthRateDecrButton', 'growthRateSlider', -1);
bindButtonToSlider('growthRateIncrButton', 'growthRateSlider', 1);
bindButtonToSlider('maxThicknessDecrButton', 'maxThicknessSlider', -1);
bindButtonToSlider('maxThicknessIncrButton', 'maxThicknessSlider', 1);
bindButtonToSlider('maxAgeDecrButton', 'maxAgeSlider', -1);
bindButtonToSlider('maxAgeIncrButton', 'maxAgeSlider', 1);
bindButtonToSlider('sproutingRateDecrButton', 'sproutingRateSlider', -1);
bindButtonToSlider('sproutingRateIncrButton', 'sproutingRateSlider', 1);
bindButtonToSlider('sproutingLengthDecrButton', 'sproutingLengthSlider', -1);
bindButtonToSlider('sproutingLengthIncrButton', 'sproutingLengthSlider', 1);
bindButtonToSlider('sproutingGrowProbDecrButton', 'sproutingGrowProbSlider', -1);
bindButtonToSlider('sproutingGrowProbIncrButton', 'sproutingGrowProbSlider', 1);
bindButtonToSlider('influenceVectorDecrButton', 'influenceVectorSlider', -1);
bindButtonToSlider('influenceVectorIncrButton', 'influenceVectorSlider', 1);
bindButtonToSlider('maxRandomRotationTipDecrButton', 'maxRandomRotationTipSlider', -1);
bindButtonToSlider('maxRandomRotationTipIncrButton', 'maxRandomRotationTipSlider', 1);
bindButtonToSlider('breakingOffProbDecrButton', 'breakingOffProbSlider', -1);
bindButtonToSlider('breakingOffProbIncrButton', 'breakingOffProbSlider', 1);
bindButtonToSlider('awayFromCOMInfluenceDecrButton', 'awayFromCOMInfluenceSlider', -1);
bindButtonToSlider('awayFromCOMInfluenceIncrButton', 'awayFromCOMInfluenceSlider', 1);
bindButtonToSlider('cripplingMinDistDecrButton', 'cripplingMinDistSlider', -1);
bindButtonToSlider('cripplingMinDistIncrButton', 'cripplingMinDistSlider', 1);
bindButtonToSlider('cripplingFactorDecrButton', 'cripplingFactorSlider', -1);
bindButtonToSlider('cripplingFactorIncrButton', 'cripplingFactorSlider', 1);
bindButtonToSlider('minSproutingAgeDecrButton', 'minSproutingAgeSlider', -1);
bindButtonToSlider('minSproutingAgeIncrButton', 'minSproutingAgeSlider', 1);