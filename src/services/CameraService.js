import * as THREE from 'three'
import { GeometryService } from './GeometryService'


export class CameraService{

  static instance 

  geometryService

  constructor(){

     this.geometryService = GeometryService.getInstance()
  }


  static getInstance(){
    if(!CameraService.instance){
      CameraService.instance = new CameraService()

    }
    return CameraService.instance
  }

  createPerspectiveCamera({fov,aspect,near,  far}){
    const camera=  new THREE.PerspectiveCamera( fov, aspect, near , far );
    return camera
  }
  

  changeCamera(container ,planets){
    let cameraTarget = planets[0]

    const size = this.geometryService.getObjectSize(cameraTarget)
    console.log(size);
    this.geometryService.updateBoxSize(container,size.x, size.y, size.z)

    container.position.copy(cameraTarget.position)
    
    
    container.setCurrentTarget(cameraTarget)
    planets.push(cameraTarget)
    planets.shift()

   
    
    
    }
}