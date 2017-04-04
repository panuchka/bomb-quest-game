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
/*
    this.ui = new Canvas2D.ScreenSpaceCanvas2D(this.scene, {
      id: "UI",
      backgroundFill: "#4040408F",
      backgroundRoundRadius: 50,
      children: [
        new Canvas2D.Text2D("Hello World!", {
          id: "text",
          marginAlignment: "h: center, v:center",
          fontName: "20pt Arial",
        })
      ]
    });*/
  }
}