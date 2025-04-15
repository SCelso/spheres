import { DEIMOS } from "./constants";
export const earthTexturesRoute = {
  map: "/textures/earthAlbedo.png",
  bumpMap: "/textures/earthBump.png",
  roughnessMap: "/textures/earthRough.png",
};
export const earthCloudsTexturesRoute = {
  map: "/textures/earthClouds.png",
  bumpMap: "/textures/earthClouds.png",
  bumpScale: 2,
  roughnessMap: "",
  alphaMap: "/textures/earthClouds.png",
  transparent: true,
};
export const mercuryTexturesRoute = { map: "/textures/mercuryAlbedo.jpg" };
export const moonTexturesRoute = {
  map: "/textures/moonAlbedo.jpg",
  bumpMap: "/textures/moonBump.jpg",
  bumpScale: 5,
};
export const venusTexturesRoute = { map: "/textures/venusAlbedo.jpg" };
export const marsTexturesRoute = { map: "/textures/marsAlbedo.jpg" };
export const jupiterTexturesRoute = { map: "/textures/jupiterAlbedo.jpg" };
export const saturnTexturesRoute = { map: "/textures/saturnAlbedo.jpg" };
export const uranusTexturesRoute = { map: "/textures/uranusAlbedo.jpg" };
export const neptuneTexturesRoute = { map: "/textures/neptuneAlbedo.jpg" };
export const sunTexturesRoute = {
  emissiveMap: "/textures/sunAlbedo.jpg",
  emissive: 0xff8000,
};

export const texturesRouteMap: TexturesRouteMapType = {
  SUN: sunTexturesRoute,
  MERCURY: mercuryTexturesRoute,
  VENUS: venusTexturesRoute,
  EARTH: earthTexturesRoute,
  MARS: marsTexturesRoute,
  JUPITER: jupiterTexturesRoute,
  SATURN: saturnTexturesRoute,
  URANUS: uranusTexturesRoute,
  NEPTUNE: neptuneTexturesRoute,
  MOON: moonTexturesRoute,
  EARTHCLOUDS: earthCloudsTexturesRoute,
  PHOBOS: {},
  TITAN: {},
  DEIMOS: {},
};

export type TexturesRouteMapType = {
  [x in keyof typeof NamePlanets & NameMoons]: TextureRouteType;
};

export type TextureRouteType = {
  map?: string;
  bumpMap?: string;
  bumpScale?: number;
  roughnessMap?: string;
  alphaMap?: string;
  transparent?: boolean;
  emissiveMap?: string;
  emissive?: number;
};

export enum NamePlanets {
  SUN,
  MERCURY,
  VENUS,
  EARTH,
  MARS,
  JUPITER,
  SATURN,
  URANUS,
  NEPTUNE,
}

export enum NameMoons {
  MOON,
}

export const BACKGROUND_TEXTURE_ROUTE = "/textures/backgroundTexture.png";
