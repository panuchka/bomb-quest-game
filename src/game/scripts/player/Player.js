import Babylon from 'babylonjs'
import Bomb from '../item/Bomb'
import Treasure from '../item/Treasure'

export default class Player {
  constructor(game) {
    this.game = game;
    this.body = game.loadedAssets['Entity_Robot'];
    this.body.setEnabled(true);
    this.body.position.y = 0;
    this.body.position.x = 40;
    this.body.position.z = 100;

    const bounds = this.body.getBoundingInfo().boundingBox.extendSize;
    this.body.ellipsoid = new Babylon.Vector3(bounds.x / 2, bounds.x / 4, bounds.x / 2);
    this.body.ellipsoidOffset = new Babylon.Vector3(0, bounds.x / 2, 0);
    this.body.checkCollisions = true;
    this.body.applyGravity = true;
    this.body.visibility = true;

    this.game.shadowGenerator.getShadowMap().renderList.push(this.body);

    this.currentSpeed = new Babylon.Vector3(0, 0, 0);
    this.nextSpeed = new Babylon.Vector3(0, 0, 0);
    this.nextTorch = new Babylon.Vector3(0, 0, 0);

    this.movementDirection = [0, 0, 0, 0];

    game.scene.registerBeforeRender(() => {
      this.move();
      this.game.camera.target = Babylon.Vector3.Lerp(
        this.game.camera.target,
        this.body.position.add(this.currentSpeed.scale(15.0)),
        0.05
      );
    });

    window.addEventListener('keyup', (evt) => {
      this.handleKeyUp(evt.keyCode);
    });

    window.addEventListener('keydown', (evt) => {
      this.handleKeyDown(evt.keyCode);
    });
  }

  rotate() {
    if (this.currentSpeed.x > 0.1 || this.currentSpeed.z > 0.1 || this.currentSpeed.x < -0.1 || this.currentSpeed.z < -0.1) {
      var v1 = new Babylon.Vector2(0, -1);
      var v2 = new Babylon.Vector2(this.currentSpeed.x, this.currentSpeed.z);

      var angle = -Math.acos(Babylon.Vector2.Dot(v1, v2.normalize()));

      if (!isNaN(angle)) {
        if (this.currentSpeed.x < 0) angle = angle * -1;

        // calculate both angles in degrees
        var angleDegrees = Math.round(angle * 180 / Math.PI);
        var playerRotationDegrees = Math.round(this.body.rotation.y * 180 / Math.PI);

        // calculate the delta
        var deltaDegrees = playerRotationDegrees - angleDegrees;

        // check what direction to turn to take the shortest turn
        if (deltaDegrees > 180) {
          deltaDegrees = deltaDegrees - 360;
        } else if (deltaDegrees < -180) {
          deltaDegrees = deltaDegrees + 360;
        }

        var rotationSpeed = Math.round(Math.abs(deltaDegrees) / 8);
        if (deltaDegrees > 0) {
          this.body.rotation.y -= rotationSpeed * Math.PI / 180;
          if (this.body.rotation.y < -Math.PI) {
            this.body.rotation.y = Math.PI;
          }
        }
        if (deltaDegrees < 0) {
          this.body.rotation.y += rotationSpeed * Math.PI / 180;
          if (this.body.rotation.y > Math.PI) {
            this.body.rotation.y = -Math.PI;
          }
        }
      }
    }
  }

  move() {
    const velocity = 2;
    this.nextSpeed.x = 0.0;
    this.nextSpeed.y = -1;
    this.nextSpeed.z = 0.00001;

    if (this.movementDirection[0] != 0) { this.nextSpeed.z = velocity; }
    if (this.movementDirection[1] != 0) { this.nextSpeed.z = -velocity; }
    if (this.movementDirection[2] != 0) { this.nextSpeed.x = -velocity; }
    if (this.movementDirection[3] != 0) { this.nextSpeed.x = velocity; }

    this.currentSpeed = Babylon.Vector3.Lerp(this.currentSpeed, this.nextSpeed, 0.2);
    this.body.moveWithCollisions(this.currentSpeed);
    this.rotate();
  }

  addBomb() {
    new Bomb(this.game, this.game.loadedAssets['Item_Bomb'], this.body.position);
  }

  chooseDirection(direction, value) {
    this.movementDirection[direction] = value;
  }

  handleKeyUp(keycode) {
    switch (keycode) {
      case CONTROLS.ZQSD.TOP:
      case CONTROLS.QWSD.TOP:
        this.chooseDirection(2, 0);
        break;
      case CONTROLS.ZQSD.BOT:
      case CONTROLS.QWSD.BOT:
        this.chooseDirection(3, 0);
        break;
      case CONTROLS.ZQSD.LEFT:
      case CONTROLS.QWSD.LEFT:
        this.chooseDirection(1, 0);
        break;
      case CONTROLS.ZQSD.RIGHT:
      case CONTROLS.QWSD.RIGHT:
        this.chooseDirection(0, 0);
        break;
      case CONTROLS.WEAPON:
        this.addBomb();
    };
  }

  handleKeyDown(keycode) {
    switch (keycode) {
      case CONTROLS.ZQSD.TOP:
      case CONTROLS.QWSD.TOP:
        this.chooseDirection(2, 1);
        break;
      case CONTROLS.ZQSD.BOT:
      case CONTROLS.QWSD.BOT:
        this.chooseDirection(3, 1);
        break;
      case CONTROLS.ZQSD.LEFT:
      case CONTROLS.QWSD.LEFT:
        this.chooseDirection(1, 1);
        break;
      case CONTROLS.ZQSD.RIGHT:
      case CONTROLS.QWSD.RIGHT:
        this.chooseDirection(0, 1);
        break;
    };
  }
}

const CONTROLS = {
  ZQSD: {
    TOP: 90,
    BOT: 83,
    LEFT: 81,
    RIGHT: 68
  },
  QWSD: {
    TOP: 87,
    BOT: 83,
    LEFT: 65,
    RIGHT: 68
  },
  WEAPON: 32
};