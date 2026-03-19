import * as UTILS from "./utils.js";

export let TREE_CONFIG = {
    initThickness: 1,
    growRate: 0.2,
    maxThickness: 30,
    maxAge: 70,

    sproutingRate: 0.005,
    sproutingLength: 4,
    sproutingGrowProb: 0.4,


    influenceVectorInfluence: 0.2,
    maxRandomRotationTip: 0.1 * Math.PI,

    breakingOffProb: 0.0001,

    awayFromCOMInfluence: 0.5,

    cripplingMinDist: 10,
    cripplingFactor: 0.5,

    minSproutingAge: 5,
}

export class Node {
    constructor(position, ancestor, descendants, forceFields = [], centerOfMass){
        console.assert((ancestor == null || ancestor instanceof Node), "Ancestor must be of type Node or null");

        this.position = position;
        this.ancestor = ancestor;
        this.descendants = descendants;
        this.forceFields = forceFields;
        this.age = 0;

        this.thickness = TREE_CONFIG.initThickness;
        this.maxAge = TREE_CONFIG.maxAge;
        this.growRate = TREE_CONFIG.growRate;
        this.maxThickness = TREE_CONFIG.maxThickness;

        this.sproutingRate = TREE_CONFIG.sproutingRate;
        this.sproutingLength = TREE_CONFIG.sproutingLength;

        this.hasSprouted = false;

        this.centerOfMass = centerOfMass;
        this.minSproutingAge = TREE_CONFIG.minSproutingAge;
    }

    grow(){

        if(this.age < this.maxAge){
            if(this.thickness < this.maxThickness){
                let growRateMultiplier = 1 ;//- this.age/this.max_age; //Later maybe logarithmic
                this.thickness += this.growRate * growRateMultiplier;
            }
            if(!this.hasSprouted && this.ancestor != null){
                if(this.age >= this.minSproutingAge && Math.random() <= this.sproutingRate){
                    this.hasSprouted = true;
                    
                    let newDescendant = this.createSprout();

                    this.descendants.push(newDescendant);
                }
            }
            if(this.age > 0){
                for(let descendant of this.descendants){
                    descendant.grow();
                }
            }
            this.age++;
            return true;
        }
        else{
            return false;
        }
    }

    createSprout(){
        //Normalized Vector orthogonal from ancestor to this node either - or positive
        let OrthVec = this.getOrthogonalGrowVector();
        let dirVec = this.getNormalizedGrowVector();

        let desc_position = [this.position[0] + dirVec[0]*this.sproutingLength, this.position[1] + dirVec[1]*this.sproutingLength];
        let newDescendant = new MutatingNode(desc_position, this, [], dirVec, OrthVec, this.forceFields, this.centerOfMass);
        return newDescendant;
    }

    draw(context){
        if(this.ancestor != null && this.age > 0){
            context.lineWidth = (this.thickness);// + this.ancestor.thickness)/2;
            context.strokeStyle = "#000000"; //Maybe later gradient depending on age or thickness
            context.beginPath();
            context.moveTo(this.position[0], this.position[1]);
            context.lineTo(this.ancestor.position[0], this.ancestor.position[1]);
            context.stroke();
        }
        for(let descendant of this.descendants){
            descendant.draw(context);
        }
    }

    getNormalizedGrowVector(){
        if(this.ancestor != null){
            return UTILS.normalizedDirectionVector(this.ancestor.position, this.position);
        }
        else{
            false;
        }
    }

    getOrthogonalGrowVector(){
        let vec = this.getNormalizedGrowVector();
        if(vec){
            return [vec[1], vec[0] * (Math.random() < 0.5 ? -1 : 1)];
        }
        else{
            return false;
        }
    }

    calculateForcePoints(){
        if (this.descendants.length === 0) {
            return [this.position];
        } else {
            let points = [];
            for (let descendant of this.descendants) {
                if (descendant.age > 0){
                    points = points.concat(descendant.calculateForcePoints());
                }
            }
            points = points.concat([this.position]);
            return points;
        }
    }   

    setForceFields(forceFields){
        for(let descendant of this.descendants){
            this.forceFields = forceFields;
            descendant.setForceFields(forceFields);
        }
    }

}

