import { CameraService } from "../services";
import { timeScale } from "../constants/constants";
import { Body } from "../shapes";

export class HUDController {
  cameraService;

  acelerarButton = document.getElementById("acelerar");
  decelerarButton = document.getElementById("decelerar");
  isHUDHide = false;
  hideHUD = document.getElementById("hideHUD");
  velocityNumber = document.getElementById("velocity");
  planetsButtons = document.getElementById("planetButtons");

  orbitsButton = document.getElementById("orbits");
  timeScale;
  bodies: Body[];
  constructor(
    timeScale: { scale: number },
    obitsVisible: { visible: boolean },
    bodies: Body[]
  ) {
    this.bodies = bodies;
    this.timeScale = timeScale;
    this.cameraService = CameraService.getInstance([]);
    this.initializeButtonPlanets();
    this.initializeSpeedButtons();
    this.initilizeHideButton();
    this.initializeOrbitsButton(obitsVisible);
  }
  acelerate(timeScale: { scale: number }) {
    if (!this.velocityNumber) return;
    const currentVelocity = Number(this.velocityNumber.innerHTML);
    if (timeScale.scale <= -1 && timeScale.scale >= -1.1) {
      timeScale.scale /= -1;
      this.velocityNumber.innerHTML = `${currentVelocity * -1}`;
    } else if (timeScale.scale < 0) {
      timeScale.scale /= 10;
      this.velocityNumber.innerHTML = `${currentVelocity / 10}`;
    } else if (timeScale.scale > 0 && timeScale.scale <= 1e6) {
      timeScale.scale *= 10;
      this.velocityNumber.innerHTML = `${currentVelocity * 10}`;
    }
  }

  decelerate(timeScale: { scale: number }) {
    if (!this.velocityNumber) return;

    const currentVelocity = Number(this.velocityNumber.innerHTML);

    if (timeScale.scale >= 1 && timeScale.scale <= 1.1) {
      timeScale.scale /= -1;
      this.velocityNumber.innerHTML = `${currentVelocity * -1}`;
    } else if (timeScale.scale < 0 && timeScale.scale >= -1e6) {
      timeScale.scale *= 10;
      this.velocityNumber.innerHTML = `${currentVelocity * 10}`;
    } else if (timeScale.scale > 0) {
      timeScale.scale /= 10;
      this.velocityNumber.innerHTML = `${currentVelocity / 10}`;
    }
  }
  initializeOrbitsButton(orbitsVisible: { visible: boolean }) {
    if (!this.orbitsButton) return;

    this.orbitsButton.addEventListener("click", () => {
      orbitsVisible.visible = !orbitsVisible.visible;
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

  initializeSpeedButtons() {
    if (!this.velocityNumber) return;
    this.velocityNumber.innerHTML = this.timeScale.scale.toString();
    if (!this.acelerarButton || !this.decelerarButton) return;
    this.acelerarButton.addEventListener("click", () => {
      this.acelerate(this.timeScale);
    });

    this.decelerarButton.addEventListener("click", () => {
      this.decelerate(this.timeScale);
    });
  }

  initilizeHideButton() {
    if (
      !this.hideHUD ||
      !this.acelerarButton ||
      !this.decelerarButton ||
      !this.velocityNumber ||
      !this.orbitsButton
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
      this.acelerarButton!.style.visibility = visibility;
      this.decelerarButton!.style.visibility = visibility;
      this.velocityNumber!.style.visibility = visibility;
    });
  }
}
