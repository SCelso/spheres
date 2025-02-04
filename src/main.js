import * as THREE from 'three'

import scene from './basic/Scene.js'
import camera from './basic/Camera.js'
import renderer from './basic/Renderer.js'
import createSphere from './shapes/Sphere.js'
import light from './basic/Light.js'


const sphere1 = createSphere(1,1000,1000)
const sphere2 = createSphere(.5,1000,1000)

const planeGeometry = new THREE.PlaneGeometry( 20, 20)
const planeMaterial = new THREE.MeshStandardMaterial( { color: 0xffffff } )
const plane = new THREE.Mesh( planeGeometry, planeMaterial )


light.castShadow = true; 
sphere1.castShadow = true
sphere2.receiveShadow= true
plane.receiveShadow = true


sphere2.position.x = 2
camera.position.set(0,5,7)
camera.lookAt(sphere1.position)
light.position.set(-5,4,0)

plane.rotation.x = -Math.PI / 2;
plane.position.y = -3


scene.add(sphere1,sphere2,light,plane)
let angle =0

setInterval(()=>{
 sphere2.position.x = Math.cos(angle) * 3
 sphere2.position.z = Math.sin(angle) * 3

 
 angle += .01

 console.log(angle)
 if(angle > Math.PI*2 ){
  angle=0
 }
  

  renderer.render(scene,camera)
}, 1000/60)

console.log(scene,camera,renderer,sphere1)