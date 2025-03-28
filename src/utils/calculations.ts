import { G, SECOND, smoothing } from "../constants/constants";
import { PlanetData } from "../main";
import * as THREE from "three";

export function calculateAngularIncrement(
  secondsPerLap: number,
  deltaTime: number
) {
  const angleIncrementRadians = ((2 * Math.PI) / secondsPerLap) * deltaTime;
  return angleIncrementRadians;
}

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

      const direction = new THREE.Vector3().subVectors(
        other.position,
        body.position
      );

      const distanceSq = direction.lengthSq() + smoothing;
      const accelerationMagnitude = (G * other.mass) / distanceSq;
      direction.normalize().multiplyScalar(accelerationMagnitude);
      acceleration.add(direction);
    });

    return acceleration;
  });
}
export function calculateAccelerationsAndJerks(
  bodies: PlanetData[],
  allBodies: PlanetData[]
) {
  bodies.forEach((body) => {
    body.acceleration = new THREE.Vector3();
    body.jerk = new THREE.Vector3();
    allBodies.forEach((other) => {
      if (body.name === other.name) return;

      const deltaPosition = new THREE.Vector3().subVectors(
        other.position,
        body.position
      );

      const deltaVelocity = new THREE.Vector3().subVectors(
        other.velocity,
        body.velocity
      );

      const distanceSq = deltaPosition.lengthSq() + smoothing;
      const distance = Math.sqrt(distanceSq);
      const distanceCubic = distanceSq * distance;
      const accelerationMagnitude = (G * other.mass) / distanceCubic;
      const accelerationComponent = deltaPosition
        .clone()
        .multiplyScalar(accelerationMagnitude);

      body.acceleration.add(accelerationComponent);

      const productPoint = deltaPosition.dot(deltaVelocity);

      const jerkScalar = (3 * productPoint) / distanceSq;

      const jerkComponent = deltaPosition
        .clone()
        .multiplyScalar(jerkScalar)
        .sub(deltaVelocity)
        .multiplyScalar(accelerationMagnitude);
      body.jerk.add(jerkComponent);
    });
  });
}
