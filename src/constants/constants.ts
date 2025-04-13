export const SCALE = 0.00000001;
export let timeScale = { scale: 1 };
export const SECOND = 1;
export const MINUTE = SECOND * 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 23.934469;
export const YEAR = DAY * 365.25;

export const METER = 1 / SCALE;
export const KILOMETER = 1000 * METER;

export const G = (6.7384e-11 * SECOND ** 2) / METER ** 3;
export const smoothing = 1e-4;
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

export const MERCURY_ORBITAL_PERIOD = DAY * 88;
export const VENUS_ORBITAL_PERIOD = DAY * 225;
export const EARTH_ORBITAL_PERIOD = YEAR;
export const MARS_ORBITAL_PERIOD = YEAR * 1.88;
export const JUPITER_ORBITAL_PERIOD = YEAR * 11.86;
export const SATURN_ORBITAL_PERIOD = YEAR * 29.46;
export const URANUS_ORBITAL_PERIOD = YEAR * 84;
export const NEPTUNE_ORBITAL_PERIOD = YEAR * 164.8;
export const MOON_ORBITAL_PERIOD = DAY * 27.3;

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

export type BodyDefinition = {
  name: string;
  radius: number;
  widthSegments: number;
  heightSegments: number;
  mass: number;
  position?: number[];
  velocity: number[];
  sideralDay?: number;
  orbited: string;
  rotateCounterClockWise?: boolean;

  canBeFocused: boolean;
  semimajorAxis?: number;
  eccentricity?: number;
  translateCounterClockWise?: boolean;

  inclination?: number;
  argumentOfPeriapsis?: number;
  longitudeOfAscendingNode?: number;
  orbitCounterClockwise?: boolean;
  trailColor?: number[];
  orbitalPeriod?: number;
};
export const EARTH: BodyDefinition = {
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
  orbitalPeriod: EARTH_ORBITAL_PERIOD,
  orbitCounterClockwise: true,
};
export const MERCURY: BodyDefinition = {
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
  orbitalPeriod: MERCURY_ORBITAL_PERIOD,
  orbitCounterClockwise: true,
};
export const EARTH_CLOUDS: BodyDefinition = {
  name: "EARTHCLOUDS",
  radius: EARTH_CLOUDS_SIZE,
  widthSegments: 32,
  heightSegments: 32,
  sideralDay: EARTH_CLOUDS_SIDERAL_DAY,
  translateCounterClockWise: true,
  canBeFocused: false,
  mass: 0,
  velocity: [],
  orbited: "",
};
export const VENUS: BodyDefinition = {
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
  orbitalPeriod: VENUS_ORBITAL_PERIOD,
  orbitCounterClockwise: true,
};
export const MARS: BodyDefinition = {
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
  orbitalPeriod: MARS_ORBITAL_PERIOD,
  orbitCounterClockwise: true,
};

export const JUPITER: BodyDefinition = {
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
  orbitalPeriod: JUPITER_ORBITAL_PERIOD,
};
export const SATURN: BodyDefinition = {
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
  orbitalPeriod: SATURN_ORBITAL_PERIOD,
};
export const URANUS: BodyDefinition = {
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
  orbitalPeriod: URANUS_ORBITAL_PERIOD,
};
export const NEPTUNE: BodyDefinition = {
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
  orbitalPeriod: NEPTUNE_ORBITAL_PERIOD,
};

export const SUN: BodyDefinition = {
  name: "SUN",
  radius: SUN_SIZE,
  widthSegments: 32,
  heightSegments: 32,
  mass: SUN_MASS,
  velocity: [0, 0, 0],
  canBeFocused: true,
  orbited: "",
};

export const MOON: BodyDefinition = {
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
  orbitalPeriod: MOON_ORBITAL_PERIOD,
  orbitCounterClockwise: true,
};

export const PHOBOS: BodyDefinition = {
  name: "PHOBOS",
  radius: PHOBOS_SIZE,
  widthSegments: 32,
  heightSegments: 32,
  mass: PHOBOS_MASS,
  velocity: [0, 0, (-2.17e3 * SECOND) / METER],
  sideralDay: PHOBOS_SIDERAL_DAY,
  orbited: "MARS",
  canBeFocused: false,
  semimajorAxis: 9378e3 / METER,
  eccentricity: 0.0151,
  inclination: 1.08,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 0.31891 * DAY,
};

