import Babylon from 'babylonjs'

export default class Treasure {
  constructor(game, mesh, position) {
    this.body = mesh.createInstance('Treasure');
    this.body.setEnabled(true);
    this.body.position = new Babylon.Vector3(position.x, position.y, position.z);
    this.game = game;
    
    const target = new Babylon.Vector3(1, 1, 1);
    let timeInSeconds = 0;

    this.render = this.game.scene.onBeforeRenderObservable.add(() => {
      timeInSeconds += 0.001 * this.game.scene.getEngine().getDeltaTime();
      const amplitude = 0.1;
      const speed = 1;
      const scaling = amplitude * Math.sin(timeInSeconds * 2 * Math.PI * speed - Math.PI/2) + 1;

      this.body.rotation.y += 0.02;
      this.body.scaling.x = scaling;
      this.body.scaling.y = scaling;
      this.body.scaling.z = scaling;

      if (this.game.player.body.intersectsMesh(this.body, true)) {
        this.find();
      }
    });
  }

  find() {
    this.body.dispose();
    this.game.scene.onBeforeRenderObservable.remove(this.render);
    this.game.scrap++
    delete this;
  }
}