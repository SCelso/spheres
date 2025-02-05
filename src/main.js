import * as THREE from 'three'

import scene from './basic/Scene.js'
import camera from './basic/Camera.js'
import renderer from './basic/Renderer.js'
import light from './basic/Light.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Star } from './shapes/Star.js'
import { Planet } from './shapes/Planet.js'
import onWindowResize from './basic/Resize.js'
  
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove( event ) {
  const canvasBounds = renderer.domElement.getBoundingClientRect();

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;


  
	const intersects = raycaster.intersectObjects( [planet],true );
  

	intersects.forEach(intersection => window.addEventListener("mousedown",()=>animation(intersection.object)))

	
  
  raycaster.setFromCamera( pointer, camera );
}


function animation(object){
  
  object.scale.set(2,2,2)


}
  

const star = new Star(1,64,64)
const planet = new Planet(.5,32,32)

const planeGeometry = new THREE.PlaneGeometry(20, 20)
const planeMaterial = new THREE.MeshStandardMaterial( { color: 0xffffff } )
const plane = new THREE.Mesh( planeGeometry, planeMaterial )


const controls = new OrbitControls( camera, renderer.domElement );

let angle = 0


Array(200).fill().forEach(()=>{
  const star = new Star(0.1, 32, 16)
  star.addStar(scene)
})



planet.position.x = 2
camera.position.set(0,5,7)
light.position.set(0,0,0)
plane.rotation.x = -Math.PI / 2;
plane.position.y = -3





 window.addEventListener( 'pointermove', onPointerMove );

console.log(star);
setInterval(()=>{
  
  
   planet.position.x = Math.cos(angle) * 3
   planet.position.z = Math.sin(angle) * 3
  angle += .01
  
  if(angle > Math.PI*2 ){
    angle=0
  }  

  controls.update() 
  renderer.render(scene,camera)

},1000/60 )


  

scene.add(star,planet,light)


window.addEventListener( 'resize', ()=>onWindowResize(camera,renderer), false );