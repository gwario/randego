import {Brick} from './brick';
import * as BABYLON from 'babylonjs';
import Scene = BABYLON.Scene;
import MeshBuilder = BABYLON.MeshBuilder;
import Mesh = BABYLON.Mesh;
import StandardMaterial = BABYLON.StandardMaterial;
import Color3 = BABYLON.Color3;
import Vector3 = BABYLON.Vector3;

export class BabylonJsBrick extends Brick {

  private mesh: Mesh;

  /**
   * Creates a babylonjs brick of a plain brick.
   * @param brick the brick.
   */
  public static fromBrick(brick: Brick): BabylonJsBrick {
    return new BabylonJsBrick(brick.dimensions, brick.color, brick.position, brick.connectionsTop, brick.connectionsBottom);
  }

  /**
   * Returns the real position within a {@BabylonJsWorld}
   * @param position the virtual position
   * @param dimensions the brick dimensions
   */
  public static correctBrickPosition(position: [number, number, number], dimensions: [number, number, number]): [number, number, number] {
    return [position[0] + dimensions[0] / 2, position[2] + dimensions[2] / 2, position[1] + dimensions[1] / 2];
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
    const absolutePosition = BabylonJsBrick.correctBrickPosition(this.position, this.dimensions);
    this.mesh.position.x = absolutePosition[0];
    this.mesh.position.y = absolutePosition[1];
    this.mesh.position.z = absolutePosition[2];
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
