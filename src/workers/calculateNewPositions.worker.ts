import { PlanetData } from "../main";

self.onmessage = (e) => {
  const { chunk, deltaTime } = e.data;
  const updates = chunk;
  const subSteps = 3;

  const dt = deltaTime / subSteps;
  for (let step = 0; step < subSteps; step++) {
    updates.forEach((body: PlanetData) => {
      body.position.x += body.velocity.x * dt;
      body.position.y += body.velocity.y * dt;
      body.position.z += body.velocity.z * dt;
    });
  }

  self.postMessage(updates);
};
