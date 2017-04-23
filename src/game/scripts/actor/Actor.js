import Babylon from 'babylonjs'
import _ from 'lodash'

export default class Actor {
  constructor(game, model, position) {
    this.game = game;
    this.body = game.loadedAssets['Entity_Hazmat'].createInstance('Entity_Hazmat-1');
    this.body.setEnabled(true);
    this.body.position = new Babylon.Vector3(position.x, 0, position.y);
    //this.body.checkCollisions = true;
    this.game.shadowGenerator.getShadowMap().renderList.push(this.body);

    this.scene = game.scene;
    this.stage = game.stage;
    this.model = model;

    var tickTime = 500;
	  var now = Date.now();
	  var last = Date.now();
	  var dt = 0;
	  var accumulator = 0;
	  var last_tick = 0;

    this.scene.registerBeforeRender(() => {
      now = Date.now();
		  dt = now - last;
		  last = now;
		  accumulator += dt;
		  if (accumulator > tickTime) {
			  accumulator -= tickTime;

        let path = this.stage.getPath(this.body.position, game.player.body.position, this.model);
        this.target(path);
		  }
    });
  }

  target(path) {
    if (path && path.length > 0) {
      let length = 0;
      let direction = [{  
        frame: 0,
        value: this.body.position
      }];

      for (let i = 0; i < path.length; i++) {
        length += Babylon.Vector3.Distance(direction[i].value, path[i]);
        direction.push({
          frame: length * 100,
          value: path[i]
        });
      }

      for (let i = 0; i < direction.length; i++) {
        direction[i].frame /= length;
      }

      let moveActor = new Babylon.Animation("CameraMove", "position", 180/length+10, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, Babylon.Animation.ANIMATIONLOOPMODE_CONSTANT);
      moveActor.setKeys(direction);
      this.body.animations.push(moveActor);

      //if (line) line.dispose();
        //var line = Babylon.Mesh.CreateLines("lines", [this.body.position].concat(path), this.scene);
        //line.color = new Babylon.Color3(1, 0, 0);
        //line.position.y = 0.001;

      this.scene.beginAnimation(this.body, 0, 100, false, 2);
    }
  }

  remove() {
    this.body.dispose();
    delete this;
  }
}