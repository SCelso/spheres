import { G } from "../constants/constants";
const smoothing = 0; // Valor ajustado para precisión

self.onmessage = (e) => {
  const { chunk, planetsData, scale, deltaTime } = e.data;
  const updates = structuredClone(chunk);
  const baseDt = deltaTime;
  const subSteps = Math.floor(scale * 100);
  const dt = (baseDt * scale) / subSteps;
  const lambda = 1 / (2 - Math.pow(2, 1 / 3));
  const mu = -Math.pow(2, 1 / 3) / (2 - Math.pow(2, 1 / 3));

  const c = [1.3512071919596578, -1.7024143839193155, 1.3512071919596578];
  const d = [1.3512071919596578, -1.7024143839193155, 1.3512071919596578];
  for (let step = 0; step < subSteps; step++) {
    updates.forEach(
      (
        body: {
          prevAcceleration: { x: number; y: number; z: number };
          position: { x: number; y: number; z: number };
          velocity: { x: number; y: number; z: number };
        },
        i: number
      ) => {
        body.velocity.x += 0.5 * c[0] * dt * body.prevAcceleration.x;
        body.velocity.y += 0.5 * c[0] * dt * body.prevAcceleration.y;
        body.velocity.z += 0.5 * c[0] * dt * body.prevAcceleration.z;

        // Drift: actualización de la posición
        body.position.x += c[0] * dt * body.velocity.x;
        body.position.y += c[0] * dt * body.velocity.y;
        body.position.z += c[0] * dt * body.velocity.z;
      }
    );

    const newAccelerations = calculateAccelerations(updates, planetsData);
    updates.forEach(
      (
        body: {
          velocity: { x: number; y: number; z: number };
          prevAcceleration: { x: number; y: number; z: number };
        },
        i: number
      ) => {
        body.velocity.x += 0.5 * d[0] * dt * newAccelerations[i].x;
        body.velocity.y += 0.5 * d[0] * dt * newAccelerations[i].y;
        body.velocity.z += 0.5 * d[0] * dt * newAccelerations[i].z;

        body.prevAcceleration = newAccelerations[i];
      }
    );

    updates.forEach(
      (
        body: {
          prevAcceleration: { x: number; y: number; z: number };
          position: { x: number; y: number; z: number };
          velocity: { x: number; y: number; z: number };
        },
        i: number
      ) => {
        body.position.x += c[1] * dt * body.velocity.x;
        body.position.y += c[1] * dt * body.velocity.y;
        body.position.z += c[1] * dt * body.velocity.z;
      }
    );

    const newAccelerations1 = calculateAccelerations(updates, planetsData);
    updates.forEach(
      (
        body: {
          velocity: { x: number; y: number; z: number };
          prevAcceleration: { x: number; y: number; z: number };
        },
        i: number
      ) => {
        body.velocity.x += 0.5 * d[1] * dt * newAccelerations1[i].x;
        body.velocity.y += 0.5 * d[1] * dt * newAccelerations1[i].y;
        body.velocity.z += 0.5 * d[1] * dt * newAccelerations1[i].z;

        body.prevAcceleration = newAccelerations1[i];
      }
    );
    updates.forEach(
      (
        body: {
          prevAcceleration: { x: number; y: number; z: number };
          position: { x: number; y: number; z: number };
          velocity: { x: number; y: number; z: number };
        },
        i: number
      ) => {
        body.position.x += c[2] * dt * body.velocity.x;
        body.position.y += c[2] * dt * body.velocity.y;
        body.position.z += c[2] * dt * body.velocity.z;
      }
    );

    const newAccelerations2 = calculateAccelerations(updates, planetsData);
    updates.forEach(
      (
        body: {
          velocity: { x: number; y: number; z: number };
          prevAcceleration: { x: number; y: number; z: number };
        },
        i: number
      ) => {
        body.velocity.x += 0.5 * d[2] * dt * newAccelerations2[i].x;
        body.velocity.y += 0.5 * d[2] * dt * newAccelerations2[i].y;
        body.velocity.z += 0.5 * d[2] * dt * newAccelerations2[i].z;

        body.prevAcceleration = newAccelerations2[i];
      }
    );
  }

  self.postMessage(updates);
};

// Cálculo preciso de aceleraciones
function calculateAccelerations(bodies: any[], allBodies: any[]) {
  return bodies.map((body) => {
    const acceleration = { x: 0, y: 0, z: 0 };

    allBodies.forEach((other) => {
      if (body.name === other.name) return;

      const dx = other.position.x - body.position.x;
      const dy = other.position.y - body.position.y;
      const dz = other.position.z - body.position.z;

      const distanceSq = dx * dx + dy * dy + dz * dz + smoothing;
      const distance = Math.sqrt(distanceSq);
      const force = (G * body.mass * other.mass) / distanceSq;
      acceleration.x += ((dx / distance) * force) / body.mass;
      acceleration.y += ((dy / distance) * force) / body.mass;
      acceleration.z += ((dz / distance) * force) / body.mass;
    });

    return acceleration;
  });
}
