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
        text: "This webpage is an interactive growth simulation. Inspired by logos of metal bands and the fascinating structures of trees' branching patterns, it tries to mimic growing processes along any strokes drawn by the user. The growth process and the behaviour of the branching process is influenced by various settings that you can adjust to create different growth patterns. You can also edit your strokes in edit mode to decide where the growth of strokes starts or to connect multiple strokes. The growth process is based on a custom algorithm. I hope you have fun playing around and let yourself be fascinated by the emerging structures. In case of any questions, suggestions, or feedback, feel free to contact me! Kind greetings, Till :--)",
        imagePosition: IMAGEPOSITION.SIDEBAR,
        images: [{"src": imgPath("GrowLogo.png"), "alt": "Grow Logo", "description": "The GROW project logo. It was created by using this website."},]
    },

    // Edit Mode
    editMode: {
        title: "Edit Mode",
        text: "In Edit Mode, you can edit your drawn strokes. Set (red) start points to determine where the growth of a stroke starts, and connect different strokes with join points (blue) to create more complex structures.",
        imagePosition: IMAGEPOSITION.SIDEBAR,
        images: []
    },
    
    startPointMode: {
        title: "Start Point Mode",
        text: "Activate the 'Start Point Mode' by pressing the red button. Select a point on your stroke where the growth process should begin. Click on any point of the stroke to set it as a start point. The start point will be marked in red.",
        imagePosition: IMAGEPOSITION.SIDEBAR,
        images: []
    },
    
    joinPointMode: {
        title: "Join Point Mode",
        text: "Activate the 'Join Point Mode' by pressing the blue button. Connect two different strokes at their intersection points. This allows you to combine multiple strokes into a single connected structure. Click on an intersection point to create or remove a join point. Join points will be marked in blue. Cyclic connections aren't allowed and will be prevented.",
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
        text: "Determines how much thicker the strokes get per growing step. A higher value leads to thicker strokes faster.",
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
        text: "The probability that a new side shoot will continue to grow from its tip. A higher value results in more tip growth and longer branches. In comparison to a higher sprout length, this produces more nodes, that can sprout new branches.",
        imagePosition: IMAGEPOSITION.GALERY,
        images: [{"src": imgPath("tipSproutingProbability15.png"), "alt": "", "description": "A growth with a tip sprouting probability of 0.15."}, {"src": imgPath("tipSproutingProbability50.png"), "alt": "", "description": "A growth with a tip sprouting probability of 0.5."}]
    },

    mainSproutingRate: {
        title: "Main Sprouting Probability",
        text: "The probability per growth step that a new side shoot will sprout along drawn strokes. A higher value leads to more side branching. A node will only produce one sprout per growth cycle. Be careful with very high values, as they can lead to very dense and resource-intensive growth.",
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
        text: "The maximum angle in degrees that the lateral sprout growth can deviate from the standard lateral sprouting angle. A higher value results in less directed, more winding growth.",
        imagePosition: IMAGEPOSITION.GALERY,
        images: [{"src": imgPath("MaximumRandomAngle0.png"), "alt": "", "description": "Maximum Random Angle Offset of 0 degrees. The growth direction is only influenced by the other settings."}, {"src": imgPath("MaximumRandomAngle20.png"), "alt": "", "description": "Maximum Random Angle Offset of 20 degrees. The growth direction is more random and appears more natural."}, {"src": imgPath("MaximumRandomAngle90.png"), "alt": "", "description": "Maximum Random Angle Offset of 90 degrees. The growth appears winding. Other growth direction settings have less influence."}]
    },
    
    awayFromCOMInfluence: {
        title: "Away From COM Influence",
        text: "How strongly new sprouts grow away from the center of mass. A higher value makes the tree grow more outward-directed.",
        imagePosition: IMAGEPOSITION.GALERY,
        images: [{"src": imgPath("awayFromCOM0.png"), "alt": "", "description": "Away From COM Influence of 0. The growth direction is only influenced by the other settings."}, {"src": imgPath("awayFromCOM70.png"), "alt": "", "description": "Away From COM Influence of 0.70. The branches grow away from the center of mass (green circle)."}]
    },
    
    influenceVector: {
        title: "Ancestor Direction Influence",
        text: "The strength at which the ancestor branch's growth direction influences the new sprout's growth direction. A higher value results in more upright, aligned growth.",
        imagePosition: IMAGEPOSITION.GALERY,
        images: [{"src": imgPath("AncestorDirectionInfluence0.png"), "alt": "", "description": "Ancestor Direction Influence of 0. The growth direction is only influenced by the other settings."}, {"src": imgPath("AncestorDirectionInfluence30.png"), "alt": "", "description": "Ancestor Direction Influence of 0.3. The side shoots tend to the growth direction of their ancestor branch."}]
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
        text: "The distance to branches of other structures at which crowding effects start to appear. The closer branches get to other structures, the stronger the crowding effects inhibit growth.",
        imagePosition: IMAGEPOSITION.GALERY,
        images: [{"src": imgPath("CrowdingDistance20.png"), "alt": "", "description": "Crowding Minimum Distance of 20. The two structures almost grow together."}, {"src": imgPath("CrowdingDistance40.png"), "alt": "", "description": "Crowding Minimum Distance of 40. The two structures don't grow together. The red circles indicate the area around the branches where crowding effects occur."}]
    },
    
    crowdingFactor: {
        title: "Crowding Factor",
        text: "How strongly the nearby branches of other structures inhibit growth. A higher value results in stronger growth resistance when crowding occurs.",
        imagePosition: IMAGEPOSITION.GALERY,
        images: [{"src": imgPath("CrowdingFactor0.png"), "alt": "", "description": "With a crowding factor of 0 no crowding effects occur."}, {"src": imgPath("CrowdingFactor1.png"), "alt": "", "description": "A crowding factor of 1 results in strong inhibition of growth when branches get close to other structures."}]
    }
}