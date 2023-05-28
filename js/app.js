import { Slider } from "./slider.js";
import { data } from "./data.js";

const sliderComp01 = document.getElementById("sliderComp01");

const frag = document.createDocumentFragment();
const slideTemplate = document.getElementById("slideTemplate").content;

data.forEach((entry) => {
    let clone = slideTemplate.cloneNode(true);
    clone.querySelector(".slide-image").src = entry.imageSrc;
    clone.querySelector(".slide-image").alt = entry.imageAlt;
    clone.querySelector(".slide-title").textContent = entry.titleContent;
    clone.getElementById("slideContent").textContent = entry.paragraphContent;
    clone.getElementById("slideBtn").classList.add(entry.buttonExtraClass);
    clone.getElementById("slideBtn").href = entry.buttonHref;
    clone.getElementById("slideBtn").textContent = entry.buttonContent;

    frag.appendChild(clone);
});

sliderComp01.children[0].appendChild(frag);
sliderComp01.children[0].style.width = `${sliderComp01.children[0].childElementCount * 100}%`

const mySlider = new Slider(sliderComp01);