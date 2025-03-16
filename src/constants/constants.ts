export const SCALE = 0.0000001;
export let timeScale = { scale: 1 };
export const SECOND = 1;
export const MINUTE = SECOND * 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 23.934469;
export const YEAR = DAY * 365.25;

export const METER = 1 / SCALE;
export const KILOMETER = 1000 * METER;

export const G = (6.674e-11 * SECOND ** 2) / METER ** 3;
export const smoothing = 0;
export const AU = 1.496e11;

export const EARTH_SIZE = 6378e3 / METER;
export const EARTH_CLOUDS_SIZE = EARTH_SIZE * 1.01;
export const MOON_SIZE = EARTH_SIZE * 0.273;
export const SUN_SIZE = EARTH_SIZE * (109 / 2);
export const MERCURY_SIZE = EARTH_SIZE * 0.383;
export const VENUS_SIZE = EARTH_SIZE * 0.95;
export const MARS_SIZE = EARTH_SIZE * 0.532;
export const JUPITER_SIZE = EARTH_SIZE * 10.97;
export const SATURN_SIZE = EARTH_SIZE * 9.14;
export const URANUS_SIZE = EARTH_SIZE * 3.98;
export const NEPTUNE_SIZE = EARTH_SIZE * 3.86;
export const PHOBOS_SIZE = 1.108e4 / METER;

export const MERCURY_SIDERAL_DAY = (58.6 * DAY) / SECOND;
export const VENUS_SIDERAL_DAY = (243 * DAY) / SECOND;
export const EARTH_SIDERAL_DAY = DAY / SECOND;
export const MARS_SIDERAL_DAY = (24.6 * HOUR) / SECOND;
export const JUPITER_SIDERAL_DAY = (9.93 * HOUR) / SECOND;
export const SATURN_SIDERAL_DAY = (10.7 * HOUR) / SECOND;
export const URANUS_SIDERAL_DAY = (17.24 * HOUR) / SECOND;
export const NEPTUNE_SIDERAL_DAY = (16.11 * HOUR) / SECOND;
export const MOON_SIDERAL_DAY = (27.3 * DAY) / SECOND;
export const EARTH_CLOUDS_SIDERAL_DAY = DAY / 1.4 / SECOND;
export const PHOBOS_SIDERAL_DAY = (0.31891 * DAY) / SECOND;

export const EARTH_MASS = 5.9722e24;
export const MOON_MASS = EARTH_MASS * 0.0123;
export const SUN_MASS = 1.988416e30;
export const MERCURY_MASS = EARTH_MASS * 0.0553;
export const VENUS_MASS = EARTH_MASS * 0.815;
export const MARS_MASS = EARTH_MASS * 0.107;
export const JUPITER_MASS = EARTH_MASS * 317.83;
export const STURN_MASS = EARTH_MASS * 95.2;
export const URANUS_MASS = EARTH_MASS * 14.5;
export const NEPTUNE_MASS = EARTH_MASS * 17.1;
export const PHOBOS_MASS = 1.0659e16;

