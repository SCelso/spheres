import { CameraService } from "../services";

export class HUDController {
  cameraService;

  acelerarButton = document.getElementById("acelerar");
  decelerarButton = document.getElementById("decelerar");
  isHUDHide = false;
  hideHUD = document.getElementById("hideHUD");
  velocityNumber = document.getElementById("velocity");
  planetsButtons = document.querySelectorAll<HTMLElement>(
    "div#planetButtons button"
  );

  constructor(timeScale: { scale: number }) {
    this.cameraService = CameraService.getInstance([]);
    this.initializeButtonPlanets();
    this.initializeSpeedButtons(timeScale);
    this.initilizeHideButton();
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
    } else if (timeScale.scale > 0 && timeScale.scale >= 1e-5) {
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
    } else if (timeScale.scale < 0 && timeScale.scale <= -1e-5) {
      timeScale.scale /= 10;
      this.velocityNumber.innerHTML = `${currentVelocity * 10}`;
    }
  }

  initializeButtonPlanets() {
    this.planetsButtons.forEach((button) => {
      const name = button!.textContent!.toUpperCase();
      button.addEventListener("click", () =>
        this.cameraService.changeCamera(name)
      );
    });
  }

  initializeSpeedButtons(timeScale: { scale: number }) {
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

      this.planetsButtons.forEach((button) => {
        button.style.visibility = visibility;
      });

      this.acelerarButton!.style.visibility = visibility;
      this.decelerarButton!.style.visibility = visibility;
      this.velocityNumber!.style.visibility = visibility;
    });
  }
}
