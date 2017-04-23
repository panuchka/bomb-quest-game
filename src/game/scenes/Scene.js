import Babylon from 'babylonjs';

export default class Scene {
  constructor(canvas, engine) {
    this.scene = new Babylon.Scene(engine);
    this.camera = new Babylon.ArcRotateCamera(
      "Camera", 
      0, 
      Math.PI / 5, 
      400, 
      new Babylon.Vector3(0, 0, 0), 
      this.scene);
    this.camera.attachControl(canvas, true);
    this.light = new Babylon.HemisphericLight('Atmospheric Light', new Babylon.Vector3(0,1,0), this.scene);
  }
}