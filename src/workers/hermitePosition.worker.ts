import { PlanetData } from "../main";

self.onmessage = (e) => {
  const { chunk, deltaTime } = e.data;
  const updates = structuredClone(chunk);

  const dt = deltaTime;
  const dt2 = 0.5 * dt ** 2;
  const dt3 = dt ** 3 / 6;

  updates.forEach((body: PlanetData) => {
    const velocityTerm = body.velocity.clone().multiplyScalar(dt);
    const accelerationTerm = body.acceleration.clone().multiplyScalar(dt2);
    const jerkTerm = body.jerk.clone().multiplyScalar(dt3);

    body.position.add(velocityTerm).add(accelerationTerm).add(jerkTerm);
  });

  self.postMessage(updates);
};