export const TITAN: BodyDefinition = {
  name: "TITAN",
  radius: 25747e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 1.3452e23,
  velocity: [0, 0, (-5.57e3 * SECOND) / METER],
  sideralDay: (15.945 * DAY) / SECOND,
  orbited: "SATURN",
  canBeFocused: false,
  semimajorAxis: 1221870e3 / METER,
  eccentricity: 0.0288,
  inclination: 0.34854,
  argumentOfPeriapsis: 294.3,
  longitudeOfAscendingNode: 28.0,
  orbitCounterClockwise: true,
  orbitalPeriod: 15.945421 * DAY,
};

export const DEIMOS: BodyDefinition = {
  name: "DEIMOS",
  radius: PHOBOS_SIZE,
  widthSegments: 32,
  heightSegments: 32,
  mass: PHOBOS_MASS,
  velocity: [0, 0, (-1.35e3 * SECOND) / METER],
  sideralDay: PHOBOS_SIDERAL_DAY,
  orbited: "MARS",
  canBeFocused: false,
  semimajorAxis: 23459e3 / METER,
  eccentricity: 0.0005,
  inclination: 1.79,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 1.26244 * DAY,
};
export const EUROPA: BodyDefinition = {
  name: "EUROPA",
  radius: 1560.8e3 / METER, // km
  widthSegments: 32,
  heightSegments: 32,
  mass: 4.7998e22, // kg
  velocity: [0, 0, (-1.37e3 * SECOND) / METER],
  sideralDay: 3.551 * DAY,
  orbited: "JUPITER",
  canBeFocused: false,
  semimajorAxis: 670900e3 / METER,
  eccentricity: 0.009,
  inclination: 0.466,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 3.551 * DAY,
};

export const GANYMEDE: BodyDefinition = {
  name: "GANYMEDE",
  radius: 2634.1e3 / METER, // km
  widthSegments: 32,
  heightSegments: 32,
  mass: 1.4819e23, // kg
  velocity: [0, 0, (-1.08e3 * SECOND) / METER],
  sideralDay: 7.154 * DAY,
  orbited: "JUPITER",
  canBeFocused: false,
  semimajorAxis: 1070400e3 / METER,
  eccentricity: 0.0013,
  inclination: 0.177,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 7.154 * DAY,
};

export const CALLISTO: BodyDefinition = {
  name: "CALLISTO",
  radius: 2410.3e3 / METER, // km
  widthSegments: 32,
  heightSegments: 32,
  mass: 1.0759e23, // kg
  velocity: [0, 0, (-0.82e3 * SECOND) / METER],
  sideralDay: 16.689 * DAY,
  orbited: "JUPITER",
  canBeFocused: false,
  semimajorAxis: 1882700e3 / METER,
  eccentricity: 0.007,
  inclination: 0.192,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 16.689 * DAY,
};

export const IO: BodyDefinition = {
  name: "IO",
  radius: 1821.6e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 8.9319e22, // kg
  velocity: [0, 0, (-1.75e3 * SECOND) / METER],
  sideralDay: 1.769 * DAY,
  orbited: "JUPITER",
  canBeFocused: false,
  semimajorAxis: 421700e3 / METER,
  eccentricity: 0.004,
  inclination: 0.05,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 1.769 * DAY,
};
export const TRITON: BodyDefinition = {
  name: "TRITON",
  radius: 1353.4e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 2.14e22, // kg
  velocity: [0, 0, (0.39e3 * SECOND) / METER],
  sideralDay: 5.877 * DAY,
  orbited: "NEPTUNE",
  canBeFocused: false,
  semimajorAxis: 354759e3 / METER,
  eccentricity: 0.00002,
  inclination: 156.865,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: false,
  orbitalPeriod: 5.877 * DAY,
};
export const ENCELADUS: BodyDefinition = {
  name: "ENCELADUS",
  radius: 252.1e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 1.08e20, // kg
  velocity: [0, 0, (-0.53e3 * SECOND) / METER],
  sideralDay: 1.37 * DAY,
  orbited: "SATURN",
  canBeFocused: false,
  semimajorAxis: 238020e3 / METER,
  eccentricity: 0.0047,
  inclination: 0.009,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 1.37 * DAY,
};

