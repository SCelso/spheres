import { G } from "../constants/constants";
const smoothing = 1e-6;

self.onmessage = (e) => {
  const planetsData = e.data;
  const updates = [];
  updates.push(...planetsData);
  for (let i = 0; i < updates.length; i++) {
    const bodyA: {
      position: { x: number; y: number; z: number };
      velocity: { x: number; y: number; z: number };
      mass: number;
      deltaTime: number;
    } = updates[i];
    for (let j = i + 1; j < updates.length; j++) {
      const bodyB: {
        position: { x: number; y: number; z: number };
        velocity: { x: number; y: number; z: number };
        mass: number;
        deltaTime: number;
      } = updates[j];

      let distanceX = bodyB.position.x - bodyA.position.x;
      let distanceY = bodyB.position.y - bodyA.position.y;
      let distanceZ = bodyB.position.z - bodyA.position.z;

      let distanceSquared =
        distanceX * distanceX + distanceY * distanceY + distanceZ * distanceZ;
      let distance = Math.sqrt(distanceSquared);

      let force =
        (G * bodyA.mass * bodyB.mass) / (distanceSquared + smoothing ** 2);

      let normalizedX = distanceX / distance;
      let normalizedY = distanceY / distance;
      let normalizedZ = distanceZ / distance;

      let accelerationBodyA = force / bodyA.mass;
      let accelerationBodyB = force / bodyB.mass;

      const newVelXBodyA =
        bodyA.velocity.x + normalizedX * accelerationBodyA * bodyA.deltaTime;
      const newVelYBodyA =
        bodyA.velocity.y + normalizedY * accelerationBodyA * bodyA.deltaTime;
      const newVelZBodyA =
        bodyA.velocity.z + normalizedZ * accelerationBodyA * bodyA.deltaTime;

      const newVelXBodyB =
        bodyB.velocity.x - normalizedX * accelerationBodyB * bodyB.deltaTime;
      const newVelYBodyB =
        bodyB.velocity.y - normalizedY * accelerationBodyB * bodyB.deltaTime;
      const newVelZBodyB =
        bodyB.velocity.z - normalizedZ * accelerationBodyB * bodyB.deltaTime;

      const newVelBodyA = { x: newVelXBodyA, y: newVelYBodyA, z: newVelZBodyA };
      const newVelBodyB = { x: newVelXBodyB, y: newVelYBodyB, z: newVelZBodyB };

      updates[i] = {
        deltaTime: bodyB.deltaTime,

        mass: bodyA.mass,
        velocity: newVelBodyA,
        position: bodyA.position,
      };

      updates[j] = {
        deltaTime: bodyB.deltaTime,
        mass: bodyB.mass,
        velocity: newVelBodyB,
        position: bodyB.position,
      };
    }
  }

  updates.forEach((body) => {
    const newPositionX = body.position.x + body.velocity.x * body.deltaTime;
    const newPositionY = body.position.y + body.velocity.y * body.deltaTime;
    const newPositionZ = body.position.z + body.velocity.z * body.deltaTime;
    body.position = { x: newPositionX, y: newPositionY, z: newPositionZ };
  });
  self.postMessage(updates);
};
