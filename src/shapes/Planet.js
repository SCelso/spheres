import { Body } from "./Body";

export class Planet extends Body {
  constructor({
    name,
    radius,
    widthSegments,
    heightSegments,
    sideralDay = 0,
    orbited = undefined,
    translateCounterClockWise = false,
    rotateCounterClockWise = false,
    canBeFocused = false,

    mass,
    velocity,
    position,
    distanceToOrbited,
    eccentricity = 0,
    semimajorAxis = 0,
    inclination = 0,
    longitudeOfAscendingNode = 0,
    argumentOfPeriapsis = 0,
    trailColor,
  }) {
    super({
      name,
      radius,
      widthSegments,
      heightSegments,
      sideralDay,
      distanceToOrbited,
      translateCounterClockWise,
      rotateCounterClockWise,
      canBeFocused,

      mass,
      velocity,
      position,

      eccentricity,
      semimajorAxis,
      inclination,
      longitudeOfAscendingNode,
      argumentOfPeriapsis,
      orbited,
      trailColor,
    });
  }
  getTranslateCounterClockWise() {
    return this.translateCounterClockWise;
  }
  getRotateCounterClockWise() {
    return this.rotateCounterClockWise;
  }
  getSideralDay() {
    return this.sideralDay;
  }
  getDistanceToOrbited() {
    return this.distanceToOrbited;
  }

  getOrbited() {
    return this.orbited;
  }
  setOrbited(orbited) {
    this.orbited = orbited;
  }

  getOrbitalPeriod() {
    return this.orbitalPeriod;
  }

  setAngle(newAngle) {
    this.angle = newAngle;
  }
}
