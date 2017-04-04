import Babylon from 'babylonjs';
import _ from 'lodash'

export default class PreLoader {
  constructor(game) {
    this.game = game;
    this.scene = game.scene;
    this.loader = new Babylon.AssetsManager(this.scene);
    this.loader.userDefaultLoadingScreen = false;

    return this;
  }

  onFinish(callback, context) {
    this.loader.onFinish = callback ? callback.bind(context) : _.noop();
  }

  loadAssets(assets) {
    _.forEach(assets, (asset) => {
      this.addMesh(asset);
    });
    this.loader.load();
    return this;
  }

  addMesh(name) {
    let task = this.loader.addMeshTask(name, '', 'assets/', `${name}.babylon`);
    task.onSuccess = this.addMeshAssetToGame.bind(this);
  }

  addMeshAssetToGame(task) {
    for (let m of task.loadedMeshes) {
        m.setEnabled(false);
        m.isPickable = true; 
        this.game.loadedAssets[m.name] = (m);     
    }
  }
}