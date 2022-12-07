/* eslint-disable */
// @ts-nocheck
import {Shader} from './shader.js';
import {glslGlobals} from '../uniforms/uniformBlockGlobals.js';
import {ShaderStar} from './shaderStar.js';

export class ShaderBeams extends Shader {
  static VERTEX =
    glslGlobals +
    ShaderStar.SAMPLE_INTENSITY +
    `
        in vec3 vertex;
        in vec3 side;
        in float intensity;
        in float position;
        
        out vec3 iIntensity;
        
        void main() {
            float t = 1. - pow(transition, IMPLOSION_POWER) * IMPLOSION_MAGNITUDE;
        
            iIntensity = vec3(intensity, (1. - position), sampleIntensity(vertex) * .5 + .5);
            
            gl_Position = vp * vec4(side * t + vertex * mix(RADIUS_MIN * t, RADIUS_MAX * (1. + transition * IMPLOSION_BOOST), position * (1. + pow(iIntensity.z, SCALE_POWER))), 1.);
        }
        `;
  static FRAGMENT =
    glslGlobals +
    `
        out vec4 color;
        
        in vec3 iIntensity;
        
        void main() {
            color = vec4(mix(COLOR_LOW, mix(COLOR_HIGH, COLOR_HIGH_HOT, pow(transition, IMPLOSION_POWER)), pow(iIntensity.z, COLOR_POWER)), pow(2.2 * iIntensity.z * iIntensity.y * pow(iIntensity.x, INTENSITY_POWER), 1.7));
        }
        `;

  constructor() {
    super(ShaderBeams.VERTEX, ShaderBeams.FRAGMENT, [
      ['IMPLOSION_BOOST', 0.7],
      ['SCALE_POWER', 2.5],
      ['INTENSITY_POWER', 2.8],
      ['RADIUS_MIN', 0.7],
      ['RADIUS_MAX', 1.2],
      ['IMPLOSION_MAGNITUDE', ShaderStar.IMPLOSION_MAGNITUDE],
      ['IMPLOSION_POWER', ShaderStar.IMPLOSION_POWER],
      ['COLOR_POWER', ShaderStar.COLOR_POWER],
      ['COLOR_LOW', Shader.makeVec3(ShaderStar.COLOR_LOW)],
      ['COLOR_HIGH', Shader.makeVec3(ShaderStar.COLOR_HIGH)],
      ['COLOR_HIGH_HOT', Shader.makeVec3(ShaderStar.COLOR_HIGH_HOT)]
    ]);
  }
}
