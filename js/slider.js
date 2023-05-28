export class Slider {
    constructor(el, options) {
        this.config = Object.assign({
            attr: "data-slider",
            length: 0,
            width: 0,
            threshold: 35,
        }, options);

        if (!el) {
            throw new Error("HTML Element undetected. A valid HTML element is required!");
        }

        if (!el.hasAttribute(`${this.config.attr}-component`)) {
            throw new Error(`Required "${this.config.attr}-component" attribute!`);
        }

        let container = el.querySelector(`[${this.config.attr}-container]`);
        if (!container) {
            throw new Error(`Required "${this.config.attr}-container" attribute!`)
        }

        this.config.sliderComponent = el;
        this.config.sliderContainer = container;
        this.config.length = this.config.sliderContainer.childElementCount;
        this.config.width = this.config.sliderComponent.getBoundingClientRect().width;

        this.init();
        this.initState();
    }

    //+++++++++++++++++  Main methods  +++++++++++++++++
    // Method -> "init"
    init() {
        // Event Listeners
        window.addEventListener("resize", () => {
            this.config.width = this.config.sliderComponent.getBoundingClientRect().width;
        });
        this.config.sliderComponent.addEventListener("click", (e) => { this.click(e) });
        this.config.sliderComponent.addEventListener("touchstart", (e) => { this.touchStart(e) });
        this.config.sliderComponent.addEventListener("touchmove", (e) => { this.touchMove(e) });
        this.config.sliderComponent.addEventListener("touchend", (e) => { this.touchEnd(e) });
    }

    //    Method: "initState":
    initState() {
        this.state = {
            index: 0,
            start: undefined,
            isSwiping: false,
            swipingDistance: 0,
        }
    }

    //    Method: "loadState":
    loadState() {
        this.state.index = this.getSlideIndex();
    }

    //    Method: "applyChanges":
    applyChanges() {
        //Clamp index( avoiding the index to have non-accepted values )
        if (this.state.index < 0) {
            this.state.index = 0;
        } else if (this.state.index >= this.config.length) {
            this.state.index = this.config.length - 1;
        }

        //Set "left" position of slider
        this.config.sliderContainer.style.left = `${(this.state.index * -100) + this.swipingDistancePercentage()}%`

        //A change of classes when the swiping process are active
        this.config.sliderContainer.classList[this.state.isSwiping ? "add" : "remove"]("swiping");
    }


    //+++++++++++++++++  Event listener methods  +++++++++++++++++

    //    Method: "click":
    click(e) {
        //Determine the click type:
        const prevClick = e.target.matches(`[${this.config.attr}-prev], [${this.config.attr}-prev] *`);
        const nextClick = !prevClick && e.target.matches(`[${this.config.attr}-next], [${this.config.attr}-next] *`);

        //What happens if it's not a [data-slider-*] click?
        if (!prevClick && !nextClick) {
            return
        }

        //Prevent default click:
        e.preventDefault();

        //Call the "navigate" method:
        this.navigate(nextClick);
    }

    //    Method: "touchStart":
    touchStart(e) {
        //We want only a single touch:
        if (e.touches.length !== 1) {
            return
        }

        //What if touch outside of the slider -> not a [data-slider] touch
        if (!e.target.matches(`[${this.config.attr}-container], [${this.config.attr}-container] *`)) {
            return
        }

        //Load state
        this.loadState();

        //Recording starting x position
        this.state.start = e.touches[0].screenX;

        //Start swiping
        this.state.isSwiping = true;
    }

    //    Method: "touchMove":
    touchMove(e) {
        //Not a single touch
        if (e.touches.length !== 1) {
            return
        }

        //Only when swiping
        if (this.state.isSwiping) {

            //Update state
            this.state.swipingDistance = e.touches[0].screenX - this.state.start;

            //Apply corresponding changes
            this.applyChanges();
        }
    }

    //    Method: "touchEnd":
    touchEnd(e) {

        //Get swiping distance percentage
        const distance = this.swipingDistancePercentage();

        //Swipe
        if (distance <= this.config.threshold * -1) {
            this.navigate(true);
        } else if (distance >= this.config.threshold) {
            this.navigate(false);
        }

        //Update state
        this.state.isSwiping = false;
        this.state.swipingDistance = 0;

        //Apply corresponding changes
        this.applyChanges();
    }


    //+++++++++++++++++  Complementary ("utility") methods  +++++++++++++++++

    //    Method: "getSlideIndex":
    getSlideIndex() {
        //Get left value from the container
        let left = this.config.sliderContainer.style.left || "0%";
        left = parseInt(left.replace(/[%-]/g, ""));

        //Round the value to the nearest index
        return Math.round(left / 100);
    }

    //    Method: "navigate":
    navigate(forward = true) {
        //Load slider state
        this.loadState();

        //Update state
        if (forward) {
            this.state.index++;
        } else {
            this.state.index--;
        }

        //Apply corresponding changes
        this.applyChanges();
    }

    //    Method: "swipingDistancePercentage":
    swipingDistancePercentage() {
        return (this.state.swipingDistance / this.config.width) * 100
    }
}