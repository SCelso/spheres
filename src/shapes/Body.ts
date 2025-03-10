import * as THREE from "three";

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
      position,
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
      this.trailDots
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
    if (this.trailDots.length >= 100) {
      this.trailDots.shift();
    }

    this.trailDots.push(this.position.clone());
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
}
