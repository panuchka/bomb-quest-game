import _ from 'lodash'
import Scene from './Scene'

export default class MenuScene extends Scene {
  constructor(canvas, engine) {
    super(canvas, engine);

    this.scene.debugLayer.show();
  }
}