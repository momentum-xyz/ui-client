/* eslint-disable */
// @ts-nocheck
import {Attributes} from './attributes.js';
import {gl} from '../gl.js';

export class AttributesRing extends Attributes {
  constructor() {
    super([gl.FLOAT, gl.FLOAT]);
  }

  push(position) {
    this.array.push(position.x, position.y);
  }
}
