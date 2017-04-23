import Babylon from 'babylonjs'
import Navigation from 'babylon-navigation-mesh'
import STAGES from './handcrafted.stage'
import Treasure from '../item/Treasure'
import Guardian from '../actor/Guardian'

export default class Stage {
  constructor(game, stageName, tileSize, spaceBetweenStages, stageIndex) {
    this.game = game;
    this.generatorOptions = {
      maxWidth: 20,
      maxHeight: 20,
      namePool: ['random']
    };

    this.model = stageName ? this.getModel(stageName) : this.generateModel();
    this.navMesh = null;
    this.actors = [];
    this.navigation = new Navigation();

    this.tileSize = tileSize;
    this.spaceBetweenStages = spaceBetweenStages * stageIndex;

    this.createStage();
    this.buildNavigationMesh(this.game.scene);
  }

  createStage() {
    const floorMesh = this.game.loadedAssets['Tile_Floor'];
    floorMesh.receiveShadows = true;
    floorMesh.checkCollisions = true;

    const obstacleMesh = this.game.loadedAssets['Tile_Wall'];
    obstacleMesh.receiveShadows = true;
    obstacleMesh.checkCollisions = true;

    const rotorBase = this.game.loadedAssets['Machine_Base'];
    rotorBase.receiveShadows = true;
    rotorBase.checkCollisions = true;

    const rotorFan = this.game.loadedAssets['Machine_Propeller'];
    rotorFan.receiveShadows = true;

    const group = new Babylon.Mesh.CreateBox(this.model.name, 1, this.game.scene);
    group.isVisible = false;

    const findRotorDirection = (x, y) => {
      const tiles = [this.model.tiles[x-1] ? this.model.tiles[x][y] : undefined,
        this.model.tiles[x][y-1],
        this.model.tiles[x][y+1],
        this.model.tiles[x+1] ? this.model.tiles[x][y] : undefined];

      if (!tiles[0] || tiles[0].tile === 0) return {x: -1, y: 0, rotation: Math.PI};
      if (!tiles[1] || tiles[1].tile === 0) return {x: 0, y: -1, rotation: Math.PI / 2};
      if (!tiles[2] || tiles[2].tile === 0 ) return {x: 0, y: 1, rotation: 3 * Math.PI / 2};
      if (!tiles[3] || tiles[3].tile === 0 ) return {x: 1, y: 0, rotation: 0};
    };

    this.model.tiles = _.map(this.model.tiles, (row, x) => {
      return _.map(row, (col, y) => {
        if (col.floor === 1) {
          const floorMeshCopy = floorMesh.createInstance('Floor');
          floorMeshCopy.position = new Babylon.Vector3(x * this.tileSize + (this.tileSize/2), 0, y * this.tileSize + (this.tileSize/2));
          floorMeshCopy.checkCollisions = true;
          floorMeshCopy.modelPosition = {x, y};
          col.floorMesh = floorMeshCopy;
          col.floorMesh.parent = group;
        }

        if (col.obstacle === 1) {
          const obstacleMeshCopy = obstacleMesh.createInstance('Obstacle');
          obstacleMeshCopy.position = new Babylon.Vector3(x * this.tileSize + (this.tileSize/2), 0, y * this.tileSize + (this.tileSize/2));
          obstacleMeshCopy.checkCollisions = true;
          obstacleMeshCopy.rotation = new Babylon.Vector3(0, _.sample([0, (Math.PI/2), (-Math.PI/2), Math.PI]), 0);
          col.obstacleMesh = obstacleMeshCopy;
          col.obstacleMesh.parent = group;
        }

        if (col.rotor === 1 && col.floor === 1) {
          const rotorLocation = findRotorDirection(x, y);
          const offset = 20;
          const rotorOffset = 20;
          
          if (rotorLocation) {
            const rotorBaseMeshCopy = rotorBase.createInstance('RotorBase');
            rotorBaseMeshCopy.rotation.y = rotorLocation.rotation;
            rotorBaseMeshCopy.checkCollisions = true;
            rotorBaseMeshCopy.position = new Babylon.Vector3(
              x * this.tileSize + (this.tileSize/2) + (rotorLocation.x * (this.tileSize-offset)), 
              0, 
              y * this.tileSize + (this.tileSize/2) + (rotorLocation.y * (this.tileSize-offset)));
            rotorBaseMeshCopy.setEnabled(true);
            col.rotorBaseMesh = rotorBaseMeshCopy;
            col.rotorBaseMesh.parent = group;

            const rotorFanMeshCopy = rotorFan.createInstance('RotorFan');
            rotorFanMeshCopy.position = new Babylon.Vector3(
              x * this.tileSize + (this.tileSize/2) + (rotorLocation.x * (this.tileSize + rotorOffset)), 
              0, 
              y * this.tileSize + (this.tileSize/2) + (rotorLocation.y * (this.tileSize + rotorOffset)));
            rotorFanMeshCopy.setEnabled(true);
            this.game.scene.actionManager.registerAction(new Babylon.IncrementValueAction(Babylon.ActionManager.OnEveryFrameTrigger, rotorFanMeshCopy, "rotation.y", 0.2));

            col.rotorFanMesh = rotorFanMeshCopy;
            col.rotorFanMesh.parent = group;
          } else {
            // Invalid rotator location, abort abort
            col.rotor = 0;
          }
        }

        return col;
      });
    });

    this.model.group = group;
    this.model.group.position.z = this.spaceBetweenStages;

    return this.model;
  }

