/**
 * Normalizes a 2D vector to have a length of 1
 * @param {Array} vector - The vector to normalize
 * @returns {Array} The normalized vector
 */
export function normalizeVector(vector) {
    let length = Math.hypot(vector[0], vector[1]); 
    return length > 0
        ? [vector[0]/length, vector[1]/length]
        : [0,0];
}

/**
 * Calculates the directional vector between two points
 * @param {Array} point1 - The first point
 * @param {Array} point2 - The second point
 * @returns {Array} The direction vector
 */
export function directionVector(point1, point2){
    return [point2[0] - point1[0], point2[1] - point1[1]];
}

/**
 * Calculates the normalized directional vector between two points
 * @param {Array} point1 - The first point
 * @param {Array} point2 - The second point
 * @returns {Array} The normalized direction vector
 */
export function normalizedDirectionVector(point1, point2){
    return normalizeVector(directionVector(point1, point2));
}

/**
 * Rotates a 2D vector around the Z-axis by a given angle
 * @param {Array} vector - The vector to rotate
 * @param {number} angle - The angle in radians
 * @returns {Array} The rotated vector
 */
export function rotateVectorZ(vector, angle){
    let cosAngle = Math.cos(angle);
    let sinAngle = Math.sin(angle);
    return [vector[0]*cosAngle - vector[1]*sinAngle, vector[0]*sinAngle + vector[1]*cosAngle];
}

/**
 * Generates a random number within a given range
 * @param {number} min - The minimum value
 * @param {number} max - The maximum value (exclusive)
 * @returns {number} The random number
 */
export function randomNumberInRange(min, max){
    return Math.random() * (max - min) + min;
}

/**
 * Calculates the distance between two points
 * @param {Array} point1 - The first point
 * @param {Array} point2 - The second point
 * @returns {number} The distance between the points
 */
export function calcDistance(point1, point2){
    return Math.sqrt((point1[0] - point2[0])**2 + (point1[1] - point2[1])**2);
}

/**
 * Multiplies a vector by a scalar value
 * @param {Array} vector - The vector to multiply
 * @param {number} scalar - The scalar value to multiply by
 * @returns {Array} The resulting vector
 */
export function vectorMulti(vector, scalar){
    return vector.map(component => component*scalar);
}

/**
 * Transforms a stroke in the format created by the canvas drawing module into a list of coordinate tuples
 * @param {Array} stroke - The stroke to transform (in the format of [[x1, x2, ...], [y1, y2, ...], []])
 * @returns {Array} The list of coordinate tuples (e.g. [[x1, y1], [x2, y2], ...])
 */
export function transformStrokeToTuples(stroke){
    stroke = stroke.slice(0,2);
    return stroke[0].map((_, i) => [stroke[0][i], stroke[1][i]]);
}

/**
 * Fills in distant points along a stroke
 * @param {Array} stroke - The stroke to process
 * @param {number} dist - The maximum distance between points
 * @returns {Array} The processed stroke with additional points
 */
export function fillInDistantStrokePoints(stroke, dist){
    let it = 0;
    while(it < stroke.length - 1){
        let distance = calcDistance(stroke[it], stroke[it+1]);
        if(distance > dist){
            let directionVector = normalizedDirectionVector(stroke[it], stroke[it+1]);
            for(let i=1; i<distance/dist; i++){
                let newPoint = [stroke[it][0] + directionVector[0]*dist, stroke[it][1] + directionVector[1]*dist];
                stroke.splice(it+1, 0, newPoint);
                it++;
            }
        }
        it++;
    }
    return stroke;
}

/** * Preprocesses the raw stroke data by transforming it into coordinate tuples and filling in distant points
 * @param {Array} trace - The raw stroke data (array of strokes, each in the format of [[x1, x2, ...], [y1, y2, ...], []])
 * @param {number} strokeLength - The maximum distance between points on a stroke
 * @returns {Array} The preprocessed stroke data (array of strokes, each as a list of coordinate tuples)
 */
export function strokePreprocessing(trace, strokeLength){
    trace = trace.map(stroke => transformStrokeToTuples(stroke));
    return trace.map(stroke => fillInDistantStrokePoints(stroke, strokeLength)); 
}
/**
 * Calculates the intersection point of two lines
 * @param {Array} p1 - The first point of the first line
 * @param {Array} p2 - The second point of the first line
 * @param {Array} p3 - The first point of the second line
 * @param {Array} p4 - The second point of the second line
 * @param {number} eps - The epsilon value for floating-point comparison
 * @returns {Array|null} The intersection point or null if the lines are parallel or collinear
 */
export function linesIntersection(p1, p2, p3, p4, eps = 1e-2) {
    const denominator =
        (p2[0] - p1[0]) * (p4[1] - p3[1]) -
        (p2[1] - p1[1]) * (p4[0] - p3[0]);

    if (Math.abs(denominator) < eps) return null; // Parallel oder kollinear

    const ua = ((p4[0] - p3[0]) * (p1[1] - p3[1]) - (p4[1] - p3[1]) * (p1[0] - p3[0])) / denominator;
    const ub = ((p2[0] - p1[0]) * (p1[1] - p3[1]) - (p2[1] - p1[1]) * (p1[0] - p3[0])) / denominator;

    if (ua >= -eps && ua <= 1 + eps && ub >= -eps && ub <= 1 + eps) {
        return [
            p1[0] + ua * (p2[0] - p1[0]),
            p1[1] + ua * (p2[1] - p1[1]),
        ];
    }

    return null;
}

/**
 * Temporarily highlights an element
 * @param {HTMLElement} element - The element to highlight
 * @param {number} duration - The duration of the highlight in milliseconds
 */
export function highlightTemporary(element, duration = 2000) {
    element.classList.add('temporary-highlight');
    setTimeout(() => {
        element.classList.remove('temporary-highlight');
    }, duration);
}