/* eslint-disable */
// @ts-nocheck
import {gl} from './webgl/gl.js';
import {AttributesParticles} from './webgl/attributes/attributesParticles.js';
import {Vector3} from './math/vector3.js';
import {Random} from './math/random.js';
import {Buffer} from './webgl/buffer.js';

export class Particles {
  static SEED = 8;
  static PARTICLE_COUNT = 10000;
  static RADIUS = 3;
  static RADIUS_POWER = 1.3;
  static SIZE_MIN = 32;
  static SIZE_MAX = 80;
  static SIZE_POWER = 2;

  vao = gl.createVertexArray();
  vertices;

  constructor() {
    const random = new Random(Particles.SEED);
    const attributes = new AttributesParticles();
    const position = new Vector3();

    for (let particle = 0; particle < Particles.PARTICLE_COUNT; ++particle) {
      position
        .randomUnit(random)
        .multiply(Math.pow(random.float, Particles.RADIUS_POWER) * Particles.RADIUS);

      attributes.push(
        position,
        (Particles.SIZE_MIN =
          (Particles.SIZE_MAX - Particles.SIZE_MIN) * Math.pow(random.float, Particles.SIZE_POWER))
      );
    }

    this.vertices = new Buffer(gl.ARRAY_BUFFER, gl.STATIC_DRAW, attributes.format());

    gl.bindVertexArray(this.vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices.buffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 1, gl.FLOAT, false, 16, 12);

    gl.bindVertexArray(null);
  }

  draw() {
    gl.bindVertexArray(this.vao);

    gl.drawArrays(gl.POINTS, 0, Particles.PARTICLE_COUNT);
  }
}
