export abstract class Brick {
  /**
   * Position of the brick i.e. [x, y, z]
   */
    // tslint:disable-next-line:variable-name
  protected _position: [number, number, number];
  /**
   * Dimensions of the brick, i.e. [dx, dy, dz]
   */
    // tslint:disable-next-line:variable-name
  private readonly _dimensions: [number, number, number];
  /**
   * color value in hex in the format '#[AA]RRGGBB', e.g. '#AABBCCDD' or '#BBCCDD'
   */
    // tslint:disable-next-line:variable-name
  private readonly _color: string;
  /*
   * Connectors of a brick allow other bricks to be connected to this brick.
   * Each connections can references another brick.
   */
  /**
   * Connectors on the top. Array of {Brick#dx} times {Brick#dy}.
   * Defined as (x,y,z+dz)->(x+dx,y+dy,z+dz)
   */
    // tslint:disable-next-line:variable-name
  private readonly _connectionsTop: Brick[][];
  /**
   * Connectors on the bottom. Array of {Brick#dx} times {Brick#dy}.
   * Defined as (x,y,z)->(x+dx,y+dy,z)
   */
    // tslint:disable-next-line:variable-name
  private readonly _connectionsBottom: Brick[][];
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

  protected constructor(dimensions: [number, number, number], color: string,
                        position?: [number, number, number], connectionsTop?: Brick[][], connectionsBottom?: Brick[][]) {
    if (dimensions.some(value => value <= 1)) {
      throw new Error(`A brick must at least be 2x2x2 in order to hold bottom and top connectors!`);
    }
    this._dimensions = dimensions;
    this._color = color;
    this._position = position
      || null;
    this._connectionsTop = connectionsTop
      || new Array(this._dimensions[0]).fill(null).map(() => new Array(this._dimensions[1]).fill(null));
    this._connectionsBottom = connectionsBottom
      || new Array(this._dimensions[0]).fill(null).map(() => new Array(this._dimensions[1]).fill(null));
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
    Brick.removeConnectionsTo(this._connectionsTop, brick);
    Brick.removeConnectionsTo(this._connectionsBottom, brick);
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
    Brick.removeConnections(this._connectionsTop);
    Brick.removeConnections(this._connectionsBottom);
    this._position = [null, null, null];
  }

  // TODO optimize by keeping track of added bricks
  private adjacentBricks(): Set<Brick> {
    const adjacentBricks = new Set<Brick>();
    this._connectionsTop.forEach((bricks) => bricks.forEach((brick) => brick && adjacentBricks.add(brick)));
    this._connectionsBottom.forEach((bricks) => bricks.forEach((brick) => brick && adjacentBricks.add(brick)));
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
      this._connectionsBottom[xDiff][yDiff] = brick;
    } else if (z === this._position[2] + this._dimensions[2] - 1) {
      // top connector
      this._connectionsTop[xDiff][yDiff] = brick;
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
  get color(): string {
    return this._color;
  }
  get connectionsTop(): Brick[][] {
    return this._connectionsTop;
  }
  get connectionsBottom(): Brick[][] {
    return this._connectionsBottom;
  }
  get dimensions(): [number, number, number] {
    return this._dimensions;
  }
}
