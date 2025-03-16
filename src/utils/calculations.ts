import { G, smoothing } from "../constants/constants";

export function calculateAngularIncrement(
  secondsPerLap: number,
  deltaTime: number
) {
  const angleIncrementRadians = ((2 * Math.PI) / secondsPerLap) * deltaTime;
  return angleIncrementRadians;
}

export function calculateDeltaTime(
  currentTime: number,
  previousTime: number,
  timeScale: { scale: number }
) {
  const deltaTime = (currentTime - previousTime) / 1000 / timeScale.scale;

  return deltaTime;
}

export function calculateAccelerations(bodies: any[], allBodies: any[]) {
  return bodies.map((body) => {
    const acceleration = { x: 0, y: 0, z: 0 };

    allBodies.forEach((other) => {
      if (body.name === other.name) return;

      const dx = other.position.x - body.position.x;
      const dy = other.position.y - body.position.y;
      const dz = other.position.z - body.position.z;

      const distanceSq = dx * dx + dy * dy + dz * dz + smoothing;
      const distance = Math.sqrt(distanceSq);
      const force = (G * body.mass * other.mass) / distanceSq;
      acceleration.x += ((dx / distance) * force) / body.mass;
      acceleration.y += ((dy / distance) * force) / body.mass;
      acceleration.z += ((dz / distance) * force) / body.mass;
    });

    return acceleration;
  });
}
