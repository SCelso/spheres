export function calculateAngularIncrement(secondsPerLap, deltaTime) {
  const angleIncrementRadians = (2 * Math.PI /secondsPerLap) * deltaTime
  return angleIncrementRadians;
}