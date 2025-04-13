import { light, renderer, scene } from "./basic/index";
import onWindowResize from "./basic/Resize";

import * as Constants from "./constants/constants";
import * as Calculations from "./utils/calculations";
import * as TexturesRoutes from "./constants/textures";
import { CameraService, TexturesService } from "./services/index";

import Stats from "stats.js";
import * as THREE from "three";
import { HUDController } from "./controllers/HUDController";
import { WorkerPool } from "./services/WorkerPool";
import { Body } from "./shapes/Body.js";

export type PlanetData = {
  name: string;

  position: THREE.Vector3;
  velocity: THREE.Vector3;
  mass: number;
};

type MeshWithTextures = {
  mesh: Body;
  texturesRoute: TexturesRoutes.TextureRouteType;
};
async function init() {
  const workerPoolSize = 4;

  const calculateNewPositions = new WorkerPool<[PlanetData]>(
    "./src/workers/calculateNewPositions.worker.ts",
    workerPoolSize
  );
  const calculateNewVelocities = new WorkerPool<[PlanetData]>(
    "./src/workers/calculateNewVelocities.worker.ts",
    workerPoolSize
  );

  //HUD
  let timeScale = { scale: 1 };
  let gravity = { gravityFlag: false };
  let orbitsVisible = { visible: true };
  let firstIterationGravity = true;

  ///STATS
  const stats = new Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom);
  // const axesHelper = new THREE.AxesHelper(1000000 * Constants.KILOMETER);
  // scene.add(axesHelper);
  const texturesService = TexturesService.getInstance();

  //OBJECTS
  const sun: Body = new Body(Constants.SUN);
  const earthClouds = new Body(Constants.EARTH_CLOUDS);

  const planets = createBodyMeshes(Constants.PLANETS_DEFINITION, [sun]);
  const moons = createBodyMeshes(Constants.MOONS_DEFINITION, planets);
  const bodies = [sun, ...planets, ...moons];
  const allMeshes = [...bodies, earthClouds];
  let bodiesAdded: Body[] = [];
  let trailBodiesAdded: THREE.Line[] = [];

  const earth = allMeshes.filter((mesh) => mesh.name === "EARTH")[0];
  let bodiesWithGravity = [sun, ...planets, ...bodiesAdded];
  const bodiesWithoutGravity = [...bodiesWithGravity, ...moons];
  const cameraTargets = allMeshes.filter((mesh) => mesh.canBeFocused);
  const allOrbits = bodies.map((body) => body.getOrbitLine());
  const allTrails = bodies.map((body) => body.getTrailLine());
  let gravityTrails = bodiesWithGravity.map((body) =>
    body.getGravityTrailLine()
  );

  //TEXTURES
  await initializeTextures();

  //CAMERA
  const cameraService = CameraService.getInstance(cameraTargets);
  const container = cameraService.getContainer();
  const camera = cameraService.getCamera();

  const hudController = new HUDController(
    timeScale,
    orbitsVisible,
    gravity,
    bodiesWithGravity
  );
  const sceneElements = [light, container, ...allMeshes, ...allOrbits];
  addElementsToScene(sceneElements);

  let previousTime = performance.now();

  requestAnimationFrame(animate);

  window.addEventListener(
    "resize",
    () => onWindowResize(camera, renderer),
    false
  );

  function createBodyMeshes(
    bodiesDefinitions: Constants.BodyDefinition[],
    orbitedMeshes: Body[]
  ) {
    const bodiesArray: Body[] = [];
    bodiesDefinitions.forEach((bodyDefinition: Constants.BodyDefinition) => {
      const bodyMesh = new Body(bodyDefinition);
      const orbitedMesh = orbitedMeshes.filter(
        (orbitedMesh) => bodyDefinition.orbited === orbitedMesh.name
      )[0];

      bodyMesh.setOrbited(orbitedMesh);
      bodyMesh.initializePerihelionPosition();
      bodiesArray.push(bodyMesh);
    });
    return bodiesArray;
  }

  async function initializeTextures() {
    const meshesWithTextures = createMeshesWithTexturesJSON(allMeshes);
    const backgrounTextureRoute = TexturesRoutes.BACKGROUND_TEXTURE_ROUTE;
    const texturesPromises: Promise<void>[] = meshesWithTextures.map(
      (meshWithTextures: MeshWithTextures) =>
        loadAndApplyTextures(meshWithTextures)
    );
    texturesPromises.push(loadAndApplyBackgroundTexture(backgrounTextureRoute));

    await Promise.all(texturesPromises);
  }

  function createMeshesWithTexturesJSON(allMeshes: Body[]): MeshWithTextures[] {
    return allMeshes.map((mesh) => {
      return {
        mesh,
        texturesRoute:
          TexturesRoutes.texturesRouteMap[
            mesh.name as keyof typeof TexturesRoutes.NamePlanets
          ],
      };
    });
  }

  async function loadAndApplyTextures(meshesWithTextures: MeshWithTextures) {
    const { mesh, texturesRoute } = meshesWithTextures;
    const texturesLoaded = await texturesService.loadTextures(texturesRoute);
    texturesService.applyTextures(
      mesh,
      texturesLoaded as THREE.MeshPhysicalMaterialParameters
    );
  }

  async function loadAndApplyBackgroundTexture(textureRoute: string) {
    const backgroundTextureLoaded = await texturesService.loadTexture(
      textureRoute
    );
    if (!backgroundTextureLoaded) return;

    texturesService.applyBackgroundTextureMapping(backgroundTextureLoaded);
    backgroundTextureLoaded.colorSpace = THREE.SRGBColorSpace;

    scene.background = backgroundTextureLoaded;
  }

  function initGravity() {
    const currentTarget = cameraService.getContainer().getCurrentTarget();
    scene.remove(...moons, ...allOrbits, ...allTrails);
    scene.add(...gravityTrails);
    timeScale.scale = 1;

    let changeCameraPlanet = "";

    if (planets.includes(currentTarget)) {
      changeCameraPlanet = currentTarget.name;
    } else if (currentTarget.getOrbited()) {
      changeCameraPlanet = currentTarget.getOrbited()!.name;
    } else {
      changeCameraPlanet = "sun";
    }

    cameraService.changeCamera(changeCameraPlanet);
    hudController.setSlider(1);
    bodiesWithGravity.forEach((body) => {
      body.resetPosition();
    });
  }

  async function animate() {
    requestAnimationFrame(animate);
    stats.begin();
    const currentTime = performance.now();
    let deltaTime = Calculations.calculateDeltaTime(currentTime, previousTime);
    previousTime = currentTime;

    if (gravity.gravityFlag) {
      if (firstIterationGravity) {
        initGravity();
        firstIterationGravity = false;
      }

      await updateGravity(
        bodiesWithGravity,
        deltaTime * timeScale.scale,
        timeScale.scale
      );
      updateTrailDots(bodiesWithGravity);
    } else {
      if (!firstIterationGravity) {
        scene.add(...moons, ...allOrbits, ...allTrails);
        scene.remove(...gravityTrails, ...bodiesAdded, ...trailBodiesAdded);
        const currentTarget = cameraService.getContainer().getCurrentTarget();
        let changeCameraPlanet = "";

        if (planets.includes(currentTarget)) {
          changeCameraPlanet = currentTarget.name;
        } else {
          changeCameraPlanet = "sun";
        }

        cameraService.changeCamera(changeCameraPlanet);
        bodiesWithGravity = bodiesWithGravity.filter(
          (body) => !bodiesAdded.includes(body)
        );

        gravityTrails = gravityTrails.filter(
          (trail) => !trailBodiesAdded.includes(trail)
        );
        trailBodiesAdded = [];
        bodiesAdded = [];
        firstIterationGravity = true;
      }

      bodiesWithoutGravity.forEach((body) => {
        body.updateOrbitalPosition(deltaTime, timeScale.scale);
      });

      if (orbitsVisible.visible) {
        activateOrbitLines();
      } else {
        desactivateOrbitLines();
      }
    }

    light.position.copy(sun.position);
    container.position.copy(container.getCurrentTarget()?.position);
    earthClouds.position.copy(earth.position);

    updateRotation(
      [...planets, ...moons, earthClouds],
      deltaTime * timeScale.scale
    );

    // cameraService.updateCameraMovement();

    cameraService.orbitControls.update();
    camera.lookAt(container.position);
    renderer.render(scene, camera);

    stats.end();
  }

  function activateOrbitLines() {
    scene.add(...allOrbits);
    scene.remove(...allTrails);

    bodies.forEach((body, i) => {
      if (!body.orbited) return;
      allOrbits[i].position.copy(body.orbited.position);
    });
  }

  function desactivateOrbitLines() {
    scene.add(...allTrails);
    scene.remove(...allOrbits);

    bodies.forEach((body, i) => {
      if (!body.orbited) return;
      allTrails[i].position.copy(body.orbited.position);
    });
  }

  function addElementsToScene(elements: THREE.Object3D[]) {
    elements.forEach((element) => {
      scene.add(element);
    });
  }

  function updateTrailDots(bodies: Body[]) {
    bodies.forEach((body) => {
      body.updateTrailDots();
      body.printTrailLineGravity();
    });
  }

  async function updateGravity(
    bodiesWithGravity: Body[],
    deltaTime: number,
    scale: number
  ) {
    const planetsData: PlanetData[] = bodiesWithGravity.map((planet: Body) => {
      return {
        name: planet.name,
        position: planet.position,
        velocity: planet.velocity,
        mass: planet.mass,
      };
    });

    const chunkSize = Math.ceil(bodiesWithGravity.length / workerPoolSize);
    const chunks: PlanetData[][] = calculateChunks(chunkSize, planetsData);
    const yoshidaStep = await yoshidaMethod(
      chunks,
      planetsData,
      scale,
      deltaTime
    );

    yoshidaStep.forEach((chunk: PlanetData[]) => {
      chunk.forEach((body) => {
        const bodyObject = bodiesWithGravity.find(
          (other: Body) => body.name === other.name
        );
        if (bodyObject) {
          bodyObject.position.copy(body.position);
          bodyObject.velocity.copy(body.velocity);
        }
      });
    });
  }

  async function yoshidaMethod(
    chunks: PlanetData[][],
    planetsData: PlanetData[],
    scale: number,
    deltaTime: number
  ) {
    const YOSHIDA_COEFFICIENTS = {
      w1: 1.0 / (2.0 - Math.pow(2, 1 / 3)),
      w2: -Math.pow(2, 1 / 3) / (2.0 - Math.pow(2, 1 / 3)),
    };
    const step = await leapFrog(
      chunks,
      planetsData,
      scale,
      YOSHIDA_COEFFICIENTS.w1 * deltaTime
    );
    const step1 = await leapFrog(
      step,
      planetsData,
      scale,
      YOSHIDA_COEFFICIENTS.w2 * deltaTime
    );
    const finalStep = await leapFrog(
      step1,
      planetsData,
      scale,
      YOSHIDA_COEFFICIENTS.w1 * deltaTime
    );
    return finalStep;
  }

  async function leapFrog(
    chunks: PlanetData[][],
    planetsData: PlanetData[],
    scale: number,
    deltaTime: number
  ) {
    const halfVelBodiesPromises = chunks.map((chunk: PlanetData[]) =>
      calculateNewVelocities.executeTask({
        chunk,
        planetsData,
        scale,
        deltaTime,
      })
    );

    const halfVelocities = await Promise.all(halfVelBodiesPromises);

    const completeStepPromises = halfVelocities.map((chunk) =>
      calculateNewPositions.executeTask({ chunk, scale, deltaTime })
    );
    const positionStep = await Promise.all(completeStepPromises);
    const completeVelBodiesPromises = positionStep.map((chunk) =>
      calculateNewVelocities.executeTask({
        chunk,
        planetsData,
        scale,
        deltaTime,
      })
    );
    const leapfrogStep = await Promise.all(completeVelBodiesPromises);
    return leapfrogStep;
  }

  // Función para dividir los datos en chunks
  function calculateChunks(chunkSize: number, planetsData: PlanetData[]) {
    const chunks = [];
    let prev = 0;
    for (let i = chunkSize; i <= planetsData.length; i += chunkSize) {
      chunks.push(planetsData.slice(prev, i));
      prev = i;
    }

    if (prev < planetsData.length) {
      chunks.push(planetsData.slice(prev));
    }
    return chunks;
  }

  function updateRotation(planets: Body[], deltaTime: number) {
    planets.forEach((body) => {
      const rotationIncrement = (2 * Math.PI * deltaTime) / body.sideralDay;
      let newRotationAngle = body.rotateCounterClockWise
        ? body.rotateAngle - rotationIncrement
        : body.rotateAngle + rotationIncrement;

      newRotationAngle = newRotationAngle % (2 * Math.PI);

      body.rotation.y += newRotationAngle;
    });
  }

  window.addEventListener(
    "dblclick",
    (event) => {
      if (!gravity.gravityFlag) return;
      createBodyAtPointer(event);
    },
    false
  );

  function createBodyAtPointer(event: any) {
    const planetTarget = cameraService.getContainer().getCurrentTarget();
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const name = "NBODY" + Math.random();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    cameraDirection.normalize();

    // Esta es la normal del plano
    console.log(cameraDirection);
    const planePoint = planetTarget.position;

    raycaster.setFromCamera(mouse, camera);

    const plane = new THREE.Plane();
    plane
      .setFromNormalAndCoplanarPoint(cameraDirection, planePoint)
      .normalize();

    const speed = 0.00001; // Puedes ajustar esto como te convenga
    const extraVelocity = cameraDirection.clone().multiplyScalar(speed);

    const intersection = new THREE.Vector3();
    console.log(planetTarget.trailColor);
    raycaster.ray.intersectPlane(plane, intersection);
    const newBody = new Body({
      name: name,
      radius: Constants.MOON_SIZE,
      widthSegments: 32,
      heightSegments: 32,
      sideralDay: Constants.MOON_SIDERAL_DAY,
      canBeFocused: false,
      velocity: [
        planetTarget.getVelocity().x + extraVelocity.x,
        planetTarget.getVelocity().y + extraVelocity.y,
        planetTarget.getVelocity().z + extraVelocity.z,
      ],
      trailColor: [
        1 - planetTarget.trailColor[0],
        1 - planetTarget.trailColor[1],
        1 - planetTarget.trailColor[2],
      ],
      mass: Constants.MOON_MASS,
      position: [intersection.x, intersection.y, intersection.z],
    });
    newBody.setOrbited(planetTarget);
    cameraService.bodiesTarget.push(newBody);

    bodiesAdded.push(newBody);
    bodiesWithGravity.push(newBody);
    console.log(newBody.getGravityTrailLine());
    scene.add(...bodiesAdded);
    trailBodiesAdded.push(newBody.getGravityTrailLine());
    gravityTrails.push(newBody.getGravityTrailLine());
    scene.add(newBody.getGravityTrailLine());
    console.log(scene.children);
  }
}

