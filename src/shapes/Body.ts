import * as THREE from "three";
import { G } from "../constants/constants";

export class Body extends THREE.Mesh<
  THREE.BufferGeometry,
  THREE.Material | THREE.Material[]
> {
  radius: number;
  widthSegments: number = 0;
  heightSegments: number = 0;
  mass: number;
  velocity: THREE.Vector3;

  sideralDay: number = 0;
  rotateCounterClockWise: boolean = false;
  orbited: Body | undefined;
  canBeFocused: boolean = false;
  semimajorAxis: number = 0;
  eccentricity: number = 0;
  inclination: number = 0;
  argumentOfPeriapsis: number = 0;
  longitudeOfAscendingNode: number = 0;
  trailColor: number[] = [1, 1, 1];

  trailDots: THREE.Vector3[] = [];
  trailLine: THREE.Line = this.initializeTrailLine();
  rotateAngle = 0;
  trailDotsRelative: THREE.Vector3[] = [];
  trailDotsGlobal: THREE.Vector3[] = [];
  orbit: THREE.Line = new THREE.Line();

  prevAcceleration: THREE.Vector3;
  constructor(body: {
    name: string;
    radius: number;
    widthSegments: number;
    heightSegments: number;
    sideralDay?: number;
    rotateCounterClockWise?: boolean;
    canBeFocused: boolean;
    material?: THREE.Material;
    geometry?: THREE.BufferGeometry;

    position?: number[];
    mass?: number;
    velocity?: number[];
    eccentricity?: number;
    semimajorAxis?: number;
    inclination?: number;
    longitudeOfAscendingNode?: number;
    argumentOfPeriapsis?: number;
    trailColor?: number[];
  }) {
    let {
      name,
      radius,
      widthSegments,
      heightSegments,
      sideralDay,
      rotateCounterClockWise,
      canBeFocused,
      material,
      geometry,
      mass,
      velocity,
      eccentricity,
      semimajorAxis,
      inclination,
      longitudeOfAscendingNode,
      argumentOfPeriapsis,
      trailColor,
    } = body;

    material = material ?? new THREE.MeshStandardMaterial({ color: 0xffffff });
    geometry =
      geometry ??
      new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    super(geometry, material);
    this.name = name;
    this.radius = radius;
    this.sideralDay = sideralDay ?? 0;
    this.rotateCounterClockWise = rotateCounterClockWise ?? false;
    this.canBeFocused = canBeFocused;

    this.mass = mass ?? 0;
    this.velocity = velocity
      ? new THREE.Vector3(...velocity)
      : new THREE.Vector3(0, 0, 0);

    this.prevAcceleration = new THREE.Vector3(0, 0, 0);
    this.semimajorAxis = semimajorAxis ?? 0;
    this.eccentricity = eccentricity ?? 0;
    this.inclination = inclination ?? 0;
    this.argumentOfPeriapsis = argumentOfPeriapsis ?? 0;
    this.longitudeOfAscendingNode = longitudeOfAscendingNode ?? 0;

    this.trailColor = trailColor ?? [1, 1, 1];

    this.frustumCulled = false;
  }

  getMass() {
    return this.mass;
  }

  getPosition() {
    return this.position;
  }

  getVelocity() {
    return this.velocity;
  }

  getRotateCounterClockWise() {
    return this.rotateCounterClockWise;
  }
  getSideralDay() {
    return this.sideralDay;
  }

  getOrbited() {
    return this.orbited;
  }
  setOrbited(orbited: Body) {
    this.orbited = orbited;
  }

  getRadius() {
    return this.radius;
  }

  getTrailDots() {
    return this.trailDots;
  }

  getTrailLine() {
    return this.trailLine;
  }

  initializeTrailLine() {
    const geometry = new THREE.BufferGeometry().setFromPoints(this.trailDots);

    const colors = new Float32Array(this.trailDots.length * 4);
    for (let i = 0; i < this.trailDots.length; i++) {
      const ratio = i / (this.trailDots.length - 1);
      colors[i * 4] = this.trailColor[0];
      colors[i * 4 + 1] = this.trailColor[1];
      colors[i * 4 + 2] = this.trailColor[2];
      colors[i * 4 + 3] = 0 + ratio;
    }
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 4));

    return new THREE.Line(
      geometry,
      new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        blending: THREE.NormalBlending,
      })
    );
  }

  printTrailLine() {
    this.trailLine.geometry.dispose();
    this.trailLine.geometry = new THREE.BufferGeometry().setFromPoints(
      this.trailDotsGlobal
    );

    const colors = new Float32Array(this.trailDots.length * 4);
    for (let i = 0; i < this.trailDots.length; i++) {
      const ratio = i / (this.trailDots.length - 1);
      colors[i * 4] = this.trailColor[0];
      colors[i * 4 + 1] = this.trailColor[1];
      colors[i * 4 + 2] = this.trailColor[2];
      colors[i * 4 + 3] = 0 + ratio;
    }

    this.trailLine.geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 4)
    );
  }

  updateTrailDots() {
    if (!this.orbited) return;

    // 1. Calcular posición RELATIVA al planeta orbitado
    const relativePosition = this.position.clone().sub(this.orbited.position);

    // 2. Mantener el histórico de posiciones relativas
    if (this.trailDotsRelative.length >= 100) {
      this.trailDotsRelative.shift();
    }
    this.trailDotsRelative.push(relativePosition);

    // 3. Convertir a posiciones globales usando la posición ACTUAL del planeta
    this.trailDotsGlobal = this.trailDotsRelative.map((relPos) =>
      relPos.clone().add(this.orbited!.position)
    );

    // 4. Actualizar los puntos de la estela visible
    this.trailDots = this.trailDotsGlobal;
  }

  initializePerihelionPosition() {
    if (!this.orbited) return;
    const perihelionDistance = this.semimajorAxis * (1 - this.eccentricity);
    const positionInOrbitalPlane = new THREE.Vector3(perihelionDistance, 0, 0);
    const inclinationRad = THREE.MathUtils.degToRad(this.inclination);
    const argumentOfPeriapsisRad = THREE.MathUtils.degToRad(
      this.argumentOfPeriapsis
    );
    const longitudeOfAscendingNodeRad = THREE.MathUtils.degToRad(
      this.longitudeOfAscendingNode
    );

    const rotationMatrix = this.calculatePerihelionMatrix(
      longitudeOfAscendingNodeRad,
      inclinationRad,
      argumentOfPeriapsisRad
    );

    this.position.addVectors(
      this.orbited.getPosition(),
      positionInOrbitalPlane.applyMatrix4(rotationMatrix)
    );

    const velocityInOrbitalPlane = new THREE.Vector3(...this.velocity);
    this.velocity.addVectors(
      velocityInOrbitalPlane.applyMatrix4(rotationMatrix),
      this.orbited.getVelocity()
    );
  }

  calculatePerihelionMatrix(
    longitudeOfAscendingNode: number,
    inclination: number,
    argumentOfPeriapsis: number
  ) {
    const rotationMatrix = new THREE.Matrix4();

    rotationMatrix.makeRotationY(-longitudeOfAscendingNode);

    rotationMatrix.multiply(new THREE.Matrix4().makeRotationX(-inclination));

    rotationMatrix.multiply(
      new THREE.Matrix4().makeRotationY(-argumentOfPeriapsis)
    );

    return rotationMatrix;
  }

  printOrbit() {
    const semiminorAxis =
      this.semimajorAxis * Math.sqrt(1 - this.eccentricity * this.eccentricity);
    const focus = this.semimajorAxis * this.eccentricity;

    const curve = new THREE.EllipseCurve(
      -focus,
      0,
      this.semimajorAxis,
      semiminorAxis,
      0,
      2 * Math.PI,
      false,
      0
    );

    const points2D = curve.getPoints(1000);
    const points3D = points2D.map((p) => new THREE.Vector3(p.x, 0, p.y));

    const geometry = new THREE.BufferGeometry().setFromPoints(points3D);
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(...this.trailColor),
    });
    const ellipse = new THREE.Line(geometry, material);

    const matrix = this.calculatePerihelionMatrix(
      THREE.MathUtils.degToRad(this.longitudeOfAscendingNode),
      THREE.MathUtils.degToRad(this.inclination),
      THREE.MathUtils.degToRad(this.argumentOfPeriapsis)
    );

    ellipse.applyMatrix4(matrix);
    if (this.orbited) {
      ellipse.position.copy(this.orbited.position);
    }

    return ellipse;
  }
}
