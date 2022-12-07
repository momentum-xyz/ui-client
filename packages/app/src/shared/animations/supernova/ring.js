/* eslint-disable */
// @ts-nocheck
import {gl} from './webgl/gl.js';
import {AttributesRing} from './webgl/attributes/attributesRing.js';
import {AttributesIndices} from './webgl/attributes/attributesIndices.js';
import {Vector2} from './math/vector2.js';
import {Buffer} from './webgl/buffer.js';

export class Ring {
  static PRECISION = 128;

  vao = gl.createVertexArray();
  vertices;
  indices;
  indexCount;

  constructor() {
    const vertices = new AttributesRing();
    const indices = new AttributesIndices();
    const vertex = new Vector2();

    for (let step = 0; step < Ring.PRECISION; ++step) {
      const angle = (Math.PI * 2 * step) / Ring.PRECISION;

      vertex.x = Math.cos(angle);
      vertex.y = Math.sin(angle);

      vertices.push(vertex);

      if (step > 0 && step < Ring.PRECISION - 1) {
        indices.push(0);
        indices.push(step);
        indices.push(step + 1);
      }
    }

    this.vertices = new Buffer(gl.ARRAY_BUFFER, gl.STATIC_DRAW, vertices.format());
    this.indices = new Buffer(gl.ELEMENT_ARRAY_BUFFER, gl.STATIC_DRAW, indices.format());
    this.indexCount = indices.count;

    gl.bindVertexArray(this.vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices.buffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices.buffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 8, 0);

    gl.bindVertexArray(null);
  }

  draw() {
    gl.bindVertexArray(this.vao);
    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
  }
}
