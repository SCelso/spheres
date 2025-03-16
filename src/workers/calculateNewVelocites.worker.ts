import { G, smoothing } from "../constants/constants";
import { calculateAccelerations } from "../utils/calculations";

self.onmessage = (e) => {
  const { chunk, planetsData, scale, deltaTime } = e.data;
  const updates = structuredClone(chunk);
  const subSteps = 100;
  const baseDt = deltaTime;
  const dtRaw = (baseDt * scale) / subSteps;
  const dt = Math.min(dtRaw, 1e4);

  for (let step = 0; step < subSteps; step++) {
    const newAccelerations = calculateAccelerations(updates, planetsData);
    updates.forEach(
      (
        body: {
          velocity: { x: number; y: number; z: number };
          acceleration: { x: number; y: number; z: number };
        },
        i: number
      ) => {
        const a_n = body.acceleration;
        const a_n1 = newAccelerations[i];

        body.velocity.x += 0.5 * (a_n.x + a_n1.x) * dt;
        body.velocity.y += 0.5 * (a_n.y + a_n1.y) * dt;
        body.velocity.z += 0.5 * (a_n.z + a_n1.z) * dt;
      }
    );
  }
  self.postMessage(updates);
};
