/* eslint-disable */
// @ts-nocheck
import {Attributes} from './attributes.js';
import {gl} from '../gl.js';

export class AttributesIndices extends Attributes {
  constructor() {
    super([gl.UNSIGNED_SHORT]);
  }

  push(index) {
    this.array.push(index);
  }
}
