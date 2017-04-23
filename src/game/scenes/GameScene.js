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

    this.scene.debugLayer.show();

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
  }

  initScene() {
    try {
      this.stageManager = new StageManager(this);
      this.stage = _.sample([0,1])
        ? this.stageManager.createStage('basic-1')
        : this.stageManager.createStage();
      this.stage.spawnActors();

      /* Init player */
      this.player = new Player(this);
      this.player.body.position = new Babylon.Vector3(
        (this.stage.model.start.x * this.stage.tileSize) - this.stage.tileSize/2, 
        0, 
        (this.stage.model.start.y * this.stage.tileSize) - this.stage.tileSize/2);
    } 
    catch(e) {
      console.log(e);
    }
  }
}