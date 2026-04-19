import * as UTILS from "../config/utils.js";
import { drawTreeNode } from "../canvas/canvasDrawing.js";

// This file contains the Node and MutatingNode class, which represent the tree structures that are created from the user strokes.
// The Node class represents a node in the tree structure, which can grow and sprout new nodes. 
// The MutatingNode class extends the Node class and adds additional properties and methods for nodes that are created from sprouting.

export class Node {
    constructor(config, position, ancestor, descendants, centerOfMass = 0){
        this.config = structuredClone(config);
        //this.config = config;

        this.position = position;
        this.ancestor = ancestor;
        this.descendants = descendants;
        this.age = 0;

        this.thickness = config.initThickness;
        this.maxAge = config.maxAge;
        this.growRate = config.growRate;
        this.maxThickness = config.maxThickness;

        this.sproutingRate = config.mainSproutingRate;
        this.sproutingLength = config.sproutingLength;

        this.hasSprouted = false;

        this.centerOfMass = centerOfMass;
        this.minSproutingAge = config.minSproutingAge;
    }

    /**
     * Grows the tree node by increasing its thickness and potentially sprouting new descendant nodes based on the sprouting rate.
     * @param {*} forceFields 
     * @param {*} crowdingForce 
     * @returns boolean indicating whether the node is still growing
     */
    grow(forceFields, crowdingForce = 1){
        //Only grow if the node is not too old
        if(this.age < this.maxAge){
            //Increase thickness based on grow rate, but not above max thickness
            if(this.thickness < this.maxThickness){
                let growRateMultiplier = 1;
                this.thickness += this.growRate * growRateMultiplier;
            }
            //If the node hasn't sprouted yet, and it has reached the minimum age for sprouting, it has a chance to sprout a new descendant node based on the sprouting rate and the crowding force. 
            if(!this.hasSprouted){
                if(this.age >= this.minSproutingAge && Math.random() <= this.sproutingRate * crowdingForce){
                    this.hasSprouted = true;
                    
                    let newDescendant = this.createSprout(crowdingForce);
                    if(newDescendant) this.descendants.push(newDescendant);
                }
            }
            //Recursively grow descendants
            if(this.age > 0){
                for(let descendant of this.descendants){
                    descendant.grow(forceFields, crowdingForce);
                }
            }
            this.age++;
            return true;
        }
        else{
            return false;
        }
    }

    /**
     * Creates a new descendant node (sprout) from the current node. "Normal" nodes grow sprouts orthogonally to their growth direction.
     * @returns {MutatingNode|boolean} - The newly created descendant node or false if the sprout could not be created
     */
    createSprout(){
        // Normalized Vector orthogonal to this node either negative or positive
        let orthVec = this.getOrthogonalGrowVector();
        let dirVec = this.getNormalizedGrowVector();

        if(dirVec){
            let descPosition = [this.position[0] + orthVec[0]*this.sproutingLength, this.position[1] + orthVec[1]*this.sproutingLength];
            let newDescendant = new MutatingNode(this.config, descPosition, this, [], orthVec, orthVec, this.centerOfMass);
            return newDescendant;
        }
        else{
            return false;
        }
    }

    /**
     * Recursibely draws the tree node on the specified canvases.
     * @param {CanvasRenderingContext2D} primaryCanvas 
     * @param {CanvasRenderingContext2D | null} secondaryCanvas 
     */
    draw(primaryCanvas, secondaryCanvas){
        if(this.ancestor != null && this.age > 0){
            drawTreeNode(primaryCanvas, secondaryCanvas, this.position, this.ancestor.position, this.thickness);
        }
        for(let descendant of this.descendants){
            descendant.draw(primaryCanvas, secondaryCanvas);
        }
    }

    /**
     * Calculates the normalized growth vector from the ancestor node to this node
     * @returns {Array<number>|boolean} - The normalized growth vector or false if the vector could not be calculated
     */
    getNormalizedGrowVector(){
        if(this.ancestor != null){
            return UTILS.normalizedDirectionVector(this.ancestor.position, this.position);
        }
        else{
            return false;
        }
    }

