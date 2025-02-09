import * as THREE from 'three'

import scene from './basic/Scene.js'
import camera from './basic/Camera.js'
import renderer from './basic/Renderer.js'
import light from './basic/Light.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Star } from './shapes/Star.js'
import { Planet } from './shapes/Planet.js'
import onWindowResize from './basic/Resize.js'
  

const controls = new OrbitControls( camera, renderer.domElement );

const framesPerSecond = 60
// const secondsPerHour = 3600
// const hourlyRotation = (2 * Math.PI) / (secondsPerHour * framesPerSecond)

const second = 0.00001
const minute = second * 60
const hour = minute * 60
const day = hour * 24 
const year = day * 365 


const loader = new THREE.TextureLoader()
const eathTexture = loader.load("/textures/earthAlbedo.jpg")
const moonTexture = loader.load("/textures/moonAlbedo.jpg")


const AU = 100
const EARTH_SIZE = AU / 11727
const MOON_SIZE = EARTH_SIZE / 3.67
const SUN_SIZE = EARTH_SIZE * (109/2)


const star = new Star(SUN_SIZE,64,64)
const planet = new Planet(EARTH_SIZE,32,32)
const moon = new Planet(MOON_SIZE ,32,32)

planet.loadTexture(eathTexture)
moon.loadTexture(moonTexture)

function calcularIncrementoAngular(segundosPorVuelta, framesPorSegundo) {
  const totalFrames = segundosPorVuelta * framesPorSegundo;
  const angleIncrementRadians = (2 * Math.PI) / totalFrames;
  return angleIncrementRadians;
}


let cameraParent = planet


// Array(200).fill().forEach(()=>{
//   const star = new Star(EARTH * 109/2, 32, 16)
//   star.addStar(scene)
// })


planet.position.x = AU
camera.position.set(0,5,0)
planet.add(camera)

 

setInterval(()=>{


  camera.lookAt(cameraParent.position)
 
  //planet.toOrbit(star,AU,calcularIncrementoAngular(year,framesPerSecond))
 // planet.rotate(calcularIncrementoAngular(day))
  
  moon.toOrbit(planet,AU * 0.002499,calcularIncrementoAngular(day * 28,framesPerSecond))

  renderer.render(scene,camera)
  scene.add(planet.lineOrbit,moon.lineOrbit)

},1000/ framesPerSecond )



scene.add(star,planet,light,moon)

window.addEventListener( 'dblclick', ()=>changeCamera() );

function changeCamera(){
 
  
  if(cameraParent == planet){
    planet.clear()
    star.attach(camera)
    cameraParent = star

  }else if(cameraParent == star){
    star.clear()
    moon.attach(camera)
    cameraParent = moon
   
  }else{
    moon.clear()
    planet.attach(camera)
    cameraParent = planet 
  }

}

window.addEventListener( 'resize', ()=>onWindowResize(camera,renderer), false );