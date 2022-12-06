/* eslint-disable */
// @ts-nocheck
import {Attributes} from './attributes.js';
import {gl} from '../gl.js';

export class AttributesNebulaLayer extends Attributes {
  constructor() {
    super([gl.FLOAT, gl.FLOAT, gl.FLOAT]);
  }

  push(vertex) {
    this.array.push(vertex.x, vertex.y, vertex.z);
  }
}
