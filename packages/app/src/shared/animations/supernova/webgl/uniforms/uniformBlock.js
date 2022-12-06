/* eslint-disable */
// @ts-nocheck
import {gl} from '../gl.js';
import {Buffer} from '../buffer.js';

export class UniformBlock extends Buffer {
  index;
  bytes;

  constructor(size, index, usage = gl.DYNAMIC_DRAW) {
    super(gl.UNIFORM_BUFFER, usage, ((size + 0xf) >> 4) << 4);

    this.index = index;
    this.bytes = new ArrayBuffer(size);

    gl.bindBufferBase(gl.UNIFORM_BUFFER, index, this.buffer);
  }

  upload() {
    gl.bindBuffer(gl.UNIFORM_BUFFER, this.buffer);
    gl.bufferSubData(gl.UNIFORM_BUFFER, 0, this.bytes);
  }
}
