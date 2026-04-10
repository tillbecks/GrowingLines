import * as UTILS from "../config/utils.js";
import canvasWarning from "../canvas/canvasWarning.js";

/**
 * Finds the index of a join point in the joinPoints array that is close to the given joinPoint's intersection.
 * @param {Array} joinPoints array of join point objects with properties: strokeA, pointAIndex, strokeB, pointBIndex, intersection
 * @param {Object} joinPoint a joinPoint object to find in the array
 * @returns {number} index of the join point if found, otherwise -1
 */
export function findUsedJoinPointIndex(joinPoints, joinPoint){
    for(let i = 0; i < joinPoints.length; i++){
        if(UTILS.calcDistance(joinPoints[i].intersection, joinPoint.intersection) < 1){
            return i;
        }
    }
    return -1;
}

/**
 * Detects if adding a new join point would create a cycle by crawling through connected strokes.
 * @param {Array} joinPoints array of join point objects used to traverse the connection graph
 * @param {Object} newJoinPoint the new joinPoint to check, must have properties: strokeA, strokeB
 * @returns {boolean} true if a cycle would be created, otherwise false
 */
export function detectJoinPointCycle(joinPoints, newJoinPoint){
    if (crawlApply(joinPoints, newJoinPoint.strokeA, [], (indice, ) => {
        if(indice === newJoinPoint.strokeB){
            return true;
        }
    })) return true;
    if (crawlApply(joinPoints, newJoinPoint.strokeB, [], (indice, ) => {
        if(indice === newJoinPoint.strokeA){
            return true;
        }
    })) return true;
    return false;
}

/**
 * Removes a join point from the joinPoints array and restores start points if needed.
 * @param {Array} joinPoints array of join point objects
 * @param {Array} strokes array of strokes
 * @param {Array} strokeStarts array of start point indices
 * @param {Array} strokeStartsCache cache array for start points
 * @param {Object} joinPoint the joinPoint to remove with properties: strokeA, pointAIndex, strokeB, pointBIndex, intersection
 */
export function removeJoinPoint(joinPoints, strokes, strokeStarts, strokeStartsCache, joinPoint){
    let index = findUsedJoinPointIndex(joinPoints, joinPoint);
    if(index !== -1){
        joinPoints.splice(index, 1);
    }
}

/** 
 * Adds a join point after checking for cycles, updates start points of connected strokes.
 * @param {Array} joinPoints array of join point objects
 * @param {Array} strokeStarts array of start point indices
 * @param {Array} strokeStartsCache cache array for start points
 * @param {Object} joinPoint the joinPoint to add with properties: strokeA, pointAIndex, strokeB, pointBIndex, intersection
 */
export function addJoinPoint(joinPoints, strokeStarts, strokeStartsCache, joinPoint){
    if(detectJoinPointCycle(joinPoints, joinPoint)){
        canvasWarning("Joining these points would create a cycle. Operation cancelled.");
    }
    else{
        if(strokeStarts[joinPoint.strokeA] != null ){
            strokeStartsCache[joinPoint.strokeA] = strokeStarts[joinPoint.strokeA];
            strokeStarts[joinPoint.strokeA] = null;
        }
        else{
            crawlApply(joinPoints, joinPoint.strokeA, [], (indice, ) => {
                if(strokeStarts[indice] != null){
                    strokeStartsCache[indice] = strokeStarts[indice];
                    strokeStarts[indice] = null;
                    return true;
                }
                else{
                    return false;
                }
            })
        }
        joinPoints.push(joinPoint);
    }
}

/**
 * Checks if a stroke has a start point, either directly or through connected strokes via join points.
 * @param {Array} strokeStarts array where strokeStarts[i] contains the start point index for stroke i, or null/undefined if no direct start point
 * @param {Array} joinPoints array of join point objects used to traverse connected strokes
 * @param {number} strokeIndex the index of the stroke to check
 * @returns {boolean} true if the stroke or any connected stroke has a start point, otherwise false
 */
