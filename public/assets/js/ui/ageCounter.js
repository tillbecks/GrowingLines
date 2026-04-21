import { PROXIMITYTHRESHOLD } from "../config/appConfig.js";
import dom from "../state/domState.js";

export const ageCounter = document.createElement("div");
ageCounter.classList.add('ageCounter');

let softHide = false;
let hardHide = false;
let ageCounterLast = 0;
let ageCounterMax = 0;
let lastRect = null;

export function spawnCounter(maxAge = 0){
    ageCounterLast = 0;
    ageCounterMax = maxAge;

    ageCounter.textContent = `Age: ${ageCounterLast} / ${ageCounterMax}`;
    
    // Hide ageCounter when clicked
    ageCounter.addEventListener("mousedown", hideAgeCounter);
    
    if(dom.canvasAgeSection && !dom.canvasAgeSection.contains(ageCounter)) dom.canvasAgeSection.appendChild(ageCounter);
}

export function softHideAgeCounter(){
    if(!softHide){
        softHide = true;
        if(!hardHide){
            ageCounter.classList.add("hidden");
        }
    }
}

export function hideAgeCounter(){
    if(!hardHide){
        hardHide = true;
        ageCounter.classList.add("hidden");
    }
}

export function updateAgeCounter(age, maxAge = ageCounterMax){
    ageCounterLast = age;
    ageCounterMax = maxAge;
    ageCounter.textContent = `Age: ${age} / ${maxAge}`;

}

export function softReviveAgeCounter(){
    if(softHide){
        softHide = false;
        if(!hardHide){
            ageCounter.classList.remove("hidden");
            ageCounter.textContent = `Age: ${ageCounterLast} / ${ageCounterMax}`;
        }
    }
}

export function reviveAgeCounter(){
    if(hardHide){
        hardHide = false;
        ageCounter.classList.remove("hidden");
        ageCounter.textContent = `Age: ${ageCounterLast} / ${ageCounterMax}`;
    }
}

export function resetAgeCounter(){
    ageCounterLast = 0;
    ageCounterMax = 0;
    ageCounter.textContent = `Age: ${ageCounterLast} / ${ageCounterMax}`;
}

export function nearAgeCounter(mouseX, mouseY){
    if(!hardHide && !softHide){
        lastRect = ageCounter.getBoundingClientRect();
    }
    return mouseX >= lastRect.left - PROXIMITYTHRESHOLD && mouseX <= lastRect.right + PROXIMITYTHRESHOLD && mouseY >= lastRect.top - PROXIMITYTHRESHOLD && mouseY <= lastRect.bottom + PROXIMITYTHRESHOLD;
}

export function handleMouseMove(event){
    if(nearAgeCounter(event.clientX, event.clientY)){
        softHideAgeCounter();
    }else{
        softReviveAgeCounter();
    }
}
