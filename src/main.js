import * as THREE from 'three'

import scene from './basic/Scene.js'
import renderer from './basic/Renderer.js'
import light from './basic/Light.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Star } from './shapes/Star.js'
import { Planet } from './shapes/Planet.js'
import onWindowResize from './basic/Resize.js'
import { Container } from './shapes/Container.js'
import { CameraService } from './services/CameraService.js';
import * as Constants from "./constants.js"
import * as Calculations from "./utils/calculations.js"
import * as TexturesRoutes from "./textures.js"

const cameraService =  CameraService.getInstance()

const camera = cameraService.createPerspectiveCamera({fov:75,aspect:(window.innerWidth / window.innerHeight), near:0.001, far:100000})

const controls = new OrbitControls( camera, renderer.domElement );



const loader = new THREE.TextureLoader()
///TEXTURE SUN
const sunAlbedo = loader.load("/textures/sunAlbedo.jpg")

//OBJECTS
const container = new Container(Constants.EARTH_SIZE)
const sun = new Star(Constants.SUN_SIZE,64,64)

const earth = new Planet({radius:Constants.EARTH_SIZE,widthSegments:32,heightSegments:32,sideralDay:Constants.EARTH_SIDERAL_DAY,orbitalPeriod:Constants.EARTH_ORBITAL_PERIOD,orbited:sun,distanceToOrbited:Constants.EARTH_DISTANCE_TO_ORBITED})
const earthClouds = new Planet({radius:Constants.EARTH_CLOUDS_SIZE,widthSegments:32,heightSegments:32,sideralDay:Constants.EARTH_CLOUDS_SIDERAL_DAY,orbitalPeriod:Constants.EARTH_ORBITAL_PERIOD,orbited:sun,distanceToOrbited:Constants.EARTH_CLOUDS_DISTANCE_TO_ORBITED})
const moon = new Planet({radius:Constants.MOON_SIZE ,widthSegments:32,heightSegments:32,sideralDay:Constants.MOON_SIDERAL_DAY,orbitalPeriod:Constants.MOON_ORBITAL_PERIOD,orbited:earth,distanceToOrbited:Constants.MOON_DISTANCE_TO_ORBITED})

const mercury = new Planet({radius:Constants.MERCURY_SIZE ,widthSegments:32,heightSegments:32,sideralDay:Constants.MERCURY_SIDERAL_DAY,orbitalPeriod:Constants.MERCURY_ORBITAL_PERIOD,orbited:sun,distanceToOrbited:Constants.MERCURY_DISTANCE_TO_ORBITED})
const venus = new Planet({radius:Constants.VENUS_SIZE ,widthSegments:32,heightSegments:32,sideralDay:Constants.VENUS_SIDERAL_DAY,orbitalPeriod:Constants.VENUS_ORBITAL_PERIOD,orbited:sun,distanceToOrbited:Constants.VENUS_DISTANCE_TO_ORBITED})
const mars = new Planet({radius:Constants.MARS_SIZE ,widthSegments:32,heightSegments:32,sideralDay:Constants.MARS_SIDERAL_DAY,orbitalPeriod:Constants.MARS_ORBITAL_PERIOD,orbited:sun,distanceToOrbited:Constants.MARS_DISTANCE_TO_ORBITED})
const jupiter = new Planet({radius:Constants.JUPITER_SIZE ,widthSegments:32,heightSegments:32,sideralDay:Constants.JUPITER_SIDERAL_DAY,orbitalPeriod:Constants.JUPITER_ORBITAL_PERIOD,orbited:sun,distanceToOrbited:Constants.JUPITER_DISTANCE_TO_ORBITED})
const saturn = new Planet({radius:Constants.SATURN_SIZE ,widthSegments:32,heightSegments:32,sideralDay:Constants.SATURN_SIDERAL_DAY,orbitalPeriod:Constants.SATURN_ORBITAL_PERIOD,orbited:sun,distanceToOrbited:Constants.SATURN_DISTANCE_TO_ORBITED})
const uranus = new Planet({radius:Constants.URANUS_SIZE ,widthSegments:32,heightSegments:32,sideralDay:Constants.URANUS_SIDERAL_DAY,orbitalPeriod:Constants.URANUS_ORBITAL_PERIOD,orbited:sun,distanceToOrbited:Constants.URANUS_DISTANCE_TO_ORBITED})
const neptune = new Planet({radius:Constants.NEPTUNE_SIZE ,widthSegments:32,heightSegments:32,sideralDay:Constants.NEPTUNE_SIDERAL_DAY,orbitalPeriod:Constants.NEPTUNE_ORBITAL_PERIOD,orbited:sun,distanceToOrbited:Constants.NEPTUNE_DISTANCE_TO_ORBITED})

