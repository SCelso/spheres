import * as THREE from 'three'

export class Container extends THREE.Mesh {

  translationAngle = 0
  rotateAngle = 0
  orbit = [] 

  constructor( ){

     const geometry = new THREE.SphereGeometry(10,55,55)
        const material =  new THREE.MeshBasicMaterial({color: 0xffffff}) 
        
    super(geometry,material)
  }

   toOrbit(planet,radius,angleIncrement){ 
      
      this.translationAngle += angleIncrement
      this.translationAngle %= 2 * Math.PI;
      
      this.position.x = planet.position.x + Math.cos(this.translationAngle) * radius
      this.position.z = planet.position.z + Math.sin(this.translationAngle) * radius
      
      this.orbit.push(new THREE.Vector3(this.position.x,this.position.y,this.position.z))
      
      if(this.translationAngle < angleIncrement){
        console.log("orbita completa");
        console.log(this.translationAngle);
        this.angle= 0
        
        this.firstOrbit = true
      }
  
      if(this.firstOrbit){
  
        this.orbit.shift()
  
      }
      
      this.updateOrbit()
      
 
    }

    updateOrbit(){
          
          if (!this.lineOrbit) {
            this.lineOrbit = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(this.orbit),
            new THREE.LineBasicMaterial({ color: 0xffffff }));
          } else {
            this.lineOrbit.geometry.dispose()
            this.lineOrbit.geometry= new THREE.BufferGeometry().setFromPoints(this.orbit);
          }
    
          }
    
    
          loadTexture(texture){
            this.material = new THREE.MeshStandardMaterial({
                map: texture
              })
          }
}