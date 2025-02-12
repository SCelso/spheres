import * as THREE from 'three'

export class Star extends THREE.Mesh{

  constructor(radius,widthSegments,heightSegments){

    const geometry = new THREE.SphereGeometry( radius,widthSegments,heightSegments )
    const material = new THREE.MeshStandardMaterial( { color: 0xffffff } )
    
    material.emissive= new THREE.Color(0xff8000)
    material.emissiveIntensity =  1  
    material.blendAlpha= 100
    
    super(geometry,material)
  }

 addStar(scene) {
  
    const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(1000))
    this.position.set(x,y,z)
    scene.add(this)
  }   

  loadTexture({emissiveMap=null,bumpMap=null,bumpScale=1,roughnessMap=null,transparent=false,alphaMap=null}){

          
          
        this.material= new THREE.MeshPhysicalMaterial({
              emissiveMap,
              emissive:new THREE.Color(0xff8000),
              emissiveIntensity:1,
              bumpMap,
              bumpScale,
              roughnessMap,
              transparent,
              alphaMap,
            
            })

            
            
        }

}

