//image-format for info content: {"src": imgPath(""), "alt": "", "description": ""}

const imagePath = "/assets/img/";

function imgPath(filename){
    return imagePath + filename;
}

export const IMAGEPOSITION = {
    SIDEBAR: "sidebar",
    GALERY: "galery",
}

export const INFORMATIONCONTENT = {
    //General Information
    growProject: {
        title: "The GROW project",
        text: "This webpage is an interactive growth simulation. Inspired by band logos and the fascinating branching patterns of trees, it simulates natural growing processes along any strokes you draw. The growth and branching behavior are influenced by various settings you can adjust to create different patterns. You can also edit your strokes in edit mode to determine where growth begins or to connect multiple strokes together. The entire algorithm is custom-built. I hope you enjoy playing with it and find yourself fascinated by the emerging structures. If you have any questions, suggestions, or feedback, feel free to reach out! Kind regards, Till :--)",
        imagePosition: IMAGEPOSITION.SIDEBAR,
        images: [{"src": imgPath("GrowLogo.png"), "alt": "Grow Logo", "description": "The GROW project logo. It was created by using this website."},]
    },

    // Edit Mode
    editMode: {
        title: "Edit Mode",
        text: "In Edit Mode, you can edit your drawn strokes. Set (red) start points to determine where growth begins, and connect different strokes with join points (blue) to create more complex structures.",
        imagePosition: IMAGEPOSITION.SIDEBAR,
        images: []
    },
    
    startPointMode: {
        title: "Start Point Mode",
        text: "Click the red button to activate Start Point Mode. Pick a point on your stroke where growth should start. Click any point on the stroke to set it as the start point. It will be marked in red.",
        imagePosition: IMAGEPOSITION.SIDEBAR,
        images: []
    },
    
    joinPointMode: {
        title: "Join Point Mode",
        text: "Click the blue button to activate Join Point Mode. Connect two strokes where they meet by clicking on the intersection. This combines multiple strokes into one structure. Click to create or remove a join point. Join points appear in blue. You can't create loops—they're blocked automatically.",
        imagePosition: IMAGEPOSITION.SIDEBAR,
        images: [],
    },
    
    // Basic Settings
    initThickness: {
        title: "Initial Thickness",
        text: "The stroke thickness at which growth begins. A higher value means a thicker stroke at the start.",
        imagePosition: IMAGEPOSITION.GALERY,
        images: []
    },
    
    growthRate: {
        title: "Thickness Grow Rate",
        text: "Determines how much thicker the strokes get per growing step. A higher value makes strokes thicken faster.",
        imagePosition: IMAGEPOSITION.GALERY,
        images: []
    },
    
    maxThickness: {
        title: "Maximum Thickness",
        text: "The maximum thickness a node can reach. Nodes will not grow thicker than this value.",
        imagePosition: IMAGEPOSITION.GALERY,
        images: []
    },
    
    maxAge: {
        title: "Maximum Age",
        text: "The maximum age a node can reach. It determines how long the growth process will last. After the start node reaches the max age, a structure stops growing. The actual age of the structure is displayed in the top left corner.",
        imagePosition: IMAGEPOSITION.GALERY,
        images: []
    },
    
    // Sprouting Settings
    minSproutingAge: {
        title: "Minimum Sprouting Age",
        text: "The minimum age a node must reach before it can create new sprouts (side shoots). A higher value results in less explosive branching.",
        imagePosition: IMAGEPOSITION.GALERY,
        images: []
    },
    
    sproutingLength: {
        title: "Sprout Length",
        text: "The initial length of new side shoots. Longer sprouts grow faster into larger branches.",
        imagePosition: IMAGEPOSITION.GALERY,
        images: [{"src": imgPath("SproutLength10.png"), "alt": "", "description": "A growth with a sprout length of 10."}, {"src": imgPath("SproutLength20.png"), "alt": "", "description": "A growth with a sprout length of 20."}]
    },
    
    sproutingGrowProb: {
        title: "Tip Sprouting Probability",
        text: "How likely a side shoot is growing from its tip. Higher values = more tip growth and longer branches. This creates more branch points than using a longer sprout length.",
        imagePosition: IMAGEPOSITION.GALERY,
        images: [{"src": imgPath("tipSproutingProbability15.png"), "alt": "", "description": "A growth with a tip sprouting probability of 0.15."}, {"src": imgPath("tipSproutingProbability50.png"), "alt": "", "description": "A growth with a tip sprouting probability of 0.5."}]
    },

    mainSproutingRate: {
        title: "Main Sprouting Probability",
        text: "How likely new branches are to grow from your drawn strokes. Higher values = more branching. Each point creates only one branch per step. Watch out: very high values can create dense, slow growth.",
        imagePosition: IMAGEPOSITION.GALERY,
        images: []
    },

    secondarySproutingRate: {
        title: "Secondary Sprouting Probability",
        text: "The probability per growth step that side shoots will sprout from existing branches. A higher value leads to more branching on side shoots.",
        imagePosition: IMAGEPOSITION.GALERY,
        images: [{"src": imgPath("lateralSproutingProb005.png"), "alt": "", "description": "Secondary Sprouting Probability of 0.005."}, {"src": imgPath("lateralSproutingProb01.png"), "alt": "", "description": "Secondary Sprouting Probability of 0.01."}]
    },

    breakingOffProb: {
        title: "Breaking Off Probability",
        text: "The probability per growth step that a branch will break off. This simulates natural damage. A breaking branch removes itself and all branches that have emerged from it.",
        imagePosition: IMAGEPOSITION.GALERY,
        images: [{"src": imgPath("breakingOffProb0.png"), "alt": "", "description": "A growth where no branches broke off."}, {"src": imgPath("breakingOffProb003.png"), "alt": "", "description": "A growth with a breaking off probability of 0.003."}]
    },
    
    // Sprouting Direction Settings
    maxRandomRotationTip: {
        title: "Maximum Random Angle Offset",
        text: "How much the branch angle can randomly change. Higher values = wilder, more random growth; lower values = more directed growth.",
        imagePosition: IMAGEPOSITION.GALERY,
        images: [{"src": imgPath("MaximumRandomAngle0.png"), "alt": "", "description": "Maximum Random Angle Offset of 0 degrees. The growth direction is only influenced by the other settings."}, {"src": imgPath("MaximumRandomAngle20.png"), "alt": "", "description": "Maximum Random Angle Offset of 20 degrees. The growth direction is more random and appears more natural."}, {"src": imgPath("MaximumRandomAngle90.png"), "alt": "", "description": "Maximum Random Angle Offset of 90 degrees. The growth appears winding. Other growth direction settings have less influence."}]
    },
    
    awayFromCOMInfluence: {
        title: "Away From COM Influence",
        text: "How strongly branches push away from the center. Higher values make the tree grow more outward.",
        imagePosition: IMAGEPOSITION.GALERY,
        images: [{"src": imgPath("awayFromCOM0.png"), "alt": "", "description": "Away From COM Influence of 0. The growth direction is only influenced by the other settings."}, {"src": imgPath("awayFromCOM70.png"), "alt": "", "description": "Away From COM Influence of 0.70. The branches grow away from the center of mass (green circle)."}]
    },
    
    influenceVector: {
        title: "Ancestor Direction Influence",
        text: "How much the parent branch's direction affects new branches. Higher values = branches follow the parent direction more closely.",
        imagePosition: IMAGEPOSITION.GALERY,
        images: [{"src": imgPath("AncestorDirectionInfluence0.png"), "alt": "", "description": "Ancestor Direction Influence of 0. The growth direction is only influenced by the other settings."}, {"src": imgPath("AncestorDirectionInfluence30.png"), "alt": "", "description": "Ancestor Direction Influence of 0.3. The side shoots follow the growth direction of their ancestor branch."}]
    },
    
    standardSproutAngle: {
        title: "Standard Sprouting Angle",
        text: "The standard angle in degrees at which new sprouts branch off. At 90°, the sprouts are perpendicular to the branch.",
        imagePosition: IMAGEPOSITION.GALERY,
        images: [{"src": imgPath("standardAngleOffset60.png"), "alt": "", "description": "Standard Sprouting Angle of 60 degrees. The branches grow at a sharper angle."}, {"src": imgPath("standardAngleOffset110.png"), "alt": "", "description": "Standard Sprouting Angle of 110 degrees. The branches grow at a wider angle."}]
    },
    
    // Environmental Settings
    crowdingMinDist: {
        title: "Crowding Minimum Distance",
        text: "How close branches can get to branches of other structures before they start inhibiting each other. Closer = stronger inhibition effect.",
        imagePosition: IMAGEPOSITION.GALERY,
        images: [{"src": imgPath("CrowdingDistance20.png"), "alt": "", "description": "Crowding Minimum Distance of 20. The two structures almost grow together."}, {"src": imgPath("CrowdingDistance40.png"), "alt": "", "description": "Crowding Minimum Distance of 40. The two structures don't grow together. The red circles indicate the area around the branches where crowding effects occur."}]
    },
    
    crowdingFactor: {
        title: "Crowding Factor",
        text: "How much nearby branches of other structures inhibit growth. Higher values = stronger inhibition when trees get crowded.",
        imagePosition: IMAGEPOSITION.GALERY,
        images: [{"src": imgPath("CrowdingFactor0.png"), "alt": "", "description": "With a crowding factor of 0 no crowding effects occur."}, {"src": imgPath("CrowdingFactor1.png"), "alt": "", "description": "A crowding factor of 1 results in strong inhibition of growth when branches get close to other structures."}]
    },

    controls: {
        title : "Controls",
        text: "There are four main control buttons: 'Erase Canvas', 'Start Growth', 'Reset Growth', and the Start/Stop Button. 'Erase Canvas' clears all your strokes so you can start fresh. 'Start Growth' initiates the growth process, while 'Reset Growth' returns the growth to its initial state while preserving your drawn strokes. The Start/Stop Button lets you pause and resume the growth process.",
        imagePosition: IMAGEPOSITION.SIDEBAR,
        images: []
    },

    growthPresets: {
        title: "Growth Presets",
        text: "Pick from ready-made presets that change the settings. Select one and it applies instantly. You can also save your own: adjust settings, click 'Save Preset', and give it a name.",
        imagePosition: IMAGEPOSITION.SIDEBAR,
        images: []
    },

    advancedSettings: {
        title: "Advanced Settings",
        text: "Here you can adjust each setting in detail. Click any setting name to read what it does. Warning: extreme values can create slow, dense growth.",
        imagePosition: IMAGEPOSITION.SIDEBAR,
        images: []
    }
}