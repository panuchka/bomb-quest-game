import Babylon from 'babylonjs'
import GameScene from './scenes/GameScene'
import MenuScene from './scenes/MenuScene'

export default class Game {
  constructor(canvasName) {
    this.canvas = document.getElementById(canvasName);
    this.engine = new Babylon.Engine(this.canvas, true);
    this.scene = null;
  } 

  static SCENES = {
    'GAME': 1,
    'MENU': 2
  };

  loadScene(sceneName) {
    if (this.scene) {
      this.scene.scene.dispose();
      this.scene = null;
    }

    if (sceneName === Game.SCENES.MENU) {
      this.scene = new MenuScene(this.canvas, this.engine);
    } else if (sceneName === Game.SCENES.GAME) {
      this.scene = new GameScene(this.canvas, this.engine);
    }

    return this;
  }

  run() {
    if (this.scene) {
      this.scene.scene.executeWhenReady(() => {
        this.engine.runRenderLoop(() => {
          this.scene.scene.render();
        });
      });

      window.addEventListener('resize', () => {
        this.engine.resize();
      });
    } else {
      console.log("No scene available!");
    }

    return this;
  }
}