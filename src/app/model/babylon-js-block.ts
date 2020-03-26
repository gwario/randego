import {Block} from './block';
import * as BABYLON from 'babylonjs';

export class BabylonJsBlock extends Block {

  /**
   * @param dimensions the dimensions i.e. x,y,z
   * @param color the color in hex e.g. '#AABBCCD' or '#ABABAB'
   */
  constructor(dimensions: [number, number, number], color: string) {
    super(dimensions, color);
  }

  draw() {
    let a = '';
  }
}
