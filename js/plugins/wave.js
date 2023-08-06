function parseDuration(duration) {
    const time = parseFloat(duration.split('m')[0].split('s')[0]);
    const millisecond = time * (duration.includes('m') ? 1 : 1000);
    return millisecond;
}
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
function createWaveWrapper(options) {
    const waveWrapper = createElement("div", {
        overflow: "hidden",
        position: "absolute",
        inset: "0",
        borderRadius: "inherit",
    });
    const wave = createElement("div", {
        width: "0px",
        aspectRatio: "1/1",
        position: "absolute",
        transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        backgroundColor: options.background,
        transition: `width ${options.duration} ${options.timingFunction}`,
    });
    waveWrapper.appendChild(wave);
    return { waveWrapper, wave };
}
function getTransformMousePosition(element, event) {
    const rect = element.getBoundingClientRect();
    const { clientY, clientX } = event;
    const computedStyle = window.getComputedStyle(element);
    const y = clientY - rect.top;
    const x = clientX - rect.left;
    const scale = parseFloat(computedStyle.getPropertyValue("scale")) || 1;
    const scaleY = y / scale;
    const scaleX = x / scale;
    const rotateDegree = parseFloat(computedStyle.getPropertyValue("rotate")) || 0;
    const rotateRadian = (rotateDegree * Math.PI) / 180;
    const rotateY = scaleX * -1 * Math.sin(rotateRadian) + scaleY * Math.cos(rotateRadian);
    const rotateX = scaleX * Math.cos(rotateRadian) + scaleY * Math.sin(rotateRadian);
    const transformY = rotateY;
    const transformX = rotateX;
    return { x: transformX, y: transformY };
}
function enterWaveStyles(wave, options, styleValues) {
    assignStyles(wave, {
        width: styleValues.waveSideLengh + "px",
        top: styleValues.y + "px",
        left: styleValues.x + "px",
        opacity: "1",
        transition: `width ${options.duration} ${options.timingFunction}`,
    });
}
function leaveWaveStyles(wave, options) {
    assignStyles(wave, {
        width: "0",
        opacity: "0",
        transition: [
            `opacity ${options.fadeOutDuration} 0s ${options.timingFunction}`,
            `width 0s ${options.fadeOutDuration}`
        ].join(',')
    });
}
function addWaveEffect(element, options = defaultWaveOptions) {
    const { waveWrapper, wave } = createWaveWrapper(options);
    element.appendChild(waveWrapper);
    assignStyles(element, {
        position: element.style.position || "relative",
    });
    let timeout = null;
    element.addEventListener(options.event, function (event) {
        console.log(options.event);
        if (timeout) {
            clearTimeout(timeout);
            assignStyles(wave, {
                width: "0",
                opacity: "0",
                transition: "none",
            });
        }
        const w2 = element.offsetWidth * element.offsetWidth;
        const h2 = element.offsetHeight * element.offsetHeight;
        const waveSideLengh = Math.sqrt(w2 + h2) << 1;
        const { x, y } = getTransformMousePosition(element, event);
        enterWaveStyles(wave, options, { waveSideLengh, x, y });
        if (options.mode === "unkeep") {
            timeout = setTimeout(() => { leaveWaveStyles(wave, options); }, parseDuration(options.duration));
        }
    });
    if (options.mode === "keep") {
        let keepUnlockEvent = "";
        switch (options.event) {
            case "mousedown":
                keepUnlockEvent = "mouseup";
                break;
            case "mouseenter":
                keepUnlockEvent = "mouseleave";
                break;
            default:
                keepUnlockEvent = "mouseleave";
        }
        element.addEventListener(keepUnlockEvent, () => {
            leaveWaveStyles(wave, options);
        });
    }
}
const defaultWaveOptions = {
    event: "mousedown",
    background: "#fa06",
    duration: "250ms",
    fadeOutDuration: "250ms",
    timingFunction: "",
    mode: "unkeep",
};
export function waveInit() {
    const elements = document.querySelectorAll("[w-wave]");
    for (const element of elements) {
        const options = {
            event: element.getAttribute("w-event"),
            background: element.getAttribute("w-background"),
            duration: element.getAttribute("w-duration"),
            fadeOutDuration: element.getAttribute("w-fadeout-duration"),
            timingFunction: element.getAttribute("w-timing-function"),
            mode: element.getAttribute("w-mode"),
        };
        for (const key in options) {
            options[key] || (options[key] = defaultWaveOptions[key]);
        }
        addWaveEffect(element, options);
    }
}
// document.addEventListener("readystatechange", function() {
//   this.readyState === "interactive" && init();
// });
