/* eslint-disable */
// @ts-nocheck
export class Vector2 {
  x;
  y;

  constructor(x = 0, y = x) {
    this.x = x;
    this.y = y;
  }

  set(vector) {
    this.x = vector.x;
    this.y = vector.y;
  }

  copy() {
    return new Vector2(this.x, this.y);
  }
}
