import {Block} from './block';

export abstract class World {

  // maybe the world does not need to hold every block and position. it would be more efficient to only store the blocks and get their
  // position from them
  private readonly space: Block[][][];
  private readonly usedBlocks: Set<Block>;

  /**
   * @param dimensions the dimensions i.e. x,y,z
   */
  protected constructor(dimensions: [number, number, number]) {
    this.space = new Array(dimensions[0])
      .fill(null).map(() => new Array(dimensions[1])
        .fill(null).map(() => new Array(dimensions[2])
          .fill(null)));
    this.usedBlocks = new Set<Block>();
  }

  /**
   * Removes all references to the block.
   * @param references the references.
   * @param block the block.
   */
  private static removeReferencesTo(references: Block[][][], block: Block) {
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
   * Put a block on the bottom of the world.
   * A block can be connected to every position (within the world boundaries) at the bottom of the world.
   * @param block the block
   * @param position the position for the block, i.e. [x,y,z]
   */
  public putBlock(block: Block, position: [number, number, number]): boolean | never {
    // check if the block fits in the world
    if (position.some(value => value <= 0)) {
      throw new Error(`Block can't be placed at position (${position})!`);
    }
    if (position[0] + block.dimensions[0] > this.space.length
    || position[1] + block.dimensions[1] > this.space[0].length
    || position[2] + block.dimensions[2] > this.space[0][0].length) {
      throw new Error(`Block can't be placed at position (${position}) since it would exceed the worlds space!`);
    }

    // check if the block is connected to another block
    // other block
    for (const otherBlock of this.usedBlocks) {
      if (otherBlock.isConnectedTo(block)) {
        throw new Error(`Other block are already connected to this block. Use a completely disconnected block!`);
      }
    }
    // block
    if (block.isConnectedToAnyBlock()) {
      throw new Error(`This block is already connected to other blocks. Use a completely disconnected block!`);
    }

    // check whether the block is already in this world
    // block is already in world from the block's perspective
    if (block.position.some(value => value !== null)) {
      throw new Error(`Block has already a position (${block.position})!`);
    }
    // check whether the block would fit at the desired position and check whether the block is already in this world
    for (let xCheck = 0; xCheck < this.space.length; xCheck++) {
      for (let yCheck = 0; yCheck < this.space[xCheck].length; yCheck++) {
        for (let zCheck = 0; zCheck < this.space[xCheck][yCheck].length; zCheck++) {
          // for every position
          // block is already in world from the block's perspective
          if (this.space[xCheck][yCheck][zCheck] === block) {
            throw new Error(`Block is already in use at position (${xCheck},${yCheck},${zCheck})`);
          } else {
            // check if the block would fit at this position
            if (position[0] <=  xCheck && xCheck <= position[1] + block.dimensions[0]
            && position[1] <=  yCheck && yCheck <= position[1] + block.dimensions[1]
            && position[2] <=  zCheck && zCheck <= position[2] + block.dimensions[2]
            && this.space[xCheck][yCheck][zCheck] !== null) {
              throw new Error(`Block cannot be placed, because some space is already occupied (${[xCheck, yCheck, zCheck]})`);
            }
          }
        }
      }
    }

    // check the bottom plane and the top plane whether there are blocks which would allow or prevent to put this block there
    // right now all top and bottom planes of blocks are full of connectors
    // the bottom planes of the world is full of connectors
    // the block must have at least one block below or above
    const onBottomPlane = position[2] === 0;
    // 1. get the block above and below
    const blocksBelow = [];
    const blocksAbove = [];
    for (let x = position[0]; x <= block.dimensions[0]; x++) {
      for (let y = position[1]; y <= block.dimensions[1]; y++) {
        // check bottom plane (z-1) (the position is on the bottom plane - always fine!)
        if (!onBottomPlane) {
          const below = this.space[x][y][position[2] - 1];
          if (below !== null) {
            blocksBelow.push(below);
          }
        }
        // check top plane (z+1)
        const above = this.space[x][y][position[2] + 1];
        if (above !== null) {
          blocksAbove.push(above);
        }
      }
    }
    // 2. check if there are some (the position is on the bottom plane - always fine!)
    if (blocksAbove.length + blocksBelow.length <= 0 && !onBottomPlane) {
      throw new Error(`Block can't be put at (${position}) because there no adjacent block to connect it to!`);
    }
    // add to world and adjacent blocks
    for (let x = position[0]; x <= block.dimensions[0]; x++) {
      for (let y = position[1]; y <= block.dimensions[1]; y++) {
        for (let z = position[2]; z <= block.dimensions[2]; z++) {
          // add to world
          this.space[x][y][z] = block;
        }
      }
    }

    for (let x = position[0]; x <= block.dimensions[0]; x++) {
      for (let y = position[1]; y <= block.dimensions[1]; y++) {
        if (!onBottomPlane) {
          // bottom plane (z-1)
          const below = this.space[x][y][position[2] - 1];
          if (below !== null) {
            // add to the blocks bottom connections
            below.connect(block, [x, y, position[2] - 1]);
          }
        }
        // top plane (z+1)
        const above = this.space[x][y][position[2] + 1];
        if (above !== null) {
          // add to the blocks top connections
          above.connect(block, [x, y, position[2] - 1]);
        }
      }
    }
    this.usedBlocks.add(block);
    return true;
  }

  /**
   * Removes a block from this world.
   * @param block the block to be removed.
   */
  public disconnect(block: Block) {
    // disconnect from other blocks
    block.disconnect();
    // remove all references to the block from the world
    World.removeReferencesTo(this.space, block);
  }

  private positionOccupied(x: number, y: number, z: number) {
    return this.space[x][y][z] != null;
  }
}
