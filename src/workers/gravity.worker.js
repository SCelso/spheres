import { deltaTime } from "three/tsl";
import { G } from "../constants/constants";
const smoothing = 100;
const smoothingSquared = smoothing ** 2;

self.onmessage = (e) => {
  const planetsData = e.data;
  const updates = [];

  updates.push(...planetsData);
  for (let i = 0; i < updates.length; i++) {
    const bodyA = updates[i];

    for (let j = i + 1; j < updates.length; j++) {
      const bodyB = updates[j];

      let distanceX = bodyB.position.x - bodyA.position.x;
      let distanceY = bodyB.position.y - bodyA.position.y;
      let distanceZ = bodyB.position.z - bodyA.position.z;

      let distanceSquared =
        distanceX * distanceX + distanceY * distanceY + distanceZ * distanceZ;
      let distance = Math.sqrt(distanceSquared);

      let force =
        (G * bodyA.mass * bodyB.mass) / (distanceSquared + smoothingSquared);

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

      if (distance <= 10) {
        bodyA.velocity = { x: 0, y: 0, z: 0 };
        bodyB.velocity = { x: 0, y: 0, z: 0 };
      }

      updates[i] = {
        id: bodyA.id,
        deltaTime: bodyA.deltaTime,
        mass: bodyA.mass,
        velocity: newVelBodyA,
        position: bodyA.position,
        rotationAngle: bodyA.rotationAngle,
        rotateCCW: bodyA.rotateCCW,
        sideralDay: bodyA.sideralDay,
        name: bodyA.name,
      };

      updates[j] = {
        id: bodyB.id,
        deltaTime: bodyB.deltaTime,
        mass: bodyB.mass,
        velocity: newVelBodyB,
        position: bodyB.position,
        rotationAngle: bodyB.rotationAngle,
        rotateCCW: bodyB.rotateCCW,
        sideralDay: bodyB.sideralDay,
        name: bodyB.name,
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