init();

//async function initializePerihelion(planets) {
//   const perihelionWorkerPool = new WorkerPool(
//     "./src/workers/perihelion.worker.js",
//     1
//   );
//   const promises = planets.map((planet) =>
//     perihelionWorkerPool
//       .executeTask({
//         velocity: planet.velocity,
//         inclination: planet.inclination,
//         eccentricity: planet.eccentricity,
//         semimajorAxis: planet.semimajorAxis,
//         argumentOfPeriapsis: planet.argumentOfPeriapsis,
//         longitudeOfAscendingNode: planet.longitudeOfAscendingNode,
//       })
//       .then((result) => {
//         planet.position.copy(result.newPosition);
//         planet.velocity.copy(result.newVelocity);
//       })
//   );

//   await Promise.all(promises);
//   perihelionWorkerPool.terminateAll();
// }
// async function hermiteStepMethod(
//   chunks: PlanetData[][],
//   allBodies: PlanetData[],
//   deltaTime: number
// ) {
//   const prevAccelerations = allBodies.map((c) => ({ ...c.acceleration }));
//   const prevJerks = allBodies.map((c) => ({ ...c.jerk }));

//   const newPositionsPromises = chunks.map((chunk) =>
//     hermitePosition.executeTask({ chunk, deltaTime })
//   );

