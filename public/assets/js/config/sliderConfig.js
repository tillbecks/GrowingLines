/**
 * Helper function to create a variable object for slider configuration
 * @param {string} label
 * @param {number} min 
 * @param {number} max 
 * @param {number} defaultValue 
 * @param {number} step 
 * @param {string} description 
 * @param {function} func - Function to transform the slider value before applying it to the tree (e.g. converting degrees to radians)
 * @param {function} inverseFunc - Function to transform the tree variable value back to slider value for display (e.g. converting radians back to degrees)
 * @returns 
 */
function createVariableObject(label, min, max, defaultValue, step, description = null, func = x => x, inverseFunc = x => x){
    return { label: label, min: min, max: max, defaultValue: defaultValue, step: step, func: func, inverseFunc: inverseFunc, description: description };
}

export const TREECONFIGVARIABLES = {
    // Basic Settings
    initThickness: createVariableObject("Initial Thickness", 1, 10, 1, 1, "initThickness"),
    growRate: createVariableObject("Thickness Grow Rate", 0, 1, 0.05, 0.01, "growthRate"),
    maxThickness: createVariableObject("Maximum Thickness", 1, 30, 5, 1, "maxThickness"),
    maxAge: createVariableObject("Maximum Age", 1, 1000, 150, 1, "maxAge"),

    // Sprouting Settings
    minSproutingAge: createVariableObject("Minimum Sprouting Age", 0, 1000, 25, 1, "minSproutingAge"),
    sproutingGrowProb: createVariableObject("Tip Sprouting Probability", 0, 1, 0.2, 0.01, "sproutingGrowProb"),
    mainSproutingRate: createVariableObject("Main Sprouting Probability", 0, 0.05, 0.002, 0.0001, "mainSproutingRate"),
    secondarySproutingRate: createVariableObject("Secondary Sprouting Probability", 0, 0.05, 0.002, 0.0001, "secondarySproutingRate"),
    sproutingLength: createVariableObject("Sprout Length", 1, 20, 5, 1, "sproutingLength"),
    breakingOffProb: createVariableObject("Breaking Off Probability", 0, 0.01, 0.001, 0.0001, "breakingOffProb"),

    // Sprouting Direction Settings
    standardSproutAngle: createVariableObject("Standard Lateral Sprouting Angle", 0, 180, 90, 1, "standardSproutAngle", x => x * Math.PI / 180, x => x * 180 / Math.PI),
    maxRandomRotationTip: createVariableObject("Maximum Random Angle Offset", 0, 90, 18, 1, "maxRandomRotationTip", x => x * Math.PI / 180, x => x * 180 / Math.PI),
    awayFromCOMInfluence: createVariableObject("Away From COM Influence", 0, 2, 0.5, 0.01, "awayFromCOMInfluence"),
    influenceVectorInfluence: createVariableObject("Ancestor Direction Influence", 0, 2, 0, 0.01, "influenceVector"),

    // Environment Settings
    crowdingMinDist: createVariableObject("Crowding Minimum Distance", 0, 200, 30, 1, "crowdingMinDist"),
    crowdingFactor: createVariableObject("Crowding Factor", 0, 1, 0.9, 0.01, "crowdingFactor"),
};

export const SLIDERSECTIONS = {
    basicSettings: {
        title: "Basic Settings",
        variables: ["initThickness", "growRate", "maxThickness", "maxAge"],
        synchronizer : []
    },
    sproutingSettings: {
        title: "Sprouting Settings",
        variables: ["minSproutingAge", "sproutingGrowProb", "mainSproutingRate", "secondarySproutingRate", "sproutingLength", "breakingOffProb"],
        synchronizer : [{label: "Synchronize Lateral Sprouting Probabilities", main: "mainSproutingRate", secondary: "secondarySproutingRate", description: null }]
    },
    sproutingDirectionSettings: {
        title: "Sprouting Direction Settings",
        variables: ["standardSproutAngle", "maxRandomRotationTip", "awayFromCOMInfluence", "influenceVectorInfluence"],
        synchronizer : []
    },
    environmentSettings: {
        title: "Environment Settings",
        variables: ["crowdingMinDist", "crowdingFactor"],
        synchronizer : []
    }
}