import * as THREE from "three";

export class Body extends THREE.Mesh {
  //distanceToOrbited = 0;
  name = undefined;
  radius = undefined;
  widthSegments = undefined;
  heightSegments = undefined;
  mass;
  velocity = new THREE.Vector3(0, 0, 0);
  sideralDay = 0;
  rotateCounterClockWise = false;
  orbited = undefined;
  canBeFocused = false;
  semimajorAxis = 0;
  eccentricity = 0;
  inclination = 0;
  argumentOfPeriapsis = 0;
  longitudeOfAscendingNode = 0;
  trailColor = [1, 1, 1];

  trailDots = [];
  trailLine;
  rotateAngle = 0;

  constructor({
    name,
    radius,
    widthSegments,
    heightSegments,
    sideralDay = 0,
    rotateCounterClockWise = false,
    canBeFocused = false,
    material = undefined,
    geometry = undefined,

    mass = 0,
    velocity = [0, 0, 0],

    eccentricity = 0,
    semimajorAxis = 0,
    inclination = 0,
    longitudeOfAscendingNode = 0,
    argumentOfPeriapsis = 0,
    orbited = undefined,
    trailColor = [1, 1, 1],
  }) {
    material = material ?? new THREE.MeshStandardMaterial({ color: 0xffffff });
    geometry =
      geometry ??
      new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    super(geometry, material);
    this.name = name;
    this.radius = radius;
    this.sideralDay = sideralDay;
    this.rotateCounterClockWise = rotateCounterClockWise;
    this.canBeFocused = canBeFocused;
    // this.distanceToOrbited = distanceToOrbited;

    this.mass = mass;
    this.velocity.set(...velocity);
    // this.position.set(...position);

    this.semimajorAxis = semimajorAxis;
    this.eccentricity = eccentricity;
    this.inclination = inclination;
    this.argumentOfPeriapsis = argumentOfPeriapsis;
    this.longitudeOfAscendingNode = longitudeOfAscendingNode;

    this.orbited = orbited;
    this.trailColor = trailColor;

    this.frustumCulled = false;
    this.initializeTrailLine();
    console.log(
      this.distanceToOrbited,
      this.sideralDay,
      this.rotateAngle,
      this.rotateCounterClockWise,
      this.canBeFocused,
      this.velocity,
      this.mass,
      this.trailDots,
      this.trailLine,
      orbited,
      eccentricity,
      semimajorAxis,
      inclination,
      longitudeOfAscendingNode,
      argumentOfPeriapsis,
      trailColor
    );
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
  // getDistanceToOrbited() {
  //   return this.distanceToOrbited;
  // }

  getOrbited() {
    return this.orbited;
  }
  setOrbited(orbited) {
    this.orbited = orbited;
  }

  setAngle(newAngle) {
    this.angle = newAngle;
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

    this.trailLine = new THREE.Line(
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
    if (this.orbited == undefined) {
      console.log(this.name);
      this.orbited.position = new THREE.Vector3(0, 0, 0);
    } else {
      console.log(this.orbited.getVelocity());
    }
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

    const velocityInOrbitalPlane = new THREE.Vector3(0, 0, this.velocity.z);
    this.velocity.addVectors(
      velocityInOrbitalPlane.applyMatrix4(rotationMatrix),
      this.orbited.getVelocity()
    );
  }

  calculatePerihelionMatrix(
    longitudeOfAscendingNode,
    inclination,
    argumentOfPeriapsis
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
