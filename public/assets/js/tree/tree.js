import * as UTILS from "../config/utils.js";

export class Node {
    constructor(config, position, ancestor, descendants, centerOfMass = 0){
        this.config = config;

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

    grow(forceFields, crowdingForce = 1){
        if(this.age < this.maxAge){
            if(this.thickness < this.maxThickness){
                let growRateMultiplier = 1 ;
                this.thickness += this.growRate * growRateMultiplier;
            }
            if(!this.hasSprouted){
                if(this.age >= this.minSproutingAge && Math.random() <= this.sproutingRate * crowdingForce){
                    this.hasSprouted = true;
                    
                    let newDescendant = this.createSprout(crowdingForce);
                    if(newDescendant) this.descendants.push(newDescendant);
                }
            }
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

    createSprout(){
        //Normalized Vector orthogonal from ancestor to this node either negative or positive
        let orthVec = this.getOrthogonalGrowVector();
        let dirVec = this.getNormalizedGrowVector();

        if(dirVec){
            let desc_position = [this.position[0] + orthVec[0]*this.sproutingLength, this.position[1] + orthVec[1]*this.sproutingLength];
            let newDescendant = new MutatingNode(this.config, desc_position, this, [], orthVec, orthVec, this.centerOfMass);
            return newDescendant;
        }
        else{
            return false;
        }
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
            if(Math.random() < 0.5) return [vec[1], -vec[0]];
            else return [-vec[1], vec[0]];
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
                //Through >= 0 also the not yet growing nodes of the strokes are included
                if (descendant.age >= 0){
                    points = points.concat(descendant.calculateForcePoints());
                }
            }
            points = points.concat([this.position]);
            return points;
        }
    }   

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

    distributeVariable(variableName, variableValue){
        this[variableName] = variableValue;
        for(let descendant of this.descendants){
            descendant.distributeVariable(variableName, variableValue);
        }
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

    grow(forceFields){
        let nowBreakingOffProb = this.breakingOffProb;
        let nowCrowdingFactor = 1;
        if(!this.hasGrown || !this.hasSprouted) nowCrowdingFactor = this.calcCrowdingForce(this.crowdingMinDist, this.crowdingFactor, forceFields);
        if(Math.random() <= nowBreakingOffProb && this.ancestor != null){
            this.ancestor.descendants = this.ancestor.descendants.filter(desc => desc !== this);
            return false;
        }
        else{
            if(Math.random() <= this.sproutingGrowProb * nowCrowdingFactor && !this.hasGrown){
                this.createTipSprout(nowCrowdingFactor);
            }
            super.grow(forceFields, nowCrowdingFactor);
        }
    }

    createTipSprout(crowdingForce = 1){
        this.hasGrown = true;
        let awayFromCOMVec =  UTILS.normalizeVector([this.position[0] - this.centerOfMass[0], this.position[1] - this.centerOfMass[1]]);

        let growingVec = UTILS.normalizeVector([this.growVector[0] + this.influenceVector[0]*this.iVI + awayFromCOMVec[0]*this.awayFromCOMI, this.growVector[1] + this.influenceVector[1]*this.iVI + awayFromCOMVec[1]*this.awayFromCOMI]);
        growingVec = UTILS.rotateVectorZ(growingVec, UTILS.randomNumberInRange(-this.config.maxRandomRotationTip, this.config.maxRandomRotationTip));
        growingVec = UTILS.vectorMulti(growingVec, crowdingForce);
        let nextPosition = [this.position[0] + growingVec[0] * this.sproutingLength, this.position[1] + growingVec[1] * this.sproutingLength];
        let newDescendant = new MutatingNode(this.config, nextPosition, this, [], growingVec, this.influenceVector, this.centerOfMass);
        this.descendants.push(newDescendant);
    }

    createSprout(crowdingForce = 1){
        //Normalized Vector orthogonal from ancestor to this node either - or positive
        
        let vec = UTILS.rotateVectorZ(this.growVector, (Math.random() > 0.5 ? -1 : 1) * this.config.standardSproutAngle);
        let awayFromCOMVec =  UTILS.normalizeVector([this.position[0] - this.centerOfMass[0], this.position[1] - this.centerOfMass[1]]);

        //let newInfluenceVector = UTILS.normalizeVector([(this.growVector[0]+this.influenceVector[0])*this.iVI + this.awayFromCOMVec[0]*this.awayFromCOMI, (this.growVector[1]+this.influenceVector[1])*this.iVI + this.awayFromCOMVec[1]*this.awayFromCOMI]);
        //let newInfluenceVector = UTILS.normalizeVector([this.growVector[0]*this.iVI + awayFromCOMVec[0]*this.awayFromCOMI, this.growVector[1]*this.iVI + awayFromCOMVec[1]*this.awayFromCOMI]);
        //let growingVec = UTILS.normalizeVector([vec[0]+ newInfluenceVector[0], vec[1]+ newInfluenceVector[1]]);
        let growingVec = UTILS.normalizeVector([vec[0] + awayFromCOMVec[0]*this.awayFromCOMI, vec[1] + awayFromCOMVec[1]*this.awayFromCOMI]);
        
        growingVec = UTILS.rotateVectorZ(growingVec, UTILS.randomNumberInRange(-this.config.maxRandomRotationTip, this.config.maxRandomRotationTip));
        growingVec = UTILS.vectorMulti(growingVec, crowdingForce);

        let descPosition = [this.position[0] + growingVec[0]*this.sproutingLength, this.position[1] + growingVec[1]*this.sproutingLength];
        let newDescendant = new MutatingNode(this.config, descPosition, this, [], growingVec, this.growVector, this.centerOfMass);
        return newDescendant;
    }

    calculateForcePoints(){
        if (this.descendants.length === 0) {
            return [this.position];
        } else {
            let points = [];
            for (let descendant of this.descendants) {
                //Through >= 0 also the not yet growing nodes of the strokes are included
                if (descendant.age >= 0){
                    points = points.concat(descendant.calculateForcePoints());
                }
            }
            return points;
        }
    }   

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