import * as THREE from "three";
import { Body } from "../shapes/Body";
import { TextureRouteType } from "../constants/textures";

export class TexturesService {
  loader = new THREE.TextureLoader();
  static instance: TexturesService;

  static getInstance() {
    if (!TexturesService.instance) {
      TexturesService.instance = new TexturesService();
    }
    return TexturesService.instance;
  }

  applyTextures(mesh: Body, texturesLoaded: THREE.MeshPhongMaterialParameters) {
    mesh.material = new THREE.MeshPhysicalMaterial(texturesLoaded);
  }

  applyBackgroundTextureMapping(textureLoaded: THREE.Texture) {
    textureLoaded.mapping = THREE.EquirectangularReflectionMapping;
  }

  async loadTextures(textures: TextureRouteType) {
    try {
      const texturesToLoad = [
        textures.map,
        textures.bumpMap,
        textures.roughnessMap,
        textures.alphaMap,
        textures.emissiveMap,
      ];
      const texturesLoaded = await Promise.all(
        texturesToLoad.map((texture) => {
          if (!texture) return null;
          return this.loadTexture(texture);
        })
      );
      const texturesLoadedMap = {
        map: texturesLoaded[0],
        bumpMap: texturesLoaded[1],
        bumpScale: textures.bumpScale ?? null,
        roughnessMap: texturesLoaded[2],
        alphaMap: texturesLoaded[3],
        emissiveMap: texturesLoaded[4],
        emissive: textures.emissive ? new THREE.Color(textures.emissive) : null,
        transparent: textures.transparent ?? null,
      };

      return texturesLoadedMap;
    } catch {
      console.error("Error loading textures:", Error);
    }
  }

  async loadTexture(texture: string) {
    if (!texture) return null;

    return this.loader.loadAsync(texture).catch((error) => {
      console.error("Error loading texture:", texture, error);
      return null;
    });
  }
}
