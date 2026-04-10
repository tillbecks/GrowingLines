//image-format for info content: {"src": "", "alt": "", "description": ""}

export const INFORMATIONCONTENT = {
    //General Information
    growProject: {
        title: "The GROW project",
        text: "This webpage is an interactive growth simulation. Inspired by logos of metal bands and the fascinating structures of trees' branching patterns, it tries to mimic growing processes along any strokes drawn by the user. The growth process and the behaviour of the branching process is influenced by various settings that you can adjust to create different growth patterns. You can also edit your strokes in edit mode to decide where the growth of strokes starts or to connect multiple strokes. The growth process is based on a custom algorithm. I hope you have fun playing around and let yourself be fascinated by the emerging structures. In case of any questions, suggestions, or feedback, feel free to contact me! Kind greetings, Till :--)",
        images: [{"src": "assets/img/GrowLogo.png", "alt": "Grow Logo", "description": "The GROW project logo. It was created by using this website."},]
    },

    // Edit Mode
    editMode: {
        title: "Edit Mode",
        text: "In Edit Mode, you can edit your drawn strokes. Set (red) start points to determine where the growth of a stroke starts, and connect different strokes with join points (blue) to create more complex structures.",
        images: []
    },
    
    startPointMode: {
        title: "Start Point Mode",
        text: "Activate the 'Start Point Mode' by pressing the red button. Select a point on your stroke where the growth process should begin. Click on any point of the stroke to set it as a start point. The start point will be marked in red.",
        images: []
    },
    
    joinPointMode: {
        title: "Join Point Mode",
        text: "Activate the 'Join Point Mode' by pressing the blue button. Connect two different strokes at their intersection points. This allows you to combine multiple strokes into a single connected structure. Click on an intersection point to create or remove a join point. Join points will be marked in blue. Cyclic connections aren't allowed and will be prevented.",
        images: []
    },
    
    // Basic Settings
    initThickness: {
        title: "Initial Thickness",
        text: "The stroke thickness at which growth begins. A higher value means a thicker stroke at the start.",
        images: []
    },
    
    growthRate: {
        title: "Thickness Grow Rate",
        text: "Determines how much thicker the strokes get per growing step. A higher value leads to thicker strokes faster.",
        images: []
    },
    
    maxThickness: {
        title: "Maximum Thickness",
        text: "The maximum thickness a node can reach. Nodes will not grow thicker than this value.",
        images: []
    },
    
    maxAge: {
        title: "Maximum Age",
        text: "The maximum age a node can reach. It determines how long the growth process will last. After the start node reaches the max age, a structure stops growing. ",
        images: []
    },
    
    // Sprouting Settings
    minSproutingAge: {
        title: "Minimum Sprouting Age",
        text: "The minimum age a node must reach before it can create new sprouts (side shoots). A higher value results in less explosive branching.",
        images: []
    },
    
    sproutingLength: {
        title: "Sprout Length",
        text: "The initial length of new lateral sprouts. Longer sprouts grow faster into larger branches.",
        images: []
    },
    
    sproutingGrowProb: {
        title: "Tip Sprouting Probability",
        text: "The probability that a new lateral sprout will continue to grow a main tip. A higher value results in more tip growth and longer branches.",
        images: []
    },

    mainSproutingRate: {
        title: "Lateral Sprouting Probability",
        text: "The probability per growth step that a new lateral sprout (side shoot) will be created. A higher value leads to more and denser branching. A node will only produce one sprout per growth cycle. Be careful with very high values, as they can lead to very dense and resource-intensive growth.",
        images: [{"src": "assets/img/lateralSproutingProb005.png", "alt": "", "description": "Lateral Sprouting Probability of 0.005."}, {"src": "assets/img/lateralSproutingProb01.png", "alt": "", "description": "Lateral Sprouting Probability of 0.01."}]
    },

    secondarySproutingRate: {
        title: "Lateral Secondary Sprouting Probability",
        text: "The probability per growth step that secondary branches will create new lateral sprouts. A higher value leads to more branching on side shoots.",
        images: []
    },

    breakingOffProb: {
        title: "Breaking Off Probability",
        text: "The probability per growth step that a branch will break off. This simulates natural damage. A breaking branch will remove itself and all its descendants from the structure. ",
        images: []
    },
    
    // Sprouting Direction Settings
    maxRandomRotationTip: {
        title: "Maximum Random Angle Offset",
        text: "The maximum angle in degrees that the lateral sprout growth can deviate from the standard lateral sprouting angle. A higher value results in less directed, more winding growth.",
        images: []
    },
    
    awayFromCOMInfluence: {
        title: "Away From COM Influence",
        text: "How strongly new sprouts grow away from the center of mass. A higher value makes the tree grow more outward-directed.",
        images: []
    },
    
    influenceVector: {
        title: "Ancestor Direction Influence",
        text: "The strength at which the ancestor branch's growth direction influences the new sprout's growth direction. A higher value results in more upright, aligned growth.",
        images: []
    },
    
    standardSproutAngle: {
        title: "Standard Lateral Sprouting Angle",
        text: "The standard angle in degrees at which new sprouts branch off from the main branch. At 90°, the sprouts are perpendicular to the branch.",
        images: []
    },
    
    // Extra Settings
    crowdingMinDist: {
        title: "Crowding Minimum Distance",
        text: "The distance to branches of other structures at which crowding effects start to appear. The closer branches get to other structures, the stronger the crowding effects inhibit growth.",
        images: []
    },
    
    crowdingFactor: {
        title: "Crowding Factor",
        text: "How strongly the nearby branches of other structures inhibit growth. A higher value results in stronger growth resistance when crowding occurs.",
        images: []
    }
}