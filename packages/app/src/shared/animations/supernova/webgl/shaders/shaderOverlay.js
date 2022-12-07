/* eslint-disable */
// @ts-nocheck
import {Shader} from './shader.js';
import {glslGlobals} from '../uniforms/uniformBlockGlobals.js';

export class ShaderOverlay extends Shader {
  static VERTEX =
    glslGlobals +
    `
        #define OVEREXPOSE 1.65
    
        in vec2 vertex;
        
        flat out float alpha;
        
        void main() {
            alpha = max(0., OVEREXPOSE - OVEREXPOSE * sqrt(transition * 4.));
            
            gl_Position = vec4(vertex, 0., 1.);
        }
        `;

  static FRAGMENT = `
        uniform vec3 overlayColor;
        
        out vec4 color;
        
        flat in float alpha;
        
        void main() {
            if (alpha > 1.)
                color = vec4(vec3(0.), 1.);
            else
                color = vec4(vec3(1.), alpha);
        }
        `;

  constructor() {
    super(ShaderOverlay.VERTEX, ShaderOverlay.FRAGMENT);
  }
}
