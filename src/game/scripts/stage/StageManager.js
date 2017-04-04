import Babylon from 'babylonjs'
import _ from 'lodash'
import STAGES from './handcrafted.stage'

import Stage from './Stage'

export default class StageManager {
  constructor(game) {
    this.game = game;
    this.stages = [];
    this.currentStage = null;
    this.tileSize = game.loadedAssets['Tile_Floor'].getBoundingInfo().boundingBox.extendSize.x * 2;
    this.spaceBetweenStages = 2000;
    this.currentStageIndex = 0;
  }

  createStage(stageName) {
    const stage = new Stage(this.game, stageName, this.tileSize, this.spaceBetweenStages, this.currentStageIndex);

    this.currentStageIndex++;
    this.stages.push(stage);

    if (!this.currentStage) {
      this.currentStage = stage;
    }

    return stage;
  }

  setCurrentStage(stage) {
    this.currentStage = stage;
  }

  getCurrentStage() {
    return this.currentStage;
  }

  removeStage(index) {
    const stage = _.first(this.stages.splice(index, 1));

    _.forEach(stage.model.tiles, (row) => {
      _.forEach(row, (col) => {
        if (col.tileMesh) col.tileMesh.dispose();
        if (col.obstacleMesh) col.obstacleMesh.dispose();
        if (col.rotorBaseMesh) col.rotorBaseMesh.dispose();
        if (col.rotorFanMesh) col.rotorFanMesh.dispose();
      });
    });

    stage.model.group.dispose();
    stage.navMesh.dispose();
  }
}