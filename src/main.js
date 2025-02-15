import * as THREE from "three";

import scene from "./basic/Scene.js";
import renderer from "./basic/Renderer.js";
import light from "./basic/Light.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Star } from "./shapes/Star.js";
import { Planet } from "./shapes/Planet.js";
import onWindowResize from "./basic/Resize.js";
import { Container } from "./shapes/Container.js";
import { CameraService } from "./services/CameraService.js";
import * as Constants from "./constants.js";
import * as Calculations from "./utils/calculations.js";
import * as TexturesRoutes from "./textures.js";
import { TexturesService } from "./services/TexturesService.js";
import Stats from "stats.js";
import { PlanetWorkerService } from "./services/PlanetWorkerService.js";

var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

const cameraService = CameraService.getInstance();
const texturesService = TexturesService.getInstance();

const camera = cameraService.createPerspectiveCamera({
  fov: 75,
  aspect: window.innerWidth / window.innerHeight,
  near: 0.001,
  far: 100000,
});
const controls = new OrbitControls(camera, renderer.domElement);
//OBJECTS
const container = new Container(Constants.EARTH_SIZE);
const allMeshesJSON = initializeAllMeshes(Constants.MESHES_DEFINITION);

const allMeshes = Object.values(allMeshesJSON);
const planets = allMeshes.filter((mesh) => mesh instanceof Planet);

const earthClouds = allMeshes.filter((mesh) => mesh.name === "earthClouds")[0];
const earth = allMeshes.filter((mesh) => mesh.name === "earth")[0];

const bodiesWithWorkers = [...planets, earthClouds];

const planetWorkerService = new PlanetWorkerService(bodiesWithWorkers);

const cameraTargets = allMeshes.filter((mesh) => mesh.canBeFocused);
const sceneElements = [light, container, ...allMeshes];

//TEXTURES
const meshesWithTextures = createMeshesWithTexturesJSON(allMeshes);

const texturesPromises = [];
let previousTime = 0;

meshesWithTextures.forEach((meshWithTextures) => {
  texturesPromises.push(
    loadAndApplyTextures(meshWithTextures.mesh, meshWithTextures.texturesRoute)
  );
});

await Promise.all(texturesPromises);

container.visible = false;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

camera.position.set(5, 0, 0);
container.add(camera);
container.setCurrentTarget(cameraTargets[0]);

earth.add(earthClouds);
earthClouds.position.set(0, 0, 0);

controls.update();

requestAnimationFrame(animate);

sceneElements.forEach((element) => {
  scene.add(element);
});

window.addEventListener("keypress", () =>
  cameraService.changeCamera(container, cameraTargets)
);

window.addEventListener(
  "resize",
  () => onWindowResize(camera, renderer),
  false
);

async function loadAndApplyTextures(mesh, texturesRoute) {
  const texturesLoaded = await texturesService.loadTextures(texturesRoute);
  texturesService.applyTextures(mesh, texturesLoaded);
}

function createMeshesWithTexturesJSON(allMeshes) {
  return allMeshes.map((mesh) => {
    return {
      mesh,
      texturesRoute: TexturesRoutes.texturesRouteMap[mesh.name] || undefined, // Usa un valor por defecto si no se encuentra la textura
    };
  });
}
function initializeAllMeshes(meshesDefinition) {
  const sun = new Star(Constants.SUN);

  const allMeshes = {};
  allMeshes[sun.name] = sun;

  meshesDefinition.forEach((planet) => {
    const planetMesh = new Planet(planet);

    planetMesh.setOrbited(sun);
    allMeshes[planet.name] = planetMesh;
  });
  const moon = allMeshes["moon"];
  const earth = allMeshes["earth"];

  moon.setOrbited(earth);

  return allMeshes;
}

function animate(currentTime) {
  stats.begin();
  const deltaTime = Calculations.calculateDeltaTime(currentTime, previousTime); // Tiempo en segundos
  previousTime = currentTime;

  planetWorkerService.update(deltaTime);

  container.position.copy(container.getCurrentTarget().position);

  earthClouds.position.copy(earth.position);
  camera.lookAt(container.position);

  renderer.render(scene, camera);
  stats.end();
  requestAnimationFrame(animate);
}
