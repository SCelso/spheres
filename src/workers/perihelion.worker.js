import * as THREE from "three";

self.onmessage = (e) => {
  const planetData = e.data;
  const perihelionDistance =
    planetData.semimajorAxis * (1 - planetData.eccentricity);

  const positionInOrbitalPlane = new THREE.Vector3(perihelionDistance, 0, 0);
  const inclinationRad = THREE.MathUtils.degToRad(planetData.inclination);
  const argumentOfPeriapsisRad = THREE.MathUtils.degToRad(
    planetData.argumentOfPeriapsis
  );
  const longitudeOfAscendingNodeRad = THREE.MathUtils.degToRad(
    planetData.longitudeOfAscendingNode
  );

  const rotationMatrix = new THREE.Matrix4();

  rotationMatrix.makeRotationY(-longitudeOfAscendingNodeRad);

  rotationMatrix.multiply(new THREE.Matrix4().makeRotationX(-inclinationRad));

  rotationMatrix.multiply(
    new THREE.Matrix4().makeRotationY(-argumentOfPeriapsisRad)
  );

  const newPosition = positionInOrbitalPlane.applyMatrix4(rotationMatrix);

  const velocityInOrbitalPlane = new THREE.Vector3(0, 0, planetData.velocity.z);
  const newVelocity = velocityInOrbitalPlane.applyMatrix4(rotationMatrix);

  self.postMessage({ newPosition, newVelocity });
};
