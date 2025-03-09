export function calculateAngularIncrement(secondsPerLap, deltaTime) {
  const angleIncrementRadians = ((2 * Math.PI) / secondsPerLap) * deltaTime;
  return angleIncrementRadians;
}

export function calculateDeltaTime(currentTime, previousTime, timeScale) {
  return (currentTime - previousTime) / 1000 / timeScale.scale;
}
