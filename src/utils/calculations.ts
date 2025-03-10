export function calculateAngularIncrement(
  secondsPerLap: number,
  deltaTime: number
) {
  const angleIncrementRadians = ((2 * Math.PI) / secondsPerLap) * deltaTime;
  return angleIncrementRadians;
}

export function calculateDeltaTime(
  currentTime: number,
  previousTime: number,
  timeScale: { scale: number }
) {
  return (currentTime - previousTime) / 1000 / timeScale.scale;
}
