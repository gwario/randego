import {Brick} from './brick';

export abstract class World {
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

  /**
   * Put a brick on the bottom of the world.
   * A brick can be connected to every position (within the world boundaries) at the bottom of the world.
   * @param brick the brick
   * @param position the position for the brick, i.e. [x,y,z]
   */
  protected putBrick(brick: Brick, position: [number, number, number]): boolean | never {
    // check if the brick fits in the world
    if (position.some(value => value < 0)) {
      throw new Error(`Brick can't be placed at position (${position})!`);
    }
    if (position[0] + brick.dimensions[0] >= this.dimensions[0]
    || position[1] + brick.dimensions[1] >= this.dimensions[1]
    || position[2] + brick.dimensions[2] >= this.dimensions[2]) {
      throw new Error(`Brick can't be placed at position (${position}) since it would exceed the worlds space!`);
    }

    // check if the brick is connected to another brick
    // other brick
    for (const otherBrick of this.usedBricks) {
      if (otherBrick.isConnectedTo(brick)) {
        throw new Error(`Other brick are already connected to this brick. Use a completely disconnected brick!`);
      }
    }
    // brick
    if (brick.isConnectedToAnyBrick()) {
      throw new Error(`This brick is already connected to other bricks. Use a completely disconnected brick!`);
    }

    // check whether the brick is already in this world
    // brick is already in world from the brick's perspective
    if (brick.position && brick.position.some(value => value !== null)) {
      throw new Error(`Brick has already a position (${brick.position})!`);
    }

    this.isBrickPossibleAt(brick, position);
    this.placeBrickAt(brick, position);
    this.usedBricks.push(brick);
    return true;
  }

  /**
   * Returns true if the brick is allowed a the given position according to the size of the brick and adjacent bricks on the bottom and top.
   * @param brick the brick
   * @param position the position
   */
  private isBrickPossibleAt(brick: Brick, position: [number, number, number]): boolean {

    // check whether the brick would fit at the desired position and check whether the brick is already in this world
    for (let xCheck = 0; xCheck < this.space.length; xCheck++) {
      for (let yCheck = 0; yCheck < this.space[xCheck].length; yCheck++) {
        for (let zCheck = 0; zCheck < this.space[xCheck][yCheck].length; zCheck++) {
          // for every position
          // brick is already in world from the brick's perspective
          if (this.space[xCheck][yCheck][zCheck] === brick) {
            throw new Error(`Brick is already in use at position (${xCheck},${yCheck},${zCheck})`);
          } else {
            // check if the brick would fit at this position
            if (position[0] <=  xCheck && xCheck <= position[1] + brick.dimensions[0]
              && position[1] <=  yCheck && yCheck <= position[1] + brick.dimensions[1]
              && position[2] <=  zCheck && zCheck <= position[2] + brick.dimensions[2]
              && this.space[xCheck][yCheck][zCheck] !== null) {
              throw new Error(`Brick cannot be placed, because some space is already occupied (${[xCheck, yCheck, zCheck]})`);
            }
          }
        }
      }
    }

    // check the bottom plane and the top plane whether there are bricks which would allow or prevent to put this brick there
    // right now all top and bottom planes of bricks are full of connectors
    // the bottom planes of the world is full of connectors
    // the brick must have at least one brick below or above
    const onBottomPlane = position[2] === 0;
    // 1. get the brick above and below
    const bricksBelow = [];
    const bricksAbove = [];
    for (let x = position[0]; x <= brick.dimensions[0]; x++) {
      for (let y = position[1]; y <= brick.dimensions[1]; y++) {
        // check bottom plane (z-1) (the position is on the bottom plane - always fine!)
        if (!onBottomPlane) {
          const below = this.space[x][y][position[2] - 1];
          if (below !== null) {
            bricksBelow.push(below);
          }
        }
        // check top plane (z+1)
        const above = this.space[x][y][position[2] + 1];
        if (above !== null) {
          bricksAbove.push(above);
        }
      }
    }
    // 2. check if there are some (the position is on the bottom plane - always fine!)
    if (bricksAbove.length + bricksBelow.length <= 0 && !onBottomPlane) {
      throw new Error(`Brick can't be put at (${position}) because there no adjacent brick to connect it to!`);
    }
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

  get dimensions(): [number, number, number] {
    return this._dimensions;
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
            this.isBrickPossibleAt(brick, [x, y, z]);
            possiblePositions.push([x, y, z]);
          } catch (e) {
            // continue;
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

    // add to world and adjacent bricks
    for (let x = position[0]; x <= brick.dimensions[0]; x++) {
      for (let y = position[1]; y <= brick.dimensions[1]; y++) {
        for (let z = position[2]; z <= brick.dimensions[2]; z++) {
          // add to world
          this.space[x][y][z] = brick;
        }
      }
    }

    const onBottomPlane = position[2] === 0;
    for (let x = position[0]; x <= brick.dimensions[0]; x++) {
      for (let y = position[1]; y <= brick.dimensions[1]; y++) {
        if (!onBottomPlane) {
          // bottom plane (z-1)
          const below = this.space[x][y][position[2] - 1];
          if (below !== null) {
            // add to the bricks bottom connections
            below.connect(brick, [x, y, position[2] - 1]);
          }
        }
        // top plane (z+1)
        const above = this.space[x][y][position[2] + 1];
        if (above !== null) {
          // add to the bricks top connections
          above.connect(brick, [x, y, position[2] - 1]);
        }
      }
    }
  }
}
