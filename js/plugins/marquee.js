function assignStyles(element, styles) {
    for (const [property, value] of Object.entries(styles)) {
        element.style[property] = value;
    }
}
function createElement(tag = "div", styles = {}) {
    const element = document.createElement(tag);
    assignStyles(element, styles);
    return element;
}
function createMarqueeWrapper(element, options) {
    const marqueeWrapper = createElement("div", {
        height: element.offsetHeight + "px",
        overflow: "hidden",
        position: "absolute",
        inset: "0",
        borderRadius: "inherit",
    });
    const marqueeFirst = createElement("div", {
        display: "flex",
        position: "absolute",
        animationDuration: options.duration,
        animationTimingFunction: options.timingFunction,
        animationDelay: options.delay,
        animationIterationCount: options.iterationCount,
    });
    const marqueeSecond = createElement("div", {
        display: "flex",
        position: "absolute",
        animationDuration: options.duration,
        animationTimingFunction: options.timingFunction,
        animationDelay: options.delay,
        animationIterationCount: options.iterationCount,
    });
    if (options.mode === "return") {
        assignStyles(marqueeSecond, {
            display: "none",
        });
    }
    const childNodes = Array.from(element.childNodes);
    for (const node of childNodes) {
        const cloneNode1 = node.cloneNode(true);
        const cloneNode2 = node.cloneNode(true);
        marqueeFirst.appendChild(cloneNode1);
        marqueeSecond.appendChild(cloneNode2);
    }
    marqueeWrapper.appendChild(marqueeFirst);
    marqueeWrapper.appendChild(marqueeSecond);
    return { marqueeWrapper, marqueeFirst, marqueeSecond };
}
function setKeyframes(element) {
    const style = document.createElement('style');
    style.textContent = `
    @keyframes wMarqueeRepeat1 {
      0% { transform: translateX(0%); }
      100% { transform: translateX(-100%); }
    }

    @keyframes wMarqueeRepeat2 {
      0% { transform: translateX(100%); }
      100% { transform: translateX(0%); }
    }

    @keyframes wMarqueeReturn {
      0% { right: 0px; }
      100% { 
        right: ${element.clientWidth}px;
        transform: translateX(100%);
      }
    }
  `;
    document.head.appendChild(style);
}
function setRepeatEffect(marqueeFirst, marqueeSecond) {
    assignStyles(marqueeFirst, {
        animationName: "wMarqueeRepeat1",
    });
    assignStyles(marqueeSecond, {
        animationName: "wMarqueeRepeat2",
    });
}
function setReturnEffect(marqueeFirst, options) {
    assignStyles(marqueeFirst, {
        animationName: "wMarqueeReturn",
        animationDirection: "alternate",
    });
}
function addMarqueeEffect(element, options = defaultMarqueeOptions) {
    setKeyframes(element);
    const { marqueeWrapper, marqueeFirst, marqueeSecond } = createMarqueeWrapper(element, options);
    // remove and append child
    while (element.hasChildNodes()) {
        element.removeChild(element.firstChild);
    }
    element.appendChild(marqueeWrapper);
    assignStyles(element, {
        height: marqueeWrapper.offsetHeight + "px",
        position: element.style.position || "relative",
    });
    switch (options.mode) {
        case "repeat":
            setRepeatEffect(marqueeFirst, marqueeSecond);
            break;
        case "return":
            setReturnEffect(marqueeFirst, options);
            break;
        default:
            setRepeatEffect(marqueeFirst, marqueeSecond);
    }
}
const defaultMarqueeOptions = {
    duration: "10s",
    timingFunction: "linear",
    delay: "0s",
    iterationCount: "infinite",
    mode: "repeat",
};
export function marqueeInit() {
    const elements = document.querySelectorAll("[w-marquee]");
    for (const element of elements) {
        const options = {
            duration: element.getAttribute("w-duration"),
            timingFunction: element.getAttribute("w-timing-function"),
            delay: element.getAttribute("w-delay"),
            iterationCount: element.getAttribute("w-iterationCount"),
            mode: element.getAttribute("w-mode"),
        };
        for (const key in options) {
            options[key] || (options[key] = defaultMarqueeOptions[key]);
        }
        addMarqueeEffect(element, options);
    }
}
// document.addEventListener("readystatechange", function() {
//   this.readyState === "interactive" && init();
// });
