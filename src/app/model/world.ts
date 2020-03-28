import {Brick} from './brick';
import * as assert from 'assert';

export abstract class World {

  /**
   * @param dimensions the dimensions i.e. x,y,z
   */
  protected constructor(dimensions: [number, number, number]) {
    this._dimensions = dimensions;
    this.space = new Array(this._dimensions[0])
      .fill(null).map(() => new Array(this._dimensions[1])
        .fill(null).map(() => new Array(this._dimensions[2])
          .fill(null)));
    this.usedBricks = new Array<Brick>();
  }

  get dimensions(): [number, number, number] {
    return this._dimensions;
  }
  /**
   * The length, width and height of the world.
   */
    // tslint:disable-next-line:variable-name
  private readonly _dimensions: [number, number, number];

  // maybe the world does not need to hold every block and position. it would be more efficient to only store the blocks and get their
  // position from them
  private readonly space: Brick[][][];
  private readonly usedBricks: Array<Brick>;

  /**
   * Removes all references to the block.
   * @param references the references.
   * @param block the block.
   */
  private static removeReferencesTo(references: Brick[][][], block: Brick) {
    for (const coord1 of Object.keys(references)) {
      for (const coord2 of Object.keys(references[coord1])) {
        for (const coord3 of Object.keys(references[coord1][coord2])) {
          if (references[coord1][coord2][coord3] === block) {
            references[coord1][coord2][coord3] = null;
          }
        }
      }
    }
  }

  private static assertPositionValid(position: [number, number, number]) {
    assert(position.every(dim => dim >= 0), `Brick can't be placed at position (${position})!`);
  }

  private static assertWithinWorldBounds(objectPosition: [number, number, number], objectDimensions: [number, number, number],
                                         worldDimensions: [number, number, number]) {
    assert(objectPosition[0] + objectDimensions[0] <= worldDimensions[0]
      && objectPosition[1] + objectDimensions[1] <= worldDimensions[1]
      && objectPosition[2] + objectDimensions[2] <= worldDimensions[2],
      `Brick can't be placed at position (${objectPosition}) since it would exceed the worlds space!`);
  }

  private static assertBrickNotConnectedToAny(brick: Brick) {
    assert(!brick.isConnectedToAnyBrick(),
      `Brick is already connected to other bricks. Use a completely disconnected brick!`);
  }

  private static assertNoneConnectedToBrick(brick: Brick, otherBricks: Array<Brick>) {
    assert(otherBricks.every(otherBrick => !otherBrick.isConnectedTo(brick)),
      `Other bricks are already connected to this brick. Use a completely disconnected brick!`);
  }

  private static assertBrickNotPositioned(brick: Brick) {
    assert(brick.position === null || brick.position.every(dim => dim === null), `Brick has already a position (${brick.position})!`);
  }

  private static assertBrickNotInWorld(brick: Brick, space: Brick[][][]) {
    assert(space.every(x => x.every(y => y.every(z => z !== brick))),
      `Brick is already referenced!`);
  }

  private static assertBrickFits(brick: Brick, position: [number, number, number], space: Brick[][][]) {
    // check whether the brick would fit at the desired position and check whether the brick is already in this world
    for (let x = 0; x < space.length; x++) {
      for (let y = 0; y < space[x].length; y++) {
        for (let z = 0; z < space[x][y].length; z++) {
          // for every position
          // check if the brick would fit at this position
          if (position[0] <= x && x < position[0] + brick.dimensions[0]
            && position[1] <= y && y < position[1] + brick.dimensions[1]
            && position[2] <= z && z < position[2] + brick.dimensions[2]) {
            assert(space[x][y][z] === null, `Brick cannot be placed, because some space is already occupied (${[x, y, z]})`);
          }
        }
      }
    }
  }

