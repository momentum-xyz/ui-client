/* eslint-disable */
// @ts-nocheck
import {gl} from './webgl/gl.js';
import {AttributesSphere} from './webgl/attributes/attributesSphere.js';
import {AttributesIndices} from './webgl/attributes/attributesIndices.js';
import {Buffer} from './webgl/buffer.js';
import {Spheres} from './webgl/utils/spheres.js';

export class Star {
  vao = gl.createVertexArray();
  vertices;
  indices;
  indexCount;

  constructor() {
    const vertices = new AttributesSphere();
    const indices = new AttributesIndices();
    const sphere = Spheres.SPHERE_4;

    for (let vertex = 0, vertexCount = sphere.points.length; vertex < vertexCount; ++vertex)
      vertices.push(sphere.points[vertex]);

    for (let index = 0, indexCount = sphere.indices.length; index < indexCount; ++index)
      indices.push(sphere.indices[index]);

    this.vertices = new Buffer(gl.ARRAY_BUFFER, gl.STATIC_DRAW, vertices.format());
    this.indices = new Buffer(gl.ELEMENT_ARRAY_BUFFER, gl.STATIC_DRAW, indices.format());
    this.indexCount = indices.count;

    gl.bindVertexArray(this.vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices.buffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices.buffer);

    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 12, 0);

    gl.bindVertexArray(null);
  }

  draw() {
    gl.bindVertexArray(this.vao);
    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
  }
}
