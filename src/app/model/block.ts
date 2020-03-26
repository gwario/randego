export abstract class Block {
  /**
   * Position of the block i.e. [x, y, z]
   */
  private _position: [number, number, number];
  /**
   * Dimensions of the block, i.e. [dx, dy, dz]
   */
  public readonly dimensions: [number, number, number];
  /**
   * color value in hex in the format '#[AA]RRGGBB', e.g. '#AABBCCDD' or '#BBCCDD'
   */
  color: string;
  /*
   * Connectors of a block allow other blocks to be connected to this block.
   * Each connections can references another block.
   */
  /**
   * Connectors on the top. Array of {Block#dx} times {Block#dy}.
   * Defined as (x,y,z+dz)->(x+dx,y+dy,z+dz)
   */
  connectionsTop: Block[][];
  /**
   * Connectors on the bottom. Array of {Block#dx} times {Block#dy}.
   * Defined as (x,y,z)->(x+dx,y+dy,z)
   */
  connectionsBottom: Block[][];
  // /**
  //  * Connectors on the front. Array of {Block#dx} times {Block#dz}.
  //  * Defined as (x,y+dy,z)->(x+dx,y+dy,z+dz)
  //  */
  // connectionsFront: Block[][];
  // /**
  //  * Connectors on the back. Array of {Block#dx} times {Block#dz}.
  //  * Defined as (x,y,z)->(x+dx,y,z+dz)
  //  */
  // connectionsBack: Block[][];
  // /**
  //  * Connectors on the left. Array of {Block#dy} times {Block#dz}.
  //  * Defined as (x,y,z)->(x,y+dy,z+dz)
  //  */
  // connectionsLeft: Block[][];
  // /**
  //  * Connectors on the right. Array of {Block#dy} times {Block#dz}.
  //  * Defined as (x+dx,y,z)->(x+dx,y+dy,z+dz)
  //  */
  // connectionsRight: Block[][];

  protected constructor(dimensions: [number, number, number], color: string) {
    if (dimensions.some(value => value <= 1)) {
      throw new Error(`A block must at least be 2x2x2 in order to hold bottom and top connectors!`);
    }
    this.dimensions = dimensions;
    this.color = color;
    this.connectionsTop = new Array(this.dimensions[0]).fill(null).map(() => new Array(this.dimensions[1]).fill(null));
    this.connectionsBottom = new Array(this.dimensions[0]).fill(null).map(() => new Array(this.dimensions[1]).fill(null));
    // this.connectionsFront = new Array(this.dx).fill(null).map(() => new Array(this.dz).fill(null));
    // this.connectionsBack = new Array(this.dx).fill(null).map(() => new Array(this.dz).fill(null));
    // this.connectionsLeft = new Array(this.dy).fill(null).map(() => new Array(this.dz).fill(null));
    // this.connectionsRight = new Array(this.dy).fill(null).map(() => new Array(this.dz).fill(null));
  }

  /**
   * Removes all connections of this block.
   * @param connections the connections.
   */
  private static removeConnections(connections: Block[][]) {
    for (const coord1 of Object.keys(connections)) {
      for (const coord2 of Object.keys(connections[coord1])) {
        connections[coord1][coord2] = null;
      }
    }
  }

  /**
   * Removes all connections to another block.
   * @param connections the connections.
   * @param block the other block.
   */
  private static removeConnectionsTo(connections: Block[][], block: Block) {
    for (const coord1 of Object.keys(connections)) {
      for (const coord2 of Object.keys(connections[coord1])) {
        if (connections[coord1][coord2] === block) {
          connections[coord1][coord2] = null;
        }
      }
    }
  }

  /**
   * Disconnects a single block from this block.
   */
  public disconnectBlock(block: Block) {
    Block.removeConnectionsTo(this.connectionsTop, block);
    Block.removeConnectionsTo(this.connectionsBottom, block);
  }

  /**
   * Disconnects all connected blocks from this block.
   */
  public disconnect() {
    // remove from adjacent blocks
    for (const adjacentBlock of this.adjacentBlocks()) {
      adjacentBlock.disconnectBlock(this);
    }
    // remove adjacent blocks
    Block.removeConnections(this.connectionsTop);
    Block.removeConnections(this.connectionsBottom);
    this._position = [null, null, null];
  }

  // TODO optimize by keeping track of added blocks
  private adjacentBlocks(): Set<Block> {
    const adjacentBlocks = new Set<Block>();
    this.connectionsTop.forEach((blocks) => blocks.forEach((block) => adjacentBlocks.add(block)));
    this.connectionsBottom.forEach((blocks) => blocks.forEach((block) => adjacentBlocks.add(block)));
    return adjacentBlocks;
  }

  /**
   * Returns true if the give block is connected to this block, otherwise false.
   * @param block the block
   */
  isConnectedTo(block: Block): boolean {
    return this.adjacentBlocks().has(block);
  }

  /**
   * Returns true if the give block is connected to any other blockk, otherwise false.
   */
  isConnectedToAnyBlock(): boolean {
    return this.adjacentBlocks().size > 0;
  }

  /**
   * Connects another block to this block.
   * @param block the other block
   * @param position the position of the connector
   */
  connect(block: Block, position: [number, number, number]) {
    const xDiff = Math.abs(this._position[0] - position[0]);
    const yDiff = Math.abs(this._position[1] - position[1]);
    const z = position[2];
    if (z === this._position[2]) {
      // bottom connector
      this.connectionsBottom[xDiff][yDiff] = block;
    } else if (z === this._position[2] + this.dimensions[2] - 1) {
      // top connector
      this.connectionsTop[xDiff][yDiff] = block;
    } else {
      throw new Error(`There is no connector at (${position})!`);
    }

  }

  /**
   * Returns the position of a block i.e. [x,y,z].
   */
  get position(): [number, number, number] {
    return this._position;
  }

  /**
   * Sets the position of a block i.e. [x,y,z].
   */
  set position(value: [number, number, number]) {
    this._position = value;
  }
}
