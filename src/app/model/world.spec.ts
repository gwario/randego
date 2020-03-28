import { World } from './world';

describe('World', () => {
  it('should create an instance', () => {
    expect(new World([2, 2, 2])).toBeTruthy();
  });
});