export const TITANIA: BodyDefinition = {
  name: "TITANIA",
  radius: 788.9e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 3.4e21, // kg
  velocity: [0, 0, (-0.33e3 * SECOND) / METER],
  sideralDay: 8.706 * DAY,
  orbited: "URANUS",
  canBeFocused: false,
  semimajorAxis: 436300e3 / METER,
  eccentricity: 0.0011,
  inclination: 0.34,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 8.706 * DAY,
};

export const OBERON: BodyDefinition = {
  name: "OBERON",
  radius: 761.4e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 3.014e21, // kg
  velocity: [0, 0, (-0.32e3 * SECOND) / METER],
  sideralDay: 13.463 * DAY,
  orbited: "URANUS",
  canBeFocused: false,
  semimajorAxis: 583500e3 / METER,
  eccentricity: 0.0014,
  inclination: 0.068,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 13.463 * DAY,
};
export const MIRANDA: BodyDefinition = {
  name: "MIRANDA",
  radius: 235.8e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 6.6e19, // kg
  velocity: [0, 0, (-0.38e3 * SECOND) / METER],
  sideralDay: 1.413 * DAY,
  orbited: "URANUS",
  canBeFocused: false,
  semimajorAxis: 129390e3 / METER,
  eccentricity: 0.0014,
  inclination: 4.34,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 1.413 * DAY,
};
export const ARIEL: BodyDefinition = {
  name: "ARIEL",
  radius: 578.9e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 1.26e21, // kg
  velocity: [0, 0, (-0.28e3 * SECOND) / METER],
  sideralDay: 2.52 * DAY,
  orbited: "URANUS",
  canBeFocused: false,
  semimajorAxis: 191760e3 / METER,
  eccentricity: 0.0014,
  inclination: 0.28,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 2.52 * DAY,
};
export const MIMAS: BodyDefinition = {
  name: "MIMAS",
  radius: 198.2e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 3.75e19, // kg
  velocity: [0, 0, (-0.23e3 * SECOND) / METER],
  sideralDay: 0.942 * DAY,
  orbited: "SATURN",
  canBeFocused: false,
  semimajorAxis: 185540e3 / METER,
  eccentricity: 0.0192,
  inclination: 1.57,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 0.942 * DAY,
};
export const RHEA: BodyDefinition = {
  name: "RHEA",
  radius: 764.5e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 2.31e21, // kg
  velocity: [0, 0, (-0.23e3 * SECOND) / METER],
  sideralDay: 4.518 * DAY,
  orbited: "SATURN",
  canBeFocused: false,
  semimajorAxis: 527040e3 / METER,
  eccentricity: 0.0011,
  inclination: 0.35,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 4.518 * DAY,
};
export const DIONE: BodyDefinition = {
  name: "DIONE",
  radius: 561.4e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 1.095e21, // kg
  velocity: [0, 0, (-0.22e3 * SECOND) / METER],
  sideralDay: 2.736 * DAY,
  orbited: "SATURN",
  canBeFocused: false,
  semimajorAxis: 377400e3 / METER,
  eccentricity: 0.0022,
  inclination: 0.03,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 2.736 * DAY,
};

