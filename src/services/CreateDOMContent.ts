import { NameMoons, NamePlanets } from "../constants/textures";
import { $ } from "../utils/domSelector";
import { button } from "./components/Button";
import { menuButton } from "./components/MenuButton";
import { slider } from "./components/Slider";

export class CreateDOMContent {
  body = $("body");

  constructor() {
    this.initializeButtons();
  }

  initializeButtons() {
    const planetsButton = menuButton(
      "planets",
      "🪐",
      Object.keys(NamePlanets)
        .filter((key) => isNaN(Number(key)))
        .map(this.capitalize)
    );

    const moonsButton = menuButton(
      "moons",
      "🌒",
      Object.keys(NameMoons)
        .filter((key) => isNaN(Number(key)))
        .map(this.capitalize)
    );

    const hideHudButton = button("hide-hud", "👀");
    const gravityButton = button("gravity", "🌌");
    const orbitsButton = button("orbits", "💫");
    const sliderElement = slider();

    this.body!.appendChild(hideHudButton);
    this.body!.appendChild(planetsButton);
    this.body!.appendChild(moonsButton);
    this.body!.appendChild(gravityButton);
    this.body!.appendChild(orbitsButton);
    this.body!.appendChild(sliderElement);
  }

  capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
}
