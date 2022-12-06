/* eslint-disable */
// @ts-nocheck
import {gl} from './webgl/gl.js';
import {Buffer} from './webgl/buffer.js';

export class Overlay {
  vao = gl.createVertexArray();
  vertices;

  constructor() {
    this.vertices = new Buffer(
      gl.ARRAY_BUFFER,
      gl.STATIC_DRAW,
      new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1])
    );

    gl.bindVertexArray(this.vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices.buffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 8, 0);

    gl.bindVertexArray(null);
  }

  draw() {
    gl.bindVertexArray(this.vao);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  }
}
