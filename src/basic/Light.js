import * as THREE from 'three'

const light = new THREE.AmbientLight(0x404040)
 const pointLight= new THREE.PointLight(0xffffff,10000)

 light.add(pointLight)
export default light