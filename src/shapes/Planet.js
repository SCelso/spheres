import * as THREE from "three";
import { MAX_ORBIT_POINTS } from "../constants";

export class Planet extends THREE.Mesh {
  orbitalPeriod = 0;
  sideralDay = 0;
  translationAngle = 0;
  rotateAngle = 0;
  orbit = [];
  orbited = undefined;
  distanceToOrbited = 0;
  translateCounterClockWise = false;
  rotateCounterClockWise = false;
  lineOrbit = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(this.orbit),
    new THREE.LineBasicMaterial({
      color: 0xffffff,
    })
  );

  firstOrbit = false;
  isPlanet = false;
  canBeFocused = false;
  worker = undefined;
  planetId = undefined;

  constructor({
    name,
    radius,
    widthSegments,
    heightSegments,
    sideralDay = 0,
    orbitalPeriod = 0,
    orbited = undefined,
    distanceToOrbited = 0,
    translateCounterClockWise = false,
    rotateCounterClockWise = false,
    isPlanet = false,
    canBeFocused = false,
  }) {
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const geometry = new THREE.SphereGeometry(
      radius,
      widthSegments,
      heightSegments
    );
    super(geometry, material);
    this.name = name;
    this.sideralDay = sideralDay;
    this.orbitalPeriod = orbitalPeriod;
    this.orbited = orbited;
    this.distanceToOrbited = distanceToOrbited;
    this.translateCounterClockWise = translateCounterClockWise;
    this.rotateCounterClockWise = rotateCounterClockWise;
    this.isPlanet = isPlanet;
    this.canBeFocused = canBeFocused;
    if (this.orbited) {
      const initialAngle = 0; // Ángulo inicial (puede ser configurable)
      this.position.set(
        this.orbited.position.x +
          Math.cos(initialAngle) * this.distanceToOrbited,
        this.orbited.position.y,
        this.orbited.position.z +
          Math.sin(initialAngle) * this.distanceToOrbited
      );
    }
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

  rotate(angleIncrement, counterClockWise = false) {
    if (counterClockWise) {
      this.rotateAngle -= angleIncrement;
    } else {
      this.rotateAngle += angleIncrement;
    }
    this.rotateAngle %= 2 * Math.PI;

    this.rotation.y = this.rotateAngle;
  }
}
