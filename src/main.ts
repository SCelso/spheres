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

async function init() {
  const workerPoolSize = 2;
  // const newVelocitiesWorkerPoolSize = 4;
  // const gravityWorkerPool = new WorkerPool<
  //   [
  //     {
  //       // prevAcceleration: { x: number; y: number; z: number };
  //       name: string;
  //       prevAcceleration: { x: number; y: number; z: number };
  //       velocity: { x: number; y: number; z: number };
  //       position: { x: number; y: number; z: number };
  //     }
  //   ]
  // >("./src/workers/gravity.worker.ts", 1);

  const calculateNewPositions = new WorkerPool<
    [
      {
        name: string;
        acceleration: { x: number; y: number; z: number };
        velocity: { x: number; y: number; z: number };
        position: { x: number; y: number; z: number };
        prevAcceleration: { x: number; y: number; z: number };
      }
    ]
  >("./src/workers/calculateNewPositions.worker.ts", workerPoolSize);

  const calculateNewVelocities = new WorkerPool<
    [
      {
        name: string;
        velocity: { x: number; y: number; z: number };
        position: { x: number; y: number; z: number };
        prevAcceleration: { x: number; y: number; z: number };
      }
    ]
  >("./src/workers/calculateNewVelocites.worker.ts", workerPoolSize);

  ///STATS
  const stats = new Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom);
  const axesHelper = new THREE.AxesHelper(1000000 * Constants.KILOMETER);
  scene.add(axesHelper);
  const texturesService = TexturesService.getInstance();

  //OBJECTS
  const sun: Body = new Body(Constants.SUN);
  const earthClouds = new Body(Constants.EARTH_CLOUDS);

  const planets = createBodyMeshes(Constants.PLANETS_DEFINITION, [sun]);
  const moons = createBodyMeshes(Constants.MOONS_DEFINITION, planets);
  const bodies = [...planets, ...moons];
  const allMeshes = [sun, ...bodies, earthClouds];
  const trails = bodies.map((body) => body.getTrailLine());

  const earth = allMeshes.filter((mesh) => mesh.name === "EARTH")[0];
  const bodiesWithGravity = [sun, ...planets, ...moons];
  const cameraTargets = allMeshes.filter((mesh) => mesh.canBeFocused);
  const orbits = bodies.map((body) => body.printOrbit());
  //TEXTURES
  await initializeTextures();

  //CAMERA
  const cameraService = CameraService.getInstance(cameraTargets);
  const container = cameraService.getContainer();
  const camera = cameraService.getCamera();

  //HUD
  let timeScale = { scale: 1 };
  let scale = timeScale.scale;

  let orbitsVisible = { visible: true };
  const hudController = new HUDController(timeScale, orbitsVisible);
  const sceneElements = [light, container, ...allMeshes, ...trails, ...orbits];
  addElementsToScene(sceneElements);

  let previousTime = performance.now();

  requestAnimationFrame(animate);

  window.addEventListener("keypress", () => cameraService.changeCamera());
  window.addEventListener(
    "resize",
    () => onWindowResize(camera, renderer),
    false
  );

  function createBodyMeshes(bodiesDefinitions: any, orbitedMeshes: Body[]) {
    const bodiesArray: Body[] = [];
    bodiesDefinitions.forEach((bodyDefinition: any) => {
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
    const texturesPromises = meshesWithTextures.map(
      (meshWithTextures: {
        mesh: Body;
        texturesRoute: TexturesRoutes.TextureRouteType;
      }) => {
        loadAndApplyTextures(
          meshWithTextures.mesh,
          meshWithTextures.texturesRoute
        );
      }
    );
    // texturesPromises.push(loadAndApplyBackgroundTexture(backgrounTextureRoute));

    await Promise.all(texturesPromises);
  }

  function createMeshesWithTexturesJSON(allMeshes: Body[]) {
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

  async function loadAndApplyTextures(
    mesh: Body,
    texturesRoute: TexturesRoutes.TextureRouteType
  ) {
    const texturesLoaded = await texturesService.loadTextures(texturesRoute);
    texturesService.applyTextures(mesh, texturesLoaded);
  }

  async function loadAndApplyBackgroundTexture(textureRoute: string) {
    const backgroundTextureLoaded = await texturesService.loadTexture(
      textureRoute
    );

    texturesService.applyBackgroundTextureMapping(backgroundTextureLoaded);
    backgroundTextureLoaded.colorSpace = THREE.SRGBColorSpace;

    scene.background = backgroundTextureLoaded;
  }

  async function animate() {
    stats.begin();
    const currentTime = performance.now();
    let deltaTime = Calculations.calculateDeltaTime(
      currentTime,
      previousTime,
      timeScale
    );
    previousTime = currentTime;

    await updateGravity(bodiesWithGravity, deltaTime, scale);

    if (orbitsVisible.visible) {
      bodies.forEach((body, i) => {
        if (!body.orbited) return;
        orbits[i].position.copy(body.orbited.position);
      });
      scene.add(...orbits);
    } else {
      scene.remove(...orbits);
    }

    light.position.copy(sun.position);
    container.position.copy(container.getCurrentTarget()?.position);
    earthClouds.position.copy(earth.position);

    updateRotation([...planets, ...moons, earthClouds], deltaTime);
    updateTrailDots(bodies);
    camera.lookAt(container.position);
    renderer.render(scene, camera);

    stats.end();

    requestAnimationFrame(animate);
  }

  function addElementsToScene(elements: THREE.Object3D[]) {
    elements.forEach((element) => {
      scene.add(element);
    });
  }

  function updateTrailDots(bodies: Body[]) {
    bodies.forEach((body) => {
      body.updateTrailDots();
      body.printTrailLine();
    });
  }

  type PlanetData = {
    name: string;
    prevAcceleration: {
      x: number;
      y: number;
      z: number;
    };
    position: {
      x: number;
      y: number;
      z: number;
    };
    velocity: {
      x: number;
      y: number;
      z: number;
    };
    mass: number;
  };
  async function updateGravity(
    bodiesWithGravity: Body[], // Array de Body
    deltaTime: number,
    scale: number
  ) {
    // Aseguramos que prevAcceleration se inicialice correctamente:
    const planetsData: PlanetData[] = bodiesWithGravity.map((planet: Body) => {
      return {
        name: planet.name,

        prevAcceleration: {
          x: planet.prevAcceleration?.x || 0,
          y: planet.prevAcceleration?.y || 0,
          z: planet.prevAcceleration?.z || 0,
        },
        position: {
          x: planet.position.x,
          y: planet.position.y,
          z: planet.position.z,
        },
        velocity: {
          x: planet.velocity.x,
          y: planet.velocity.y,
          z: planet.velocity.z,
        },
        mass: planet.mass,
      };
    });

    const chunkSize = Math.ceil(bodiesWithGravity.length / workerPoolSize);
    const chunks: PlanetData[][] = calculateChunks(chunkSize, planetsData);
    const yoshida = await yoshidaMethod(chunks, planetsData, scale, deltaTime);

    yoshida.forEach((chunk) => {
      chunk.forEach((body) => {
        const bodyObject = bodiesWithGravity.find(
          (other: Body) => body.name === other.name
        );
        if (bodyObject) {
          bodyObject.prevAcceleration.set(
            body.prevAcceleration.x,
            body.prevAcceleration.y,
            body.prevAcceleration.z
          );
          bodyObject.position.set(
            body.position.x,
            body.position.y,
            body.position.z
          );
          bodyObject.velocity.set(
            body.velocity.x,
            body.velocity.y,
            body.velocity.z
          );
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

  // const promises = chunks.map((chunk) => {
  //   return gravityWorkerPool
  //     .executeTask({ chunk, planetsData, scale, deltaTime })
  //     .then((result) => {
  //       result.forEach((body) => {
  //         const bodyObject = bodiesWithGravity.find(
  //           (other: Body) => body.name === other.name
  //         );
  //         if (bodyObject) {
  //           bodyObject.prevAcceleration.set(
  //             body.prevAcceleration.x,
  //             body.prevAcceleration.y,
  //             body.prevAcceleration.z
  //           );
  //           bodyObject.position.set(
  //             body.position.x,
  //             body.position.y,
  //             body.position.z
  //           );
  //           bodyObject.velocity.set(
  //             body.velocity.x,
  //             body.velocity.y,
  //             body.velocity.z
  //           );
  //         }
  //       });
  //     });
  // });

  //await Promise.all(promisesVelicities);
  async function leapFrog(
    chunks: any,
    planetsData: any,
    scale: any,
    deltaTime: any
  ) {
    const halfVelBodiesPromises = chunks.map((chunk: any) =>
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
}

init();
// window.addEventListener("click", (event) => createBodyAtPointer(event), false);
// function createBodyAtPointer(event) {
//   const mouse = new THREE.Vector2();
//   const raycaster = new THREE.Raycaster();

//   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

//   raycaster.setFromCamera(mouse, camera);

//   const plane = new THREE.Plane(new THREE.Vector3(0, 0.5, 0), 0);
//   const intersection = new THREE.Vector3();
//   raycaster.ray.intersectPlane(plane, intersection);

//   const newBody = new Body({
//     name: "newBody",
//     radius: Constants.MOON_SIZE,
//     widthSegments: 32,
//     heightSegments: 32,
//     mass: Constants.MOON_MASS,
//     velocity: [0, 0, 0],
//     position: [intersection.x, intersection.y, intersection.z],
//   });

//   scene.add(newBody);
//   bodies.push(newBody);
//   planetWorkerService.addBody(newBody);
//   newBody.printLine();
//   scene.add(newBody.getTrailLine());
// }

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
