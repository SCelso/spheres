import { PlanetData } from "../main";
import { calculateAccelerations } from "../utils/calculations";
self.onmessage = (e) => {
  const { chunk, planetsData, deltaTime } = e.data;
  const updates = chunk;
  const subSteps = 3;
  const dt = deltaTime / subSteps;

  const newAccelerations = calculateAccelerations(updates, planetsData);
  for (let step = 0; step < subSteps; step++) {
    updates.forEach((body: PlanetData, i: number) => {
      body.velocity.x += 0.5 * newAccelerations[i].x * dt;
      body.velocity.y += 0.5 * newAccelerations[i].y * dt;
      body.velocity.z += 0.5 * newAccelerations[i].z * dt;
    });
  }

  self.postMessage(updates);
};
