import { CameraService } from "../services";
import { timeScale } from "../constants/constants";
import { Body } from "../shapes/Body";
import { $ } from "../utils/domSelector";

export class HUDController {
  cameraService;

  slider = $("#myRange") as HTMLInputElement;
  sliderNumber = $("#sliderNumber");

  isHUDHide = false;
  hideHUD = $("#hideHUD");
  velocityNumber = $("#velocity");
  planetsButtons = $("#planetButtons");
  gravityButton = $("#gravityButton");

  orbitsButton = $("#orbits");
  timeScale;
  bodies: Body[];
  constructor(
    timeScale: { scale: number },
    obitsVisible: { visible: boolean },
    gravity: { gravityFlag: boolean },
    bodies: Body[]
  ) {
    this.bodies = bodies;
    this.timeScale = timeScale;
    this.cameraService = CameraService.getInstance([]);
    this.initializeButtonPlanets();
    this.initilizeHideButton();
    this.initializeOrbitsButton(obitsVisible);
    this.initializeSlider();
    this.initializeGravityButton(gravity);
  }

  initializeOrbitsButton(orbitsVisible: { visible: boolean }) {
    if (!this.orbitsButton) return;

    this.orbitsButton.addEventListener("click", () => {
      orbitsVisible.visible = !orbitsVisible.visible;
    });
  }

  initializeGravityButton(gravity: { gravityFlag: boolean }) {
    if (!this.gravityButton) {
      return;
    }

    this.gravityButton.addEventListener("click", () => {
      gravity.gravityFlag = !gravity.gravityFlag;
    });
  }
  initializeButtonPlanets() {
    if (!this.planetsButtons) return;
    this.planetsButtons.addEventListener("click", (event) => {
      if (!event.target) return;
      const target = event.target as HTMLElement;

      if (target.matches("button")) {
        this.cameraService.changeCamera(target.innerHTML);
        console.log(target.innerHTML);
      }
    });
  }

  initializeSlider() {
    if (!this.slider || !this.sliderNumber) return;
    this.sliderNumber!.innerHTML = "x" + timeScale.scale;
    const sensitivityCurve = 5;
    const maxScale = 1e7;

    this.slider.addEventListener("input", () => {
      this.updateSlider(maxScale, sensitivityCurve);
    });
  }

  setSlider(scale: number) {
    this.sliderNumber!.innerHTML = "x" + scale;
    this.timeScale.scale = scale;
    this.slider.inputMode = scale.toString();
    this.slider.value = scale.toString();
  }

  updateSlider(maxScale: number, sensitivityCurve: number) {
    const rawValue = parseFloat(this.slider.value);

    const normalized = rawValue / 100;
    const scaledValue =
      Math.sign(normalized) *
      Math.pow(Math.abs(normalized), sensitivityCurve) *
      maxScale;
    this.sliderNumber!.innerHTML = "x" + Number(scaledValue.toFixed());
    this.timeScale.scale = scaledValue;
  }

  initilizeHideButton() {
    if (
      !this.hideHUD ||
      !this.slider ||
      !this.sliderNumber ||
      !this.orbitsButton ||
      !this.gravityButton
    ) {
      return;
    }

    this.hideHUD.addEventListener("click", () => {
      let visibility;
      if (this.isHUDHide) {
        visibility = "visible";
        this.isHUDHide = false;
        this.hideHUD!.style.opacity = "1";
      } else {
        visibility = "hidden";
        this.isHUDHide = true;
        this.hideHUD!.style.opacity = "0.2";
      }

      Array.from(this.planetsButtons!.children).forEach((button) => {
        if (button instanceof HTMLElement) {
          button.style.visibility = visibility;
        }
      });

      this.orbitsButton!.style.visibility = visibility;
      this.slider!.style.visibility = visibility;
      this.sliderNumber!.style.visibility = visibility;
      this.gravityButton!.style.visibility = visibility;
    });
  }
}
