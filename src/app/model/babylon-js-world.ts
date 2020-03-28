import {World} from './world';
import * as BABYLON from 'babylonjs';
import {BabylonJsBrick} from './babylon-js-brick';
import {Brick} from './brick';
import Engine = BABYLON.Engine;
import Scene = BABYLON.Scene;
import UniversalCamera = BABYLON.UniversalCamera;
import Vector3 = BABYLON.Vector3;
import HemisphericLight = BABYLON.HemisphericLight;
import Mesh = BABYLON.Mesh;
import Color3 = BABYLON.Color3;
import StandardMaterial = BABYLON.StandardMaterial;
import DynamicTexture = BABYLON.DynamicTexture;

export class BabylonJsWorld extends World {

  private readonly canvas: HTMLCanvasElement;
  private readonly scene: Scene;
  private readonly engine: Engine;
  private readonly camera: UniversalCamera;
  private readonly light: HemisphericLight;

  /**
   * @param dimensions the dimensions i.e. x,y,z
   * @param canvas the canvas
   */
  constructor(dimensions: [number, number, number], canvas: HTMLCanvasElement) {
    super(dimensions);
    this.canvas = canvas;
    this.engine = new Engine(this.canvas, true, {preserveDrawingBuffer: true, stencil: true});
    this.scene = new Scene(this.engine);
    this.camera = new UniversalCamera(
      'worldCamera',
      new Vector3(this.dimensions[0] / 2, this.dimensions[1] * 1.5, this.dimensions[2] / 2), this.scene);
    this.camera.setTarget(new Vector3(this.dimensions[0] / 2, this.dimensions[1] / 2, this.dimensions[2] / 2));
    this.camera.attachControl(canvas, false);
    // Create a basic light, aiming 0, 1, 0 - meaning, to the sky TODO play around for world
    this.light = new HemisphericLight('mainLight', new Vector3(0, 1, 0), this.scene);

    this.showAxis(10);

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
    window.addEventListener('resize', () => {
      this.engine.resize();
    });
  }

  showAxis(size) {
    const makeTextPlane = (text, color, tpSize) => {
      const dynamicTexture = new DynamicTexture('DynamicTexture', 50, this.scene, true);
      dynamicTexture.hasAlpha = true;
      dynamicTexture.drawText(text, 5, 40, 'bold 36px Arial', color , 'transparent', true);
      const plane = Mesh.CreatePlane('TextPlane', tpSize, this.scene, true);
      plane.material = new StandardMaterial('TextPlaneMaterial', this.scene);
      plane.material.backFaceCulling = false;
      (plane.material as StandardMaterial).specularColor = new Color3(0, 0, 0);
      (plane.material as StandardMaterial).diffuseTexture = dynamicTexture;
      return plane;
    };

    const axisX = Mesh.CreateLines('axisX', [
      Vector3.Zero(), new Vector3(size, 0, 0), new Vector3(size * 0.95, 0.05 * size, 0),
      new Vector3(size, 0, 0), new Vector3(size * 0.95, -0.05 * size, 0)
    ], this.scene);
    axisX.color = new Color3(1, 0, 0);
    const xChar = makeTextPlane('X', 'red', size / 10);
    xChar.position = new Vector3(0.9 * size, -0.05 * size, 0);
    const axisY = Mesh.CreateLines('axisY', [
      Vector3.Zero(), new Vector3(0, size, 0), new Vector3( -0.05 * size, size * 0.95, 0),
      new Vector3(0, size, 0), new Vector3( 0.05 * size, size * 0.95, 0)
    ], this.scene);
    axisY.color = new Color3(0, 1, 0);
    const yChar = makeTextPlane('Y', 'green', size / 10);
    yChar.position = new Vector3(0, 0.9 * size, -0.05 * size);
    const axisZ = Mesh.CreateLines('axisZ', [
      Vector3.Zero(), new Vector3(0, 0, size), new Vector3( 0 , -0.05 * size, size * 0.95),
      new Vector3(0, 0, size), new Vector3( 0, 0.05 * size, size * 0.95)
    ], this.scene);
    axisZ.color = new Color3(0, 0, 1);
    const zChar = makeTextPlane('Z', 'blue', size / 10);
    zChar.position = new Vector3(0, 0.05 * size, 0.9 * size);
  }

  /**
   * Returns a list of possible positions for this brick.
   * @param brick the brick
   */
  public possiblePositionsFor(brick: Brick): Array<[number, number, number]> {
    return super.possiblePositionsFor(brick);
  }

  /**
   * Put a brick on the bottom of the world.
   * A brick can be connected to every position (within the world boundaries) at the bottom of the world.
   * @param brick the brick
   * @param position the position for the brick, i.e. [x,y,z]
   */
  public putBrick(brick: Brick, position: [number, number, number]): boolean {
    if (super.putBrick(brick, position)) {
      // window.console.debug(`Brick:`, brick);
      const babylonBrick: BabylonJsBrick = BabylonJsBrick.fromBrick(brick);
      // window.console.debug(`BabylonBrick:`, babylonBrick);
      babylonBrick.draw(this.scene);
      return true;
    }
  }

  /**
   * Removes a brick from this world.
   * @param brick the brick to be removed.
   */
  public remove(brick: BabylonJsBrick) {
    super.remove(brick);
    brick.undraw(this.scene);
  }
}
