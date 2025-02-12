import * as THREE from 'three'

export class Planet extends THREE.Mesh{

  orbitalPeriod =0
  sideralDay =0
  translationAngle = 0
  rotateAngle = 0
  orbit = []
  orbited = undefined
  distanceToOrbited = 0
  translateCounterClockWise = false
  rotateCounterClockWise = false
  lineOrbit =  new THREE.Line( new THREE.BufferGeometry().setFromPoints( this.orbit ), new THREE.LineBasicMaterial({
        color:0xffffff
      }));


  firstOrbit = false

  constructor({radius,widthSegments,heightSegments,sideralDay=0,orbitalPeriod=0,orbited= undefined,distanceToOrbited=0,translateCounterClockWise= false,rotateCounterClockWise= false}){
    const material =  new THREE.MeshStandardMaterial({color: 0xffffff}) 
    const geometry = new THREE.SphereGeometry(radius,widthSegments,heightSegments)
    super(geometry,material)
    
    this.sideralDay = sideralDay
    this.orbitalPeriod= orbitalPeriod
    this.orbited = orbited
    this.distanceToOrbited=distanceToOrbited
    this.translateCounterClockWise = translateCounterClockWise
    this.rotateCounterClockWise = rotateCounterClockWise
    
    
  } 
  getTranslateCounterClockWise(){
    return this.translateCounterClockWise
  }
  getRotateCounterClockWise(){
    return this.rotateCounterClockWise
  }
  getSideralDay(){
    return this.sideralDay
  }
  getDistanceToOrbited(){
    return this.distanceToOrbited
  }
  
  getOrbited(){
    return this.orbited
  }


  getOrbitalPeriod(){
    return this.orbitalPeriod
  }
  
  setAngle(newAngle){
    this.angle = newAngle
  }

  rotate(angleIncrement,counterClockWise = false){

    if (counterClockWise) {
      this.rotateAngle -= angleIncrement
  } else {
      this.rotateAngle += angleIncrement
  }

    this.rotateAngle += angleIncrement
    this.rotateAngle %= 2 * Math.PI;
    
    this.rotation.y = this.rotateAngle
    
    

  }
  
  toOrbit(planet,radius,angleIncrement,counterClockWise = false){ 
    
    if (counterClockWise) {
      this.translationAngle -= angleIncrement
  } else {
      this.translationAngle += angleIncrement
  }

    this.translationAngle %= 2 * Math.PI;
    
    this.position.x = planet.position.x + Math.cos(this.translationAngle) * radius
    this.position.z = planet.position.z + Math.sin(this.translationAngle) * radius
    
    
    this.orbit.push(new THREE.Vector3(this.position.x,this.position.y,this.position.z))
   
    if(Math.abs(this.translationAngle) < angleIncrement){
      console.log("orbita completa");
      
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


      loadTexture({map=null,bumpMap=null,bumpScale=1,roughnessMap=null,alphaMap=null,transparent=false}){
        this.material = new THREE.MeshPhysicalMaterial({
            map,
            bumpMap,
            bumpScale,
            roughnessMap,
            alphaMap,
            transparent,
          
          })
      }
}