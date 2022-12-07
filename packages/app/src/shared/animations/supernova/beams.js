/* eslint-disable */
// @ts-nocheck
import {AttributesBeams} from './webgl/attributes/attributesBeams.js';
import {AttributesIndices} from './webgl/attributes/attributesIndices.js';
import {Random} from './math/random.js';
import {Vector3} from './math/vector3.js';
import {Buffer} from './webgl/buffer.js';
import {gl} from './webgl/gl.js';

export class Beams {
  static SEED = 42;
  static BEAM_COUNT = 300;
  static TANGENT = new Vector3(0, 0, 1);
  static RADIUS = 0.3;

  vao = gl.createVertexArray();
  vertices;
  indices;
  indexCount;

  constructor() {
    const random = new Random(Beams.SEED);
    const vertices = new AttributesBeams();
    const indices = new AttributesIndices();
    const vertex = new Vector3();
    const side = new Vector3();

    for (let beam = 0; beam < Beams.BEAM_COUNT; ++beam) {
      const direction = new Vector3().randomUnit(random);
      const tangent = new Vector3().cross(Beams.TANGENT, direction).normalize();
      const radius = Beams.RADIUS * (1 + random.float);

      vertex.set(direction);
      side.set(tangent).multiply(radius);

      vertices.push(vertex, side, 0, 0);
      vertices.push(vertex, side, 0, 1);

      side.zero();

      vertices.push(vertex, side, 1, 0);
      vertices.push(vertex, side, 1, 1);

      side.set(tangent).multiply(-radius);

      vertices.push(vertex, side, 0, 0);
      vertices.push(vertex, side, 0, 1);

      indices.push(beam * 6);
      indices.push(beam * 6 + 3);
      indices.push(beam * 6 + 1);
      indices.push(beam * 6);
      indices.push(beam * 6 + 2);
      indices.push(beam * 6 + 3);

      indices.push(beam * 6 + 2);
      indices.push(beam * 6 + 5);
      indices.push(beam * 6 + 3);
      indices.push(beam * 6 + 2);
      indices.push(beam * 6 + 4);
      indices.push(beam * 6 + 5);
    }

    this.vertices = new Buffer(gl.ARRAY_BUFFER, gl.STATIC_DRAW, vertices.format());
    this.indices = new Buffer(gl.ELEMENT_ARRAY_BUFFER, gl.STATIC_DRAW, indices.format());
    this.indexCount = indices.count;

    gl.bindVertexArray(this.vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices.buffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices.buffer);

    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 32, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 32, 12);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 1, gl.FLOAT, false, 32, 24);
    gl.enableVertexAttribArray(3);
    gl.vertexAttribPointer(3, 1, gl.FLOAT, false, 32, 28);

    gl.bindVertexArray(null);
  }

  draw() {
    gl.bindVertexArray(this.vao);
    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
  }
}
