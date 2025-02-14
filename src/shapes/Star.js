import * as THREE from "three";

export class Star extends THREE.Mesh {
  isPlanet = false;
  canBeFocused = false;
  constructor({
    name,
    radius,
    widthSegments,
    heightSegments,
    isPlanet = false,
    canBeFocused = false,
  }) {
    const geometry = new THREE.SphereGeometry(
      radius,
      widthSegments,
      heightSegments
    );
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });

    material.emissive = new THREE.Color(0xff8000);
    material.emissiveIntensity = 1;
    material.blendAlpha = 100;

    super(geometry, material);
    this.name = name;
    this.isPlanet = isPlanet;
    this.canBeFocused = canBeFocused;
  }

  addStar(scene) {
    const [x, y, z] = Array(3)
      .fill()
      .map(() => THREE.MathUtils.randFloatSpread(1000));
    this.position.set(x, y, z);
    scene.add(this);
  }
}
