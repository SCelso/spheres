self.onmessage = (e) => {
  const {
    deltaTime,
    orbitalPeriod,
    sideralDay,
    translationAngle,
    rotationAngle,
    distanceToOrbited,
    translateCCW,
    rotateCCW,
    orbitedX,
    orbitedZ,
  } = e.data;

  const translationIncrement = (2 * Math.PI * deltaTime) / orbitalPeriod;
  let newTranslationAngle = translateCCW
    ? translationAngle - translationIncrement
    : translationAngle + translationIncrement;
  newTranslationAngle %= 2 * Math.PI;

  const rotationIncrement = (2 * Math.PI * deltaTime) / sideralDay;
  let newRotationAngle = rotateCCW
    ? rotationAngle - rotationIncrement
    : rotationAngle + rotationIncrement;
  newRotationAngle %= 2 * Math.PI;

  let newX = orbitedX + Math.cos(newTranslationAngle) * distanceToOrbited;
  let newZ = orbitedZ + Math.sin(newTranslationAngle) * distanceToOrbited;

  self.postMessage({
    newTranslationAngle,
    newRotationAngle,
    newX,
    newZ,
  });
};
