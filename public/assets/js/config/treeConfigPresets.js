//Die Configs sollten dann alle diese Variablen beinhalten mit einem gesetzten Wert

const defaultConfig = {
    name: "Default Config",

    initThickness: 1,
    growRate: 0.05,
    maxThickness: 5,
    maxAge: 150,

    mainSproutingRate: 0.002,
    secondarySproutingRate: 0.002,
    sproutingLength: 5,
    sproutingGrowProb: 0.2,

    influenceVectorInfluence: 0,
    maxRandomRotationTip: 0.1 * Math.PI,
    standardSproutAngle: 0.5 * Math.PI,

    breakingOffProb: 0.0,

    awayFromCOMInfluence: 0.5,

    crowdingMinDist: 30,
    crowdingFactor: 0.90,

    minSproutingAge: 25,
};

const fishBone = {
    name: "Fish Bones",
    awayFromCOMInfluence: 0.52,
    breakingOffProb: 0,
    crowdingFactor: 0.9,    
    crowdingMinDist: 30,
    growRate: 0.04,
    influenceVectorInfluence: 0.25,
    initThickness: 1,
    mainSproutingRate: 0.0003,
    maxAge: 609,
    maxRandomRotationTip: 0,
    maxThickness: 7,
    minSproutingAge: 100,
    secondarySproutingRate: 0.0031,
    sproutingGrowProb: 0.05,
    sproutingLength: 20,
    standardSproutAngle: 2.251474735072685
};

const humongousTree = {
    name: "Humongous Tree",
    awayFromCOMInfluence: 0.12,
    breakingOffProb: 0,
    crowdingFactor: 0.9,
    crowdingMinDist: 30,
    growRate: 0.19,
    influenceVectorInfluence: 0,
    initThickness: 1,
    mainSproutingRate: 0.002,
    maxAge: 193,
    maxRandomRotationTip: 0.3141592653589793,
    maxThickness: 25,
    minSproutingAge: 25,
    secondarySproutingRate: 0.002,
    sproutingGrowProb: 0.28,
    sproutingLength: 5,
    standardSproutAngle: 1.5707963267948966,
}

const lightning = {
    name: "Lightning",
    awayFromCOMInfluence: 0.5,
    breakingOffProb: 0,
    crowdingFactor: 0.9,
    crowdingMinDist: 30,
    growRate: 0.05,
    influenceVectorInfluence: 0.95,
    initThickness: 1,
    mainSproutingRate: 0.0003,
    maxAge: 339,
    maxRandomRotationTip: 1.2566370614359172,
    maxThickness: 10,
    minSproutingAge: 25,
    secondarySproutingRate: 0.0013,
    sproutingGrowProb: 0.21,
    sproutingLength: 10,
    standardSproutAngle: 3.141592653589793
}

const cityMap = {
    name: "City Map",
    awayFromCOMInfluence: 0,
    breakingOffProb: 0.003,
    crowdingFactor: 0.9,
    crowdingMinDist: 30,
    growRate: 0.05,
    influenceVectorInfluence: 0,
    initThickness: 1,
    mainSproutingRate: 0.002,
    maxAge: 237,
    maxRandomRotationTip: 0.06981317007977318,
    maxThickness: 5,
    minSproutingAge: 0,
    secondarySproutingRate: 0.0262,
    sproutingGrowProb: 0.1,
    sproutingLength: 12,
    standardSproutAngle: 1.4486232791552935
}



export const treeConfigs = [defaultConfig, fishBone, humongousTree, lightning, cityMap];
export const defaultTreeConfigIndex = 0;