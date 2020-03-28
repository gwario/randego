import { Brick } from './brick';

describe('Block', () => {
  it('should create an instance', () => {
    expect(new Brick([3, 3, 3], '#aabbcc')).toBeTruthy();
  });
});
