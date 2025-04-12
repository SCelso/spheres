import * as THREE from "three";

type MovementTarget = THREE.Object3D<THREE.Object3DEventMap>;

export class MovementService {
  static instance: MovementService;

  private keysPressed: Record<string, boolean> = {
    w: false,
    a: false,
    s: false,
    d: false,
  };

  private moveSpeed: number = 0.1;
  private target: MovementTarget | undefined = undefined;

  constructor() {
    this.setupListeners();
  }

  static getInstance() {
    if (!MovementService.instance) {
      MovementService.instance = new MovementService();
    }
    return MovementService.instance;
  }

  setTarget(object: MovementTarget) {
    this.target = object;
  }

  setSpeed(speed: number) {
    this.moveSpeed = speed;
  }

  private setupListeners() {
    document.addEventListener("keydown", (event) => {
      const key = event.key.toLowerCase();
      if (this.keysPressed.hasOwnProperty(key)) {
        this.keysPressed[key] = true;
      }
    });

    document.addEventListener("keyup", (event) => {
      const key = event.key.toLowerCase();
      if (this.keysPressed.hasOwnProperty(key)) {
        this.keysPressed[key] = false;
      }
    });
  }

  updateMovement() {
    if (!this.target) return;

    const direction = new THREE.Vector3();
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();

    this.target.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    right.crossVectors(this.target.up, forward).normalize();

    if (this.keysPressed.w) direction.add(forward);
    if (this.keysPressed.s) direction.sub(forward);
    if (this.keysPressed.a) direction.sub(right);
    if (this.keysPressed.d) direction.add(right);

    direction.normalize().multiplyScalar(this.moveSpeed);
    this.target.position.add(direction);
  }
}
