import { Slider } from "./slider.js";
import { data } from "./data.js";

const sliderComp01 = document.getElementById("sliderComp01");

const frag = document.createDocumentFragment();
const slideTemplate = document.getElementById("slideTemplate").content;

data.forEach((entry) => {
    let clone = document.importNode(slideTemplate, true);
    let slideImage = clone.querySelector(".slide__image");
    let slideTitle = clone.querySelector(".slide__title");
    let slidePar = clone.querySelector(".slide__par");
    let slideBtn = clone.querySelector(".slide__btn");

    slideImage.src = entry.imageSrc;
    slideImage.alt = entry.imageAlt;
    slideTitle.textContent = entry.titleContent;
    slidePar.textContent = entry.paragraphContent;
    slideBtn.classList.add(entry.buttonExtraClass);
    slideBtn.href = entry.buttonHref;
    slideBtn.textContent = entry.buttonContent;

    frag.appendChild(clone);
});

sliderComp01.children[0].appendChild(frag);
sliderComp01.children[0].style.width = `${sliderComp01.children[0].childElementCount * 100}%`

const mySlider = new Slider(sliderComp01);