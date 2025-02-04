import * as THREE from 'three'

const light = new THREE.AmbientLight(0x404040)
 const pointLight= new THREE.PointLight(0xff8000,50)

 light.add(pointLight)
export default light