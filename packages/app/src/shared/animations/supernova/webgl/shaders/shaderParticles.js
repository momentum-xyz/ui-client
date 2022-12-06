/* eslint-disable */
// @ts-nocheck
import {Shader} from './shader.js';
import {glslGlobals} from '../uniforms/uniformBlockGlobals.js';
import {Color} from '../../math/color.js';
import {glslSimplex} from './glsl/glslSimplex.js';

export class ShaderParticles extends Shader {
  static VERTEX =
    glslGlobals +
    glslSimplex +
    `
        #define SPARKLE_SPEED .4
        
        in vec3 vertex;
        in float radius;
        
        out vec3 iColor;
        
        void main() {
            float pulse = snoise(vertex * 13. + normalize(vertex) * (phase + phaseSpeed * time) * SPARKLE_SPEED);
        
            iColor = mix(mix(COLOR_CENTER, COLOR_EDGE, .5 + .5 * snoise(vertex * 3.)), COLOR_BRIGHT, .5 + .5 * pulse);
            
            gl_Position = vp * vec4(vertex * pow(transition, POWER), 1.);
            
            gl_PointSize = (1. + pulse) * radius / gl_Position.w;
        }
        `;

  static FRAGMENT = `
        out vec4 color;
        
        in vec3 iColor;
        
        void main() {
            vec2 delta = gl_PointCoord - .5;
            float distance = length(delta * 2.);
            float angle = atan(delta.y / delta.x);
            float m = distance * (sin(angle * float(4)) * .5 + .5);
            
            color = vec4(iColor, pow(1. - distance, 2.5) * ALPHA - m);
        }
        `;

  constructor() {
    super(ShaderParticles.VERTEX, ShaderParticles.FRAGMENT, [
      ['ALPHA', 0.7],
      ['POWER', 0.15],
      ['COLOR_CENTER', Shader.makeVec3(new Color('#3367ff'))],
      ['COLOR_EDGE', Shader.makeVec3(new Color('#a300ff'))],
      ['COLOR_BRIGHT', Shader.makeVec3(new Color('#ffffff'))]
    ]);
  }
}