export const EARTH = {
  name: "EARTH",
  radius: EARTH_SIZE,
  widthSegments: 32,
  heightSegments: 32,
  mass: EARTH_MASS,
  velocity: [0, 0, (-30.29e3 * SECOND) / METER],
  sideralDay: EARTH_SIDERAL_DAY,
  rotateCounterClockWise: true,
  orbited: "SUN",
  canBeFocused: true,
  semimajorAxis: 149.598e9 / METER,
  eccentricity: 0.0167,
  inclination: 0,
  argumentOfPeriapsis: 102.9,
  longitudeOfAscendingNode: -11.26,
  trailColor: [0.027, 0.18, 0.019],
};
export const MERCURY = {
  name: "MERCURY",
  radius: MERCURY_SIZE,
  widthSegments: 32,
  heightSegments: 32,
  mass: MERCURY_MASS,
  velocity: [0, 0, (-58.97e3 * SECOND) / METER],
  sideralDay: MERCURY_SIDERAL_DAY,
  rotateCounterClockWise: true,
  orbited: "SUN",
  canBeFocused: true,
  semimajorAxis: 57.9e9 / METER,
  eccentricity: 0.2056,
  inclination: 7,
  argumentOfPeriapsis: 29.1,
  longitudeOfAscendingNode: 48.3,
  trailColor: [0.2, 0.2, 0.2],
};
export const EARTH_CLOUDS = {
  name: "EARTHCLOUDS",
  radius: EARTH_CLOUDS_SIZE,
  widthSegments: 32,
  heightSegments: 32,
  sideralDay: EARTH_CLOUDS_SIDERAL_DAY,
  translateCounterClockWise: true,
  canBeFocused: false,
};
export const VENUS = {
  name: "VENUS",
  radius: VENUS_SIZE,
  widthSegments: 32,
  heightSegments: 32,
  mass: VENUS_MASS,
  velocity: [0, 0, (-35.26e3 * SECOND) / METER],
  sideralDay: VENUS_SIDERAL_DAY,
  rotateCounterClockWise: true,
  orbited: "SUN",
  canBeFocused: true,
  semimajorAxis: 108.2e9 / METER,
  eccentricity: 0.0068,
  inclination: 3.4,
  argumentOfPeriapsis: 54.9,
  longitudeOfAscendingNode: 76.7,
  trailColor: [0.89, 0.733, 0.462],
};
export const MARS = {
  name: "MARS",
  radius: MARS_SIZE,
  widthSegments: 32,
  heightSegments: 32,
  mass: MARS_MASS,
  velocity: [0, 0, (-26.5e3 * SECOND) / METER],
  sideralDay: MARS_SIDERAL_DAY,
  rotateCounterClockWise: true,
  orbited: "SUN",
  canBeFocused: true,
  semimajorAxis: 227.92e9 / METER,
  eccentricity: 0.0934,
  inclination: 1.85,
  argumentOfPeriapsis: 286.5,
  longitudeOfAscendingNode: 49.6,
  trailColor: [0.827, 0.29, 0.141],
};
export const MOON = {
  name: "MOON",
  radius: MOON_SIZE,
  widthSegments: 32,
  heightSegments: 32,
  mass: MOON_MASS,
  velocity: [0, 0, (-1.022e3 * SECOND) / METER],
  sideralDay: MOON_SIDERAL_DAY,
  orbited: "EARTH",
  canBeFocused: true,
  semimajorAxis: 0.3844e9 / METER,
  eccentricity: 0.0549,
  inclination: 5.145,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
};

export const PHOBOS = {
  name: "PHOBOS",
  radius: PHOBOS_SIZE,
  widthSegments: 32,
  heightSegments: 32,
  mass: PHOBOS_MASS,
  velocity: [0, 0, (-2.17e3 * SECOND) / METER],
  sideralDay: PHOBOS_SIDERAL_DAY,
  orbited: "MARS",
  canBeFocused: true,
  semimajorAxis: 9378e3 / METER,
  eccentricity: 0.0151,
  inclination: 1.08,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
};

export const TITAN = {
  name: "TITAN",
  radius: 25747e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 1.3452e23,
  velocity: [0, 0, (-5.57e3 * SECOND) / METER],
  sideralDay: (15.945 * DAY) / SECOND,
  orbited: "SATURN",
  canBeFocused: true,
  semimajorAxis: 1221870e3 / METER,
  eccentricity: 0.0288,
  inclination: 0.34854,
  argumentOfPeriapsis: 294.3,
  longitudeOfAscendingNode: 28.0,
};

