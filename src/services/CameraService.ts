import * as THREE from "three";
import { GeometryService, BoxProperties } from "./GeometryService";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { Body } from "../shapes/Body";
import { Container } from "../shapes/Container";

import { renderer } from "../basic";
import { SUN_SIZE, TARGET_CAM_DISTANCE } from "../constants/constants";
import { MovementService } from "./MovementService";
type PerspectiveCameraProperties = {
  fov: number;
  aspect: number;
  near: number;
  far: number;
};
export class CameraService {
  static instance: CameraService;
  geometryService;
  movementService;
  orbitControls;
  camera;
  container = new Container(SUN_SIZE);
  bodiesTarget: Body[] = [];

  constructor(bodiesTarget: Body[]) {
    this.geometryService = GeometryService.getInstance();
    this.movementService = MovementService.getInstance();

    this.bodiesTarget = bodiesTarget;
    this.camera = this.createPerspectiveCamera({
      fov: 75,
      aspect: window.innerWidth / window.innerHeight,
      near: 1e-9,
      far: 1e9,
    });
    this.movementService.setTarget(this.camera);

    this.container.add(this.camera);
    this.dragCamera();
    this.orbitControls = new OrbitControls(this.camera, renderer.domElement);

    this.orbitControls.enableDamping = true;
    this.orbitControls.dampingFactor = 0.05;
    this.orbitControls.enablePan = false;
    this.orbitControls.zoomSpeed = 5;
    this.orbitControls.maxDistance = 1e6;
    this.orbitControls.minDistance = this.container
      .getCurrentTarget()
      .getRadius();

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

  getContainer() {
    return this.container;
  }

  getCamera() {
    return this.camera;
  }

  updateCameraMovement() {
    this.movementService.updateMovement();
  }
  createPerspectiveCamera(cameraProperties: PerspectiveCameraProperties) {
    const { fov, aspect, near, far } = cameraProperties;
    const cameraObject = new THREE.PerspectiveCamera(fov, aspect, near, far);
    return cameraObject;
  }

  dragCamera() {
    window.addEventListener(
      "pointerdown",
      (event) => {
        //verifica si se usan dos dedos al mismo tiempo
        if (event.pointerType === "touch" && event.isPrimary === false) {
          return;
        }
        this.orbitControls.dispose();
        this.orbitControls = new OrbitControls(
          this.camera,
          renderer.domElement
        );
        this.orbitControls.enableDamping = true;
        this.orbitControls.dampingFactor = 0.05;
        this.orbitControls.enablePan = false;
        this.orbitControls.zoomSpeed = 5;
        this.orbitControls.maxDistance = 1e6;
        this.orbitControls.minDistance = this.container
          .getCurrentTarget()
          .getRadius();
      },
      { capture: true }
    );
  }
  changeCamera(planet: string = "") {
    let planetIndex = 0;

    if (planet) {
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

    this.geometryService.updateBoxSize({
      object3D: this.container,
      width: size.x,
      height: size.y,
      depth: size.z,
    });
    this.container.position.copy(this.bodiesTarget[planetIndex].position);

    this.adjustDistanceCamera(this.container.getCurrentTarget());
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
    this.orbitControls.minDistance = currentTarget.getRadius();
    this.orbitControls.maxDistance = 1e6;
  }
}
