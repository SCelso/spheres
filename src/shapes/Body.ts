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

  trailLineGravity: THREE.Line;
  rotateAngle = 0;
  trailDotsRelative: THREE.Vector3[] = [];
  trailDotsGlobal: THREE.Vector3[] = [];

  orbitDots: THREE.Vector3[] = [];
  orbitLine: THREE.Line;
  trailMaterial;
  trailLine: THREE.Line;

  meanAnomaly: number = 0;
  orbitalPeriod: number = 0;
  orbitCounterClockwise = true;

  perihelionPosisition = new THREE.Vector3();
  perihelionVelocity = new THREE.Vector3();
  perihelionMatrix = new THREE.Matrix4();

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
    orbitalPeriod?: number;
    orbitCounterClockwise?: boolean;
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
      orbitalPeriod,
      orbitCounterClockwise: orbitCounterClockwise,
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
    this.position.copy(
      position ? new THREE.Vector3(...position) : new THREE.Vector3(0, 0, 0)
    );
    this.velocity = velocity
      ? new THREE.Vector3(...velocity)
      : new THREE.Vector3(0, 0, 0);

    this.semimajorAxis = semimajorAxis ?? 0;
    this.eccentricity = eccentricity ?? 0;
    this.inclination = inclination ?? 0;
    this.argumentOfPeriapsis = argumentOfPeriapsis ?? 0;
    this.longitudeOfAscendingNode = longitudeOfAscendingNode ?? 0;

    this.trailColor = trailColor ?? [0.5, 0.5, 0.5];
    this.orbitalPeriod = orbitalPeriod ?? 0;
    this.orbitCounterClockwise = orbitCounterClockwise ?? false;
    this.perihelionMatrix = this.calculatePerihelionMatrix();
    this.orbitLine = this.createOrbit();
    this.trailMaterial = this.createTrailMaterial();
    this.trailLine = this.createTrailLine();
    this.trailLineGravity = this.initializeTrailLine();

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
  getOrbitLine() {
    return this.orbitLine;
  }

  getTrailLine() {
    return this.trailLine;
  }

  getGravityTrailLine() {
    return this.trailLineGravity;
  }

  public initializeTrailLine() {
    const geometry = new THREE.BufferGeometry().setFromPoints(
      this.trailDotsGlobal
    );

    const colors = new Float32Array(this.trailDotsGlobal.length * 4);
    for (let i = 0; i < this.trailDotsGlobal.length; i++) {
      const ratio = i / (this.trailDotsGlobal.length - 1);
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

  public printTrailLineGravity() {
    this.trailLineGravity.geometry.dispose();
    this.trailLineGravity.geometry = new THREE.BufferGeometry().setFromPoints(
      this.trailDotsGlobal
    );

    const colors = new Float32Array(this.trailDotsGlobal.length * 4);
    for (let i = 0; i < this.trailDotsGlobal.length; i++) {
      const ratio = i / (this.trailDotsGlobal.length - 1);
      colors[i * 4] = this.trailColor[0];
      colors[i * 4 + 1] = this.trailColor[1];
      colors[i * 4 + 2] = this.trailColor[2];
      colors[i * 4 + 3] = 0 + ratio;
    }

    this.trailLineGravity.geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 4)
    );
  }

  public updateTrailDots() {
    if (
      this.orbited &&
      Math.abs(this.orbited.position.distanceTo(this.position)) < 10
    ) {
      const relativePosition = this.position.clone().sub(this.orbited.position);

      if (this.trailDotsRelative.length >= 100) {
        this.trailDotsRelative.shift();
      }
      this.trailDotsRelative.push(relativePosition);

      this.trailDotsGlobal = this.trailDotsRelative.map((relPos) =>
        relPos.clone().add(this.orbited!.position)
      );
    } else {
      this.trailDotsRelative = [];
      if (this.trailDotsGlobal.length >= 100) {
        this.trailDotsGlobal.shift();
      }
      this.trailDotsGlobal.push(this.position.clone());
    }
  }

  public initializePerihelionPosition() {
    if (!this.orbited) return;
    const perihelionDistance = this.semimajorAxis * (1 - this.eccentricity);
    const positionInOrbitalPlane = new THREE.Vector3(perihelionDistance, 0, 0);

    const rotationMatrix = this.perihelionMatrix;

    this.position.addVectors(
      this.orbited.getPosition(),
      positionInOrbitalPlane.applyMatrix4(rotationMatrix)
    );

    const velocityInOrbitalPlane = new THREE.Vector3(...this.velocity);
    this.velocity.addVectors(
      velocityInOrbitalPlane.applyMatrix4(rotationMatrix),
      this.orbited.getVelocity()
    );

    this.perihelionPosisition.copy(this.position);
    this.perihelionVelocity.copy(this.velocity);
  }

  private calculatePerihelionMatrix() {
    const inclinationRad = THREE.MathUtils.degToRad(this.inclination);
    const argumentOfPeriapsisRad = THREE.MathUtils.degToRad(
      this.argumentOfPeriapsis
    );
    const longitudeOfAscendingNodeRad = THREE.MathUtils.degToRad(
      this.longitudeOfAscendingNode
    );

    const rotationMatrix = new THREE.Matrix4();

    rotationMatrix.makeRotationY(-longitudeOfAscendingNodeRad);

    rotationMatrix.multiply(new THREE.Matrix4().makeRotationX(-inclinationRad));

    rotationMatrix.multiply(
      new THREE.Matrix4().makeRotationY(-argumentOfPeriapsisRad)
    );

    return rotationMatrix;
  }

  public resetPosition() {
    this.position.copy(this.perihelionPosisition);
    this.velocity.copy(this.perihelionVelocity);
  }

  private fillOrbitDots() {
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

    const points2D = curve.getPoints(10000);
    this.orbitDots = points2D.map((p) => new THREE.Vector3(p.x, 0, p.y));
  }

  private createOrbit() {
    this.fillOrbitDots();
    const geometry = new THREE.BufferGeometry().setFromPoints(this.orbitDots);
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(...this.trailColor),
      transparent: true,
      opacity: 0.5,
    });
    const params: number[] = [];
    const total = this.orbitDots.length;
    for (let i = 0; i < total; i++) {
      params.push(i / (total - 1));
    }
    geometry.setAttribute(
      "aParam",
      new THREE.Float32BufferAttribute(params, 1)
    );

    const ellipse = new THREE.Line(geometry, material);

    const matrix = this.perihelionMatrix;
    ellipse.applyMatrix4(matrix);
    if (this.orbited) {
      ellipse.position.copy(this.orbited.position);
    }

    return ellipse;
  }

  private createTrailLine(): THREE.Line {
    this.trailLine = new THREE.Line(
      this.orbitLine.geometry.clone(),
      this.trailMaterial
    );
    this.trailLine.applyMatrix4(this.orbitLine.matrix);
    this.trailLine.position.copy(this.orbitLine.position);

    return this.trailLine;
  }

  private createTrailMaterial(): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
      vertexShader: ` varying vec3 vWorldPosition;
      varying vec3 vPosition;
      void main() {
        vPosition = position;
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
      fragmentShader: ` varying vec3 vWorldPosition;
      varying vec3 vPosition;
      uniform vec3 planetPosition;
      uniform vec3 velocityDir;
      uniform vec3 trailColor;
      uniform float trailLength;
      
      void main() {
        // Vector desde el planeta al punto de la órbita
        vec3 toPoint = vWorldPosition - planetPosition;
         
        float proj = dot(normalize(velocityDir), normalize(toPoint));
        
        // Solo puntos detrás del planeta (proyección negativa)
        if(proj > 0.0) discard;
        
        // Intensidad basada en la distancia
        float distance = length(toPoint);
        float intensity = 1.0 - smoothstep(0.0, trailLength, distance);
        
        // Suavizado lateral
        float lateral = 1.0 - smoothstep(0.0, trailLength * 0.2, length(cross(toPoint, velocityDir)));
        
        gl_FragColor = vec4(trailColor, intensity * lateral);
      }`,
      uniforms: {
        planetPosition: { value: new THREE.Vector3() },
        velocityDir: { value: new THREE.Vector3() },
        trailColor: { value: new THREE.Color(...this.trailColor) },
        trailLength: { value: 0 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
  }

  public updateOrbitalPosition(deltaTime: number, timeScale: number) {
    if (!this.orbited) return;
    const direction = this.orbitCounterClockwise ? -1 : 1;

    this.meanAnomaly +=
      (direction * (2 * Math.PI * deltaTime * timeScale)) / this.orbitalPeriod;
    this.meanAnomaly %= 2 * Math.PI;

    const trueAnomaly = this.calculateTrueAnomaly(
      this.meanAnomaly,
      this.eccentricity
    );

    const r =
      (this.semimajorAxis * (1 - this.eccentricity ** 2)) /
      (1 + this.eccentricity * Math.cos(trueAnomaly));
    const x = r * Math.cos(trueAnomaly);
    const z = r * Math.sin(trueAnomaly);
    const posInOrbitalPlane = new THREE.Vector3(x, 0, z);
    const rotationMatrix = this.perihelionMatrix;
    const position = posInOrbitalPlane.clone().applyMatrix4(rotationMatrix);

    this.position.copy(position.add(this.orbited.position));
    if (this.trailLine && this.trailMaterial) {
      const tangentInPlane = new THREE.Vector3(-z, 0, x).normalize();
      const tangent = tangentInPlane.clone().applyMatrix4(rotationMatrix);
      tangent.multiplyScalar(timeScale > 0 ? direction : -direction);
      this.trailMaterial.uniforms.planetPosition.value.copy(this.position);

      this.trailMaterial.uniforms.velocityDir.value.copy(tangent);
      this.trailMaterial.uniforms.trailLength.value =
        (Math.abs(timeScale) / 1000000) * this.semimajorAxis;

      this.trailMaterial.uniformsNeedUpdate = true;
    }
  }

  private calculateTrueAnomaly(
    meanAnomaly: number,
    eccentricity: number
  ): number {
    let E = meanAnomaly;
    let delta = 1;

    for (let i = 0; i < 50; i++) {
      delta = E - eccentricity * Math.sin(E) - meanAnomaly;
      E -= delta / (1 - eccentricity * Math.cos(E));
    }

    return (
      2 *
      Math.atan2(
        Math.sqrt(1 + eccentricity) * Math.sin(E / 2),
        Math.sqrt(1 - eccentricity) * Math.cos(E / 2)
      )
    );
  }

  private getPositionInOrbit(trueAnomaly: number): THREE.Vector3 {
    const r =
      (this.semimajorAxis * (1 - this.eccentricity ** 2)) /
      (1 + this.eccentricity * Math.cos(trueAnomaly));

    const x = r * Math.cos(trueAnomaly);
    const y = 0;
    const z = r * Math.sin(trueAnomaly);

    const rotationMatrix = this.perihelionMatrix;

    return new THREE.Vector3(x, y, z).applyMatrix4(rotationMatrix);
  }
}
