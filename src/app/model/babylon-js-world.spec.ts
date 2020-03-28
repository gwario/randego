import { BabylonJsWorld } from './babylon-js-world';

describe('BabylonJsWorld', () => {
  it('should create an instance', () => {
    const canvas = document.createElement('canvas');
    expect(new BabylonJsWorld([20, 20, 20], canvas)).toBeTruthy();
  });
});
