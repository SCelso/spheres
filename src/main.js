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

const AU = 100
const EARTH = AU / 11727 

const star = new Star(EARTH * 109/2,64,64)
const planet = new Planet(EARTH,32,32)
const moon = new Planet(EARTH / 3,67 ,32,32)


let cameraParent = planet


Array(200).fill().forEach(()=>{
  const star = new Star(EARTH * 109/2, 32, 16)
  star.addStar(scene)
})


camera.position.set(0,5,0)
planet.add(camera)

light.position.set(0,0,0)

setInterval(()=>{
camera.lookAt(cameraParent.position)
 planet.toOrbit(star,AU,0.01)
  
  moon.toOrbit(planet,0.002499* AU,0.015)
  
  renderer.render(scene,camera)
  scene.add(planet.lineOrbit,moon.lineOrbit)
},1000/60 )



scene.add(star,planet,light,moon)

window.addEventListener( 'dblclick', ()=>changeCamera() );

function changeCamera(){
 
  
  if(cameraParent == planet){
    cameraParent = star
    planet.clear()
    star.add(camera)
  }else{
   star.clear()
    planet.add(camera)
    cameraParent = planet
   
  }

}

window.addEventListener( 'resize', ()=>onWindowResize(camera,renderer), false );