    /**
     * Calculates a normalized vector orthogonal to the growth direction of this node.
     * @returns {Array<number>|boolean} - The normalized orthogonal growth vector or false if the growth vector could not be calculated
     */
    getOrthogonalGrowVector(){
        let vec = this.getNormalizedGrowVector();
        if(vec){
            if(Math.random() < 0.5) return [vec[1], -vec[0]];
            else return [-vec[1], vec[0]];
        }
        else{
            return false;
        }
    }

    /**
     * Calculates the points at which forces are applied to the tree nodes of other structs.
     * @returns {Array<Array<number>>} - The list of force application points
     */
    calculateForcePoints(){
        if (this.descendants.length === 0) {
            return [this.position];
        } else {
            let points = [];
            for (let descendant of this.descendants) {
                //Through >= 0 also the not yet growing nodes of the strokes are included. This makes sure that the nodes along the drawn strokes are included in the force calculations.
                if (descendant.age >= 0){
                    points = points.concat(descendant.calculateForcePoints());
                }
            }
            points = points.concat([this.position]);
            return points;
        }
    }   

    /**
     * Calculates the center of mass for the subtree rooted at this node.
     * @returns {Array<number>} - The center of mass coordinates and the total number of nodes in the subtree
     */
    calculateCOM(){
        let totalNodes = 1;
        let comX = this.position[0];
        let comY = this.position[1];

        for(let descendant of this.descendants){
            let com = descendant.calculateCOM();
            totalNodes += com[0];
            comX += com[1];
            comY += com[2];
        }

        return [totalNodes, comX, comY];
    }

    /**
     * Distributes a variable to this node and all its descendants.
     * @param {*} variableName 
     * @param {*} variableValue 
     */
    distributeVariable(variableName, variableValue){
        this[variableName] = variableValue;
        for(let descendant of this.descendants){
            descendant.distributeVariable(variableName, variableValue);
        }
    }

    /**
     * Recursively applies a function to this node and all its descendants, accumulating a result.
     * @param {*} fn - The function to apply, which takes the accumulated result as an argument and is called with the context of the current node
     * @param {*} accumulator - The initial value for the accumulator that is passed through the recursive calls
     * @returns 
     */
    foldTree(fn, accumulator){
        let result = accumulator;
        if(this.descendants && this.descendants.length > 0){
            for(let descendant of this.descendants){
                result = descendant.foldTree(fn, result);
            }
        }
        return fn.apply(this, [result]);
    }
}

export class MutatingNode extends Node {
    constructor(config, position, ancestor, descendants, growVector, influenceVector, centerOfMass){
        super(config, position, ancestor, descendants, centerOfMass);

        this.growVector = growVector;
        this.influenceVector = influenceVector;

        this.iVI = config.influenceVectorInfluence;

        this.sproutingGrowProb = config.sproutingGrowProb;
        this.hasGrown = false;

        this.breakingOffProb = config.breakingOffProb;

        this.awayFromCOMI = config.awayFromCOMInfluence;
        
        this.crowdingMinDist = config.crowdingMinDist;
        this.crowdingFactor = config.crowdingFactor;

        this.sproutingRate = config.secondarySproutingRate;
    }  

    /**
     * Grows the tree node by increasing its thickness and potentially sprouting new descendant nodes. 
     * @param {*} forceFields 
     * @returns boolean indicating whether the node is still growing
     */
    grow(forceFields){
        let nowBreakingOffProb = this.breakingOffProb;
        let nowCrowdingFactor = 1;
        //Only calculates the crowding force if the node has not yet sprouted or grown. 
        if(!this.hasGrown || !this.hasSprouted) nowCrowdingFactor = this.calcCrowdingForce(this.crowdingMinDist, this.crowdingFactor, forceFields);
        
        if(Math.random() <= nowBreakingOffProb && this.ancestor != null){
            this.ancestor.descendants = this.ancestor.descendants.filter(desc => desc !== this);
            return false;
        }
        else{
            //The node grows a tip sprout with a certain probability if it has not yet grown. 
            if(Math.random() <= this.sproutingGrowProb * nowCrowdingFactor && !this.hasGrown){
                this.createTipSprout(nowCrowdingFactor);
            }
            //Call the grow function of the parent class to increase thickness and potentially sprout a new descendant node.
            super.grow(forceFields, nowCrowdingFactor);
        }
    }

