import {Brick} from './brick';
import * as BABYLON from 'babylonjs';
import Scene = BABYLON.Scene;
import MeshBuilder = BABYLON.MeshBuilder;
import Mesh = BABYLON.Mesh;
import StandardMaterial = BABYLON.StandardMaterial;
import Color3 = BABYLON.Color3;

export class BabylonJsBrick extends Brick {

  private mesh: Mesh;

  /**
   * @param dimensions the dimensions i.e. x,y,z
   * @param color the color in hex e.g. '#AABBCCD' or '#ABABAB'
   */
  constructor(dimensions: [number, number, number], color: string,
              position?: [number, number, number], connectionsTop?: Brick[][], connectionsBottom?: Brick[][]) {
    super(dimensions, color, position, connectionsTop, connectionsBottom);
  }

  /**
   * Creates a babylonjs brick of a plain brick.
   * @param brick the brick.
   */
  public static fromBrick(brick: Brick): BabylonJsBrick {
    return new BabylonJsBrick(brick.dimensions, brick.color, brick.position, brick.connectionsTop, brick.connectionsBottom);
  }

  /**
   * Draws the brick.
   * @param scene the scene
   */
  public draw(scene: Scene) {
    this.mesh = MeshBuilder.CreateBox(
      'brick',
      {width: this.dimensions[0], depth: this.dimensions[1], height: this.dimensions[2]},
      scene);
    this.mesh.material =  new StandardMaterial('brick_material', scene);
    (this.mesh.material as StandardMaterial).diffuseColor = Color3.FromHexString(this.color);
    this.mesh.position.x = this.position[0];
    this.mesh.position.y = this.position[1];
    this.mesh.position.z = this.position[2];
  }

  /**
   * Removes the brick.
   * @param scene the scene
   */
  public undraw(scene: Scene) {
    scene.removeMesh(this.mesh);
  }

  // /**
  //  * Returns the mesh if the brick is already drawn, otherwise null.
  //  */
  // public getMesh(): Mesh {
  //   return this.mesh;
  // }
}
