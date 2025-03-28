import { PlanetData } from "../main";
import { calculateAccelerations } from "../utils/calculations";

self.onmessage = (e) => {
  const { chunk, planetsData, deltaTime } = e.data;
  const updates = structuredClone(chunk);
  const subSteps = 50;
  const dt = deltaTime / subSteps;

  for (let step = 0; step < subSteps; step++) {
    const newAccelerations = calculateAccelerations(updates, planetsData);
    updates.forEach((body: PlanetData, i: number) => {
      body.velocity.add(newAccelerations[i].multiplyScalar(dt));
    });
  }
  self.postMessage(updates);
};
