import { PlanetData } from "../main";
import { calculateAccelerationsAndJerks } from "../utils/calculations";

self.onmessage = (e) => {
  const { chunk, allBodies, deltaTime } = e.data;
  let updates = structuredClone(chunk);
  const dt = deltaTime;

  updates.forEach((body: PlanetData) => {
    const accelerationTerm = body.acceleration.clone().multiplyScalar(dt);
    const jerkTerm = body.jerk.clone().multiplyScalar(0.5 * dt ** 2);
    body.velocity.add(accelerationTerm).add(jerkTerm);
  });

  calculateAccelerationsAndJerks(updates, allBodies);

  self.postMessage(updates);
};
