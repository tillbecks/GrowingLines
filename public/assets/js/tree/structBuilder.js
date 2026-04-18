import * as TREE from "./tree.js";

export function createStructRootsFromStrokes(strokes, strokeStarts, joinPoints, config){
    let strokeStructs = [];

    for(let i=0; i<strokes.length;i++){
        if(strokeStarts[i] != null){
            let newStruct = createStructsFromStrokes(strokes, i, strokeStarts[i], joinPoints, config);
            let com = newStruct.calculateCOM();
            newStruct.distributeVariable("centerOfMass", [com[1]/com[0], com[2]/com[0]]);
            strokeStructs.push(newStruct);
        }
    }

    return strokeStructs;
}

function createStructsFromStrokes(strokes, strokeIndex, startPointPosition, joinPoints, config, direction = 0){ //Direction: 0 = both, 1 = left/down 2 = right/up
        let com = 0;
        let start = startPointPosition;
        let stroke = strokes[strokeIndex];
        let strokeRoot = new TREE.Node(config, stroke[start], null, [], []);

        //All joins, that contain this stroke
        let joinedPoints = joinPoints.filter(joinPoint => joinPoint.strokeA === strokeIndex || joinPoint.strokeB === strokeIndex);
        //Indices of joins in this stroke
        let joinedIndices = joinedPoints.map(jp => jp.strokeA === strokeIndex ? jp.pointAIndex : jp.pointBIndex);

        //Filtering out all used joins for further recursion
        joinPoints = joinPoints.filter(jp => joinedPoints.indexOf(jp) === -1);

        //Creating a struct that contain the relevant Information
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
    
        if(direction !== 2){
            for(let i=start; i>=0;i--){
                if(i!== start){
                    thisNode = new TREE.Node(config, stroke[i], lastNode, [], [], com);
                    lastNode.descendants.push(thisNode);
                    lastNode = thisNode;
                }
                let joinPointIndex = joinedIndices.indexOf(i);
                if(joinPointIndex !== -1){
                    if(joinedPoints[joinPointIndex].otherPointIndex-1 >= 0){
                        let descendantA = createStructsFromStrokes(strokes, joinedPoints[joinPointIndex].otherStrokeIndex, joinedPoints[joinPointIndex].otherPointIndex-1, joinPoints, config, 1);
                        descendantA.ancestor = lastNode;
                        lastNode.descendants.push(descendantA);
                    }
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
            for(let i=start; i<stroke.length; i++){
                if(i!== start){
                    thisNode = new TREE.Node(config, stroke[i], lastNode, [], [], com);
                    lastNode.descendants.push(thisNode);
                    lastNode = thisNode;
                }
                let joinPointIndex = joinedIndices.indexOf(i);
                if(joinPointIndex !== -1){
                    if(joinedPoints[joinPointIndex].otherPointIndex-1 >= 0){
                        let descendantA = createStructsFromStrokes(strokes, joinedPoints[joinPointIndex].otherStrokeIndex, joinedPoints[joinPointIndex].otherPointIndex-1, joinPoints, config, 1);
                        descendantA.ancestor = lastNode;
                        lastNode.descendants.push(descendantA);
                    }
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

