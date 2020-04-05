import {World} from './world';
import {Brick} from './brick';

describe('World', () => {

  // tslint:disable-next-line:variable-name
  let  sapceX_4x4x4_brickX_0;
  // tslint:disable-next-line:variable-name
  let  sapceY_4x4x4_empty;
  // tslint:disable-next-line:variable-name
  let sapceZ_8x8x8_empty;
  // tslint:disable-next-line:variable-name
  let  brickX_2x2x2_spaceX_0;
  // tslint:disable-next-line:variable-name
  let  brickY_2x2x2;

  beforeEach(() => {
    sapceY_4x4x4_empty = [
      [[null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null]],
      [[null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null]],
      [[null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null]],
      [[null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null]]
    ];
    brickX_2x2x2_spaceX_0 = new Brick( [2, 2, 2], '#111111');
    brickY_2x2x2 = new Brick( [2, 2, 2], '#111111');
    sapceX_4x4x4_brickX_0 = [
      [[brickX_2x2x2_spaceX_0, brickX_2x2x2_spaceX_0, null, null], [brickX_2x2x2_spaceX_0, brickX_2x2x2_spaceX_0, null, null],
        [null, null, null, null], [null, null, null, null]],
      [[brickX_2x2x2_spaceX_0, brickX_2x2x2_spaceX_0, null, null], [brickX_2x2x2_spaceX_0, brickX_2x2x2_spaceX_0, null, null],
        [null, null, null, null], [null, null, null, null]],
      [[null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null]],
      [[null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null]]
    ];
    sapceZ_8x8x8_empty = [
      [[null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null]],
      [[null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null]],
      [[null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null]],
      [[null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null]],
      [[null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null]],
      [[null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null]],
      [[null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null]],
      [[null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null]]
      ];
  });

  it('should create an instance', () => {
    expect(new World([2, 2, 2])).toBeTruthy();
  });

  it('.assertWithinWorldBounds should not throw at lower end of 1d world', () => {
    expect(() => World.assertWithinWorldBounds([0, 0, 0], [2, 0, 0], [4, 0, 0])).not.toThrowError();
  });
  it('.assertWithinWorldBounds should not throw at upper end of 1d world', () => {
    expect(() => World.assertWithinWorldBounds([2, 0, 0], [2, 0, 0], [4, 0, 0])).not.toThrowError();
  });
  it('.assertWithinWorldBounds should not throw in the middle of 1d world', () => {
    expect(() => World.assertWithinWorldBounds([1, 0, 0], [2, 0, 0], [4, 0, 0])).not.toThrowError();
  });

  it('.assertWithinWorldBounds should not throw at lower end of 2d world', () => {
    expect(() => World.assertWithinWorldBounds([0, 0, 0], [2, 2, 0], [4, 4, 0])).not.toThrowError();
  });
  it('.assertWithinWorldBounds should not throw at upper end of 2d world', () => {
    expect(() => World.assertWithinWorldBounds([2, 2, 0], [2, 2, 0], [4, 4, 0])).not.toThrowError();
  });
  it('.assertWithinWorldBounds should not throw in the middle of 2d world', () => {
    expect(() => World.assertWithinWorldBounds([1, 1, 0], [2, 2, 0], [4, 4, 0])).not.toThrowError();
  });

  it('.assertWithinWorldBounds should not throw at lower end of 3d world', () => {
    expect(() => World.assertWithinWorldBounds([0, 0, 0], [2, 2, 2], [4, 4, 4])).not.toThrowError();
  });
  it('.assertWithinWorldBounds should not throw at upper end of 3d world', () => {
    expect(() => World.assertWithinWorldBounds([2, 2, 2], [2, 2, 2], [4, 4, 4])).not.toThrowError();
  });
  it('.assertWithinWorldBounds should not throw in the middle of 3d world', () => {
    expect(() => World.assertWithinWorldBounds([1, 1, 1], [2, 2, 2], [4, 4, 4])).not.toThrowError();
  });

  it('.assertWithinWorldBounds should throw outside lower end of 3d world', () => {
    expect(() => World.assertWithinWorldBounds([-1, -1, -1], [2, 2, 2], [4, 4, 4])).toThrowError();
  });
  it('.assertWithinWorldBounds should throw outside upper end of 3d world', () => {
    expect(() => World.assertWithinWorldBounds([3, 3, 3], [2, 2, 2], [4, 4, 4])).toThrowError();
  });

  it('.assertBrickNotBlockedByOtherBrickInWorld should not throw in empty 3d world', () => {
    expect(() => World.assertBrickNotBlockedByOtherBrickInWorld(brickY_2x2x2,
      [1, 1, 1], sapceY_4x4x4_empty)).not.toThrowError();
  });
  it('.assertBrickNotBlockedByOtherBrickInWorld should not throw since no overlap 3d world', () => {
    expect(() => World.assertBrickNotBlockedByOtherBrickInWorld(brickY_2x2x2,
      [2, 2, 0], sapceX_4x4x4_brickX_0)).not.toThrowError();
  });
  it('.assertBrickNotBlockedByOtherBrickInWorld should throw since overlap 3d world', () => {
    expect(() => World.assertBrickNotBlockedByOtherBrickInWorld(brickY_2x2x2,
      [1, 1, 0], sapceX_4x4x4_brickX_0)).toThrowError();
  });

  it('.assertConnectableBelowOrAbove should not throw on bottom of 3d world', () => {
    expect(() => World.assertConnectableBelowOrAbove(brickY_2x2x2,
      [2, 2, 0], sapceY_4x4x4_empty)).not.toThrowError();
  });
  it('.assertConnectableBelowOrAbove should throw in the middle of 3d world', () => {
    expect(() => World.assertConnectableBelowOrAbove(brickY_2x2x2,
      [2, 2, 2], sapceY_4x4x4_empty)).toThrowError();
  });
  it('.assertConnectableBelowOrAbove should not throw if connectable below of 3d world', () => {
    const towerBrick = new Brick([2, 2, 6], '#111111');
    const setTowerForLevel = (level) => {
      sapceZ_8x8x8_empty[0][0][level] = towerBrick;
      sapceZ_8x8x8_empty[1][0][level] = towerBrick;
      sapceZ_8x8x8_empty[0][1][level] = towerBrick;
      sapceZ_8x8x8_empty[1][1][level] = towerBrick;
    };
    // for all levels according to height
    setTowerForLevel(0);
    setTowerForLevel(1);
    setTowerForLevel(2);
    setTowerForLevel(3);
    setTowerForLevel(4);
    setTowerForLevel(5);

    const planeBrick = new Brick([8, 8, 2], '#111111');
    const setPlaneForLevel = (level) => {
      sapceZ_8x8x8_empty[0][0][level] = planeBrick;
      sapceZ_8x8x8_empty[1][0][level] = planeBrick;
      sapceZ_8x8x8_empty[2][0][level] = planeBrick;
      sapceZ_8x8x8_empty[3][0][level] = planeBrick;
      sapceZ_8x8x8_empty[4][0][level] = planeBrick;
      sapceZ_8x8x8_empty[5][0][level] = planeBrick;
      sapceZ_8x8x8_empty[6][0][level] = planeBrick;
      sapceZ_8x8x8_empty[7][0][level] = planeBrick;

      sapceZ_8x8x8_empty[0][1][level] = planeBrick;
      sapceZ_8x8x8_empty[1][1][level] = planeBrick;
      sapceZ_8x8x8_empty[2][1][level] = planeBrick;
      sapceZ_8x8x8_empty[3][1][level] = planeBrick;
      sapceZ_8x8x8_empty[4][1][level] = planeBrick;
      sapceZ_8x8x8_empty[5][1][level] = planeBrick;
      sapceZ_8x8x8_empty[6][1][level] = planeBrick;
      sapceZ_8x8x8_empty[7][1][level] = planeBrick;

      sapceZ_8x8x8_empty[0][2][level] = planeBrick;
      sapceZ_8x8x8_empty[1][2][level] = planeBrick;
      sapceZ_8x8x8_empty[2][2][level] = planeBrick;
      sapceZ_8x8x8_empty[3][2][level] = planeBrick;
      sapceZ_8x8x8_empty[4][2][level] = planeBrick;
      sapceZ_8x8x8_empty[5][2][level] = planeBrick;
      sapceZ_8x8x8_empty[6][2][level] = planeBrick;
      sapceZ_8x8x8_empty[7][2][level] = planeBrick;

      sapceZ_8x8x8_empty[0][3][level] = planeBrick;
      sapceZ_8x8x8_empty[1][3][level] = planeBrick;
      sapceZ_8x8x8_empty[2][3][level] = planeBrick;
      sapceZ_8x8x8_empty[3][3][level] = planeBrick;
      sapceZ_8x8x8_empty[4][3][level] = planeBrick;
      sapceZ_8x8x8_empty[5][3][level] = planeBrick;
      sapceZ_8x8x8_empty[6][3][level] = planeBrick;
      sapceZ_8x8x8_empty[7][3][level] = planeBrick;

      sapceZ_8x8x8_empty[0][4][level] = towerBrick;
      sapceZ_8x8x8_empty[1][4][level] = towerBrick;
      sapceZ_8x8x8_empty[2][4][level] = towerBrick;
      sapceZ_8x8x8_empty[3][4][level] = towerBrick;
      sapceZ_8x8x8_empty[4][4][level] = towerBrick;
      sapceZ_8x8x8_empty[5][4][level] = towerBrick;
      sapceZ_8x8x8_empty[6][4][level] = towerBrick;
      sapceZ_8x8x8_empty[7][4][level] = towerBrick;

      sapceZ_8x8x8_empty[0][5][level] = towerBrick;
      sapceZ_8x8x8_empty[1][5][level] = towerBrick;
      sapceZ_8x8x8_empty[2][5][level] = towerBrick;
      sapceZ_8x8x8_empty[3][5][level] = towerBrick;
      sapceZ_8x8x8_empty[4][5][level] = towerBrick;
      sapceZ_8x8x8_empty[5][5][level] = towerBrick;
      sapceZ_8x8x8_empty[6][5][level] = towerBrick;
      sapceZ_8x8x8_empty[7][5][level] = towerBrick;

      sapceZ_8x8x8_empty[0][6][level] = towerBrick;
      sapceZ_8x8x8_empty[1][6][level] = towerBrick;
      sapceZ_8x8x8_empty[2][6][level] = towerBrick;
      sapceZ_8x8x8_empty[3][6][level] = towerBrick;
      sapceZ_8x8x8_empty[4][6][level] = towerBrick;
      sapceZ_8x8x8_empty[5][6][level] = towerBrick;
      sapceZ_8x8x8_empty[6][6][level] = towerBrick;
      sapceZ_8x8x8_empty[7][6][level] = towerBrick;

      sapceZ_8x8x8_empty[0][7][level] = towerBrick;
      sapceZ_8x8x8_empty[1][7][level] = towerBrick;
      sapceZ_8x8x8_empty[2][7][level] = towerBrick;
      sapceZ_8x8x8_empty[3][7][level] = towerBrick;
      sapceZ_8x8x8_empty[4][7][level] = towerBrick;
      sapceZ_8x8x8_empty[5][7][level] = towerBrick;
      sapceZ_8x8x8_empty[6][7][level] = towerBrick;
      sapceZ_8x8x8_empty[7][7][level] = towerBrick;
    };
    // for all levels according to height
    setPlaneForLevel(6);
    setPlaneForLevel(7);

    // the one that's hanging
    const hangingBrick = new Brick([2, 2, 2], '#AAAAAA');
    expect(() => World.assertConnectableBelowOrAbove(hangingBrick, [6, 6, 4], sapceZ_8x8x8_empty)).not.toThrowError();
  });

  it('.assertBrickNotConnectedToAny should not throw for new brick', () => {
    expect(() => World.assertBrickNotConnectedToAny(brickY_2x2x2)).not.toThrowError();
  });
  it('.assertBrickNotConnectedToAny should throw for existing brick', () => {
    const world = new World([4, 4, 4]);
    const anotherBrick = new Brick([2, 2, 2], '#222222');
    world.putBrick(brickY_2x2x2, [0, 0, 0]);
    world.putBrick(anotherBrick, [0, 0, 2]);
    expect(() => World.assertBrickNotConnectedToAny(brickY_2x2x2)).toThrowError();
  });

  it('.assertNoneConnectedToBrick should not throw for new brick', () => {
    expect(() => World.assertNoneConnectedToBrick(brickY_2x2x2, [brickX_2x2x2_spaceX_0])).not.toThrowError();
  });
  it('.assertNoneConnectedToBrick should throw for existing brick', () => {
    const world = new World([4, 4, 4]);
    const anotherBrick = new Brick([2, 2, 2], '#222222');
    world.putBrick(anotherBrick, [0, 0, 0]);
    world.putBrick(brickY_2x2x2, [0, 0, 2]);
    expect(() => World.assertNoneConnectedToBrick(brickY_2x2x2, [anotherBrick])).toThrowError();
  });

  it('.assertBrickNotPositioned should not throw for new brick', () => {
    expect(() => World.assertBrickNotPositioned(brickY_2x2x2)).not.toThrowError();
  });
  it('.assertBrickNotPositioned should throw for existing brick', () => {
    const world = new World([4, 4, 4]);
    const anotherBrick = new Brick([2, 2, 2], '#222222');
    world.putBrick(anotherBrick, [0, 0, 0]);
    world.putBrick(brickY_2x2x2, [0, 0, 2]);
    expect(() => World.assertBrickNotPositioned(brickY_2x2x2)).toThrowError();
  });

  it('.assertBrickNotInWorld should not throw for new brick in empty world', () => {
    expect(() => World.assertBrickNotInWorld(brickY_2x2x2, sapceY_4x4x4_empty)).not.toThrowError();
  });
  it('.assertBrickNotInWorld should not throw for new brick in non-empty world', () => {
    expect(() => World.assertBrickNotInWorld(brickY_2x2x2, sapceX_4x4x4_brickX_0)).not.toThrowError();
  });
  it('.assertBrickNotInWorld should throw for existing brick', () => {
    expect(() => World.assertBrickNotInWorld(brickX_2x2x2_spaceX_0, sapceX_4x4x4_brickX_0)).toThrowError();
  });

  it('.putBrick should not throw for hanging brick', () => {
    const world = new World([8, 8, 8]);
    // add tower
    world.putBrick(new Brick([2, 2, 6], '#111111'), [0, 0, 0]);
    // add top plate
    world.putBrick(new Brick([8, 8, 2], '#111111'), [0, 0, 6]);
    // the one that's hanging
    expect(() => world.putBrick(new Brick([2, 2, 2], '#AAAAAA'),  [6, 6, 4])).not.toThrowError();
  });
});