//LOAD TEXTURES
const earthWithTextures = {planet:earth,textures:TexturesRoutes.earthTexturesRoute}
const mercuryWithTextures = {planet:mercury,textures:TexturesRoutes.mercuryTexturesRoute}
const marsWithTextures = {planet:mars,textures:TexturesRoutes.marsTexturesRoute}
const jupiterWithTextures = {planet:jupiter,textures:TexturesRoutes.jupiterTexturesRoute}
const saturnWithTextures = {planet:saturn,textures:TexturesRoutes.saturnTexturesRoute}
const uranusWithTextures = {planet:uranus,textures:TexturesRoutes.uranusTexturesRoute}
const neptuneTextures = {planet:neptune,textures:TexturesRoutes.neptuneTexturesRoute}
const venusWithTextures = {planet:venus,textures:TexturesRoutes.venusTexturesRoute}
const earthCloudWithTextures = {planet:earthClouds,textures:TexturesRoutes.earthCloudTexturesRoute}
const moonWithTextures = {planet:moon,textures:TexturesRoutes.moonTexturesRoute}

const planetsWithTextures = [earthWithTextures,mercuryWithTextures,moonWithTextures,marsWithTextures,jupiterWithTextures,saturnWithTextures,venusWithTextures,uranusWithTextures,neptuneTextures,earthCloudWithTextures]

planetsWithTextures.forEach(planetWithTextures =>{

  const planet = planetWithTextures.planet
  const texturesRoute = planetWithTextures.textures

  const textures = {
    map: texturesRoute.map? loader.load(texturesRoute.map):null,
    bumpMap:texturesRoute.bumpMap? loader.load(texturesRoute.bumpMap):null,
    bumpScale:texturesRoute.bumpScale ? texturesRoute.bumpScale:null,
    roughnessMap:texturesRoute.roughnessMap ? loader.load(texturesRoute.roughnessMap) : null,
    alphaMap:texturesRoute.alphaMap?loader.load(texturesRoute.alphaMap):null,
    transparent:texturesRoute.transparent?texturesRoute.transparent:null,
  
  }
   
  planet.loadTexture(textures)


  planet.castShadow = true
  planet.receiveShadow = true
})

const planets = [earth,moon,mercury,venus,mars,jupiter,saturn,uranus,neptune]
const cameraTargets = [sun,...planets]
const sceneElements = [light,earthClouds,container,...cameraTargets]

container.visible = false
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap

//LOAD TEXTURES
sun.loadTexture({emissiveMap:sunAlbedo})


camera.position.set(5,0,0)

container.add(camera)


  //controls.minDistance= 0.04
  controls.update()
  controls.maxDistance = Infinity
  let previousTime = 0
  
  cameraService.changeCamera(container,cameraTargets)

  function animate(currentTime){  
    
    const deltaTime = (currentTime - previousTime) / 1000 // Tiempo en segundos
    previousTime = currentTime
    
    
    const rotateIncrement = Calculations.calculateAngularIncrement(earthClouds.getSideralDay(),deltaTime)
      
    
   earthClouds.rotate(rotateIncrement)
   
   planets.forEach((planet)=>{
     
     const orbitIncrement= Calculations.calculateAngularIncrement(planet.getOrbitalPeriod(),deltaTime)
     const rotateIncrement = Calculations.calculateAngularIncrement(planet.getSideralDay(),deltaTime)
     
     planet.toOrbit(planet.getOrbited(),planet.getDistanceToOrbited(),orbitIncrement,planet.getTranslateCounterClockWise())
     
     planet.rotate(rotateIncrement,planet.getRotateCounterClockWise())
     scene.add(planet.lineOrbit)
    } )


    container.position.copy(container.getCurrentTarget().position)
    
    earthClouds.position.copy(earth.position)
    
    camera.lookAt(container.position)
    
    
    renderer.render(scene,camera)


    requestAnimationFrame(animate)
  }
  requestAnimationFrame(animate)
  
sceneElements.forEach(element=>{
  scene.add(element)
})


window.addEventListener( 'dblclick', ()=>cameraService.changeCamera(container,cameraTargets) );

window.addEventListener( 'resize', ()=>onWindowResize(camera,renderer), false );