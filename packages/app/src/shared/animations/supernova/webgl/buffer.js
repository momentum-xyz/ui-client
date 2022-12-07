/* eslint-disable */
// @ts-nocheck
import {gl} from './gl.js';

export class Buffer {
  static #INITIAL_CAPACITY = 0x40000;

  type;
  usage;
  buffer = gl.createBuffer();
  capacity;

  constructor(type, usage = gl.STATIC_DRAW, initial = Buffer.#INITIAL_CAPACITY) {
    this.usage = usage;

    this.type = type;

    gl.bindBuffer(type, this.buffer);

    if (typeof initial === 'number') gl.bufferData(type, (this.capacity = initial), usage);
    else gl.bufferData(type, initial, usage);
  }

  doublesUntil(capacity) {
    let doubles = 1;

    while (this.capacity << doubles < capacity) ++doubles;

    return doubles;
  }

  doubleDestructive(doubleCount = 1) {
    gl.bindBuffer(this.type, this.buffer);
    gl.bufferData(this.type, (this.capacity <<= doubleCount), this.usage);
  }

  free() {
    gl.deleteBuffer(this.buffer);
  }
}
