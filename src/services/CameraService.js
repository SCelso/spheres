import * as THREE from "three";
import { GeometryService } from "./GeometryService";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { SUN_SIZE, TARGET_CAM_DISTANCE } from "../constants/constants";
import { Container } from "../shapes";
import { renderer } from "../basic";

export class CameraService {
  static instance;
  orbitControls;
  camera;
  container = new Container(SUN_SIZE);
  geometryService;
  bodiesTarget = [];

  constructor(bodiesTarget) {
    this.geometryService = GeometryService.getInstance();
    this.bodiesTarget = bodiesTarget;
    this.camera = this.createPerspectiveCamera({
      fov: 75,
      aspect: window.innerWidth / window.innerHeight,
      near: 1e-3,
      far: 1e9,
    });

    this.container.add(this.camera);
    this.orbitControls = new OrbitControls(this.camera, renderer.domElement);

    this.orbitControls.enablePan = false;

    this.orbitControls.zoomSpeed = 5;
    this.camera.position.set(-5, 0, 0);
    this.container.setCurrentTarget(this.bodiesTarget[0]);
    this.adjustDistanceCamera(this.container.getCurrentTarget());
  }

  static getInstance(bodiesTarget) {
    if (!CameraService.instance) {
      CameraService.instance = new CameraService(bodiesTarget);
    }
    return CameraService.instance;
  }

  createPerspectiveCamera({ fov, aspect, near, far }) {
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    return camera;
  }

  changeCamera(planet = "") {
    let planetIndex = 0;

    if (planet) {
      const findIndex = this.bodiesTarget.findIndex(
        (planetArray) => planetArray.name === planet
      );

      findIndex > -1 ? (planetIndex = findIndex) : (planetIndex = 0);
    } else {
      this.bodiesTarget.push(this.bodiesTarget[planetIndex]);
      this.bodiesTarget.shift();
    }

    this.container.setCurrentTarget(this.bodiesTarget[planetIndex]);
    const size = this.geometryService.getObjectSize(
      this.bodiesTarget[planetIndex]
    );

    this.geometryService.updateBoxSize(this.container, size.x, size.y, size.z);
    this.container.position.copy(this.bodiesTarget[planetIndex].position);

    this.adjustDistanceCamera(this.container.getCurrentTarget());
  }

  getContainer() {
    return this.container;
  }

  getCamera() {
    return this.camera;
  }

  setPositionInContainer(position) {
    this.container.copy(position);
  }

  adjustDistanceCamera(currentTarget) {
    this.orbitControls.minDistance =
      currentTarget.getRadius() * TARGET_CAM_DISTANCE;
    this.orbitControls.maxDistance =
      currentTarget.getRadius() * TARGET_CAM_DISTANCE;
    this.orbitControls.update();
    this.orbitControls.minDistance = 0;
    this.orbitControls.maxDistance = Infinity;
  }
}
