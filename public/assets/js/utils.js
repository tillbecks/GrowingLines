export function normalizeVector(vector) {
    let length = Math.hypot(vector[0], vector[1]); 
    return length > 0
        ? [vector[0]/length, vector[1]/length]
        : [0,0];
}

export function directionVector(point1, point2){
    return [point2[0] - point1[0], point2[1] - point1[1]];
}

export function normalizedDirectionVector(point1, point2){
    return normalizeVector(directionVector(point1, point2));
}

export function rotateVectorZ(vector, angle){
    let cosAngle = Math.cos(angle);
    let sinAngle = Math.sin(angle);
    return [vector[0]*cosAngle - vector[1]*sinAngle, vector[0]*sinAngle + vector[1]*cosAngle];
}

export function randomNumberInRange(min, max){
    return Math.random() * (max - min) + min;
}

export function calcDistance(point1, point2){
    return Math.sqrt((point1[0] - point2[0])**2 + (point1[1] - point2[1])**2);
}

export function vectorMulti(vector, scalar){
    return vector.map(component => component*scalar);
}

export function transformStrokeToTuples(stroke){
    stroke = stroke.slice(0,2);
    return stroke[0].map((_, i) => [stroke[0][i], stroke[1][i]]);
}

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

export function calcCOMFromPoints(points){
    let centerOfMass = [0,0];
    for(let point of points){
        centerOfMass[0] += point[0];
        centerOfMass[1] += point[1];
    }
    centerOfMass[0] /= points.length;
    centerOfMass[1] /= points.length;
    return centerOfMass;
}

export function linesIntersection(p1, p2, p3, p4){
    let denominator = (p2[0] - p1[0]) * (p4[1] - p3[1]) - (p2[1] - p1[1]) * (p4[0] - p3[0]);
    if(denominator === 0) return null; // Lines are parallel

    let ua = ((p4[0] - p3[0]) * (p1[1] - p3[1]) - (p4[1] - p3[1]) * (p1[0] - p3[0])) / denominator;
    let ub = ((p2[0] - p1[0]) * (p1[1] - p3[1]) - (p2[1] - p1[1]) * (p1[0] - p3[0])) / denominator;

    if(ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1){
        return [p1[0] + ua * (p2[0] - p1[0]), p1[1] + ua * (p2[1] - p1[1])];
    }
    return null; // No intersection within the line segments
}