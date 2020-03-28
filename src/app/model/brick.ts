export abstract class Brick {
  /**
   * Position of the brick i.e. [x, y, z]
   */
    // tslint:disable-next-line:variable-name
  private _position: [number, number, number];
  /**
   * Dimensions of the brick, i.e. [dx, dy, dz]
   */
  public readonly dimensions: [number, number, number];
  /**
   * color value in hex in the format '#[AA]RRGGBB', e.g. '#AABBCCDD' or '#BBCCDD'
   */
  color: string;
  /*
   * Connectors of a brick allow other bricks to be connected to this brick.
   * Each connections can references another brick.
   */
  /**
   * Connectors on the top. Array of {Brick#dx} times {Brick#dy}.
   * Defined as (x,y,z+dz)->(x+dx,y+dy,z+dz)
   */
  connectionsTop: Brick[][];
  /**
   * Connectors on the bottom. Array of {Brick#dx} times {Brick#dy}.
   * Defined as (x,y,z)->(x+dx,y+dy,z)
   */
  connectionsBottom: Brick[][];
  // /**
  //  * Connectors on the front. Array of {Brick#dx} times {Brick#dz}.
  //  * Defined as (x,y+dy,z)->(x+dx,y+dy,z+dz)
  //  */
  // connectionsFront: Brick[][];
  // /**
  //  * Connectors on the back. Array of {Brick#dx} times {Brick#dz}.
  //  * Defined as (x,y,z)->(x+dx,y,z+dz)
  //  */
  // connectionsBack: Brick[][];
  // /**
  //  * Connectors on the left. Array of {Brick#dy} times {Brick#dz}.
  //  * Defined as (x,y,z)->(x,y+dy,z+dz)
  //  */
  // connectionsLeft: Brick[][];
  // /**
  //  * Connectors on the right. Array of {Brick#dy} times {Brick#dz}.
  //  * Defined as (x+dx,y,z)->(x+dx,y+dy,z+dz)
  //  */
  // connectionsRight: Brick[][];

  protected constructor(dimensions: [number, number, number], color: string) {
    if (dimensions.some(value => value <= 1)) {
      throw new Error(`A brick must at least be 2x2x2 in order to hold bottom and top connectors!`);
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
   * Removes all connections of this brick.
   * @param connections the connections.
   */
  private static removeConnections(connections: Brick[][]) {
    for (const coord1 of Object.keys(connections)) {
      for (const coord2 of Object.keys(connections[coord1])) {
        connections[coord1][coord2] = null;
      }
    }
  }

  /**
   * Removes all connections to another brick.
   * @param connections the connections.
   * @param brick the other brick.
   */
  private static removeConnectionsTo(connections: Brick[][], brick: Brick) {
    for (const coord1 of Object.keys(connections)) {
      for (const coord2 of Object.keys(connections[coord1])) {
        if (connections[coord1][coord2] === brick) {
          connections[coord1][coord2] = null;
        }
      }
    }
  }

  /**
   * Disconnects a single brick from this brick.
   */
  public disconnectBrick(brick: Brick) {
    Brick.removeConnectionsTo(this.connectionsTop, brick);
    Brick.removeConnectionsTo(this.connectionsBottom, brick);
  }

  /**
   * Disconnects all connected bricks from this brick.
   */
  public disconnect() {
    // remove from adjacent bricks
    for (const adjacentBrick of this.adjacentBricks()) {
      adjacentBrick.disconnectBrick(this);
    }
    // remove adjacent bricks
    Brick.removeConnections(this.connectionsTop);
    Brick.removeConnections(this.connectionsBottom);
    this._position = [null, null, null];
  }

  // TODO optimize by keeping track of added bricks
  private adjacentBricks(): Set<Brick> {
    const adjacentBricks = new Set<Brick>();
    this.connectionsTop.forEach((bricks) => bricks.forEach((brick) => brick && adjacentBricks.add(brick)));
    this.connectionsBottom.forEach((bricks) => bricks.forEach((brick) => brick && adjacentBricks.add(brick)));
    return adjacentBricks;
  }

  /**
   * Returns true if the give brick is connected to this brick, otherwise false.
   * @param brick the brick
   */
  public isConnectedTo(brick: Brick): boolean {
    return this.adjacentBricks().has(brick);
  }

  /**
   * Returns true if the give brick is connected to any other brick, otherwise false.
   */
  public isConnectedToAnyBrick(): boolean {
    window.console.debug(this.adjacentBricks());
    return this.adjacentBricks().size > 0;
  }

  /**
   * Connects another brick to this brick.
   * @param brick the other brick
   * @param position the position of the connector
   */
  public connect(brick: Brick, position: [number, number, number]) {
    const xDiff = Math.abs(this._position[0] - position[0]);
    const yDiff = Math.abs(this._position[1] - position[1]);
    const z = position[2];
    if (z === this._position[2]) {
      // bottom connector
      this.connectionsBottom[xDiff][yDiff] = brick;
    } else if (z === this._position[2] + this.dimensions[2] - 1) {
      // top connector
      this.connectionsTop[xDiff][yDiff] = brick;
    } else {
      throw new Error(`There is no connector at (${position})!`);
    }

  }

  /**
   * Returns the position of a brick i.e. [x,y,z].
   */
  get position(): [number, number, number] {
    return this._position;
  }

  /**
   * Sets the position of a brick i.e. [x,y,z].
   */
  set position(value: [number, number, number]) {
    this._position = value;
  }
}
