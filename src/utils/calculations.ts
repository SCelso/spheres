import { G, smoothing } from "../constants/constants";
import { PlanetData } from "../main";
import * as THREE from "three";

export function calculateDeltaTime(currentTime: number, previousTime: number) {
  return (currentTime - previousTime) / 1000;
}

export function calculateAccelerations(
  bodies: PlanetData[],
  allBodies: PlanetData[]
) {
  return bodies.map((body) => {
    const acceleration = new THREE.Vector3();

    allBodies.forEach((other) => {
      if (body.name === other.name) return;

      const deltaPosition = new THREE.Vector3().subVectors(
        other.position,
        body.position
      );

      const distanceSq = deltaPosition.lengthSq() + smoothing;
      const accelerationMagnitude = (G * other.mass) / distanceSq;
      deltaPosition.normalize().multiplyScalar(accelerationMagnitude);
      acceleration.add(deltaPosition);
    });

    return acceleration;
  });
}
