import { PlanetData } from "../main";

self.onmessage = (e) => {
  const { chunk, deltaTime } = e.data;
  const updates = chunk;
  const subSteps = 1;

  const dt = deltaTime / subSteps;
  updates.forEach((body: PlanetData) => {
    body.position.x += body.velocity.x * dt;
    body.position.y += body.velocity.y * dt;
    body.position.z += body.velocity.z * dt;
  });

  self.postMessage(updates);
};
