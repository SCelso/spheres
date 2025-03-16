import * as THREE from "three";
import { GeometryService } from "./GeometryService";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { Body, Container } from "../shapes";
import { renderer } from "../basic";
import { SUN_SIZE, TARGET_CAM_DISTANCE } from "../constants/constants";

export class CameraService {
  static instance: CameraService;
  orbitControls;
  camera;
  container = new Container(SUN_SIZE);
  geometryService;
  bodiesTarget: Body[] = [];

  constructor(bodiesTarget: Body[]) {
    this.geometryService = GeometryService.getInstance();
    this.bodiesTarget = bodiesTarget;
    this.camera = this.createPerspectiveCamera({
      fov: 75,
      aspect: window.innerWidth / window.innerHeight,
      near: 1e-9,
      far: 1e9,
    });

    this.container.add(this.camera);
    this.orbitControls = new OrbitControls(this.camera, renderer.domElement);

    this.orbitControls.enablePan = false;
    // this.orbitControls.enableDamping = true;
    // this.orbitControls.dampingFactor = 0.1;
    this.orbitControls.zoomSpeed = 5;
    this.camera.position.set(-5, 0, 0);
    this.container.setCurrentTarget(this.bodiesTarget[0]);
    this.adjustDistanceCamera(this.container.getCurrentTarget());
  }

  static getInstance(bodiesTarget: Body[]) {
    if (!CameraService.instance) {
      CameraService.instance = new CameraService(bodiesTarget);
    }
    return CameraService.instance;
  }

  createPerspectiveCamera(camera: {
    fov: number;
    aspect: number;
    near: number;
    far: number;
  }) {
    const { fov, aspect, near, far } = camera;
    const cameraObject = new THREE.PerspectiveCamera(fov, aspect, near, far);
    return cameraObject;
  }

  changeCamera(planet: string = "") {
    let planetIndex = 0;

    if (planet) {
      console.log(this.bodiesTarget);
      const findIndex = this.bodiesTarget.findIndex(
        (planetArray) => planetArray.name === planet.toUpperCase()
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

  setPositionInContainer(position: THREE.Object3D<THREE.Object3DEventMap>) {
    this.container.copy(position);
  }

  adjustDistanceCamera(currentTarget: Body) {
    this.orbitControls.minDistance =
      currentTarget.getRadius() * TARGET_CAM_DISTANCE;
    this.orbitControls.maxDistance =
      currentTarget.getRadius() * TARGET_CAM_DISTANCE;
    this.orbitControls.update();
    this.orbitControls.minDistance = 0;
    this.orbitControls.maxDistance = Infinity;
  }
}