// export const DEIMOS = {
//   name: "DEIMOS",
//   radius: PHOBOS_SIZE,
//   widthSegments: 32,
//   heightSegments: 32,
//   mass: PHOBOS_MASS,
//   velocity: [0, 0, (-1.35e3 * SECOND) / METER],
//   sideralDay: PHOBOS_SIDERAL_DAY,
//   orbited: "MARS",
//   canBeFocused: true,
//   semimajorAxis: 9378e9 / METER,
//   eccentricity: 0.0151,
//   inclination: 1.08,
//   argumentOfPeriapsis: 0,
//   longitudeOfAscendingNode: 0,
// };
export const JUPITER = {
  name: "JUPITER",
  radius: JUPITER_SIZE,
  widthSegments: 32,
  heightSegments: 32,
  mass: JUPITER_MASS,
  velocity: [0, 0, (13.72e3 * SECOND) / METER],
  sideralDay: JUPITER_SIDERAL_DAY,
  rotateCounterClockWise: true,
  orbited: "SUN",
  canBeFocused: true,
  semimajorAxis: 778.57e9 / METER,
  eccentricity: 0.0489,
  inclination: 1.3,
  argumentOfPeriapsis: 273.9,
  longitudeOfAscendingNode: 100.5,
};
export const SATURN = {
  name: "SATURN",
  radius: SATURN_SIZE,
  widthSegments: 32,
  heightSegments: 32,
  sideralDay: SATURN_SIDERAL_DAY,
  mass: STURN_MASS,
  velocity: [0, 0, (10.14e3 * SECOND) / METER],
  rotateCounterClockWise: true,
  orbited: "SUN",
  canBeFocused: true,
  semimajorAxis: 1433.53e9 / METER,
  eccentricity: 0.0565,
  inclination: 2.49,
  argumentOfPeriapsis: 339.4,
  longitudeOfAscendingNode: 113.6,
};
export const URANUS = {
  name: "URANUS",
  radius: URANUS_SIZE,
  widthSegments: 32,
  heightSegments: 32,
  mass: URANUS_MASS,
  velocity: [0, 0, (7.13e3 * SECOND) / METER],
  sideralDay: URANUS_SIDERAL_DAY,
  rotateCounterClockWise: true,
  orbited: "SUN",
  canBeFocused: true,
  semimajorAxis: 2872.46e9 / METER,
  eccentricity: 0.0457,
  inclination: 0.77,
  argumentOfPeriapsis: 96.5,
  longitudeOfAscendingNode: 74.0,
};
export const NEPTUNE = {
  name: "NEPTUNE",
  radius: NEPTUNE_SIZE,
  widthSegments: 32,
  heightSegments: 32,
  mass: NEPTUNE_MASS,
  velocity: [0, 0, (5.47e3 * SECOND) / METER],
  sideralDay: NEPTUNE_SIDERAL_DAY,
  rotateCounterClockWise: true,
  orbited: "SUN",
  canBeFocused: true,
  semimajorAxis: 4495.06e9 / METER,
  eccentricity: 0.0113,
  inclination: 1.77,
  argumentOfPeriapsis: 273.2,
  longitudeOfAscendingNode: 131.8,
  trailColor: [0.18, 0.352, 0.596],
};

export const SUN = {
  name: "SUN",
  radius: SUN_SIZE,
  widthSegments: 32,
  heightSegments: 32,
  mass: SUN_MASS,
  velocity: [0, 0, 0],
  canBeFocused: true,

  // sideralDay: undefined,
  // rotateCounterClockWise: undefined,
  // orbited: undefined,
  // semimajorAxis: undefined,
  // eccentricity: undefined,
  // inclination: undefined,
  // argumentOfPeriapsis: undefined,
  // longitudeOfAscendingNode: undefined,
  // trailColor: undefined,

  // material: undefined,
  // geometry: undefined,
};

export const NBODY = {
  name: "nbody",
  radius: MOON_SIZE,
  widthSegments: 32,
  heightSegments: 32,
  sideralDay: MOON_SIDERAL_DAY,
  translateCounterClockWise: true,
  canBeFocused: true,
  velocity: [1.022, 0, 0],
  mass: MOON_MASS,
};

export const PLANETS_DEFINITION = [
  MERCURY,
  VENUS,
  EARTH,
  MARS,
  JUPITER,
  SATURN,
  URANUS,
  NEPTUNE,
];

export const MOONS_DEFINITION = [MOON, PHOBOS, TITAN];

export const TARGET_CAM_DISTANCE = 3.5;
