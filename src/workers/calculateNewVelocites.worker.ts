import { calculateAccelerations } from "../utils/calculations";

self.onmessage = (e) => {
  const { chunk, planetsData, scale, deltaTime } = e.data;
  const updates = structuredClone(chunk);
  const subSteps = 10;
  const baseDt = deltaTime;
  const dt = (baseDt * scale) / subSteps;
  //const dt = Math.min(dtRaw, 1e4);

  for (let step = 0; step < subSteps; step++) {
    const newAccelerations = calculateAccelerations(updates, planetsData);
    updates.forEach(
      (
        body: {
          velocity: { x: number; y: number; z: number };
          prevAcceleration: { x: number; y: number; z: number };
        },
        i: number
      ) => {
        body.velocity.x += 0.5 * newAccelerations[i].x * dt;
        body.velocity.y += 0.5 * newAccelerations[i].y * dt;
        body.velocity.z += 0.5 * newAccelerations[i].z * dt;
        body.prevAcceleration = newAccelerations[i];
      }
    );
  }
  self.postMessage(updates);
};
