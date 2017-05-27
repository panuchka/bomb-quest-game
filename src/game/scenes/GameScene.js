import Babylon from 'babylonjs'
import _ from 'lodash'

import Scene from './Scene'
import StageManager from '../scripts/stage/StageManager'
import Player from '../scripts/player/Player'
import Guardian from '../scripts/actor/Guardian'
import PreLoader from '../helpers/Preloader'

export default class GameScene extends Scene {
  constructor(canvas, engine) {
    super(canvas, engine);

    //this.scene.debugLayer.show();

    /* Gravity and collisions */
    this.scene.gravity = new Babylon.Vector3(0, -1, 0);
    this.scene.collisionsEnabled = true;

    /* Fog */
    this.scene.fogMode = Babylon.Scene.FOGMODE_EXP;
    this.scene.fogColor = new Babylon.Color3(0.9, 0.9, 0.85);
    this.scene.fogDensity = 0.0001;

    /* Shadows */
    this.shadowGenerator = new Babylon.ShadowGenerator(1024, this.directionalLight);
    this.shadowGenerator.useBlurExponentialShadowMap = true;

    this.scene.actionManager = new Babylon.ActionManager(this.scene);

    /* Init assets */
    this.loadedAssets = {};
    this.meshes = ['game'];
    this.textures = [];

    new PreLoader(this)
     .loadAssets(this.meshes, this.textures)
     .onFinish(this.initScene, this);

    /* Game state */
    this.health = 100
    this.scrap = 0
    this.scrapGoal = _.sample([5, 10, 15])

    this.state = this.scene.onBeforeRenderObservable.add(() => {
      if (this.scrap >= this.scrapGoal) {
        console.log('EPIC WIN')
      }
    })
  }

  changeStage() {
    this.stage = this.stageManager.createStage()
    this.stage.spawnActors()
    this.stage.spawnPlayer()

    this.directionalLight.position = this.player.body.position

    this.stageManager.removeStage(0)
  }

  initScene() {
    try {
      this.stageManager = new StageManager(this);
      this.stage = _.sample([0,1])
        ? this.stageManager.createStage('basic-1')
        : this.stageManager.createStage('basic-1');
      this.stage.spawnActors();

      /* Init player */
      this.player = new Player(this);
      this.stage.spawnPlayer()
    } 
    catch(e) {
      console.log(e);
    }
  }
}