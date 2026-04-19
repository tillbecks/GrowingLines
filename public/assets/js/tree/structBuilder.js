import * as TREE from "./tree.js";

/**
 * Creates root nodes for each stroke that has a start point. 
 * @param {*} strokes 
 * @param {*} strokeStarts 
 * @param {*} joinPoints 
 * @param {*} config 
 * @returns 
 */
export function createStructRootsFromStrokes(strokes, strokeStarts, joinPoints, config){
    let strokeStructs = [];

    for(let i=0; i<strokes.length;i++){
        //Because multiple strokes can share a start point, we start creating a struct only from set start point.
        if(strokeStarts[i] != null){
            let newStruct = createStructsFromStrokes(strokes, i, strokeStarts[i], joinPoints, config);
            let com = newStruct.calculateCOM();
            newStruct.distributeVariable("centerOfMass", [com[1]/com[0], com[2]/com[0]]);
            strokeStructs.push(newStruct);
        }
    }

    return strokeStructs;
}

/**
 * Recursively creates tree node structures from the given strokes, starting from a specified start point and following the join points to connect related strokes. 
 * @param {*} strokes 
 * @param {*} strokeIndex 
 * @param {*} startPointPosition 
 * @param {*} joinPoints 
 * @param {*} config 
 * @param {*} direction - Indicates the direction of traversal: 0 for both directions, 1 for backward only, 2 for forward only
 * @returns 
 */
function createStructsFromStrokes(strokes, strokeIndex, startPointPosition, joinPoints, config, direction = 0){ 
        let start = startPointPosition;
        let stroke = strokes[strokeIndex];
        let strokeRoot = new TREE.Node(config, stroke[start], null, [], []);

        //All joins, that contain this stroke
        let joinedPoints = joinPoints.filter(joinPoint => joinPoint.strokeA === strokeIndex || joinPoint.strokeB === strokeIndex);
        //Indices of joins in this stroke
        let joinedIndices = joinedPoints.map(jp => jp.strokeA === strokeIndex ? jp.pointAIndex : jp.pointBIndex);

        //Filtering out all used joins for further recursion
        joinPoints = joinPoints.filter(jp => joinedPoints.indexOf(jp) === -1);

        //Creating a struct that contains the relevant information for the recursive calls and easier access to the join point information
        joinedPoints = joinedPoints.map(jp => {
            if(jp.strokeA === strokeIndex){
                return{ownPointIndex: jp.pointAIndex, otherStrokeIndex: jp.strokeB, otherPointIndex: jp.pointBIndex};
            }
            else{
                return{ownPointIndex: jp.pointBIndex, otherStrokeIndex: jp.strokeA, otherPointIndex: jp.pointAIndex};
            }
        });


        let lastNode = strokeRoot;
        let thisNode;
    
        //Depending on the direction parameter, we first create the struct in one direction and then the other, or only in one of the directions. This is to avoid creating duplicate structs
        if(direction !== 2){
            //Iterating down from the start point
            for(let i=start; i>=0;i--){
                if(i!== start){
                    thisNode = new TREE.Node(config, stroke[i], lastNode, [], []);
                    lastNode.descendants.push(thisNode);
                    lastNode = thisNode;
                }

                //If there is a join point at this position, we start creating a struct in the other stroke that is connected to this join point. We also check if the join point is not at the end of the stroke, because otherwise there would be no new struct created and we would create duplicate structs.
                let joinPointIndex = joinedIndices.indexOf(i);
                if(joinPointIndex !== -1){
                    //Start creating the struct of the connected stroke iterating down from the join point
                    if(joinedPoints[joinPointIndex].otherPointIndex-1 >= 0){
                        let descendantA = createStructsFromStrokes(strokes, joinedPoints[joinPointIndex].otherStrokeIndex, joinedPoints[joinPointIndex].otherPointIndex-1, joinPoints, config, 1);
                        descendantA.ancestor = lastNode;
                        lastNode.descendants.push(descendantA);
                    }
                    //Start creating the struct of the connected stroke iterating up from the join point
                    if(joinedPoints[joinPointIndex].otherPointIndex+1 < strokes[joinedPoints[joinPointIndex].otherStrokeIndex].length){
                        let descendantB = createStructsFromStrokes(strokes, joinedPoints[joinPointIndex].otherStrokeIndex, joinedPoints[joinPointIndex].otherPointIndex+1, joinPoints, config, 2);
                        descendantB.ancestor = lastNode;
                        lastNode.descendants.push(descendantB);
                    }
                }
            }
        }
        if (direction !== 1){
            lastNode = strokeRoot;
            //Iterating up from the start point
            for(let i=start; i<stroke.length; i++){
                if(i!== start){
                    thisNode = new TREE.Node(config, stroke[i], lastNode, [], []);
                    lastNode.descendants.push(thisNode);
                    lastNode = thisNode;
                }
                //If there is a join point at this position, we start creating a struct in the other stroke that is connected to this join point. We also check if the join point is not at the end of the stroke, because otherwise there would be no new struct created and we would create duplicate structs.
                let joinPointIndex = joinedIndices.indexOf(i);
                if(joinPointIndex !== -1){
                    //Start creating the struct of the connected stroke iterating down from the join point
                    if(joinedPoints[joinPointIndex].otherPointIndex-1 >= 0){
                        let descendantA = createStructsFromStrokes(strokes, joinedPoints[joinPointIndex].otherStrokeIndex, joinedPoints[joinPointIndex].otherPointIndex-1, joinPoints, config, 1);
                        descendantA.ancestor = lastNode;
                        lastNode.descendants.push(descendantA);
                    }
                    //Start creating the struct of the connected stroke iterating up from the join point
                    if(joinedPoints[joinPointIndex].otherPointIndex+1 < strokes[joinedPoints[joinPointIndex].otherStrokeIndex].length){
                        let descendantB = createStructsFromStrokes(strokes, joinedPoints[joinPointIndex].otherStrokeIndex, joinedPoints[joinPointIndex].otherPointIndex+1, joinPoints, config, 2);
                        descendantB.ancestor = lastNode;
                        lastNode.descendants.push(descendantB);
                    }
                }
            }
        }

        return strokeRoot;
}