export const TETHYS: BodyDefinition = {
  name: "TETHYS",
  radius: 531.0e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 6.17e20, // kg
  velocity: [0, 0, (-0.22e3 * SECOND) / METER],
  sideralDay: 1.888 * DAY,
  orbited: "SATURN",
  canBeFocused: false,
  semimajorAxis: 294670e3 / METER,
  eccentricity: 0.0003,
  inclination: 0.03,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 1.888 * DAY,
};
export const IAPETUS: BodyDefinition = {
  name: "IAPETUS",
  radius: 734.5e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 1.8e21, // kg
  velocity: [0, 0, (-0.23e3 * SECOND) / METER],
  sideralDay: 79.33 * DAY,
  orbited: "SATURN",
  canBeFocused: false,
  semimajorAxis: 3561300e3 / METER,
  eccentricity: 0.028,
  inclination: 15.47,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 79.33 * DAY,
};
export const UBERT: BodyDefinition = {
  name: "UBERT",
  radius: 210.0e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 4.4e19, // kg
  velocity: [0, 0, (-0.25e3 * SECOND) / METER],
  sideralDay: 0.76 * DAY,
  orbited: "SATURN",
  canBeFocused: false,
  semimajorAxis: 1.7e6 / METER,
  eccentricity: 0.02,
  inclination: 0.08,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 0.76 * DAY,
};

export const NEREID: BodyDefinition = {
  name: "NEREID",
  radius: 170.0e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 0.9e18, // kg
  velocity: [0, 0, (-0.52e3 * SECOND) / METER],
  sideralDay: 360.0 * DAY,
  orbited: "NEPTUNE",
  canBeFocused: false,
  semimajorAxis: 5.513e6 / METER,
  eccentricity: 0.75,
  inclination: 7.0,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 360.0 * DAY,
};

export const DESPINA: BodyDefinition = {
  name: "DESPINA",
  radius: 148.0e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 1.1e18, // kg
  velocity: [0, 0, (-0.47e3 * SECOND) / METER],
  sideralDay: 0.742 * DAY,
  orbited: "NEPTUNE",
  canBeFocused: false,
  semimajorAxis: 52000e3 / METER,
  eccentricity: 0.0,
  inclination: 0.5,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 0.742 * DAY,
};

export const GALATEA: BodyDefinition = {
  name: "GALATEA",
  radius: 88.0e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 3.3e17, // kg
  velocity: [0, 0, (-0.59e3 * SECOND) / METER],
  sideralDay: 0.43 * DAY,
  orbited: "NEPTUNE",
  canBeFocused: false,
  semimajorAxis: 27800e3 / METER,
  eccentricity: 0.0,
  inclination: 0.0,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 0.43 * DAY,
};

export const LAOMEDIE: BodyDefinition = {
  name: "LAOMEDIE",
  radius: 130.0e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 0.5e19, // kg
  velocity: [0, 0, (-0.23e3 * SECOND) / METER],
  sideralDay: 1.4 * DAY,
  orbited: "NEPTUNE",
  canBeFocused: false,
  semimajorAxis: 1.8e6 / METER,
  eccentricity: 0.7,
  inclination: 12.2,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 1.4 * DAY,
};

export const AMALTHEA: BodyDefinition = {
  name: "AMALTHEA",
  radius: 83.5e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 2.4e18, // kg
  velocity: [0, 0, (-0.45e3 * SECOND) / METER],
  sideralDay: 0.498 * DAY,
  orbited: "JUPITER",
  canBeFocused: false,
  semimajorAxis: 181400e3 / METER,
  eccentricity: 0.001,
  inclination: 0.1,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 0.498 * DAY,
};

export const HIMALIA: BodyDefinition = {
  name: "HIMALIA",
  radius: 85.0e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 3.6e18, // kg
  velocity: [0, 0, (-0.3e3 * SECOND) / METER],
  sideralDay: 5.75 * DAY,
  orbited: "JUPITER",
  canBeFocused: false,
  semimajorAxis: 1135200e3 / METER,
  eccentricity: 0.1,
  inclination: 27.0,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 5.75 * DAY,
};

export const PASIPHAE: BodyDefinition = {
  name: "PASIPHAE",
  radius: 24.0e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 0.6e18, // kg
  velocity: [0, 0, (-0.15e3 * SECOND) / METER],
  sideralDay: 0.84 * DAY,
  orbited: "JUPITER",
  canBeFocused: false,
  semimajorAxis: 2424700e3 / METER,
  eccentricity: 0.26,
  inclination: 144.0,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 0.84 * DAY,
};

