import Babylon from 'babylonjs'
import Game from './game/Game'

window.BABYLON = Babylon;

new Game('renderCanvas').loadScene(Game.SCENES.GAME).run();