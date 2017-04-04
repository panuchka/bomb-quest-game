import Babylon from 'babylonjs'

export default class Bomb {
  constructor(game, mesh, position) {
    this.body = mesh.createInstance('Bomb');
    this.body.setEnabled(true);
    this.body.position = new Babylon.Vector3(position.x, position.y, position.z);
    this.game = game;

    let timeInSeconds = 0;

    this.counter = this.game.scene.onBeforeRenderObservable.add(() => {
      timeInSeconds += 0.001 * this.game.scene.getEngine().getDeltaTime();
      const amplitude = 0.1;
      const speed = 1;
      const scaling = amplitude * Math.sin(timeInSeconds * 2 * Math.PI * speed - Math.PI/2) + 1;

      this.body.scaling.x = scaling;
      this.body.scaling.y = scaling;
      this.body.scaling.z = scaling;

      if (timeInSeconds >= 3) {
        this.explode();
      }
    });
  }

  explode() {
    const rayCurrentTile = new Babylon.Ray(
      new Babylon.Vector3(this.body.position.x, this.body.position.y, this.body.position.z),
      new Babylon.Vector3(0, -1, 0));
    const result = this.game.scene.pickWithRay(rayCurrentTile);

    if (result.hit && result.pickedMesh.modelPosition) {
      this.game.stage.destroyTiles(result.pickedMesh.modelPosition);
      this.game.stage.buildNavigationMesh(this.game.scene);
    }

    this.body.dispose();
    this.game.scene.onBeforeRenderObservable.remove(this.counter);
    delete this;
  }
}