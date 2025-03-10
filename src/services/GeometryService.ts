import * as THREE from "three";
import { Body, Container } from "../shapes";

export class GeometryService {
  static instance: GeometryService;

  constructor() {}

  static getInstance() {
    if (!GeometryService.instance) {
      GeometryService.instance = new GeometryService();
    }
    return GeometryService.instance;
  }

  getObjectSize(object: THREE.Mesh) {
    const box = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3();
    box.getSize(size);
    size.multiply(object.scale);
    return size;
  }

  updateBoxSize(
    object3D: Container,
    width: number,
    height: number,
    depth: number
  ) {
    const newGeometry = new THREE.BoxGeometry(width, height, depth);

    if (object3D.geometry) {
      object3D.geometry.dispose();
    }

    object3D.geometry = newGeometry;
  }
}
