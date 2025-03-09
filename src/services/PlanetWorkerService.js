export class PlanetWorkerService {
  constructor(initialBodies) {
    this.bodies = [...initialBodies];
    this.gravityWorker = new Worker("src/workers/gravityWorker.js");

    this.gravityWorker.onmessage = (e) => {
      e.data.forEach((update) => {
        const planet = this.bodies.find((p) => p.id === update.id);
        if (planet) {
          planet.position.set(
            update.position.x,
            update.position.y,
            update.position.z
          );

          planet.velocity.set(
            update.velocity.x,
            update.velocity.y,
            update.velocity.z
          );

          planet.rotation.y = update.rotationAngle;
        }
      });
    };
  }

  addBody(body) {
    this.bodies.push(body);
  }

  update(deltaTime) {
    const planetsData = this.bodies.map((planet) => {
      return {
        id: planet.id,
        deltaTime,
        mass: planet.mass,
        velocity: planet.velocity,
        position: planet.position,
        rotateCCW: planet.getRotateCounterClockWise(),
        rotationAngle: planet.rotation.y,
        sideralDay: planet.getSideralDay(),
        name: planet.name,
      };
    });

    this.gravityWorker.postMessage(planetsData);
  }

  dispose() {
    this.gravityWorker.terminate();
  }
}