export class MutatingNode extends Node {
    constructor(position, ancestor, descendants, growVector, influenceVector, forceFields, centerOfMass){
        super(position, ancestor, descendants, forceFields, centerOfMass);

        this.growVector = growVector;
        this.influenceVector = influenceVector;

        this.iVI = TREE_CONFIG.influenceVectorInfluence;

        this.sproutingGrowProb = TREE_CONFIG.sproutingGrowProb;
        this.hasGrown = false;

        this.breakingOffProb = TREE_CONFIG.breakingOffProb;

        this.awayFromCOMVec = UTILS.normalizeVector([this.position[0] - this.centerOfMass[0], this.position[1] - this.centerOfMass[1]]);

        this.awayFromCOMI = TREE_CONFIG.awayFromCOMInfluence;

        this.cripplingFactor = this.calcGribblingForce(TREE_CONFIG.cripplingMinDist, TREE_CONFIG.cripplingFactor);

        this.sproutingRate = this.sproutingRate * this.cripplingFactor;
    }  

    grow(){
        let nowBreakingOffProb = this.breakingOffProb;
        if(Math.random() <= nowBreakingOffProb && this.ancestor != null){
            this.ancestor.descendants = this.ancestor.descendants.filter(desc => desc !== this);
            return false;
        }
        else{
            if(Math.random() <= this.sproutingGrowProb * this.cripplingFactor && !this.hasGrown){
                this.createTipSprout();
            }
            super.grow();
        }
    }

    createTipSprout(){
        this.hasGrown = true;

        let growingVec = UTILS.normalizeVector([this.growVector[0] + this.influenceVector[0]*this.iVI + this.awayFromCOMVec[0]*this.awayFromCOMI, this.growVector[1] + this.influenceVector[1]*this.iVI + this.awayFromCOMVec[1]*this.awayFromCOMI]);
        growingVec = UTILS.rotateVectorZ(growingVec, UTILS.randomNumberInRange(-TREE_CONFIG.maxRandomRotationTip, TREE_CONFIG.maxRandomRotationTip));
        growingVec = UTILS.vectorMulti(growingVec, this.cripplingFactor);
        let nextPosition = [this.position[0] + growingVec[0] * this.sproutingLength, this.position[1] + growingVec[1] * this.sproutingLength];
        let newDescendant = new MutatingNode(nextPosition, this, [], growingVec, this.influenceVector, this.forceFields, this.centerOfMass);
        this.descendants.push(newDescendant);
    }

    createSprout(){
        //Normalized Vector orthogonal from ancestor to this node either - or positive
        let vec = this.getOrthogonalGrowVector();
        let newInfluenceVector = UTILS.normalizeVector([this.growVector[0]+this.influenceVector[0]*this.iVI + this.awayFromCOMVec[0]*this.awayFromCOMI, this.growVector[1]+this.influenceVector[1]*this.iVI + this.awayFromCOMVec[1]*this.awayFromCOMI]);
        let growVec = UTILS.normalizeVector([vec[0]+ newInfluenceVector[0]*this.iVI, vec[1]+ newInfluenceVector[1]*this.iVI]);
        growVec = UTILS.vectorMulti(growVec, this.cripplingFactor);

        let descPosition = [this.position[0] + growVec[0]*this.sproutingLength + this.awayFromCOMVec[0]*this.awayFromCOMI, this.position[1] + growVec[1]*this.sproutingLength + this.awayFromCOMVec[1]*this.awayFromCOMI];
        let newDescendant = new MutatingNode(descPosition, this, [], growVec, newInfluenceVector, this.forceFields, this.centerOfMass);
        return newDescendant;
    }

    calculateForcePoints(){
        if (this.descendants.length === 0) {
            return [this.position];
        } else {
            let oldestDescendant = this.descendants.reduce((oldest, descendant) => descendant.age > oldest.age ? descendant : oldest, this.descendants[0]);
            if (oldestDescendant.age == 0){
                return [this.position];
            }
            else{
                return oldestDescendant.calculateForcePoints();
            }
        }
    }

    setForceFields(forceFields){
        this.forceFields = forceFields;
        super.setForceFields(forceFields);
    }

    calcGribblingForce(cripplingMinDist, cripplingFactor){
        let minDist = Infinity;
        for(let forceField of this.forceFields){
            for (let point of forceField){
                let dist = UTILS.calcDistance(this.position, point);
                minDist = Math.min(minDist, dist);
            }
        }
        if(minDist < cripplingMinDist){
            let factor = (1 - cripplingFactor) + cripplingFactor * minDist/cripplingMinDist;
            return factor;
        } else {
            return 1;
        }
    }

}