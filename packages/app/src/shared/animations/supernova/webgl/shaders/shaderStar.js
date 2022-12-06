/* eslint-disable */
// @ts-nocheck
import {Shader} from './shader.js';
import {glslGlobals, UniformBlockGlobals} from '../uniforms/uniformBlockGlobals.js';
import {glslSimplex} from './glsl/glslSimplex.js';
import {Color} from '../../math/color.js';

export class ShaderStar extends Shader {
  static IMPLOSION_MAGNITUDE = 0.999;
  static IMPLOSION_POWER = 2.05;
  static COLOR_LOW = new Color('#f5f3ec');
  static COLOR_HIGH = new Color('#de9000');
  static COLOR_HIGH_HOT = new Color('#e0d9ac');
  static COLOR_POWER = 2.5;
  static SAMPLE_INTENSITY =
    glslSimplex +
    `
        float sampleIntensity(const vec3 vertex) {
            return min(1., snoise(vec3(vertex.xy, vertex.z - (phase + phaseSpeed * time))));
        }
        `;
  static VERTEX =
    glslGlobals +
    ShaderStar.SAMPLE_INTENSITY +
    `
        in vec3 vertex;
        
        out float intensity;
        
        void main() {
            float boost = sin(3.141593 * sqrt(transition)) * BOOST_POWER;
            
            intensity = sampleIntensity(vertex);
            
            gl_Position = vp * vec4((1. + boost * BOOST_POWER) * (1. - pow(transition, IMPLOSION_POWER) * IMPLOSION_MAGNITUDE) * vertex * (intensity * PULSE_MAGNITUDE + 1.), 1.);
        }
        `;

  static FRAGMENT =
    glslGlobals +
    `
        out vec4 color;
        
        in float intensity;
        
        void main() {
            color = vec4(mix(COLOR_LOW, mix(COLOR_HIGH, COLOR_HIGH_HOT, pow(transition, IMPLOSION_POWER)), pow(.5 + .5 * intensity, COLOR_POWER)), 1.);
        }
        `;

  constructor() {
    super(ShaderStar.VERTEX, ShaderStar.FRAGMENT, [
      ['IMPLOSION_MAGNITUDE', ShaderStar.IMPLOSION_MAGNITUDE],
      ['IMPLOSION_POWER', ShaderStar.IMPLOSION_POWER],
      ['PULSE_MAGNITUDE', 0.1],
      ['BOOST_POWER', 0.5],
      ['COLOR_POWER', ShaderStar.COLOR_POWER],
      ['COLOR_LOW', Shader.makeVec3(ShaderStar.COLOR_LOW)],
      ['COLOR_HIGH', Shader.makeVec3(ShaderStar.COLOR_HIGH)],
      ['COLOR_HIGH_HOT', Shader.makeVec3(ShaderStar.COLOR_HIGH_HOT)]
    ]);

    this.use();
    this.bindUniformBlock(UniformBlockGlobals.NAME, UniformBlockGlobals.BINDING);
  }
}