export function hasStartPoint(strokeStarts, joinPoints, strokeIndex){
    if (strokeStarts[strokeIndex] != null) return true;
    if (crawlApply(joinPoints, strokeIndex, [strokeIndex], (indice, ) => {
        if(strokeStarts[indice] != null){
            return true;
        }
    })) return true;
    return false;
}

/** 
 * Adds a start point to a stroke and clears start points from connected strokes.
 * @param {Array} joinPoints array of join point objects
 * @param {Array} strokeStarts array of start point indices
 * @param {Array} strokeStartsCache cache array for start points
 * @param {number} startPointIndex the index of the start point to be added
 * @param {number} strokeIndex the index of the stroke to add the start point to
 */
export function addStartPoint(joinPoints, strokeStarts, strokeStartsCache, startPointIndex, strokeIndex){
    strokeStarts[strokeIndex] = startPointIndex;
    crawlApply(joinPoints, strokeIndex, [strokeIndex], (indice, ) => {
        if(strokeStarts[indice] != null){
            strokeStartsCache[indice] = strokeStarts[indice];
            strokeStarts[indice] = null;
        }
        return false;
    });
}

/**
 * Calculates potential join points between strokes by checking for close points and line intersections.
 * Modifies the strokes and strokeStarts arrays in-place when adding intersection points.
 * @param {Array} strokes array of strokes, each stroke is an array of points
 * @param {Array} strokeStarts array of start point indices for each stroke
 * @returns {Array} array of potential join point objects with properties: strokeA, pointAIndex, strokeB, pointBIndex, intersection
 */
export function calculateJoinPoints(strokes, strokeStarts){
    const potentialJoinPoints = [];

    for(let i = 0; i < strokes.length; i++){
        for(let j = i+1; j < strokes.length; j++){
            let strokeA = strokes[i];
            let strokeB = strokes[j];
            for(let k = 0; k < strokeA.length -1; k++){
                for(let l = 0; l < strokeB.length -1; l++){
                    if(UTILS.calcDistance(strokeA[k], strokeB[l]) < 1){ 
                        potentialJoinPoints.push({strokeA: i, pointAIndex: k, strokeB: j, pointBIndex: l, intersection: strokeA[k]});
                    }
                    else{
                        let intersec = UTILS.linesIntersection(strokeA[k], strokeA[k+1], strokeB[l], strokeB[l+1]);
                        if(intersec){
                            strokeA.splice(k+1, 0, intersec);
                            strokeB.splice(l+1, 0, intersec);
                            potentialJoinPoints.push({strokeA: i, pointAIndex: k+1, strokeB: j, pointBIndex: l+1, intersection: intersec});
                            k++;
                            l++;
                            if(strokeStarts[i] > k) strokeStarts[i]++;
                            if(strokeStarts[j] > l) strokeStarts[j]++;
                        }
                    }
                }
            }
        }
    }
    return potentialJoinPoints;
}

/** 
 * Recursively applies a function to all connected strokes starting from a given stroke index.
 * @param {Array} joinPoints array of join point objects used to traverse connections
 * @param {number} thisIndice the current stroke index to process
 * @param {Array} visitedIndices array of already visited stroke indices
 * @param {Function} apply callback function(strokeIndex, previousIndex) to apply to each connected stroke, return true to stop traversal
 * @returns {boolean} true if apply returned true for any stroke, otherwise false
 */
export function crawlApply(joinPoints, thisIndice, visitedIndices, apply){
    for(let joinPoint of joinPoints){
        if(joinPoint.strokeA === thisIndice && !visitedIndices.includes(joinPoint.strokeB)){
            let visitedIndicesA = [...visitedIndices, joinPoint.strokeB];
            if(apply(joinPoint.strokeB, thisIndice)) return true;
            if(crawlApply(joinPoints, joinPoint.strokeB, visitedIndicesA, apply)) return true;
        }
        else if(joinPoint.strokeB === thisIndice && !visitedIndices.includes(joinPoint.strokeA)){
            let visitedIndicesB = [...visitedIndices, joinPoint.strokeA];
            if(apply(joinPoint.strokeA, thisIndice)) return true;
            if(crawlApply(joinPoints, joinPoint.strokeA, visitedIndicesB, apply)) return true;
        }
    }
    return false;
}