export const SINOPE: BodyDefinition = {
  name: "SINOPE",
  radius: 15.6e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 0.4e18, // kg
  velocity: [0, 0, (-0.09e3 * SECOND) / METER],
  sideralDay: 0.295 * DAY,
  orbited: "JUPITER",
  canBeFocused: false,
  semimajorAxis: 2403600e3 / METER,
  eccentricity: 0.276,
  inclination: 151.0,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 0.295 * DAY,
};

export const LYSITHEA: BodyDefinition = {
  name: "LYSITHEA",
  radius: 8.5e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 0.3e18, // kg
  velocity: [0, 0, (-0.24e3 * SECOND) / METER],
  sideralDay: 0.338 * DAY,
  orbited: "JUPITER",
  canBeFocused: false,
  semimajorAxis: 1172000e3 / METER,
  eccentricity: 0.226,
  inclination: 154.0,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 0.338 * DAY,
};

export const CARME: BodyDefinition = {
  name: "CARME",
  radius: 17.0e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 0.4e18, // kg
  velocity: [0, 0, (-0.16e3 * SECOND) / METER],
  sideralDay: 0.348 * DAY,
  orbited: "JUPITER",
  canBeFocused: false,
  semimajorAxis: 2309000e3 / METER,
  eccentricity: 0.213,
  inclination: 164.0,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 0.348 * DAY,
};

export const CALLIRRHOE: BodyDefinition = {
  name: "CALLIRRHOE",
  radius: 12.6e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 0.5e18, // kg
  velocity: [0, 0, (-0.2e3 * SECOND) / METER],
  sideralDay: 0.443 * DAY,
  orbited: "JUPITER",
  canBeFocused: false,
  semimajorAxis: 2352000e3 / METER,
  eccentricity: 0.318,
  inclination: 151.0,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 0.443 * DAY,
};

export const S_2003J9: BodyDefinition = {
  name: "S/2003J9",
  radius: 4.0e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 0.3e18, // kg
  velocity: [0, 0, (-0.1e3 * SECOND) / METER],
  sideralDay: 0.539 * DAY,
  orbited: "JUPITER",
  canBeFocused: false,
  semimajorAxis: 2100000e3 / METER,
  eccentricity: 0.0,
  inclination: 163.0,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 0.539 * DAY,
};

export const PAAL: BodyDefinition = {
  name: "PAAL",
  radius: 15.0e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 0.8e18, // kg
  velocity: [0, 0, (-0.17e3 * SECOND) / METER],
  sideralDay: 0.435 * DAY,
  orbited: "JUPITER",
  canBeFocused: false,
  semimajorAxis: 2800000e3 / METER,
  eccentricity: 0.271,
  inclination: 143.0,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 0.435 * DAY,
};

export const PHEROS: BodyDefinition = {
  name: "PHEROS",
  radius: 22.0e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 0.7e18, // kg
  velocity: [0, 0, (-0.12e3 * SECOND) / METER],
  sideralDay: 0.825 * DAY,
  orbited: "JUPITER",
  canBeFocused: false,
  semimajorAxis: 2872000e3 / METER,
  eccentricity: 0.349,
  inclination: 139.0,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 0.825 * DAY,
};

export const SPIRIT: BodyDefinition = {
  name: "SPIRIT",
  radius: 20.0e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 0.6e18, // kg
  velocity: [0, 0, (-0.12e3 * SECOND) / METER],
  sideralDay: 0.5 * DAY,
  orbited: "JUPITER",
  canBeFocused: false,
  semimajorAxis: 2383000e3 / METER,
  eccentricity: 0.254,
  inclination: 144.0,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 0.5 * DAY,
};
export const ANANKE: BodyDefinition = {
  name: "ANANKE",
  radius: 8.0e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 0.3e18, // kg
  velocity: [0, 0, (-0.14e3 * SECOND) / METER],
  sideralDay: 0.596 * DAY,
  orbited: "JUPITER",
  canBeFocused: false,
  semimajorAxis: 2218000e3 / METER,
  eccentricity: 0.198,
  inclination: 148.0,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 0.596 * DAY,
};