    /**
     * Creates a tip sprout from the current node.
     * @param {*} crowdingForce 
     */
    createTipSprout(crowdingForce = 1){
        this.hasGrown = true;
        let awayFromCOMVec =  UTILS.normalizeVector([this.position[0] - this.centerOfMass[0], this.position[1] - this.centerOfMass[1]]);
        
        //Calculates the growth vector for the tip sprout by combining the original growth vector, the influence vector, and a vector pointing away from the center of mass, and applying a random rotation.
        let growingVec = UTILS.normalizeVector([this.growVector[0] + this.influenceVector[0]*this.iVI + awayFromCOMVec[0]*this.awayFromCOMI, this.growVector[1] + this.influenceVector[1]*this.iVI + awayFromCOMVec[1]*this.awayFromCOMI]);
        growingVec = UTILS.rotateVectorZ(growingVec, UTILS.randomNumberInRange(-this.config.maxRandomRotationTip, this.config.maxRandomRotationTip));

        growingVec = UTILS.vectorMulti(growingVec, crowdingForce);
        let nextPosition = [this.position[0] + growingVec[0] * this.sproutingLength, this.position[1] + growingVec[1] * this.sproutingLength];
        let newDescendant = new MutatingNode(this.config, nextPosition, this, [], growingVec, this.influenceVector, this.centerOfMass);
        this.descendants.push(newDescendant);
    }

    /**
     * Creates a side sprout from the current node.
     * @param {*} crowdingForce 
     * @returns {MutatingNode} The newly created side sprout node
     */
    createSprout(crowdingForce = 1){
        //Normalized Vector orthogonal from ancestor to this node either - or positive
        let vec = UTILS.rotateVectorZ(this.growVector, (Math.random() > 0.5 ? -1 : 1) * this.config.standardSproutAngle);
        let awayFromCOMVec =  UTILS.normalizeVector([this.position[0] - this.centerOfMass[0], this.position[1] - this.centerOfMass[1]]);

        //Calculates the growth vector for the side sprout by combining the orthogonal vector, the influence vector, and a vector pointing away from the center of mass, and applying a random rotation.
        let growingVec = UTILS.normalizeVector([vec[0] + awayFromCOMVec[0]*this.awayFromCOMI, vec[1] + awayFromCOMVec[1]*this.awayFromCOMI]);
        growingVec = UTILS.rotateVectorZ(growingVec, UTILS.randomNumberInRange(-this.config.maxRandomRotationTip, this.config.maxRandomRotationTip));
        growingVec = UTILS.vectorMulti(growingVec, crowdingForce);

        let descPosition = [this.position[0] + growingVec[0]*this.sproutingLength, this.position[1] + growingVec[1]*this.sproutingLength];
        let newDescendant = new MutatingNode(this.config, descPosition, this, [], growingVec, this.growVector, this.centerOfMass);
        return newDescendant;
    }

    /**
     * Calculates the points at which forces are applied to the tree nodes of other structs, including the position of this node and the positions of its descendants.
     * @returns {Array<Array<number>>} - The list of force application points
     */
    calculateForcePoints(){
        //If this node is the end of a branch, it creates a force point at its position. 
        if (this.descendants.length === 0) {
            return [this.position];
        } else {
            let points = [];
            for (let descendant of this.descendants) {
                if (descendant.age >= 0){
                    points = points.concat(descendant.calculateForcePoints());
                }
            }
            return points;
        }
    }   

    /**
     * Calculates the crowding force based on the minimum distance to other force fields.
     * @param {number} crowdingMinDist 
     * @param {number} crowdingFactor 
     * @param {Array<Array<number>>} forceFields 
     * @returns {number} The crowding force factor to apply to growth and sprouting probabilities
     */
    calcCrowdingForce(crowdingMinDist, crowdingFactor, forceFields){
        if(forceFields.length === 0 || crowdingMinDist <= 0 || crowdingFactor <= 0) return 1;

        let minDist = Infinity;
        for(let forceField of forceFields){
            for (let point of forceField){
                let dist = UTILS.calcDistance(this.position, point);
                minDist = Math.min(minDist, dist);
            }
        }
        if(minDist < crowdingMinDist){
            let normalizedDist = Math.max(0, Math.min(1, minDist / crowdingMinDist / 2));
            let factor = 1 - crowdingFactor * (1 - normalizedDist);
            return factor;
        } else {
            return 1;
        }
    }

}