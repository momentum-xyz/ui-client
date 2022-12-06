/* eslint-disable */
// @ts-nocheck
import {Shader} from './shader.js';
import {glslGlobals, UniformBlockGlobals} from '../uniforms/uniformBlockGlobals.js';
import {gl} from '../gl.js';

export class ShaderGradient extends Shader {
  static VERTEX = `
        in vec2 vertex;
        
        out vec2 iVertex;
        
        void main() {
            iVertex = vertex;
            
            gl_Position = vec4(vertex, 0., 1.);
        }
        `;

  static FRAGMENT =
    glslGlobals +
    `
        uniform vec3 a;
        uniform vec3 b;
        
        in vec2 iVertex;
        
        out vec4 color;
        
        void main() {
            color = vec4(mix(a, b, (1. - transition) * min(1., length(iVertex * vec2(1., 1. / aspect)))), 1.);
        }
        `;

  uniformA;
  uniformB;

  constructor() {
    super(ShaderGradient.VERTEX, ShaderGradient.FRAGMENT);

    this.use();
    this.bindUniformBlock(UniformBlockGlobals.NAME, UniformBlockGlobals.BINDING);

    this.uniformA = this.uniformLocation('a');
    this.uniformB = this.uniformLocation('b');
  }

  setColors(a, b) {
    this.use();

    gl.uniform3f(this.uniformA, a.r, a.g, a.b);
    gl.uniform3f(this.uniformB, b.r, b.g, b.b);
  }
}