// Luna 2
export const S_2003J10: BodyDefinition = {
  name: "S/2003J10",
  radius: 5.0e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 0.2e18, // kg
  velocity: [0, 0, (-0.11e3 * SECOND) / METER],
  sideralDay: 0.559 * DAY,
  orbited: "JUPITER",
  canBeFocused: false,
  semimajorAxis: 1912000e3 / METER,
  eccentricity: 0.0,
  inclination: 145.0,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 0.559 * DAY,
};

// Luna 3
export const S_2003J12: BodyDefinition = {
  name: "S/2003J12",
  radius: 6.0e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 0.3e18, // kg
  velocity: [0, 0, (-0.12e3 * SECOND) / METER],
  sideralDay: 0.612 * DAY,
  orbited: "JUPITER",
  canBeFocused: false,
  semimajorAxis: 2089000e3 / METER,
  eccentricity: 0.062,
  inclination: 151.0,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 0.612 * DAY,
};

// Luna 4
export const AITNE: BodyDefinition = {
  name: "AITNE",
  radius: 10.3e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 0.5e18, // kg
  velocity: [0, 0, (-0.18e3 * SECOND) / METER],
  sideralDay: 0.514 * DAY,
  orbited: "SATURN",
  canBeFocused: false,
  semimajorAxis: 2045000e3 / METER,
  eccentricity: 0.132,
  inclination: 34.0,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 0.514 * DAY,
};

// Luna 5
export const PALLENE: BodyDefinition = {
  name: "PALLENE",
  radius: 9.2e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 0.4e18, // kg
  velocity: [0, 0, (-0.19e3 * SECOND) / METER],
  sideralDay: 0.669 * DAY,
  orbited: "SATURN",
  canBeFocused: false,
  semimajorAxis: 2076000e3 / METER,
  eccentricity: 0.0,
  inclination: 3.0,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 0.669 * DAY,
};

// Luna 6
export const S_2004S13: BodyDefinition = {
  name: "S/2004S13",
  radius: 5.0e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 0.2e18, // kg
  velocity: [0, 0, (-0.1e3 * SECOND) / METER],
  sideralDay: 0.456 * DAY,
  orbited: "SATURN",
  canBeFocused: false,
  semimajorAxis: 1588000e3 / METER,
  eccentricity: 0.038,
  inclination: 21.0,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 0.456 * DAY,
};

// Luna 7
export const EPIOS: BodyDefinition = {
  name: "EPIOS",
  radius: 7.3e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 0.3e18, // kg
  velocity: [0, 0, (-0.14e3 * SECOND) / METER],
  sideralDay: 0.373 * DAY,
  orbited: "SATURN",
  canBeFocused: false,
  semimajorAxis: 1164000e3 / METER,
  eccentricity: 0.01,
  inclination: 25.0,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 0.373 * DAY,
};

// Luna 8
export const PAN: BodyDefinition = {
  name: "PAN",
  radius: 14.0e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 0.7e18, // kg
  velocity: [0, 0, (-0.14e3 * SECOND) / METER],
  sideralDay: 0.236 * DAY,
  orbited: "SATURN",
  canBeFocused: false,
  semimajorAxis: 1335000e3 / METER,
  eccentricity: 0.0,
  inclination: 0.0,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 0.236 * DAY,
};
export const NBODY = {
  name: "NBODY",
  radius: MOON_SIZE,
  widthSegments: 32,
  heightSegments: 32,
  sideralDay: MOON_SIDERAL_DAY,
  translateCounterClockWise: true,
  canBeFocused: false,
  velocity: [1.022, 0, 0],
  // position: [0, 0.5, 0.5],
  mass: 0,
};

export const HELENE: BodyDefinition = {
  name: "HELENE",
  radius: 17.0e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 0.9e18, // kg
  velocity: [0, 0, (-0.12e3 * SECOND) / METER],
  sideralDay: 0.702 * DAY,
  orbited: "SATURN",
  canBeFocused: false,
  semimajorAxis: 2043000e3 / METER,
  eccentricity: 0.0032,
  inclination: 27.0,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 0.702 * DAY,
};

