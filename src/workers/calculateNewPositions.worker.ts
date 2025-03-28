import { PlanetData } from "../main";
self.onmessage = (e) => {
  const { chunk, deltaTime } = e.data;
  const updates = structuredClone(chunk);
  const subSteps = 50;

  const dt = deltaTime / subSteps;

  for (let step = 0; step < subSteps; step++) {
    updates.forEach((body: PlanetData) => {
      body.position.add(body.velocity.multiplyScalar(dt));
    });
  }
  self.postMessage(updates);
};
