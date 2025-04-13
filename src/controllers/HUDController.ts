import { CameraService } from "../services";
import { timeScale } from "../constants/constants";
import { Body } from "../shapes/Body";
import { $ } from "../utils/domSelector";

export class HUDController {
  cameraService;

  slider = $("#myRange") as HTMLInputElement;
  sliderNumber = $("#sliderNumber");

  isHUDHide = false;
  hideHUD = $(".hide-hud-button");
  velocityNumber = $("#velocity");
  planetsButtons = $(".menu-planets");
  moonsButtons = $(".menu-moons");
  gravityButton = $(".gravityButton");

  orbitsButton = $(".orbitButton");
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
    this.initializeButtonPlanets(gravity);
    this.initilizeHideButton();
    this.initializeOrbitsButton(obitsVisible, gravity);
    this.initializeSlider();
    this.initializeGravityButton(gravity, obitsVisible);
  }

  initializeOrbitsButton(
    orbitsVisible: { visible: boolean },
    gravity: { gravityFlag: boolean }
  ) {
    if (!this.orbitsButton) return;

    this.orbitsButton.addEventListener("click", () => {
      if (gravity.gravityFlag) return;
      orbitsVisible.visible = !orbitsVisible.visible;
      if (orbitsVisible.visible && !gravity.gravityFlag) {
        this.orbitsButton!.style.opacity = "1";
      } else {
        this.orbitsButton!.style.opacity = "0.2";
      }
    });
  }

  initializeGravityButton(
    gravity: { gravityFlag: boolean },
    orbitsVisible: { visible: boolean }
  ) {
    if (!this.gravityButton) {
      return;
    }

    this.gravityButton.addEventListener("click", () => {
      gravity.gravityFlag = !gravity.gravityFlag;
      if (gravity.gravityFlag) {
        this.orbitsButton!.style.opacity = "0.2";
        this.moonsButtons!.style.opacity = "0.2";
        this.gravityButton!.style.opacity = "1";

        this.orbitsButton!.innerHTML = "🔒";
      } else {
        if (orbitsVisible.visible) {
          this.orbitsButton!.style.opacity = "1";
        } else {
          this.orbitsButton!.style.opacity = "0.2";
        }
        this.moonsButtons!.style.opacity = "1";

        this.gravityButton!.style.opacity = "0.2";

        this.orbitsButton!.innerHTML = "💫";
      }
    });
  }
  initializeButtonPlanets(gravity: { gravityFlag: boolean }) {
    if (!this.planetsButtons && !this.moonsButtons) return;
    this.planetsButtons!.addEventListener("click", (event) => {
      if (!event.target) return;
      const target = event.target as HTMLElement;

      if (target.matches("button")) {
        this.cameraService.changeCamera(target.innerHTML);
        console.log(target.innerHTML);
      }
    });

    this.moonsButtons!.addEventListener("click", (event) => {
      if (!event.target) return;
      if (gravity.gravityFlag) return;
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
      !this.gravityButton ||
      !this.planetsButtons ||
      !this.moonsButtons
    ) {
      return;
    }

    this.hideHUD.addEventListener("click", () => {
      let visibility;
      let opacity;
      if (this.isHUDHide) {
        visibility = "visible";
        opacity = "1";
        this.hideHUD!.style.opacity = opacity;
        this.isHUDHide = false;
      } else {
        visibility = "hidden";
        opacity = "0";
        this.hideHUD!.style.opacity = "0.2";
        this.isHUDHide = true;
      }

      this.planetsButtons!.style.opacity = opacity;
      this.moonsButtons!.style.opacity = opacity;
      this.orbitsButton!.style.opacity = opacity;
      this.slider!.style.opacity = opacity;
      this.sliderNumber!.style.opacity = opacity;
      this.gravityButton!.style.opacity = opacity;

      this.planetsButtons!.style.visibility = visibility;
      this.moonsButtons!.style.visibility = visibility;
      this.orbitsButton!.style.visibility = visibility;
      this.slider!.style.visibility = visibility;
      this.sliderNumber!.style.visibility = visibility;
      this.gravityButton!.style.visibility = visibility;
    });
  }
}
