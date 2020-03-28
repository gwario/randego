import { BabylonJsBrick } from './babylon-js-brick';

describe('BabylonJsBlock', () => {
  it('should create an instance', () => {
    expect(new BabylonJsBrick([3, 3, 3], '#aabbcc')).toBeTruthy();
  });
});
