import * as THREE from 'three'


function createSphere(radius,widthSegments,heightSegments){

  const geometry = new THREE.SphereGeometry(radius,widthSegments,heightSegments)
  const material = new THREE.MeshStandardMaterial({color: 0x00ff00})

  
  return new THREE.Mesh(geometry,material)

}

export default createSphere