  private static assertConnectableBelowOrAbove(brick: Brick, position: [number, number, number], space: Brick[][][]) {
    // check the bottom plane and the top plane whether there are bricks which would allow or prevent to put this brick there
    // right now all top and bottom planes of bricks are full of connectors
    // the bottom planes of the world is full of connectors
    // the brick must have at least one brick below or above
    const onBottomPlane = position[2] === 0;
    // 1. get the brick above and below
    const bricksBelow = [];
    const bricksAbove = [];
    for (let x = position[0]; x < brick.dimensions[0]; x++) {
      for (let y = position[1]; y < brick.dimensions[1]; y++) {
        // check bottom plane (z-1) (the position is on the bottom plane - always fine!)
        if (!onBottomPlane) {
          const brickBelow = space[x][y][position[2] - 1];
          if (brickBelow !== null) {
            bricksBelow.push(brickBelow);
          }
        }
        // check top plane (z+1)
        const brickAbove = space[x][y][position[2] + brick.dimensions[2]];
        if (brickAbove !== null) {
          bricksAbove.push(brickAbove);
        }
      }
    }
    // 2. check if there are some (the position is on the bottom plane - always fine!)
    assert(bricksAbove.length + bricksBelow.length > 0 || onBottomPlane,
      `Not enough bricks to connect to below and above!`);
  }

  /**
   * Put a brick on the bottom of the world.
   * A brick can be connected to every position (within the world boundaries) at the bottom of the world.
   * @param brick the brick
   * @param position the position for the brick, i.e. [x,y,z]
   */
  protected putBrick(brick: Brick, position: [number, number, number]): boolean | never {
    // check if the brick fits in the world
    World.assertPositionValid(position);
    World.assertWithinWorldBounds(position, brick.dimensions, this._dimensions);

    World.assertBrickNotPositioned(brick);
    World.assertBrickNotConnectedToAny(brick);
    World.assertNoneConnectedToBrick(brick, this.usedBricks);

    World.assertBrickNotInWorld(brick, this.space);

    World.assertBrickFits(brick, position, this.space);
    World.assertConnectableBelowOrAbove(brick, position, this.space);

    this.placeBrickAt(brick, position);
    this.usedBricks.push(brick);
    // window.console.debug(`Put brick result:`, brick);
    return true;
  }

  /**
   * Removes a brick from this world.
   * @param brick the brick to be removed.
   */
  protected remove(brick: Brick) {
    // disconnect from other bricks
    brick.disconnect();
    // remove all references to the brick from the world
    World.removeReferencesTo(this.space, brick);
    const index = this.usedBricks.indexOf(brick);
    this.usedBricks.splice(index, 1);
  }

  /**
   * Returns a list of possible positions for this brick.
   * @param brick the brick
   */
  protected possiblePositionsFor(brick: Brick): Array<[number, number, number]> {
    const possiblePositions = [];
    // check every position starting from the bottom plane.
    for (let z = 0; z < this.dimensions[2]; z++) {
      for (let x = 0; x < this.dimensions[0]; x++) {
        for (let y = 0; y < this.dimensions[1]; y++) {
          try {
            World.assertWithinWorldBounds([x, y, z], brick.dimensions, this._dimensions);
            World.assertBrickFits(brick, [x, y, z], this.space);
            World.assertConnectableBelowOrAbove(brick, [x, y, z], this.space);
            // window.console.debug(`Possible position ${[x, y, z]}`);
            possiblePositions.push([x, y, z]);
          } catch (e) {
            // window.console.debug(`Impossible position ${[x, y, z]}`, e);
          }
        }
      }
    }
    return possiblePositions;
  }

  /**
   * Connects the brick at position to the world and/or its adjacent bricks.
   * @param brick the brick
   * @param position the position
   */
  private placeBrickAt(brick: Brick, position: [number, number, number]) {
    // set position in world
    brick.position = position;
    window.console.debug(`World.placeBrickAt: ${brick.position}`);

    const onBottomPlane = position[2] === 0;
    // add to world and adjacent bricks
    for (let x = position[0]; x < brick.dimensions[0]; x++) {
      for (let y = position[1]; y < brick.dimensions[1]; y++) {

        if (!onBottomPlane) {
          // bottom plane (z-1)
          const brickBelow = this.space[x][y][position[2] - 1];
          if (brickBelow !== null) {
            // add to the bricks bottom connections
            brickBelow.connect(brick, [x, y, position[2] - 1]);
          }
        }
        // top plane (z+1)
        const brickAbove = this.space[x][y][position[2] + brick.dimensions[2]];
        if (brickAbove !== null) {
          // add to the bricks top connections
          brickAbove.connect(brick, [x, y, position[2] + brick.dimensions[2]]);
        }

        for (let z = position[2]; z < brick.dimensions[2]; z++) {
          // add to world
          this.space[x][y][z] = brick;
        }
      }
    }
  }
}
