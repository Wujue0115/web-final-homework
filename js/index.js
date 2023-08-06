import { waveInit } from "./plugins/wave.js";
import { marqueeInit } from "./plugins/marquee.js";

waveInit();
marqueeInit();

const btns = [
  ...document.querySelectorAll(".c-btn-dialog"),
  ...document.querySelectorAll(".c-btn"),
];
for (const btn of btns) {
  btn.addEventListener("mouseenter", () => {
    btn.classList.remove("leave");
    btn.classList.add("enter");
  });
  btn.addEventListener("mouseleave", () => {
    btn.classList.remove("enter");
    btn.classList.add("leave");
  });
}

const baseWidth = 1440;
window.addEventListener("resize", (event) => {
  const html = document.querySelector("html");

  const widthRatio = html.offsetWidth / baseWidth;

  html.style.fontSize = 16 * widthRatio + "px";
});
