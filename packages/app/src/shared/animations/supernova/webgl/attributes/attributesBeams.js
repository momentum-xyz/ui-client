/* eslint-disable */
// @ts-nocheck
import {Attributes} from './attributes.js';
import {gl} from '../gl.js';

export class AttributesBeams extends Attributes {
  constructor() {
    super([gl.FLOAT, gl.FLOAT, gl.FLOAT, gl.FLOAT, gl.FLOAT, gl.FLOAT, gl.FLOAT, gl.FLOAT]);
  }

  push(vertex, side, intensity, position) {
    this.array.push(vertex.x, vertex.y, vertex.z, side.x, side.y, side.z, intensity, position);
  }
}
