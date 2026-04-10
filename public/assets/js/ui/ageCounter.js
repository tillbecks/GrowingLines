const ageCounter = document.createElement("div");
ageCounter.classList.add('ageCounter');

let ageCounterLast = 0;
let ageCounterMax = 0; 

export function spawnWarning(){
    const canvasSection = document.getElementById("canvasSection");
    
    ageCounterLast = 0;
    ageCounterMax = 0;

    ageCounter.textContent = `Age: ${ageCounterLast} / ${ageCounterMax}`;
    
    if(canvasSection && !canvasSection.contains(ageCounter)) canvasSection.appendChild(ageCounter);
}

export function hideAgeCounter(){
    ageCounter.textContent = "";
}

export function updateAgeCounter(age, maxAge = ageCounterMax){
    ageCounterLast = age;
    ageCounterMax = maxAge;
    ageCounter.textContent = `Age: ${age} / ${maxAge}`;

}

export function reviveAgeCounter(){
    ageCounter.textContent = `Age: ${ageCounterLast} / ${ageCounterMax}`;
}

export function resetAgeCounter(){
    ageCounterLast = 0;
    ageCounterMax = 0;
    ageCounter.textContent = `Age: ${ageCounterLast} / ${ageCounterMax}`;
}