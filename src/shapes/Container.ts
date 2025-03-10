import * as THREE from "three";
import { Body } from "./Body";
import { SUN } from "../constants/constants";

export class Container extends THREE.Mesh {
  currentTarget: Body = new Body(SUN);
  constructor(radius: number) {
    const size = radius * 2;

    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
    });

    super(geometry, material);
    this.visible = false;
  }

  setCurrentTarget(currentTarget: Body) {
    this.currentTarget = currentTarget;
  }

  getCurrentTarget(): Body {
    return this.currentTarget;
  }
}
