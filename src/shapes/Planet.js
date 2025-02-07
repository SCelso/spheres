import * as THREE from 'three'

export class Planet extends THREE.Mesh{


  angle = 0
  orbit = []
  lineOrbit =  new THREE.Line( new THREE.BufferGeometry().setFromPoints( this.orbit ), new THREE.LineBasicMaterial({
        color: 0x0000ff
      }));


  constructor(radius,widthSegments,heightSegments){
    const geometry = new THREE.SphereGeometry(radius,widthSegments,heightSegments)
    const material = new THREE.MeshStandardMaterial({color: 0xffffff})
    
    super(geometry,material)
  } 
  
  
  setAngle(newAngle){
    this.angle= newAngle
  }
  
  toOrbit(planet,radius,velocity){ 
    
    
    this.position.x = planet.position.x + Math.cos(this.angle) * radius
    this.position.z = planet.position.z + Math.sin(this.angle) * radius
    
    
    this.orbit.push(new THREE.Vector3(this.position.x,this.position.y,this.position.z))
    
    this.angle += velocity
    if(this.angle * Math.PI / 180 >= Math.PI*2 ){
      
      this.angle = 0
      this.orbit=[]
    }  
    
    this.updateOrbit()
      }


    updateOrbit(){
      this.lineOrbit= new THREE.Line( new THREE.BufferGeometry().setFromPoints( this.orbit ), new THREE.LineBasicMaterial({
        color: 0xffffff
      }));

      }

}