// Luna 16
export const BELINDA: BodyDefinition = {
  name: "BELINDA",
  radius: 30.0e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 0.4e18, // kg
  velocity: [0, 0, (-0.1e3 * SECOND) / METER],
  sideralDay: 0.9 * DAY,
  orbited: "URANUS",
  canBeFocused: false,
  semimajorAxis: 1213000e3 / METER,
  eccentricity: 0.033,
  inclination: 17.0,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 0.9 * DAY,
};

// Luna 17
export const BIANCA: BodyDefinition = {
  name: "BIANCA",
  radius: 25.0e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 0.3e18, // kg
  velocity: [0, 0, (-0.08e3 * SECOND) / METER],
  sideralDay: 0.867 * DAY,
  orbited: "URANUS",
  canBeFocused: false,
  semimajorAxis: 1001000e3 / METER,
  eccentricity: 0.045,
  inclination: 19.0,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 0.867 * DAY,
};
export const CORDELIA: BodyDefinition = {
  name: "CORDELIA",
  radius: 15.0e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 0.1e18, // kg
  velocity: [0, 0, (-0.2e3 * SECOND) / METER],
  sideralDay: 0.432 * DAY,
  orbited: "URANUS",
  canBeFocused: false,
  semimajorAxis: 498200e3 / METER,
  eccentricity: 0.028,
  inclination: 4.5,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 0.432 * DAY,
};

// Luna 19
export const OPHELIA: BodyDefinition = {
  name: "OPHELIA",
  radius: 19.0e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 0.5e18, // kg
  velocity: [0, 0, (-0.17e3 * SECOND) / METER],
  sideralDay: 0.365 * DAY,
  orbited: "URANUS",
  canBeFocused: false,
  semimajorAxis: 587000e3 / METER,
  eccentricity: 0.029,
  inclination: 4.2,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 0.365 * DAY,
};

// Luna 20
export const JULIET: BodyDefinition = {
  name: "JULIET",
  radius: 19.0e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 0.6e18, // kg
  velocity: [0, 0, (-0.12e3 * SECOND) / METER],
  sideralDay: 0.425 * DAY,
  orbited: "URANUS",
  canBeFocused: false,
  semimajorAxis: 614000e3 / METER,
  eccentricity: 0.02,
  inclination: 4.5,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 0.425 * DAY,
};
export const PANDORA: BodyDefinition = {
  name: "PANDORA",
  radius: 41.0e3 / METER,
  widthSegments: 32,
  heightSegments: 32,
  mass: 0.9e18, // kg
  velocity: [0, 0, (-0.24e3 * SECOND) / METER],
  sideralDay: 0.982 * DAY,
  orbited: "SATURN",
  canBeFocused: false,
  semimajorAxis: 1420000e3 / METER,
  eccentricity: 0.01,
  inclination: 4.4,
  argumentOfPeriapsis: 0,
  longitudeOfAscendingNode: 0,
  orbitCounterClockwise: true,
  orbitalPeriod: 0.982 * DAY,
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

export const MOONS_DEFINITION = [
  MOON,
  PHOBOS,
  TITAN,
  DEIMOS,
  EUROPA,
  GANYMEDE,
  CALLISTO,
  IO,
  TRITON,
  ENCELADUS,
  TITANIA,
  OBERON,
  MIRANDA,
  ARIEL,
  MIMAS,
  RHEA,
  DIONE,
  TETHYS,
  IAPETUS,
  UBERT,
  NEREID,
  DESPINA,
  GALATEA,
  LAOMEDIE,
  AMALTHEA,
  HIMALIA,
  PASIPHAE,
  SINOPE,
  LYSITHEA,
  CARME,
  CALLIRRHOE,
  S_2003J9,
  PAAL,
  PHEROS,
  SPIRIT,
  ANANKE,
  S_2003J10,
  S_2003J12,
  AITNE,
  PALLENE,
  S_2004S13,
  EPIOS,
  PAN,
  HELENE,
  BELINDA,
  BIANCA,
  CORDELIA,
  OPHELIA,
  JULIET,
  PANDORA,
];

export const TARGET_CAM_DISTANCE = 3.5;