//   const newPositions = await Promise.all(newPositionsPromises);

//   const newVelocitiesPromises = newPositions.map((chunk) =>
//     hermiteVelocity.executeTask({ chunk, allBodies, deltaTime })
//   );

//   const newVelocities = await Promise.all(newVelocitiesPromises);

//   newVelocities.forEach((chunk) => {
//     chunk.forEach((body: PlanetData, i) => {
//       const deltaJerk = {
//         x: body.jerk.x - prevJerks[i].x,
//         y: body.jerk.y - prevJerks[i].y,
//         z: body.jerk.z - prevJerks[i].z,
//       };

//       const posCorrector = {
//         x: deltaJerk.x * (deltaTime ** 4 / 24),
//         y: deltaJerk.y * (deltaTime ** 4 / 24),
//         z: deltaJerk.z * (deltaTime ** 4 / 24),
//       };

//       body.position.x += posCorrector.x;
//       body.position.y += posCorrector.y;
//       body.position.z += posCorrector.z;

//       const velCorrector1 = {
//         x: deltaJerk.x * (deltaTime ** 3 / 12),
//         y: deltaJerk.y * (deltaTime ** 3 / 12),
//         z: deltaJerk.z * (deltaTime ** 3 / 12),
//       };

//       const deltaAcceleration = {
//         x: body.acceleration.x - prevAccelerations[i].x,
//         y: body.acceleration.y - prevAccelerations[i].y,
//         z: body.acceleration.z - prevAccelerations[i].z,
//       };

//       const velCorrector2 = {
//         x: deltaAcceleration.x * (deltaTime ** 2 / 12),
//         y: deltaAcceleration.y * (deltaTime ** 2 / 12),
//         z: deltaAcceleration.z * (deltaTime ** 2 / 12),
//       };

//       body.velocity.x += velCorrector1.x + velCorrector2.x;
//       body.velocity.y += velCorrector1.y + velCorrector2.y;
//       body.velocity.z += velCorrector1.z + velCorrector2.z;
//     });
//   });

//   return newVelocities;
// }
