import { G, smoothing } from "../constants/constants";
import { calculateAccelerations } from "../utils/calculations";

self.onmessage = (e) => {
  const { chunk, planetsData, scale, deltaTime } = e.data;
  const updates = structuredClone(chunk);
  const subSteps = 10;
  const baseDt = deltaTime;
  const dtRaw = (baseDt * scale) / subSteps;
  const dt = Math.min(dtRaw, 1e4);
  for (let step = 0; step < subSteps; step++) {
    const accelerations = calculateAccelerations(updates, planetsData);

    updates.forEach(
      (
        body: {
          position: { x: number; y: number; z: number };
          velocity: { x: number; y: number; z: number };
          acceleration: { x: number; y: number; z: number };
        },
        i: number
      ) => {
        body.position.x +=
          body.velocity.x * dt + 0.5 * accelerations[i].x * dt ** 2;
        body.position.y +=
          body.velocity.y * dt + 0.5 * accelerations[i].y * dt ** 2;
        body.position.z +=
          body.velocity.z * dt + 0.5 * accelerations[i].z * dt ** 2;

        body.acceleration = accelerations[i];
      }
    );
  }
  self.postMessage(updates);
};
