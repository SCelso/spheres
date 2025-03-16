import { CameraService } from "../services";

export class HUDController {
  cameraService;

  acelerarButton = document.getElementById("acelerar");
  decelerarButton = document.getElementById("decelerar");
  isHUDHide = false;
  hideHUD = document.getElementById("hideHUD");
  velocityNumber = document.getElementById("velocity");
  planetsButtons = document.getElementById("planetButtons");

  orbitsButton = document.getElementById("orbits");

  constructor(
    timeScale: { scale: number },
    obitsVisible: { visible: boolean }
  ) {
    this.cameraService = CameraService.getInstance([]);
    this.initializeButtonPlanets();
    this.initializeSpeedButtons(timeScale);
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
      timeScale.scale *= 10;
      this.velocityNumber.innerHTML = `${currentVelocity / 10}`;
    } else if (timeScale.scale > 0 && timeScale.scale >= 1e-3) {
      timeScale.scale /= 10;
      this.velocityNumber.innerHTML = `${currentVelocity * 10}`;
    }
  }

  decelerate(timeScale: { scale: number }) {
    if (!this.velocityNumber) return;

    const currentVelocity = Number(this.velocityNumber.innerHTML);

    if (timeScale.scale >= 1 && timeScale.scale <= 1.1) {
      timeScale.scale /= -1;
      this.velocityNumber.innerHTML = `${currentVelocity * -1}`;
    } else if (timeScale.scale > 0 && timeScale.scale < 1) {
      timeScale.scale *= 10;
      this.velocityNumber.innerHTML = `${currentVelocity / 10}`;
    } else if (timeScale.scale < 0 && timeScale.scale <= -1e-3) {
      timeScale.scale /= 10;
      this.velocityNumber.innerHTML = `${currentVelocity * 10}`;
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

  initializeSpeedButtons(timeScale: { scale: number }) {
    if (!this.velocityNumber) return;
    this.velocityNumber.innerHTML = timeScale.scale.toString();
    if (!this.acelerarButton || !this.decelerarButton) return;
    this.acelerarButton.addEventListener("click", () => {
      this.acelerate(timeScale);
    });

    this.decelerarButton.addEventListener("click", () => {
      this.decelerate(timeScale);
    });
  }

  initilizeHideButton() {
    if (
      !this.hideHUD ||
      !this.acelerarButton ||
      !this.decelerarButton ||
      !this.velocityNumber
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

      this.acelerarButton!.style.visibility = visibility;
      this.decelerarButton!.style.visibility = visibility;
      this.velocityNumber!.style.visibility = visibility;
    });
  }
}
