export class PlanetWorkerService {
  constructor(planets) {
    this.planets = planets;
    this.workers = new Map();

    planets.forEach((planet, id) => {
      const worker = new Worker("src/worker.js");
      worker.onmessage = (e) => this.handleUpdate(id, e.data);
      this.workers.set(id, worker);
    });
  }

  handleUpdate(planetId, data) {
    const planet = this.planets[planetId];
    if (!planet) return;

    // Actualizar ambos parámetros
    planet.translationAngle = data.newTranslationAngle;
    planet.rotation.y = data.newRotationAngle;
    planet.position.set(data.newX, 0, data.newZ);
  }

  update(deltaTime) {
    this.planets.forEach((planet, id) => {
      const orbited = planet.getOrbited();

      if (!orbited) {
        console.error("No hay cuerpo orbitado para:", planet.name);
        return;
      }
      this.workers.get(id).postMessage({
        deltaTime,
        orbitalPeriod: planet.getOrbitalPeriod(),
        sideralDay: planet.getSideralDay(),
        translationAngle: planet.translationAngle,
        rotationAngle: planet.rotation.y,
        distanceToOrbited: planet.getDistanceToOrbited(),
        translateCCW: planet.getTranslateCounterClockWise(),
        rotateCCW: planet.getRotateCounterClockWise(),
        orbitedX: orbited.position.x,
        orbitedZ: orbited.position.z,
      });
    });
  }

  dispose() {
    this.workers.forEach((worker) => worker.terminate());
    this.workers.clear();
  }
}