  generateModel() {
    const tiles = _(this.generatorOptions.maxWidth)
      .range()
      .map((row, x) => {
        return _(this.generatorOptions.maxHeight)
          .range()
          .map((column, y) => {
            const floor = _.sample([1,1,1,1,1]);
            return {
              floor: floor,
              obstacle: floor ? _.sample([1,0,0,0,0]) : 0,
              rotor: floor ? _.sample([1,0,0,0,0]) : 0
            };
          })
          .value();
      })
      .value();
    
    return {
      name: _.sample(this.generatorOptions.namePool),
      tiles: tiles,
      start: {
        x: 1,
        y: 1
      },
      actors: []
    };
  }

  getModel(stageName) {
    const model = _.find(STAGES, {name: stageName});

    return {
      name: model.name,
      tiles: _.map(model.floors, (row, x) => {
        return _.map(row, (col, y) => {
          return {
            floor: col,
            obstacle: model.obstacles[x][y],
            rotor: model.rotors[x][y],
            floorMesh: null,
            obstacleMesh: null,
            rotorBaseMesh: null,
            rotorFanMesh: null
          }
        });
      }),
      start: model.start,
      actors: model.actors
    };
  }

  buildNavigationMesh(scene) {
    const height = this.model.tiles.length;
    const width = this.model.tiles[0].length;

    if (this.navMesh) {
      this.navMesh.dispose();
    }

    const navMesh = new Babylon.Mesh("NavMesh", scene);
    navMesh.position.z = this.spaceBetweenStages;

    let positions = [];
    let indices = [];
    let normals = [];
    let index = 0;

    function addVector3(vector3) {
      positions.push(vector3.x);
      positions.push(vector3.y);
      positions.push(vector3.z);
    }

    function vector3(x, y, tileSize) {
      return {
        x: x * tileSize,
        y: 0,
        z: y * tileSize
      };
    }

    for (let x = 0; x < height; x++) {
      for (let y = 0; y < width; y++) {
        if (this.model.tiles[x][y].floor === 0 || this.model.tiles[x][y].obstacle === 1) continue;
        
        let northLeft = vector3(x+0.333, y+1, this.tileSize);
        let northRight = vector3(x+0.666, y+1, this.tileSize);
        let westBottom = vector3(x, y+0.333, this.tileSize);
        let westTop = vector3(x, y+0.666, this.tileSize);
        let eastBottom = vector3(x+1, y+0.333, this.tileSize);
        let eastTop = vector3(x+1, y+0.666, this.tileSize);
        let southLeft = vector3(x+0.333, y, this.tileSize);
        let southRight = vector3(x+0.666, y, this.tileSize);
        
        addVector3(southLeft);            
        addVector3(westTop);
        addVector3(westBottom);

        addVector3(southLeft);            
        addVector3(northLeft);
        addVector3(westTop);

        addVector3(southLeft);            
        addVector3(northRight);
        addVector3(northLeft);

        addVector3(southLeft);            
        addVector3(eastTop);
        addVector3(northRight);

        addVector3(southLeft);            
        addVector3(eastBottom);
        addVector3(eastTop);

        addVector3(southLeft);            
        addVector3(southRight);
        addVector3(eastBottom);
        
        for (let i = 0; i < 18; i++) {
          indices[index + i] = index + i;
        }

        index += 18;
      }
    }

    Babylon.VertexData.ComputeNormals(positions, indices, normals);

    const vertexData = new Babylon.VertexData();
    vertexData.positions = positions;
    vertexData.indices = indices;
    vertexData.normals = normals;
    vertexData.applyToMesh(navMesh);

    //const material = new Babylon.StandardMaterial("NavMeshMaterial", scene);
    //material.wireframe = true;
    //navMesh.material = material;
    navMesh.setEnabled(false);

    const zoneNodes = this.navigation.buildNodes(navMesh);
    this.navigation.setZoneData(this.model.name, zoneNodes);

    this.navMesh = navMesh;
  }

  getPath(start, end, model) {
    const group = this.navigation.getGroup(model.name, start);
    return this.navigation.findPath(start, end, model.name, group) || [];
  }

  spawnActors() {
    this.actors = _.map(this.model.actors, (actor) => {
      return new Guardian(this.game, this.model, {
        x: (actor.x * this.tileSize) - this.tileSize/2, 
        y: (actor.y * this.tileSize) - this.tileSize/2
      });
    });
  }

  spawnTreasure(location) {
    new Treasure(this.game, this.game.loadedAssets['Collectable_Scrap'], location);
  }

  destroyTiles(explosionPosition) {
    const x = explosionPosition.x;
    const y = explosionPosition.y;

    _.forEach([-1, 0, 1], (mx) => {
      _.forEach([-1, 0, 1], (my) => {
        const row = this.model.tiles[mx+x];
        if (row) {
          const col = row[my+y];
          if (col) {
            col.obstacle = 0;
            if (col.obstacleMesh) {
              col.obstacleMesh.dispose();
              if (_.sample([0,0,0,0,1]) === 1) {
                this.spawnTreasure(new Babylon.Vector3(
                  this.spaceBetweenStages + this.tileSize*(mx+x) + (this.tileSize/2), 
                  10,
                  this.spaceBetweenStages + this.tileSize*(my+y) + (this.tileSize/2)));
              }
            }
            if (col.rotor === 1) {
              col.rotor = 0;
              if (col.rotorBaseMesh) col.rotorBaseMesh.dispose();
              if (col.rotorFanMesh) col.rotorFanMesh.dispose();
            }
          }
        }
      });
    });

    this.model.tiles[x][y].floor = 0;
    this.model.tiles[x][y].floorMesh.dispose();
  }

  destroy() {
    this.group.dispose();
    delete this;
  }
}