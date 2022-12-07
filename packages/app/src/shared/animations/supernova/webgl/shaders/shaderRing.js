/* eslint-disable */
// @ts-nocheck
import {Shader} from './shader.js';
import {glslGlobals} from '../uniforms/uniformBlockGlobals.js';
import {Color} from '../../math/color.js';

export class ShaderRing extends Shader {
  static VERTEX =
    glslGlobals +
    `
        in vec2 vertex;
        
        out vec2 iVertex;
        
        void main() {
            float radius = transition * 20.;
            
            iVertex = vertex;
            
            gl_Position = vp * vec4(vertex.x * radius, 0., vertex.y * radius, 1.);
        }
        `;

  static FRAGMENT =
    glslGlobals +
    `
        out vec4 color;
        
        in vec2 iVertex;
        
        void main() {
            float distance = length(iVertex);
            float alpha = ALPHA * (.5 - .5 * cos(pow(distance, RING_POWER) * 6.2831853)) * max(0., 1. - transition * 2.);
            
            color = vec4(COLOR, alpha);
        }
        `;

  constructor() {
    super(ShaderRing.VERTEX, ShaderRing.FRAGMENT, [
      ['ALPHA', 0.7],
      ['RING_POWER', 4.2],
      ['COLOR', Shader.makeVec3(new Color('#f3e4ff'))]
    ]);
  }
}
