self.onmessage = (e) => {
  const { chunk, scale, deltaTime } = e.data;
  const updates = structuredClone(chunk);
  const subSteps = 10;
  const baseDt = deltaTime;

  const dt = (baseDt * scale) / subSteps;

  //const dt = Math.min(dtRaw, 1e4);
  for (let step = 0; step < subSteps; step++) {
    //const accelerations = calculateAccelerations(updates, planetsData);

    updates.forEach(
      (body: {
        position: { x: number; y: number; z: number };
        velocity: { x: number; y: number; z: number };
        acceleration: { x: number; y: number; z: number };
      }) => {
        body.position.x += body.velocity.x * dt;
        body.position.y += body.velocity.y * dt;
        body.position.z += body.velocity.z * dt;
      }
    );
  }
  self.postMessage(updates);
};
