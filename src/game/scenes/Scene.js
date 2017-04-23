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

    this.light = new Babylon.HemisphericLight("Hemi0", new Babylon.Vector3(0, 40, 0), this.scene);
    this.light.intensity = 0.6;
    this.light.diffuse = new Babylon.Color3(1, 1, 1);
    this.light.specular = new Babylon.Color3(1, 1, 1);
    this.light.groundColor = new Babylon.Color3(0, 0, 0);

    this.directionalLight = new Babylon.DirectionalLight("light", new Babylon.Vector3(-1, -2, -1), this.scene);
    this.directionalLight.position = new Babylon.Vector3(0, 60, 20);
    this.directionalLight.intensity = 0.5;
    this.directionalLight.diffuse = new Babylon.Color3(1, 1, 1);
    this.directionalLight.specular = new Babylon.Color3(1, 1, 1);
  }
}